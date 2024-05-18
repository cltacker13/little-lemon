import { View, Pressable, Image, Text, StyleSheet } from "react-native"
import { BackHeader } from "./components/Header";

export default function ItemScreen({navigation, route}){
    console.log('Item Details Screen');
    const item = route.params.item;
    console.log(item);

    return (
        <View style={styles.container}>
            <BackHeader navigation={navigation}/>
            <View style={styles.main}>
                <Text>Item Screen</Text>
                <Text style={styles.h1}>{item.title}</Text>
                <Text style={styles.h2}>${item.price}</Text>
            </View>
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
        //alignItems: 'center',
        //justifyContent: 'center',
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
})