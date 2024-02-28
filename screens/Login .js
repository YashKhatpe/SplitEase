// import React, { useState, useEffect } from "react";
// import { View, StyleSheet, Alert, Modal, Text, KeyboardAvoidingView } from "react-native";
// import { Input, Button, Image } from "react-native-elements";
// import { useFirebase } from "../context/AuthContext";
// import FriendsScreen from "./FriendsScreen";

// const Login = ({ navigation }) => {
//   const firebase = useFirebase();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showModal, setShowModal] = useState(false);
//   const [isLogIn, setIsLogIn] = useState(false);
//   useEffect(() => {
//     const logInStatus = firebase.isLoggedIn;
//     console.log(logInStatus);
//     logInStatus ? setIsLogIn(true) : setIsLogIn(false);
//   }, []);

//   const handleLogin = async (e) => {
//     // Implement your login logic here
//     if (e.nativeEvent.key === "Enter") {
//       e.preventDefault();
//     }
//     try {
//       const logIn = await firebase.loginUserWithEmailAndPass(email, password);
//       if (logIn) {
//         setShowModal(true);
//         return;
//       } else {
//         Alert.alert(
//           "SplitEase",
//           "Log In Unsuccessful",
//           [
//             {
//               text: "OK",
//               onPress: () => navigation.navigate("Login"),
//             },
//           ],
//           { cancelable: false }
//         );
//       }
//     } catch (error) {
      

//       console.warn("Login Error: ", error.message);
//     }
//   };

//   const handleModalSuccess = () => {
//     navigation.navigate("Main")
//     setShowModal(false);
    
//   }

//   return (

//       <KeyboardAvoidingView>

//     <View style={styles.container}>
//       <Image source={require("../assets/login_img.png")} style={styles.logo} />
//       <Input
//         placeholder="Enter Username or Email"
//         leftIcon={{ type: "font-awesome", name: "envelope" }}
//         value={email}
//         onChangeText={setEmail}
//         autoCapitalize="none"
//         />
//       <Input
//         placeholder="Password"
//         leftIcon={{ type: "font-awesome", name: "lock" }}
//         value={password}
//         onChangeText={setPassword}
//         secureTextEntry
//         />
//       <Button
//         title="Login"
//         onPress={handleLogin}
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
//             >
//             <Image
//               source={{
//                 uri: "https://media1.tenor.com/m/0AVbKGY_MxMAAAAC/check-mark-verified.gif",
//               }}
//               style={{ width: 50, height: 50 }}
//               />
//             <Text style={{ marginTop: 10, fontSize: 17 }}>
//               Logged In successfully!
//             </Text>
//             <Button title="OK" onPress={handleModalSuccess} />
//           </View>
//         </View>
//       </Modal>
//     </View>
// </KeyboardAvoidingView>
  
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     // flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     // padding: 20,
//     marginTop: 120,
//   },
//   logo: {
//     width: 150,
//     height: 150,
//     marginBottom: 20,
//   },
//   buttonContainer: {
//     marginTop: 20,
//     width: "100%",
//   },
// });

// export default Login;


import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Text, Alert, Modal } from "react-native";
import { Input, Button, Image } from "react-native-elements";
import { useFirebase } from '../context/AuthContext';
import * as Font from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
const Login = ({ navigation }) => {
  const firebase = useFirebase();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [buttonColor, setButtonColor] = useState("#246BFD");
  const [fontLoaded, setFontLoaded] = useState(false);
  const [showModal, setShowModal] = useState(false);
    const [isLogIn, setIsLogIn] = useState(false);

    useEffect(() => {
    const logInStatus = firebase.isLoggedIn;
    console.log(logInStatus);
    logInStatus ? setIsLogIn(true) : setIsLogIn(false);
  }, []);
 
  // useEffect(() => {
  //   const loadFonts = async () => {
  //     await Font.loadAsync({
  //       'Arial': require('../assets/fonts/arial.tff'),
  //     });
  //     setFontLoaded(true);
  //   };
  //   loadFonts();
  // }, []);

  // If fonts haven't loaded yet, don't render the component
  // if (!fontLoaded) {
  //   return null;
  // }


  const handleLogin = async (e) => {
        // Implement your login logic here
        if (e.nativeEvent.key === "Enter") {
          e.preventDefault();
        }
        try {
          if(!email || !password) {
                Alert.alert('Please enter all the fields correctly');
                return;
              }
          const logIn = await firebase.loginUserWithEmailAndPass(email, password);
          if (logIn) {
            setShowModal(true);
            return;
          } else {
            Alert.alert(
              "SplitEase",
              "Log In Unsuccessful",
              [
                {
                  text: "OK",
                  onPress: async() => await navigation.navigate("Login"),
                },
              ],
              { cancelable: false }
            );
          }
        } catch (error) {
          console.warn("Login Error: ", error.message);
        }
      };

      
  const handlePressIn = () => {
    setButtonColor("#181827");
  }

  const handlePressOut = () => {
    setButtonColor("#246BFD");
  }

    const handleModalSuccess = async () => {
    setShowModal(false);
    await navigation.navigate("Main")
    
  }
 
  
  return (

      <LinearGradient colors={['#000070', '#000047', '#000033', '#00001f']} start={{ x: -1, y: 0 }}
      end={{ x: 1, y: 1 }} style={styles.container}>
      <View style={styles.LoginFont}>
        <Text style={{ color: 'white', fontSize: 45 }}>
          Login
        </Text>
      </View>
      <View style={styles.innerContainer}>
       
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
        <TouchableOpacity
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={handleLogin}
          style={[styles.buttonContainer, { backgroundColor: buttonColor }]}
        >
          <Text style={styles.button}>Login</Text>
        </TouchableOpacity>
        <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowModal(false)}
        >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
          >
          <View
            style={{
              backgroundColor: "white",
              padding: 20,
              borderRadius: 10,
              alignItems: "center",
            }}
            >
            <Image
              source={{
                uri: "https://media1.tenor.com/m/0AVbKGY_MxMAAAAC/check-mark-verified.gif",
              }}
              style={{ width: 50, height: 50 }}
              />
            <Text style={{ marginTop: 10, fontSize: 17 }}>
              Logged In successfully!
            </Text>
            <Button title="OK" onPress={handleModalSuccess} />
          </View>
        </View>
      </Modal>
      </View>
    </LinearGradient>
    
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
