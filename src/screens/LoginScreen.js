import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, View, Text, ScrollView, SafeAreaView, Platform } from 'react-native';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { getAuth, GoogleAuthProvider } from '@react-native-firebase/auth';
import { useState } from 'react';

export default function LoginScreen() {
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [tokenInfo, setTokenInfo] = useState(null);

  GoogleSignin.configure({
    webClientId: '453519775315-6tgd97v4qkeohi9seisgpek2e7qen1fl.apps.googleusercontent.com',
    offlineAccess: true,
    scopes: ['profile', 'email']
  });

  const signIn = async () => {
    if (isSigningIn) {
      console.log('Sign in is already in progress');
      return;
    }

    setIsSigningIn(true);
    try {
      await GoogleSignin.hasPlayServices();
      const googleUserInfo = await GoogleSignin.signIn();
      console.log('User Info:', googleUserInfo);
      
      const idToken = googleUserInfo?.data?.idToken;
      if (!idToken) {
        throw new Error('No ID Token present!');
      }

      // Parse JWT token to get expiration time
      const tokenParts = idToken.split('.');
      const tokenPayload = JSON.parse(atob(tokenParts[1]));
      const expirationDate = new Date(tokenPayload.exp * 1000);

      const auth = getAuth();
      const googleCredential = GoogleAuthProvider.credential(idToken);
      const userCredential = await auth.signInWithCredential(googleCredential);
      console.log('User signed in:', userCredential.user);

      setUserInfo(googleUserInfo.data.user);
      setTokenInfo({
        expirationDate,
        token: idToken
      });
      
    } catch (error) {
      console.error('Sign-in error:', error);
      if (error.code) {
        switch (error.code) {
          case statusCodes.SIGN_IN_CANCELLED:
            console.log('User cancelled the login flow');
            break;
          case statusCodes.IN_PROGRESS:
            console.log('Sign in is in progress');
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            console.log('Play services not available');
            break;
          default:
            console.log('Some other error:', error.message || error);
        }
      }
    } finally {
      setIsSigningIn(false);
    }
  };

  const signOut = async () => {
    try {
      await GoogleSignin.signOut();
      const auth = getAuth();
      await auth.signOut();
      setUserInfo(null);
      setTokenInfo(null);
    } catch (error) {
      console.error('Sign-out error:', error);
    }
  };

  if (userInfo) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="dark" />
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View style={styles.infoContainer}>
            <Text style={styles.title}>Kullanıcı Bilgileri</Text>
            <Text style={styles.info}>Ad: {userInfo.name}</Text>
            <Text style={styles.info}>Email: {userInfo.email}</Text>
            <Text style={styles.info}>ID: {userInfo.id}</Text>
            {userInfo.photo && (
              <Text style={styles.info}>Profil Fotoğrafı URL: {userInfo.photo}</Text>
            )}
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.title}>Token Bilgileri</Text>
            <Text style={styles.info}>Token Bitiş Tarihi:</Text>
            <Text style={styles.info}>{tokenInfo?.expirationDate.toLocaleString()}</Text>
          </View>

          <Pressable 
            onPress={signOut}
            style={({pressed}) => ({
              backgroundColor: pressed ? '#A4A4A4' : '#DC3545',
              padding: 15,
              borderRadius: 5,
              margin: 10,
            })}
          >
            <Text style={{color: 'white', textAlign: 'center'}}>Çıkış Yap</Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.loginContainer}>
        <Pressable 
          onPress={signIn}
          disabled={isSigningIn}
          style={({pressed}) => ({
            backgroundColor: isSigningIn ? '#A4A4A4' : pressed ? '#A4A4A4' : '#4285F4',
            padding: 15,
            borderRadius: 5,
            margin: 10,
            width: '80%',
          })}
        >
          <Text style={{color: 'white', textAlign: 'center'}}>
            {isSigningIn ? 'Giriş yapılıyor...' : 'Google ile Giriş Yap'}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loginContainer: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    padding: 20,
  },
  infoContainer: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#212529',
  },
  info: {
    fontSize: 16,
    marginBottom: 5,
    color: '#495057',
  },
}); 