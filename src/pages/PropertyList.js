import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
        // const response = await axios.get('http://localhost:5000/properties', {
        //   params: { roomCount: Number(roomCount) },
        // });
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
        setError('Нет доступных квартир');
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
  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1); // Перенаправляет на предыдущую страницу
  };

  return (
    <div>
      <div className='container'>
      
      <h2 className='property-list--block'><span className='back-link'><a onClick={handleBack}><svg width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="14.5" cy="14.5" r="14.5" fill="#EEEEEE"/>
<path d="M7.64587 14.6464C7.45061 14.8417 7.45061 15.1583 7.64587 15.3536L10.8278 18.5355C11.0231 18.7308 11.3397 18.7308 11.535 18.5355C11.7302 18.3403 11.7302 18.0237 11.535 17.8284L8.70653 15L11.535 12.1716C11.7302 11.9763 11.7302 11.6597 11.535 11.4645C11.3397 11.2692 11.0231 11.2692 10.8278 11.4645L7.64587 14.6464ZM20.041 14.5L7.99942 14.5V15.5L20.041 15.5V14.5Z" fill="#282828"/>
</svg>

</a></span>Подобранные варианты</h2>
 
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
            <label className='sort-label' htmlFor="sort">Сортировка цен:</label>
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

             
              <Link to={`/properties/${property._id}`}>
              <h2 className='property-title'>{property.title}</h2>
              </Link>
              
              <div className='price-btn'>
                <p>
                  Цена: {convertPrice(property.price)} {currency}
                </p>
                
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
