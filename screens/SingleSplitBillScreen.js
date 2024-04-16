import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useFirebase } from "../context/AuthContext";
import { get, getDatabase, ref, remove, update } from "@firebase/database";
import { Ionicons } from "@expo/vector-icons";
import Emoji from "react-native-emoji";
import { Alert } from "react-native";
const SingleSplitBillScreen = ({ navigation, route }) => {
  const [profilePic, setProfilePic] = useState(null);
  const [hadBill, setHadBill] = useState(false);
  const [billData, setBillData] = useState([]);
  const [totalAmount, setTotalAmount] = useState(null);
  const { value } = route.params.friend;
  console.log("Friends prop: ", value);
  const firebase = useFirebase();
  const db = getDatabase();
  useEffect(() => {
    const fetchFriendsProfilePic = async () => {
      try {
        const friendRef = ref(db, `users/accounts/${value.uid}`);
        const snapshot = await get(friendRef);
        if (snapshot.exists()) {
          const userData = snapshot.val();
          if (userData.profPicUrl) {
            setProfilePic(userData.profPicUrl);
          } else {
            setProfilePic(null);
          }
        }
      } catch (error) {
        console.log("Error retrieving friends profile pic url: ", error);
      }
    };
    fetchFriendsProfilePic();
  }, []);


  useEffect(() => {
    const retrieveBillDetails = async () => {
      const billRef = ref(db, "bills");
      const userId = await firebase.user.uid;
      const uName = await firebase.userName;

      try {
        const snapShot = await get(billRef);
        const participantsBills = [];
        snapShot.forEach((snap) => {
          const billData = snap.val();
          console.log('Bill data: ', billData);
          console.log(billData.participants[0] == value.uid);

          if (
            billData.participants.hasOwnProperty(userId) ||
            billData.createdBy === userId ||
            billData.createdBy === value.uid ||
            billData.participants[0] === value.uid
          ) {
            participantsBills.push({
              billData,
            });
          }
        });

        setBillData(participantsBills);
        console.log("Participants array1: ", participantsBills);
      } catch (error) {
        console.error("Error retrieving bill details:", error);
      }
    };


    // Set loading state
    retrieveBillDetails();
    
    // Clear loading state
  }, []);

  useEffect(() => {
    const fetchTotalAmount = async () => {
      const userId = await firebase.user.uid;
      const totalAmtRef = ref(db, `users/accounts/${userId}/totalAmount`);
      const snapshot = await get(totalAmtRef);
      setTotalAmount(snapshot.val().totalAmount);
      console.log("Total Amount value: ", snapshot.val().totalAmount);
    };
    fetchTotalAmount();
  }, []);
  
  
  const handleSettleUp = async () => {
    const userId = await firebase.user.uid;
    try{
      // I am here total Amount in friends acc is not updatoing
      const settleFriendRef = ref(db, `users/accounts/${value.uid}/totalAmount`);
      await update(settleFriendRef, {totalAmount: 0})
      const settleRef = ref(db, `users/accounts/${userId}/totalAmount`);
      await update(settleRef, {totalAmount: 0});

      const billRef = ref(db, 'bills')
      const snapShot = await get(billRef);
      snapShot.forEach((billSnap) => {
        const billData = billSnap.val();
        if (billData.createdBy === value.uid || billData.createdBy === firebase.user.uid) {
          console.log('billSnap key: ', billSnap.key);
          const billNodeRef = ref(db, `bills/${billSnap.key}`);

          remove(billNodeRef)
          .then(()=> {
            console.log('Bill deleted successfully')
          })
          .catch((err) => {
            console.log('Error in deleting bill: ', err.message)
          })
        }
      })
      Alert.alert(
        "SplitEase",
        `You are all settled up with ${value.username}`,
        [
          {
            text: "OK",
            onPress: async () => await navigation.navigate("Friends"),
          },
        ],
        { cancelable: false }
      );
      setTotalAmount(null);
    }
    catch (error) {
      console.log('Error settling amount in the account',error.message );
      
    }
}

  const monthNames = {
    "01": "January",
    "02": "February",
    "03": "March",
    "04": "April",
    "05": "May",
    "06": "June",
    "07": "July",
    "08": "August",
    "09": "September",
    "10": "October",
    "11": "November",
    "12": "December",
  };

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          width: "100%",
          height: 85,
        }}
      >
        <Image
          source={require("../images/poster_img.webp")}
          style={{
            flex: 1,
            width: "100%",
            resizeMode: "cover",
          }}
        />
      </View>
      <View style={{ backgroundColor: "white" }}>
        {profilePic ? (
          <Image
            source={{ uri: profilePic }}
            style={{
              width: 70,
              height: 70,
              position: "relative",
              top: -30,
              left: 30,
              borderRadius: 25,
              marginLeft: 10,
            }}
          />
        ) : (
          <Image
            source={require("../images/poster_img.webp")}
            style={{
              width: 70,
              height: 70,
              position: "relative",
              top: -30,
              left: 30,
              borderRadius: 25,
              marginLeft: 10,
            }}
          />
        )}
      </View>
      <View style={styles.container}>
        <TouchableOpacity
          className="w-1/2 bg-green-400 p-3 rounded-2xl m-3 absolute bottom-5 right-0 z-10"
          style={{ flex: 1, flexDirection: "row" }}
          onPress={() => navigation.navigate("Add Expense", { friend: value })}
        >
          <Ionicons
            name={"ios-file-tray-full-outline"}
            size={22}
            color={"green"}
            // style={{ paddingRight: -10}}
          />
          <Text className="pl-3 text-base">Add Expense</Text>
        </TouchableOpacity>

        <Text style={{ fontSize: 25, margin: 15 }}>{value.username}</Text>

        <View>
          {totalAmount < 0 ? (
            <View>
              <Text style={{ fontSize: 15, marginLeft: 15 }}>
                You owe Rs.{totalAmount  * -1} from {value.username}
              </Text>
              <TouchableOpacity onPress={handleSettleUp} className="w-1/2 bg-red-400 p-3 rounded-2xl m-3 relative left-20">
                <Text className="pl-8 text-base">Settle Up</Text>
              </TouchableOpacity>
            </View>
          ) : totalAmount > 0 ? (
            <View>
              <Text style={{ fontSize: 15, marginLeft: 15 }}>
                You lent Rs.{totalAmount} from {value.username}
              </Text>
              <TouchableOpacity onPress={handleSettleUp} className="w-1/2 bg-red-400 p-3 rounded-2xl m-3 relative left-20">
                <Text className="pl-8 text-base">Settle Up</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              <View className=" p-3  rounded-2xl m-3 relative left-5">
                <Text style={{fontSize: 16}}>You are Settled Up from your side</Text>
              </View>
                <Text style={{fontSize: 16, paddingVertical: 10}}>Add Expenses to get started...</Text>
            </View>
          )}
        </View>
        <ScrollView style={{ height: "68%" }}>
          <View style={{ borderTopWidth: 1 }}>
            {billData ? (
              billData.map((billItem, index) => (
                <View style={{ borderBottomWidth: 1, padding: 10 }} key={index}>
                  <Text style={{ fontWeight: "500" }}>
                    {" "}
                    {billItem.billData.date.split("-")[1] === "01"
                      ? "January"
                      : billItem.billData.date.split("-")[1] === "02"
                      ? "February"
                      : billItem.billData.date.split("-")[1] === "03"
                      ? "March"
                      : billItem.billData.date.split("-")[1] === "04"
                      ? "April"
                      : billItem.billData.date.split("-")[1] === "05"
                      ? "May"
                      : billItem.billData.date.split("-")[1] === "06"
                      ? "June"
                      : billItem.billData.date.split("-")[1] === "07"
                      ? "July"
                      : billItem.billData.date.split("-")[1] === "08"
                      ? "August"
                      : billItem.billData.date.split("-")[1] === "09"
                      ? "September"
                      : billItem.billData.date.split("-")[1] === "10"
                      ? "October"
                      : billItem.billData.date.split("-")[1] === "11"
                      ? "November"
                      : billItem.billData.date.split("-")[1] === "12"
                      ? "December"
                      : "Invalid Month"}{" "}
                    {billItem.billData.date.split("-")[0]}
                  </Text>
                  <View style={{ flexDirection: "row", paddingTop: 3 }}>
                    <View style={{ flexDirection: "column", padding: 3 }}>
                      <Ionicons
                        name={"apps-outline"}
                        size={30}
                        color={"grey"}
                        style={{ paddingTop: 2 }}
                      />
                      <Emoji size={20} name="smile" style={{ padding: 5 }} />
                    </View>
                    <View style={{ flexDirection: "column", paddingLeft: 20 }}>
                      <Text style={{ fontSize: 17 }}>
                        {billItem.billData.desc}
                      </Text>
                      <Text style={{ color: "grey" }}>
                        {billItem.billData.createdBy === firebase.user.uid &&
                        billItem.billData.splitMethod === "even"
                          ? `You paid Rs.${
                              billItem.billData.amount
                            } \n ${value.username} needs to pay ${billItem.billData.amount / 2} to you`
                          : billItem.billData.createdBy === firebase.user.uid &&
                            billItem.billData.splitMethod === "creatorWillPay"
                          ? `${value.username} paid Rs.${billItem.billData.amount} \nYou need to pay Rs.${billItem.billData.amount}`
                          : billItem.billData.createdBy === firebase.user.uid &&
                          billItem.billData.splitMethod === "friendWillPay" ? `You paid ${billItem.billData.amount} \n ${value.username} needs to pay ${billItem.billData.amount}`
                          : billItem.billData.createdBy === value.uid &&
                          billItem.billData.splitMethod === "even" 
                          ? `${value.username} paid Rs.${billItem.billData.amount} \nYou need to pay ${billItem.billData.amount / 2} to ${value.username}`
                          : billItem.billData.createdBy === value.uid &&
                          billItem.billData.splitMethod === "creatorWillPay" 
                          ? `You paid ${billItem.billData.amount} \nYou need to pay ${billItem.billData.amount} to ${value.username}` :
                          billItem.billData.createdBy === value.uid &&
                          billItem.billData.splitMethod === "friendWillPay" 
                          ? `${value.username} paid ${billItem.billData.amount} \nYou need to pay ${billItem.billData.amount}`: 'Error!!!'}
                      </Text>
                    </View>
                  </View>
                </View>
              ))
            ) : (
              <Text>You are all Settled Up</Text>
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default SingleSplitBillScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    borderWidth: 2,
    // backgroundColor: "#90CDF4",
  },
});
