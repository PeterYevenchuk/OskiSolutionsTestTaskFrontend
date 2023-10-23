import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/loginComponents/loginPage';
import HomePage from './components/homeComponents/homePage';
import { AuthProvider } from './components/jwtAuth/authContext.js';

function App() {
  return (
    <>
      <AuthProvider>
        <div className="App">
          <Router>
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="/home" element={<HomePage />} />
            </Routes>
          </Router>
        </div>
      </AuthProvider>
    </>
  );
}

export default App;
