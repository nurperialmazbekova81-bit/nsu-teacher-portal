import React, { useState, useEffect } from "react";
import Styles from "./Styles";
import { db } from "./firebase";
import {
  ref,
  push,
  set,
  remove,
  onValue,
  update,
} from "firebase/database";

export default function Students({ group, course, onBack }) {
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [newStudent, setNewStudent] = useState({
    fio: "",
    phone: "",
    starosta: false,
  });
  const [loading, setLoading] = useState(true);

  // 🔥 Загрузка студентов из Firebase
  useEffect(() => {
    setLoading(true);
    const studentsRef = ref(db, "students");

    const unsubscribe = onValue(studentsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const studentsList = Object.keys(data)
          .map((key) => ({ id: key, ...data[key] }))
          .filter((s) => s.group === group && s.course === course)
          .sort((a, b) => {
            if (a.starosta && !b.starosta) return -1;
            if (!a.starosta && b.starosta) return 1;
            return a.fio.localeCompare(b.fio);
          });

        setStudents(studentsList);
      } else {
        setStudents([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [group, course]);

  // 🔥 Переключение статуса старосты
  const toggleStarosta = async (student) => {
    if (!window.confirm(
      `Сделать ${student.fio} ${student.starosta ? "обычным студентом" : "старостой группы"}?`
    )) return;

    try {
      await update(ref(db, `students/${student.id}`), {
        starosta: !student.starosta,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Ошибка изменения статуса старосты:", error);
      alert("Ошибка при изменении статуса!");
    }
  };

  // 🔥 Добавление нового студента
  const addStudent = async () => {
    if (!newStudent.fio.trim() || !newStudent.phone.trim()) {
      alert("Заполните ФИО и телефон!");
      return;
    }

    try {
      const newRef = push(ref(db, "students"));
      await set(newRef, {
        fio: newStudent.fio.trim(),
        phone: newStudent.phone.trim(),
        starosta: newStudent.starosta || false,
        group: group,
        course: course,
        createdAt: new Date().toISOString(),
      });

      setShowModal(false);
      setNewStudent({ fio: "", phone: "", starosta: false });
      alert("✅ Студент успешно добавлен!");
    } catch (error) {
      console.error("Ошибка добавления студента:", error);
      alert("Ошибка при добавлении студента!");
    }
  };

  // 🔥 Редактирование студента
  const startEditStudent = (student) => {
    setEditingStudent(student);
    setNewStudent({
      fio: student.fio,
      phone: student.phone,
      starosta: student.starosta || false,
    });
    setShowModal(true);
  };

  const updateStudent = async () => {
    if (!newStudent.fio.trim() || !newStudent.phone.trim()) {
      alert("Заполните ФИО и телефон!");
      return;
    }

    try {
      await update(ref(db, `students/${editingStudent.id}`), {
        fio: newStudent.fio.trim(),
        phone: newStudent.phone.trim(),
        starosta: newStudent.starosta || false,
        updatedAt: new Date().toISOString(),
      });

      setEditingStudent(null);
      setShowModal(false);
      setNewStudent({ fio: "", phone: "", starosta: false });
      alert("✅ Студент успешно обновлён!");
    } catch (error) {
      console.error("Ошибка обновления студента:", error);
      alert("Ошибка при обновлении студента!");
    }
  };

  // 🔥 Удаление студента
  const deleteStudent = async (id, fio) => {
    if (!window.confirm(`Удалить студента ${fio}?`)) return;
    
    try {
      await remove(ref(db, `students/${id}`));
      alert("✅ Студент удалён!");
    } catch (error) {
      console.error("Ошибка удаления студента:", error);
      alert("Ошибка при удалении студента!");
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingStudent(null);
    setNewStudent({ fio: "", phone: "", starosta: false });
  };

  // Получаем старост
  const starostas = students.filter((s) => s.starosta);

  return (
    <div style={Styles.appWrap}>
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        marginBottom: "20px" 
      }}>
        <div>
          <h3 style={Styles.subtitle}>
            Группа: <strong>{group}</strong> | Курс: <strong>{course}</strong>
            {starostas.length > 0 && (
              <span style={{ 
                marginLeft: "15px", 
                color: "hsla(3, 99%, 51%, 1.00)",
                fontWeight: "bold"
              }}>
                ★ Староста: {starostas[0].fio}
              </span>
            )}
          </h3>
        </div>
        <button 
          style={Styles.button} 
          onClick={() => {
            setEditingStudent(null);
            setNewStudent({ fio: "", phone: "", starosta: false });
            setShowModal(true);
          }}
        >
          👤 + Добавить студента
        </button>
      </div>

      {/* Индикатор загрузки */}
      {loading ? (
        <div style={{ 
          textAlign: "center", 
          padding: "40px",
          backgroundColor: "white",
          borderRadius: "12px",
          border: "2px solid #e8eaf6"
        }}>
          <div style={{ 
            fontSize: "40px", 
            color: "#FFD700", 
            marginBottom: "10px"
          }}>⭐</div>
          <p style={{ color: "#666" }}>Загрузка студентов...</p>
        </div>
      ) : (
        <div>
          {/* Таблица всех студентов */}
          <div style={{ 
            backgroundColor: "white",
            borderRadius: "12px",
            border: "2px solid #e8eaf6",
            padding: "25px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
            marginBottom: "20px",
            overflowX: "auto"
          }}>
            {students.length === 0 ? (
              <div style={{ 
                textAlign: "center", 
                padding: "40px",
                color: "#666"
              }}>
                <div style={{ 
                  fontSize: "40px", 
                  color: "#ddd", 
                  marginBottom: "10px" 
                }}>👨‍🎓</div>
                <p>Студентов в этой группе пока нет.</p>
                <p>Добавьте первого студента!</p>
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
                    }}>Староста</th>
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
                  {students.map((s) => (
                    <tr key={s.id} style={{ 
                      borderBottom: '1px solid #f0f0f0',
                      transition: 'background-color 0.2s ease',
                      backgroundColor: s.starosta ? '#FFFDE7' : 'transparent'
                    }}>
                      <td style={{ 
                        padding: '12px 15px',
                        borderRight: '1px solid #e0e0e0',
                        textAlign: 'center',
                        verticalAlign: 'middle',
                        fontWeight: s.starosta ? 'bold' : 'normal',
                        color: s.starosta ? '#B8860B' : '#333'
                      }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                          {s.fio}
                          {s.starosta && (
                            <span style={{ 
                              fontSize: "11px", 
                              backgroundColor: "#FFD700", 
                              color: "#8B6914",
                              padding: "3px 8px",
                              borderRadius: "12px",
                              fontWeight: "bold"
                            }}>
                              СТАРОСТА
                            </span>
                          )}
                        </div>
                      </td>
                      <td style={{ 
                        padding: '12px 15px',
                        borderRight: '1px solid #e0e0e0',
                        textAlign: 'center',
                        verticalAlign: 'middle',
                        color: s.starosta ? '#B8860B' : '#555'
                      }}>
                        <div style={{ 
                          display: "flex", 
                          alignItems: "center", 
                          justifyContent: "center",
                          gap: "8px"
                        }}>
                          <span style={{ fontSize: "14px" }}>📞</span>
                          {s.phone}
                        </div>
                      </td>
                      <td style={{ 
                        padding: '12px 15px',
                        borderRight: '1px solid #e0e0e0',
                        textAlign: 'center',
                        verticalAlign: 'middle'
                      }}>
                        <div 
                          style={{ 
                            fontSize: "24px", 
                            color: s.starosta ? "#FFD700" : "#ccc", 
                            cursor: "pointer",
                            textShadow: s.starosta ? "0 0 3px rgba(255, 215, 0, 0.5)" : "none",
                            display: "flex",
                            justifyContent: "center"
                          }}
                          onClick={() => toggleStarosta(s)}
                          title={s.starosta ? "Снять с должности старосты" : "Назначить старостой"}
                        >
                          {s.starosta ? "★" : "☆"}
                        </div>
                      </td>
                      <td style={{ 
                        padding: '12px 15px',
                        textAlign: 'center',
                        verticalAlign: 'middle'
                      }}>
                        <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
                          <button
                            style={{
                              ...Styles.button,
                              padding: "8px 12px",
                              fontSize: "14px",
                              backgroundColor: s.starosta ? "#FFD700" : "#4CAF50",
                              color: s.starosta ? "#8B6914" : "white",
                              border: "1px solid #e0e0e0"
                            }}
                            onClick={() => startEditStudent(s)}
                            title="Редактировать"
                          >
                            ✎
                          </button>
                          <button
                            style={{
                              ...Styles.buttonDanger,
                              padding: "8px 12px",
                              fontSize: "14px",
                              border: "1px solid #e0e0e0"
                            }}
                            onClick={() => deleteStudent(s.id, s.fio)}
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
        </div>
      )}

      {/* Кнопка назад и статистика */}
      <div style={{ 
        marginTop: "30px", 
        display: "flex", 
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: "20px",
        borderTop: "2px solid #e8eaf6"
      }}>
        <button style={Styles.backButton} onClick={onBack}>
          ← Назад 
        </button>
        
        <div style={{ color: "#0d0c0cff", fontSize: "14px" }}>
          Всего студентов: <strong>{students.length}</strong>
          {starostas.length > 0 && (
            <span style={{ marginLeft: "15px", color: "rgba(235, 38, 20, 0.99)", fontWeight: "bold" }}>
              Старост: {starostas.length}
            </span>
          )}
        </div>
      </div>

      {/* Модальное окно */}
      {showModal && (
        <div style={Styles.modalOverlay}>
          <div style={{
            ...Styles.modalBox,
            maxWidth: "500px",
            border: "2px solid #e8eaf6"
          }}>
            <h3 style={{
              marginBottom: "20px",
              color: "#3949ab",
              borderBottom: "2px solid #e8eaf6",
              paddingBottom: "10px"
            }}>
              {editingStudent ? "✎ Редактировать студента" : "👤 Добавить нового студента"}
            </h3>
            
            <div style={{ marginBottom: "15px" }}>
              <label style={{ 
                display: "block", 
                marginBottom: "8px", 
                color: "#333",
                fontWeight: "500",
                fontSize: "14px"
              }}>
                ФИО студента: *
              </label>
              <input
                style={Styles.select}
                placeholder="Аманов Эсен Аманбекович"
                value={newStudent.fio}
                onChange={(e) =>
                  setNewStudent({ ...newStudent, fio: e.target.value })
                }
                required
              />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label style={{ 
                display: "block", 
                marginBottom: "8px", 
                color: "#333",
                fontWeight: "500",
                fontSize: "14px"
              }}>
                Телефон: *
              </label>
              <input
                style={Styles.select}
                placeholder="+996 500 123 456"
                value={newStudent.phone}
                onChange={(e) =>
                  setNewStudent({ ...newStudent, phone: e.target.value })
                }
                required
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "8px",
                color: "#333",
                fontWeight: "500",
                cursor: "pointer"
              }}>
                <input
                  type="checkbox"
                  checked={newStudent.starosta}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, starosta: e.target.checked })
                  }
                  style={{ width: "18px", height: "18px" }}
                />
                <span style={{ 
                  color: newStudent.starosta ? "#FFD700" : "#333",
                  fontWeight: newStudent.starosta ? "bold" : "normal"
                }}>
                  Назначить старостой группы
                </span>
              </label>
              {newStudent.starosta && (
                <small style={{ 
                  color: "#FFD700", 
                  display: "block", 
                  marginTop: "5px",
                  marginLeft: "26px"
                }}>
                  ⚠️ В группе может быть только один староста
                </small>
              )}
            </div>
            
            <div style={{ 
              display: "flex", 
              gap: "10px", 
              marginTop: "25px",
              paddingTop: "15px",
              borderTop: "1px solid #e8eaf6"
            }}>
              <button 
                style={{
                  ...Styles.button,
                  backgroundColor: editingStudent ? "#3949ab" : "#28a745",
                  flex: 1
                }} 
                onClick={editingStudent ? updateStudent : addStudent}
              >
                {editingStudent ? "💾 Сохранить изменения" : "✅ Добавить студента"}
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