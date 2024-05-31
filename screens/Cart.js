import { View, Pressable, Image, Text, StyleSheet, Alert, FlatList } from "react-native"
import { BackHeader } from "./components/Header";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getMenuItemByID } from "../utils/database";

const ItemSepatator = () => (
    <View style={styles.itemSepatator}></View>
);
const Item = ({ /*category, id,*/ name, price, /*description,*/ image }) => (
    <View style={styles.itemCard} /*id={category} key={id}*/>
        <Image style={styles.itemImage} 
        source={{uri: `https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/${image}?raw=true`}} />
        <View style={styles.itemText}>
            <Text style={styles.title}>{name}</Text>
            <Text style={styles.itemPrice}>${price}</Text>
        </View>
    </View>
);

const formatPrice = (price) => {
    let dec = parseFloat(price).toFixed(2);
    return dec;
}

export default function CartScreen({navigation, route}){
    console.log('Cart Screen');
    const item = route.params.item;
    const itemQuantity = Number(route.params.quantity);
    const [quantity, updateQuantity] = useState(itemQuantity);
    const [itemSubtotal, updateItemSubtotal] = useState(item.price*quantity);
    const [tax, updateTax] = useState(itemSubtotal*(0.0625));
    const deliveryFee = (1.99);
    const [orderTotal, updateOrderTotal] = useState(itemSubtotal+tax+deliveryFee);
    //console.log(item);
    const [cartArr, updateCartArr] = useState([item,quantity]);

    if(quantity<1){
        updateQuantity(1);
    };

    const updatePricing = (num) => {
        let newSub = (item.price*num);
        let newTax = (newSub*(0.0625));
        let newTotal = (newSub+newTax+deliveryFee);
        updateItemSubtotal(newSub);
        updateTax(newTax);
        updateOrderTotal(newTotal);
    }

    const retrieveCartItems = async () => {
        console.log('retrieving cart items...');
        //console.log(item.id,` x${quantity};`);
        //let cartList = [[item,quantity]];
        let cartList = [{item: item, quantity: quantity}]
        try {
            const userCartItems = await AsyncStorage.getItem('userCartItems');
            console.log('getting for cart userCartItems:',userCartItems);
            //for existing items?
            if(userCartItems !== null && userCartItems !== ''){
                //console.log('async existing items in cart: ',listArr);
                const listArr = userCartItems.split(';').filter((item) => item != "");
                for(i=0;i<listArr.length;i++){
                    let cartItemID = listArr[i].split('|x|')[0];
                    let cartItemQuantity = Number(listArr[i].split('|x|')[1]);
                    let cartItemDetails = await getMenuItemByID(cartItemID);
                    //console.log(`item#${i+1}:`,cartItemDetails, 'x', cartItemQuantity);
                    //cartList.push([cartItemDetails,cartItemQuantity]);
                    cartList.push({item: cartItemDetails, quantity: cartItemQuantity})
                }
            console.log('cart cartList:',cartList);
            return cartList;
            }else{
                console.log('New cartList:',cartList)
                //Alert.alert('Oops','Your cart appears to be empty.');
            }
        } catch (error) {
            //Error retrieving cart items
            console.log('error retrieving cart items for Cart: ', error);
        }
    };

    useEffect(() => {
        (async () => {
          try {  
            let cartList = await retrieveCartItems();
            console.log('useEffect retrieved:',cartList); 
            updateCartArr(cartList);
            if(!cartList){
                console.log('useEffect retrieved nothing');
            }
          } catch (err) {
            // Handle error 
            Alert.alert(err.message); 
          } 
        })();
      }, []);

    
    return (
        <View style={styles.container}>
            <BackHeader navigation={navigation}/>
            <View style={styles.main}>
                <Text style={styles.h1}>ORDER FOR DELIVERY!</Text>
                <Text style={styles.h2}>Items in Cart</Text>
                    <View style={styles.itemRow}>
                        <FlatList //SectionList
                            style={styles.itemRow}
                            data={cartArr} //better as array of objects?
                            //sections={data}
                            keyExtractor={(item,index) => item+index} //{(item) => item.id}
                            renderItem={({ item }) => (
                                <Item //item.item.name is where value is located, but can't read on first load?
                                name={item.name} price={item.price} 
                                image={item.image}
                                />
                                /*<Item name={item.name} price={item.price} 
                                image={item.image} quantity={quantity}/>*/
                                )}
                            //ListHeaderComponent={ItemSepatator}
                            ItemSeparatorComponent={ItemSepatator}
                        />
                        
                        <View style={styles.buttonRow}>
                            <Pressable onPress={ () => {
                                    //console.log('Minus'),
                                    updateQuantity(quantity-1),
                                    updatePricing(quantity-1)
                                    }
                                }
                                style={styles.quantityButton}
                            >
                                <Text style={styles.quantityButtonText}>-</Text>
                            </Pressable>
                            <Text style={styles.quantityButtonText}>{quantity}</Text>
                            <Pressable onPress={ () => {
                                    //console.log('Plus'),
                                    updateQuantity(quantity+1),
                                    updatePricing(quantity+1)
                                    }
                                }
                                style={styles.quantityButton}
                            >
                                <Text style={styles.quantityButtonText}>+</Text>
                            </Pressable>
                        </View>
                    </View>
                    <ItemSepatator />
            
                <Pressable onPress={ () => {
                        //console.log('Add more items'),
                        navigation.navigate('Home')
                        }
                    }
                    style={styles.addMoreButton}
                >
                    <Text style={styles.addMoreButtonText}>Add More?</Text>
                </Pressable>
            </View>
            <View style={styles.checkoutSection}>
                <View>
                    <Text style={styles.orderPrice}>Item Subtotal:            ${formatPrice(itemSubtotal)}</Text>
                    <Text style={styles.orderPrice}>Total Tax:                    ${formatPrice(tax)}</Text>
                    <Text style={styles.orderPrice}>Delivery Fee:               ${formatPrice(deliveryFee)}</Text>
                    <Text style={styles.totalOrderPrice}>Order Total:       ${formatPrice(orderTotal)}</Text>
                </View>
                <View style={styles.buttonRow}>
                    <Pressable onPress={ () => {
                            console.log(`${orderTotal} Order total: ${formatPrice(orderTotal)}`)
                            }
                        }
                        style={styles.mainButton}
                    >
                        <Text style={styles.mainButtonText}>Continue to Checkout</Text>
                    </Pressable>
                </View>
            </View>
            
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: '#fff',
        //alignItems: 'center',
        //justifyContent: 'center',
    },
    main: {
        alignItems: 'center',
        //justifyContent: 'center',
        marginBottom: 50,
        height: 425,
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
        paddingBottom: 10,
    },
    itemRow: {
        flexDirection: 'row',
        //justifyContent: 'space-between',
        //alignItems: 'flex-start',
        paddingTop: 10,
        height: 120,
    },
    itemCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingTop: 10,
        height: 120,
        width: 200,
    },
    itemText: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        width: 200, //may not be right place/way to set this
        paddingHorizontal: 10,
        //paddingRight: 2,
    },
    title: {
        fontSize: 18,
        color: 'black',
        fontWeight: 'bold',
    },
    /*itemDesc: {
        fontSize: 16,
        color: 'black',
        paddingVertical: 5,
        overflow: 'hidden',
        height: 50,
    },*/
    itemPrice: {
        fontSize: 16,
        color: 'black',
        //fontWeight: 'bold',
    }, 
    itemImage: {
        //fontSize: 16,
        //color: 'black',
        paddingVertical: 5,
        borderWidth: 1,
        borderColor: 'white',
        height: 100,
        width: 100,
    },
    itemSepatator: {
        marginVertical: 10,
        height: 1,
        width: 375,
        backgroundColor: '#D9D9D9',
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
    addMoreButton: {
        backgroundColor: 'white',//'#F4CE14',//yellow
        borderColor: '#495E57',
        borderWidth: 2,
        //flexDirection: 'row',
        alignSelf: 'flex-end',
        alignContent: 'center',
        justifyContent: 'center',
        padding: 10,
        margin: 10,
        maxWidth: 150,
        maxHeight: 45,
        borderRadius: 8,
    },
    addMoreButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black',
    },
    checkoutSection: {
        marginVertical: 15,
    },
    checkoutPricing: {
    },
    orderPrice: {
        fontSize: 16,
        color: 'black',
    },
    totalOrderPrice: {
        fontSize: 20,
        color: 'black',
        fontWeight: 'bold',
        paddingTop: 20,
    },
    mainButton: {
        backgroundColor: '#495E57',//'#F4CE14',
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 10,
        width: 300,
        height: 50,
        borderRadius: 8,
        marginTop: 38,
    },
    mainButtonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },
});