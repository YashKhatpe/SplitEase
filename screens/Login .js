import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { Input, Button, Image } from "react-native-elements";
import { useFirebase } from '../context/AuthContext';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { VideoFullscreenUpdate } from "expo-av";
import { FullWindowOverlay } from "react-native-screens";
import { useFonts } from "expo-font";
// import UserInput from "./UserInput";
const Login = ({ navigation }) => {
  const firebase = useFirebase();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [buttonColor, setButtonColor] = useState("blue");
  useEffect(() => {
    if (firebase.isLoggedIn) {
      navigation.navigate('Home');
    }
  }, [firebase, navigation]);
  const handleLogin = async (e) => {
    // Implement your login logic here
    if (e.nativeEvent.key === 'Enter') {
      e.preventDefault();
    }
    try {
      const logIn = await firebase.loginUserWithEmailAndPass(email, password)
      if (logIn) {
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
  const handlePressIn = () => {
    setButtonColor("darkblue");
  }

  const handlePressOut = () => {
    setButtonColor("blue");
  }
  // const [loaded] = useFonts({
  //   Arial: require('../assets/fonts/ARIAL.TTF'),
  // });

  // if (!loaded) {
  //   return <Text>Loading...</Text>;
  // }

  return (
    <View style={styles.container}>
      <Image source={require("../assets/login_img.png")} style={styles.logo} />
      <View style={styles.inputsContainer}>
        <Input
          placeholder="Username"
          leftIcon={{ type: "font-awesome", name: "envelope", color: 'white', }}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.inputs}

        />
        <Input
          placeholder="Password"
          leftIcon={{ type: "font-awesome", name: "lock", color: 'white' }}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.inputs}
        />
      </View>
      {/* <View style={styles.buttonContainer}> */}
      <TouchableOpacity
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handleLogin}
        style={[styles.buttonContainer, { backgroundColor: buttonColor }]}
      >
        <Text style={styles.button}>Login</Text>
      </TouchableOpacity>
      {/* </View> */}
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
    // flex: 1,
    // backgroundColor:'#061c69',
    justifyContent: "center",
    alignItems: "center",
    alignContent: 'center',
    // height: 740 ,
    // padding: 20,
    marginTop: 120,
    // width: 390
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  button: {
    // backgroundColor: 'blue', // Add background color here
    fontSize: 20,
    borderRadius: 6,
    color: 'white',
    fontWeight: '500',

  },
  buttonContainer: {
    height: 50,
    width: 140,
    // margin: 0,
    alignItems: 'center',
    justifyContent: "center",
    borderRadius: 6,
    overflow: 'hidden',
    marginVertical: 10,

  },
  inputsContainer: {
    width: 380,
    marginTop: 20,
    marginBottom:35,
  },
  inputs: {
    color: 'white',
    paddingLeft: 10,
  },
});

export default Login;
