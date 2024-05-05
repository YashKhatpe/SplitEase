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
const SecondRoute = ({
  route,
  onSelectOption,
  friend,
  amount,
  onSplitDetails,
  profilePicUrl,
  friendProfilePicUrl,
}) => {
  const [firstAmt, setFirstAmt] = useState("");
  const [secondAmt, setSecondAmt] = useState("");
  const [finalAmt, setFinalAmt] = useState(amount);
  const navigation = useNavigation();
  const firebase = useFirebase();
  const symbol = "₹";
  const handleSplitting = async () => {
    console.log("In unequal splitting");
    if (Number(firstAmt) + Number(secondAmt) != finalAmt) {
      console.log("Incorrect amount");
      Alert.alert(
        "SplitEase",
        `The per person amount don't add upto the total amount (₹${finalAmt} )`,
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
      firstPerson: firstAmt,
      secondPerson: secondAmt,
    };

    onSplitDetails(finalBillSplitDetails);
    onSelectOption("unequal");
    navigation.goBack();
    console.log("Correct amt");
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
            <Text style={styles.modalText}>Split By Exact Amount</Text>
            <Text style={styles.grayText}>Specify how much each</Text>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "500",
                marginLeft: 100,
                bottom: 20,
                color: "gray",
              }}
            >
              person owes
            </Text>
          </View>

          <View>
            <View style={{ flexDirection: "column" }}>
              <TouchableOpacity style={styles.contactItem}>
                {profilePicUrl ? (
                  <Image
                    source={{ uri: profilePicUrl }}
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
                  {firebase.userName}
                </Text>
                <Text
                  style={{
                    left: 260,
                    bottom: 23,
                    fontSize: 17,
                    position: "absolute",
                  }}
                >
                  &#8377;
                </Text>
                <TextInput
                  placeholder="0.00"
                  placeholderTextColor={"gray"}
                  value={firstAmt.toString()}
                  keyboardType="number-pad"
                  returnKeyType="done"
                  onChangeText={(text) => {
                    const newText = text.replace(/\s/g, "");
                    setFirstAmt(newText);
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
                    left: 280,
                    borderBottomColor: "#1FB299",
                    borderBottomWidth: 2,
                  }}
                />
              </TouchableOpacity>
            </View>
            <View>
              <TouchableOpacity style={styles.contactItem}>
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
                    left: 260,
                    bottom: 23,
                    fontSize: 17,
                    position: "absolute",
                  }}
                >
                  &#8377;
                </Text>
                <TextInput
                  placeholder="0.00"
                  placeholderTextColor={"gray"}
                  value={secondAmt.toString()}
                  keyboardType="number-pad"
                  returnKeyType="done"
                  onChangeText={(text) => {
                    const newText = text.replace(/\s/g, "");
                    setSecondAmt(newText);
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
                    left: 280,
                    borderBottomColor: "#1FB299",
                    borderBottomWidth: 2,
                  }}
                />
              </TouchableOpacity>
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
                &#8377;{(Number(firstAmt) + Number(secondAmt)).toFixed(2)} of
                &#8377;{Number(finalAmt).toFixed(2)}
              </Text>
            </View>

            {(finalAmt - (Number(firstAmt) + Number(secondAmt))).toFixed(2) >
            0 ? (
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
                {(finalAmt - (Number(firstAmt) + Number(secondAmt))).toFixed(2)}{" "}
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
                  (finalAmt - (Number(firstAmt) + Number(secondAmt))) *
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

export default SecondRoute;

const styles = StyleSheet.create({
  modalContainer: {
    padding: 20,
    borderRadius: 10,
  },
  modalText: {
    fontSize: 22,
    marginBottom: 10,
    fontWeight: "500",
    marginLeft: 60,
    bottom: 10,
  },
  grayText: {
    fontSize: 18,
    fontWeight: "500",
    marginLeft: 60,
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
    left: 280,
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
