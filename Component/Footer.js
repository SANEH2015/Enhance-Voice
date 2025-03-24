import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const Footer = () => {
  return (
    <View style={styles.footerContainer}>
      <Text style={styles.footerText}>© 2023 Your Company. All rights reserved.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    alignItems: 'center',
  },
  footerText: {
    color: '#666',
    fontSize: 12,
  },
});
export default Footer;