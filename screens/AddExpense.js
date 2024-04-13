import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { TextInput } from "react-native-gesture-handler";
import Modal from "react-native-modal";
import { useFirebase } from "../context/AuthContext";
import { get, getDatabase, push, ref, update, once } from "@firebase/database";
import { Ionicons } from "@expo/vector-icons";

const AddExpense = ({ navigation, route }) => {
  const [amount, setAmount] = useState("");
  const [desc, setDesc] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [buttonTicked, setButtonTicked] = useState(false);
  const [splitOption, setSplitOption] = useState("Split evenly");
  const [splitMethod, setSplitMethod] = useState("even");
  const { friend } = route.params;
  const db = getDatabase();
  const firebase = useFirebase();

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
  const handleSelectOption = (option) => {
    console.log(option);
    if (option === "Split evenly") {
      setSplitOption("Split evenly");
      setSplitMethod("even");
    } else if (option === "I will pay the whole bill") {
      setSplitOption("I will pay the whole bill");
      setSplitMethod("creatorWillPay");
    } else if (option === "Friend will pay") {
      setSplitOption("Friend will pay");
      setSplitMethod("friendWillPay");
    } else {
      setSplitOption(null);
    }
    setIsModalVisible(false);
  };

  const handleSplitting = async () => {
    // console.log(typeof amount, typeof desc);
    if (desc.trim() === "" || amount === 0) {
      // console.log(amount);
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

      await push(billRef, billData);
      console.log("Bill Inserted Successfully");


      // Calculate amount to be added to each participant
      let amountToAdd;
      if (billData.splitMethod === "even") {
        amountToAdd = billData.amount / 2; // Split the bill evenly
      } else if (billData.splitMethod === "creatorWillPay") {
        amountToAdd = billData.amount; // Creator will pay the whole bill, so add to participant's account
      } else {
        amountToAdd = billData.amount * -1; // Participant will pay the whole bill, so subtract from participant's account
      }



      // Update totalAmount for each participant
      participants.forEach(async (participant) => {
        console.log(participant);
        const participantRef = ref(db, `users/accounts/${participant}/totalAmount`);

        

        // Get current totalAmount for the participant
        const snapShot = await get(participantRef);
        let currentTotalAmount = snapShot.val().totalAmount || 0;
        console.log(currentTotalAmount, amountToAdd);
        currentTotalAmount += amountToAdd;
        console.log('Value: ',currentTotalAmount);

          update(participantRef, { totalAmount: parseFloat(currentTotalAmount) })
          .then(()=>{
              console.log('Data saved successfully');
            })
          .catch((error)=>{
              console.error("Data could not be saved.", error);
          })
          
      });
      
      let amtToAdd;
      if (billData.splitMethod === "even") {
        amtToAdd = billData.amount / -2; // Split the bill evenly
      } else if (billData.splitMethod === "creatorWillPay") {
        amtToAdd = billData.amount * -1; // Creator will pay the whole bill, so add to participant's account
      } else {
        amtToAdd = billData.amount; // Participant will pay the whole bill, so subtract from participant's account
      }
      // Update totalAmount for the creator
      const creatorRef = ref(db, `users/accounts/${billData.createdBy}/totalAmount`);
      console.log(billData.createdBy);
      
      const snapShot = await get(creatorRef);
      let currentTotalAmount =  snapShot.val().totalAmount || 0;
      console.log('Curr amt', currentTotalAmount);
      currentTotalAmount += amtToAdd * 1;
      // const data = {
      //   totalAmount: currentTotalAmount
      // }
      update(creatorRef, { totalAmount: parseFloat(currentTotalAmount) })
      .then(()=> {
        console.log("Data saved successfully.");
      })
      .catch((error)=> {
        console.error("Data could not be saved.", error);
      })
      
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
          borderBottomWidth: 0.3,
          borderBottomColor: "grey",
        }}
      >
        <Text
          style={{ fontSize: 18, padding: 10, borderWidth: 1, width: "79%" }}
        >
          Between you and : {friend.username}
        </Text>
      </View>

      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TextInput
          placeholder="Enter Description"
          placeholderTextColor={"gray"}
          value={desc}
          onChangeText={setDesc}
        />
        <TextInput
          placeholder="Enter Amount"
          placeholderTextColor={"gray"}
          value={amount.toString()}
          keyboardType="number-pad"
          onChangeText={setAmount}
        />

        <TouchableOpacity onPress={toggleModal} style={styles.button}>
          <Text style={styles.buttonText}>{splitOption}</Text>
        </TouchableOpacity>
        <Modal isVisible={isModalVisible} onBackdropPress={toggleModal}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>
              How would you like to split the bill?
            </Text>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => handleSelectOption("Split evenly")}
            >
              <Text style={styles.optionButtonText}>Split evenly</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => handleSelectOption("I will pay the whole bill")}
            >
              <Text style={styles.optionButtonText}>
                I'll pay the whole bill
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => handleSelectOption("Friend will pay")}
            >
              <Text style={styles.optionButtonText}>
                {friend.username} will pay
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    </View>
  );
};

export default AddExpense;

const styles = StyleSheet.create({
  button: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
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
