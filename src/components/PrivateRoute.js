import React from 'react';
import { Navigate } from 'react-router-dom';
import { useCurrency } from './CurrencyContext';

const PrivateRoute = ({ children, requiredRole }) => {
  const { user, isLoading } = useCurrency();

  if (isLoading) {
    // Пока данные о пользователе загружаются, показываем индикатор загрузки
    return <div>Loading...</div>;
  }

  if (!user) {
    // Если пользователь не авторизован, перенаправляем на страницу входа
    return <Navigate to="/" />;
  }

  if (requiredRole && user.role !== requiredRole) {
    // Если роль пользователя не соответствует необходимой, перенаправляем на страницу без доступа
    return <Navigate to="/non-access" />;
  }

  // Если роль пользователя соответствует или роль не требуется, рендерим переданный компонент
  return children;
};

export default PrivateRoute;
