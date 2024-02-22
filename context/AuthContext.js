
import { createContext, useContext, useState, useEffect } from "react";
import { initializeApp } from "@firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "@firebase/auth";
import { getDatabase, set, ref } from "@firebase/database";
import firebaseConfig from "./firebaseConfig";
 


// const reactNativePersistence = (firebaseAuth).getReactNativePersistence;
// Initialize Firebase app
const firebaseApp = initializeApp(firebaseConfig);
// initialize auth

export const database = getDatabase(firebaseApp);
export const firebaseAuth = getAuth(firebaseApp);

const FirebaseContext = createContext(null);

export const useFirebase = () => useContext(FirebaseContext);

export const authStateChanged = onAuthStateChanged;
export const FirebaseProvider = (props) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      setUser(user);
    });
 
    // Cleanup function
    return () => unsubscribe();
  }, []);

  const isLoggedIn = !!user;

  // Sign Up Context
  const signupUserWithEmailAndPass =  async(email, password) => {

      return createUserWithEmailAndPassword(firebaseAuth, email, password);
    }
  

  // Login Context
  const loginUserWithEmailAndPass = (email, password) => {
      return signInWithEmailAndPassword(firebaseAuth, email, password);
  };

  //SingOut Context
  const signUserOut = () => {
    return signOut(firebaseAuth);
  }

  // Adding data to realtime database
  const putData = (key, data) => set(ref(database, key), data);
  return (
    <FirebaseContext.Provider
      value={{
        signupUserWithEmailAndPass,
        loginUserWithEmailAndPass,
        signUserOut,
        putData,
        isLoggedIn,
        user
      }}
    >
      {props.children}
    </FirebaseContext.Provider>
  );
};
