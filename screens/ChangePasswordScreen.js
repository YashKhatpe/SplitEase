import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import {firebaseAuth} from '../context/AuthContext'

import auth from '@react-native-firebase/auth'
const ChangePasswordScreen = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleChangePassword = async () => {
    try {
      // Re-authenticate the user with their current password
      const user = firebaseAuth.currentUser;
      console.log('P data',user);
      const credential = firebaseAuth.EmailAuthProvider.credential(
        user.email,
        currentPassword
      );
      await user.reauthenticateWithCredential(credential);

      // If re-authentication is successful, update the password
      await user.updatePassword(newPassword);

      // Password updated successfully
      Alert.alert('Success', 'Password updated successfully!');
    } catch (error) {
      // Handle errors
      console.error('Error updating password:', error.message);
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        style={{ marginBottom: 10, paddingVertical: 8, paddingHorizontal: 12, borderColor: '#ccc', borderWidth: 1 }}
        placeholder="Current Password"
        secureTextEntry
        value={currentPassword}
        onChangeText={setCurrentPassword}
      />
      <TextInput
        style={{ marginBottom: 10, paddingVertical: 8, paddingHorizontal: 12, borderColor: '#ccc', borderWidth: 1 }}
        placeholder="New Password"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />
      <Button title="Change Password" onPress={handleChangePassword} />
    </View>
  );
};

export default ChangePasswordScreen;
