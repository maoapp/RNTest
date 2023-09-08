import React from 'react';
import { View, Image } from 'react-native';

// @styles
import styles from './styles';

interface IPictureCardProps {
  uri?: string,
  width: number,
}

const PictureCard: React.FC<IPictureCardProps> = ({uri, width}) => (
  <View style={styles.card}>
    <Image source={{uri: uri}} style={[styles.picture, {width}]} />
  </View>
);

export default PictureCard;
