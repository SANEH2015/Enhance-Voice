import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Navigation = ({ onVisitSite }) => {
  return (
    <View style={styles.navContainer}>
      <Text style={styles.logo}>YourLogo</Text>
      <TouchableOpacity onPress={onVisitSite}>
        <Text style={styles.navLink}>Visit site</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  logo: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  navLink: {
    color: '#666',
    textDecorationLine: 'underline',
  },
});

export default Navigation;