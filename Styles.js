const Styles = {
  // --- Негизги контейнер ---
  appWrap: {
    minHeight: "100vh",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: "#333",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    background: "linear-gradient(to bottom, #f9fafb, #e5e7eb)",
  },

  content: {
    flex: 1,
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },

  // --- Хедер жана гамбургер меню (Оңдолгон бөлүм) ---
  header: {
    backgroundColor: "#1e3a8a",
    color: "#fff",
    padding: "15px 20px",
    width: "100%",
    boxSizing: "border-box",
  },

  headerRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center", // Мазмунду борборго түртөт
    position: "relative",      // Бургерди абсолюттук жайгаштыруу үчүн
    minHeight: "80px",
  },

  headerText: {
    textAlign: "center",
    flex: 1,
    padding: "0 40px", // Текст бургердин астында калбашы үчүн
  },

  headerTitle: {
    fontSize: "24px",
    fontWeight: "bold",
    margin: "5px 0",
  },

  headerSubtitle: {
    fontSize: "16px",
    margin: "2px 0",
    opacity: 0.9,
  },

  hamburgerButton: {
    position: "absolute", // Текстке тоскоол болбошу үчүн
    left: "0px",          // Сол тарапка бекитилет
    backgroundColor: "transparent",
    border: "none",
    fontSize: "30px",
    color: "#fff",
    cursor: "pointer",
    zIndex: 10,
  },

  // --- Sidebar (Жашыруу логикасы менен) ---
  sidebar: {
    position: "fixed",
    top: 0,
    // Анимация App.js'деги 'left' мааниси аркылуу башкарылат
    width: "260px",
    height: "100vh",
    backgroundColor: "#fff",
    color: "#111",
    padding: "20px",
    boxShadow: "4px 0 15px rgba(0,0,0,0.2)",
    zIndex: 2000,
    transition: "left 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    display: "flex",
    flexDirection: "column",
  },

  closeButton: {
    alignSelf: "flex-end", // "X" белгисин оң жакка коёт
    backgroundColor: "transparent",
    border: "none",
    fontSize: "24px",
    color: "#111",
    cursor: "pointer",
    marginBottom: "20px",
  },

  sidebarMenu: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },

  sidebarItem: {
    padding: "15px 12px",
    borderBottom: "1px solid #eee",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    textTransform: "uppercase",
    transition: "background 0.2s",
    color: "#333",
  },

  // --- Башкы беттин ортодогу блогу ---
  mainMenuWrap: {
    width: "100%",
    maxWidth: "500px",
    margin: "20px auto",
    padding: "30px",
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
    textAlign: "center",
  },

  menuButtons: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginTop: "25px",
  },

  // --- Кнопкалар ---
  button: {
    padding: "14px 20px",
    fontSize: "16px",
    fontWeight: "600",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    background: "#2563eb",
    color: "#fff",
    transition: "0.3s transform ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
  },

  // --- Footer ---
  footer: {
    textAlign: "center",
    padding: "25px",
    fontSize: "13px",
    backgroundColor: "#f3f4f6",
    color: "#6b7280",
    borderTop: "1px solid #e5e7eb",
  },

  link: {
    color: "#2563eb",
    textDecoration: "none",
    fontWeight: "500",
  },

  
  tableSmall: { width: "95%", margin: "20px auto", borderCollapse: "collapse", background: "#fff" },
  thSmall: { padding: "12px", backgroundColor: "#2563eb", color: "#fff" },
  tdSmall: { padding: "12px", borderBottom: "1px solid #eee" },
  input: { width: "100%", padding: "12px", margin: "10px 0", borderRadius: "8px", border: "1px solid #ddd" },
};



export default Styles;