import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
const BackButton = ({navigation}) => {
    const handleBack = ()=> {
        navigation.goBack();
    }
  return (
    <TouchableOpacity onPress={handleBack} style={{ marginLeft: 10 }}>
      <Ionicons name="arrow-back" size={24} color="black" />
    </TouchableOpacity>
  );
}

export default BackButton;
