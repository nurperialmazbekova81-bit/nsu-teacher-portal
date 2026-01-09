import React, { useState } from "react";
import Styles from "./Styles";

export default function Groups({ onSelectGroup, onBack }) {
  const [editing, setEditing] = useState(false);
  const [groups, setGroups] = useState([
    { code: "ИВТ", name: "Информатика и вычислительная техника", active: true },
    { code: "ПИЭ", name: "Прикладная информатика в экономике", active: true },
  ]);

  const toggleGroupActive = (code) => {
    setGroups(groups.map(group => 
      group.code === code ? { ...group, active: !group.active } : group
    ));
  };

  return (
    <div style={Styles.mainMenuWrap}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '25px' 
      }}>
        <h2 style={Styles.title}>
          {editing ? "Управление группами" : "Выберите группу"}
        </h2>
        
        <button
          style={{
            ...(editing ? Styles.buttonDanger : Styles.button),
            padding: '10px 15px',
            fontSize: '14px'
          }}
          onClick={() => setEditing(!editing)}
        >
          {editing ? "✖ Отмена" : "✎ Изменить"}
        </button>
      </div>

      {editing ? (
        // РЕДАКТИРОВАНИЕ
        <div>
          <p style={{ 
            marginBottom: "20px", 
            color: "#666",
            padding: '10px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px'
          }}>
            Нажмите кнопку чтобы скрыть или показать группу в основном меню
          </p>

          <div style={{ marginBottom: "30px" }}>
            {groups.map((group) => (
              <div
                key={group.code}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '18px',
                  marginBottom: '12px',
                  backgroundColor: group.active ? '#e8f5e9' : '#f5f5f5',
                  border: `2px solid ${group.active ? '#4caf50' : '#9e9e9e'}`,
                  borderRadius: '10px',
                  transition: 'all 0.3s ease'
                }}
              >
                <div>
                  <div style={{ 
                    fontSize: '18px', 
                    fontWeight: 'bold', 
                    color: group.active ? '#2e7d32' : '#757575',
                    marginBottom: '5px'
                  }}>
                    {group.code}
                  </div>
                  <div style={{ 
                    color: group.active ? '#555' : '#aaa',
                    fontSize: '14px'
                  }}>
                    {group.name}
                  </div>
                </div>
                
                <button
                  onClick={() => toggleGroupActive(group.code)}
                  style={{
                    backgroundColor: group.active ? '#ff9800' : '#4caf50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '8px 20px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    minWidth: '100px'
                  }}
                >
                  {group.active ? "Скрыть" : "Показать"}
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        // ОСНОВНОЙ ВЫБОР
        <div>
          <p style={{ 
            marginBottom: "30px", 
            color: "#555", 
            fontSize: "16px",
            textAlign: 'center'
          }}>
            Выберите направление обучения:
          </p>

          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '18px', 
            maxWidth: '500px', 
            margin: '0 auto 40px auto' 
          }}>
            {groups
              .filter(group => group.active)
              .map((group) => (
                <button
                  key={group.code}
                  style={{
                    ...Styles.button,
                    textAlign: 'left',
                    padding: '22px 25px',
                    fontSize: '16px',
                    display: 'block',
                    width: '100%',
                    border: '2px solid #e0e0e0',
                    backgroundColor: '#ffffff',
                    color: '#333',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => onSelectGroup(group.code)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f0f7ff';
                    e.currentTarget.style.borderColor = '#4a90e2';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#ffffff';
                    e.currentTarget.style.borderColor = '#e0e0e0';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{ 
                    fontSize: '20px', 
                    fontWeight: 'bold', 
                    marginBottom: '8px',
                    color: '#1a73e8'
                  }}>
                    {group.code}
                  </div>
                  <div style={{ 
                    fontSize: '15px', 
                    color: '#666',
                    lineHeight: '1.4'
                  }}>
                    {group.name}
                  </div>
                </button>
              ))}
          </div>
        </div>
      )}

      <div style={{ 
        marginTop: "30px", 
        paddingTop: "20px", 
        borderTop: "1px solid #eee" 
      }}>
        <button 
          style={{
            ...Styles.backButton,
            padding: '10px 25px'
          }} 
          onClick={onBack}
        >
          ← Назад
        </button>
      </div>
    </div>
  );
}