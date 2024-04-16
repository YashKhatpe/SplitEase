import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Platform, Alert, Keyboard } from 'react-native';
import { Text, Image } from 'react-native-elements';
import { useFirebase } from '../context/AuthContext';
import { StatusBar } from "expo-status-bar";
import { TextInput } from "react-native-gesture-handler";
import Animated, {  FadeInUp } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
const Signup = ({ navigation }) => {

  const firebase = useFirebase();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState(null);
  const [buttonColor, setButtonColor] = useState("#246BFD");
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);


  const handleSignup = async () => {
    try {
      if (!username || !email || !password || !confirmPassword || !phoneNumber) {
        Alert.alert('Please enter all the fields.');
        return;
      }
      if(password !== confirmPassword){
        Alert.alert('Please enter correct password in both the fields.');
        return;
      }
      const checkUsername = await firebase.checkUserNameExists(username);
      if(checkUsername){
        console.log('Username already exists.');
        Alert.alert('Username already exists.');
        return;
      }
      const signUp = await firebase.signupUserWithEmailAndPass(email, username, password, phoneNumber);
      // console.log('Signup object: ', signUp);
      if (signUp) {
        console.warn('Sign Up Successful');
        navigation.navigate('Main')
      }
    } catch (error) {
      console.error('Registration error:', error.message);
    }
  };
  const handlePressIn = () => {
    setButtonColor("#181827");
  }

  const handlePressOut = () => {
    setButtonColor("#246BFD");
  }

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (event) => {
      setKeyboardHeight(event.endCoordinates.height - 380); 
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);


  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const toggleconfirmShowPassword = () => {
    setShowConfirmPassword(!showConfirmPassword)
  };

  return (
   // <KeyboardAvoidingView>

    // <LinearGradient colors={['#000070', '#000047', '#000033', '#00001f']} start={{ x: 0, y: 0 }}
    //   end={{ x: 1, y: 1 }} style={styles.container}
    // >
    //   <View style={styles.signupFont}>
    //       <Text style={{color:'white',fontSize:45}}>
    //         Sign up
    //       </Text>
    //     </View>
    //   <View style={styles.innerContainer}>
        

    //     <View style={styles.inputsContainer}>
    //       <Input
    //         placeholder="Username"
    //         leftIcon={{ type: 'font-awesome', name: 'user', color: 'white' }}
    //         value={username}
    //         onChangeText={setUsername}
    //         autoCapitalize="none"
    //         style={styles.inputs}
    //         />


    //       <Input
    //         placeholder="Email"
    //         leftIcon={{ type: 'font-awesome', name: 'envelope', color: 'white' }}
    //         value={email}
    //         onChangeText={setEmail}
    //         keyboardType="email-address"
    //         autoCapitalize="none"
    //         autoCorrect={false}
    //         error={!!emailError}
    //         errorStyle={{ color: 'red' }}
    //         style={styles.inputs}
    //         />


    //       <Input
    //         placeholder="Phone Number"
    //         leftIcon={{ type: 'font-awesome', name: 'phone', color: 'white' }}
    //         value={phoneNumber}
    //         onChangeText={setPhoneNumber}
    //         keyboardType='numeric'
    //         style={styles.inputs}
    //         />
    //       <Input
    //         placeholder="Password"
    //         leftIcon={{ type: 'font-awesome', name: 'lock', color: 'white' }}
    //         value={password}
    //         onChangeText={setPassword}
    //         secureTextEntry
    //         style={styles.inputs}
    //         />
    //       <Input
    //         placeholder="Confirm Password"
    //         leftIcon={{ type: 'font-awesome', name: 'lock', color: 'white' }}
    //         value={confirmPassword}
    //         onChangeText={setConfirmPassword}
    //         secureTextEntry
    //         style={styles.inputs}
    //         />
    //     </View>
    //     <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20, marginBottom: 10 }}>
    //       <Text style={{ color: 'white' }}>Already have an account. </Text>
    //       <TouchableOpacity onPress={() => navigation.navigate('Login')}>
    //         <Text style={styles.login}>
    //           Log In?
    //         </Text>
    //       </TouchableOpacity>
    //     </View>
    //     <TouchableOpacity
    //       title="Submit"
    //       onPressIn={handlePressIn}
    //       onPressOut={handlePressOut}
    //       onPress={handleSignup}
    //       style={[styles.buttonContainer, { backgroundColor: buttonColor }]}
    //     >
    //       <Text style={styles.button}>
    //         Submit
    //       </Text>
    //     </TouchableOpacity>

    //   </View>
    // </LinearGradient>
  //</KeyboardAvoidingView>



  <View className="bg-white h-full w-full">
  <StatusBar style="light" />
  <View className="w-full h-full absolute">
    <Image
      className="w-full"
      source={require("../assets/background.png")}
      style={{ transform: [{ translateY: keyboardHeight }], height: "95%" }}
    />
  </View>
  <View className="flex-row justify-around w-full absolute">
    <Animated.Image
      entering={FadeInUp.delay(200).duration(1000).springify()}
      className="h-[220] w-[90]"
      source={require("../assets/light.png")}
      style={{ transform: [{ translateY: keyboardHeight }] }}
    />
    <Animated.Image
      entering={FadeInUp.delay(400).duration(1000).springify()}
      className="h-[160] w-[65]"
      source={require("../assets/light.png")}
      style={{ transform: [{ translateY: keyboardHeight }] }}
    />
  </View>

  <View className="h-full w-full flex justify-around pt-48">
    <View className="flex items-center">
      <Animated.Text
        entering={FadeInUp.delay(200).duration(2000).springify()}
        className="text-white  font-bold tracking-wider text-5xl overflow-hidden"
      >
        SignUp
      </Animated.Text>
    </View>

    {/* <KeyboardAvoidingView> */}
    <View className="flex items-center mx-4 space-y-2">
      <Animated.View
        entering={FadeInUp.delay(200).duration(2000).springify()}
        className="bg-black/5 p-4 rounded-2xl w-full"
      >
        <TextInput
          placeholder="Username"
          placeholderTextColor={"gray"}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
      </Animated.View>

      <Animated.View
        entering={FadeInUp.delay(400).duration(2000).springify()}
        className="bg-black/5 p-4 rounded-2xl w-full"
      >
        <TextInput
          placeholder="Email"
          placeholderTextColor={"gray"}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          error={!!emailError}
          errorStyle={{ color: "red" }}
        />
      </Animated.View>

      <Animated.View
        entering={FadeInUp.delay(400).duration(2000).springify()}
        className="bg-black/5 p-4 rounded-2xl w-full"
      >
        <TextInput
          placeholder="Phone Number"
          placeholderTextColor={"gray"}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="numeric"
        />
      </Animated.View>

      <Animated.View
        entering={FadeInUp.delay(400).duration(2000).springify()}
        className="bg-black/5 p-4 rounded-2xl w-full flex flex-row items-center"
      >
        <TextInput
          placeholder="Password"
          placeholderTextColor={"gray"}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          className="flex-1"
        />
        <TouchableOpacity onPress={toggleShowPassword} classname="ml-2">
          <Ionicons
            name={showPassword ? "eye-off" : "eye"}
            size={24}
            color="black"
          />
        </TouchableOpacity>
      </Animated.View>

      <Animated.View
        entering={FadeInUp.delay(400).duration(2000).springify()}
        className="bg-black/5 p-4 rounded-2xl w-full flex flex-row items-center"
      >
        <TextInput
          placeholder="Confirm Password"
          placeholderTextColor={"gray"}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showConfirmPassword}
          className="flex-1"
        />
        <TouchableOpacity onPress={toggleconfirmShowPassword} className="ml-2">
          <Ionicons
            name={showConfirmPassword ? "eye-off" : "eye"}
            size={24}
            color="black"
          />
        </TouchableOpacity>
      </Animated.View>

      <Animated.View
        entering={FadeInUp.delay(600).duration(2000).springify()}
        className="w-full"
      >
        <TouchableOpacity
          className="w-full bg-sky-400 p-3 rounded-2xl mb-2"
          title="Submit"
          onPress={handleSignup}
        >
          <Text className="text-xl font-bold text-white text-center">
            Signup
          </Text>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View
        entering={FadeInUp.delay(800).duration(2000).springify()}
        className="flex-row justify-centre"
      >
        <Text>Already have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text className="text-sky-600">Login</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
    {/* </KeyboardAvoidingView> */}
  </View>
</View>
// </KeyboardAvoidingView>
);
// </KeyboardAvoidingView>

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
    marginTop:45,
    marginBottom: 10
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