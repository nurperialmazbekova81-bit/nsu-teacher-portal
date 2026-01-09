import React, { useState } from "react";
import Styles from "./Styles";

export default function Login({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!email || !password) {
      setError("Заполните все обязательные поля");
      return;
    }

    if (!isLogin) {
      if (password !== confirmPassword) {
        setError("Пароли не совпадают");
        return;
      }
      if (password.length < 6) {
        setError("Пароль должен быть не менее 6 символов");
        return;
      }
    }

    setLoading(true);

    // Простая проверка для демо
    setTimeout(() => {
      setLoading(false);
      
      if (isLogin) {
        // Просто проверяем что пароль не пустой
        if (password.trim() !== "") {
          onLoginSuccess();
        } else {
          setError("Введите пароль");
        }
      } else {
        // Регистрация успешна
        alert("Регистрация успешна! Теперь вы можете войти.");
        setIsLogin(true);
        setPassword("");
        setConfirmPassword("");
        setShowPassword(false);
        setShowConfirmPassword(false);
      }
    }, 800);
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    setShowConfirmPassword(false);
    setError("");
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f5f7fa',
      padding: '20px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '450px',
        backgroundColor: 'white',
        borderRadius: '15px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        {/* Заголовок */}
        <div style={{
          backgroundColor: '#3949ab',
          padding: '30px 20px',
          textAlign: 'center',
          color: 'white'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '15px' }}>
            {isLogin ? '🔐' : '📝'}
          </div>
          <h1 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            margin: 0,
            marginBottom: '5px'
          }}>
            {isLogin ? 'Авторизация' : 'Регистрация'}
          </h1>
          <p style={{
            fontSize: '14px',
            margin: 0,
            opacity: 0.9
          }}>
            Система управления кафедрой информационных технологий
          </p>
        </div>

        {/* Форма */}
        <form onSubmit={handleSubmit} style={{ padding: '30px' }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#333',
              fontWeight: '500',
              fontSize: '14px'
            }}>
              Email <span style={{color: '#dc3545'}}>*</span>
            </label>
            <input
              type="email"
              style={{
                ...Styles.select,
                width: '100%',
                padding: '12px 15px',
                fontSize: '16px',
                backgroundColor: 'white',
                border: '1px solid #ddd',
                borderRadius: '8px',
                boxSizing: 'border-box'
              }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              required
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#333',
              fontWeight: '500',
              fontSize: '14px'
            }}>
              Пароль <span style={{color: '#dc3545'}}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? "text" : "password"}
                style={{
                  ...Styles.select,
                  width: '100%',
                  padding: '12px 45px 12px 15px',
                  fontSize: '16px',
                  backgroundColor: 'white',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  boxSizing: 'border-box',
                  fontFamily: showPassword ? 'inherit' : 'monospace'
                }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isLogin ? "Введите пароль" : "Создайте пароль"}
                required
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '18px',
                  color: '#666',
                  padding: '5px'
                }}
                title={showPassword ? "Скрыть пароль" : "Показать пароль"}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {!isLogin && (
              <div style={{
                fontSize: '11px',
                color: '#666',
                marginTop: '5px'
              }}>
                Минимум 6 символов
              </div>
            )}
          </div>

          {!isLogin && (
            <div style={{ marginBottom: '25px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#333',
                fontWeight: '500',
                fontSize: '14px'
              }}>
                Подтвердите пароль <span style={{color: '#dc3545'}}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  style={{
                    ...Styles.select,
                    width: '100%',
                    padding: '12px 45px 12px 15px',
                    fontSize: '16px',
                    backgroundColor: 'white',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    boxSizing: 'border-box',
                    fontFamily: showConfirmPassword ? 'inherit' : 'monospace'
                  }}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Повторите пароль"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '18px',
                    color: '#666',
                    padding: '5px'
                  }}
                  title={showConfirmPassword ? "Скрыть пароль" : "Показать пароль"}
                >
                  {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>
          )}

          {error && (
            <div style={{
              backgroundColor: '#ffebee',
              color: '#c62828',
              padding: '12px 15px',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '14px',
              border: '1px solid #ffcdd2',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <span style={{ fontSize: '16px' }}>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '14px',
              fontSize: '16px',
              fontWeight: 'bold',
              backgroundColor: isLogin ? '#3949ab' : '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '10px',
              transition: 'background-color 0.3s',
              marginBottom: '15px'
            }}
            disabled={loading}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = isLogin ? '#303f9f' : '#218838';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = isLogin ? '#3949ab' : '#28a745';
            }}
          >
            {loading ? (
              <>
                <span style={{
                  display: 'inline-block',
                  width: '16px',
                  height: '16px',
                  border: '2px solid #fff',
                  borderTopColor: 'transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></span>
                {isLogin ? 'Вход...' : 'Регистрация...'}
              </>
            ) : (
              <>
                {isLogin ? '🔐 Войти в систему' : '📝 Зарегистрироваться'}
              </>
            )}
          </button>

          <div style={{
            textAlign: 'center',
            padding: '15px 0',
            borderTop: '1px solid #eee',
            marginTop: '15px'
          }}>
            <p style={{
              margin: 0,
              color: '#666',
              fontSize: '14px'
            }}>
              {isLogin ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}
              <button
                type="button"
                onClick={toggleMode}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#3949ab',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  marginLeft: '5px',
                  fontSize: '14px',
                  textDecoration: 'underline',
                  padding: '0'
                }}
              >
                {isLogin ? 'Создать аккаунт' : 'Войти'}
              </button>
            </p>
          </div>
        </form>

        {/* Информация о системе */}
        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '20px',
          borderTop: '1px solid #e9ecef',
          fontSize: '13px',
          color: '#495057',
          textAlign: 'center'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginBottom: '10px'
          }}>
            <span style={{ fontSize: '16px' }}>🏛️</span>
            <div>
              <strong>Нарынский Государственный Университет</strong>
              <div style={{ fontSize: '12px', color: '#6c757d' }}>
                Кафедра информационных технологий
              </div>
            </div>
          </div>
          <div style={{ fontSize: '11px', color: '#6c757d' }}>
            Система управления студентами и расписанием
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        button[type="button"]:hover {
          color: #1a237e;
          opacity: 0.8;
        }
      `}</style>
    </div>
  );
}