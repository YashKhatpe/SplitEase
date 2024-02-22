import React, { useState, useEffect } from "react";
import { View, StyleSheet, Alert, Modal, Text, KeyboardAvoidingView } from "react-native";
import { Input, Button, Image } from "react-native-elements";
import { useFirebase } from "../context/AuthContext";
const Login = ({ navigation }) => {
  const firebase = useFirebase();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleLogin = async (e) => {
    // Implement your login logic here
    if (e.nativeEvent.key === "Enter") {
      e.preventDefault();
    }
    try {
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
              onPress: () => navigation.navigate("Login"),
            },
          ],
          { cancelable: false }
        );
      }
    } catch (error) {
      

      console.warn("Login Error: ", error.message);
    }
  };

  const handleModalSuccess = () => {
    navigation.navigate("Main")
    setShowModal(false);
    
  }

  return (
    <KeyboardAvoidingView>

    <View style={styles.container}>
      <Image source={require("../assets/login_img.png")} style={styles.logo} />
      <Input
        placeholder="Username"
        leftIcon={{ type: "font-awesome", name: "envelope" }}
        value={email}
        onChangeText={setEmail}
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
</KeyboardAvoidingView>
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
