import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image
} from "react-native";
import { getDatabase, ref, onValue, get, set, push } from "@firebase/database";
import * as Contacts from "expo-contacts";
import { Ionicons } from "@expo/vector-icons";
import { useFirebase } from "../context/AuthContext";

const FriendsScreen = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [showSelectedFriends, setShowSelectedFriends] = useState(true);
  const [usersFriends, setUsersFriends] = useState(null);
  const firebase = useFirebase();
  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  useEffect(() => {
    console.log('User Login Status: ',firebase.isLoggedIn);
    console.log('User Name: ',firebase.userName);
    const fetchData = async () => {
      const db = getDatabase(); 
      if (firebase.user) {
        const userId = await firebase.user.uid;
        const path = `users/accounts/pendingFriends/${userId}`;
        const friendsRef = ref(db, path);
  
        const unsubscribe = onValue(friendsRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const friendsArray = Object.entries(data).map(([key, value]) => ({
              key: key,
              value: value
            }));
            setUsersFriends(friendsArray);
          } else {
            setUsersFriends([]);
          }
        });
  
        return () => unsubscribe();
      }
    };
    fetchData();
  }, [firebase.user]);
  
  


  const handleLoadContacts = async () => {
    if (hasPermission) {
      const { data } = await Contacts.getContactsAsync();
      // console.log("Data: ", data);
      if (data.length > 0) {
        setContacts(data);
        setShowSelectedFriends(false);
      }
    }
    console.log("In load contacts function");
    console.log("In load contacts function: ", contacts);
  };


  
  const handleFriendSelection1 = (contact) => {
    const uid = firebase.user.uid;
    const isSelected = selectedFriends.some(
      (friend) => friend.contactInfo.id === contact.id
    );
    console.log("isSelected: ", isSelected);
    const updatedSelectedFriends = isSelected
      ? selectedFriends.filter((friend) => friend.contactInfo.id !== contact.id)
      : [...selectedFriends, { contactInfo: contact, phoneNo: contact.phoneNumbers[1].number, senderFriend: uid }];
    setSelectedFriends(updatedSelectedFriends);
  };

  const checkAndAddUserToFriends = async (puid, phoneNo)=> {
    try {
      const result = await firebase.getData('users/accounts')
      if (result) {
        // Iterate over each child node (uid) in the snapshot
        for (const uid in result) {
          const uidSnapshot = result[uid];
          // Check if the current uid has a phoneNumber property
          if (uidSnapshot.phoneNumber && uidSnapshot.phoneNumber === phoneNo) {
            // If the phone number matches, return the uid
            await firebase.putData(`users/accounts/${puid}/friendsList/${uidSnapshot.uid}`, uidSnapshot);
            return true;
          }
        }
      } else {
        
      }
    } catch (error) {
      console.error('Error finding uid by phone number:', error);
      return null;
    }
  }

  const handleAddFriends = async () => {
    // Add selected friends to Firebase
    const userId = await firebase.user.uid;

    
    // Filter out added friends from the contacts state
    const remainingContacts = contacts.filter((contact) => {
      // Check if the contact is not in the selectedFriends array
      return !selectedFriends.some(
        (selectedFriend) => selectedFriend.contactInfo.id === contact.id
        );
      });
      
      // Store remaining contacts in the state
      setContacts(remainingContacts); // No same contacts will be displayed to user which is akready being added as a friends
      
      // Store selected friends in the database
      try {
        const db = getDatabase();
        const path = `users/pendingFriends`;
      const friendsRef = ref(db, path)
      // const snapshot = await get(friendsRef);
      // const existingFriends = snapshot.val() || {};
      // const updatedFriends = { ...existingFriends, selectedFriends}
      console.log('Shown Selected friends: ',selectedFriends.contactInfo);
      selectedFriends.forEach(async (friend) => {
        const data = {
          phoneNo: friend.phoneNo,
          senderFriend: userId
        }
        await push(friendsRef, data)
      })
      setSelectedFriends([])
      console.log("Selected  friends added to the database successfully");
    } catch (error) {
      console.error(
        "Error adding selected friends to the database:",
        error.message
      );
    }
    console.log(" Selected friends: ", selectedFriends);
    setShowSelectedFriends(true);
  };


  const MyListItem = ({ item }) => {
    console.log("Contact info passed to MyListItem:", item);

    return (
      <TouchableOpacity style={styles.contactItem}>
        {item.value.contactInfo.imageAvailable ? (
          <Image
            source={{ uri: item.value.contactInfo.image.uri }}
            style={{ width: 40, height: 40, borderRadius: 25, marginLeft: 10 }}
          />
        ) : (
          <Ionicons
            style={styles.ionicon}
            name={"ios-call"}
            size={50}
            color={"green"}
          />
        )}
        <Text style={styles.contactName}>{item.value.contactInfo.name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    // Displaying all the contacts
    <View style={{ flex: 1 }}>
        <ScrollView>
      { !showSelectedFriends &&( <View>

          {contacts.length > 0 ? (
            contacts.map((contact) => (
              <TouchableOpacity
                style={styles.contactItem}
                key={contact.id}
                onPress={() => handleFriendSelection1(contact)}
              >
                {contact.imageAvailable ? (
                  <Image
                    source={{ uri: contact.image.uri }}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 25,
                      marginLeft: 10,
                    }}
                  />
                ) : (
                  <Ionicons
                    style={styles.ionicon}
                    name={"ios-call"}
                    size={50}
                    color={"green"}
                  />
                )}
                <Text style={styles.contactName}>{contact.name}</Text>
              </TouchableOpacity>
            ))
          ) : (
          <>
          <View><Text>No contacts found</Text></View>
          </>
          )}

          </View>

          )}



            <>
            {/* // Displaying load contacts button and friends added   */}
            { showSelectedFriends && (   
            <View>
                  
                    {usersFriends && usersFriends.map(item => (
                      <MyListItem key={item.key} item={item}/>
                      ))}
                      <Button title="Add Friends" onPress={handleLoadContacts} />
                  
                      </View>
            )} 

            </>    
        
          
        </ScrollView>
  
      {/* Displaying the button to add the selected friends to db at the bottom */}

      {!showSelectedFriends && selectedFriends.length > 0 && (
        <TouchableOpacity
          onPress={handleAddFriends}
          style={{ alignItems: "center", paddingVertical: 16, backgroundColor: '#00001f' }}
        >
          <Text>Add Selected Friends</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  listContainer: {
    flexGrow: 1,
  },
  contactItem: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    pointerEvents: 'box-none'
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
  ionicon: {
    marginLeft: 2,
    marginTop: 6,
    paddingHorizontal: 8,
    paddingLeft: 20,
    fontSize: 18,
    fontWeight: "bold",
  },
  contactNumber: {
    fontSize: 16,
    color: "#666",
  },
  floatBtn: {
    position: 'absolute',
    bottom: 60,
    right: 20,
  }
});
export default FriendsScreen;
