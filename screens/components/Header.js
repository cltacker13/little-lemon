import { View, Text, Pressable, Image, StyleSheet } from "react-native"

export function MainHeader({navigation, route}){
    const { updateIsLoggedIn } = route.params;

    return(
        <View style={styles.header}>
            <Pressable onPress={ () => {
                    navigation.navigate('Home')}
                }
                style={styles.profileIcon}
            >
                <Text style={styles.buttonText}>Nav</Text>
            </Pressable>
            <Image source={require('../assets/Logo.jpg')} 
            style={styles.logo}/>
            <Pressable onPress={ () => {
                    navigation.navigate('Profile')}
                }
                style={styles.profileIcon}
            >
                <Text style={styles.buttonText}>You</Text>
            </Pressable>
        </View>
    )
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
        //overflow: 'visible'
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
})