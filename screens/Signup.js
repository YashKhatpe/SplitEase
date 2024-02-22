import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Input, Button, Image, Text } from 'react-native-elements';
import { database, useFirebase } from '../context/AuthContext';
import AsyncStorage from "@react-native-async-storage/async-storage";
// import FadeInView from '../FadeInView';

const Signup = ({ navigation }) => {
  const firebase = useFirebase();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState(null);
  const [buttonColor, setButtonColor] = useState("blue");

  useEffect(() => {
    if (firebase.isLoggedIn) {
      navigation.navigate('Home');
    }
  }, [firebase, navigation]);


  const handleSignup = async () => {
    try {
      const signUp = await firebase.signupUserWithEmailAndPass(email, password);
      if (signUp) {

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
  const handlePressIn = () => {
    setButtonColor("darkblue");
  }

  const handlePressOut = () => {
    setButtonColor("blue");
  }


  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/login_img.png')} // Add your logo path here
        style={styles.logo}
      />

      <View style={styles.inputsContainer}>
        <Input
          placeholder="Username"
          leftIcon={{ type: 'font-awesome', name: 'user', color: 'white' }}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          style={styles.inputs}
        />


        <Input
          placeholder="Email"
          leftIcon={{ type: 'font-awesome', name: 'envelope', color: 'white' }}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          error={!!emailError}
          errorStyle={{ color: 'red' }}
          style={styles.inputs}
        />
        <Input
          placeholder="Password"
          leftIcon={{ type: 'font-awesome', name: 'lock', color: 'white' }}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.inputs}
        />
        <Input
          placeholder="Confirm Password"
          leftIcon={{ type: 'font-awesome', name: 'lock', color: 'white' }}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          style={styles.inputs}
        />
      </View>
      <View style={{justifyContent:'center',alignItems:'center',marginTop:20,marginBottom: 10}}>
        <Text style={{ color: 'white' }}>Already have an account. </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.login}>
            Log In?
          </Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        title="Submit"
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handleSignup}
        style={[styles.buttonContainer, { backgroundColor: buttonColor }]}
      >
        <Text style={styles.button}>
          Submit
        </Text>
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // padding: 20,
    marginTop: 100,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  buttonContainer: {
    height: 50,
    width: 140,
    margin: 50,
    alignItems: 'center',
    justifyContent: "center",
    borderRadius: 6,
    overflow: 'hidden',
    marginVertical: 10,
  },
  button: {
    fontSize: 20,
    borderRadius: 6,
    color: 'white',
    fontWeight: '500',
  },
  inputs: {
    color: 'white',
    paddingLeft: 10,
  },
  inputsContainer: {
    width: 380,
    margin: 20,
    marginBottom:0
  },
  login: {
    color: 'blue',
    textDecorationLine: 'underline',

  },
});

export default Signup;
