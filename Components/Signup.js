import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Input, Button, Image } from 'react-native-elements';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignup = () => {
    // Implement your signup logic here
    console.log('Signup pressed');
    console.warn('Signup pressed');
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/login_img.png')} // Add your logo path here
        style={styles.logo}
      />
      <Input
        placeholder="Username"
        leftIcon={{ type: 'font-awesome', name: 'user' }}
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <Input
        placeholder="Email"
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
      <Input
        placeholder="Confirm Password"
        leftIcon={{ type: 'font-awesome', name: 'lock' }}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <Button
        title="Signup"
        onPress={handleSignup}
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
     marginTop: 80
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
