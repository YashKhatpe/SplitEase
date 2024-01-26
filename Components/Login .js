import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Input, Button, Image } from 'react-native-elements';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    // Implement your login logic here
    console.log('Login pressed');
    setEmail('');
    setPassword('');
    console.warn('Login pressed');
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/login_img.png')} 
        style={styles.logo}
      />
      <Input
        placeholder="Username"
        leftIcon={{ type: 'font-awesome', name: 'envelope' }}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Input
        placeholder="Password"
        leftIcon={{ type: 'font-awesome', name: 'lock' }}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button
        title="Login"
        onPress={handleLogin}
        containerStyle={styles.buttonContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // padding: 20,
    marginTop: 120
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  buttonContainer: {
    marginTop: 20,
    width: '100%',
  },
});

export default Login;
