import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { useFirebase } from "../context/AuthContext";


const StartScreen = ({navigation}) => {
  const [loginStatus, setLoginStatus] = useState(false);

 const firebase = useFirebase();
 useEffect(() => {
   firebase.user?setLoginStatus(true):setLoginStatus(false);
   if (firebase.user) {
    navigation.navigate('Main')
   }
   
 }, [firebase.user]);
  const handleSignup = () => {
    navigation.navigate('Signup')
  }
  const handleLogin = () => {
    navigation.navigate('Login')
  }

  
  return (
    <View style={styles.container}>
      <Image source={require("../assets/start.png")} style={styles.logo} />
      <View style={{ borderLeftColor: "#1cc19f", width: 300 ,position:'absolute', bottom:30}}>
        <TouchableOpacity onPress={handleSignup} style={styles.btn}>
          <Text style={{fontSize: 20}}>Signup</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLogin}style={styles.btn1}>
          <Text style={{fontSize: 20}}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default StartScreen;

const styles = StyleSheet.create({
  container: {
    // justifyContent: "center",
    alignItems: "center",
    // marginTop: 120,
    display:'flex',
    height:'100%'
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 60,
    marginTop: 20
  },
  btn: {
    marginBottom: 40,
    height: 50,
    backgroundColor: "#1cc19f",
    color: "black",
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    // Shadow properties for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    // Elevation for Android
    elevation: 5,
  },
  btn1: {
    marginBottom: 40,
    height: 50,
    backgroundColor: "white",
    color: "black",
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    // Shadow properties for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    // Elevation for Android
    elevation: 5,
  },
});