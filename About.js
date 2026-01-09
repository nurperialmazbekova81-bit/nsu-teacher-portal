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

export default function App() {
  const [page, setPage] = useState("login");
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showMenu, setShowMenu] = useState(false); // бурчтагы меню ачуу/жабуу

  const handleLogout = () => {
    setIsAuthenticated(false);
    setSelectedGroup(null);
    setSelectedCourse(null);
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
                <div style={Styles.headerLeft}>
                  <h1 style={Styles.headerTitle}>Нарынский государственный университет</h1>
                  <h2 style={Styles.headerSubtitle}>Аграрно-технический факультет</h2>
                  <h3 style={Styles.headerSubtitle}>Кафедра информационных технологий</h3>
                </div>

                {/* Бурчтагы меню кнопкасы */}
                <div style={Styles.headerRight}>
                  <button
                    style={Styles.menuButton}
                    onClick={() => setShowMenu(!showMenu)}
                  >
                    ☰
                  </button>
                  {showMenu && (
                    <ul style={Styles.dropdownMenu}>
                      <li style={Styles.dropdownItem}>👩‍🏫 Профиль</li>
                      <li style={Styles.dropdownItem}>📑 Темы для дипломных работ</li>
                      <li style={Styles.dropdownItem}>📄 Статьи</li>
                      <li style={Styles.dropdownItem}>📈 Повышения</li>
                      <li style={Styles.dropdownItem}>⚙️ Настройки</li>
                      <li
                        style={Styles.dropdownItem}
                        onClick={handleLogout}
                      >
                        🚪 Выйти
                      </li>
                    </ul>
                  )}
                </div>
              </div>

              <MainMenu
                onStudents={() => setPage("groups")}
                onTeachers={() => setPage("teachers")}
                onSchedule={() => setPage("schedule")}
                onAbout={() => setPage("about")}
                onLogout={handleLogout}
              />
            </div>
          </ProtectedRoute>
        );

      case "groups":
        return (
          <ProtectedRoute>
            <Groups
              onBack={() => {
                setSelectedGroup(null);
                setSelectedCourse(null);
                setPage("main");
              }}
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
              onBack={() => {
                setSelectedCourse(null);
                setPage("groups");
              }}
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
        return (
          <ProtectedRoute>
            <Teachers onBack={() => setPage("main")} />
          </ProtectedRoute>
        );

      case "schedule":
        return (
          <ProtectedRoute>
            <Schedule onBack={() => setPage("main")} />
          </ProtectedRoute>
        );

      case "about":
        return <About onBack={() => setPage("main")} />;

      default:
        setPage("login");
        return null;
    }
  };

  return (
    <div style={Styles.appWrap}>
      <div style={Styles.content}>{renderPage()}</div>

      <footer style={Styles.footer}>
        <p>© НГУ им. С. Нааматова — Кафедра информационных технологий</p>
        <p>
          Тех. поддержка:{" "}
          <a href="tel:+996501287308" style={Styles.link}>
            +996 501 287 308
          </a>{" "}
          |{" "}
          <a href="https://wa.me/996501287308" style={Styles.link}>
            WhatsApp
          </a>
        </p>
        <p>
          Сайт:{" "}
          <a
            href="https://www.nsu.kg"
            style={Styles.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            nsu.kg
          </a>
        </p>
        <p>Все права защищены.</p>
      </footer>
    </div>
  );
}
