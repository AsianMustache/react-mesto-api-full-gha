import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register({ onRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      return;
    }
    onRegister(email, password).then(() => {
      navigate("/sign-in");
    });
  };

  return (
    <div className="register">
      <h2 className="register__title">Регистрация</h2>
      <form onSubmit={handleSubmit}>
        <label className="register__label">
          <input
            type="text"
            id="email"
            name="email"
            placeholder="Email"
            className="register__input-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            minLength="2"
            maxLength="40"
            required
          />
          <div className="register__line"></div>
        </label>
        <label className="register__label">
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Пароль"
            className="register__input-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength="2"
            maxLength="200"
            required
          />
          <div className="register__line"></div>
        </label>
        <button className="register__button-signup">Зарегистрироваться</button>
        <p className="register__text">
          Уже зарегистрированы?{" "}
          <Link to="/sign-in" className="register__login">
            Войти
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
