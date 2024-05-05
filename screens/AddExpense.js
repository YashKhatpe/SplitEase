import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { TextInput } from "react-native-gesture-handler";
import { useFirebase } from "../context/AuthContext";
import { get, getDatabase, push, ref, update } from "@firebase/database";
import { Ionicons } from "@expo/vector-icons";
import { getStorage, getDownloadURL, ref as storRef } from "@firebase/storage";

const AddExpense = ({ navigation, route }) => {
  const [amount, setAmount] = useState("");
  const [desc, setDesc] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [buttonTicked, setButtonTicked] = useState(false);
  const [splitOption, setSplitOption] = useState(
    "Paid by you and split equally"
  );
  const [splitMethod, setSplitMethod] = useState("creatorEqual");
  const [splitDetails, setSplitDetails] = useState({});
  const [profilePicUrl, setProfilePicUrl] = useState('https://cdn.vectorstock.com/i/500p/55/67/no-image-available-picture-vector-31595567.jpg');
  const [friendProfilePicUrl, setFriendProfilePicUrl] = useState('https://cdn.vectorstock.com/i/500p/55/67/no-image-available-picture-vector-31595567.jpg');

  const { friend } = route.params;
  const db = getDatabase();
  const firebase = useFirebase();
  const storage = getStorage();

  useEffect(() => {
    if (firebase && firebase.isLoggedIn) {
      const fetchPicUrlFromDb = async () => {
        const uid = await firebase.user.uid;
        const fid = await friend.uid;
        const storageRef = storRef(storage, `profilePic/${uid}`);
        const friendStorageRef = storRef(storage, `profilePic/${fid}`);
        if (storageRef) {
          const url = await getDownloadURL(storageRef);
          setProfilePicUrl(url);
          console.log("Url", url);
        }
        if (friendStorageRef) {
          const url = await getDownloadURL(friendStorageRef);
          setFriendProfilePicUrl(url);
          console.log("Url", url);
        }
      };
      fetchPicUrlFromDb();
    }
  }, [firebase.user, profilePicUrl, friendProfilePicUrl]);
  useEffect(() => {
    if (splitMethod === "creatorEqual") {
      setSplitOption("Paid by you and split equally");
    } else if (splitMethod === "creatorWillPay") {
      if (amount) {
        setSplitOption(`${friend.username} owes you Rs.${amount}`);
      } else setSplitOption(`${friend.username} owes you full amount`);
    } else if (splitMethod === "friendEqual") {
      setSplitOption(`Paid by ${friend.username} and split equally`);
    } else if (splitMethod === "friendWillPay") {
      if (amount) {
        setSplitOption(`You owe ${friend.username} Rs.${amount}`);
      } else {
        setSplitOption(`You owe ${friend.username} full amount`);
      }
    } else if (splitMethod === "unequal") {
      setSplitOption("Paid by you and split unequally");
    } else if (splitMethod === "percent") {
      console.log(splitDetails);
      setSplitOption(
        `Paid by you and split by percentage (${splitDetails.firstPersonPercent}% and ${splitDetails.secondPersonPercent}%)`
      );
    }
  }, [splitMethod, amount, splitDetails]);

  useEffect(() => {
    console.log(firebase.userName);
  }, [firebase]);

  useEffect(() => {
    if (buttonTicked) {
      handleSplitting();
    }
  }, [buttonTicked]);
  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const handleSplitting = async () => {
    if (desc.trim() === "" || amount === 0) {
      Alert.alert(
        "SplitEase",
        `Please enter both the fields of description and amount: ${amount}`,
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
      const currDate = await firebase.getCurrentDate();
      const uName = await firebase.userName;
      const uId = await firebase.user.uid;
      console.log(uName);

      const participants = [friend.uid];
      const billRef = ref(db, "bills");
      const billData = {
        amount: parseFloat(amount),
        desc,
        splitMethod,
        participants,
        date: currDate,
        createdBy: uId,
        settled: false,
      };
      if (splitMethod === "unequal" || splitMethod === "percent") {
        billData.splitDetails = splitDetails;
      }

      await push(billRef, billData);
      console.log("Bill Inserted Successfully");

      // Calculate amount to be added to each participant
      let amountToAdd, userAmt, friendAmt;
      const participantRef = ref(
        db,
        `users/accounts/${participants[0]}/friendsList/${billData.createdBy}/totalAmount`
      );
      const snapShot = await get(participantRef);
      let currentTotalAmount = snapShot.val().totalAmount || 0;

      const creatorRef = ref(
        db,
        `users/accounts/${billData.createdBy}/friendsList/${participants[0]}/totalAmount`
      );
      const snap = await get(creatorRef);
      let currTotAmt = snap.val().totalAmount || 0;
      if (
        billData.splitMethod === "creatorEqual" ||
        billData.splitMethod === "friendEqual"
      ) {
        amountToAdd = billData.amount;
        console.log(participants[0]);
        if (billData.splitMethod === "creatorEqual") {
          userAmt = billData.amount / 2;
          friendAmt = (billData.amount / 2) * -1;
        } else if (billData.splitMethod === "friendEqual") {
          friendAmt = billData.amount / 2;
          userAmt = (billData.amount / 2) * -1; // Split the bill evenly
        }

        console.log("friend amt", currentTotalAmount, friendAmt);
        currentTotalAmount += friendAmt;
        console.log("Value: ", currentTotalAmount);

        update(participantRef, { totalAmount: parseFloat(currentTotalAmount) })
          .then(() => {
            console.log("Data saved successfully");
          })
          .catch((error) => {
            console.error("Data could not be saved.", error);
          });

        console.log(currTotAmt, userAmt);
        currTotAmt += userAmt;
        console.log("Value: ", currTotAmt);

        update(creatorRef, { totalAmount: parseFloat(currTotAmt) })
          .then(() => {
            console.log("Data saved successfully");
          })
          .catch((error) => {
            console.error("Data could not be saved.", error);
          });
      } else if (
        billData.splitMethod === "creatorWillPay" ||
        billData.splitMethod === "friendWillPay"
      ) {
        amountToAdd = billData.amount; // Creator will pay the whole bill, so add to participant's account
        if (billData.splitMethod === "creatorWillPay") {
          userAmt = billData.amount;
          friendAmt = billData.amount * -1;
        } else if (billData.splitMethod === "friendWillPay") {
          userAmt = billData.amount * -1;
          friendAmt = billData.amount;
        }

        currentTotalAmount += friendAmt;
        currTotAmt += userAmt;
        console.log("friend amt", friendAmt);
        console.log("user amt", userAmt);
        console.log("Value: ", currentTotalAmount);

        update(participantRef, { totalAmount: parseFloat(currentTotalAmount) })
          .then(() => {
            console.log("Data saved successfully");
          })
          .catch((error) => {
            console.error("Data could not be updated.", error);
          });

        update(creatorRef, { totalAmount: parseFloat(currTotAmt) })
          .then(() => {
            console.log("Data saved successfully");
          })
          .catch((error) => {
            console.error("Data could not be updated.", error);
          });
      } else if (
        billData.splitMethod === "unequal" ||
        billData.splitMethod === "percent"
      ) {
        amountToAdd = billData.amount; // Participant will pay the whole bill, so subtract from participant's account
        if (billData.splitMethod === "unequal") {
          userAmt = parseFloat(billData.splitDetails.secondPerson);
          friendAmt = parseFloat(billData.splitDetails.secondPerson * -1);
        } else if (billData.splitMethod === "percent") {
          userAmt = parseFloat(billData.splitDetails.secondPersonAmt);
          friendAmt = parseFloat(billData.splitDetails.secondPersonAmt * -1);
        }
        currentTotalAmount += friendAmt;
        currTotAmt += userAmt;
        console.log(
          "User and friend amount in unequal and percent mode: ",
          userAmt,
          friendAmt
        );
        console.log("Values: ", currentTotalAmount, currTotAmt);

        update(participantRef, { totalAmount: parseFloat(currentTotalAmount) })
          .then(() => {
            console.log("Data saved successfully");
          })
          .catch((error) => {
            console.error("Data could not be updated.", error);
          });

        update(creatorRef, { totalAmount: parseFloat(currTotAmt) })
          .then(() => {
            console.log("Data saved successfully");
          })
          .catch((error) => {
            console.error("Data could not be updated.", error);
          });
      }

      Alert.alert(
        "SplitEase",
        "Bill Splitted Successfully",
        [
          {
            text: "OK",
            onPress: async () => await navigation.navigate("Friends"),
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.log("Error inserting bill: ", error);
    }
  };

  const directToSplitoption = async () => {
    navigation.navigate("SplitOption", {
      onSelectOption: setSplitMethod,
      friend,
      splitMethod,
      amount,
      onSplitDetails: setSplitDetails,
      profilePicUrl,
      friendProfilePicUrl,
    });
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => setButtonTicked(true)}>
          <Ionicons
            name={"ios-checkmark-outline"}
            size={35}
            color={"green"}
            style={styles.tickMark}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);
  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-start",
          borderBottomWidth: 0.1,
          backgroundColor: "#FBFDFE",
        }}
      >
        <Text style={{ fontSize: 18, padding: 15, width: "79%" }}>
          Split between you and : {friend.username}
          {splitDetails && <Text>{splitDetails.secondPerson}</Text>}
        </Text>
      </View>

      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View style={{ position: "absolute", top: 60 }}>
          <View style={{ flexDirection: "row", margin: 20 }}>
            <View style={{ paddingRight: 20 }}>
              <Ionicons name="receipt-outline" size={30} />
            </View>
            <View
              style={{
                justifyContent: "center",
                borderBottomColor: "#1FB299",
                borderBottomWidth: 2,
                paddingBottom: 9,
              }}
            >
              <TextInput
                placeholder="Enter Description"
                placeholderTextColor={"gray"}
                value={desc}
                onChangeText={setDesc}
                style={{
                  fontSize: 20,
                  width: 250,
                }}
              />
            </View>
          </View>
          <View style={{ flexDirection: "row", margin: 20 }}>
            <View style={{ paddingRight: 20 }}>
              <Ionicons name="cash-outline" size={30} />
            </View>
            <View
              style={{
                justifyContent: "center",
                borderBottomColor: "#1FB299",
                borderBottomWidth: 2,
                paddingBottom: 9,
              }}
            >
              <TextInput
                placeholder="Enter Amount"
                placeholderTextColor={"gray"}
                value={amount.toString()}
                keyboardType="number-pad"
                onChangeText={setAmount}
                style={{
                  fontSize: 20,
                  width: 250,
                }}
              />
            </View>
          </View>

          <TouchableOpacity onPress={directToSplitoption} style={styles.button}>
            <Text style={styles.buttonText}>{splitOption}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default AddExpense;

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#2194BE",
    padding: 10,
    borderRadius: 5,
    width: 300,
    alignItems: "center",
    marginHorizontal: 20,
    marginVertical: 20,
    borderBottomColor: "#066C92",
    borderBottomWidth: 3,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10,
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
  tickMark: {
    right: 10,
  },
});
