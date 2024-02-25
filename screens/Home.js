import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from "react-native";
import { Button } from "react-native-elements";
import { useFirebase } from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { firebaseAuth, authStateChanged } from '../context/AuthContext';
import FloatingButton from '../components/FloatingButton';
const Home = ({navigation}) => {
    const firebase = useFirebase();
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
  useEffect(() => {
    authStateChanged(firebaseAuth, (user1) => {
      setUser((prevUser) => {
        if (user1) {
          console.log('Hello User: ', user1.email);
          return user1;
        } else {
          console.log('You are currently logged out');
          return null;
        }
      });
    });
  }, []);
    useEffect(() => {
        const getToken = async () => {
            try {
                const userToken = await AsyncStorage.getItem('User-Token');
                setToken(userToken);
            } catch (error) {
                console.error('Error retrieving user token:', error);
            }
        };
        
        getToken();
    }, []);
    useEffect(() => {
        // Check if user is not logged in, then navigate to the signup page
        if (!firebase.isLoggedIn) {
          navigation.navigate('Signup');
        }
      }, [firebase.isLoggedIn, navigation]);

      const handleLogout = () => {
        firebase.signUserOut();
        navigation.navigate('Signup')
      }

      const handleExpense = () => {
        console.log('Adding New Expense');
        navigation.navigate('Friends')
      }
  return (
    <View style={styles.container}>
      <Text>Welcome To Home Page</Text>
      <Text> {user && user.email}</Text>
      <Button title={"Sign Out"} onPress={handleLogout}/>
      <FloatingButton text={'+'} onPress={handleExpense}/>
    </View>
  );
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center"
    }
  });
export default Home;
