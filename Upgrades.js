import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { ref, push, onValue } from "firebase/database";
import Styles from "./Styles";

export default function Upgrades({ onBack }) {
  const [upgrades, setUpgrades] = useState([]);
  const [course, setCourse] = useState("");
  const [year, setYear] = useState("");

  useEffect(() => {
    const upgradesRef = ref(db, "upgrades");
    onValue(upgradesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        setUpgrades(list.reverse());
      }
    });
  }, []);

  const handleAdd = () => {
    if (!course || !year) return alert("Бардык жерди толтуруңуз!");
    push(ref(db, "upgrades"), {
      course,
      year,
      timestamp: Date.now()
    });
    setCourse(""); setYear("");
  };

  return (
    <div style={Styles.mainPage}>
      <div style={Styles.mainMenuWrap}>
        <button style={Styles.backButton} onClick={onBack}>← Артка</button>
        <h2 style={Styles.title}>📈 Квалификацияны жогорулатуу</h2>
        
        <div style={{ marginBottom: "30px" }}>
          <input style={Styles.input} placeholder="Курстун аталышы..." value={course} onChange={(e) => setCourse(e.target.value)} />
          <input style={Styles.input} placeholder="Өткөн жылы..." value={year} onChange={(e) => setYear(e.target.value)} />
          <button style={Styles.button} onClick={handleAdd}>Маалыматты кошуу</button>
        </div>

        <div style={Styles.menuButtons}>
          {upgrades.map(u => (
            <div key={u.id} style={Styles.card}>
              <h3 style={{ margin: "0 0 5px 0" }}>{u.course}</h3>
              <p style={{ color: "#666", fontSize: "14px" }}>Жылы: {u.year}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}