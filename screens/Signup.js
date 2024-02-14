import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Input, Button, Image, Text } from 'react-native-elements';
import { database, useFirebase } from '../context/AuthContext';
import AsyncStorage from "@react-native-async-storage/async-storage";
// import FadeInView from '../FadeInView';

const Signup = ({navigation}) => {
  const firebase = useFirebase();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState(null);


  useEffect(() => {
   if(firebase.isLoggedIn){
    navigation.navigate('Home');
   }
  }, [firebase, navigation]);


  const handleSignup = async () => {
    try {
      const signUp = await firebase.signupUserWithEmailAndPass(email, password);
      if(signUp) {  

        console.warn('Sign Up Successful');
        console.log(signUp);
        const atIndex = email.indexOf('@');
        const userId = email.slice(0, atIndex);
        const userData = {
          userId,
          username,
          email
        }
        const key = `users/${userId}`;
        const insertDataToDb = await firebase.putData(key, userData)
        if (insertDataToDb) {
          console.log('User Inserted Successfully');
        }
        // AsyncStorage.setItem('User-Token', email)
      }
      
    } catch (error) {
      // Handle registration errors
      // ToastAndroid.show('Error while registering', ToastAndroid.LONG)
      console.error('Registration error:', error.message);
    }
  };

  

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/login_img.png')} // Add your logo path here
        style={styles.logo}
      />
  
      <Input
        placeholder="Username"
        leftIcon={{ type: 'font-awesome', name: 'user' }}
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />


      <Input
        placeholder="Email"
        leftIcon={{ type: 'font-awesome', name: 'envelope' }}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        error={!!emailError}
        errorStyle={{ color: 'red' }}
      />
      <Input
        placeholder="Password"
        leftIcon={{ type: 'font-awesome', name: 'lock' }}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Input
        placeholder="Confirm Password"
        leftIcon={{ type: 'font-awesome', name: 'lock' }}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
        <Text >Already have an account. </Text>
        <TouchableOpacity onPress={()=>navigation.navigate('Login')}><Text style={{ color: 'blue', textDecorationLine: 'underline' }}>Log In?</Text></TouchableOpacity>


      <Button
        title="Submit"
        onPress={handleSignup}
        containerStyle={styles.buttonContainer}

      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
     // flex: 1,
     justifyContent: 'center',
     alignItems: 'center',
     // padding: 20,
     marginTop: 5
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  buttonContainer: {
    marginTop: 20,
    // width: '100%',
  },
});

export default Signup;
