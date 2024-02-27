import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Platform, useWindowDimensions } from 'react-native';
import { Input, Button, Image, Text } from 'react-native-elements';
import { database, useFirebase } from '../context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Font from 'expo-font';
// import FadeInView from '../FadeInView';

const Signup = ({ navigation }) => {
  const firebase = useFirebase();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState(null);
  const [buttonColor, setButtonColor] = useState("#246BFD");
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    if (firebase.isLoggedIn) {
      navigation.navigate('Home');
    }
  }, [firebase, navigation]);
  // const window = useWindowDimensions();
  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        'Arial': require('../assets/fonts/arial.ttf'),
      });
      setFontLoaded(true);
    };
    loadFonts();
  }, []);

  // If fonts haven't loaded yet, don't render the component
  if (!fontLoaded) {
    return null;
  }



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
    setButtonColor("#181827");
  }

  const handlePressOut = () => {
    setButtonColor("#246BFD");
  }


  return (
    <LinearGradient colors={['#000070', '#000047', '#000033', '#00001f']} start={{ x: -1, y: 0 }}
      end={{ x: 1, y: 1 }} style={styles.container}
    >
      <View style={styles.signupFont}>
          <Text style={{color:'white',fontSize:45,fontFamily:'Arial'}}>
            Sign up
          </Text>
        </View>
      <View style={styles.innerContainer}>
        

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
        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20, marginBottom: 10 }}>
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
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // justifyContent: 'center',
    // // alignItems: 'center',
    // alignContent:'center',
    // // padding: 20,
    // marginTop: 100,
    height:'100%'
  },
  innerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    // height: '60%'
  },
  signupFont: {
    color: 'white',
    justifyContent: 'left',
    alignItems:'left',
    margin:50,
    marginTop:150
  },
  buttonContainer: {
    height: 50,
    width: 290,
    margin: 50,
    alignItems: 'center',
    justifyContent: "center",
    borderRadius: 50,
    overflow: 'hidden',
    marginVertical: 10,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 1.0,
        shadowRadius: 50,
      },
      android: {
        elevation: 7,
        shadowColor: 'white',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 1.0,
        shadowRadius: 50,
      },
    }),

  },
  button: {
    fontSize: 17,
    borderRadius: 6,
    color: 'white',
    fontWeight: '500',
  },
  inputs: {
    color: 'white',
    paddingLeft: 10,
  },
  inputsContainer: {
    width: '87%',
    margin: 20,
    marginBottom: 0
  },
  login: {
    color: 'blue',
    textDecorationLine: 'underline',

  },
});

export default Signup;