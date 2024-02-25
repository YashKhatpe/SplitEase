import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Input, Button, Image } from "react-native-elements";
import { useFirebase } from '../context/AuthContext';
import AsyncStorage from "@react-native-async-storage/async-storage";
// import UserInput from "./UserInput";
const Login = ({navigation}) => {
  const firebase = useFirebase();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  useEffect(() => {
    if(firebase.isLoggedIn){
     navigation.navigate('Home');
    }
   }, [firebase, navigation]);
  const handleLogin = async(e) => {
    // Implement your login logic here
    if (e.nativeEvent.key === "Enter") {
      e.preventDefault();
    }
    try {
      const logIn = await firebase.loginUserWithEmailAndPass(email, password)
      if(logIn) {
        console.warn('Login Successful');
        AsyncStorage.setItem('User-Token', email)
        navigation.navigate('Main');
        // ToastAndroid("Login Successful", ToastAndroid.LONG)
        return;
      } 
      
    } catch (error) {
      
      // ToastAndroid("Please enter correct credentials", ToastAndroid.LONG)
      console.warn('Login Error: ', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require("../assets/login_img.png")} style={styles.logo} />
      <Input
        placeholder="Username"
        leftIcon={{ type: "font-awesome", name: "envelope" }}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Input
        placeholder="Password"
        leftIcon={{ type: "font-awesome", name: "lock" }}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button
        title="Login"
        onPress={handleLogin}
        containerStyle={styles.buttonContainer}
      />
    </View>
    // <KeyboardAvoidingView behavior="padding" style={styles.container}>
    // <Input
    //   leftIcon={{ type: "font-awesome", name: "envelope" }}
    //   placeholder="Username"
    //   autoCapitalize={'none'}
    //   returnKeyType={'done'}
    //   autoCorrect={false}
    // />
    // <Input
    //   leftIcon={{ type: "font-awesome", name: "lock" }}
    //   secureTextEntry
    //   placeholder="Password"
    //   returnKeyType={'done'}
    //   autoCapitalize={'none'}
    //   autoCorrect={false}
    // />
    
    //  <TouchableOpacity
    //   activeOpacity={0.7}
    //   style={styles.btnEye}
    //   onPress={this.showPass}>
    //   <Image source={eyeImg} style={styles.iconEye} />
    // </TouchableOpacity> 
  // </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%'
  },
  innerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    // height: '60%'
  },

  LoginFont: {
    color: 'white',
    // flex:1,
    justifyContent: 'left',
    alignItems: 'left',
    margin: 50,
    marginTop: 150
  },
  button: {
    // backgroundColor: 'blue', // Add background color here
    fontSize: 17,
    borderRadius: 6,
    color: 'white',
    fontWeight: '500',

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
  inputsContainer: {
    width: '87%',
    marginTop: 20,
    marginBottom: 0,
  },
  inputs: {
    color: 'white',
    paddingLeft: 10,
  },
});

export default Login;
