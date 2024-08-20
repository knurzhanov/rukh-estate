import React, { useState } from 'react';
import axios from 'axios';
import './Dashboard.css'; // Импорт стилей

const CreateUser = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Visitor'); // Default role
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset previous messages
    setError(null);
    setSuccess(null);

    try {
      console.log('Отправляем данные регистрации:', { username, email, password, role });
      const response = await axios.post('https://rukh-estate-api-5571379c698a.herokuapp.com/api/auth/register', {
        username,
        email,
        password,
        role,
      });
      setSuccess('Успешно!');
      setUsername('');
      setEmail('');
      setPassword('');
      setRole('Visitor'); // Reset role to default
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('Ошибка, попробуйте еще раз');
      }
    }
  };

  return (
   
    <form className="create-user-form" onSubmit={handleSubmit}>
       <h2>Регистрация</h2>
      <label className="form-label">
        Логин:
        <input
          className="form-input"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </label>
      <label className="form-label">
        Email:
        <input
          className="form-input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>
      <label className="form-label">
        Пароль:
        <input
          className="form-input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>
      <label className="form-label">
        Роль:
        <select
          className="form-select"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
        >
          <option value="Admin">Админ</option>
          <option value="Visitor">Посетитель</option>
        </select>
      </label>
      <button className="form-button" type="submit">Зарегистрировать</button>
      {error && <p className="form-error">{error}</p>}
      {success && <p className="form-success">{success}</p>}
    </form>
  );
};

export default CreateUser;
