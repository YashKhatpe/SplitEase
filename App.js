import 'react-native-gesture-handler';
import { StyleSheet, View, TouchableOpacity } from "react-native";
import Home from "./screens/Home";
import Signup from "./screens/Signup";
import Login from "./screens/Login ";
import { FirebaseProvider } from "./context/AuthContext";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { firebaseAuth, authStateChanged } from "./context/AuthContext";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import FriendsScreen from "./screens/FriendsScreen";
import GroupsScreen from "./screens/GroupsScreen";
import ActivityScreen from "./screens/ActivityScreen";
import AccountScreen from "./screens/AccountScreen";
import BackButton from "./components/BackButton";
import StartScreen from "./screens/StartScreen";
import CreateGroup from "./screens/CreateGroup";
import InviteScreen from "./screens/InviteScreen";
import SingleSplitBillScreen from "./screens/SingleSplitBillScreen";
import AddExpense from "./screens/AddExpense";
import BillDetails from "./screens/BillDetails";
import { onAuthStateChanged } from '@firebase/auth';
import SplitOptionScreen from './screens/SplitOptionScreen';
import FirstRoute from './screens/FirstRoute';
import SecondRoute from './screens/SecondRoute';
import ThirdRoute from './screens/ThirdRoute';
import ChangePasswordScreen from './screens/ChangePasswordScreen';
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
export default function App() {
  const [user, setUser] = useState(null);
  const [selectedTab, setSelectedTab] = useState("Friends");
  useEffect(() => {
    onAuthStateChanged(firebaseAuth, (user1) => {
      setUser((prevUser) => {
        if (user1) {
          console.log("Hello User: ", user1.email);
          return user1;
        } else {
          console.log("You are currently logged out");
          return null;
        }
      });
    });
  }, []);

  return (
    <FirebaseProvider>
      <NavigationContainer>
        <Stack.Navigator>
          {!user && (
            <Stack.Screen
              name="StartScreen"
              component={StartScreen}
              options={{ headerShown: false }}
            />
          )}
          <Stack.Screen
            name="Main"
            component={Main}
            options={({ navigation }) => ({
              headerShown: false,
              headerTitle: "SplitEase",
              headerLeft: () => <BackButton navigation={navigation} />,
              headerRight: () => (
                <View style={{ flexDirection: "row" }}>
                  <TouchableOpacity
                    style={{ marginRight: 10 }}
                    onPress={() => navigation.navigate("Friends")}
                  >
                    <Ionicons name="person-add" size={24} />
                  </TouchableOpacity>
                  {/* <TouchableOpacity
                    style={{ marginRight: 15 }}
                    onPress={() => navigation.navigate("Search")}
                  >
                    <Ionicons name="search" size={24} />
                  </TouchableOpacity> */}
                </View>
              ),
            })}
          />
          <Stack.Screen
            name="Home"
            component={Home}
            options={{ headerShown: false }}
          />
          {/* <Stack.Screen
            name="CreateGroup"
            component={CreateGroup}
            
            options={({ navigation }) => ({
              headerShown: true,
              headerTitle: "Create a Group",
              headerLeft: () => (
                <View>
                  <TouchableOpacity
                    onPress={() => navigation.navigate("Groups")}
                    style={{ marginLeft: 10 }}
                  >
                    <Ionicons name="arrow-back" size={24} color="black" />
                  </TouchableOpacity>
                </View>
              ),
            })}
          /> */}
          <Stack.Screen
            name="InviteScreen"
            component={InviteScreen}
            options={({ navigation }) => ({
              headerShown: true,
              headerTitle: "Group Invite",
              headerLeft: () => (
                <View>
                  <TouchableOpacity
                    onPress={() => navigation.navigate("Groups")}
                    style={{ marginLeft: 10 }}
                  >
                    <Ionicons name="arrow-back" size={24} color="black" />
                  </TouchableOpacity>
                </View>
              ),
            })}
          />
          <Stack.Screen
            name="Signup"
            component={Signup}
            options={{
              headerShown: false,
              cardStyle: { backgroundColor: "lightblue" },
            }}
          />
          <Stack.Screen
            name="Login"
            component={Login}
            options={{
              headerShown: false,
              // cardStyle: { backgroundColor: "green" },
            }}
          />
          <Stack.Screen
            name="SingleSplitBillScreen"
            component={SingleSplitBillScreen}
            options={{
              headerShown: true,
              headerTitle: "SplitEase",
            }}
          />
          <Stack.Screen
            name="Add Expense"
            component={AddExpense}
            options={{
              headerShown: true,
            }}
          />
          <Stack.Screen
            name="BillDetails"
            component={BillDetails}
            options={{
              headerShown: true,
            }}
          />
          <Stack.Screen
            name="SplitOption"
            component={SplitOptionScreen}
            options={{
              headerShown: true,
            }}
          />
          <Stack.Screen
            name="first"
            component={FirstRoute}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="second"
            component={SecondRoute}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="third"
            component={ThirdRoute}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="changepwd"
            component={ChangePasswordScreen}
            options={{
              headerShown: false,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </FirebaseProvider>
  );
}
function Main() {
  return (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: "#227FC2",
        inactiveTintColor: "gray",
        
      }}
      screenOptions={({ route }) => ({
        tabBarStyle: {
          borderTopLeftRadius:18,
          borderTopRightRadius:18,
          height: 60
        },
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "Friends") {
            iconName = "person";
          } else if (route.name === "Groups") {
            iconName = "ios-people-outline";
          } else if (route.name === "Activity") {
            iconName = "ios-notifications-outline";
          } else if (route.name === "Account") {
            iconName = "person-outline";
          }

          return <Ionicons name={iconName} size={28} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Friends"
        component={FriendsScreen}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: "  SplitEase",
          // headerLeft: () => <BackButton navigation={navigation} />,
          headerRight: () => (
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                style={{ marginRight: 10 }}
                onPress={() => navigation.navigate("Friends")}
              >
                <Ionicons name="person-add" size={24} />
              </TouchableOpacity>
            </View>
          ),
        })}

      />
      {/* <Tab.Screen
        name="Groups"
        component={GroupsScreen}
        options={({ navigation }) => ({
          headerShown: true,
          // headerTitle: "Profile",
          headerLeft: () => <BackButton navigation={navigation} />,
          headerRight: () => (
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                style={{ marginRight: 10 }}
                onPress={() => navigation.navigate("AddFriend")}
              >
                <Ionicons name="person-add" size={24} />
              </TouchableOpacity>
              <TouchableOpacity
                style={{ marginRight: 15 }}
                onPress={() => navigation.navigate("Search")}
              >
                <Ionicons name="search" size={24} />
              </TouchableOpacity>
            </View>
          ),
        })}
      /> */}
      <Tab.Screen
        name="Activity"
        component={ActivityScreen}
        options={({ navigation }) => ({
          headerShown: true,
          // headerTitle: "Profile",
          headerLeft: () => <BackButton navigation={navigation} />,
          headerRight: () => (
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                style={{ marginRight: 10 }}
                onPress={() => navigation.navigate("Friends")}
              >
                <Ionicons name="person-add" size={24} />
              </TouchableOpacity>
              {/* <TouchableOpacity
                style={{ marginRight: 15 }}
                onPress={() => navigation.navigate("Search")}
              >
                <Ionicons name="search" size={24} />
              </TouchableOpacity> */}
            </View>
          ),
        })}
      />
      <Tab.Screen
            name="Account"
            component={AccountScreen}
            options={({ navigation }) => ({
              headerShown: false,
              headerTitle: "Profile",
              
              headerLeft: () => <BackButton navigation={navigation} />,
              headerRight: () => (
                <View style={{ flexDirection: "row" }}>
                  <TouchableOpacity
                    style={{ marginRight: 10 }}
                    onPress={() => navigation.navigate("AddFriend")}
                  >
                    <Ionicons name="person-add" size={24} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{ marginRight: 15 }}
                    onPress={() => navigation.navigate("Search")}
                  >
                    <Ionicons name="search" size={24} />
                  </TouchableOpacity>
                </View>
              ),
            })}
          />
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
  container1: {
    flex: 1,
    backgroundColor: "green",
  },
});
