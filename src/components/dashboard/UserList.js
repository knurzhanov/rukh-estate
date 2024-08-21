import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Dashboard.css'; // Импорт стилей

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [passwords, setPasswords] = useState({});
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('https://rukh-estate-api-5571379c698a.herokuapp.com/api/auth/users');
        setUsers(response.data);
      } catch (error) {
        setError('Ошибка при получении списка: ' + error.message);
      }
    };
  
    fetchUsers();
  }, []);
  

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`https://rukh-estate-api-5571379c698a.herokuapp.com/api/auth/users/${userId}`);
      setUsers(users.filter(user => user._id !== userId));
      setSuccess('Успешно удалено');
    } catch (error) {
      setError('Ошибка при удалений: ' + error.message);
    }
  };

  const handleChangePassword = async (userId) => {
    try {
      const password = passwords[userId] || ''; // Получаем пароль для данного пользователя
      await axios.put(`https://rukh-estate-api-5571379c698a.herokuapp.com/api/auth/users/${userId}/password`, { password });
      setSuccess('Пароль успешно обновлен');
      setPasswords({ ...passwords, [userId]: '' }); // Очищаем пароль после успешного обновления
    } catch (error) {
      setError('Ошибка' + error.message);
    }
  };

  const handlePasswordChange = (userId, value) => {
    setPasswords({ ...passwords, [userId]: value });
  };

  return (
    <div className="user-list-container">
      <h2 className="user-list-title">Список пользователей</h2>
      {error && <p className="user-list-error">{error}</p>}
      {success && <p className="user-list-success">{success}</p>}
      <table className="user-list-table">
        <thead>
          <tr>
            <th>Логин</th>
            <th>Роль</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td>{user.username}</td>
              <td>{user.role}</td>
              <td>
                <button className="user-list-button" onClick={() => handleDelete(user._id)}>Удалить</button>
                <form
                  className="user-password-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleChangePassword(user._id);
                  }}
                >
                  <input
                    className="user-password-input"
                    type="password"
                    placeholder="Новый пароль"
                    value={passwords[user._id] || ''}
                    onChange={(e) => handlePasswordChange(user._id, e.target.value)}
                    required
                  />
                  <button className="user-password-button" type="submit">Сменить пароль</button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
