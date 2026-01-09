import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { ref, push, onValue, update, remove } from "firebase/database";
import "./DiplomaThemes.css";

const CustomModal = ({ 
  show, 
  type = 'info', 
  title, 
  message, 
  onConfirm, 
  onCancel, 
  confirmText = 'OK', 
  cancelText = 'Отмена' 
}) => {
  if (!show) return null;

  const getModalStyles = () => {
    switch(type) {
      case 'confirm':
        return {
          icon: '❓',
          headerBg: '#fff3cd',
          confirmBg: '#dc3545',
          cancelBg: '#6c757d'
        };
      default:
        return {
          icon: 'ℹ️',
          headerBg: '#e9ecef',
          confirmBg: '#007bff',
          cancelBg: '#6c757d'
        };
    }
  };

  const styles = getModalStyles();

  return (
    <div className="modal-overlay">
      <div className="modal-dialog">
        <div className="modal-header" style={{ background: styles.headerBg }}>
          <div className="modal-icon">{styles.icon}</div>
          <h3 className="modal-title">{title}</h3>
        </div>
        <div className="modal-body">
          <p>{message}</p>
        </div>
        <div className="modal-footer">
          {onCancel && (
            <button 
              className="modal-btn cancel-btn"
              onClick={onCancel}
              style={{ background: styles.cancelBg }}
            >
              {cancelText}
            </button>
          )}
          <button 
            className="modal-btn confirm-btn"
            onClick={onConfirm}
            style={{ background: styles.confirmBg }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function DiplomaThemes({ onBack }) {
  const [themes, setThemes] = useState([]);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  
  const [newThemeTitle, setNewThemeTitle] = useState("");
  const [editingThemeId, setEditingThemeId] = useState(null);
  const [editingText, setEditingText] = useState("");
  
  const [selectingForThemeId, setSelectingForThemeId] = useState(null);
  const [selectingType, setSelectingType] = useState(null);
  const [selectionSearch, setSelectionSearch] = useState("");

  const [modal, setModal] = useState({
    show: false,
    type: 'info',
    title: '',
    message: '',
    onConfirm: null,
    onCancel: null,
    confirmText: 'OK',
    cancelText: 'Отмена'
  });

  const showModal = (config) => {
    setModal({
      show: true,
      type: config.type || 'info',
      title: config.title || '',
      message: config.message || '',
      onConfirm: config.onConfirm || (() => setModal({...modal, show: false})),
      onCancel: config.onCancel || (() => setModal({...modal, show: false})),
      confirmText: config.confirmText || 'OK',
      cancelText: config.cancelText || 'Отмена'
    });
  };

  useEffect(() => {
    console.log("🔥 Компонент иштей баштады");
    
    const themesRef = ref(db, "diplomaThemes");
    const studentsRef = ref(db, "students");
    const teachersRef = ref(db, "teachers");

    // ТЕМАЛАРДЫ ОКУУ - ДЕБАГ ЛОГИ КОШУЛДУ
    const unsubscribeThemes = onValue(themesRef, (snapshot) => {
      const data = snapshot.val();
      console.log("📚 Firebase'тен темалар келди:", data);
      
      if (data) {
        console.log("✅ Темалар бар, саны:", Object.keys(data).length);
        
        const list = Object.keys(data).map(key => {
          const themeData = data[key];
          console.log(`Тема ${key}:`, themeData);
          
          return { 
            id: key, 
            ...themeData,
            createdAt: themeData.createdAt || new Date().toISOString(),
            title: themeData.title || "",
            studentFIO: themeData.studentFIO || "",
            studentGroup: themeData.studentGroup || "",
            studentCourse: themeData.studentCourse || "",
            teacherFIO: themeData.teacherFIO || "",
            teacherDepartment: themeData.teacherDepartment || ""
          };
        });
        
        console.log("Кайра иштетилген темалар:", list);
        
        // ЖАҢЫ ТЕМАЛАР АСТЫНА ТҮШӨТ
        list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        
        const numberedList = list.map((item, index) => ({
          ...item,
          number: index + 1
        }));
        
        console.log("Номерленген темалар:", numberedList);
        setThemes(numberedList);
      } else {
        console.log("❌ Firebase'тен темалар жок");
        setThemes([]);
      }
    }, (error) => {
      console.error("❌ Темаларды окууда ката:", error);
    });

    const unsubscribeStudents = onValue(studentsRef, (snapshot) => {
      const data = snapshot.val();
      
      if (data) {
        const list = Object.keys(data).map(key => { 
          const studentData = data[key];
          
          const fio = studentData.fio || "";
          const course = studentData.course || "";
          
          return {
            id: key,
            fio: fio,
            course: course.toString(),
            group: studentData.group || ""
          };
        });
        
        const fourthYearStudents = list.filter(student => {
          if (!student.fio || student.fio.trim() === "") return false;
          
          const courseStr = student.course.toString().toLowerCase().trim();
          
          return courseStr === "4" || 
                 courseStr === "четвертый" || 
                 courseStr === "4 курс" ||
                 courseStr === "iv" ||
                 courseStr.includes("4") ||
                 parseInt(courseStr) === 4;
        });
        
        fourthYearStudents.sort((a, b) => {
          const fioA = a.fio || "";
          const fioB = b.fio || "";
          return fioA.localeCompare(fioB);
        });
        
        setStudents(fourthYearStudents);
      } else {
        setStudents([]);
      }
    });

    const unsubscribeTeachers = onValue(teachersRef, (snapshot) => {
      const data = snapshot.val();
      
      if (data) {
        const teacherMap = new Map();
        const list = [];
        
        Object.keys(data).forEach(key => {
          const teacherData = data[key];
          
          const fio = teacherData.fio || teacherData.fullName || teacherData.name || "";
          const department = teacherData.department || teacherData.kafedra || "";
          
          if (fio.trim() !== "" && !teacherMap.has(fio)) {
            teacherMap.set(fio, true);
            
            list.push({
              id: key,
              fio: fio.trim(),
              department: department.trim()
            });
          }
        });
        
        list.sort((a, b) => {
          const fioA = a.fio || "";
          const fioB = b.fio || "";
          return fioA.localeCompare(fioB);
        });
        
        setTeachers(list);
      } else {
        setTeachers([]);
      }
    });

    return () => {
      console.log("🔥 Компонент жабылып жатат");
      unsubscribeThemes();
      unsubscribeStudents();
      unsubscribeTeachers();
    };
  }, []);

  // ТЕМА КОШУУ ФУНКЦИЯСЫ - ДЕБАГ ЛОГИ КОШУЛДУ
  const handleAddTheme = () => {
    console.log("🎯 Тема кошуу функциясы чакырылды");
    console.log("Теманын аталышы:", newThemeTitle);
    
    if (!newThemeTitle.trim()) {
      console.log("❌ Теманын аталышы бош");
      return;
    }

    const themeData = {
      title: newThemeTitle.trim(),
      isTaken: false,
      studentId: "",
      studentFIO: "",
      studentGroup: "",
      studentCourse: "",
      teacherId: "",
      teacherFIO: "",
      teacherDepartment: "",
      assignedDate: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    console.log("Firebase'ке жөнөтүлө турган маалымат:", themeData);

    push(ref(db, "diplomaThemes"), themeData)
      .then((result) => {
        console.log("✅ Тема Firebase'ке ийгиликтүү кошулду!");
        console.log("Натыйжа:", result);
        setNewThemeTitle("");
        
        // Firebase'тен жаңы темаларды окуу үчүн
        const themesRef = ref(db, "diplomaThemes");
        onValue(themesRef, (snapshot) => {
          console.log("Firebase'тен жаңыртылган темалар:", snapshot.val());
        });
      })
      .catch((error) => {
        console.error("❌ Теманы кошууда ката:", error);
        console.error("Катанын деталдары:", error.message, error.code);
        
        // Ката тууралуу модал көрсөтүү
        showModal({
          type: 'confirm',
          title: 'Ошибка',
          message: `Теманы кошууда ката чыкты: ${error.message}`,
          confirmText: 'OK'
        });
      });
  };

  const startEditingTheme = (theme) => {
    setEditingThemeId(theme.id);
    setEditingText(theme.title);
  };

  const saveEditedTheme = () => {
    if (!editingText.trim()) return;

    update(ref(db, `diplomaThemes/${editingThemeId}`), {
      title: editingText.trim(),
      updatedAt: new Date().toISOString()
    });

    setEditingThemeId(null);
    setEditingText("");
  };

  const cancelEditingTheme = () => {
    setEditingThemeId(null);
    setEditingText("");
  };

  const handleDeleteTheme = (themeId) => {
    const themeToDelete = themes.find(theme => theme.id === themeId);
    if (!themeToDelete) return;

    showModal({
      type: 'confirm',
      title: 'Удаление темы',
      message: themeToDelete.isTaken 
        ? `Тема "${themeToDelete.title}" занята студентом ${themeToDelete.studentFIO}. Вы уверены, что хотите удалить?`
        : `Удалить тему "${themeToDelete.title}"?`,
      confirmText: 'Удалить',
      cancelText: 'Отмена',
      onConfirm: () => {
        remove(ref(db, `diplomaThemes/${themeId}`))
          .then(() => {
            console.log("✅ Тема ийгиликтүү өчүрүлдү");
          })
          .catch(error => {
            console.error("❌ Теманы өчүрүүдө ката:", error);
          });
      }
    });
  };

  const startSelectingStudent = (themeId) => {
    setSelectingForThemeId(themeId);
    setSelectingType("student");
    setSelectionSearch("");
  };

  const startSelectingTeacher = (themeId) => {
    setSelectingForThemeId(themeId);
    setSelectingType("teacher");
    setSelectionSearch("");
  };

  const selectStudent = (student) => {
    if (!selectingForThemeId) return;

    update(ref(db, `diplomaThemes/${selectingForThemeId}`), {
      isTaken: true,
      studentId: student.id,
      studentFIO: student.fio,
      studentGroup: student.group,
      studentCourse: student.course,
      assignedDate: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    setSelectingForThemeId(null);
    setSelectingType(null);
  };

  const selectTeacher = (teacher) => {
    if (!selectingForThemeId) return;

    update(ref(db, `diplomaThemes/${selectingForThemeId}`), {
      teacherId: teacher.id,
      teacherFIO: teacher.fio,
      teacherDepartment: teacher.department,
      updatedAt: new Date().toISOString()
    });

    setSelectingForThemeId(null);
    setSelectingType(null);
  };

  const freeTheme = (themeId) => {
    const themeToFree = themes.find(theme => theme.id === themeId);
    if (!themeToFree) return;

    showModal({
      type: 'confirm',
      title: 'Освободить тему',
      message: `Освободить тему "${themeToFree.title}"? Данные о студенте и преподавателе будут удалены.`,
      confirmText: 'Освободить',
      cancelText: 'Отмена',
      onConfirm: () => {
        update(ref(db, `diplomaThemes/${themeId}`), {
          isTaken: false,
          studentId: "",
          studentFIO: "",
          studentGroup: "",
          studentCourse: "",
          teacherId: "",
          teacherFIO: "",
          teacherDepartment: "",
          assignedDate: "",
          updatedAt: new Date().toISOString()
        });
      }
    });
  };

  const filteredStudents = students.filter(student => 
    !selectionSearch || 
    (student.fio && student.fio.toLowerCase().includes(selectionSearch.toLowerCase())) ||
    (student.group && student.group.toLowerCase().includes(selectionSearch.toLowerCase()))
  );

  const filteredTeachers = teachers.filter(teacher => 
    !selectionSearch || 
    (teacher.fio && teacher.fio.toLowerCase().includes(selectionSearch.toLowerCase())) ||
    (teacher.department && teacher.department.toLowerCase().includes(selectionSearch.toLowerCase()))
  );

  const stats = {
    total: themes.length,
    available: themes.filter(t => !t.isTaken).length,
    taken: themes.filter(t => t.isTaken).length
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      return new Date(dateString).toLocaleDateString('ru-RU');
    } catch (e) {
      return "";
    }
  };

  // Тест темасын кошуу үчүн функция
  const addTestTheme = () => {
    const testThemes = [
      "Тест тема 1: Веб-приложение для управления студентами",
      "Тест тема 2: Мобильное приложение для учета посещаемости",
      "Тест тема 3: Система для автоматизации учебного процесса"
    ];

    testThemes.forEach(theme => {
      const themeData = {
        title: theme,
        isTaken: false,
        studentId: "",
        studentFIO: "",
        studentGroup: "",
        studentCourse: "",
        teacherId: "",
        teacherFIO: "",
        teacherDepartment: "",
        assignedDate: "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      push(ref(db, "diplomaThemes"), themeData)
        .then(() => {
          console.log(`✅ Тест тема кошулду: ${theme}`);
        })
        .catch(error => {
          console.error(`❌ Тест теманы кошууда ката: ${error.message}`);
        });
    });
  };

  return (
    <div className="diploma-container">
      <CustomModal 
        show={modal.show}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        onConfirm={modal.onConfirm}
        onCancel={modal.onCancel}
        confirmText={modal.confirmText}
        cancelText={modal.cancelText}
      />

      <div className="page-header">
        <button className="back-btn" onClick={onBack}>
          <span className="arrow">←</span> Назад
        </button>
        <div className="header-content">
          <h1 className="main-title">Дипломные темы</h1>
          <p className="subtitle">Управление дипломными работами студентов 4 курса</p>
        </div>
        
        <div className="header-stats">
          <div className="stat-badge">
            <span className="stat-number">{stats.total}</span>
            <span className="stat-label">Всего</span>
          </div>
          <div className="stat-badge available">
            <span className="stat-number">{stats.available}</span>
            <span className="stat-label">Свободно</span>
          </div>
          <div className="stat-badge taken">
            <span className="stat-number">{stats.taken}</span>
            <span className="stat-label">Занято</span>
          </div>
        </div>
      </div>

     
      <div style={{ textAlign: 'center', marginBottom: '15px', padding: '10px', background: '#f8f9fa', borderRadius: '5px' }}>
        <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#666' }}>
          Темалар: {stats.total} | Студенттер: {students.length} | Мугалимдер: {teachers.length}
        </p>
        <button 
          onClick={addTestTheme}
          style={{
            padding: '8px 16px',
            background: '#17a2b8',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '14px',
            marginRight: '10px'
          }}
        >
          Тест темаларды кошуу
        </button>
        <span style={{ fontSize: '12px', color: '#999' }}>
          
        </span>
      </div>

      <div className="add-theme-panel">
        <div className="add-theme-form">
          <input
            type="text"
            className="theme-input"
            placeholder="Введите новую тему дипломной работы..."
            value={newThemeTitle}
            onChange={(e) => setNewThemeTitle(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddTheme()}
          />
          <button 
            className="btn btn-primary add-btn"
            onClick={handleAddTheme}
            disabled={!newThemeTitle.trim()}
          >
            Добавить тему
          </button>
        </div>
      </div>

      {selectingType === "student" && (
        <div className="selection-modal-overlay">
          <div className="selection-modal">
            <div className="selection-header">
              <h3>Выберите студента 4 курса</h3>
              <div className="selection-info">
                <span className="info-badge">Только 4 курс</span>
                <span className="student-count">{filteredStudents.length} студентов</span>
              </div>
              <button 
                className="close-btn"
                onClick={() => {
                  setSelectingForThemeId(null);
                  setSelectingType(null);
                }}
              >
                ×
              </button>
            </div>
            
            <div className="selection-search">
              <input
                type="text"
                className="search-input"
                placeholder="Поиск по ФИО или группе..."
                value={selectionSearch}
                onChange={(e) => setSelectionSearch(e.target.value)}
              />
            </div>
            
            <div className="selection-list">
              {filteredStudents.length === 0 ? (
                <div className="empty-selection">
                  <div className="empty-icon">👨‍🎓</div>
                  <h4>Студенты 4 курса не найдены</h4>
                  <p>В базе данных нет студентов 4 курса</p>
                </div>
              ) : (
                <table className="selection-table">
                  <thead>
                    <tr>
                      <th style={{width: "70%"}}>ФИО</th>
                      <th style={{width: "15%"}}>Группа</th>
                      <th style={{width: "15%"}}>Курс</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map(student => (
                      <tr 
                        key={student.id} 
                        className="selection-row"
                        onClick={() => selectStudent(student)}
                      >
                        <td className="fio-cell">
                          <strong>{student.fio}</strong>
                        </td>
                        <td className="group-cell">
                          <span className="group-badge-small">{student.group}</span>
                        </td>
                        <td className="course-cell">
                          <span className="course-badge-small">{student.course} курс</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

      {selectingType === "teacher" && (
        <div className="selection-modal-overlay">
          <div className="selection-modal">
            <div className="selection-header">
              <h3>Выберите преподавателя</h3>
              <button 
                className="close-btn"
                onClick={() => {
                  setSelectingForThemeId(null);
                  setSelectingType(null);
                }}
              >
                ×
              </button>
            </div>
            
            <div className="selection-search">
              <input
                type="text"
                className="search-input"
                placeholder="Поиск по ФИО или кафедре..."
                value={selectionSearch}
                onChange={(e) => setSelectionSearch(e.target.value)}
              />
            </div>
            
            <div className="selection-list">
              {teachers.length === 0 ? (
                <div className="empty-selection">
                  <div className="empty-icon">👨‍🏫</div>
                  <h4>Преподаватели не найдены</h4>
                  <p>В базе данных нет преподавателей</p>
                </div>
              ) : (
                <table className="selection-table">
                  <thead>
                    <tr>
                      <th style={{width: "70%"}}>ФИО</th>
                      <th style={{width: "30%"}}>Кафедра</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTeachers.map(teacher => (
                      <tr 
                        key={teacher.id} 
                        className="selection-row"
                        onClick={() => selectTeacher(teacher)}
                      >
                        <td className="fio-cell">
                          <strong>{teacher.fio || "ФИО не указано"}</strong>
                        </td>
                        <td className="department-cell">
                          {teacher.department || "Кафедра не указана"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="main-table-container">
        <div className="table-responsive">
          <table className="themes-table">
            <thead>
              <tr>
                <th style={{width: "60px"}}>№</th>
                <th style={{width: "30%"}}>Тема дипломной работы</th>
                <th style={{width: "25%"}}>Студент</th>
                <th style={{width: "100px"}}>Группа</th>
                <th style={{width: "25%"}}>Преподаватель</th>
                <th style={{width: "100px"}}>Статус</th>
                <th style={{width: "150px"}}>Действия</th>
              </tr>
            </thead>
            <tbody>
              {themes.length === 0 ? (
                <tr>
                  <td colSpan="7" className="empty-table">
                    <div className="empty-state">
                      <div className="empty-icon">📚</div>
                      <h3>Темы не добавлены</h3>
                      <p>Добавьте первую тему дипломной работы</p>
                    </div>
                  </td>
                </tr>
              ) : (
                themes.map(theme => (
                  <tr key={theme.id} className={theme.isTaken ? "taken-row" : "available-row"}>
                    <td className="theme-number">
                      <span className="number-badge">№{theme.number}</span>
                    </td>
                    
                    <td className="theme-title-cell">
                      {editingThemeId === theme.id ? (
                        <div className="editing-container">
                          <input
                            type="text"
                            className="edit-input"
                            value={editingText}
                            onChange={(e) => setEditingText(e.target.value)}
                            autoFocus
                          />
                          <div className="edit-actions">
                            <button 
                              className="btn btn-sm btn-success"
                              onClick={saveEditedTheme}
                            >
                              ✓
                            </button>
                            <button 
                              className="btn btn-sm btn-secondary"
                              onClick={cancelEditingTheme}
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="theme-title-wrapper">
                          <span className="theme-title">{theme.title}</span>
                          <button 
                            className="btn-icon edit-icon"
                            onClick={() => startEditingTheme(theme)}
                            title="Изменить тему"
                          >
                            ✏️
                          </button>
                        </div>
                      )}
                    </td>
                    
                    <td className="student-cell">
                      {theme.isTaken ? (
                        <div className="student-info">
                          <span className="student-fio">
                            {theme.studentFIO || "—"}
                          </span>
                          {theme.assignedDate && (
                            <div className="date-info">
                              Назначена: {formatDate(theme.assignedDate)}
                            </div>
                          )}
                        </div>
                      ) : (
                        <button 
                          className="btn btn-outline select-btn"
                          onClick={() => startSelectingStudent(theme.id)}
                          disabled={students.length === 0}
                          title={students.length === 0 ? "Нет студентов 4 курса" : "Выбрать студента 4 курса"}
                        >
                          {students.length === 0 ? "Нет студентов" : "Выбрать студента"}
                        </button>
                      )}
                    </td>
                    
                    <td className="group-cell">
                      {theme.isTaken ? (
                        <span className="group-badge">{theme.studentGroup}</span>
                      ) : (
                        <span className="empty-cell">—</span>
                      )}
                    </td>
                    
                    <td className="teacher-cell">
                      {theme.teacherFIO ? (
                        <div className="teacher-info">
                          <span className="teacher-fio">
                            {theme.teacherFIO || "—"}
                          </span>
                        </div>
                      ) : (
                        <button 
                          className="btn btn-outline select-btn"
                          onClick={() => startSelectingTeacher(theme.id)}
                          disabled={teachers.length === 0}
                          title={teachers.length === 0 ? "Нет преподавателей" : "Выбрать преподавателя"}
                        >
                          {teachers.length === 0 ? "Нет преп." : "Выбрать преп."}
                        </button>
                      )}
                    </td>
                    
                    <td className="status-cell">
                      <span className={`status-badge ${theme.isTaken ? 'taken' : 'available'}`}>
                        {theme.isTaken ? 'Занята' : 'Свободна'}
                      </span>
                    </td>
                    
                    <td className="actions-cell">
                      <div className="action-buttons">
                        {theme.isTaken ? (
                          <>
                            {!theme.teacherFIO && (
                              <button 
                                className="btn btn-sm btn-info"
                                onClick={() => startSelectingTeacher(theme.id)}
                                title="Назначить преподавателя"
                                disabled={teachers.length === 0}
                              >
                                👨‍🏫
                              </button>
                            )}
                            <button 
                              className="btn btn-sm btn-warning"
                              onClick={() => freeTheme(theme.id)}
                              title="Освободить тему"
                            >
                              🔄
                            </button>
                          </>
                        ) : (
                          <>
                            <button 
                              className="btn btn-sm btn-success"
                              onClick={() => startSelectingStudent(theme.id)}
                              title="Назначить студента 4 курса"
                              disabled={students.length === 0}
                            >
                              👨‍🎓
                            </button>
                            <button 
                              className="btn btn-sm btn-info"
                              onClick={() => startSelectingTeacher(theme.id)}
                              title="Назначить преподавателя"
                              disabled={teachers.length === 0}
                            >
                              👨‍🏫
                            </button>
                          </>
                        )}
                        
                        <button 
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDeleteTheme(theme.id)}
                          title="Удалить тему"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}