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
import { get, getDatabase, ref, update } from "@firebase/database";
import { Ionicons } from "@expo/vector-icons";
import Emoji from "react-native-emoji";
import EmojiSelector, { Categories } from "react-native-emoji-selector";
import { Alert } from "react-native";
import { getDownloadURL, getStorage, ref as storRef } from "@firebase/storage";
const SingleSplitBillScreen = ({ navigation, route }) => {
  const [profilePic, setProfilePic] = useState(null);
  const [hadBill, setHadBill] = useState(false);
  const [billData, setBillData] = useState([]);
  const [totalAmount, setTotalAmount] = useState(null);
  const [friendName, setFriendName] = useState('');
  const { value } = route.params.friend;
  console.log("Friends prop: ", value);
  const firebase = useFirebase();
  const db = getDatabase();
  const storage = getStorage();

useEffect(() => {
  setFriendName(value.username);
}, []);
  useEffect(() => {
    const fetchFriendsProfilePic = async () => {
      try {
        const storageRef = storRef(storage, `profilePic/${value.uid}`)
        const url = await getDownloadURL(storageRef);
        setProfilePic(url)
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

      try {
        const snapShot = await get(billRef);
        console.log('Snapshot value: ', snapShot.val())
        const participantsBills = [];
        snapShot.forEach( (snap) => {
          const billData1 =  snap.val();
          console.log("Bill data: ", billData1);
          
          if (
            (billData1.createdBy === userId &&
              billData1.participants[0] === value.uid && !billData1.settled ) ||
              (billData1.createdBy === value.uid &&
                billData1.participants[0] === userId && !billData1.settled) 
              ) {
                participantsBills.push({
                  billData1,
                });
              }
            });
            console.log('Participants: ',participantsBills)

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
      const totalAmtRef = ref(db, `users/accounts/${userId}/friendsList/${value.uid}/totalAmount`);
      const snapshot = await get(totalAmtRef);
      setTotalAmount(snapshot.val().totalAmount);
      console.log("Total Amount value: ", snapshot.val().totalAmount);
    };
    fetchTotalAmount();
  }, []);

  const handleSettleUp = async () => {
    const userId = await firebase.user.uid;
    try {
      // Updating total amount
      const settleFriendRef = ref(
        db,
        `users/accounts/${value.uid}/friendsList/${userId}/totalAmount`
      );
      await update(settleFriendRef, { totalAmount: 0 });
      const settleRef = ref(db, `users/accounts/${userId}/friendsList/${value.uid}/totalAmount`);
      await update(settleRef, { totalAmount: 0 });

      // Removing the bills after settled up
      const billRef = ref(db, "bills");

      const snapShot = await get(billRef);

      snapShot.forEach((billSnap) => {
        const billData1 = billSnap.val();
        if (
          (billData1.createdBy === value.uid && billData1.participants[0] === userId) ||
          (billData1.createdBy === userId && billData1.participants[0] === value.uid)
        ) {
          console.log("billSnap key: ", billSnap.key);
          const billNodeRef = ref(db, `bills/${billSnap.key}`);

          update(billNodeRef, { settled: true })
            .then(() => {
              console.log("Bill settled successfully");
            })
            .catch((err) => {
              console.log("Error in deleting bill: ", err.message);
            });
        }
      });
      Alert.alert(
        "SplitEase",
        `You are all settled up with ${friendName}`,
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("Friends"),
          },
        ],
        { cancelable: false }
      );
      setTotalAmount(null);
    } catch (error) {
      console.log("Error settling amount in the account", error.message);
    }
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
              marginLeft: 10
            }}
          />
        ) : (
          <View>

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
            </View>
        )}
      </View>
      <View style={styles.container}>
        <TouchableOpacity
          className="w-1/2 sticky bg-green-400 p-3 rounded-2xl m-3 absolute bottom-3 right-0 m-4 z-10"
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

        <Text style={{ fontSize: 25, margin: 15 }}>{friendName}</Text>

        <View>
          {totalAmount < 0 ? (
            <View>
              <Text style={{ fontSize: 15, marginLeft: 80 }}>
                You owe Rs.{(totalAmount * -1).toFixed(2)} from {friendName}
              </Text>
              <TouchableOpacity
                onPress={handleSettleUp}
                className="w-1/2 bg-red-400 p-3 rounded-2xl m-3 relative left-20"
              >
                <Text className="pl-8 text-base">Settle Up</Text>
              </TouchableOpacity>
            </View>
          ) : totalAmount > 0 ? (
            <View>
              <Text style={{ fontSize: 15, marginLeft: 80 }}>
                {friendName} owes you Rs.{(totalAmount).toFixed(2)}
              </Text>
              <TouchableOpacity
                onPress={handleSettleUp}
                className="w-1/2 bg-red-400 p-3 rounded-2xl m-3 relative left-20"
              >
                <Text className="pl-8 text-base">Settle Up</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              <View className="p-3 rounded-2xl m-3 relative left-5">
                <Text style={{ fontSize: 16 }}>
                  You are Settled Up from your side
                </Text>
              </View>
                <Text style={{ fontSize: 16, paddingVertical: 10, left: 50, top: 80 }}>
                Add Expenses to get started.....
              </Text>
            </View>
          )}
        </View>
        <ScrollView style={{ height: "68%" }}>
          <View>
            
            {(billData && totalAmount != 0) && (
              billData.map((billItem, index) => (
                <View style={{ borderTopWidth: 1, borderBottomWidth: 1, padding: 10 }} key={index}>
                  <Text style={{ fontWeight: "500" }}>
                    {" "}
                    {billItem.billData1.date.split("-")[1] === "01"
                      ? "January"
                      : billItem.billData1.date.split("-")[1] === "02"
                      ? "February"
                      : billItem.billData1.date.split("-")[1] === "03"
                      ? "March"
                      : billItem.billData1.date.split("-")[1] === "04"
                      ? "April"
                      : billItem.billData1.date.split("-")[1] === "05"
                      ? "May"
                      : billItem.billData1.date.split("-")[1] === "06"
                      ? "June"
                      : billItem.billData1.date.split("-")[1] === "07"
                      ? "July"
                      : billItem.billData1.date.split("-")[1] === "08"
                      ? "August"
                      : billItem.billData1.date.split("-")[1] === "09"
                      ? "September"
                      : billItem.billData1.date.split("-")[1] === "10"
                      ? "October"
                      : billItem.billData1.date.split("-")[1] === "11"
                      ? "November"
                      : billItem.billData1.date.split("-")[1] === "12"
                      ? "December"
                      : "Invalid Month"}{" "}
                    {billItem.billData1.date.split("-")[0]}
                  </Text>
                  <TouchableOpacity
                    style={{ flexDirection: "row", paddingTop: 3 }}
                    onPress={() =>
                      navigation.navigate("BillDetails", {
                        billItem: billItem,
                        friend: value,
                      })
                    }
                  >
                    <View style={{ flexDirection: "column", padding: 3 }}>
                      <Ionicons
                        name={"apps-outline"}
                        size={30}
                        color={"grey"}
                        style={{ paddingTop: 2 }}
                      />
                      {billItem.splitMethod === "even" ? (
                        // <Emoji size={20} name="😐" style={{ padding: 5 }} />
                        <EmojiSelector
                          category={Categories.symbols}
                          onEmojiSelected={(emoji) => console.log(emoji)}
                        />
                      ) : billData.createdBy === firebase.user.uid &&
                        billItem.splitMethod === "creatorWillPay" ? (
                        <Emoji size={20} name="😞" style={{ padding: 5 }} />
                      ) : billData.createdBy === firebase.user.uid &&
                        billItem.splitMethod === "friendWillPay" ? (
                        <Emoji size={20} name="😊" style={{ padding: 5 }} />
                      ) : billData.createdBy === value.uid &&
                        billItem.splitMethod === "creatorWillPay" ? (
                        <Emoji size={20} name="😊" style={{ padding: 5 }} />
                      ) : billData.createdBy === value.uid &&
                        billItem.splitMethod === "friendWillPay" ? (
                        <Emoji size={20} name="😞" style={{ padding: 5 }} />
                      ) : (
                        <Emoji size={20} name="smile" style={{ padding: 5 }} />
                      )}
                    </View>
                    <View style={{ flexDirection: "column", paddingLeft: 20 }}>
                      <Text style={{ fontSize: 17 }}>
                        {billItem.billData1.desc}
                      </Text>
                      <Text style={{ color: "grey" }}>
                        {billItem.billData1.createdBy === firebase.user.uid &&
                        billItem.billData1.splitMethod === "creatorEqual"
                          ? `You paid Rs.${billItem.billData1.amount} \n ${
                              friendName
                            } needs to pay ${
                              billItem.billData1.amount / 2
                            } to you`
                          : billItem.billData1.createdBy === firebase.user.uid &&
                            billItem.billData1.splitMethod === "creatorWillPay"
                          ? `${friendName} paid Rs.${billItem.billData1.amount} \nYou need to pay Rs.${billItem.billData1.amount}`
                          : billItem.billData1.createdBy === firebase.user.uid &&
                            billItem.billData1.splitMethod === "friendWillPay"
                          ? `You paid ${billItem.billData1.amount} \n ${friendName} needs to pay ${billItem.billData1.amount}`
                          : billItem.billData1.createdBy === value.uid &&
                            billItem.billData1.splitMethod === "friendEqual"
                          ? `You paid Rs.${
                              billItem.billData1.amount
                            } \n${friendName} need to pay ${
                              billItem.billData1.amount / 2
                            } to ${friendName}`
                          : billItem.billData1.createdBy === firebase.user.uid &&
                          billItem.billData1.splitMethod === "friendEqual"
                        ? `${friendName} paid Rs.${
                            billItem.billData1.amount
                          } \nYou need to pay ${
                            billItem.billData1.amount / 2
                          } to ${friendName}`
                        :
                        billItem.billData1.createdBy === value.uid &&
                            billItem.billData1.splitMethod === "creatorWillPay"
                          ? `You paid ${billItem.billData1.amount} \nYou need to pay ${billItem.billData1.amount} to ${friendName}`
                          : billItem.billData1.createdBy === value.uid &&
                            billItem.billData1.splitMethod === "friendWillPay"
                          ? `${friendName} paid ${billItem.billData1.amount} \nYou need to pay ${billItem.billData1.amount}`
                          : billItem.billData1.createdBy === firebase.user.uid &&
                          billItem.billData1.splitMethod === "unequal" ? `You paid ${billItem.billData1.amount} \n${friendName} need to pay ${billItem.billData1.splitDetails['secondPerson']}`
                          : billItem.billData1.createdBy === value.uid &&
                          billItem.billData1.splitMethod === "unequal" ? `${friendName} paid ${billItem.billData1.amount} \nYou need to pay ${billItem.billData1.splitDetails['firstPerson']}` 
                          : billItem.billData1.createdBy === firebase.user.uid &&
                          billItem.billData1.splitMethod === "percent" ? `You paid ${billItem.billData1.amount} \n${friendName} need to pay ${billItem.billData1.splitDetails['secondPersonAmt']}` 
                          : billItem.billData1.createdBy === value.uid &&
                          billItem.billData1.splitMethod === "percent" ? `${friendName} paid ${billItem.billData1.amount} \nYou need to pay ${billItem.billData1.splitDetails['firstPersonAmt']}` : "Error!!!"}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              ))
            ) 
            // : (
            //   <Text>You are all Settled Up</Text>
            // )
            }
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
    paddingHorizontal: 20,
    // paddingRight: 20,
    backgroundColor: "#fff"
    // backgroundColor: "#90CDF4",
  },
});
