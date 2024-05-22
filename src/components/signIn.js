import React from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../firebase';

function SignIn({ setUser, closeModal}) {
  const handleSignIn = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        setUser(user);
        closeModal();
        console.log(result);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <button onClick={handleSignIn} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
      Sign In with Google
    </button>
  );
}

export default SignIn;