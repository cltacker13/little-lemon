import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { validateName, validateEmail } from '../utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { localData, retrieveAllLocalData } from '../utils/localData';

export default function OnboardingScreen({navigation}){
    console.log('Onboarding Screen');
    retrieveAllLocalData();
    const [firstName, onChangeFirstName] = useState('');
    const [email, onChangeEmail] = useState('');
    const isFirstNameValid = validateName(firstName);
    const isEmailValid = validateEmail(email);
    const isFormValid = (isFirstNameValid && isEmailValid);

    const storeData = async () => {
        console.log('saving sign up data...');
        try {
          await AsyncStorage.multiSet(
            [['firstName', firstName],
            ['userEmail', email]]
          )
          console.log('onboarding data saved for',firstName);
          navigation.navigate('SignUp');
        } catch (error) {
          //saving error
          console.log('saving error at onboarding:', error);
        }
      };

    const inlineEmailValidation = () => {
        if(!isEmailValid){
            Alert.alert('Email is Invalid', 'Please enter another email address. Example: user@website.com.');
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.imageContainer}>
                    <Image source={require('./assets/Logo.png')} 
                    style={styles.logo}/>
                </View>
            </View>
            <View style={styles.main}>

                <Text style={styles.h1}>Welcome!</Text>
                <Text style={styles.h2}>Let us get to know you</Text>
                <View style={styles.form}>
                    <Text style={styles.inputLabel}>First Name</Text>
                    <TextInput 
                        style={styles.inputBox}
                        value={firstName}
                        onChangeText={onChangeFirstName}
                        placeholder={'Type your first name'}
                        keyboardType="default"
                        textContentType="givenName"
                    />
                    <Text style={styles.inputLabel}>Email Address</Text>
                    <TextInput 
                        style={styles.inputBox}
                        value={email}
                        onChangeText={onChangeEmail}
                        placeholder={'Type your email'}
                        keyboardType="email-address"
                        textContentType="emailAddress"
                        onEndEditing={inlineEmailValidation}
                    />
                </View>

                <View style={styles.main}>
                    <Text>Already have an account?</Text>
                    <Pressable
                        onPress={ () => {
                            navigation.navigate('LogIn')}
                        }
                        style={styles.mainButton}
                    >
                        <Text style={styles.mainButtonText}>Log In</Text>
                    </Pressable>
                </View>

                <Pressable
                    onPress={ () => {
                        console.log(firstName, email),
                        storeData()}
                    }
                    style={[styles.button, !isFormValid && styles.buttonDisabled]}
                >
                    <Text style={styles.buttonText}>Next</Text>
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
        paddingBottom: 50,
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
        fontWeight: 'bold',
        color: 'white',
    },
    mainButton: {
        backgroundColor: '#F4CE14',
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 10,
        width: 250,
        borderRadius: 8,
    },
    mainButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black',
    },

});