import React, { useState, useEffect } from "react";
import { db, storage } from "./firebase";
import { ref, set, onValue } from "firebase/database";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import Styles from "./Styles";

export default function Profile({ onBack, onProfileUpdate }) {
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    phone: "",
    photoURL: ""
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false); // Жаңы state
  const [showError, setShowError] = useState(false); // Жаңы state
  const [errorMessage, setErrorMessage] = useState(""); // Жаңы state

  // Колдонуучунун ID'sин алуу
  const [userId] = useState(() => {
    return localStorage.getItem('currentUserId') || 'current_user';
  });

  useEffect(() => {
    const userRef = ref(db, "users/" + userId);
    
    const unsubscribe = onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const updatedUserData = {
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          middleName: data.middleName || "",
          phone: data.phone || "",
          photoURL: data.photoURL || ""
        };
        
        setUserData(updatedUserData);
        
        if (data.photoURL) {
          setPreviewURL(data.photoURL);
          // Ата-эне компонентке фотону жиберүү
          if (onProfileUpdate) {
            onProfileUpdate(data.photoURL);
          }
          // localStorage'ко да сактоо
          localStorage.setItem('userProfilePhoto', data.photoURL);
        }
      }
    });

    return () => unsubscribe();
  }, [userId, onProfileUpdate]);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showErrorModal("Размер файла не должен превышать 5MB!");
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        showErrorModal("Пожалуйста, выберите файл изображения!");
        return;
      }
      
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewURL(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const showErrorModal = (message) => {
    setErrorMessage(message);
    setShowError(true);
    setTimeout(() => {
      setShowError(false);
    }, 3000);
  };

  const showSuccessModal = () => {
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      // Успешный модалды жапкандан кийин артка кайтуу
      if (onBack) {
        onBack();
      }
    }, 1500);
  };

  const handleRemovePhoto = () => {
    setSelectedFile(null);
    setPreviewURL("");
    setUserData({...userData, photoURL: ""});
    
    // Ата-эне компонентке фото өчүрүлгөндүгүн билдирүү
    if (onProfileUpdate) {
      onProfileUpdate("");
    }
    localStorage.removeItem('userProfilePhoto');
  };

  const uploadPhoto = async () => {
    if (!selectedFile) return userData.photoURL;
    
    const fileRef = storageRef(storage, `profilePhotos/${userId}/${Date.now()}_${selectedFile.name}`);
    await uploadBytes(fileRef, selectedFile);
    const downloadURL = await getDownloadURL(fileRef);
    return downloadURL;
  };

  const handleSave = async () => {
    if (!userData.lastName.trim() || !userData.firstName.trim()) {
      showErrorModal("Поля 'Фамилия' и 'Имя' обязательны для заполнения!");
      return;
    }

    if (!userData.phone.trim()) {
      showErrorModal("Поле 'Номер телефона' обязательно для заполнения!");
      return;
    }

    setIsSaving(true);

    try {
      let photoURL = userData.photoURL;
      if (selectedFile) {
        photoURL = await uploadPhoto();
      } else if (previewURL === "" && userData.photoURL) {
        photoURL = "";
      }

      const updatedData = {
        ...userData,
        photoURL,
        lastUpdated: Date.now()
      };

      await set(ref(db, "users/" + userId), updatedData);
      
      // Профиль сакталгандан кийин ата-эне компонентке фотону жиберүү
      if (onProfileUpdate && photoURL) {
        onProfileUpdate(photoURL);
        localStorage.setItem('userProfilePhoto', photoURL);
      }
      
      // Успешный модалды көрсөтүү
      showSuccessModal();
      
      // Сактагандан кийин тандалган файлды тазалоо
      setSelectedFile(null);
      
    } catch (error) {
      console.error("Ошибка при сохранении:", error);
      showErrorModal("Ошибка при сохранении: " + error.message);
      setIsSaving(false);
    }
  };

  const isFormValid = () => {
    return (
      userData.lastName.trim() !== "" &&
      userData.firstName.trim() !== "" &&
      userData.phone.trim() !== ""
    );
  };

  return (
    <div style={Styles.mainPage}>
      <div style={Styles.mainMenuWrap}>
        <button style={Styles.backButton} onClick={onBack}>← Назад</button>
        <h2 style={Styles.title}>Профиль</h2>
        
        {/* Успешный модал */}
        {showSuccess && (
          <div style={styles.successModal}>
            <div style={styles.successContent}>
              <div style={styles.successIcon}>✓</div>
              <p style={styles.successText}>Профиль успешно сохранен!</p>
            </div>
          </div>
        )}
        
        {/* Ошибка модалы */}
        {showError && (
          <div style={styles.errorModal}>
            <div style={styles.errorContent}>
              <div style={styles.errorIcon}>✗</div>
              <p style={styles.errorText}>{errorMessage}</p>
            </div>
          </div>
        )}
        
        <div style={styles.photoSection}>
          <div style={styles.photoContainer}>
            <div style={styles.photoCircle}>
              {previewURL ? (
                <img 
                  src={previewURL} 
                  alt="Фото профиля" 
                  style={styles.profileImage}
                />
              ) : (
                <div style={styles.defaultAvatar}>
                  <span style={styles.avatarText}>
                    {userData.firstName?.[0]}{userData.lastName?.[0]}
                  </span>
                </div>
              )}
            </div>
            
            <div style={styles.photoControls}>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                id="photo-upload"
                style={{ display: 'none' }}
              />
              <label htmlFor="photo-upload" style={styles.uploadButton}>
                Изменить фото
              </label>
              {previewURL && (
                <button 
                  onClick={handleRemovePhoto}
                  style={styles.removeButton}
                >
                  Удалить фото
                </button>
              )}
            </div>
          </div>
        </div>

        <div style={{ textAlign: "left", marginTop: "30px" }}>
          <label style={styles.label}>
            Фамилия *
            <input 
              style={Styles.input} 
              value={userData.lastName} 
              onChange={(e) => setUserData({...userData, lastName: e.target.value})}
              placeholder="Введите вашу фамилию"
            />
          </label>

          <label style={styles.label}>
            Имя *
            <input 
              style={Styles.input} 
              value={userData.firstName} 
              onChange={(e) => setUserData({...userData, firstName: e.target.value})}
              placeholder="Введите ваше имя"
            />
          </label>

          <label style={styles.label}>
            Отчество
            <input 
              style={Styles.input} 
              value={userData.middleName} 
              onChange={(e) => setUserData({...userData, middleName: e.target.value})}
              placeholder="Отчество (необязательно)"
            />
          </label>

          <label style={styles.label}>
            Номер телефона *
            <input 
              style={Styles.input} 
              value={userData.phone} 
              onChange={(e) => setUserData({...userData, phone: e.target.value})}
              placeholder="+996 (XXX) XX-XX-XX"
              type="tel"
            />
          </label>
        </div>

        <button 
          style={{
            ...Styles.button,
            backgroundColor: isFormValid() ? "#4a6fa5" : "#cccccc",
            opacity: isFormValid() ? 1 : 0.6,
            cursor: isFormValid() && !isSaving ? 'pointer' : 'not-allowed',
            marginTop: "30px",
            marginBottom: "20px",
            padding: "12px 30px",
            fontSize: "16px",
            fontWeight: "bold",
            border: "none",
            borderRadius: "5px",
            color: "white",
            width: "200px"
          }} 
          onClick={handleSave}
          disabled={!isFormValid() || isSaving}
        >
          {isSaving ? "Сохранение..." : "Сохранить"}
        </button>
      </div>
    </div>
  );
}

// Стили для страницы профиля
const styles = {
  photoSection: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "20px"
  },
  photoContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "15px"
  },
  photoCircle: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    overflow: "hidden",
    border: "3px solid #4a6fa5",
    backgroundColor: "#f0f0f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  profileImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover"
  },
  defaultAvatar: {
    width: "100%",
    height: "100%",
    backgroundColor: "#4a6fa5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontSize: "40px",
    fontWeight: "bold"
  },
  avatarText: {
    textTransform: "uppercase"
  },
  photoControls: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    justifyContent: "center"
  },
  uploadButton: {
    padding: "8px 15px",
    backgroundColor: "#4a6fa5",
    color: "white",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
    textAlign: "center",
    minWidth: "150px"
  },
  removeButton: {
    padding: "8px 15px",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
    minWidth: "150px"
  },
  label: {
    display: "block",
    marginBottom: "20px",
    color: "#333",
    fontSize: "14px",
    fontWeight: "500"
  },
  // Успешный модал стилдери
  successModal: {
    position: "fixed",
    top: "20px",
    right: "20px",
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "15px 25px",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    zIndex: 1000,
    animation: "slideIn 0.3s ease-out"
  },
  successContent: {
    display: "flex",
    alignItems: "center",
    gap: "10px"
  },
  successIcon: {
    fontSize: "24px",
    fontWeight: "bold"
  },
  successText: {
    margin: 0,
    fontSize: "14px",
    fontWeight: "500"
  },
  // Ошибка модалы стилдери
  errorModal: {
    position: "fixed",
    top: "20px",
    right: "20px",
    backgroundColor: "#f44336",
    color: "white",
    padding: "15px 25px",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    zIndex: 1000,
    animation: "slideIn 0.3s ease-out"
  },
  errorContent: {
    display: "flex",
    alignItems: "center",
    gap: "10px"
  },
  errorIcon: {
    fontSize: "24px",
    fontWeight: "bold"
  },
  errorText: {
    margin: 0,
    fontSize: "14px",
    fontWeight: "500"
  }
};

// Анимация үчүн CSS
const styleSheet = document.createElement('style');
styleSheet.innerHTML = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;
document.head.appendChild(styleSheet);