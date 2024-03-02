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
import { StatusBar } from "expo-status-bar";
import { TextInput } from "react-native-gesture-handler";
import Animated, { Easing, FadeIn, FadeInDown, FadeInUp, FadeOut } from 'react-native-reanimated';


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
      if (!email || !password) {
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
              onPress: async () => await navigation.navigate("Login"),
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
    <View className="bg-white h-full w-full">
      <StatusBar style="light" />
      <View className="w-full h-full absolute">
        <Image className="h-full w-full" source={require('../assets/background.png')} />
      </View>
      <View className="flex-row justify-around w-full absolute">
        <Animated.Image entering={FadeInUp.delay(200).duration(1000).springify()} className="h-[225] w-[90]" source={require('../assets/light.png')} />
        <Animated.Image entering={FadeInUp.delay(400).duration(1000).springify()} className="h-[160] w-[65]" source={require('../assets/light.png')} />
      </View>

      <View className="h-full w-full flex justify-around pt-40 pb-5">

        <View className="flex items-center">
          <Animated.Text entering={FadeInUp.delay(200).duration(2000).springify()} className="text-white  font-bold tracking-wider text-5xl overflow-hidden">
            Login
          </Animated.Text>
        </View>

        <View className="flex items-center mx-4 space-y-4">

          <Animated.View entering={FadeInUp.delay(200).duration(2000).springify()} className="bg-black/5 p-4 rounded-2xl w-full">
            <TextInput placeholder="Email"
              placeholderTextColor={'gray'}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(400).duration(2000).springify()} className="bg-black/5 p-4 rounded-2xl w-full">
            <TextInput placeholder="Password"
              placeholderTextColor={'gray'}
              secureTextEntry
              value={password}
              onChangeText={setPassword} />
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(600).duration(2000).springify()} className="w-full">
            <TouchableOpacity
              className="w-full bg-sky-400 p-3 rounded-2xl mb-3"
              onPress={handleLogin}
            >
              <Text className="text-xl font-bold text-white text-center">
                Login
              </Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(800).duration(2000).springify()} className="flex-row jusatify-centre">
            <Text>
              Don't have an account?
            </Text>
            <TouchableOpacity>
              <Text className="text-sky-600">
                SignUp
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </View>

  );
};

const styles = StyleSheet.create({

});

export default Login;