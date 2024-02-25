
import { StyleSheet, View, TouchableOpacity } from "react-native";
import Home from "./screens/Home";
import Signup from "./screens/Signup";
import Login from "./screens/Login ";
import { FirebaseProvider } from "./context/AuthContext";;
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { firebaseAuth, authStateChanged } from './context/AuthContext'
import { useEffect, useState } from "react";
import { Ionicons } from '@expo/vector-icons';
import FriendsScreen from "./screens/FriendsScreen";
import GroupsScreen from "./screens/GroupsScreen";
import ActivityScreen from "./screens/ActivityScreen";
import AccountScreen from "./screens/AccountScreen";


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
export default function App() {
  const [user, setUser] = useState(null);
  const [selectedTab, setSelectedTab] = useState('Friends');
  useEffect(() => {
    authStateChanged(firebaseAuth, (user1) => {
      setUser((prevUser) => {
        if (user1) {
          console.log('Hello User: ', user1.email);
          return user1;
        } else {
          console.log('You are currently logged out');
          return null;
        }
      });
    });
  }, []);
  return (
    <FirebaseProvider>
      <NavigationContainer>
        <Stack.Navigator> 
          <Stack.Screen name="Main" component={Main} options={({ navigation }) => ({
          headerShown: true,
          headerTitle: 'SplitEase',
          headerRight: () => (
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            style={{ marginRight: 10 }}
            onPress={() => navigation.navigate('AddFriend')}

                >
                  <Ionicons name="person-add" size={24} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ marginRight: 15 }}
                  onPress={() => navigation.navigate('Search')}
                >
                  <Ionicons name="search" size={24} />
                </TouchableOpacity>
              </View>
            ),
          })} />
          <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
          <Stack.Screen name="Signup" component={Signup} options={{ headerShown: false }} />
          <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </FirebaseProvider>

  );
}
function Main() {
  return (
    <BlurView intensity={80} style={{ ...StyleSheet.absoluteFill }}>
      <Tab.Navigator
      // sceneContainerStyle={styles.mainBody}
      tabBarOptions={{
        activeTintColor: 'green',
        inactiveTintColor: 'gray',
        
      }}
      screenOptions={({ route, state }) => ({
        tabBarStyle:{
          position:'absolute',
          bottom:0,
          height:70,
          borderTopLeftRadius:25,
          borderTopRightRadius:25,
          backgroundColor:'rgba(0,0,36,0.8)',
          elevation:0,
          borderTopWidth:0,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName;
      
          // Ensure that state is defined and not empty
          if (state && state.routes) {
            // Check if the current route is focused
            const focused = state.index === state.routes.findIndex(r => r.name === route.name);
        
            if (route.name === 'Friends') {
              iconName = focused ? 'person' : 'person-outline';
            } else if (route.name === 'Groups') {
              iconName = focused ? 'people' : 'people-outline';
            } else if (route.name === 'Activity') {
              iconName = focused ? 'notifications' : 'notifications-outline';
            } else if (route.name === 'Account') {
              iconName = focused ? 'person' : 'person-outline';
            }
          }
        
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
      

    >
      <Tab.Screen name="Friends" component={FriendsScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Groups" component={GroupsScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Activity" component={ActivityScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Account" component={AccountScreen} options={{ headerShown: false }} />
    </Tab.Navigator>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  mainBody: {
    backgroundColor: '#121529',
  },
  options: {
    height: 60
  },
  container: {
    flex: 1,
    backgroundColor: '#061c69',
  },
  container1: {
    flex: 1,
    backgroundColor: 'green'
  }
});