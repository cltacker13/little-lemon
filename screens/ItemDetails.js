import { View, Pressable, Image, Text, StyleSheet } from "react-native"
import { BackHeader } from "./components/Header";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ItemScreen({navigation, route}){
    console.log('Item Details Screen');
    const item = route.params.item;
    const [quantity, updateQuantity] = useState(1);
    //console.log(item);

    if(quantity<1){
        updateQuantity(1);
    };

    const addItemToCart = async () => {
        console.log('Adding to cart:',`${item.id}|x|${quantity}`);
        
        let cartList = ''; //`${item.id}|x|${quantity}`;
        try {
            //remove items in cart, for testing
            //await AsyncStorage.removeItem('userCartItems');

            const userCartItems = await AsyncStorage.getItem('userCartItems');
            console.log('itemDetails= get userCartItems:', userCartItems)
            if(userCartItems !== null && userCartItems !== ''){
                const listArr = userCartItems.split(';').filter((item) => item != "");
                console.log('async existing items in cart: ',listArr);
                const idsArr = [];
                for(i=0;i<listArr.length;i++){
                    console.log('listArr loop')
                    let cartItemID = listArr[i].split('|x|')[0];
                    let cartItemQuantity = Number(listArr[i].split('|x|')[1]);
                    console.log('cartItemID:',cartItemID,'vs idsArr:',idsArr,'vs item.id:',item.id);
                    //checking for duplicate item ids.
                    if(cartItemID != item.id){//!idsArr.includes(item.id) && !idsArr.includes(cartItemID)){
                        //add if not dup
                        idsArr.push(cartItemID);
                        console.log('id array:',idsArr)
                        cartList += `${cartItemID}|x|${cartItemQuantity};`;
                        console.log('cartList in loop if not matched:',cartList)
                    }else{
                        //dup item id was found
                        let newQuantity = (Number(cartItemQuantity)+quantity);
                        console.log(cartItemID,'already exists in item list; adding',quantity,'to',cartItemQuantity,'=',newQuantity);
                        cartList += `${cartItemID}|x|${newQuantity};`;
                    }
                    //console.log(`item#${i+1}:`,cartItemDetails, 'x', cartItemQuantity);
                }
                console.log('final cartList:',cartList);
                await AsyncStorage.setItem('userCartItems',`${cartList}`)
            }else{
                let newItem = `${item.id}|x|${quantity}`;
                console.log(`Adding: ${newItem}`)
                await AsyncStorage.setItem('userCartItems',newItem)
            }
            navigation.navigate('Cart',{item,quantity})
        } catch (error) {
            //Error retrieving cart items
            console.log('error retrieving existing cart items to Add: ', error);
        }


    };

    return (
        <View style={styles.container}>
            <BackHeader navigation={navigation}/>
            <View style={styles.main}>
                <View style={styles.item} >
                    <Image style={styles.itemImage} 
                        source={{uri: `https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/${item.image}?raw=true`}} />
                    <View style={styles.itemText}>
                        <View style={styles.itemHead}>
                            <Text style={styles.title}>{item.name}</Text>
                            <Text style={styles.itemPrice}>${item.price}</Text>
                        </View>
                        <Text style={styles.itemDesc}>{item.description}</Text>
                    </View>
                </View>
                <View >
                    <View style={styles.buttonRow}>
                        <Pressable onPress={ () => {
                                //console.log('Minus'),
                                updateQuantity(quantity-1)
                                }
                            }
                            style={styles.quantityButton}
                        >
                            <Text style={styles.quantityButtonText}>-</Text>
                        </Pressable>
                        <Text style={styles.quantityButtonText}>{quantity}</Text>
                        <Pressable onPress={ () => {
                                //console.log('Plus'),
                                updateQuantity(quantity+1)
                                }
                            }
                            style={styles.quantityButton}
                        >
                            <Text style={styles.quantityButtonText}>+</Text>
                        </Pressable>
                    </View>
                    <View style={styles.buttonRow}>
                        <Pressable onPress={ () => {
                                console.log(`Adding ${quantity} ${item.name} to Cart`),
                                addItemToCart()
                                }
                            }
                            style={styles.mainButton}
                        >
                            <Text style={styles.mainButtonText}>Add to Cart</Text>
                        </Pressable>
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
        height: 550,
    },
    itemText: {
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    itemHead: {
        flexDirection: 'row',
    },
    title: {
        fontSize: 20,
        color: 'black',
        fontWeight: 'bold',
        width: 275,
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
      //fontSize: 16,
      //color: 'black',
      paddingVertical: 5,
      //borderWidth: 1,
      //borderColor: 'black',
      height: 350,
      width: 400,
      alignSelf: 'center',
      marginBottom: 25,
    },
    buttonRow: {
        marginVertical: 10,
        flexDirection: 'row',
        //alignContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        //justifyContent: 'center',
        maxHeight: 100,
        marginTop: 15,
    },
    quantityButton: {
        height: 50,
        width: 50,
        alignContent: 'center',
        justifyContent: 'center',
        marginHorizontal: 15,
    },
    quantityButtonText: {
        fontSize: 26,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    mainButton: {
        backgroundColor: '#F4CE14',
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 10,
        width: 300,
        height: 50,
        borderRadius: 8,
        marginTop: 15,
    },
    mainButtonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
    },
})