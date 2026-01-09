import React, { useState } from "react";
import { auth } from "./firebase";
import { updatePassword } from "firebase/auth";
import Styles from "./Styles";

export default function Settings({ onBack }) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      return alert("Сыр сөздөр бири-бирине дал келбейт!");
    }
    if (newPassword.length < 6) {
      return alert("Сыр сөз кеминде 6 белгиден турушу керек!");
    }

    setLoading(true);
    const user = auth.currentUser;

    if (user) {
      try {
        await updatePassword(user, newPassword);
        alert("Сыр сөз ийгиликтүү өзгөртүлдү!");
        setNewPassword("");
        setConfirmPassword("");
      } catch (error) {
        console.error(error);
        alert("Ката кетти. Сыр сөздү жакында эле кирген болсоңуз гана өзгөртө аласыз (коопсуздук үчүн).");
      }
    } else {
      alert("Колдонуучу табылган жок!");
    }
    setLoading(false);
  };

  return (
    <div style={Styles.mainPage}>
      <div style={Styles.mainMenuWrap}>
        <button style={Styles.backButton} onClick={onBack}>← Артка</button>
        <h2 style={Styles.title}>⚙️ Настройки</h2>
        
        <div style={{ textAlign: "left", marginTop: "20px" }}>
          <h3 style={Styles.subtitle}>Сыр сөздү өзгөртүү</h3>
          
          <label>Жаңы сыр сөз:</label>
          <input 
            type="password"
            style={Styles.input} 
            value={newPassword} 
            onChange={(e) => setNewPassword(e.target.value)} 
            placeholder="******"
          />
          
          <label>Сыр сөздү кайталаңыз:</label>
          <input 
            type="password"
            style={Styles.input} 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            placeholder="******"
          />
          
          <button 
            style={{ ...Styles.button, width: "100%", marginTop: "20px" }} 
            onClick={handleUpdatePassword}
            disabled={loading}
          >
            {loading ? "Жүктөлүүдө..." : "Жаңыртуу"}
          </button>
        </div>

        <div style={{ marginTop: "40px", borderTop: "1px solid #ddd", paddingTop: "20px" }}>
          <p style={{ color: "#666" }}>Тилди тандоо: <strong>Кыргызча</strong></p>
          <p style={{ color: "#666" }}>Версия: <strong>1.0.5</strong></p>
        </div>
      </div>
    </div>
  );
}