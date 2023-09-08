import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';

// @styles
import styles from './styles';

// @assets
const cameraIcon = require('../../assets/camera.png');

interface IBottomBarProps {
  onPressCamera: () => void,
}

const BottomBar: React.FC<IBottomBarProps> = ({onPressCamera}) => (
  <View style={styles.container}>
    <TouchableOpacity onPress={onPressCamera} style={styles.containerCamera}>
      <Image source={cameraIcon} style={styles.camera} />
    </TouchableOpacity>
  </View>
);

export default BottomBar;
