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
import NonAccess from './components/NonAccess';

function App() {
  return (
    <CurrencyProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/properties/" element={
            <>
              <Header />
              <PropertyList />
            </>
          } />
          <Route path="/properties/:id" element={
            <>
              <Header />
              <PropertyDetail />
            </>
          } />
          <Route path="/create" element={
            <>
              <Header />
              <CreateProperty />
              </>
          } />
          <Route path="/listing" element={
           <>
              <Header />
              <PropertyListing />
              </>
          } />
          <Route path="/select" element={<SelectRoomPage />} />
          <Route path="/create-user" element={
            <>
              <Header />
              <CreateUser />
              </>
          } />
          <Route path="/non-access" element={<NonAccess />} />
        </Routes>
      </Router>
    </CurrencyProvider>
  );
}

export default App;
