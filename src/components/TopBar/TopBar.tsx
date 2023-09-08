import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import styles from './styles';

// @assets
const logo = require('../../assets/logo2.png');

const TopBar = () => (
  <View style={styles.container}>
    <Image source={logo} style={styles.logo} />
  </View>
);

export default TopBar;
