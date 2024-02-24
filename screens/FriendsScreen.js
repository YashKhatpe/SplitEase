import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  TouchableOpacity,
  ScrollView,
  FlatList,
  StyleSheet,
  Image,
  LayoutAnimation,
} from "react-native";
import * as Contacts from "expo-contacts";
import { Ionicons } from "@expo/vector-icons";
import { useFirebase } from "../context/AuthContext";

const FriendsScreen = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [showSelectedFriends, setShowSelectedFriends] = useState(false);
  const [loadContactsAgain, setLoadContactsAgain] = useState(false);
  const firebase = useFirebase();
  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleLoadContacts = async () => {
    if (hasPermission) {
      const { data } = await Contacts.getContactsAsync();
      // console.log("Data: ", data);
      if (data.length > 0) {
        setContacts(data);
        setShowSelectedFriends(false);
        setLoadContactsAgain(true);
      }
    }
    console.log("In load contacts function");
    console.log('Selected Contacts: ', selectedFriends);
  };
  const handleLoadContactsAgain = async () => {

    setShowSelectedFriends(false);
    setLoadContactsAgain(true);

    console.log("In load contacts again function");
    console.log('Selected Contacts: ', selectedFriends);
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
    console.log('isSelected: ', isSelected);
    const updatedSelectedFriends = isSelected
      ? selectedFriends.filter((friend) => friend.contactInfo.id !== contact.id)
      : [...selectedFriends, { contactInfo: contact }];
    setSelectedFriends(updatedSelectedFriends);
  };

  const handleAddFriends = async () => {


    // Add selected friends to Firebase
    const currUser = firebase.user.email;
    const atIndex = currUser.indexOf("@");
    const userId = currUser.slice(0, atIndex);
    const path = `users/${userId}/friends`;

    // Filter out added friends from the contacts state
    const remainingContacts = contacts.filter(contact => {
      // Check if the contact is not in the selectedFriends array
      return !selectedFriends.some(selectedFriend => selectedFriend.contactInfo.id === contact.id);
    });

    // Store remaining contacts in the state
    setContacts(remainingContacts); // No same contacts will be displayed to user which is akready being added as a friends


    // Store selected friends in the database
    try {
      await firebase.putData(path, selectedFriends);
      console.log("Selected friends added to the database successfully");
    } catch (error) {
      console.error(
        "Error adding selected friends to the database:",
        error.message
      );
    }
    console.log(' Contacts: ', contacts);
    console.log(' Selected friends: ', selectedFriends);
    setShowSelectedFriends(true);
  };

  // Render each contact item
  const MyListItem = ({ item }) => (
    <TouchableOpacity style={styles.contactItem}>
      {item && item.imageAvailable ? (
        <Image
          source={{ uri: item.image.uri }}
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
      <Text style={styles.contactName}>{item.name}</Text>
    </TouchableOpacity>
  );


  return (
    // Displaying all the contacts
    <View style={{ flex: 1 }}>
      {!showSelectedFriends ? (
        <ScrollView>
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
            // Displaying load contacts button for first time
            <>
              <Button title="Load Contacts" onPress={handleLoadContacts} />
              <Button
                title="Login"
                onPress={() => navigation.navigate("Login")}
              />
              <Button
                title="Signup"
                onPress={() => navigation.navigate("Signup")}
              />
            </>
          )}
        </ScrollView>
      ) : (
        <>
          {loadContactsAgain && selectedFriends && (
            // Displaying selected contacts as friends only
            <>
              <FlatList
                data={selectedFriends}
                renderItem={({ item }) => (
                  <MyListItem
                    key={item.contactInfo.id}
                    item={contacts.find((contact) => contact.id === item.contactInfo.id)}
                  />
                )}
                keyExtractor={(item) => item.contactInfo.id}
                contentContainerStyle={styles.listContainer}
              />
            </>
          )}
          <Button title="Add more Friends" onPress={handleLoadContactsAgain} />
        </>
      )}

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
});
export default FriendsScreen;
