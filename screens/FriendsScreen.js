import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  TouchableOpacity,
  ScrollView,
  FlatList,
  StyleSheet,
} from "react-native";
import * as Contacts from "expo-contacts";
import { useFirebase } from '../context/AuthContext';
const FriendsScreen = ({navigation}) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [showSelectedFriends, setShowSelectedFriends] = useState(false);
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
      if (data.length > 0) {
        setContacts(data);
      }
    }
  };

  // const handleFriendSelection = (friendId) => {
  //   const updatedSelectedFriends = selectedFriends.includes(friendId)
  //     ? selectedFriends.filter((id) => id !== friendId)
  //     : [...selectedFriends, friendId];
  //   setSelectedFriends(updatedSelectedFriends);
  // };

  const handleFriendSelection = (friendId, friendName) => {
    const isSelected = selectedFriends.some((friend) => friend.id === friendId);
    const updatedSelectedFriends = isSelected
      ? selectedFriends.filter((friend) => friend.id !== friendId)
      : [...selectedFriends, { id: friendId, name: friendName }];
    setSelectedFriends(updatedSelectedFriends);
  };

  const handleAddFriends = async() => {
     // Add selected friends to Firebase
     const currUser = firebase.user.email;
     const atIndex = currUser.indexOf('@');
     const userId = currUser.slice(0, atIndex);
     const path = `users/${userId}/friends`;

      // Store selected friends in the database
      try {
        const dataSuccess = await firebase.putData(path, selectedFriends);
        console.log('Selected friends added to the database successfully');
    } catch (error) {
        console.error('Error adding selected friends to the database:', error.message);
    }
     setShowSelectedFriends(true);
  };

  // Render each contact item
  const MyListItem = ({ item }) => (
    <TouchableOpacity style={styles.contactItem}>
      <Text style={styles.contactName}>{item.name}</Text>
      {/* <Text style={styles.contactNumber}>{item.phoneNumbers[0].number}</Text> */}
    </TouchableOpacity>
  );




  return (
    <View style={{ flex: 1 }}>
      {!showSelectedFriends ? (
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {contacts.length > 0 ? (
            contacts.map((contact) => (
              <TouchableOpacity
                key={contact.id}
                onPress={() => handleFriendSelection(contact.id, contact.name)}
                style={{ paddingVertical: 8 }}
              >
                <Text>{contact.name}</Text>
              </TouchableOpacity>
            ))
          ) : (
            <>
            <Button title="Load Contacts" onPress={handleLoadContacts} />
            <Button title="Login" onPress={()=> navigation.navigate('Login')} />
            <Button title="Signup" onPress={()=> navigation.navigate('Signup')} />
            </>
          )}
        </ScrollView>
      ) : (
        // <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
        //   {selectedFriends.length > 0 ? (
        //     selectedFriends.map((friendId) => {
        //       const friend = contacts.find((contact) => contact.id === friendId);
        //       return (
        //         <TouchableOpacity
        //           key={friendId}
        //           onPress={() => handleFriendSelection(friendId)}
        //           style={{ paddingVertical: 8 }}
        //         >
        //           <Text>{friend ? friend.name : 'Unknown'}</Text>
        //         </TouchableOpacity>
        //       );
        //     })
        //   ) : (
        //     <Text>No friends selected</Text>
        //   )}
        // </ScrollView>
        <FlatList
        data={selectedFriends}
        renderItem={({ item }) => <MyListItem item={contacts.find((contact) => contact.id === item.id)} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
      )}
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
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  contactName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  contactNumber: {
    fontSize: 16,
    color: "#666",
  },
});
export default FriendsScreen;
