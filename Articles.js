import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { ref, push, onValue } from "firebase/database"; // RTDB функциялары
import Styles from "./Styles";

export default function Articles({ onBack }) {
  const [articles, setArticles] = useState([]);
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");

  useEffect(() => {
    const articlesRef = ref(db, "articles");
    // Маалыматты реалдуу убакытта алуу
    onValue(articlesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        setArticles(list.reverse()); // Жаңыларын өйдө чыгаруу
      }
    });
  }, []);

  const handleAdd = () => {
    if (!title || !link) return alert("Толук толтуруңуз!");
    const articlesRef = ref(db, "articles");
    push(articlesRef, {
      title,
      link,
      createdAt: Date.now()
    });
    setTitle(""); setLink("");
  };

  return (
    <div style={Styles.mainPage}>
      <div style={Styles.mainMenuWrap}>
        <button style={Styles.backButton} onClick={onBack}>← Артка</button>
        <h2 style={Styles.title}>📄 Макалалар</h2>
        <input style={Styles.input} placeholder="Макаланын аты" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input style={Styles.input} placeholder="Шилтеме (URL)" value={link} onChange={(e) => setLink(e.target.value)} />
        <button style={Styles.button} onClick={handleAdd}>Базага сактоо</button>
        
        <div style={Styles.menuButtons}>
          {articles.map(art => (
            <div key={art.id} style={Styles.card}>
              <h3>{art.title}</h3>
              <a href={art.link} target="_blank" rel="noreferrer" style={Styles.link}>Окуу →</a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}