import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image
} from "react-native";
import React from 'react'
// import { Ionicons } from "@expo/vector-icons";

const InviteScreen = ({ route, navigation }) => {
    const { groupData } = route.params;
    const handleGroupPic = () => {

    }
  return (
      <View style={{flex: 1}}>
    { groupData && 
        (
          <View style={{flex: 1, borderColor: "#1cc19f", borderWidth: 2 }}> 
          {/* Main View */}
            <View style={{ flexDirection: "column", borderColor: "#1cc19f", borderWidth: 2 }}>  
            {/* // Top Background View */}
              <View style={{backgroundColor: "#ffbebd" ,borderColor: "black", borderWidth: 2, flexDirection: "column", height: 100}}>
                <Text>Hii</Text>
              </View> 
              <View style={{ flexDirection: "column"}}>

              
            <TouchableOpacity
            style={{
              width: 70,
              height: 70,
              justifyContent: "center",
              alignItems: "center",
              margin: 40
            }}
          >
            {groupData.groupProfPic ? (
              <Image
              source={{ uri: groupData.groupProfPic}}
              style={styles.profPic}
              />
              ): (
                <Image
                source={require("../images/groupProfilePic.png")}
                style={styles.profPic}
                />
                )}
          </TouchableOpacity>
                <View style={{ paddingLeft: 55, marginTop: -90}}>
                  <Text style={{fontWeight: 500, fontSize: 30, marginVertical: 10}}>{groupData.groupName}</Text>
                  <Text style={{}}>Type: {groupData.type}</Text>
                  <Text>No members in this group. Add your friends.. </Text>

                  <View
                  style={{
                    height: 200,
                    justifyContent: "center",
                    alignItems: "center"
                  }}>

                    <Image
                    source={require("../images/inviteFriends.png")}
                    style={{
                      position: "absolute",
                      width: 50,
                      height: 50,
                      top: 75,
                      left: 20
                    }}
                    />
                    <TouchableOpacity>
                    <Text style={{marginLeft: 50, fontSize: 20, color:'#236318'}}>Add your friends!!!</Text>
                    </TouchableOpacity>
                  </View>
                </View>
          </View>

            </View>
        </View>
        )
    }
    </View>
  )
}

export default InviteScreen;

const styles = StyleSheet.create({
  profPic: {
    position: "relative",
    top: -80,
    width: 80, 
    height: 80, 
    borderRadius: 30,
    padding: 19
  }
})