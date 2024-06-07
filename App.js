import * as React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';

import SplashScreen from './screens/Splash';
import OnboardingScreen from './screens/Onboarding';
import SignUpScreen from './screens/SignUp';
import LogInScreen from './screens/LogIn';
import HomeScreen from './screens/Home';
import ProfileScreen from './screens/Profile';
import ItemScreen from './screens/ItemDetails';
import CartScreen from './screens/Cart';
import CheckOutScreen from './screens/CheckOut.js';

const Stack = createNativeStackNavigator();

LogBox.ignoreLogs([   'Non-serializable values were found in the navigation state', 
  'You started loading the font "Markazi", but used it before it finished loading. You need to wait for Font.loadAsync to complete before using the font.'
]);

export default function App() {
  //console.log('App:');
  const [isLoading, updateIsLoading] = useState(true);  
  const [isLoggedIn, updateIsLoggedIn] = useState(false);
  const [fontsLoaded, fontError] = useFonts({
    'Karla': 'https://github.com/cltacker13/little-lemon/blob/master/assets/ll-fonts/quTiL5KcTtip0D2koa-z_Q_4151acd234364ee5828020d37a86f6e1_LittleLemon_fonts/PG_LittleLemon_fonts/Fonts/Karla-Regular.ttf',
    'Markazi': 'https://github.com/cltacker13/little-lemon/blob/master/assets/ll-fonts/quTiL5KcTtip0D2koa-z_Q_4151acd234364ee5828020d37a86f6e1_LittleLemon_fonts/PG_LittleLemon_fonts/Fonts/MarkaziText-Regular.ttf?raw=true',
  });


  const storeData = async () => {
    //console.log('saving data...');
    try {
      await AsyncStorage.setItem(
        'firstOpenComplete', 'true'
      )
      //console.log('saved firstopen data');
      retrieveData();
    } catch (error) {
      //saving error
      console.log('saving error:', error);
    }
  };
  const retrieveData = async () => {
    //console.log('retrieving data...');
    try {
      const firstOpenComplete = await AsyncStorage.getItem('firstOpenComplete');
      const userLoggedIn = await AsyncStorage.getItem('userLoggedIn');
      const userFirstName = await AsyncStorage.getItem('firstName');
      const userEmail = await AsyncStorage.getItem('userEmail');
      const userPassword = await AsyncStorage.getItem('userPassword');
      //console.log('App retrieved:',firstOpenComplete,userLoggedIn)
      if (firstOpenComplete !== null) {
        //console.log('firstOpenedComplete:',firstOpenComplete);
        updateIsLoading(false);
        //console.log('data exists');
        if(userLoggedIn !== null){

          if(userLoggedIn === 'true'){
            updateIsLoggedIn(true);
            //console.log('retrieve local data on App:',localData)
            //console.log(`user ${userFirstName} is logged in: ${userLoggedIn}`);
          } else {
            //console.log('not a user');
          }
        };
      }else{
        storeData();
        //console.log('new load.')
      }; 
    } catch (error) {
      //retrieving error
      console.log('retrieving error on App.js: ', error);
    }
  };

  useEffect(() => {
    retrieveData(); 
  },[]);
  

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} >
        {/*check for loggedin status*/
        //cannot manually nav btwn groups, automatically navs based on criteria.
          isLoading ? (
            <Stack.Screen name="Splash" component={SplashScreen} />
          ) : (
            isLoggedIn ? ( 
              <>
                <Stack.Screen name="Home" component={HomeScreen} initialParams={{ updateIsLoggedIn }}/>
                <Stack.Screen name="Profile" component={ProfileScreen} initialParams={{ updateIsLoggedIn }}/>
                <Stack.Screen name="ItemDetails" component={ItemScreen} initialParams={{ updateIsLoggedIn }}/>
                <Stack.Screen name="Cart" component={CartScreen} initialParams={{ updateIsLoggedIn }}/>
                <Stack.Screen name='Checkout' component={CheckOutScreen} initialParams={{ updateIsLoggedIn }}/>
              </>
            ) : (
              <>
                <Stack.Screen name="Onboarding" component={OnboardingScreen} initialParams={{ updateIsLoggedIn }}/>
                <Stack.Screen name="SignUp" component={SignUpScreen} initialParams={{ updateIsLoggedIn }}/>
                <Stack.Screen name="LogIn" component={LogInScreen} initialParams={{ updateIsLoggedIn }}/>
              </>
            )
          )
        }
      </Stack.Navigator>
    </NavigationContainer>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Karla',
  },
});
