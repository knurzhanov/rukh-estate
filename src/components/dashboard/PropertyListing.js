import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';

const PropertyListing = () => {
  const [properties, setProperties] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Получение списка квартир из базы данных
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get('http://localhost:5000/properties');
        setProperties(response.data);
      } catch (error) {
        console.log('Ошибка при получении данных:', error);
        setError('Ошибка при получении данных: ' + error.message);
      }
    };

    fetchProperties();
  }, []);

  // Удаление квартиры
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/properties/${id}`);
      setProperties(properties.filter((property) => property._id !== id));
      setSuccess('Квартира успешно удалена!');
    } catch (error) {
      console.log('Ошибка при удалении:', error);
      setError('Ошибка при удалении: ' + error.message);
    }
  };
  
  // Переход на страницу редактирования
  const handleEdit = (id) => {
    // Предположим, что у вас есть страница редактирования по URL /edit/:id
    window.location.href = `/edit/${id}`;
  };

  return (
    <div className="App container">
      <h1>Cписок квартир</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <table className="property-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Название</th>
            <th>Комнатность</th>
            <th>Площадь</th>
            <th>Этаж</th>
            <th>Цена</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {properties.map((property) => (
            <tr key={property._id}>
              <td>{property._id}</td>
              <td>{property.title}</td>
              <td>{property.roomCount}</td>
              <td>{property.area}</td>
              <td>{property.floor}</td>
              <td>{property.price}</td>
              <td>
                <button onClick={() => handleEdit(property._id)}>Редактировать</button>
                <button onClick={() => handleDelete(property._id)}>Удалить</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PropertyListing;
