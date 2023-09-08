import React from 'react';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

// @components
import Home from './src/screens/Home/Home';

SplashScreen.preventAutoHideAsync();

const App = () => <Home/ >

export default App;
