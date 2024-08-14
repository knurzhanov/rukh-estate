import React from 'react';
import { Navigate } from 'react-router-dom';
import { useCurrency } from './CurrencyContext';

const PrivateRoute = ({ children, requiredRole }) => {
  const { user } = useCurrency();

  console.log('Пользователь из контекста:', user);
  console.log('Требуемая роль:', requiredRole);

  if (user === undefined) {
    // Пока данные о пользователе загружаются, можно вернуть индикатор загрузки или ничего не рендерить
    return <div>Loading...</div>; // Можно заменить на спиннер или другую индикацию загрузки
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
