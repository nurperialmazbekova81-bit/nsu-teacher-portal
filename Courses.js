import React, { useState } from "react";
import Styles from "./Styles";

export default function Courses({ group, onBack, onSelectCourse }) {
  const [editing, setEditing] = useState(false);
  const [editedGroup, setEditedGroup] = useState(group);
  const [courses, setCourses] = useState([
    { level: 1, label: "1 курс", active: true, description: "Начальный уровень" },
    { level: 2, label: "2 курс", active: true, description: "Базовые профильные дисциплины" },
    { level: 3, label: "3 курс", active: true, description: "Углубленное изучение" },
    { level: 4, label: "4 курс", active: true, description: "Выпускной курс, диплом" },
  ]);

  const handleSave = () => {
    setEditing(false);
    // Можно добавить сохранение в базу данных
    console.log("Сохранено:", { group: editedGroup, courses });
  };

  const toggleCourse = (level) => {
    setCourses(courses.map(c => 
      c.level === level ? { ...c, active: !c.active } : c
    ));
  };

  const addCourse = () => {
    const newLevel = courses.length + 1;
    setCourses([...courses, { 
      level: newLevel, 
      label: `${newLevel} курс`, 
      active: true,
      description: `Курс ${newLevel} - описание`
    }]);
  };

  const removeCourse = (level) => {
    if (courses.length <= 1) {
      alert("Должен остаться хотя бы один курс!");
      return;
    }
    if (window.confirm(`Удалить ${level} курс?`)) {
      setCourses(courses.filter(c => c.level !== level));
    }
  };

  return (
    <div style={Styles.mainMenuWrap}>
      <div style={{
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
        marginBottom: '20px'
      }}>
        <div>
          <h2 style={Styles.title}>
            {editing ? "✎ Редактировать курс" : "🎓 Выберите курс"}
          </h2>
          <p style={{
            ...Styles.subtitle,
            backgroundColor: '#f0f7ff',
            padding: '8px 15px',
            borderRadius: '8px',
            display: 'inline-block',
            marginTop: '5px'
          }}>
            Направление: <strong style={{color: '#1a73e8'}}>{group}</strong>
          </p>
        </div>
        
        <button
          style={{
            ...(editing ? Styles.buttonDanger : Styles.button),
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
          onClick={() => editing ? setEditing(false) : setEditing(true)}
        >
          {editing ? "✖ Отмена" : "✎ Редактировать"}
        </button>
      </div>

      {editing ? (
        // РЕДАКТИРОВАНИЕ
        <div>
          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '20px',
            borderRadius: '10px',
            marginBottom: '25px',
            border: '1px solid #dee2e6'
          }}>
            <h3 style={{...Styles.subtitle, marginBottom: '15px'}}>
              📋 Настройки направления
            </h3>
            
            <div style={Styles.inputGroup}>
              <label style={Styles.label}>
                <span style={{color: '#dc3545'}}>*</span> Название группы:
              </label>
              <input
                style={{...Styles.select, fontSize: '16px', padding: '12px'}}
                value={editedGroup}
                onChange={(e) => setEditedGroup(e.target.value)}
                placeholder="Например: ИВТ-21, ПИ-22, БИ-23"
              />
            </div>
          </div>

          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '20px',
            borderRadius: '10px',
            marginBottom: '25px',
            border: '1px solid #dee2e6'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '15px'
            }}>
              <h3 style={{...Styles.subtitle, margin: 0}}>
                📚 Курсы обучения ({courses.filter(c => c.active).length} активных)
              </h3>
              <button 
                style={{...Styles.button, padding: '8px 15px'}}
                onClick={addCourse}
              >
                + Добавить курс
              </button>
            </div>
            
            <div style={Styles.coursesList}>
              {courses.map((c) => (
                <div key={c.level} style={{
                  ...Styles.courseItem,
                  opacity: c.active ? 1 : 0.6,
                  backgroundColor: c.active ? 'white' : '#f8f9fa'
                }}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '15px', flex: 1}}>
                    <input
                      type="checkbox"
                      checked={c.active}
                      onChange={() => toggleCourse(c.level)}
                      style={{transform: 'scale(1.2)'}}
                    />
                    <div style={{flex: 1}}>
                      <input
                        style={{...Styles.select, width: '100%', marginBottom: '5px'}}
                        value={c.label}
                        onChange={(e) => {
                          setCourses(courses.map(course => 
                            course.level === c.level 
                              ? { ...course, label: e.target.value }
                              : course
                          ));
                        }}
                        placeholder={`Название ${c.level} курса`}
                      />
                      <input
                        style={{...Styles.select, width: '100%', fontSize: '13px'}}
                        value={c.description}
                        onChange={(e) => {
                          setCourses(courses.map(course => 
                            course.level === c.level 
                              ? { ...course, description: e.target.value }
                              : course
                          ));
                        }}
                        placeholder="Описание курса"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => removeCourse(c.level)}
                    style={{
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      padding: '5px 10px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                    title="Удалить курс"
                  >
                    🗑
                  </button>
                </div>
              ))}
            </div>
            
            <div style={{
              marginTop: '15px',
              padding: '10px',
              backgroundColor: '#e7f3ff',
              borderRadius: '5px',
              borderLeft: '4px solid #1a73e8'
            }}>
              <small style={{color: '#1a73e8'}}>
                <strong>💡 Подсказка:</strong> Отключенные курсы не будут отображаться в основном меню
              </small>
            </div>
          </div>

          <div style={{
            display: 'flex',
            gap: '10px',
            justifyContent: 'flex-end',
            marginTop: '30px'
          }}>
            <button 
              style={{
                ...Styles.button,
                backgroundColor: '#28a745',
                padding: '12px 25px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }} 
              onClick={handleSave}
            >
              ✅ Сохранить изменения
            </button>
          </div>
        </div>
      ) : (
        // ПРОСМОТР И ВЫБОР КУРСА
        <div>
          <div style={{
            marginBottom: "30px",
            padding: "20px",
            backgroundColor: "#f8f9fa",
            borderRadius: "10px",
            border: "1px solid #dee2e6"
          }}>
            
         </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '20px',
            marginBottom: '30px'
          }}>
            {courses
              .filter(c => c.active)
              .map((c) => (
                <div
                  key={c.level}
                  style={{
                    backgroundColor: 'white',
                    border: '2px solid #e9ecef',
                    borderRadius: '12px',
                    padding: '25px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                    ':hover': {
                      borderColor: '#1a73e8',
                      transform: 'translateY(-5px)',
                      boxShadow: '0 8px 15px rgba(26, 115, 232, 0.1)'
                    }
                  }}
                  onClick={() => onSelectCourse(c.level)}
                >
                  <div style={{
                    fontSize: '48px',
                    color: '#1a73e8',
                    marginBottom: '15px'
                  }}>
                    {c.level === 1 ? '👨‍🎓' : 
                     c.level === 2 ? '📚' : 
                     c.level === 3 ? '🎯' : '🏆'}
                  </div>
                  <h3 style={{
                    margin: '0 0 10px 0',
                    color: '#1a73e8',
                    fontSize: '24px',
                    fontWeight: 'bold'
                  }}>
                    {c.label}
                  </h3>
                  <p style={{
                    color: '#6c757d',
                    fontSize: '14px',
                    lineHeight: '1.5',
                    margin: 0
                  }}>
                    {c.description}
                  </p>
                  <div style={{
                    marginTop: '15px',
                    color: '#28a745',
                    fontSize: '13px',
                    fontWeight: 'bold'
                  }}>
                    Нажмите для перехода →
                  </div>
                </div>
              ))}
          </div>

          {courses.filter(c => !c.active).length > 0 && (
            <div style={{
              marginTop: '30px',
              padding: '15px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              border: '1px dashed #adb5bd'
            }}>
              <p style={{margin: 0, color: '#6c757d', fontSize: '14px'}}>
                <strong>📌 Скрытые курсы:</strong> {courses.filter(c => !c.active).map(c => c.label).join(', ')}
              </p>
            </div>
          )}
        </div>
      )}

      <div style={{
        marginTop: "40px",
        paddingTop: "20px",
        borderTop: "1px solid #dee2e6",
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <button style={Styles.backButton} onClick={onBack}>
          ← Назад 
        </button>
        
        {!editing && (
          <div style={{
            fontSize: '13px',
            color: '#6c757d',
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}>
           
          </div>
        )}
      </div>
    </div>
  );
}