import React from "react";
import Styles from "./Styles";

export default function MainMenu({ onStudents, onTeachers, onSchedule, onAbout }) {
  return (
    <div style={Styles.mainPage}>
      <div style={Styles.mainMenuWrap}>
        <h2 style={Styles.title}>Башкы меню</h2>
        
        <div style={Styles.menuButtons}>
          <button style={Styles.button} onClick={onStudents}>
            <span style={{fontSize: "30px"}}>🎓</span>
            Студенты
          </button>
          <button style={Styles.button} onClick={onTeachers}>
            <span style={{fontSize: "30px"}}>👨‍🏫</span>
            Преподаватели
          </button>
          <button style={Styles.button} onClick={onSchedule}>
            <span style={{fontSize: "30px"}}>📅</span>
            Расписание группы
          </button>
          <button style={Styles.button} onClick={onAbout}>
            <span style={{fontSize: "30px"}}>ℹ️</span>
            О кафедре
          </button>
        </div>
      </div>
    </div>
  );
}