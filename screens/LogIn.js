import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { validateEmail, validatePassword } from '../utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WelcomeHeader } from './components/Header';

export default function LogInScreen({navigation, route}){
    //console.log('Login Screen');
    const { updateIsLoggedIn } = route.params;
    const [email, onChangeEmail] = useState('');
    const [password, onChangePassword] = useState('');
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isFormValid = (isEmailValid && isPasswordValid);

    const storeOnlineStatus = async () => {
        //console.log('saving online status ...');
        if(isFormValid){
            try {
                const userEmail = await AsyncStorage.getItem('userEmail');
                const userPassword = await AsyncStorage.getItem('userPassword'); 
                if(userEmail == email && userPassword == password){    
                    try {
                        await AsyncStorage.setItem(
                            'userLoggedIn', 'true'
                        )
                        updateIsLoggedIn(true);
                        //console.log('saved firstopen data');
                    } catch (error) {
                    //saving error
                        console.log('error saving online status: ', error);  
                    }
                } else {
                    //console.log('invalid login creds');
                    Alert.alert('Invalid Email & Password', 'Please try again with valid email and password.')
                }
            } catch (error) {
            //retrieving error
            console.log('error retreiving login creds: ', error);
            }
        } else {
            Alert.alert('Recheck your information', 'Please check email and password for typos.');
        };
      };


    return (
        <View style={styles.container}>
            <WelcomeHeader />
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
                <View style={styles.main}>
                    <Text style={{fontWeight: 'bold', paddingBottom: 5}}>New Customer?</Text>
                    <Pressable
                        onPress={ () => {
                            navigation.navigate('Onboarding')}
                        }
                        style={styles.mainButton}
                    >
                        <Text style={styles.mainButtonText}>Sign Up</Text>
                    </Pressable>
                </View>
                <Pressable
                    onPress={ () => {
                        storeOnlineStatus()
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
        width: 300,
        marginVertical: 24,
        borderRadius: 8,
        borderWidth: 1,
        padding: 10,
        fontSize: 16,
        borderColor: '#EDEFEE',
    },
    button: {
        width: 150,
        height: 50,
        borderRadius: 8,
        backgroundColor: '#495E57',
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 10,
        alignSelf: 'flex-end',
        marginTop: 100,
    },
    buttonDisabled: {
        backgroundColor: 'grey',
        opacity: 0.5,
    },
    buttonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },
    mainButton: {
        backgroundColor: '#F4CE14',
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 10,
        width: 200,
        height: 50,
        borderRadius: 8,
    },
    mainButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
    },

});