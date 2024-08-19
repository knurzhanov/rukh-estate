import React from 'react';
import { Navigate } from 'react-router-dom';
import { useCurrency } from './CurrencyContext';

const PrivateRoute = ({ children, requiredRole }) => {
  const { user, isLoading } = useCurrency();

  console.log('User:', user);
  console.log('IsLoading:', isLoading);

  if (isLoading) {
    // Пока данные о пользователе загружаются, показываем индикатор загрузки
    return <div>Loading...</div>;
  }

  if (!user) {
    // Если пользователь не авторизован, перенаправляем на страницу входа
    console.log('Redirecting to login...');
    return <Navigate to="/" />;
  }

  if (requiredRole && user.role !== requiredRole) {
    // Если роль пользователя не соответствует необходимой, перенаправляем на страницу без доступа
    console.log('Redirecting to non-access...');
    return <Navigate to="/non-access" />;
  }

  // Если пользователь авторизован и его роль соответствует требуемой (или роль не требуется), рендерим дочерние компоненты
  return children;
};

export default PrivateRoute;
