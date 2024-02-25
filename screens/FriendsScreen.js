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
import { getDatabase, ref, onValue, get, set } from "@firebase/database";
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
    // Fetching user's friends from the database and storing in 'usersFriends' state
    console.log('User Login Status: ',firebase.isLoggedIn);
    const fetchData = async () => {
      const db = getDatabase();
      if (firebase.user) {
        const currUser = await firebase.user.email;
        const atIndex = await currUser.indexOf("@");
        const shortEmail = await currUser.slice(0, atIndex);
        const uname = await firebase.getUsernameFromshortEmail(shortEmail)
        const path = `users/friendsList/${uname}/friends`;
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
  
        // Return cleanup function to unsubscribe the listener
        return () => unsubscribe();
      }
    };
  
    fetchData();
  
    // Cleanup function to unsubscribe the listener when component unmounts
    // return () => {};
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
    console.log('Selected Contacts: ',selectedFriends);
  };
  const handleLoadContactsAgain = async () => {
    
    setShowSelectedFriends(false);
    setLoadContactsAgain(true);
    
    console.log("In load contacts again function");
    console.log('Selected Contacts: ',selectedFriends);
    // console.log('Contacts: ',contacts);
  };
 
  // const handleFriendSelection = (friendId, friendName) => {
      
  //     const isSelected = selectedFriends.some(
  //       (friend) => friend.id === friendId
  //     );
  //     const updatedSelectedFriends = isSelected
  //       ? selectedFriends.filter((friend) => friend.id !== friendId)
  //       : [...selectedFriends, { id: friendId, name: friendName }];
  //     setSelectedFriends(updatedSelectedFriends);
  // };
  const handleFriendSelection1 = (contact) => {
      
      const isSelected = selectedFriends.some(
        (friend) => friend.contactInfo.id === contact.id
      );
      console.log('isSelected: ',isSelected);
      const updatedSelectedFriends = isSelected
        ? selectedFriends.filter((friend) => friend.contactInfo.id !== contact.id)
        : [...selectedFriends, { contactInfo: contact }];
      setSelectedFriends(updatedSelectedFriends);
  };

  const handleAddFriends = async () => {
    // Add selected friends to Firebase
    const currUser = await firebase.user.email;
    const atIndex = await currUser.indexOf("@");
    const shortEmail = await currUser.slice(0, atIndex);
    const uname = await firebase.getUsernameFromshortEmail(shortEmail)
    const path = `users/friendsList/${uname}/friends`;

   // Filter out added friends from the contacts state
   const remainingContacts = contacts.filter(contact => {
    // Check if the contact is not in the selectedFriends array
    return !selectedFriends.some(selectedFriend => selectedFriend.contactInfo.id === contact.id);
});

    // Store remaining contacts in the state
    setContacts(remainingContacts); // No same contacts will be displayed to user which is akready being added as a friends
  

    // Store selected friends in the database
    try {
      const db = getDatabase();
      const friendsRef = ref(db, path)
      const snapshot = await get(friendsRef);
      const existingFriends = snapshot.val() || {};
      const updatedFriends = { ...existingFriends, selectedFriends}
      
      await set(friendsRef, selectedFriends)
      console.log("Selected friends added to the database successfully");
    } catch (error) {
      console.error(
        "Error adding selected friends to the database:",
        error.message
      );
    }
    console.log(' Contacts: ',contacts);
    console.log(' Selected friends: ',selectedFriends);
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
            {/* // Displaying load contacts button for first time   */}
            { showSelectedFriends && (   
            <View>
                  {/* <FloatingButton rightVal={80} text={'Load Contacts'} onPress={handleLoadContacts}  />
                  <FloatingButton rightVal={140} text={'Login'} onPress={() => navigation.navigate("Login")}  />
                <FloatingButton text={'Signup'} onPress={() => navigation.navigate("Signup")}  /> */}
                  
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
          style={{ alignItems: "center", paddingVertical: 16 }}
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
    color: 'white'
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
