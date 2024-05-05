import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from "react-native";
import { get, getDatabase, ref } from "@firebase/database";
import { useFirebase } from "../context/AuthContext";
import { Ionicons } from "@expo/vector-icons";

const ActivityScreen = ({ route, navigation }) => {
  const [billData, setBillData] = useState([]);
  const firebase = useFirebase();
  const db = getDatabase();
  
  const fetchBillData = async () => {
    try {
      const userId = firebase.user.uid;
      const billRef = ref(db, "bills");
      const snapshot = await get(billRef);
      if (snapshot.exists()) {
        const data = [];
        snapshot.forEach((snap) => {
          const bill = snap.val();
          if (
            bill.createdBy === userId ||
            bill.participants.hasOwnProperty(userId)
          ) {
            data.push(bill);
          }
        });
        setBillData(data);
      }
    } catch (error) {
      console.log("Error fetching bills for activity:", error.message);
    }
  };

  useEffect(() => {
    fetchBillData();
  }, []);

  return (
    <ScrollView>

    
    <View style={{ flex: 1 }}>
      {billData.length > 0 ? (
        billData.map((item, index) => (

          <TouchableOpacity key={index} style={styles.contactItem}>
            <Ionicons
              name={"apps-outline"}
              size={35}
              color={"grey"}
              style={{ padding: 10 }}
            />
           <View style={{flexDirection: "column"}}>

            <Text
              style={{
                height: 35,
                marginLeft: 2,
                marginTop: 5,
                paddingLeft: 20,
                paddingHorizontal: 8,
                fontSize: 18,
                fontWeight: "bold",
              }}
              >
            {item.desc}
            </Text>
            <Text style={{paddingLeft: 15, bottom: 5}}>Transaction between you and King</Text>
            <Text style={{paddingLeft: 15}} >{item.date}</Text>
                </View>
          </TouchableOpacity>
        ))
      ) : (
        <Text>No data available</Text>
      )}
    </View>
    </ScrollView>
  );
};

export default ActivityScreen;

const styles = StyleSheet.create({
  contactItem: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    pointerEvents: "box-none",
  },
  contactName: {
    height: 35,
    marginLeft: 2,
    marginTop: 5,
    paddingLeft: 20,
    paddingHorizontal: 8,
    fontSize: 18,
    fontWeight: "bold",
  },
});
