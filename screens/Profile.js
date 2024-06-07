import { useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import CheckBox from 'expo-checkbox';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { validateName, validateEmail, validateUSPhone } from '../utils';
import { BackHeader } from './components/Header';

export default function ProfileScreen({navigation, route}){
    //console.log('Profile Screen');

    const { updateIsLoggedIn } = route.params;

    //retrieved values
    const [image, updateImage] = useState('');
    const [fname, updateFname] = useState('');
    const [lname, updateLname] = useState('');
    const [mail, updateMail] = useState('');
    const [num, updateNum] = useState('');
    const [not1, updateNot1] = useState(true);
    const [not2, updateNot2] = useState(true);
    const [not3, updateNot3] = useState(true);
    const [not4, updateNot4] = useState(true);
    //console.log('at load retrieved:',fname,lname,mail,num,image);
    //console.log('at load retrieved:',notifications);
    //form edits
    const [firstName, onChangeFirstName] = useState(fname);
    const [lastName, onChangeLastName] = useState(lname);
    const [email, onChangeEmail] = useState(mail);
    const [phone, onChangePhone] = useState(num);
    //console.log('at load form:',firstName,lastName,email,phone);
    //console.log('initial notifications:',not1,not2,not3,not4)
    //TODO fix bug: not# values do not load from Async correctly on initial load.
    const [orderStatus, toggleOrderStatus] = useState(not1);
    const [passwordChanges, togglePasswordChanges] = useState(not2);
    const [specialOffers, toggleSpecialOffers] = useState(not3);
    const [newsletter, toggleNewsletter] = useState(not4);
    //form validation toggles save button option
    const isFirstNameValid = (firstName != '' ? validateName(firstName) : validateName(fname));
    const isLastNameValid = (lastName != '' ? validateName(lastName) : validateName(lname));
    const isEmailValid = (email != '' ? validateEmail(email) : validateEmail(mail));
    const isPhoneValid = (phone != '' ? validateUSPhone(phone) : validateUSPhone(num));
    const isFormValid = (isFirstNameValid && isLastNameValid && isEmailValid && isPhoneValid);
    //console.log(phone,num,validateUSPhone(phone),isFormValid);
    //console.log(isFirstNameValid, isLastNameValid, isEmailValid, isPhoneValid);
    //console.log('Form Valid:',isFormValid);

    //newly selected profile image.
    const [avatarImage, setAvatarImage] = useState(null);
    //console.log(image,'  | Vs |  ',avatarImage);

    const inlineEmailValidation = () => {
        if(!isEmailValid){
            Alert.alert('Email is Invalid', 'Please enter another email address. Example: user@website.com.');
        }
    }

    const updatePhoneFormat = () => {
        let n = '';
        let formated = '';
        //console.log('phone.length',phone.length)
        if(phone != '' && !isPhoneValid){
            for(i=0;i<phone.length;i++){
                //console.log(phone[i]);
                var regex = /^[0-9]$/
                if(regex.test(phone[i])){
                    n += phone[i];
                }
            }
            //console.log('n.length:',n.length);
            if(n.length == 10){
                formated = `+1(${n.charAt(0)}${n.charAt(1)}${n.charAt(2)})${n.charAt(3)}${n.charAt(4)}${n.charAt(5)}-${n.charAt(6)}${n.charAt(7)}${n.charAt(8)}${n.charAt(9)}`;
                onChangePhone(formated);
                //console.log(isPhoneValid);
            }
            if(n.length == 11 && n.charAt(0) == '1'){
                formated = `+${n.charAt(0)}(${n.charAt(1)}${n.charAt(2)}${n.charAt(3)})${n.charAt(4)}${n.charAt(5)}${n.charAt(6)}-${n.charAt(7)}${n.charAt(8)}${n.charAt(9)}${n.charAt(10)}`;
                onChangePhone(formated);
                //console.log(isPhoneValid);
            }
            //console.log('cleaned num',n,'|');
            
        }else {
            Alert.alert('Phone Number is Invalid', 'Please enter 10 digit US phone number.')
        }
    }

    const pickImage = async () => {
        let selection = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4,4],
            quality: 1,
        });
        //console.log(selection.assets[0].uri);
        if(!selection.canceled){
            setAvatarImage(selection.assets[0].uri);
            //save to Async & set to nav profile icon too
            storeProfileImage(selection.assets[0].uri);
            updateImage(selection.assets[0].uri);
        }else if(selection.canceled){
            console.log('image selection canceled.')
        }
    };
    //need to store image uri in a retrievable way, does not display on fresh load.
    const storeProfileImage = async (fileURI) => {
        const uri = `${fileURI}`;
        //console.log('storing Image uri...');
        //console.log(image,'  | Vs |  ',avatarImage);
        try {
            await AsyncStorage.setItem('userProfileImage',uri);
        } catch (error) {
            //storing Image error
            console.log('error storing image uri: ', error);
        }
    };
    const clearProfileImage = async () => {
        //console.log('clearing Image uri...');
        try {
            storeProfileImage('');
            updateImage('');
            setAvatarImage('');
        } catch (error) {
            //clearing Image error
            console.log('error clearing image uri: ', error);
        }
    };
    const storeOfflineStatus = async () => {
        //console.log('clearing data...');
        try {
            await AsyncStorage.clear();
            //await AsyncStorage.setItem('userLoggedIn','false');
        } catch (error) {
            //clearing error
            console.log('clearing data error: ', error);
        }
    };
    const retrieveUserProfileData = async () => {
        //console.log('retrieving User Profile Data');
        try {
            //const firstOpenComplete = await AsyncStorage.getItem('firstOpenComplete');
            //const userLoggedIn = await AsyncStorage.getItem('userLoggedIn');
            const userProfileImageURI = await AsyncStorage.getItem('userProfileImage');
            const userFirstName = await AsyncStorage.getItem('firstName');
            const userLastName = await AsyncStorage.getItem('lastName');
            const userEmail = await AsyncStorage.getItem('userEmail');
            const userPhone = await AsyncStorage.getItem('phoneNumber');
            //const userPassword = await AsyncStorage.getItem('userPassword');
            const userOrderStatus = await AsyncStorage.getItem('orderStatus');
            const userPasswordChanges = await AsyncStorage.getItem('passwordChanges');
            const userSpecialOffers = await AsyncStorage.getItem('specialOffers');
            const userNewsletter = await AsyncStorage.getItem('newsletter');
            updateImage(userProfileImageURI);
            updateFname(userFirstName); 
            updateLname(userLastName);
            updateMail(userEmail);
            userPhone ? (updateNum(userPhone)) : updateNum('');//+1(###)###-###
            //console.log(typeof userNewsletter, userNewsletter, typeof not4, not4, typeof newsletter, newsletter)
            //console.log('notifications1:[',userOrderStatus,userPasswordChanges,userSpecialOffers,userNewsletter,'][',not1,not2,not3,not4,']');
            userOrderStatus ? (userOrderStatus == 'false' ? updateNot1(false) : updateNot1(true)) : (updateNot1(true));
            userPasswordChanges ? (userPasswordChanges == 'false' ? updateNot2(false) : updateNot2(true)) : (updateNot2(true));
            userSpecialOffers ? (userSpecialOffers == 'false' ? updateNot3(false) : updateNot3(true)) : (updateNot3(true));
            userNewsletter ? (userNewsletter == 'false' ? updateNot4(false) : updateNot4(true)) : (updateNot4(true));
            //console.log('updated not#s:[',not1,not2,not3,not4,']');
            //console.log('user profile:', userFirstName, userLastName, userEmail, userPhone, userProfileImageURI)
        } catch (error) {
            console.log('retrieving user profile data error:', error)
        }
    }
    const storeAllUserProfileData = async () => {
        //console.log('storing all profile data');
        //console.log('setting values:', firstName, lastName, email, phone)
        if(isFormValid && (firstName != '' || lastName != '' || email != '' || phone != '')){
           //edits made 
           try {
                firstName != '' ? await AsyncStorage.setItem('firstName', firstName) : console.log('no first name change');
                lastName != '' ? await AsyncStorage.setItem('lastName', lastName) : console.log('no last name change');
                email != '' ? await AsyncStorage.setItem('userEmail', email) : console.log('no email change');
                phone != '' ? await AsyncStorage.setItem('phoneNumber', phone) : console.log('no phone number change');
                await AsyncStorage.setItem('orderStatus', `${orderStatus}` );
                await AsyncStorage.setItem('passwordChanges', `${passwordChanges}`);
                await AsyncStorage.setItem('specialOffers', `${specialOffers}`);
                await AsyncStorage.setItem('newsletter', `${newsletter}`);
                
                Alert.alert('Updated','Changes have been saved.');
            } catch (error) {
                console.log('error storing user profile data:', error)
            }
        }else{
            console.log('No changes to save.');
        };
    }
    
    function clearFormChanges(){
        //clearing form changes.
        //console.log('clearing form changes.')
        onChangeFirstName(fname);
        onChangeLastName(lname);
        onChangeEmail(mail);
        onChangePhone(num);
        toggleOrderStatus(not1);
        togglePasswordChanges(not2);
        toggleSpecialOffers(not3);
        toggleNewsletter(not4);
    }


    retrieveUserProfileData();
    let initials = fname.charAt(0)
    if(lname != '' && lname != null){
        initials = (fname.charAt(0)+lname.charAt(0));
    }

    return (
        <ScrollView style={styles.container}>
            <BackHeader navigation={navigation} />
            <View style={styles.main}>
                <Text style={styles.h1}>Personal Information</Text>
                <View style={styles.avatarSection}>
                    <Text style={styles.inputLabel}>Avatar</Text>
                    <View style={styles.buttonRow}>
                        { (image != '' && image != null) ?
                            (
                            <Image source={{uri: image}} 
                                style={styles.avatarIcon} />
                            )
                            :(
                            <View style={styles.avatarIcon}>
                                <Text style={styles.profileInitials}>{initials}</Text>
                            </View> 
                            )
                        }
                        <Pressable onPress={ () => {
                                pickImage()
                                //console.log('update Avatar icon:',image);
                                }
                            }
                            style={styles.updateButton}
                            >
                            <Text style={styles.updateButtonText}>Change</Text>
                        </Pressable>
                        <Pressable onPress={ () => {
                                clearProfileImage()
                                //console.log('remove Avatar icon');
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
                        onEndEditing={inlineEmailValidation}
                    />
                    <Text style={styles.inputLabel}>Phone Number</Text>
                    <TextInput 
                        style={styles.inputBox}
                        value={phone == '' ? num : phone}
                        onChangeText={onChangePhone}
                        placeholder={'Type your US phone number'}
                        keyboardType="phone-pad"
                        textContentType="telephoneNumber"
                        onEndEditing={updatePhoneFormat}
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
                            style={[styles.cancelButton]}
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
                            //clearData()
                            storeOfflineStatus(),
                            updateIsLoggedIn(false)
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
        backgroundColor: '#495E57',//'green',
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
        justifyContent: 'center',
        backgroundColor: '#495E57',//'green',
    },
    profileInitials: {
        fontSize: 45,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
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
        width: 300,
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