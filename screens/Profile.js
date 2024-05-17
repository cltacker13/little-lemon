import { useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import CheckBox from 'expo-checkbox';
import { localData, clearLocalData } from '../utils/localData';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { validateName, validateEmail, validateUSPhone } from '../utils';
import { MainHeader } from './components/Header';

export default function ProfileScreen({navigation, route}){
    console.log('Profile Screen');

    const { updateIsLoggedIn } = route.params;
    //retrieved values
    const [fname, updateFname] = useState('');
    const [lname, updateLname] = useState('');
    const [mail, updateMail] = useState('');
    const [num, updateNum] = useState('');
    console.log('at load retrieved:',fname,lname,mail,num);
    //form edits
    const [firstName, onChangeFirstName] = useState(fname);
    const [lastName, onChangeLastName] = useState(lname);
    const [email, onChangeEmail] = useState(mail);
    const [phone, onChangePhone] = useState(num);
    console.log('at load form:',firstName,lastName,email,phone);
    const [orderStatus, toggleOrderStatus] = useState(true);
    const [passwordChanges, togglePasswordChanges] = useState(true);
    const [specialOffers, toggleSpecialOffers] = useState(true);
    const [newsletter, toggleNewsletter] = useState(true);
    /*const [notifications, updateNotifications] = useState({
        orderStatus: true,
        passwordChanges: true,
        specialOffers: true,
        newsletter: true,
    });*/

    const isFirstNameValid = (firstName != '' && validateName(firstName));
    const isLastNameValid = (lastName != '' && validateName(lastName));
    const isEmailValid = (email != '' && validateEmail(email));
    const isPhoneValid = (phone != '' && validateUSPhone(phone));
    const isFormValid = (isFirstNameValid && isLastNameValid && isEmailValid && isPhoneValid);
    //validation for phone number format is an issue.
    console.log(phone,num,validateUSPhone(phone));
    console.log(isFirstNameValid, isLastNameValid, isEmailValid, isPhoneValid);
    console.log('Form Valid:',isFormValid);
    /*if(firstName != '' || lastName != '' || email != '' || phone != ''){
        (isFirstNameValid && isLastNameValid && isEmailValid && isPhoneValid);    
    };*/

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
            console.log('user profile:', userFirstName, userLastName, userEmail, userPhone)
        } catch (error) {
            console.log('retrieving user profile data error:', error)
        }
    }
    const storeAllUserProfileData = async () => {
        console.log('storing all profile data');
        console.log('setting values:', firstName, lastName, email, phone)
        if(firstName != '' || lastName != '' || email != '' || phone != ''){
           //edits made 
           try {
                firstName != '' ? await AsyncStorage.setItem('firstName', firstName) : console.log('no first name change');
                lastName != '' ? await AsyncStorage.setItem('lastName', lastName) : console.log('no last name change');
                email != '' ? await AsyncStorage.setItem('userEmail', email) : console.log('no email change');
                phone != '' ? await AsyncStorage.setItem('phoneNumber', phone) : console.log('no phone number change');
                
                Alert.alert('Updated','Changes have been saved.')
                
            } catch (error) {
                console.log('error storing user profile data:', error)
            }
        }else{
            console.log('No changes to save.');
        };
    }
    
    function clearFormChanges(){
        //clearing form changes.
        console.log('clearing form changes.')
        onChangeFirstName(fname);
        onChangeLastName(lname);
        onChangeEmail(mail);
        onChangePhone(num);
    }


    retrieveUserProfileData();

    return (
        <ScrollView style={styles.container}>
            <MainHeader navigation={navigation} route={route}/>
            <View style={styles.main}>
                <Text style={styles.h1}>Personal Information</Text>
                <View style={styles.avatarSection}>
                    <Text style={styles.inputLabel}>Avatar</Text>
                    <View style={styles.buttonRow}>
                        <View style={styles.avatarIcon}></View>
                        <Pressable onPress={ () => {
                                console.log('update Avatar icon');
                                }
                            }
                            style={styles.updateButton}
                            >
                            <Text style={styles.updateButtonText}>Update</Text>
                        </Pressable>
                        <Pressable onPress={ () => {
                                console.log('remove Avatar icon');
                                }
                            }
                            style={styles.cancelButton}
                            >
                            <Text style={styles.cancelButtonText}>Remove</Text>
                        </Pressable>
                    </View>
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
                    <View style={styles.checkboxRow}>
                        <CheckBox
                            value={orderStatus}
                            onValueChange={toggleOrderStatus}
                            color={'#495E57'}
                            style={styles.checkbox}
                        />
                        <Text style={styles.inputLabel}>Order Status</Text>
                    </View>
                    <View style={styles.checkboxRow}>
                        <CheckBox
                            value={passwordChanges}
                            onValueChange={togglePasswordChanges}
                            color={'#495E57'}
                            style={styles.checkbox}
                        />
                        <Text style={styles.inputLabel}>Password Changes</Text>
                    </View>
                    <View style={styles.checkboxRow}>
                        <CheckBox
                            value={specialOffers}
                            onValueChange={toggleSpecialOffers}
                            color={'#495E57'}
                            style={styles.checkbox}
                        />
                        <Text style={styles.inputLabel}>Special Offers</Text>
                    </View>
                    <View style={styles.checkboxRow}>
                        <CheckBox
                            value={newsletter}
                            onValueChange={toggleNewsletter}
                            color={'#495E57'}
                            style={styles.checkbox}
                        />
                        <Text style={styles.inputLabel}>Newsletter</Text>
                    </View>
                    <View style={styles.buttonRow}>
                        <Pressable onPress={ () => {
                                clearFormChanges()
                                }
                            }
                            style={[styles.cancelButton]}//, !isFormValid && styles.buttonDisabled]}
                            >
                            <Text style={styles.cancelButtonText}>Discard Changes</Text>
                        </Pressable>
                        <Pressable onPress={ () => {
                                storeAllUserProfileData()
                                }
                            }
                            style={[styles.updateButton, !isFormValid && styles.buttonDisabled]}
                            >
                            <Text style={styles.updateButtonText}>Save Changes</Text>
                        </Pressable>
                    </View>
                </View>
                <View style={styles.buttonRow}>
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
        alignItems: 'flex-start',
        justifyContent: 'center',
        marginBottom: 50,
        flexDirection: 'column',
    },
    buttonRow: {
        marginVertical: 10,
        flexDirection: 'row',
        //alignContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        //justifyContent: 'center',
        maxHeight: 100,
    },
    checkboxRow: {
        marginVertical: 10,
        flexDirection: 'row',
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
    avatarSection: {
        /*justifyContent: 'space-evenly',
        alignItems: 'flex-start',
        //alignContent: 'flex-start',
        flexDirection: 'row',
        padding: 10,*/
    },
    avatarIcon: {
        margin: 5,
        width: 80,
        height: 80,
        borderRadius: 50,
        alignSelf: 'flex-start',
        //alignItems: 'center',
        //justifyContent: 'center',
        backgroundColor: 'green',
    },
    form: {
        paddingTop: 25,
        paddingBottom: 25,
    },
    inputLabel: {
        //fontFamily: 'karla',
        fontSize: 16,
    },
    inputBox: {
        height: 40,
        width: 350,
        marginVertical: 24,
        borderRadius: 8,
        borderWidth: 1,
        padding: 10,
        fontSize: 16,
        borderColor: '#EDEFEE',
    },
    checkbox: {
        alignSelf: 'flex-start',
        marginRight: 10,
        borderRadius: 3,
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
        backgroundColor: '#495E57',
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
        width: 350,
        borderRadius: 8,
    },
    mainButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black',
    },
    cancelButton: {
        backgroundColor: 'white',//'#F4CE14',//yellow
        borderColor: '#495E57',
        borderWidth: 2,
        //flexDirection: 'row',
        //alignSelf: 'flex-start',
        alignContent: 'center',
        justifyContent: 'center',
        padding: 10,
        margin: 10,
        maxWidth: 150,
        maxHeight: 45,
        borderRadius: 8,
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black',
    },
    updateButton: {
        backgroundColor: '#495E57',
        borderColor: '#495E57',
        borderWidth: 2,
        //flexDirection: 'row',
        //alignSelf: 'flex-end',
        alignContent: 'center',
        justifyContent: 'center',
        padding: 10,
        margin: 10,
        maxWidth: 150,
        maxHeight: 45,
        borderRadius: 8,
    },
    updateButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
    },

});