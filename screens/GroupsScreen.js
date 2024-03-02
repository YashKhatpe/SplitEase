import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  Modal,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import * as Contacts from "expo-contacts";

const GroupsScreen = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);
  const handleCreateGroup = () => {
    if (hasPermission) {
      navigation.navigate('CreateGroup');
    }
  };
  return (
    <ScrollView>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleCreateGroup} style={styles.btn1}>
          <Text style={{ fontSize: 20, padding: 10 }}>Create new group</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "ceter",
    alignItems: "center",
    marginTop: 10,
    borderColor: "green",
    borderWidth: 1,
  },
  btn1: {
    position: "relative",
    // height: 50,
    backgroundColor: "white",
    borderColor: "#1cc19f",
    borderWidth: 1,
    color: "black",
    justifyContent: "center",
    alignItems: "center",
    // borderRadius: 5,
    // Shadow properties for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    // Elevation for Android
    elevation: 5,
  },
});
export default GroupsScreen;
