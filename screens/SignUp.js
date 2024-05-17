import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { validatePassword, confirmPassword } from '../utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { localData } from '../utils/localData';


export default function SignUpScreen({navigation, route}){
    console.log('SignUp Screen');
    const { updateIsLoggedIn } = route.params;

    const [password, onChangePassword] = useState('');
    const [passConfirm, onChangePassConfirm] = useState('');
    const isPasswordValid = validatePassword(password);
    const isPassConfirmValid = confirmPassword(password, passConfirm);
    const isFormValid = (isPasswordValid && isPassConfirmValid);
    
    const storeData = async () => {
        console.log('saving sign up data...');
        try {
            await AsyncStorage.multiSet(
                [['userLoggedIn', 'true'],
                ['userPassword', password]]
            )
            localData.online = true;
            updateIsLoggedIn(true);
            console.log('sign up data saved', password);
            try {
                const onlineStatus = await AsyncStorage.getItem('userLoggedIn');
                console.log('online status',onlineStatus);
            } catch (error) {
                console.log('error fetching updated online status:', error);
            }
            //navigation.navigate('Profile'); 
        } catch (error) {
          //saving error
          console.log('saving error at sign up:', error);
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
                    />
                </View>
                <Pressable
                    onPress={ () => {
                        console.log(password, passConfirm),
                        storeData(),
                        updateIsLoggedIn(true)
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