import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Image, Dimensions, Modal, TouchableOpacity } from 'react-native';
import { useFirebase } from '../context/AuthContext';
import * as ImagePicker from 'expo-image-picker';
import { getDatabase, ref, set, onValue } from '@firebase/database';
import { BlurView } from 'expo-blur';
const AccountScreen = ({navigation}) => {

  const firebase = useFirebase();  
  const db = getDatabase();

  const [username, setUsername] = useState('Guest');
  const [usermail, setUsermail] = useState('');
  const [profilePicUrl, setProfilePicUrl] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (firebase && firebase.user) {
      const settingUsername = async () => {
        console.log(firebase.user.uid);
        const fetchedUsername = await firebase.userName;
        setUsername(fetchedUsername);
        setUsermail(firebase.user.email);
      }
      settingUsername();
    }
    }, [firebase.user]);

    useEffect(() => {
      if(firebase && firebase.isLoggedIn){
        const fetchPicUrlFromDb = async () =>{
          const uid = await firebase.user.uid;
          const path = `users/accounts/${uid}/profPicUrl`;
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
    }, []);


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
          const uid = firebase.user.uid;
          const profPicUrl = picUrl;
          const path = `users/accounts/${uid}/profPicUrl`;
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
    navigation.navigate('StartScreen');
  }
  return (
    <View  style={{ flex: 1 }}>
     
      <View style={{
        borderBottomWidth: 1,
        borderBottomColor: "#ccc"
        }}>

      <Text style={styles.heading}>Account Screen</Text>
      </View>
      <View style={{flex: 2, flexDirection: 'row',}}>
        <TouchableOpacity 
        style={{ height: 100, marginTop: 10}}
          // style={styles.profilePic}
          onPress={()=> setModalVisible(true)}>
        {profilePicUrl ? (
          <Image
          source={{uri: profilePicUrl}}
          style={styles.profilePic}
          />
          
          ):(
            <Image
            source={require("../assets/login_img.png")}
            style={styles.profilePic}
            />
            
            )}
            </TouchableOpacity>
        <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <BlurView intensity={100} style={styles.blurContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>

          <Image source={{ uri: profilePicUrl }} style={styles.enlargedImage} />
        </BlurView>
      </Modal>



          <View style={{flexDirection: 'column'}}>
          <Text style={{marginTop: 15, marginLeft: 20, fontSize: 20}}>{username}</Text>
          <Text style={{marginTop: 15, marginLeft: 20, fontSize: 13, fontStyle: 'italic'}}>{usermail}</Text>
          </View>
      </View>
      <View style={{flexDirection: 'row',position: 'absolute', left: 20, top: 200, borderBottomWidth: 1, 
    borderBottomColor: "#ccc"}}>
      <Image
          source={require("../assets/login_img.png")}
          style={{width: 50, height: 50, borderRadius: 25, marginRight: 60}}
          />
        <Text style={{fontSize: 21, marginTop: 10, marginRight: 60}}>Change Password</Text>
      </View>
      <Button title='Select Profile Pic' onPress={handleImagePick}/>
      <Button title='Login' onPress={()=> navigation.navigate('Login') } style={{ alignItems: "center", paddingVertical: 16 }}/>
      <Button title='Signup' onPress={()=> navigation.navigate('Signup')} style={{ alignItems: "center", paddingVertical: 26 }}/>
      <Button title='Logout' onPress={handleLogout} style={{ alignItems: "center", paddingVertical: 36 }}/>
    </View>
  );
}

const styles = StyleSheet.create({
  heading : {
    fontSize: 25,
    margin: 15
  },
  profilePic: {
    width: 80, 
    height: 80, 
    borderRadius: 35, 
    marginLeft: 10 ,
    margin: 15,
    borderWidth: 1
  },
  blurContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  enlargedImage: {
    width: Dimensions.get('window').width - 40,
    height: Dimensions.get('window').height - 40,
    resizeMode: 'contain',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    padding: 10,
  },
  closeButtonText: {
    color: 'black',
    fontSize: 18,
  }
})

export default AccountScreen;
