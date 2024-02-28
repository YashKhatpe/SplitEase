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
import { Input, Text } from 'react-native-elements';
import { useFirebase } from '../context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
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

    <LinearGradient colors={['#000070', '#000047', '#000033', '#00001f']} start={{ x: -1, y: 0 }}
      end={{ x: 1, y: 1 }} style={styles.container}
    >
      <View style={styles.signupFont}>
          <Text style={{color:'white',fontSize:45}}>
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
    marginTop:80,
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