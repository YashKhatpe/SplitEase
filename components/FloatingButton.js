import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';

const FloatingButton = ({ onPress, text, textColor='white', rightVal=20 }) => {
  return (
    <View style={[styles.container, {right: rightVal}]}>
      <TouchableOpacity onPress={onPress} style={styles.button}>
        <Text style={{color: textColor}}>{text}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    // pointerEvents: 'box-none'
  },
  button: {
    backgroundColor: 'green',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8, // for Android shadow
  },
});

export default FloatingButton;
