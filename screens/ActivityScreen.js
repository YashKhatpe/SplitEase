
import React from 'react';
import { View, Text } from 'react-native';
const ActivityScreen = ({route, navigation}) => {
  const { groupData } = route.params || '';
  return (
    <View>
      <Text>Activity Screen </Text>
      {groupData && 
       <Text>Activity Screen {groupData.groupName}</Text>
      }
    </View>
  );
}

export default ActivityScreen;
