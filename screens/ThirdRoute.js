import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";

import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useFirebase } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
const ThirdRoute = ({
  route,
  onSelectOption,
  friend,
  amount,
  onSplitDetails,
  profilePicUrl,
  friendProfilePicUrl,
}) => {
  const [firstPercent, setFirstPercent] = useState("");
  const [secondPercent, setSecondPercent] = useState("");
  const [finalPercent, setFinalPercent] = useState(100);

  const navigation = useNavigation();
  const firebase = useFirebase();
  const handleSplitting = async () => {
    console.log("In Percent splitting");
    if (Number(firstPercent) + Number(secondPercent) != finalPercent) {
      console.log("Incorrect percentage");
      Alert.alert(
        "SplitEase",
        `The per person amount don't add upto the 100%`,
        [
          {
            text: "OK",
          },
        ],
        { cancelable: false }
      );

      return;
    }
    try {
      if (!amount) {
        Alert.alert(
          "SplitEase",
          `You haven't entered any amount which should be splitted`,
          [
            {
              text: "OK",
            },
          ],
          { cancelable: false }
        );
        return;
      }
      const finalBillSplitDetails = {
        firstPersonPercent: firstPercent,
        secondPersonPercent: secondPercent,
        firstPersonAmt: (firstPercent / 100) * amount,
        secondPersonAmt: (secondPercent / 100) * amount,
      };
      onSplitDetails(finalBillSplitDetails);
      onSelectOption("percent");
      navigation.goBack();
      console.log("Correct amt");
    } catch (error) {
      console.log("Error while setting percentage: ", error.message);
    }
  };
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          bottom: 25,
        }}
      >
        <View style={styles.modalContainer}>
          <View style={{ top: 10 }}>
            <Text style={styles.modalText}>Split By Percentages</Text>
            <Text style={styles.grayText}>
              Enter the percentage split that's{" "}
            </Text>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "500",
                marginLeft: 80,
                bottom: 20,
                color: "gray",
              }}
            >
              fair for your situation
            </Text>
          </View>

          <View>
            <View style={{ flexDirection: "column" }}>
              <View style={styles.contactItem}>
                {profilePicUrl ? (
                  <Image
                    source={{ uri: profilePicUrl }}
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 50,
                      // marginTop: 10,
                      // borderWidth: 1,
                    }}
                  />
                ) : (
                  <Image
                    source={require("../images/poster_img.webp")}
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 50,
                    }}
                  />
                )}

                <Text
                  style={{
                    height: 35,
                    marginLeft: 2,
                    marginTop: 10,
                    paddingLeft: 15,
                    paddingRight: 70,
                    fontSize: 17,
                  }}
                >
                  {firebase.userName}
                </Text>
                <Text
                  style={{
                    position: "absolute",
                    left: 70,
                    top: 43,
                    fontSize: 12,
                    color: "gray",
                  }}
                >
                  &#8377; {((firstPercent / 100) * amount).toFixed(2)}
                </Text>

                <Text
                  style={{
                    left: 310,
                    bottom: 23,
                    fontSize: 17,
                    position: "absolute",
                  }}
                >
                  %
                </Text>
                <TextInput
                  placeholder="0.00"
                  placeholderTextColor={"gray"}
                  value={firstPercent.toString()}
                  keyboardType="number-pad"
                  returnKeyType="done"
                  onChangeText={(text) => {
                    const newText = text.replace(/\s/g, "");
                    setFirstPercent(newText);
                  }}
                  onKeyPress={(e) => {
                    if (e.nativeEvent.key === " ") {
                      e.preventDefault();
                    }
                  }}
                  style={{
                    position: "absolute",
                    fontSize: 17,
                    width: 50,
                    bottom: 20,
                    left: 260,
                    borderBottomColor: "#1FB299",
                    borderBottomWidth: 2,
                  }}
                />
              </View>
            </View>
            <View>
              <View style={styles.contactItem}>
                {friendProfilePicUrl ? (
                  <Image
                    source={{ uri: friendProfilePicUrl }}
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 50,
                    }}
                  />
                ) : (
                  <Image
                    source={require("../images/poster_img.webp")}
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 50,
                    }}
                  />
                )}

                <Text
                  style={{
                    height: 35,
                    marginLeft: 2,
                    marginTop: 10,
                    paddingLeft: 15,
                    paddingRight: 70,
                    fontSize: 17,
                  }}
                >
                  {friend.username}
                </Text>
                <Text
                  style={{
                    position: "absolute",
                    left: 70,
                    top: 43,
                    fontSize: 12,
                    color: "gray",
                  }}
                >
                  &#8377; {((secondPercent / 100) * amount).toFixed(2)}
                </Text>
                <Text
                  style={{
                    left: 310,
                    bottom: 23,
                    fontSize: 17,
                    position: "absolute",
                  }}
                >
                  %
                </Text>
                <TextInput
                  placeholder="0.00"
                  placeholderTextColor={"gray"}
                  value={secondPercent.toString()}
                  keyboardType="number-pad"
                  returnKeyType="done"
                  onChangeText={(text) => {
                    const newText = text.replace(/\s/g, "");
                    setSecondPercent(newText);
                  }}
                  onKeyPress={(e) => {
                    if (e.nativeEvent.key === " ") {
                      e.preventDefault();
                    }
                  }}
                  style={{
                    position: "absolute",
                    fontSize: 17,
                    width: 50,
                    bottom: 20,
                    left: 260,
                    borderBottomColor: "#1FB299",
                    borderBottomWidth: 2,
                  }}
                />
              </View>
              <TouchableOpacity style={styles.button} onPress={handleSplitting}>
                <Ionicons
                  name={"ios-checkmark-outline"}
                  size={35}
                  color={"green"}
                  style={styles.tickMark}
                />
              </TouchableOpacity>
            </View>
            <View
              style={{
                marginTop: 15,
                flexDirection: "row",
                width: "100%",
                justifyContent: "center",
                top: 8,
                // borderWidth:1
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  top: 5,
                  backgroundColor: "white",
                  width: "100%",
                  paddingLeft: 90,
                }}
              >
                {(Number(firstPercent) + Number(secondPercent)).toFixed(2)}% of
                100%
              </Text>
            </View>

            {(
              finalPercent -
              (Number(firstPercent) + Number(secondPercent))
            ).toFixed(2) > 0 ? (
              <Text
                style={{
                  fontSize: 18,
                  top: 10,
                  color: "#1FB299",
                  backgroundColor: "white",
                  width: "100%",
                  paddingLeft: 100,
                  borderBottomColor: "#1FB299",
                  borderBottomWidth: 3,
                }}
              >
                &#8377;{" "}
                {(
                  finalPercent -
                  (Number(firstPercent) + Number(secondPercent))
                ).toFixed(2)}{" "}
                left
              </Text>
            ) : (
              <Text
                style={{
                  fontSize: 18,
                  top: 10,
                  color: "#b30000",
                  backgroundColor: "white",
                  width: "100%",
                  paddingLeft: 100,
                }}
              >
                &#8377;{" "}
                {(
                  (finalPercent -
                    (Number(firstPercent) + Number(secondPercent))) *
                  -1
                ).toFixed(2)}{" "}
                over
              </Text>
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default ThirdRoute;

const styles = StyleSheet.create({
  modalContainer: {
    padding: 20,
    borderRadius: 10,
  },
  modalText: {
    fontSize: 22,
    marginBottom: 10,
    fontWeight: "500",
    marginLeft: 70,
    bottom: 10,
  },
  grayText: {
    fontSize: 18,
    fontWeight: "500",
    marginLeft: 50,
    marginTop: 20,
    bottom: 20,
    color: "gray",
  },
  optionButton: {
    backgroundColor: "lightblue",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  optionButtonText: {
    fontSize: 16,
  },
  contactItem: {
    flexDirection: "row",
    paddingVertical: 10,
    borderColor: "#ccc",
    pointerEvents: "box-none",
    // borderWidth:1,
    width: "100%",
  },
  contactName: {
    height: 35,
    marginLeft: 2,
    marginTop: 5,
    paddingLeft: 15,
    fontSize: 15,
  },
  button: {
    backgroundColor: "white",
    position: "absolute",
    left: 260,
    borderRadius: 5,
    width: 50,
    top: 55,
    // bottom: 45,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 15,
  },
});
