import React from 'react';
import { View, Text, Button } from 'react-native';
// import { Button } from 'react-native-elements';
const AccountScreen = ({navigation}) => {
  return (
    <View  style={{ flex: 1 }}>
      <Text>Account Screen</Text>
      <Button title='Login' onPress={()=> navigation.navigate('Login') } style={{ alignItems: "center", paddingVertical: 16 }}/>
      <Button title='Signup' onPress={()=> navigation.navigate('Signup')} style={{ alignItems: "center", paddingVertical: 26 }}/>
      <Button title='Home' onPress={()=> navigation.navigate('Home')} style={{ alignItems: "center", paddingVertical: 36 }}/>
    </View>
  );
}

export default AccountScreen;
