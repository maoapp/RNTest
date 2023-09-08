import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  Dimensions,
  Linking,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Camera, PermissionResponse } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';

// Components
import PictureCard from '../../components/PictureCard/PictureCard';
import BottomBar from '../../components/BottomBar/BottomBar';
import TopBar from '../../components/TopBar/TopBar';

// Constants
import { ALBUM_NAME } from '../../constants';
import AlertModal from '../../components/AlertModal/AlertModal';

const { width } = Dimensions.get('window');
const itemWidth = width / 2 - 10;

const Home = () => {
  const [localImages, setLocalImages] = useState<Array<Partial<MediaLibrary.AssetInfo>>>([]);
  const [cameraPermissions, setCameraPermissions] = useState<PermissionResponse>();
  const [mediaPermissions, setMediaPermissions] = useState<MediaLibrary.PermissionResponse>();
  const appHasPermissions = useMemo(
    () => cameraPermissions?.granted && mediaPermissions?.granted,
    [cameraPermissions, mediaPermissions]
  );

  const checkPermissions = async () => {
    const cameraPermission = await Camera.requestCameraPermissionsAsync();
    const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();

    console.log('entra a pedir permiso')
    setCameraPermissions(cameraPermission);
    setMediaPermissions(mediaLibraryPermission);
  };

  useEffect(() => {
    checkPermissions();
    getLocalPictures();
  }, []);

  const getLocalPictures = async () => {
    try {
      const album = await MediaLibrary.getAlbumAsync(ALBUM_NAME);
      const getAllPhotos = await MediaLibrary.getAssetsAsync({
        // TODO: Add pagination system
        first: 50,
        album,
        sortBy: ['creationTime'],
        mediaType: ['photo'],
      });

      setLocalImages(getAllPhotos.assets);
    } catch (error) {
      console.error(error);
    }
  };

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const newImage = {
        uri: result.assets[0].uri,
        filename: result.assets[0].fileName,
      };

      setLocalImages([newImage, ...localImages]);
      saveImageLocally(result.assets[0].uri);
    }
  };

  const saveImageLocally = async (uri: string) => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();

      if (status === 'granted') {
        const asset = await MediaLibrary.createAssetAsync(uri);
        const album = await MediaLibrary.getAlbumAsync(ALBUM_NAME);

        if (!album) {
          await MediaLibrary.createAlbumAsync(ALBUM_NAME, asset, false);
        } else {
          await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const renderEmptyState = () => (
    <Text style={styles.emptyText}>
      Tu colección de fotos está vacía, cuál será tu primera foto ?
    </Text>
  );

  return (
    <View style={styles.container}>
      <TopBar />
      <AlertModal visible={!appHasPermissions} onActionPress={checkPermissions} />
      <FlatList
        data={localImages}
        keyExtractor={(item, index) => `${item.filename} ${index}`}
        renderItem={({ item }) => (
          <PictureCard uri={item.uri} width={itemWidth} />
        )}
        ListEmptyComponent={renderEmptyState}
        numColumns={2}
      />
      <BottomBar onPressCamera={takePhoto} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  emptyText: {
    color: 'white',
    fontSize: 20,
    marginHorizontal: 30,
    marginTop: 30,
    textAlign: 'center',
  },
});

export default Home;
