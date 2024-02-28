import { createContext, useContext, useState, useEffect } from "react";
import { initializeApp } from "@firebase/app";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  // GoogleAuthProvider,
  // signInWithRedirect,
  // signInWithPopup
} from "@firebase/auth";
import {
  getDatabase,
  set,
  ref,
  get,
  orderByChild,
  onValue,
  query,
  equalTo
} from "@firebase/database";
import firebaseConfig from "./firebaseConfig";
import 'firebase/database';

// Initialize Firebase app
export const firebaseApp = initializeApp(firebaseConfig);
// initialize auth
// const provider = new  GoogleAuthProvider();
export const database = getDatabase(firebaseApp);
export const firebaseAuth = getAuth(firebaseApp);

const FirebaseContext = createContext(null);

export const useFirebase = () => useContext(FirebaseContext);

export const authStateChanged = onAuthStateChanged;

export function getUsernameFromEmail(shortEmail) {
  return new Promise((resolve, reject) => {
    // const atIndex = email.indexOf("@");

    const database = getDatabase();
    const usersRef = ref(database, 'users/accounts');

    const usersQuery = query(usersRef, orderByChild('shortEmail'), equalTo(shortEmail));

    get(usersQuery)
      .then((snapshot) => {
        if (snapshot.exists()) {
          // Loop through each child to find the matching username
          snapshot.forEach((childSnapshot) => {
            const userData = childSnapshot.val();
            const username = userData.username;
            console.log('Username: ', username);
            resolve(username);
          });
        } else {
          reject(new Error('No user found with this short email.'));
        }
      })
      .catch((error) => {
        console.error('Error getting username:', error);
        reject(error);
      });
  });
}



export const FirebaseProvider = (props) => {
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      setUser(user);
      
      // console.log('User: ',user);
    });

    // Cleanup function
    return () => unsubscribe();
  }, []);



  


useEffect(() => {
    if (isLoggedIn) {
      const email = user.email
      const atIndex = email.indexOf("@");
      const shortEmail = email.slice(0, atIndex);
    return () => getUsernameFromEmail(shortEmail)
  }
  }, [user, userName]);  

  const isLoggedIn = !!user;

  // Sign Up Context
  const signupUserWithEmailAndPass = async (email, username, password) => {
    // Create user account with email
    const atIndex = email.indexOf("@");
    const shortEmail = email.slice(0, atIndex);
    const db = getDatabase();
    const userCredential = await createUserWithEmailAndPassword(
      firebaseAuth,
      email,
      password
    );

    const userDetails = {
      email,
      shortEmail, 
      username
    };
    // Write to secure path with appropriate security rules
    const usernameRef = ref(db, `users/friendsList/${username}`);
    await set(usernameRef, userDetails);
    console.log(userCredential);
    return true;
  };


   function getUsernameFromshortEmail(shortEmail) {
    return new Promise((resolve, reject) => {
      // const atIndex = email.indexOf("@");
  
      const database = getDatabase();
      const usersRef = ref(database, 'users/accounts');
  
      const usersQuery = query(usersRef, orderByChild('shortEmail'), equalTo(shortEmail));
  
      get(usersQuery)
        .then((snapshot) => {
          if (snapshot.exists()) {
            // Loop through each child to find the matching username
            snapshot.forEach((childSnapshot) => {
              const userData = childSnapshot.val();
              const username = userData.username;
              console.log('Username: ', username);
              setUserName(username);
              resolve(username);
            });
          } else {
            reject(new Error('No user found with this short email.'));
          }
        })
        .catch((error) => {
          console.error('Error getting username:', error);
          reject(error);
        });
    });
  }


  
  
  
  
  // Login Context
  // Check if username exists in the db
  const retrieveEmailFromUserName = async(userNamee) => {
    
  return new Promise((resolve, reject) => {
    const db = getDatabase();
    const usernameRef = ref(db, `users/accounts/${userNamee}`);
    
    onValue(usernameRef, async(snapshot) => {
      try {
        const data = await snapshot.val();
        if (data && data.email) {
          const email = await data.email;
          console.log(email);
          resolve(email);
        } else {
          console.log('User not found or email missing');
          reject(new Error('User not found or email missing'));
        }
        
      } catch (error) {
        console.log('Error finding username from db:', error.message);
        reject(error);
      }
    });
  });
  };
  
  const isValidEmail = (input) => {
    // Use a regex pattern to check if the input matches the email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(input);
  };

  const loginUserWithEmailAndPass = async (emailOrUsername, password) => {
    let email;
    if (isValidEmail(emailOrUsername)) {
      email = await emailOrUsername;
    } else {
      try {
        email = await retrieveEmailFromUserName(emailOrUsername);
      } catch (error) {
        console.error('Error retrieving email from username:', error.message);
        return null; // Return null or handle the error as needed
      }
    }
    return signInWithEmailAndPassword(firebaseAuth, email, password);
  };
  //SingOut Context
  const signUserOut = () => {
    return signOut(firebaseAuth);
  };

  // const signInWithGoogle = () => {
  //   signInWithPopup(firebaseAuth, provider);
  // }

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
        user,
        setUser,
        userName,
        setUserName,
        getUsernameFromshortEmail
      }}
    >
      {props.children}
    </FirebaseContext.Provider>
  );
};

