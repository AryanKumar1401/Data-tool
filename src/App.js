import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import GlobalStyles from './GlobalStyles';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import UploadPage from './pages/UploadPage';
import PricingPage from './pages/PricingPage';
import SignIn from './components/SignIn';
import { signOut } from 'firebase/auth';
import { auth } from './firebase';
import { Helmet } from 'react-helmet';

function App() {
  const [showAuth, setShowAuth] = useState(false);
  const [user, setUser] = useState(null);

  const closeModal = () => setShowAuth(false);
  
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        setUser(null);
      })
      .catch((error) => {
        console.error(error);
      });
  };


  return (
    <Router>
      <Helmet>
        <title>Data Tool</title>
      </Helmet>
      <GlobalStyles />
      <div className="flex flex-col min-h-screen">
        <header className="bg-black fixed top-2 left-2 right-2 p-4 rounded-lg shadow-lg flex justify-between items-center z-50">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-center bg-no-repeat bg-contain mr-3" style={{ backgroundImage: `url('https://img.icons8.com/?size=100&id=69617&format=png&color=FFFFFF')` }}></div>
            <Link to="/"><h1 className="text-2xl font-bold text-white">DataTool</h1></Link>
          </div>
          <nav className="flex space-x-4">
            <Link to="/" className="text-white font-bold text-lg hover:bg-white hover:rounded-md hover:text-black hover:shadow px-3 py-2">Main</Link>
            <Link to="/about" className="text-white font-bold text-lg hover:bg-white hover:rounded-md hover:text-black hover:shadow px-3 py-2">About</Link>
            <Link to="/upload" className="text-white font-bold text-lg hover:bg-white hover:rounded-md hover:text-black hover:shadow px-3 py-2">Explore</Link>
            <Link to="/pricing" className="text-white font-bold text-lg hover:bg-white hover:rounded-md hover:text-black hover:shadow px-3 py-2">Pricing</Link>
            <Link to="/contact" className="text-white font-bold text-lg hover:bg-white hover:rounded-md hover:text-black hover:shadow px-3 py-2">Contact</Link>
          </nav>
          {user ? (
          
            <span className="text-white font-bold text-lg">Logged in
                      <button
            onClick={handleLogout}
            className="bg-red-600 text-white rounded-md px-4 py-2 ml-4 hover:bg-red-700"
          >
            Logout
          </button></span>
            
          ) : (
            <button
              onClick={() => setShowAuth(true)}
              className="bg-white border-2 border-gray-800 text-gray-800 rounded-md px-4 py-2 hover:bg-gray-100"
            >
              Sign Up / Log In
            </button>
          )}
        </header>
        <main className="flex-1 mt-20 p-4">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/pricing" element={<PricingPage />} />
          </Routes>
          {showAuth && (
            <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <SignIn setUser={setUser} closeModal={closeModal} />
              </div>
            </div>
          )}
        </main>
        <footer className="bg-gray-900 text-white text-center py-4 mt-4">
          © 2024 DataTool. All rights reserved.
        </footer>
      </div>
    </Router>
  );
}

export default App;
