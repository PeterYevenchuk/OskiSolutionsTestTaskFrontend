import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/loginComponents/loginPage';
import HomePage from './components/homeComponents/homePage';

function App() {
  return (
    <>
      <div className="App">
          <Router>
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="/home" element={<HomePage />} />
            </Routes>
          </Router>
        </div>
    </>
  );
}

export default App;
