import React, { useState, useEffect } from "react";
import Styles from "./Styles";
import { db } from "./firebase"; 
import { 
  ref, 
  push, 
  set, 
  onValue,
  update,
  remove
} from "firebase/database";

export default function Teachers({ onBack }) {
  const [teachers, setTeachers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newTeacher, setNewTeacher] = useState({
    name: "",
    phone: "",
    position: "Преподаватель"
  });
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔥 Загрузка преподавателей из Firebase
  useEffect(() => {
    setLoading(true);
    const teachersRef = ref(db, 'teachers');
    
    const unsubscribe = onValue(teachersRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const teachersList = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        })).sort((a, b) => a.name?.localeCompare(b.name || ''));
        
        setTeachers(teachersList);
      } else {
        setTeachers([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 🔥 Добавление нового преподавателя
  const addTeacher = async () => {
    if (!newTeacher.name.trim() || !newTeacher.phone.trim()) {
      alert("Заполните ФИО и телефон!");
      return;
    }

    try {
      const teachersRef = ref(db, 'teachers');
      const newTeacherRef = push(teachersRef);
      
      const teacherData = {
        name: newTeacher.name.trim(),
        phone: newTeacher.phone.trim(),
        position: newTeacher.position,
        department: "Кафедра информационных технологий НГУ",
        createdAt: new Date().toISOString()
      };

      await set(newTeacherRef, teacherData);
      
      setNewTeacher({ name: "", phone: "", position: "Преподаватель" });
      setShowModal(false);
      alert("✅ Преподаватель успешно добавлен!");
    } catch (error) {
      console.error("Ошибка добавления преподавателя:", error);
      alert("Ошибка при добавлении преподавателя!");
    }
  };

  // 🔥 Редактирование преподавателя
  const startEdit = (teacher) => {
    setEditingTeacher(teacher);
    setNewTeacher({
      name: teacher.name || "",
      phone: teacher.phone || "",
      position: teacher.position || "Преподаватель"
    });
    setShowModal(true);
  };

  const updateTeacher = async () => {
    if (!newTeacher.name.trim() || !newTeacher.phone.trim()) {
      alert("Заполните ФИО и телефон!");
      return;
    }

    try {
      const teacherRef = ref(db, `teachers/${editingTeacher.id}`);
      
      const updatedData = {
        name: newTeacher.name.trim(),
        phone: newTeacher.phone.trim(),
        position: newTeacher.position,
        updatedAt: new Date().toISOString()
      };

      await update(teacherRef, updatedData);
      
      setEditingTeacher(null);
      setNewTeacher({ name: "", phone: "", position: "Преподаватель" });
      setShowModal(false);
      alert("✅ Преподаватель успешно обновлён!");
    } catch (error) {
      console.error("Ошибка обновления преподавателя:", error);
      alert("Ошибка при обновлении преподавателя!");
    }
  };

  // 🔥 Удаление преподавателя
  const deleteTeacher = async (id, name) => {
    if (!window.confirm(`Удалить преподавателя ${name}?`)) return;

    try {
      const teacherRef = ref(db, `teachers/${id}`);
      await remove(teacherRef);
      alert("✅ Преподаватель успешно удалён!");
    } catch (error) {
      console.error("Ошибка удаления преподавателя:", error);
      alert("Ошибка при удалении преподавателя!");
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTeacher(null);
    setNewTeacher({ name: "", phone: "", position: "Преподаватель" });
  };

  const positions = [
    "Преподаватель",
    "Старший преподаватель",
    "Доцент",
    "Профессор",
    "Заведующий кафедрой"
  ];

  return (
    <div style={Styles.mainMenuWrap}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '25px' 
      }}>
        <div>
          <h2 style={Styles.title}>👩‍🏫 Преподаватели</h2>
          
        </div>
        <button 
          style={Styles.button} 
          onClick={() => {
            setEditingTeacher(null);
            setNewTeacher({ name: "", phone: "", position: "Преподаватель" });
            setShowModal(true);
          }}
        >
          + Добавить преподавателя
        </button>
      </div>

      <div style={{ 
        backgroundColor: 'white',
        borderRadius: '12px',
        border: '2px solid #e8eaf6',
        padding: '25px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
        marginBottom: '30px',
        minHeight: '300px'
      }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#666' }}>
            <div style={{ fontSize: '50px', color: '#3949ab', marginBottom: '15px' }}>👨‍🏫</div>
            <p>Загрузка преподавателей...</p>
          </div>
        ) : teachers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#666' }}>
            <div style={{ fontSize: '60px', color: '#ddd', marginBottom: '15px' }}>📭</div>
            <p style={{ fontSize: '18px', marginBottom: '10px' }}>Список преподавателей пуст</p>
            <button 
              style={{ ...Styles.button, marginTop: '20px', padding: '10px 20px' }}
              onClick={() => setShowModal(true)}
            >
              👤 Добавить первого преподавателя
            </button>
          </div>
        ) : (
          <table style={{ 
            width: '100%',
            borderCollapse: 'collapse',
            border: '1px solid #e0e0e0'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ 
                  padding: '12px 15px',
                  borderBottom: '2px solid #e8eaf6',
                  borderRight: '1px solid #e0e0e0',
                  color: '#3949ab',
                  fontWeight: 600,
                  textAlign: 'center',
                  fontSize: '14px'
                }}>ФИО</th>
                <th style={{ 
                  padding: '12px 15px',
                  borderBottom: '2px solid #e8eaf6',
                  borderRight: '1px solid #e0e0e0',
                  color: '#3949ab',
                  fontWeight: 600,
                  textAlign: 'center',
                  fontSize: '14px'
                }}>Телефон</th>
                <th style={{ 
                  padding: '12px 15px',
                  borderBottom: '2px solid #e8eaf6',
                  borderRight: '1px solid #e0e0e0',
                  color: '#3949ab',
                  fontWeight: 600,
                  textAlign: 'center',
                  fontSize: '14px'
                }}>Должность</th>
                <th style={{ 
                  padding: '12px 15px',
                  borderBottom: '2px solid #e8eaf6',
                  color: '#3949ab',
                  fontWeight: 600,
                  textAlign: 'center',
                  fontSize: '14px'
                }}>Действия</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((teacher) => (
                <tr key={teacher.id} style={{ 
                  borderBottom: '1px solid #f0f0f0',
                  transition: 'background-color 0.2s ease'
                }}>
                  <td style={{ 
                    padding: '12px 15px',
                    borderRight: '1px solid #e0e0e0',
                    textAlign: 'center',
                    verticalAlign: 'middle',
                    fontWeight: '500',
                    color: '#333'
                  }}>
                    {teacher.name}
                  </td>
                  <td style={{ 
                    padding: '12px 15px',
                    borderRight: '1px solid #e0e0e0',
                    textAlign: 'center',
                    verticalAlign: 'middle',
                    color: '#555'
                  }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      gap: '8px'
                    }}>
                      <span style={{ fontSize: '14px', color: '#666' }}>📞</span>
                      {teacher.phone}
                    </div>
                  </td>
                  <td style={{ 
                    padding: '12px 15px',
                    borderRight: '1px solid #e0e0e0',
                    textAlign: 'center',
                    verticalAlign: 'middle'
                  }}>
                    <div style={{ 
                      padding: '6px 12px',
                      backgroundColor: teacher.position === 'Заведующий кафедрой' ? '#E3F2FD' : 
                                     teacher.position === 'Профессор' ? '#E8F5E9' : 
                                     teacher.position === 'Доцент' ? '#FFF3E0' : '#F5F5F5',
                      borderRadius: '20px',
                      fontSize: '13px',
                      display: 'inline-block',
                      border: '1px solid #e0e0e0',
                      color: '#333',
                      fontWeight: '500'
                    }}>
                      {teacher.position}
                    </div>
                  </td>
                  <td style={{ 
                    padding: '12px 15px',
                    textAlign: 'center',
                    verticalAlign: 'middle'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                      <button
                        style={{
                          ...Styles.button,
                          padding: '8px 12px',
                          fontSize: '14px',
                          backgroundColor: '#4CAF50',
                          minWidth: '40px',
                          border: '1px solid #45a049'
                        }}
                        onClick={() => startEdit(teacher)}
                        title="Редактировать"
                      >
                        ✎
                      </button>
                      <button
                        style={{
                          ...Styles.buttonDanger,
                          padding: '8px 12px',
                          fontSize: '14px',
                          minWidth: '40px',
                          border: '1px solid #dc3545'
                        }}
                        onClick={() => deleteTeacher(teacher.id, teacher.name)}
                        title="Удалить"
                      >
                        🗑
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div style={{ 
        marginTop: '40px', 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: '20px',
        borderTop: '2px solid #e8eaf6'
      }}>
        <button style={Styles.backButton} onClick={onBack}>
          ← Назад
        </button>
        <div style={{ color: '#666', fontSize: '14px' }}>
          Всего преподавателей: <strong>{teachers.length}</strong>
        </div>
      </div>

      {/* Модальное окно */}
      {showModal && (
        <div style={Styles.modalOverlay}>
          <div style={{ 
            ...Styles.modalBox, 
            maxWidth: '500px', 
            border: '2px solid #e8eaf6' 
          }}>
            <h3 style={{ 
              marginBottom: '20px',
              color: '#3949ab',
              borderBottom: '2px solid #e8eaf6',
              paddingBottom: '10px'
            }}>
              {editingTeacher ? '✎ Редактировать преподавателя' : '👤 Новый преподаватель'}
            </h3>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '5px', 
                color: '#333',
                fontWeight: '500' 
              }}>
                ФИО преподавателя:
              </label>
              <input
                style={Styles.select}
                placeholder="Тураров Б.Б."
                value={newTeacher.name}
                onChange={(e) => setNewTeacher({...newTeacher, name: e.target.value})}
              />
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '5px', 
                color: '#333',
                fontWeight: '500' 
              }}>
                Телефон:
              </label>
              <input
                style={Styles.select}
                placeholder="+996 500 111 222"
                value={newTeacher.phone}
                onChange={(e) => setNewTeacher({...newTeacher, phone: e.target.value})}
              />
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '5px', 
                color: '#333',
                fontWeight: '500' 
              }}>
                Должность:
              </label>
              <select
                style={Styles.select}
                value={newTeacher.position}
                onChange={(e) => setNewTeacher({...newTeacher, position: e.target.value})}
              >
                {positions.map(pos => (
                  <option key={pos} value={pos}>{pos}</option>
                ))}
              </select>
            </div>
            
            <div style={{ 
              display: 'flex', 
              gap: '10px', 
              marginTop: '25px',
              paddingTop: '15px',
              borderTop: '1px solid #e8eaf6'
            }}>
              <button 
                style={{
                  ...Styles.button,
                  backgroundColor: editingTeacher ? '#3949ab' : '#28a745',
                  flex: 1
                }} 
                onClick={editingTeacher ? updateTeacher : addTeacher}
              >
                {editingTeacher ? '💾 Сохранить изменения' : '✅ Добавить преподавателя'}
              </button>
              <button
                style={{
                  ...Styles.backButton,
                  flex: 1
                }}
                onClick={closeModal}
              >
                ✖ Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}