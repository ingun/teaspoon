import { initializeApp, getApp } from '@react-native-firebase/app';
import { getAuth } from '@react-native-firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAsvscfoG28ix9G5CmDGboj93tHD6ROzbY",
  authDomain: "teaspoon-fbd4e.firebaseapp.com",
  projectId: "teaspoon-fbd4e",
  storageBucket: "teaspoon-fbd4e.firebasestorage.app",
  messagingSenderId: "453519775315",
  appId: "1:453519775315:web:1a70fbc5d09b6de0ed58a6",
  measurementId: "G-Z89SH4V8X5"
};

// Initialize Firebase if it hasn't been initialized yet
if (!getApp.length) {
  initializeApp(firebaseConfig);
}

const auth = getAuth();

export { auth };
export default getApp();