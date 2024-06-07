import { View, Text, Pressable, Image, StyleSheet } from "react-native";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const backIcon = 'https://github.com/cltacker13/little-lemon/blob/master/assets/whitebackarrow.png?raw=true';
const logoImage = 'https://github.com/cltacker13/little-lemon/blob/master/assets/ll-images/Logo.png?raw=true';
const tillyImage = 'https://github.com/cltacker13/little-lemon/blob/master/assets/ll-images/Profile.png?raw=true';
const bagCartIcon = 'https://github.com/cltacker13/little-lemon/blob/master/assets/ll-images/Delivery%20van.png?raw=true';

export function MainHeader({navigation}){
    //const { updateIsLoggedIn } = route.params;
    const [uriExists, updateUriExists] = useState(false);
    const [profileInitials, updateInitials] = useState(':D');
    const [profileImage, updateImage] = useState(tillyImage);

    const retrieveUserProfileData = async () => {
        //console.log('retrieving header user data');
        try {
            const userProfileImageURI = await AsyncStorage.getItem('userProfileImage');
            const userFirstName = await AsyncStorage.getItem('firstName');
            const userLastName = await AsyncStorage.getItem('lastName');
            //console.log(userProfileImageURI);
            if(userProfileImageURI != '' && userProfileImageURI != null){
                updateUriExists(true);
                updateImage(userProfileImageURI);
            }
            if(userLastName != '' && userLastName != null){
                updateInitials(userFirstName.charAt(0)+userLastName.charAt(0));
            }else{
                updateInitials(userFirstName.charAt(0));
            }
        } catch (error) {
            console.log('retrieving header user data:', error)
        }
    }
    retrieveUserProfileData();
    //console.log('logo:',logo);
    return(
        <View style={styles.header}>
            <Pressable onPress={ () => {
                    navigation.navigate('Home')}
                }
                style={styles.navIcon}
            >
                <View style={styles.menuInnerSymbol}></View>
            </Pressable>
            <View style={styles.imageContainer}>
                <Image source={{uri: logoImage}}
                    style={styles.logo}/>
            </View>
            <Pressable onPress={ () => {
                    navigation.navigate('Profile')}
                }
                style={styles.profileIcon}
            >
                {uriExists ?
                    ( <Image style={styles.profileIcon} 
                        source={{uri: profileImage}}
                     />
                    ) :
                    ( <Text style={styles.profileIconText}>{profileInitials}</Text>
                    )}
            </Pressable>
            <CartIcon navigation={navigation}/>
        </View>
    )
}

export function BackHeader({navigation}){
    const back = `<-`;
    const [uriExists, updateUriExists] = useState(false);
    const [profileInitials, updateInitials] = useState(':D');
    const [profileImage, updateImage] = useState(tillyImage);

    const retrieveUserProfileData = async () => {
        //console.log('retrieving header user data');
        try {
            const userProfileImageURI = await AsyncStorage.getItem('userProfileImage');
            const userFirstName = await AsyncStorage.getItem('firstName');
            const userLastName = await AsyncStorage.getItem('lastName');
            //console.log(userProfileImageURI);
            if(userProfileImageURI != '' && userProfileImageURI != null){
                updateUriExists(true);
                updateImage(userProfileImageURI);
            }
            if(userLastName != '' && userLastName != null){
                updateInitials(userFirstName.charAt(0)+userLastName.charAt(0));
            }else{
                updateInitials(userFirstName.charAt(0));
            }
        } catch (error) {
            console.log('retrieving header user data error:', error)
        }
    }
    retrieveUserProfileData();
    return(
        <View style={styles.header}>
            <Pressable onPress={ () => {
                    navigation.goBack()}
                }
                style={styles.backIcon}
            >
                <Image source={{uri: backIcon}}
                    style={styles.backImage}/>
            </Pressable>
            <View style={styles.imageContainer}>
                <Image source={{uri: logoImage}}
                    style={styles.logo}/>
            </View>
            <Pressable onPress={ () => {
                    navigation.navigate('Profile')}
                }
                style={styles.profileIcon}
            >
                {uriExists ?
                    ( <Image style={styles.profileIcon} 
                        source={{uri: profileImage}}
                     />
                    ) :
                    ( <Text style={styles.profileIconText}>{profileInitials}</Text>
                    )}
            </Pressable>
            <CartIcon navigation={navigation}/>
        </View>
    )
}

export function WelcomeHeader(){

    return(
        <View style={styles.header}>
            
            <View style={styles.imageContainer}>
                <Image source={{uri: logoImage}}
                    style={styles.logo}/>
            </View>
            
        </View>
    )
}

export function WelcomeBackHeader({navigation}){
    //const back = `<-`;

    return(
        <View style={styles.header}>
            <Pressable onPress={ () => {
                    navigation.goBack()}
                }
                style={styles.backIcon}
            >
                <Image source={{uri: backIcon}}
                    style={styles.backImage}/>
            </Pressable>
            <View style={styles.imageContainer}>
                <Image source={{uri: logoImage}}
                    style={styles.logo}/>
            </View>
            <View style={styles.blankProfileIcon}></View>
        </View>
    )
}

export function CartIcon({navigation}){
    const [cartCount, updateCartCount] = useState(0);
    const retrieveUserCartData = async () => {
        //console.log('retrieving header Cart data');
        try {
            const userCartItems = await AsyncStorage.getItem('userCartItems');
            //console.log('header CartItems:',userCartItems);
            if(userCartItems !== null && userCartItems !== ''){
                const listArr = userCartItems.split(';').filter((item) => item != "");
                //console.log('header CartItems Arr:',listArr);
                let itemCount = 0;//listArr.length;
                for(i=0;i<listArr.length;i++){
                    let cartItemQuantity = Number(listArr[i].split('|x|')[1]);
                    itemCount = (itemCount+cartItemQuantity);
                }
                //console.log('itemCount:',itemCount);
                updateCartCount(itemCount)
            }else{
                updateCartCount(0);
            }
        } catch (error) {
            console.log('retrieving header Cart data:', error)
        }
    }
    retrieveUserCartData();

    return(
        <View>
            {(cartCount > 0) ? (
            <Pressable onPress={ () => {
                    navigation.navigate('Cart')}
                }
                style={styles.cartView}
            >
                <Image source={{uri: bagCartIcon}}
                    style={styles.cartIcon}/> 
                <View style={styles.cartBubble}>
                    <Text style={styles.cartBubbleText}>{cartCount}</Text>
                </View>
            </Pressable>
            ) : (<View></View>)
            }  
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: '#fff',
    },
    header: {
        justifyContent: 'space-evenly',
        alignItems: 'center',
        alignContent: 'center',
        flexDirection: 'row',
        marginTop: 10,
        marginBottom: 15,//25,
    },
    navButton: {
        alignSelf: 'flex-start',
        width: 50,
        height: 50,
    },
    navIcon:{
        width: 49,
        height: 45,
        marginTop: 5,
        alignSelf: 'flex-start',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#495E57',
    },
    menuInnerSymbol: {
        height: 28,
        width: 49,
        borderTopWidth: 10,
        borderBottomWidth: 10,
        borderTopColor: 'white',
        borderBottomColor: 'white',
    },
    backIcon: {
        width: 50,
        height: 50,
        padding: 5,
        borderRadius: 26,
        alignSelf: 'flex-start',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#495E57',
    }, 
    backArrow: {
        /*borderColor: 'white',
        borderLeftWidth: 0,
        borderTopWidth: 8,
        borderBottomWidth: 8, 
        borderRightWidth: 0,
        borderRadius: 5,
        padding: 0,*/
        fontSize: 25,
        textAlign: 'center',
        textAlignVertical: 'center',
        paddingBottom: 5,
        color: 'white',
        fontWeight: 'bold',
    },
    backImage: {
        width: 30,
        height: 30,
        borderRadius: 26,
        resizeMode: 'contain'
    },
    imageContainer: {
        //alignItems: 'center',
        alignSelf: 'center',
        //backgroundColor: '#F4CE14',
        height: 50,
        width: 250,
        //borderColor: '#F4CE14',
        //borderWidth: 1,
    },
    logo: {
        height: 50,
        width: 250,
        resizeMode: 'contain',
        //overflow: 'visible'
        //marginBottom: 32,
    },
    blankProfileIcon: {
        width: 50,
        height: 50,
        borderRadius: 26,
        alignSelf: 'flex-end',
        alignItems: 'center',
        justifyContent: 'center',
    },
    profileIcon: {
        width: 50,
        height: 50,
        borderRadius: 26,
        alignSelf: 'flex-end',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#495E57',//'#EE9972',//'green',
    },
    profileIconText: {
        fontSize: 20,
        color: 'white',
        fontWeight: 'bold',
    },
    cartView:{
        alignItems: 'flex-end',
        flexDirection: 'row',
        alignContent: 'flex-end',
        marginLeft: 10,//265,
        marginTop: 15,
        //marginBottom: 2,
        
    },
    cartIcon: {
        width: 30,
        height: 40,
        resizeMode: 'contain',
        borderRadius: 26,
    },
    cartBubble: {
        width: 24,
        height: 24,
        borderRadius: 26,
        alignSelf: 'flex-end',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#495E57',
    },
    cartBubbleText: {
        fontSize: 14,
        color: 'white',
        fontWeight: 'bold',
    }
})