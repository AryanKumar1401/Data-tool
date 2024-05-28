import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../firebase';

function SignIn({ setUser, closeModal }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignInWithGoogle = () => {
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

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (isSignUp) {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          setUser(user);
          closeModal();
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          setUser(user);
          closeModal();
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };



  return (
    <div className="relative bg-white p-8 rounded-lg max-w-sm w-full mx-auto">
      <button onClick={closeModal} className="absolute top-2 right-2 text-gray-600">
        &times;
      </button>
      <div className="flex justify-center mb-6">
        <button
          className={`px-4 py-2 ${!isSignUp ? 'bg-gray-300' : 'bg-white'}`}
          onClick={() => setIsSignUp(false)}
        >
          Log in
        </button>
        <button
          className={`px-4 py-2 ${isSignUp ? 'bg-gray-300' : 'bg-white'}`}
          onClick={() => setIsSignUp(true)}
        >
          Sign up
        </button>
      </div>
      <h2 className="text-2xl font-bold mb-6 text-center">
        {isSignUp ? "Don't have an account? Register one now!" : "Already use our service? Let's log you in."}
      </h2>
      <form onSubmit={handleFormSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Email address</label>
          <input
            type="email"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        { !isSignUp && <div className="mb-6 text-right">
          
        </div>}
        <button className="w-full bg-blue-600 text-white py-2 rounded-lg mb-4">
          Submit
        </button>
      </form>
      <div className="text-center text-gray-600 mb-4">Or continue with</div>
      <button
        onClick={handleSignInWithGoogle}
        className="w-full flex items-center justify-center bg-white border border-gray-300 rounded-full px-4 py-2 shadow-md hover:bg-gray-100"
      >
        <img src="googleLogo.png" alt="Google logo" className="w-5 h-5 mr-2" />
        <span className="text-gray-700 font-medium">Google</span>
      </button>
      <div className="text-center mt-4">
        
      </div>
    </div>
  );
}

export default SignIn;
