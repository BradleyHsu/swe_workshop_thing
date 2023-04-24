import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';

const OtherProfile = (navigation) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate('MessageBoard')}>
        <View style={styles.backArrowContainer}>
          <Image source={require('../assets/icons/back_arrow_icon.png')}
            style={styles.backArrow} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  backArrow: {
    width: 35,
    height: 35,
  },
  backArrowContainer: {
    marginLeft: 20,
    marginTop: 50,
  },
});

export default OtherProfile;
