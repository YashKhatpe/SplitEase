import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
  Platform,
} from "react-native";
import { Image } from "react-native-elements";
import { useFirebase } from "../context/AuthContext";
import { StatusBar } from "expo-status-bar";
import { TextInput } from "react-native-gesture-handler";
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  FadeInUp,
  FadeOut,
} from "react-native-reanimated";

const Login = ({ navigation }) => {
  const firebase = useFirebase();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogIn, setIsLogIn] = useState(false);

  useEffect(() => {
    if (firebase.isLoggedIn) setIsLogIn(true);
  }, [firebase.isLoggedIn]);

  const handleLogin = async (e) => {
    // Implement your login logic here
    if (e.nativeEvent.key === "Enter") {
      e.preventDefault();
    }
    try {
      if (!email || !password) {
        Alert.alert("Please enter all the fields correctly");
        return;
      }
      const logIn = await firebase.loginUserWithEmailAndPass(email, password);
      if (logIn) {
        navigation.navigate("Main");
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

  return (
    <View className="bg-white h-full w-full">
      <StatusBar style="light" />
      <View className="w-full h-full absolute">
        <Image
          className="h-full w-full"
          source={require("../assets/background.png")}
        />
      </View>
      <View className="flex-row justify-around w-full absolute">
        <Animated.Image
          entering={FadeInUp.delay(200).duration(1000).springify()}
          className="h-[225] w-[90]"
          source={require("../assets/light.png")}
        />
        <Animated.Image
          entering={FadeInUp.delay(400).duration(1000).springify()}
          className="h-[160] w-[65]"
          source={require("../assets/light.png")}
        />
      </View>

      <View className="h-full w-full flex justify-around pt-40 pb-5">
        <View className="flex items-center">
          <Animated.Text
            entering={FadeInUp.delay(200).duration(2000).springify()}
            className="text-white  font-bold tracking-wider text-5xl overflow-hidden"
          >
            Login
          </Animated.Text>
        </View>
        <View className="flex items-center mx-4 space-y-4">
          <Animated.View
            entering={FadeInUp.delay(200).duration(2000).springify()}
            className="bg-black/5 p-4 rounded-2xl w-full"
          >
            <TextInput
              placeholder="Email or Username"
              placeholderTextColor={"gray"}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </Animated.View>

          <Animated.View
            entering={FadeInUp.delay(400).duration(2000).springify()}
            className="bg-black/5 p-4 rounded-2xl w-full"
          >
            <TextInput
              placeholder="Password"
              placeholderTextColor={"gray"}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </Animated.View>

          <Animated.View
            entering={FadeInUp.delay(600).duration(2000).springify()}
            className="w-full"
          >
            <TouchableOpacity
              className="w-full bg-sky-400 p-3 rounded-2xl mb-3"
              onPress={handleLogin}
            >
              <Text className="text-xl font-bold text-white text-center">
                Login
              </Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View
            entering={FadeInUp.delay(800).duration(2000).springify()}
            className="flex-row jusatify-centre"
          >
            <Text>Don't have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
              <Text className="text-sky-600">SignUp</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
  },
  innerContainer: {
    justifyContent: "center",
    alignItems: "center",
    // height: '60%'
  },

  LoginFont: {
    color: "white",
    // flex:1,
    justifyContent: "left",
    alignItems: "left",
    margin: 50,
    marginTop: 150,
  },
  button: {
    // backgroundColor: 'blue', // Add background color here
    fontSize: 17,
    borderRadius: 6,
    color: "white",
    fontWeight: "500",
  },
  buttonContainer: {
    height: 50,
    width: 290,
    margin: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    overflow: "hidden",
    marginVertical: 10,
    ...Platform.select({
      ios: {
        shadowColor: "black",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 1.0,
        shadowRadius: 50,
      },
      android: {
        elevation: 7,
        shadowColor: "white",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 1.0,
        shadowRadius: 50,
      },
    }),
  },
  inputsContainer: {
    width: "87%",
    marginTop: 20,
    marginBottom: 0,
  },
  inputs: {
    color: "white",
    paddingLeft: 10,
  },
});

export default Login;
