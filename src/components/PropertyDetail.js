import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useCurrency } from '../components/CurrencyContext';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Fancybox from 'react-fancybox';
import '@fancyapps/ui/dist/fancybox/fancybox.css'; 

const PropertyDetail = () => {
  const { id } = useParams();
  const { currency } = useCurrency();
  const [property, setProperty] = useState(null);
  const [error, setError] = useState('');
  const [conversionRate, setConversionRate] = useState(1);
  const [currentSlide, setCurrentSlide] = useState(1);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await axios.get(`https://rukh-estate-api-5571379c698a.herokuapp.com/properties/${id}`);
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

  if (!property) return <p>Loading...</p>;
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
      {imagesToShow.length > 0 ? (
        <div className="image-slider">
          <div className="photo-counter">
            {currentSlide}/{imagesToShow.length}
          </div>
          <Slider {...settings}>
            {imagesToShow.map((src, index) => (
              <div key={index}>
                <Fancybox>
                  <img
                    src={src}
                    alt={`Property image ${index + 1}`}
                    style={{ maxWidth: '100%', height: 'auto', cursor: 'pointer' }}
                    data-fancybox="gallery"
                    data-src={src}
                  />
                </Fancybox>
              </div>
            ))}
          </Slider>
        </div>
      ) : (
        <p>No images available</p>
      )}
      <div className="property-header">
        <h2 className="price">{convertPrice(property.price)}/месяц</h2>
        <div className="property-location">
          <p>{property.roomCount} комнаты • {property.area} м² • помесячно • {property.address}</p>
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
