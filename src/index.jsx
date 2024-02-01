import React, { Suspense, useState } from 'react';
import LoginPage from './Component/LoginPage';
import App from './Component/App';
import ReactDOM from 'react-dom/client';
import Loader from './Component/Loader';
import About from './Component/About';
import Navbar from './Component/Navbar';
import Stopwatch from './Component/Stopwatch';
import Notes from './Component/Notes';
import CalendarUtils from './Component/CalendarUtils';
import Calendars from './Component/Calendars';
import LostPanel from './Component/LostPanel';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('./Component/service-worker.js')
    .then(function (registration) {
      console.log('Service Worker Registered', registration);
    })
    .catch(function (err) {
      console.error('Service Worker Registration Failed', err);
    });
}

const AppContainer = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    // Perform login logic, set isLoggedIn to true
    setIsLoggedIn(true);
  };

  return (
    <main>
      <Router>
        <Suspense fallback={<Loader />}>
          {!isLoggedIn && <LoginPage onLogin={handleLogin} />}
          {isLoggedIn && <Navbar />}
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/about" element={<About />} />
            <Route path="/stopwatch" element={<Stopwatch />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/calendar" element={<CalendarUtils />} />
            <Route path="/lostPanel" element={<LostPanel />} />
            <Route path="/calendar2" element={<Calendars />} />
          </Routes>
        </Suspense>
      </Router>
    </main>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<AppContainer />);
