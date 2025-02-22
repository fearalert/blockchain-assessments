/** @format */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Results from './pages/Results';
import { ToastContainer } from 'react-toastify';
import About from './pages/About';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <Header />
        <main className="container mx-auto p-4 flex-grow">
          <Routes>
            <Route
              path="/"
              element={<Home />}
            />
            <Route
              path="/results"
              element={<Results />}
            />
            <Route
              path="/about"
              element={<About />}
            />
          </Routes>
        </main>
        <ToastContainer
          position="top-right"
          autoClose={5000}
        />
      </div>
    </Router>
  );
};

export default App;
