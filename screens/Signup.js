import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Platform, KeyboardAvoidingView, Alert } from 'react-native';
import { Input, Text } from 'react-native-elements';
import { useFirebase } from '../context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';


const Signup = ({ navigation }) => {

  const firebase = useFirebase();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState(null);
  const [buttonColor, setButtonColor] = useState("#246BFD");


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
      console.log('Signup object: ', signUp);
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


  return (
    <KeyboardAvoidingView>

    <LinearGradient colors={['#000070', '#000047', '#000033', '#00001f']} start={{ x: 0, y: 0 }}
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
            placeholder="Phone Number"
            leftIcon={{ type: 'font-awesome', name: 'phone', color: 'white' }}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType='numeric'
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