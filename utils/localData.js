import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';

//global 
export var localData = {
    name: '',
    email: '',
    password: '',
    online: false,
};
export function updateLocalData(newName,newEmail,newPassword,newOnline) {
  localData = {
    name: newName,
    email: newEmail,
    password: newPassword,
    online: newOnline,
  };
};
export function clearLocalData() {
    localData = {
      name: '',
      email: '',
      password: '',
      online: false,
    };
};

//not ready to use.
export const storeAllLocalData = async (firstOpen, loggedIn, firstName, email, password) => {
    console.log('saving LocalData...');
    try {
      await AsyncStorage.multiSet([
        ['firstOpenComplete', firstOpen],
        ['userLoggedIn', loggedIn],
        ['firstName', firstName],
        ['userEmail', email],
        ['userPassword', password]
      ])
      //use to reset user status
      /*await AsyncStorage.setItem(
        'userLoggedIn', 'false'
      )*/
      console.log('saved data');
    } catch (error) {
      //saving error
      console.log('saving all local error:', error);
    }
};
//not ready yet either.
export const retrieveAllLocalData = async () => {
    console.log('retrieving all data...');
    try {
        const firstOpenComplete = await AsyncStorage.getItem('firstOpenComplete');
        const userLoggedIn = await AsyncStorage.getItem('userLoggedIn');
        const userFirstName = await AsyncStorage.getItem('firstName');
        const userEmail = await AsyncStorage.getItem('userEmail');
        const userPassword = await AsyncStorage.getItem('userPassword');
        if (firstOpenComplete !== null) {
        //console.log('localData | firstOpenedComplete:',firstOpenComplete);
        //console.log('data exists');
          if(userLoggedIn !== null){
          
            if(userLoggedIn === 'true'){
                localData = {
                    name: userFirstName,
                    email: userEmail,
                    password: userPassword,
                    online: true,
                };
                //console.log(`localData | user ${userFirstName} is logged in: ${userLoggedIn}`);
              } else {
            console.log('not a user');
            }
          };
        }; 
    } catch (error) {
        //retrieving error
        console.log('retrieving all error:', error);
    }
};