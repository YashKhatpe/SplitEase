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
import { get, getDatabase, ref } from "@firebase/database";
import { Ionicons } from "@expo/vector-icons";
const SingleSplitBillScreen = ({ navigation, route }) => {
  const [profilePic, setProfilePic] = useState(null);
  const [hadBill, setHadBill] = useState(false);
  const [billData, setBillData] = useState([]);
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

  // useEffect(() => {
  //   const retrieveBillDetails = async ()=> {
  //     const billRef = ref(db, 'bills');
  //     const userId = await firebase.user.uid;
  //     const uName = await firebase.userName;
  //     const snapShot = await get(billRef);
  //     const participantsBills = [];
  //     if (snapShot.val()) {
  //       snapShot.forEach((snap) => {
  //         const billData = snap.val();
  //         if ((billData.participants.hasOwnProperty(userId) || billData.createdBy === uName) && billData.participants.hasOwnProperty(value.uid) ) {
  //           participantsBills.push({
  //             billData
  //           })
  //           console.log('Participants data: ',billData);

  //         }
  //       });
  //     }
  //     setBillData(participantsBills)
  //     console.log('Participants array: ', participantsBills);

  //   }
  //   // Spinner component required
  //   retrieveBillDetails();
  //   // Spinner component required
  // }, []);

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

          if (
            billData.participants.hasOwnProperty(userId) ||
            billData.createdBy === uName ||
            billData.participants.hasOwnProperty(value.uid)
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
    10: "October",
    11: "November",
    12: "December",
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
          className="w-1/2 bg-green-400 p-3 rounded-2xl m-3 absolute bottom-5 right-0 m-4 z-10"
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
        <Text style={{ fontSize: 15, marginLeft: 15 }}>You are settled up</Text>

        <View>
          <TouchableOpacity className="w-1/2 bg-red-400 p-3 rounded-2xl m-3 relative left-20">
            <Text className="pl-8 text-base">Settle Up</Text>
          </TouchableOpacity>
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
                  {/* <Text>{billItem.billData.date.split("-")[2]}</Text> */}
                  <View style={{ flexDirection: "row", paddingTop: 3 }}>
                    <Ionicons
                      name={"apps-outline"}
                      size={30}
                      color={"grey"}
                      style={{ paddingTop: 2 }}
                    />
                    <View style={{ flexDirection: "column", paddingLeft: 20 }}>
                      <Text style={{ fontSize: 17 }}>
                        {billItem.billData.desc}
                      </Text>
                      <Text style={{ color: "grey" }}>
                        {billItem.billData.billPaidBy === "even"
                          ? `You paid ${billItem.billData.amount}`
                          : "Not even"}{" "}
                        {Number(billItem.billData.amount) / 2}
                      </Text>
                    </View>
                  </View>
                </View>
              ))
            ) : (
              <Text>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim
                delectus ipsum beatae accusamus, rerum magni repudiandae quasi?
                Iste officia ipsam quidem? Id quaerat eius at cupiditate
                possimus soluta ea distinctio? Lorem ipsum dolor sit amet
                consectetur adipisicing elit. Enim delectus ipsum beatae
                accusamus, rerum magni repudiandae quasi? Iste officia ipsam
                quidem? Id quaerat eius at cupiditate possimus soluta ea
                distinctio? Lorem ipsum dolor sit amet consectetur adipisicing
                elit. Enim delectus ipsum beatae accusamus, rerum magni
                repudiandae quasi? Iste officia ipsam quidem? Id quaerat eius at
                cupiditate possimus soluta ea distinctio? Lorem ipsum dolor sit
                amet consectetur adipisicing elit. Enim delectus ipsum beatae
                accusamus, rerum magni repudiandae quasi? Iste officia ipsam
                quidem? Id quaerat eius at cupiditate possimus soluta ea
                distinctio? Lorem ipsum dolor sit amet consectetur adipisicing
                elit. Enim delectus ipsum beatae accusamus, rerum magni
                repudiandae quasi? Iste officia ipsam quidem? Id quaerat eius at
                cupiditate possimus soluta ea distinctio?
              </Text>
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
