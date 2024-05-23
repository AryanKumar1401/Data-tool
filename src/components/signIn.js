// src/components/SignIn.js
import React from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../firebase';

function SignIn({ setUser, closeModal }) {
  const handleSignIn = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        setUser(user);
        closeModal();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="relative bg-white p-8 rounded-lg max-w-sm w-full mx-auto">
      <button onClick={closeModal} className="absolute top-2 right-2 text-gray-600">
        &times;
      </button>
      <h2 className="text-2xl font-bold mb-6 text-center">Sign in to your account</h2>
      <div className="mb-4">
        <label className="block text-gray-700">Email address</label>
        <input
          type="email"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          placeholder="Email address"
        />
      </div>
      <div className="mb-6">
        <label className="block text-gray-700">Password</label>
        <input
          type="password"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          placeholder="Password"
        />
      </div>
      <button className="w-full bg-blue-600 text-white py-2 rounded-lg mb-4">Sign in</button>
      <div className="text-center text-gray-600 mb-4">Or continue with</div>
      <button
        onClick={handleSignIn}
        className="w-full flex items-center justify-center bg-white border border-gray-300 rounded-full px-4 py-2 shadow-md hover:bg-gray-100"
      >
        <img src="googleLogo.png" alt="Google logo" className="w-5 h-5 mr-2" />
        <span className="text-gray-700 font-medium">Google</span>
      </button>
    </div>
  );
}

export default SignIn;
