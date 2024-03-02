import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Alert,
  Image,
} from "react-native";
import { Input } from "react-native-elements";
import React, { useState, useEffect, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import { RadioButton } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { getDatabase, child, ref, set, get, runTransaction, push } from "@firebase/database";
import { getUsernameFromEmail } from "../context/AuthContext";
import { useFirebase } from "../context/AuthContext";

const CreateGroup = ({ navigation }) => {
  const inputRef = useRef(null);
  const firebase = useFirebase();
  useEffect(() => {
    inputRef.current.focus();
  }, []);
  const [groupName, setGroupName] = useState("");
  const [groupProfPic, setGroupProfPic] = useState(null);
  const [checked, setChecked] = useState("family");
  const [groupData, setGroupData] = useState(null);
  const [username, setUsername] = useState(null);
  useEffect(() => {
    if (groupData !== null) {
      console.log(groupData);
      navigation.navigate("InviteScreen", { groupData });
    }
  }, [groupData]);

  const handleAddGroup = async () => {
    if (groupName === "") {
      Alert.alert("Please enter group name");
      return;
    }
    var currUser;
      const email = await firebase.user.email;
      const atIndex = email.indexOf("@");
      const shortEmail = email.slice(0, atIndex);
      currUser = ''
      //  await getUsernameFromEmail(shortEmail)
   
    const groupInfo = {
      groupName,
      type: checked,
      groupProfPic,
      members:{
        member0: [currUser]
      }
    };
    const db = getDatabase();
    const path = "users/groups/count";

    try {
      // Fetch the current number of groups
      const groupsCountRef = ref(db, path);
      const snapshot = await get(groupsCountRef);
      const currentCount = (snapshot.val() || 0) + 1;

      // Set the data for the new group under the next index
      const newGroupRef = ref(db, `users/groups/${currentCount}`);
      await set(newGroupRef, groupInfo);

      // Update the count of groups
      await set(groupsCountRef, currentCount);
      
      console.log("Group added successfully!");
  } catch (error) {
      console.error("Error adding group: ", error);
  }
  };

  const handlePress = (value) => {
    setChecked(value);
  };

  const handleGroupPic = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        const picUrl = result.assets[0].uri;
        console.log("Selected image URI:", picUrl);
        setGroupProfPic(picUrl);
        // const profPicUrl = picUrl;
        // const path = `users/accounts/${username}/profPicUrl`;
        // const friendsRef = ref(db, path);
        // const response = await set(friendsRef, profPicUrl);
        // if (!response) console.log('Server Error uploading pic');
        // console.log('Successfully update profile pic')
      }
    } catch (error) {
      console.error("Error selecting image:", error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          borderColor: "#1cc19f",
          borderWidth: 1,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            padding: 40,
            paddingLeft: 30,
          }}
        >
          <TouchableOpacity
            style={{
              width: 70,
              height: 70,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#D3D3D3",
              borderRadius: 5,
            }}
            onPress={handleGroupPic}
          >
            {groupProfPic ? (
              <Image
                source={{ uri: groupProfPic }}
                style={{ width: 80, height: 80 }}
              />
            ) : (
              <Ionicons name={"camera"} size={40} color={"black"} />
            )}
          </TouchableOpacity>
          <View
            style={{
              marginHorizontal: 30,
              width: 210,
            }}
          >
            <Text style={{ fontSize: 15, color: "grey" }}>
              Enter Group Name
            </Text>
            <Input
              ref={inputRef}
              inputStyle={{ fontSize: 20 }}
              value={groupName}
              onChangeText={setGroupName}
            />
          </View>
        </View>
        <View style={{ marginHorizontal: 30 }}>
          <Text style={{ fontSize: 15, color: "grey", paddingBottom: 20 }}>
            Type:{" "}
          </Text>

          <View>
            <RadioButton.Group
              onValueChange={(newValue) => setChecked(newValue)}
              value={checked}
            >
              {/* <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TouchableWithoutFeedback onPress={() => handlePress('first')}>
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginRight: 6,
                    borderColor: "grey",
                    borderWidth: 2,
                    borderRadius: 10,
                  }}
                >
                  <RadioButton value="family" />
                  <Text style={{ padding: 10, paddingLeft: 5 }}>Family</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginRight: 6,
                    borderColor: "grey",
                    borderWidth: 2,
                    borderRadius: 10,
                  }}
                  >
                  <RadioButton value="friends" />
                  <Text style={{ padding: 10 }}>Friends</Text>
                </TouchableOpacity>
                </TouchableWithoutFeedback>
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginRight: 6,
                    borderColor: "grey",
                    borderWidth: 2,
                    borderRadius: 10,
                  }}
                >
                  <RadioButton value="other" />
                  <Text style={{ padding: 10 }}>Other</Text>
                </TouchableOpacity>
              </View> */}
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TouchableWithoutFeedback onPress={() => handlePress("family")}>
                  <View style={styles.radioButtonContainer}>
                    <View
                      style={[
                        styles.radioButton,
                        checked === "family" && styles.checkedRadioButton,
                      ]}
                    >
                      {checked === "family" && (
                        <View style={styles.innerRadioButton} />
                      )}
                    </View>
                    <Text>Family</Text>
                  </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback
                  onPress={() => handlePress("friends")}
                >
                  <View style={styles.radioButtonContainer}>
                    <View
                      style={[
                        styles.radioButton,
                        checked === "friends" && styles.checkedRadioButton,
                      ]}
                    >
                      {checked === "friends" && (
                        <View style={styles.innerRadioButton} />
                      )}
                    </View>
                    <Text>Friends</Text>
                  </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => handlePress("others")}>
                  <View style={styles.radioButtonContainer}>
                    <View
                      style={[
                        styles.radioButton,
                        checked === "others" && styles.checkedRadioButton,
                      ]}
                    >
                      {checked === "others" && (
                        <View style={styles.innerRadioButton} />
                      )}
                    </View>
                    <Text>Others</Text>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </RadioButton.Group>
          </View>
        </View>
        <View>
          <TouchableOpacity
            style={{
              margin: 50,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#1cc19f",
              height: 50,
              borderRadius: 5,
            }}
            onPress={handleAddGroup}
          >
            <Text style={{ fontWeight: "700", fontSize: 20 }}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default CreateGroup;

const styles = StyleSheet.create({
  radioButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "40%",
  },
  radioButton: {
    marginRight: 10, // Adjust spacing between button and text if needed
    width: 20,
    height: 20,
    borderRadius: 10, // Ensure a circular shape for the button
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2, // Add border to emphasize the button
  },
  innerRadioButton: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#000", // Customize the color of the inner circle
  },
  checkedRadioButton: {
    borderColor: "#000", // Change border color when checked
  },
});
