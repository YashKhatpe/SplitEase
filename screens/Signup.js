import React, { useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity, Modal, KeyboardAvoidingView } from "react-native";
import { Input, Button, Image, Text } from "react-native-elements";
import { database, useFirebase } from "../context/AuthContext";
// import FadeInView from '../FadeInView';

const Signup = ({ navigation }) => {
  const firebase = useFirebase();
  const [showModal, setShowModal] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState(null);
  useEffect(() => {
    if (firebase.isLoggedIn) {
      navigation.navigate("Home");
    }
  }, [firebase, navigation]);

  const handleSignup = async () => {
    try {
      const signUp = await firebase.signupUserWithEmailAndPass(
        email,
        username,
        password
        );
        if (signUp) {
          console.warn("Sign Up Successful");
          console.log(signUp);
          setShowModal(true);
       
      } else {
        Alert.alert(
          "SplitEase",
          "Sign Up Unsuccessful",
          [
            {
              text: "OK",
              onPress: () => navigation.navigate("Signup"),
            },
          ],
          { cancelable: false }
        );
      }
    } catch (error) {
      // Handle registration errors
      console.error("Registration error:", error.message);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">

    <View style={styles.container}>
      <Image
        source={require("../assets/login_img.png")} // Add your logo path here
        style={styles.logo}
      />

      <Input
        placeholder="Username"
        leftIcon={{ type: "font-awesome", name: "user" }}
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        />

      <Input
        placeholder="Email"
        leftIcon={{ type: "font-awesome", name: "envelope" }}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        error={!!emailError}
        errorStyle={{ color: "red" }}
      />
      <Input
        placeholder="Password"
        leftIcon={{ type: "font-awesome", name: "lock" }}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Input
        placeholder="Confirm Password"
        leftIcon={{ type: "font-awesome", name: "lock" }}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        />
      <Text>Already have an account. </Text>
      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={{ color: "blue", textDecorationLine: "underline" }}>
          Log In?
        </Text>
      </TouchableOpacity>

      <Button
        title="Submit"
        onPress={handleSignup}
        containerStyle={styles.buttonContainer}
      />

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
              Account created successfully!
            </Text>
            <Button title="OK" onPress={() => setShowModal(false)} />
          </View>
        </View>
      </Modal>
    </View>
</KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // padding: 20,
    marginTop: 5,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  buttonContainer: {
    marginTop: 20,
    // width: '100%',
  },
});

export default Signup;
