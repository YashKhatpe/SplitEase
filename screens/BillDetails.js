import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
// import { BarChart } from "react-native-gifted-charts";
import { get, getDatabase, ref } from "@firebase/database";
import { useFirebase } from "../context/AuthContext";


const BillDetails = ({ navigation, route }) => {
  const [billGraphData, setBillGraphData] = useState([]);
  const [barData, setBarData] = useState([]);
  const { billData1 } = route.params.billItem;
  const { friend } = route.params;
  const firebase = useFirebase();
  // console.log(billData1);
  console.log(friend);
  const db = getDatabase();
  const billArr = [];
  

  useEffect(() => {
    const fetchBills = async() => {
      const billRef = ref(db, 'bills');
      const snapShot = await get(billRef);
      const userId = await firebase.user.uid;
      if (snapShot.exists()) {
        snapShot.forEach(async (snap) => {

          const result = snap.val();
          console.log(result)
          if (result.createdBy === friend.uid || result.createdBy === userId) {
            billArr.push(result)
          }

        });
        console.log('Billarr ', billArr)
      }
    }
    const updatedBarData = [ // Initialize updated barData array
    { value: 0, label: 'Feb' }, // Initialize with 0 values for each month
    { value: 0, label: 'Mar' },
    { value: 0, label: 'Apr', frontColor: '#177AD5' }
  ];
  
  billArr.forEach((bill) => {
    // Add the amount to the corresponding month in updatedBarData
    const monthName = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    const month = new Date(bill.date).getMonth(); // Get the month from the bill's date
    updatedBarData[month].value += bill.amount; // Accumulate the amount for the month
  });
  
  console.log('Updated Bar Data:', updatedBarData);
        setBarData(updatedBarData);
    fetchBills();
    
  }, []);

  


  return (
    <View style={{ flex: 1 }}>
      <Text style={{ color: "grey", fontSize: 30, left: 80, top: 40 }}>
        {billData1.desc}
      </Text>
      <Text style={{ fontSize: 25, fontWeight: "400", left: 80, top: 40 }}>
        &#8377; {billData1.amount}
      </Text>
      <Text
        style={{
          left: 80,
          top: 50,
        }}
      >
        Added by {billData1.createdBy === friend.uid ? friend.username : "you"}{" "}
        on {billData1.date}

      </Text>
      <View
      style={{
        top: 70,
        flex: 1
      }}>
      <TouchableOpacity
        style={{width: "40%", padding: 13, left: 100}}
        className=" bg-red-400  rounded-2xl m-3 relative left-20"
        >
        <Text className="pl-7 text-base">Settle Up</Text>
      </TouchableOpacity>
      <View>
      
       
       { barData.map((elem) => {
          <Text>{elem.amount}</Text>
        })
      }
        {/* {barData && (

          <BarChart
          horizontal
          barWidth={22}
          noOfSections={3}
          barBorderRadius={4}
          frontColor="lightgray"
          data={barData}
          yAxisThickness={0}
          xAxisThickness={0}
          />
        )} */}
        </View>
        </View>
    </View>
  );
};

export default BillDetails;

const styles = StyleSheet.create({});
