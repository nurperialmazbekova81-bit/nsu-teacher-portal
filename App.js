import React, { useState } from "react";
import Styles from "./Styles";
import Login from "./Login";
import MainMenu from "./MainMenu";
import Groups from "./Groups";
import Courses from "./Courses";
import Students from "./Students";
import Teachers from "./Teachers";
import Schedule from "./Schedule";
import About from "./About";

// Firebase барактары
import Profile from "./Profile";
import DiplomaThemes from "./DiplomaThemes";
import Articles from "./Articles";
import Upgrades from "./Upgrades";
import Settings from "./Settings"; // <--- Жаңы импорт

export default function App() {
  const [page, setPage] = useState("login");
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    setIsAuthenticated(false);
    setSelectedGroup(null);
    setSelectedCourse(null);
    setShowMenu(false);
    setPage("login");
  };

  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      setPage("login");
      return null;
    }
    return children;
  };

  const renderPage = () => {
    switch (page) {
      case "login":
        return (
          <Login
            onLoginSuccess={() => {
              setIsAuthenticated(true);
              setPage("main");
            }}
          />
        );

      case "main":
        return (
          <ProtectedRoute>
            <div style={Styles.mainPage}>
              <div style={Styles.header}>
                <div style={Styles.headerRow}>
                  <button
                    style={Styles.hamburgerButton}
                    onClick={() => setShowMenu(!showMenu)}
                  >
                    ☰
                  </button>
                  <div style={Styles.headerText}>
                    <h1 style={Styles.headerTitle}>Нарынский государственный университет</h1>
                    <h2 style={Styles.headerSubtitle}>Аграрно-технический факультет</h2>
                    <h3 style={Styles.headerSubtitle}>Кафедра информационных технологий</h3>
                  </div>
                </div>
              </div>

              {/* Sidebar (Капталдагы меню) */}
              <div
                style={{
                  ...Styles.sidebar,
                  left: showMenu ? "0" : "-300px",
                  visibility: showMenu ? "visible" : "hidden",
                }}
              >
                <button
                  style={Styles.closeButton}
                  onClick={() => setShowMenu(false)}
                >
                  ✖
                </button>

                <ul style={Styles.sidebarMenu}>
                  <li style={Styles.sidebarItem} onClick={() => { setPage("profile"); setShowMenu(false); }}>👩‍🏫 Профиль</li>
                  <li style={Styles.sidebarItem} onClick={() => { setPage("diploma"); setShowMenu(false); }}>📑 Темы для дипломных работ</li>
                  <li style={Styles.sidebarItem} onClick={() => { setPage("articles"); setShowMenu(false); }}>📄 Статьи</li>
                  <li style={Styles.sidebarItem} onClick={() => { setPage("upgrades"); setShowMenu(false); }}>📈 Повышения</li>
                  {/* Настройки onClick кошулду */}
                  <li style={Styles.sidebarItem} onClick={() => { setPage("settings"); setShowMenu(false); }}>⚙️ Настройки</li>
                  <li style={Styles.sidebarItem} onClick={handleLogout}>🚪 Выйти</li>
                </ul>
              </div>

              <div style={Styles.content}>
                <MainMenu
                  onStudents={() => setPage("groups")}
                  onTeachers={() => setPage("teachers")}
                  onSchedule={() => setPage("schedule")}
                  onAbout={() => setPage("about")}
                  onLogout={handleLogout}
                />
              </div>
            </div>
          </ProtectedRoute>
        );

      case "profile":
        return <ProtectedRoute><Profile onBack={() => setPage("main")} /></ProtectedRoute>;

      case "diploma":
        return <ProtectedRoute><DiplomaThemes onBack={() => setPage("main")} /></ProtectedRoute>;

      case "articles":
        return <ProtectedRoute><Articles onBack={() => setPage("main")} /></ProtectedRoute>;

      case "upgrades":
        return <ProtectedRoute><Upgrades onBack={() => setPage("main")} /></ProtectedRoute>;

      case "settings": // <--- Жаңы кейс кошулду
        return <ProtectedRoute><Settings onBack={() => setPage("main")} /></ProtectedRoute>;

      case "groups":
        return (
          <ProtectedRoute>
            <Groups
              onBack={() => setPage("main")}
              onSelectGroup={(group) => {
                setSelectedGroup(group);
                setPage("courses");
              }}
            />
          </ProtectedRoute>
        );

      case "courses":
        return (
          <ProtectedRoute>
            <Courses
              group={selectedGroup}
              onBack={() => setPage("groups")}
              onSelectCourse={(course) => {
                setSelectedCourse(course);
                setPage("students");
              }}
            />
          </ProtectedRoute>
        );

      case "students":
        return (
          <ProtectedRoute>
            <Students
              group={selectedGroup}
              course={selectedCourse}
              onBack={() => setPage("courses")}
            />
          </ProtectedRoute>
        );

      case "teachers":
        return <ProtectedRoute><Teachers onBack={() => setPage("main")} /></ProtectedRoute>;

      case "schedule":
        return <ProtectedRoute><Schedule onBack={() => setPage("main")} /></ProtectedRoute>;

      case "about":
        return <About onBack={() => setPage("main")} />;

      default:
        return null;
    }
  };

  return (
    <div style={Styles.appWrap}>
      {renderPage()}
      <footer style={Styles.footer}>
        <p>© НГУ им. С. Нааматова — Кафедра информационных технологий</p>
        <p>
          Тех. поддержка:{" "}
          <a href="tel:+996501287308" style={Styles.link}>+996 501 287 308</a> |{" "}
          <a href="https://wa.me/996501287308" style={Styles.link}>WhatsApp</a>
        </p>
        <p>Сайт: <a href="https://www.nsu.kg" style={Styles.link} target="_blank" rel="noopener noreferrer">nsu.kg</a></p>
      </footer>
    </div>
  );
}