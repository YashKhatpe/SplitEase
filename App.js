
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
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: 'blue',
        inactiveTintColor: 'gray',
      }}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Friends') {
            iconName = 'person-outline';
          } else if (route.name === 'Groups') {
            iconName = 'ios-people-outline';
          } else if (route.name === 'Activity') {
            iconName = 'ios-notifications-outline';
          } else if (route.name === 'Account') {
            iconName = 'person-outline';
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
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
