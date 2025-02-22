/** @format */

import Header from './components/Header';
import Home from './pages/Home';

const App = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto p-4">
        <Home />
      </main>
    </div>
  );
};

export default App;
