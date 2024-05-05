import { useWindowDimensions } from "react-native";
import React, { useEffect, useState } from "react";
import { TabView } from "react-native-tab-view";


import FirstRoute from "./FirstRoute";
import SecondRoute from "./SecondRoute";
import ThirdRoute from "./ThirdRoute";

const SplitOptionScreen = ({ navigation, route }) => {
  const { onSelectOption, friend, amount, splitMethod, onSplitDetails, profilePicUrl, friendProfilePicUrl } = route.params;
  
  const layout = useWindowDimensions();
  useEffect(() => {
    console.log("Prop val: ", onSelectOption);
    console.log("Friend : ", friend);
    console.log("Prof Pic : ", profilePicUrl);
    console.log("Friend Prof Pic : ", friendProfilePicUrl);
  }, []);



  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "first", title: "Normally" },
    { key: "second", title: "Unequally" },
    { key: "third", title: "Percentage wise" },
  ]);

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={(props) =>
        renderScene({ ...props, onSelectOption, friend, splitMethod, amount, onSplitDetails, profilePicUrl, friendProfilePicUrl })
      }
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
    />
  );
};
export default SplitOptionScreen;

const renderScene = ({
  navigation,
  route,
  onSelectOption,
  friend,
  splitMethod,
  amount,
  onSplitDetails,
  profilePicUrl,
  friendProfilePicUrl
}) => {
  switch (route.key) {
    case "first":
      return (
        <FirstRoute
          navigation={navigation}
          onSelectOption={onSelectOption}
          splitMethod={splitMethod}
          friend={friend}
          amount={amount}
          onSplitDetails={onSplitDetails}
          profilePicUrl={profilePicUrl}
          friendProfilePicUrl={friendProfilePicUrl}
          />
        );
        case "second":
          return (
            <SecondRoute
            navigation={navigation}
            onSelectOption={onSelectOption}
            splitMethod={splitMethod}
            friend={friend}
            amount={amount}
            onSplitDetails={onSplitDetails}
            profilePicUrl={profilePicUrl}
            friendProfilePicUrl={friendProfilePicUrl}
            />
          );
          case "third":
            return (
              <ThirdRoute
              navigation={navigation}
              onSelectOption={onSelectOption}
              splitMethod={splitMethod}
              friend={friend}
              amount={amount}
              onSplitDetails={onSplitDetails}
              profilePicUrl={profilePicUrl}
              friendProfilePicUrl={friendProfilePicUrl}
              />
      );
  }
};


