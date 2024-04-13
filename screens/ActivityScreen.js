
import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { useFirebase } from '../context/AuthContext';
const ActivityScreen = ({route, navigation}) => {
  const { groupData } = route.params || '';
  const firebase = useFirebase();

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
