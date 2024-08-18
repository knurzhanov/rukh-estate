import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditProperty = () => {
  const { id } = useParams(); // Получаем ID из URL
  const navigate = useNavigate(); // Используем useNavigate для навигации
  const [property, setProperty] = useState({
    title: '',
    roomCount: '',
    area: '',
    floor: '',
    totalFloors: '',
    address: '',
    price: '',
    square: '',
    description: ''
  });

  // Получение данных о квартире при монтировании компонента
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await axios.get(`/properties/${id}`);
        setProperty(response.data);
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      }
    };

    fetchProperty();
  }, [id]);

  // Обработка изменений в текстовых полях
  const handleChange = (e) => {
    setProperty({ ...property, [e.target.name]: e.target.value });
  };

  

 
  // Удаление поля для изображения
  
  // Отправка данных на сервер при сохранении изменений
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/properties/${id}`, property);
      navigate('/listing'); // Редирект на список объектов после сохранения
    } catch (error) {
      console.error('Ошибка при сохранении данных:', error);
    }
  };

  return (
    <div>
      <h2>Редактирование Квартиры</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Название</label>
          <input
            type="text"
            name="title"
            value={property.title}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Количество Комнат</label>
          <input
            type="text"
            name="roomCount"
            value={property.roomCount}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Площадь</label>
          <input
            type="text"
            name="area"
            value={property.area}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Этаж</label>
          <input
            type="text"
            name="floor"
            value={property.floor}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Всего Этажей</label>
          <input
            type="text"
            name="totalFloors"
            value={property.totalFloors}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Адрес</label>
          <input
            type="text"
            name="address"
            value={property.address}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Цена</label>
          <input
            type="text"
            name="price"
            value={property.price}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Общая Площадь</label>
          <input
            type="text"
            name="square"
            value={property.square}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Описание</label>
          <textarea
            name="description"
            value={property.description}
            onChange={handleChange}
          />
        </div>
       
        <button type="submit">Сохранить Изменения</button>
      </form>
    </div>
  );
};

export default EditProperty;
