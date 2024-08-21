import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const PropertyList = ({ roomCount }) => {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true)
      setError('')

      try {
        // Определение параметров запроса
        const params = roomCount ? { roomCount: Number(roomCount) } : {}

  
        // const response = await axios.get('http://localhost:5000/properties', {
        //   params,
        // })
        const response = await axios.get('https://rukh-estate-api-5571379c698a.herokuapp.com/properties', {
          params,
        })

        console.log('Response data:', response.data)

        if (Array.isArray(response.data)) {
          setProperties(response.data)
        } else {
          console.error('Unexpected data format:', response.data)
          setError('Неожиданный формат данных')
        }
      } catch (error) {
        console.error('Fetch error:', error)
        setError('Ошибка при загрузке данных')
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()
  }, [roomCount])

  return (
    <div>
      <h1>Список недвижимости</h1>
      {loading ? (
        <p>Загрузка...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : properties.length > 0 ? (
        properties.map((property) => (
          <div key={property._id} style={{ marginBottom: '20px' }}>
            <h2>{property.title}</h2>
            {property.images && property.images.length > 0 ? (
              <img
                src={property.images[0]}
                alt={property.title}
                style={{ width: '150px', height: 'auto' }}
              />
            ) : (
              <p>Нет фото</p>
            )}
            <p>Цена: {property.price}</p>
            <Link to={`/properties/${property._id}`}>
              <button>Подробнее</button>
            </Link>
          </div>
        ))
      ) : (
        <p>Нет доступных квартир для выбранного количества комнат.</p>
      )}
    </div>
  )
}

export default PropertyList
