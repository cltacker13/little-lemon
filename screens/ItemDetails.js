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
                <View style={styles.item} >
                    <Text style={styles.itemImage}>{item.image}</Text>
                    <View style={styles.itemText}>
                        <Text style={styles.title}>{item.name}</Text>
                        <Text style={styles.itemDesc}>{item.description}</Text>
                        <Text style={styles.itemPrice}>${item.price}</Text>
                    </View>
                </View>
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

    item: {
        flexDirection: 'column',
        //justifyContent: 'space-between',
        alignItems: 'flex-start',
        padding: 10,
    },
    itemText: {
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    title: {
        fontSize: 26,
        color: 'black',
        fontWeight: 'bold',
    },
    itemDesc: {
      fontSize: 16,
      color: 'black',
      paddingVertical: 10,
    },
    itemPrice: {
      fontSize: 20,
      color: 'black',
      fontWeight: 'bold',
    },
    itemImage: {
      fontSize: 16,
      color: 'black',
      paddingVertical: 5,
      borderWidth: 1,
      borderColor: 'black',
      height: 350,
      width: 350,
      alignSelf: 'center',
    },
})