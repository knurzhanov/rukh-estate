import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PropertyList from './pages/PropertyList';
import PropertyDetail from './components/PropertyDetail';
import Login from './pages/Login';
import CreateProperty from './components/dashboard/CreateProperty';
import Header from './components/layout/Header';
import SelectRoomPage from './pages/SelectRoom';
import { CurrencyProvider } from './components/CurrencyContext';
import PropertyListing from './components/dashboard/PropertyListing';
import PrivateRoute from './components/PrivateRoute';
import CreateUser from './components/dashboard/CreateUser';
import EditProperty from './components/dashboard/EditProperty';
import NonAccess from './components/NonAccess';
import UserList from './components/dashboard/UserList';

function App() {
  return (
    <CurrencyProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/properties/" element={
            <PrivateRoute>
              <Header />
              <PropertyList />
              </PrivateRoute>
          } />
          <Route path="/properties/:id" element={
            <PrivateRoute>
              <Header />
              <PropertyDetail />
              </PrivateRoute>
          } />
          <Route path="/create" element={
            <PrivateRoute requiredRole="Admin">
              <Header />
              <CreateProperty />
            </PrivateRoute>
          } />
          <Route path="/listing" element={
            <PrivateRoute requiredRole="Admin">
              <Header />
              <PropertyListing />
            </PrivateRoute>
          } />
          <Route path="/select" element={
            <PrivateRoute>
            <SelectRoomPage />
            </PrivateRoute>
            } />
          <Route path="/create-user" element={
          
              <Header />
              <CreateUser />
         
          } />
          <Route path="/user-list" element={
            <PrivateRoute requiredRole="Admin">
              <Header />
              <UserList />
            </PrivateRoute>
          } />
          <Route path="/edit/:id" element={
            <PrivateRoute requiredRole="Admin">
            <EditProperty />
          </PrivateRoute>
          } />

          <Route path="/non-access" element={<NonAccess />} />
        </Routes>
      </Router>
    </CurrencyProvider>
  );
}

export default App;
