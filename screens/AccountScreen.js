import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Image } from 'react-native';
import { useFirebase } from '../context/AuthContext';
import * as ImagePicker from 'expo-image-picker';
import { getDatabase, ref, set, onValue } from '@firebase/database';
import { getUsernameFromEmail } from '../context/AuthContext';

const AccountScreen = ({ navigation }) => {

  const firebase = useFirebase();
  const db = getDatabase();

  const [username, setUsername] = useState('Guest');
  const [usermail, setUsermail] = useState('');
  const [profilePicUrl, setProfilePicUrl] = useState(null);

  useEffect(() => {
    if (firebase && firebase.user) {
      const fetchUserName = async () => {
        try {
          const email = firebase.user.email;
          console.log('User Eamil: ', email);
          const atIndex = email.indexOf("@");
          const shortEmail = email.slice(0, atIndex);
          let currUser;
          getUsernameFromEmail(shortEmail)
            .then((uname) => {
              currUser = uname;
              console.log('Curr user is:', currUser);
              setUsername(uname);
            })
            .catch((error) => {
              console.error("Error: ", error.message);
            })
          setUsermail(email);
        } catch (error) {
          console.error('Error retrieving username: ', error.message);
        }
      }
      fetchUserName();
    }
  }, [firebase.user]);

    useEffect(() => {
      if(firebase && firebase.isLoggedIn){
        const fetchPicUrlFromDb = async () =>{
          const email = await firebase.user.email;
          const atIndex = await email.indexOf("@");
          const shortEmail = await email.slice(0, atIndex);
          const uname = await firebase.getUsernameFromshortEmail(shortEmail)
          const path = `users/accounts/${uname}/profPicUrl`;
          const friendsRef = ref(db, path);
          onValue(friendsRef, async(snapshot) => {
            const data = await snapshot.val();
            if (data) {
              setProfilePicUrl(data)
            } else {
              setProfilePicUrl(null);
            }
          });
        }
      fetchPicUrlFromDb();
      }
    }, [firebase.isLoggedIn, firebase.user]);


  const handleImagePick = async () => {
    try {
      if (!firebase.isLoggedIn) {
        console.warn('You are not Logged In..');
        return;
      }
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        const picUrl = result.assets[0].uri;
        console.log('Selected image URI:', picUrl);
        setProfilePicUrl(picUrl);
        const profPicUrl = picUrl;
        const path = `users/accounts/${username}/profPicUrl`;
        const friendsRef = ref(db, path);
        const response = await set(friendsRef, profPicUrl);
        if (!response) console.log('Server Error uploading pic');
        console.log('Successfully update profile pic')
      }
    } catch (error) {
      console.error('Error selecting image:', error);
    }



  };



  const handleLogout = async() => {
    // firebase.setUser(null);
    await firebase.signUserOut();
    navigation.navigate('StartSceen');
  }
  return (
    <View style={{ flex: 1 }}>

      <View style={{
        borderBottomWidth: 0,
        borderBottomColor: "#ccc"
      }}>

        <Text style={styles.heading}>Account Screen</Text>
      </View>
      <View style={{ flex: 2, flexDirection: 'row', }}>
        {profilePicUrl ? (
          <Image
            source={{ uri: profilePicUrl }}
            style={styles.profilePic}
          />

        ) : (
          <Image
            source={require("../assets/login_img.png")}
            style={styles.profilePic}
          />

        )}
        <View style={{ flexDirection: 'column' }}>
          <Text style={{ marginTop: 15, marginLeft: 20, fontSize: 20 }}>{username}</Text>
          <Text style={{ marginTop: 15, marginLeft: 20, fontSize: 13, fontStyle: 'italic' }}>{usermail}</Text>
        </View>
      </View>
      <View style={{
        flexDirection: 'row', position: 'absolute', left: 20, top: 200, borderBottomWidth: 1,
        borderBottomColor: "#ccc"
      }}>
        <Image
          source={require("../assets/login_img.png")}
          style={{ width: 50, height: 50, borderRadius: 25, marginRight: 60 }}
        />
        <Text style={{ fontSize: 21, marginTop: 10, marginRight: 60 }}>Change Password</Text>
      </View>
      <Button title='Select Profile Pic' onPress={handleImagePick} />
      <Button title='Login' onPress={() => navigation.navigate('Login')} style={{ alignItems: "center", paddingVertical: 16, width: 50 }} />
      <Button title='Signup' onPress={() => navigation.navigate('Signup')} style={{ alignItems: "center", paddingVertical: 26, width: 90 }} />
      <Button title='Logout' onPress={handleLogout} style={{ alignItems: "center", paddingVertical: 36, width: 90 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 25,
    margin: 15
  },
  profilePic: {
    width: 80, 
    height: 80, 
    borderRadius: 15, 
    marginLeft: 10 ,
    margin: 15
  }
})

export default AccountScreen;
