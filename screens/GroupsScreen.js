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
import { MaterialIcons } from '@expo/vector-icons';

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
      navigation.navigate("CreateGroup");
    }
  };
  return (
    
      <View style={styles.container}>
        <TouchableOpacity onPress={handleCreateGroup} style={styles.btn1}>
          {/* <Text style={{ fontSize: 25, alignContent: "center" }}>Create new group</Text> */}
          <MaterialIcons name="group-add" style={{fontSize:27, color:'black'}}/>
        </TouchableOpacity>
      </View>
  
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "ceter",
    // alignItems: "center",
    // marginTop: 10,
    // borderColor: "green",
    // borderWidth: 1,
  },
  btn1: {
    position: "absolute",
    bottom: 27,
    right: 35,
    backgroundColor: "#1FB299",
    height: 65,
    borderRadius: 20,
    width: 65,
    justifyContent: "center",
    alignItems: "center",
  },
});
export default GroupsScreen;
