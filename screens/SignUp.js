import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View, Alert } from 'react-native';
import CheckBox from 'expo-checkbox';
import { validatePassword, confirmPassword } from '../utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WelcomeBackHeader } from './components/Header';

export default function SignUpScreen({navigation, route}){
    console.log('SignUp Screen');
    const { updateIsLoggedIn } = route.params;

    const [password, onChangePassword] = useState('');
    const [passConfirm, onChangePassConfirm] = useState('');
    const [termsAgreement, toggleTermsAgreement] = useState(true);
    const isPasswordValid = validatePassword(password);
    const isPassConfirmValid = confirmPassword(password, passConfirm);
    const isFormValid = (isPasswordValid && isPassConfirmValid && termsAgreement);
    
    const storeData = async () => {
        console.log('saving sign up data...');
        if(isFormValid){
            try {
                await AsyncStorage.multiSet(
                    [['userLoggedIn', 'true'],
                    ['userPassword', password]]
                )
                updateIsLoggedIn(true);
                //console.log('sign up data saved', password);
                /*try {
                    const onlineStatus = await AsyncStorage.getItem('userLoggedIn');
                    //console.log('online status',onlineStatus);
                } catch (error) {
                    console.log('error fetching updated online status:', error);
                }*/
                //navigation.navigate('Profile'); 
            } catch (error) {
            //saving error
            console.log('saving error at sign up:', error);
            }
        } else {
            Alert.alert('Recheck your information', 'Please check both password entries for typos.');
        }
      };

    const inlinePasswordValidation = () => {
        if(!isPasswordValid){
            Alert.alert('Try another password', 'Password should be 8-16 characters. It must contain one digit from 1 to 9, one lowercase letter, one uppercase letter, one special character, and no spaces.');
        }
    }
    const inlinePasswordCheckValidation = () => {
        if(!isPasswordValid){
            Alert.alert('Passwords must match', 'Please try typing password again. Passwords must match.');
        }
    }

    return (
        <View style={styles.container}>
            <WelcomeBackHeader navigation={navigation} />
            <View style={styles.main}>
                <Text style={styles.h1}>Welcome!</Text>
                <Text style={styles.h2}>Create a Password</Text>
                <View style={styles.form}>
                    <Text style={styles.inputLabel}>Password</Text>
                    <TextInput 
                        style={styles.inputBox}
                        value={password}
                        onChangeText={onChangePassword}
                        placeholder={'Type your password'}
                        keyboardType="default"
                        textContentType="password"
                        secureTextEntry={true}
                        onEndEditing={inlinePasswordValidation}
                    />
                    <Text style={styles.inputLabel}>Confirm Password</Text>
                    <TextInput 
                        style={styles.inputBox}
                        value={passConfirm}
                        onChangeText={onChangePassConfirm}
                        placeholder={'Retype your password'}
                        keyboardType="default"
                        textContentType="password"
                        secureTextEntry={true}
                        onEndEditing={inlinePasswordCheckValidation}
                    />
                </View>
                <View style={styles.checkboxRow}>
                    <CheckBox
                        value={termsAgreement}
                        onValueChange={toggleTermsAgreement}
                        color={'#495E57'}
                        style={styles.checkbox}
                    />
                    <Text style={styles.inputLabel}>I have read and agree with the Terms of Use and Privacy Policy.</Text>
                </View>
                <Pressable
                    onPress={ () => {
                        //console.log(password, passConfirm),
                        storeData()
                        }
                    }
                    style={[styles.button, !isFormValid && styles.buttonDisabled]}
                >
                    <Text style={styles.buttonText}>Sign Up</Text>
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
    checkboxRow: {
        marginVertical: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'flex-start',
        width: 300,
        marginBottom: 25,
        marginTop: 160,
    },
    checkbox: {
        alignSelf: 'flex-start',
        marginRight: 12,
        borderRadius: 3,
    },   

});