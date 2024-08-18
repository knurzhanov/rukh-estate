import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';

const CreateProperty = () => {
  const [url, setUrl] = useState('');
  const [data, setData] = useState({
    title: '',
    roomCount: '',
    area: '',
    floor: '',
    totalFloors: '',
    address: '',
    price: '',
    homeTitle: '',
    square: '',
    description: '',
    images: [],
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    setUrl(e.target.value);
  };

  const convertToFullSizeImage = (url) => {
    const fullSizeUrl = url.replace(/-\d+x\d+\.jpg$/, '-full.jpg');
    return fullSizeUrl;
  };

  const fetchData = async () => {
    if (!url) {
      setError('Введите ссылку!');
      return;
    }

    try {
      const response = await fetch(
        'https://api.allorigins.win/get?url=' + encodeURIComponent(url)
      );
      if (!response.ok) {
        throw new Error('Не успешный запрос');
      }

      const json = await response.json();
      const text = json.contents;

      const parser = new DOMParser();
      const doc = parser.parseFromString(text, 'text/html');

      const title =
        doc.querySelector('.offer__advert-title h1')?.textContent?.trim() || '';
      const price =
        doc.querySelector('.offer__price')?.textContent?.trim() || '';
      const square =
        doc.querySelector('[data-name="flat.floor"]')?.textContent?.trim() || '';
        const homeTitle =
        doc.querySelector('[data-name="map.complex"] a')?.textContent?.trim() || '';

      
    
      const descriptionHtml =
        doc.querySelector('.js-description.a-text.a-text-white-spaces')
          ?.innerHTML || '';
      const images = Array.from(
        doc.querySelectorAll('.gallery__container img')
      ).map((img) => convertToFullSizeImage(img.src));

      console.log('Parsed Data:', {
        title,
        price,
        square,
        homeTitle,
        descriptionHtml,
        images,
      });

      const titleRegex = /(\d+)-комнатная квартира, (\d+) м², (\d+)\/(\d+) этаж (помесячно|посуточно), (.+)/;
      const match = title.match(titleRegex);

      if (match) {
        const [_, roomCount, area, floor, totalFloors, leaseType, address] =
          match;
        setData({
          title: `${roomCount}-комнатная квартира, ${area} кв.м, ${floor}/${totalFloors} этаж, ${leaseType}, ${address}`,
          roomCount,
          area,
          floor,
          totalFloors,
          address,
          price,
          square,
          homeTitle,
          description: descriptionHtml,
          images,
        });
        console.log('Updated Data State:', {
          title: `${area} кв.м, ${floor}/${totalFloors} этаж, ${leaseType}, ${address}`,
          roomCount,
          area,
          floor,
          totalFloors,
          address,
          price,
          square,
          homeTitle,
          description: descriptionHtml,
          images,
        });
      } else {
        setError('Не удалось распарсить заголовок');
      }

      setError('');
    } catch (error) {
      console.log('Ошибка при получении данных:', error);
      setError('Ошибка при получении данных: ' + error.message);
      setData({
        title: '',
        roomCount: '',
        area: '',
        floor: '',
        totalFloors: '',
        address: '',
        price: '',
        square: '',
        description: '',
        homeTitle: '',
        images: [],
      });
    }
  };

  useEffect(() => {
    // Этот useEffect будет вызван после обновления data
    console.log('Data in useEffect:', data);
  }, [data]);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchData();
  };

  const handleAddToDb = async () => {
    if (!data.title || !data.price) {
      setError('Не все поля заполнены!');
      return;
    }

    try {
      console.log('Data to be sent:', data);
      // await axios.post('http://localhost:5000/add-product', data, {
      //   headers: {
      //     'Content-Type': 'application/json',
      //     // передаем токен в заголовке
      //   },
      // });
      await axios.post('https://rukh-estate-api-5571379c698a.herokuapp.com/add-product', data, {
        headers: {
          'Content-Type': 'application/json',
          // передаем токен в заголовке
        },
      });
      setSuccess('Данные успешно добавлены в базу данных!');
      setError('');
    } catch (error) {
      console.log('Ошибка при добавлении данных в базу данных:', error);
      setError('Ошибка при добавлении данных в базу данных: ' + error.message);
      setSuccess('');
    }
  };

  const handleInputChangeData = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <div className="App container">
      <div>
        <h1>RUKH-estate</h1>
        <form onSubmit={handleSubmit}>
          <div className="enterUrl">
            <label htmlFor="url">Введите URL:</label>
            <input
              id="url"
              type="text"
              value={url}
              onChange={handleInputChange}
              placeholder="Введите URL"
            />
          </div>
          <button className="urlBtn" type="submit">
            Получить данные
          </button>
          <hr />
        </form>
        <div>
          <h2>Название:</h2>
          <input
            type="text"
            name="title"
            value={data.title}
            onChange={handleInputChangeData}
          />
          <h2>ЖК:</h2>
          <input
            type="text"
            name="homeTitle"
            value={data.homeTitle}
            onChange={handleInputChangeData}
          />
          <h2>Комнатность:</h2>
          <input
            type="text"
            name="roomCount"
            value={data.roomCount}
            onChange={handleInputChangeData}
          />
          <h2>Площадь:</h2>
          <input
            type="text"
            name="area"
            value={data.area}
            onChange={handleInputChangeData}
          />
          <h2>Этаж:</h2>
          <input
            type="text"
            name="floor"
            value={data.floor}
            onChange={handleInputChangeData}
          />
          <h2>Всего этажей:</h2>
          <input
            type="text"
            name="totalFloors"
            value={data.totalFloors}
            onChange={handleInputChangeData}
          />
          <h2>Адрес:</h2>
          <input
            type="text"
            name="address"
            value={data.address}
            onChange={handleInputChangeData}
          />
          <h2>Цена:</h2>
          <input
            type="text"
            name="price"
            value={data.price}
            onChange={handleInputChangeData}
          />
          <h2>Описание:</h2>
          <textarea
            name="description"
            value={data.description}
            onChange={handleInputChangeData}
          />
        </div>
        <div>
          <h2>Фото:</h2>
          <div id="images">
            {data.images.length > 0 ? (
              data.images.map((src, index) => (
                <img
                  key={index}
                  src={src}
                  alt=""
                  style={{ maxWidth: '200px', margin: '10px' }}
                />
              ))
            ) : (
              <p>Нет фото</p>
            )}
          </div>
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
        <button onClick={handleAddToDb}>Добавить в базу данных</button>
      </div>
    </div>
  );
};

export default CreateProperty;
