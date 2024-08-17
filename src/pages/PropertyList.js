import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { useCurrency } from '../components/CurrencyContext';
import './Main.css'

const PropertyList = () => {
  const { currency, setCurrency } = useCurrency();
  const location = useLocation();
  const { roomCount } = queryString.parse(location.search);
  const [properties, setProperties] = useState([]);
  const [sortedProperties, setSortedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [conversionRates, setConversionRates] = useState({ KZT: 1 });
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' for ascending, 'desc' for descending

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await axios.get('https://rukh-estate-api-5571379c698a.herokuapp.com/properties', {
          params: { roomCount: Number(roomCount) },
        });

        if (Array.isArray(response.data)) {
          const filteredProperties = Number(roomCount) >= 5
            ? response.data.filter(property => property.roomCount >= 5)
            : response.data;

          setProperties(filteredProperties);
        } else {
          setError('Неожиданный формат данных');
        }
      } catch (error) {
        setError('Ошибка при загрузке данных');
      } finally {
        setLoading(false);
      }
    };

    const fetchConversionRates = async () => {
      try {
        const response = await axios.get('https://api.exchangerate-api.com/v4/latest/KZT');
        setConversionRates(response.data.rates);
      } catch (error) {
        setError('Ошибка при загрузке курсов валют');
      }
    };

    if (roomCount !== undefined && roomCount !== null) {
      fetchProperties();
    } else {
      setProperties([]);
      setLoading(false);
    }

    fetchConversionRates();
  }, [roomCount, currency]);

  useEffect(() => {
    const sortProperties = () => {
      const sorted = [...properties].sort((a, b) => {
        const priceA = parseFloat(a.price.replace(/[^0-9.]/g, '')) || 0;
        const priceB = parseFloat(b.price.replace(/[^0-9.]/g, '')) || 0;

        if (sortOrder === 'asc') {
          return priceA - priceB;
        } else {
          return priceB - priceA;
        }
      });
      setSortedProperties(sorted);
    };

    sortProperties();
  }, [properties, sortOrder]);

  const convertPrice = (price) => {
    const numericPrice = parseFloat(price.replace(/[^0-9.]/g, ''));

    if (isNaN(numericPrice)) {
      return 'Неверная цена';
    }

    const rate = conversionRates[currency] || 1;
    const convertedPrice = (numericPrice * rate).toFixed(2);
    return convertedPrice;
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  return (
    <div>
      <div className='container'>
        <h1>Список недвижимости</h1>
        <div className='filter-flex'>
          <div>
            <label htmlFor="currency">Выберите валюту:</label>
            <select id="currency" value={currency} onChange={(e) => setCurrency(e.target.value)}>
              <option value="KZT">KZT</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="RUB">RUB</option>
            </select>
          </div>
          <div>
            <label htmlFor="sort">Сортировка цен:</label>
            <select id="sort" value={sortOrder} onChange={handleSortChange}>
              <option value="asc">по возрастанию</option>
              <option value="desc">по убыванию</option>
            </select>
          </div>
        </div>
      </div>
      <div className='grid-property container'>
        {loading ? (
          <p>Загрузка...</p>
        ) : error ? (
          <p style={{ color: 'red' }}>{error}</p>
        ) : sortedProperties.length > 0 ? (
          sortedProperties.map((property) => (
            <div className='property' key={property._id} style={{ marginBottom: '20px' }}>
              {property.images && property.images.length > 0 ? (
                <img
                  src={property.images[1]}
                  alt={property.title}
                />
              ) : (
                <p>Нет фото</p>
              )}
              <h2 className='property-title'>{property.title}</h2>
              <div className='price-btn'>
                <p>
                  Цена: {convertPrice(property.price)} {currency}
                </p>
                <Link to={`/properties/${property._id}`}>
                  <button>Подробнее</button>
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p>Нет доступных квартир для выбранного количества комнат.</p>
        )}
      </div>
    </div>
  );
};

export default PropertyList;
