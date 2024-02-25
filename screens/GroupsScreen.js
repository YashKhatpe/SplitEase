import React, { useState } from "react";
import { View, Text, Button, Modal, Image, StyleSheet } from "react-native";
const GroupsScreen = ({ navigation }) => {
  const [showModal, setShowModal] = useState(false);
  const handleModal = () => {
    setShowModal(true);
  };
  return (
    <View style={styles.container}>
      <Button title="Open Modal" onPress={handleModal} />
      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalContainer}>
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
                uri: styles.modalImg.uri,
              }}
              style={styles.modalImg}
            />
            <Text style={styles.modalImg.text}>
              Account created successfully!
            </Text>
            <Button title="OK" onPress={() => setShowModal(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    backgroundColor: "green", 
    height: "100%" 
},
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalImg: {
    uri: 'https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExN2Fvc2xpN2I0cHRvazd3c3h1YmZuM3ZuZ29lamI1Mm40bWVoNGhsOSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/KBxyo8FDKE33qnj3KB/giphy.gif',
    width: 50,
    height: 50,
  },
  modalText: {
    marginTop: 10, 
    fontSize: 17
  }
});
export default GroupsScreen;
