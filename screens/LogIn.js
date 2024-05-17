import { useState } from 'react';
import { Alert, Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { validateEmail, validatePassword } from '../utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { localData, retrieveAllLocalData, storeAllLocalData, updateLocalData } from '../utils/localData';

export default function LogInScreen({navigation, route}){
    console.log('Login Screen');
    const { updateIsLoggedIn } = route.params;
    const [email, onChangeEmail] = useState('');
    const [password, onChangePassword] = useState('');
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isFormValid = (isEmailValid && isPasswordValid);

    const storeOnlineStatus = async () => {
        console.log('saving online status ...');
        try {
            const userEmail = await AsyncStorage.getItem('userEmail');
            const userPassword = await AsyncStorage.getItem('userPassword'); 
            if(userEmail == email && userPassword == password){    
                try {
                    await AsyncStorage.setItem(
                        'userLoggedIn', 'true'
                    )
                    localData.online = true;
                    updateIsLoggedIn(true);
                    console.log('saved firstopen data');
                } catch (error) {
                //saving error
                    console.log('error saving online status: ', error);  
                }
            } else {
                console.log('invalid login creds');
                Alert.alert('Invalid Email & Password', 'Please try again with valid email and password.')
            }
        } catch (error) {
          //retrieving error
          console.log('error retreiving login creds: ', error);
        }
      };


    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.imageContainer}>
                    <Image source={require("../assets/ll-images/Logo.png")} 
                    style={styles.logo}/>
                </View>
            </View>
            <View style={styles.main}>
                <Text style={styles.h1}>Welcome Back!</Text>
                <Text style={styles.h2}>Log into your account</Text>
                <View style={styles.form}>
                <Text style={styles.inputLabel}>Email Address</Text>
                    <TextInput 
                        style={styles.inputBox}
                        value={email}
                        onChangeText={onChangeEmail}
                        placeholder={'Type your email'}
                        keyboardType="email-address"
                        textContentType="emailAddress"
                    />
                    <Text style={styles.inputLabel}>Password</Text>
                    <TextInput 
                        style={styles.inputBox}
                        value={password}
                        onChangeText={onChangePassword}
                        placeholder={'Type your password'}
                        keyboardType="default"
                        textContentType="password"
                        secureTextEntry={true}
                    />
                </View>
                <Pressable
                    onPress={ () => {
                        storeOnlineStatus()
                        //navigation.navigate('Profile')
                        }
                    }
                    style={[styles.button, !isFormValid && styles.buttonDisabled]}
                >
                    <Text style={styles.buttonText}>Log In</Text>
                </Pressable>


            </View>
        </View>


    );
}
    
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: '#fff',
        //alignItems: 'center',
        //justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
    },
    imageContainer: {
        alignItems: 'center',
    },
    logo: {
        resizeMode: 'contain',
        height: 100,
        width: 300,
        marginBottom: 32,
    },
    main: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 50,

    },
    h1: {
        //fontFamily: 'karla',
        fontSize: 26,
        fontWeight: 'bold',
    },
    h2: {
        //fontFamily: 'karla',
        fontSize: 20,
        fontWeight: 'bold',
    },
    form: {
        paddingTop: 50,
        paddingBottom: 50,
    },
    inputLabel: {
        //fontFamily: 'karla',
        fontSize: 16,
    },
    inputBox: {
        height: 40,
        width: 250,
        marginVertical: 24,
        borderRadius: 8,
        borderWidth: 1,
        padding: 10,
        fontSize: 16,
        borderColor: '#EDEFEE',
    },
    button: {
        width: 80,
        borderRadius: 8,
        backgroundColor: '#495E57',
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 8,
    },
    buttonDisabled: {
        backgroundColor: 'grey',
        opacity: 0.5,
    },
    buttonText: {
        fontSize: 16,
        color: 'white',
    },

});