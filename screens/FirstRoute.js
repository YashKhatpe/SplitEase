import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import { useFirebase } from "../context/AuthContext";
const FirstRoute = ({
  route,
  onSelectOption,
  friend,
  splitMethod,
  amount,
  onSplitDetails,
  profilePicUrl,
  friendProfilePicUrl,
}) => {
  const navigation = useNavigation();
  const firebase = useFirebase();
  const [showTick, setShowTick] = useState("1");
  
  useEffect(() => {
    console.log("OnSelect:", onSelectOption);
  }, []);

  useEffect(() => {
    if (splitMethod === "creatorEqual") {
      setShowTick("1");
    } else if (splitMethod === "creatorWillPay") {
      setShowTick("2");
    } else if (splitMethod === "friendEqual") {
      setShowTick("3");
    } else if (splitMethod === "friendWillPay") {
      setShowTick("4");
    }
  }, []);

  const handleOptionSelect = (option) => {
    onSelectOption(option);
    const finalBillSplitDetails = {};

    navigation.goBack();
  };

  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <Text style={{ fontSize: 25, paddingHorizontal: 35, bottom: 50 }}>
        How the bill should split?
      </Text>
      <TouchableOpacity
        style={styles.contactItem}
        onPress={() => handleOptionSelect("creatorEqual")}
      >
        <View
          style={{
            borderWidth: 2,
            borderColor: "green",
            borderRadius: 50,
            position: "absolute",
            // left: 55,
            top: 10,
            width: 57,
            height: 57,
            zIndex: 1,
          }}
        ></View>
        <Image
          source={{ uri: profilePicUrl }}
          style={{
            width: 45,
            height: 45,
            borderRadius: 50,
            margin: 4,
            top: 2,
            zIndex: 4,
          }}
        />
        <View
          style={{
            borderWidth: 2,
            borderColor: "#985b5b",
            borderRadius: 50,
            position: "absolute",
            left: 35,
            top: 10,
            width: 57,
            height: 57,
            zIndex: 1,
          }}
        ></View>
        <Image
          source={{ uri: friendProfilePicUrl }}
          style={{
            width: 45,
            height: 45,
            borderRadius: 50,
            margin: 4,
            position: "absolute",
            left: 37,
            top: 12,
            zIndex: 3,
          }}
        />

        <Text
          style={{
            height: 35,
            fontSize: 15,
            position: "absolute",
            left: 110,
            top: 20,
          }}
        >
          You paid, split equally
        </Text>
        {showTick === "1" && (
          <Ionicons
            name={"ios-checkmark-outline"}
            size={35}
            color={"green"}
            style={styles.tickMark}
          />
        )}
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.contactItem}
        onPress={() => handleOptionSelect("creatorWillPay")}
      >
        <View
          style={{
            borderWidth: 2,
            borderColor: "green",
            borderRadius: 50,
            position: "absolute",
            left: 3,
            top: 10,
            width: 57,
            height: 57,
            zIndex: 5,
          }}
        >
          <Image
            source={{ uri: profilePicUrl }}
            style={{
              width: 45,
              height: 45,
              borderRadius: 50,
              margin: 4,
              zIndex: 6,
            }}
          />
        </View>
        <View style={{ left: 40 }}>
          <Image
            // source={require("../images/poster_img.webp")}
            source={{ uri: friendProfilePicUrl }}
            style={{
              width: 45,
              height: 45,
              borderRadius: 50,
              margin: 4,
            }}
          />
        </View>

        <Text
          style={{
            height: 35,
            fontSize: 15,
            position: "absolute",
            left: 110,
            top: 20,
          }}
        >
          You owe the full amount
        </Text>
        {showTick === "2" && (
          <Ionicons
            name={"ios-checkmark-outline"}
            size={35}
            color={"green"}
            style={styles.tickMark}
          />
        )}
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.contactItem}
        onPress={() => handleOptionSelect("friendEqual")}
      >
        <View
          style={{
            borderWidth: 2,
            borderColor: "green",
            borderRadius: 50,
            position: "absolute",
            // left: 55,
            top: 10,
            width: 57,
            height: 57,
            zIndex: 1,
          }}
        ></View>
        <Image
          source={{ uri: profilePicUrl }}
          style={{
            width: 45,
            height: 45,
            borderRadius: 50,
            margin: 4,
            zIndex: 2,
            top: 2,
          }}
        />
        <View
          style={{
            borderWidth: 2,
            borderColor: "#985b5b",
            borderRadius: 50,
            position: "absolute",
            left: 35,
            top: 10,
            width: 57,
            height: 57,
            zIndex: 1,
          }}
        ></View>
        <Image
          source={{ uri: friendProfilePicUrl }}
          style={{
            width: 45,
            height: 45,
            borderRadius: 50,
            margin: 4,
            position: "absolute",
            left: 37,
            top: 12,
            zIndex: 6,
          }}
        />

        <Text
          style={{
            height: 35,
            fontSize: 15,
            position: "absolute",
            left: 110,
            top: 20,
          }}
        >
          {friend.username} paid, split equally
        </Text>
        {showTick === "3" && (
          <Ionicons
            name={"ios-checkmark-outline"}
            size={35}
            color={"green"}
            style={styles.tickMark}
          />
        )}
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.contactItem}
        onPress={() => handleOptionSelect("friendWillPay")}
      >
        <Image
          source={{ uri: profilePicUrl }}
          style={{
            width: 45,
            height: 45,
            borderRadius: 50,
            margin: 4,
            top: 2,
            zIndex: 4,
          }}
        />

        <View
          style={{
            borderWidth: 2,
            borderColor: "#985b5b",
            borderRadius: 50,
            position: "absolute",
            left: 35,
            top: 10,
            width: 57,
            height: 57,
            zIndex: 1,
          }}
        ></View>
        <Image
          source={{ uri: friendProfilePicUrl }}
          style={{
            width: 45,
            height: 45,
            borderRadius: 50,
            margin: 4,
            position: "absolute",
            left: 37,
            top: 12,
            zIndex: 5,
          }}
        />

        <Text style={styles.contactName}>
          {friend.username} owes full amount
        </Text>
        {showTick === "4" && (
          <Ionicons
            name={"ios-checkmark-outline"}
            size={35}
            color={"green"}
            style={styles.tickMark}
          />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default FirstRoute;

const styles = StyleSheet.create({
  contactItem: {
    flexDirection: "row",
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    pointerEvents: "box-none",
    height: 80,
  },
  contactName: {
    height: 35,
    fontSize: 15,
    position: "absolute",
    left: 110,
    top: 20,
  },
  ionicon: {
    marginLeft: 2,
    marginTop: 6,
    paddingHorizontal: 8,
    paddingLeft: 20,
    fontSize: 18,
    fontWeight: "bold",
  },
  tickMark: {
    position: "absolute",
    right: 10,
    top: 10,
  },
});
