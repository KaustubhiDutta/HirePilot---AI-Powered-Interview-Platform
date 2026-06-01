import React, { createContext, useContext, useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import axios from 'axios';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken();
        localStorage.setItem('authToken', token);
        setUser(user);
      } else {
        localStorage.removeItem('authToken');
        setUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signUp = async (email, password) => {
    setIsTransitioning(true);
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const token = await result.user.getIdToken();
      localStorage.setItem('authToken', token);
      setUser(result.user);
      // Show loading for 1 second for smooth transition
      await new Promise(resolve => setTimeout(resolve, 1000));
      return result;
    } finally {
      setIsTransitioning(false);
    }
  };

  const signIn = async (email, password) => {
    setIsTransitioning(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const token = await result.user.getIdToken();
      localStorage.setItem('authToken', token);
      setUser(result.user);
      // Show loading for 1 second for smooth transition
      await new Promise(resolve => setTimeout(resolve, 1000));
      return result;
    } finally {
      setIsTransitioning(false);
    }
  };

  const signInWithGoogle = async () => {
    setIsTransitioning(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();
      localStorage.setItem('authToken', token);
      setUser(result.user);
      // Show loading for 1 second for smooth transition
      await new Promise(resolve => setTimeout(resolve, 1000));
      return result;
    } finally {
      setIsTransitioning(false);
    }
  };

  const logout = async () => {
    setIsTransitioning(true);
    try {
      await signOut(auth);
      localStorage.removeItem('authToken');
      setUser(null);
      await new Promise(resolve => setTimeout(resolve, 500));
    } finally {
      setIsTransitioning(false);
    }
  };

  const value = {
    user,
    loading,
    isTransitioning,
    signUp,
    signIn,
    signInWithGoogle,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      {/* Loading Overlay for transitions */}
      {isTransitioning && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center">
          <div className="text-center">
            <div className="relative">
              {/* Outer ring */}
              <div className="w-24 h-24 rounded-full border-4 border-primary/20 animate-pulse"></div>
              {/* Spinning loader */}
              <div className="absolute top-0 left-0 w-24 h-24 rounded-full border-4 border-t-primary border-r-secondary border-b-primary border-l-transparent animate-spin"></div>
              {/* Inner icon */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <svg className="w-8 h-8 text-primary animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
            </div>
            <p className="text-white text-lg font-semibold mt-6 animate-pulse">Please wait...</p>
            <p className="text-gray-400 text-sm mt-2">Redirecting to your dashboard</p>
            {/* Progress dots */}
            <div className="flex justify-center gap-2 mt-4">
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0s' }}></div>
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
};