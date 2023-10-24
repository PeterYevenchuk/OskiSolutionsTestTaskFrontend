import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/loginComponents/loginPage';
import HomePage from './components/homeComponents/homePage';
import TestPage from './components/testComponents/testPage';

function App() {
  return (
    <>
      <div className="App">
          <Router>
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/test/:testId" element={<TestPage />} />
            </Routes>
          </Router>
        </div>
    </>
  );
}

export default App;
