// import React, { useEffect, useState } from "react";
// import { View, StyleSheet, TouchableOpacity, Modal, KeyboardAvoidingView } from "react-native";
// import { Input, Button, Image, Text } from "react-native-elements";
// import { database, useFirebase } from "../context/AuthContext";
// // import FadeInView from '../FadeInView';

// const Signup = ({ navigation }) => {
//   const firebase = useFirebase();
//   const [showModal, setShowModal] = useState(false);
//   const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [emailError, setEmailError] = useState(null);
//   useEffect(() => {
//     if (firebase.isLoggedIn) {
//       navigation.navigate("Home");
//     }
//   }, [firebase, navigation]);

//   const handleSignup = async () => {
//     try {
//       const signUp = await firebase.signupUserWithEmailAndPass(
//         email,
//         username,
//         password
//         );
//         if (signUp) {
//           console.warn("Sign Up Successful");
//           console.log(signUp);
//           setShowModal(true);

//       } else {
//         Alert.alert(
//           "SplitEase",
//           "Sign Up Unsuccessful",
//           [
//             {
//               text: "OK",
//               onPress: () => navigation.navigate("Signup"),
//             },
//           ],
//           { cancelable: false }
//         );
//       }
//     } catch (error) {
//       // Handle registration errors
//       console.error("Registration error:", error.message);
//     }
//   };

//   return (
//     <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">

//     <View style={styles.container}>
//       <Image
//         source={require("../assets/login_img.png")} // Add your logo path here
//         style={styles.logo}
//       />

//       <Input
//         placeholder="Username"
//         leftIcon={{ type: "font-awesome", name: "user" }}
//         value={username}
//         onChangeText={setUsername}
//         autoCapitalize="none"
//         />

//       <Input
//         placeholder="Email"
//         leftIcon={{ type: "font-awesome", name: "envelope" }}
//         value={email}
//         onChangeText={setEmail}
//         keyboardType="email-address"
//         autoCapitalize="none"
//         autoCorrect={false}
//         error={!!emailError}
//         errorStyle={{ color: "red" }}
//       />
//       <Input
//         placeholder="Password"
//         leftIcon={{ type: "font-awesome", name: "lock" }}
//         value={password}
//         onChangeText={setPassword}
//         secureTextEntry
//       />
//       <Input
//         placeholder="Confirm Password"
//         leftIcon={{ type: "font-awesome", name: "lock" }}
//         value={confirmPassword}
//         onChangeText={setConfirmPassword}
//         secureTextEntry
//         />
//       <Text>Already have an account. </Text>
//       <TouchableOpacity onPress={() => navigation.navigate("Login")}>
//         <Text style={{ color: "blue", textDecorationLine: "underline" }}>
//           Log In?
//         </Text>
//       </TouchableOpacity>

//       <Button
//         title="Submit"
//         onPress={handleSignup}
//         containerStyle={styles.buttonContainer}
//       />

//       <Modal
//         visible={showModal}
//         animationType="slide"
//         transparent={true}
//         onRequestClose={() => setShowModal(false)}
//         >
//         <View
//           style={{
//             flex: 1,
//             justifyContent: "center",
//             alignItems: "center",
//             backgroundColor: "rgba(0, 0, 0, 0.5)",
//           }}
//           >
//           <View
//             style={{
//               backgroundColor: "white",
//               padding: 20,
//               borderRadius: 10,
//               alignItems: "center",
//             }}
//           >
//               <Image
//               source={{
//                 uri: "https://media1.tenor.com/m/0AVbKGY_MxMAAAAC/check-mark-verified.gif",
//               }}
//               style={{ width: 50, height: 50 }}
//               />
//             <Text style={{ marginTop: 10, fontSize: 17 }}>
//               Account created successfully!
//             </Text>
//             <Button title="OK" onPress={() => setShowModal(false)} />
//           </View>
//         </View>
//       </Modal>
//     </View>
// </KeyboardAvoidingView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     // padding: 20,
//     marginTop: 5,
//   },
//   logo: {
//     width: 150,
//     height: 150,
//     marginBottom: 20,
//   },
//   buttonContainer: {
//     marginTop: 20,
//     // width: '100%',
//   },
// });

// export default Signup;


import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Platform, KeyboardAvoidingView } from 'react-native';
import { Input, Text,Image } from 'react-native-elements';
import { useFirebase } from '../context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from "expo-status-bar";
import { TextInput } from "react-native-gesture-handler";
import Animated, { Easing, FadeIn, FadeInDown, FadeInUp, FadeOut } from 'react-native-reanimated';


// import * as Font from 'expo-font';
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

  // useEffect(() => {
  //   if (firebase.isLoggedIn) {
  //     navigation.navigate('Home');
  //   }
  // }, [firebase, navigation]);
  // const window = useWindowDimensions();
  // useEffect(() => {
  //   const loadFonts = async () => {
  //     await Font.loadAsync({
  //       'Arial': require('../assets/fonts/arial.ttf'),
  //     });
  //     setFontLoaded(true);
  //   };
  //   loadFonts();
  // }, []);

  // // If fonts haven't loaded yet, don't render the component
  // if (!fontLoaded) {
  //   return null;
  // }



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
    <KeyboardAvoidingView>

      <View className="bg-white h-full w-full">
        <StatusBar style="light" />
        <View className="w-full h-full absolute">
          <Image className="h-full w-full" source={require('../assets/background.png')} />
        </View>
        <View className="flex-row justify-around w-full absolute">
          <Animated.Image entering={FadeInUp.delay(200).duration(1000).springify()} className="h-[225] w-[90]" source={require('../assets/light.png')} />
          <Animated.Image entering={FadeInUp.delay(400).duration(1000).springify()} className="h-[160] w-[65]" source={require('../assets/light.png')} />
        </View>

        <View className="h-full w-full flex justify-around pt-48">

          <View className="flex items-center">
            <Animated.Text entering={FadeInUp.delay(200).duration(2000).springify()} className="text-white  font-bold tracking-wider text-5xl overflow-hidden">
              SignUp
            </Animated.Text>
          </View>

          <View className="flex items-center mx-4 space-y-2">

            <Animated.View entering={FadeInUp.delay(200).duration(2000).springify()} className="bg-black/5 p-4 rounded-2xl w-full">
              <TextInput placeholder="Username"
                placeholderTextColor={'gray'}
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
            </Animated.View>

            <Animated.View entering={FadeInUp.delay(400).duration(2000).springify()} className="bg-black/5 p-4 rounded-2xl w-full">
              <TextInput placeholder="Email"
                placeholderTextColor={'gray'}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                error={!!emailError}
                errorStyle={{ color: 'red' }} />
            </Animated.View>


            <Animated.View entering={FadeInUp.delay(400).duration(2000).springify()} className="bg-black/5 p-4 rounded-2xl w-full">
              <TextInput placeholder="Password"
                placeholderTextColor={'gray'}
                value={password}
                onChangeText={setPassword}
                secureTextEntry />
            </Animated.View>


            <Animated.View entering={FadeInUp.delay(400).duration(2000).springify()} className="bg-black/5 p-4 rounded-2xl w-full">
              <TextInput placeholder="Confirm Password"
                placeholderTextColor={'gray'}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry />
            </Animated.View>

            <Animated.View entering={FadeInUp.delay(600).duration(2000).springify()} className="w-full">
              <TouchableOpacity
                className="w-full bg-sky-400 p-3 rounded-2xl mb-2"
                title = "Submit"
                onPress={handleSignup}
              >
                <Text className="text-xl font-bold text-white text-center">
                  Signup
                </Text>
              </TouchableOpacity>
            </Animated.View>

            <Animated.View entering={FadeInUp.delay(800).duration(2000).springify()} className="flex-row justify-centre">
              <Text>
                Already have an account?
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text className="text-sky-600">
                  Login
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
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
    height: '100%'
  },
  innerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    // height: '60%'
  },
  signupFont: {
    color: 'white',
    justifyContent: 'left',
    alignItems: 'left',
    margin: 50,
    marginTop: 80,
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