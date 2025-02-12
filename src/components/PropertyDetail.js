import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCurrency } from '../components/CurrencyContext';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Fancybox from '../Fancybox';

const PropertyDetail = () => {
  const { id } = useParams();
  const { currency } = useCurrency();
  const [property, setProperty] = useState(null);
  const [error, setError] = useState('');
  const [conversionRate, setConversionRate] = useState(1);
  const [currentSlide, setCurrentSlide] = useState(1);
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // Перенаправляет на предыдущую страницу
  };

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await axios.get(`https://rukh-ba6f8acf2ce2.herokuapp.com/properties/${id}`);
        setProperty(response.data);
      } catch (error) {
        setError('Error fetching property details: ' + error.message);
      }
    };

    const fetchConversionRate = async () => {
      try {
        const response = await axios.get('https://api.exchangerate-api.com/v4/latest/KZT');
        setConversionRate(response.data.rates[currency] || 1);
      } catch (error) {
        setError('Error fetching conversion rates: ' + error.message);
      }
    };

    fetchProperty();
    fetchConversionRate();
  }, [id, currency]);

  if (!property) return <p>Загрузка...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  const convertPrice = (price) => {
    const numericPrice = parseFloat(price.replace(/[^0-9.]/g, ''));
    if (isNaN(numericPrice)) return 'Invalid price';
    const convertedPrice = (numericPrice * conversionRate).toFixed(2);
    return convertedPrice;
  };

  const imagesToShow = property.images.slice(1);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: false,
    beforeChange: (current, next) => setCurrentSlide(next + 1),
  };

  const whatsappMessage = `Я выбрал это: ${window.location.href}`;

  return (
    <div className="property-detail">
      <div className='property-first_block'>
        <a onClick={handleBack}><svg width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="14.5" cy="14.5" r="14.5" fill="#EEEEEE"/>
<path d="M7.64587 14.6464C7.45061 14.8417 7.45061 15.1583 7.64587 15.3536L10.8278 18.5355C11.0231 18.7308 11.3397 18.7308 11.535 18.5355C11.7302 18.3403 11.7302 18.0237 11.535 17.8284L8.70653 15L11.535 12.1716C11.7302 11.9763 11.7302 11.6597 11.535 11.4645C11.3397 11.2692 11.0231 11.2692 10.8278 11.4645L7.64587 14.6464ZM20.041 14.5L7.99942 14.5V15.5L20.041 15.5V14.5Z" fill="#282828"/>
</svg>

</a>
      <h2 className="price">{convertPrice(property.price)}{currency}</h2>
      </div>
      {imagesToShow.length > 0 ? (
        <div className="image-slider">
          <Fancybox options={{ Carousel: { infinite: false } }}>
            <Slider {...settings}>
              {imagesToShow.map((src, index) => (
                <div key={index}>
                  <img
                    src={src}
                    alt={`Property image ${index + 1}`}
                    style={{ maxWidth: '100%', height: 'auto', cursor: 'pointer' }}
                    data-fancybox="gallery"
                    data-src={src}
                  />
                </div>
              ))}
            </Slider>
          </Fancybox>
          <div className="image-counter">
            {currentSlide} / {imagesToShow.length}
          </div>
        </div>
      ) : (
        <p>Нет фотографии</p>
      )}
      <div className="property-header">
        <div className="property-location">
          <p>{property.roomCount} комнаты • {property.area} м² • {property.address}</p>
        </div>
        <div className="property-location">
          <p>Название ЖК: {property.homeTitle}</p>
        </div>
      </div>
      <div className="property-description">
        <h3>Описание</h3>
        <p>{property.description || 'Нет описания'}</p>
      </div>
      <div className="whatsapp-button">
        <a 
          href={`https://wa.me/77770100072?text=${encodeURIComponent(whatsappMessage)}`} 
          target="_blank" 
          rel="noopener noreferrer"
        >
          Написать на WhatsApp
        </a>
      </div>
    </div>
  );
};

export default PropertyDetail;
