import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Image, FlatList, SafeAreaView, Dimensions, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {Camera} from 'expo-camera'
import { useEffect, useState } from 'react';
import * as MediaLibrary from "expo-media-library";

// @components
import PictureCard from '../../components/PictureCard/PictureCard';
import BottomBar from '../../components/BottomBar/BottomBar';
import TopBar from '../../components/TopBar/TopBar';

// @constants
import { ALBUM_NAME } from '../../constants';

const {width} = Dimensions.get('window');
const itemWidth = (width) / 2 - 10;

const Home = () => {
  const [localImages, setLocalImages] = useState<Array<Partial<MediaLibrary.AssetInfo>>>([]);
  const [permission, setCameraPermission] = useState();
  const permisionFunction = async () => {
    // here is how you can get the camera permission
    const cameraPermission = await Camera.requestCameraPermissionsAsync();
    const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();

    setCameraPermission(cameraPermission.status === 'granted');

    const imagePermission = await ImagePicker.getMediaLibraryPermissionsAsync();

    if (
      cameraPermission.status !== 'granted' || cameraPermission.status !== 'granted'
    ) {
      alert('Permission for media access needed.');
    }

  };

  const getLocalPictures = async () => {
    try {
      const album = await MediaLibrary.getAlbumAsync(ALBUM_NAME);
      const getAllPhotos = await MediaLibrary.getAssetsAsync({
        first: 50,
        album,
        sortBy: ['creationTime'],
        mediaType: ['photo'],
      })

      setLocalImages(getAllPhotos.assets)
      // getAllPhotos.assets.forEach(async element => {
      //   const localImage = await MediaLibrary.getAssetInfoAsync(element);

      //   setLocalImages([...localImages, localImage])
      // });
    } catch {

    }
  }

  useEffect(() => {
    permisionFunction();
    getLocalPictures();
  }, []);

  const takePhoto = async () => {    
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });


    if (!result.canceled) {
      setLocalImages([{uri: result.assets[0].uri, filename: result.assets[0].fileName}, ...localImages])
      saveImageLocally(result.assets[0].uri);

    }

  }

  const saveImageLocally = async (uri: string) => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status === "granted") {
      // Save image to media library
        const asset = await MediaLibrary.createAssetAsync(uri);
        const album = await MediaLibrary.getAlbumAsync(ALBUM_NAME);

        if (!album) {
          await MediaLibrary.createAlbumAsync(ALBUM_NAME, asset, false);
        } else {

          await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
        }
      
      }
    } catch (error) {
      console.log(error);
    }
  };

  const renderEmptyState = () => (
    <Text style={styles.emptyText}>Tu colección de fotos está vacía, cuál será tu primera foto ?</Text>
  )

  return (
    <View style={styles.container}>
      <TopBar />
      <FlatList
        data={localImages}
        keyExtractor={(item, index) => `${item.filename} ${index}`}
        renderItem={({item}) => <PictureCard  uri={item.uri} width={itemWidth} />}
        ListEmptyComponent={renderEmptyState}
        numColumns={2}
      />
     <BottomBar onPressCamera={takePhoto} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  emptyText: {
    color: "white",
    fontSize: 20,
    marginHorizontal: 30,
    marginTop: 30,
    textAlign: "center",
  }
});

export default Home;
