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
    if (e.nativeEvent.key === 'Enter') {
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
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // padding: 20,
    marginTop: 120,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  buttonContainer: {
    marginTop: 20,
    width: "100%",
  },
});

export default Login;
