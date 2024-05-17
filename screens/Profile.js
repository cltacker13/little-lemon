import { useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { localData, clearLocalData } from '../utils/localData';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { validateName, validateEmail, validateUSPhone } from '../utils';


export default function ProfileScreen({navigation, route}){
    console.log('Profile Screen');

    const { updateIsLoggedIn } = route.params;
    //retrieved values
    const [fname, updateFname] = useState('');
    const [lname, updateLname] = useState('');
    const [mail, updateMail] = useState('');
    const [num, updateNum] = useState('');
    //form edits
    const [firstName, onChangeFirstName] = useState(fname);
    const [lastName, onChangeLastName] = useState(lname);
    const [email, onChangeEmail] = useState(mail);
    const [phone, onChangePhone] = useState(num);
    /*const [notifications, updateNotifications] = useState({
        orderStatus: true,
        passwordChanges: true,
        specialOffers: true,
        newsletter: true,
    });*/

    const isFirstNameValid = validateName(firstName);
    const isLastNameValid = validateName(lastName);
    const isEmailValid = validateEmail(email);
    const isPhoneValid = validateUSPhone(phone);
    const isFormValid = (isFirstNameValid && isLastNameValid && isEmailValid && isPhoneValid);

    /*const clearData = async () => {
        console.log('clearing data...');
        try {
            await AsyncStorage.multiRemove(['firstOpenComplete','userLoggedIn','firstName','userEmail','userPassword']);
            clearLocalData();
            updateIsLoggedIn(false);
        } catch (error) {
            //clearing error
            console.log('clearing data error: ', error);
        }
    };*/
    const storeOfflineStatus = async () => {
        console.log('clearing data...');
        try {
            await AsyncStorage.setItem('userLoggedIn','false');
            localData.online = false;
            //clearLocalData();
        } catch (error) {
            //clearing error
            console.log('clearing data error: ', error);
        }
    };
    const retrieveUserProfileData = async () => {
        console.log('retrieving User Profile Data');
        try {
            //const firstOpenComplete = await AsyncStorage.getItem('firstOpenComplete');
            //const userLoggedIn = await AsyncStorage.getItem('userLoggedIn');
            const userFirstName = await AsyncStorage.getItem('firstName');
            const userLastName = await AsyncStorage.getItem('lastName');
            const userEmail = await AsyncStorage.getItem('userEmail');
            const userPhone = await AsyncStorage.getItem('phoneNumber');
            //const userPassword = await AsyncStorage.getItem('userPassword');
            updateFname(userFirstName);
            updateLname(userLastName);
            updateMail(userEmail);
            updateNum(userPhone);
            console.log('user profile:',userFirstName, userLastName, userEmail, userPhone)
        } catch (error) {
            console.log('retrieving user profile data error:', error)
        }
    }
    const storeAllUserProfileData = async () => {
        console.log('storing all profile data');
        console.log('setting values:', firstName, lastName, email, phone)
        //multiset function errors... idky
        try {
            await AsyncStorage.multiSet([
                ['firstName', firstName],
                ['lastName', lastName]
                ['userEmail', email],
                ['phoneNumber', phone]
            ])
        } catch (error) {
            console.log('error storing user profile data:', error)
        }
    }
    
    retrieveUserProfileData();

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Pressable onPress={ () => {
                        navigation.navigate('Home')}
                    }
                    style={styles.profileIcon}
                >
                    <Text style={styles.buttonText}>Nav</Text>
                </Pressable>
                <View style={styles.imageContainer}>
                    <Image source={require("../assets/ll-images/Logo.png")} 
                    style={styles.logo}/>
                </View>
                <Pressable onPress={ () => {
                        navigation.navigate('Profile')}
                    }
                    style={styles.profileIcon}
                >
                    <Text style={styles.buttonText}>You</Text>
                </Pressable>
            </View>
            <View style={styles.main}>
                <Text style={styles.h1}>Personal Information</Text>
                <Text>Avatar</Text>
                <View style={styles.profileIcon}>
                    <Text>You</Text>
                </View>
                <View style={styles.form}>
                    <Text style={styles.inputLabel}>First Name</Text>
                    <TextInput 
                        style={styles.inputBox}
                        value={firstName == '' ? fname : firstName}
                        onChangeText={onChangeFirstName}
                        placeholder={'Type your first name'}
                        keyboardType="default"
                        textContentType="givenName"
                    />
                    <Text style={styles.inputLabel}>Last Name</Text>
                    <TextInput 
                        style={styles.inputBox}
                        value={lastName == '' ? lname : lastName}
                        onChangeText={onChangeLastName}
                        placeholder={'Type your last name'}
                        keyboardType="default"
                        textContentType="familyName"
                    />
                    <Text style={styles.inputLabel}>Email Address</Text>
                    <TextInput 
                        style={styles.inputBox}
                        value={email == '' ? mail : email}
                        onChangeText={onChangeEmail}
                        placeholder={'Type your email'}
                        keyboardType="email-address"
                        textContentType="emailAddress"
                    />
                    <Text style={styles.inputLabel}>Phone Number</Text>
                    <TextInput 
                        style={styles.inputBox}
                        value={phone == '' ? num : phone}
                        onChangeText={onChangePhone}
                        placeholder={'Type your phone number'}
                        keyboardType="number-pad"
                        textContentType="telephoneNumber"
                    />
                    <Text style={styles.h2}>Email Notifications</Text>
                    <Text style={styles.inputLabel}>Order Status</Text>
                    <Text style={styles.inputLabel}>Password Changes</Text>
                    <Text style={styles.inputLabel}>Special Offers</Text>
                    <Text style={styles.inputLabel}>Newsletter</Text>
                    <Pressable onPress={ () => {
                            storeAllUserProfileData()
                            }
                        }
                        style={[styles.button, !isFormValid && styles.buttonDisabled]}
                        >
                        <Text style={styles.mainButtonText}>Save Changes</Text>
                    </Pressable>
                </View>
                <View>
                    <Pressable onPress={ () => {
                            //clearLocalData(),
                            //clearData()
                            storeOfflineStatus(),
                            updateIsLoggedIn(false)
                            //navigation.navigate('Onboarding')
                            }
                        }
                        style={styles.mainButton}
                    >
                        <Text style={styles.mainButtonText}>Log Out</Text>
                    </Pressable>
                </View>
            </View>
        </ScrollView>

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
        justifyContent: 'space-evenly',
        alignItems: 'center',
        alignContent: 'center',
        flexDirection: 'row',
        marginTop: 25,
        marginBottom: 25,
        //height: 150,
    },
    navButton: {
        alignSelf: 'flex-start',
        width: 50,
        height: 50,
    },  
    imageContainer: {
        //alignItems: 'center',
        alignSelf: 'center'
    },
    logo: {
        resizeMode: 'contain',
        height: 50,
        width: 250,
        //marginBottom: 32,
    },
    profileIcon: {
        width: 50,
        height: 50,
        borderRadius: 26,
        alignSelf: 'flex-end',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'green',
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