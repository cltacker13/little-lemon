import { View, Pressable, Image, Text, StyleSheet, Alert, FlatList } from "react-native"
import { BackHeader } from "./components/Header";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getMenuItemByID } from "../utils/database";
import { useUpdateEffect } from "../utils/utils";

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
    const item = route.params.item ? (route.params.item) : [
        {"category": "", "description": "", "id": 0, "image": "", "name": "", "price": "0.00"}];
    const itemQuantity = route.params.quantity ? (Number(route.params.quantity)) : 0;
    const [quantityArr, updateQuantityArr] = useState([itemQuantity]);
    const [itemSubtotal, updateItemSubtotal] = useState(item.price*itemQuantity);
    const [itemSubtotalArr, updateItemSubtotalArr] = useState([itemSubtotal]);
    const [tax, updateTax] = useState(itemSubtotal*(0.0625));
    const deliveryFee = (1.99);
    const [orderTotal, updateOrderTotal] = useState(itemSubtotal+tax+deliveryFee);
    //console.log(item);
    const [cartArr, updateCartArr] = useState([{item,itemQuantity}]);

    //updates pricing after quantity adjusted.
    const updatePricing = (subSum) => {
        let newSub = (subSum);
        let newTax = (newSub*(0.0625));
        let newTotal = (newSub+newTax+deliveryFee);
        updateItemSubtotal(newSub);
        updateTax(newTax);
        updateOrderTotal(newTotal);
    }
    const updateItemQuantity = async (index,quantity,operator) => {
        let updatedCart = '';
        let newQuantity = Number(quantity);

        if(operator == '-'){
            console.log(quantity,'- 1');
            newQuantity = (quantity - 1); 
        }else if(operator == '+'){
            console.log(quantity,'+ 1');
            newQuantity = (quantity + 1);
        }
        if(newQuantity<1){
            console.log('New quantity is less than 1');
            newQuantity = 0;
        }
        console.log(cartArr[index],newQuantity);
        for(i=0;i<cartArr.length;i++){
            if(i == index){
                if(newQuantity == 0){
                    console.log('skipping 0 quantity item from updated cart list');
                }
                updatedCart += `${cartArr[i].item.id}|x|${newQuantity};`;
            }else{
                updatedCart += `${cartArr[i].item.id}|x|${cartArr[i].quantity};`;
            }
        }
        try {
            console.log('updated Cart:',updatedCart)
            await AsyncStorage.setItem('userCartItems',`${updatedCart}`);
        } catch (error) {
            console.log('error updating CartItems:',error)
        }
        let cartList = await retrieveCartItems();
        updateCartArr(cartList);
    }

    const retrieveCartItems = async () => {
        //remove items in cart, for testing
        //await AsyncStorage.removeItem('userCartItems');

        console.log('retrieving cart items...');
        //console.log(item.id,` x${itemQuantity};`);
        //let cartList = [[item,itemQuantity]];
        let cartList = [];
        let quantities = [];
        let prices = [];
        let itemTotals = [];
        try {
            const userCartItems = await AsyncStorage.getItem('userCartItems');
            console.log('getting for cart userCartItems:',userCartItems);
            //for existing items?
            if(userCartItems !== null && userCartItems !== ''){
                const listArr = userCartItems.split(';').filter((item) => item != "");
                //console.log('async existing items in cart: ',listArr);

                for(i=0;i<listArr.length;i++){
                    let cartItemID = listArr[i].split('|x|')[0];
                    let cartItemQuantity = Number(listArr[i].split('|x|')[1]);
                    let cartItemDetails = await getMenuItemByID(cartItemID);
                    //console.log(`item#${i+1}:`,cartItemDetails, 'x', cartItemQuantity);
                    //cartList.push([cartItemDetails,cartItemQuantity]);
                    if(cartItemQuantity != 0){
                        cartList.push({item: cartItemDetails, quantity: cartItemQuantity})
                        quantities.push(cartItemQuantity);
                        prices.push(Number(cartItemDetails.price));
                        itemTotals.push(Number(cartItemDetails.price)*cartItemQuantity)
                    }
                }
                if(cartList.length == 0){
                    Alert.alert('Empty Cart','Oops, Your cart is empty.')
                }
                console.log('Existing cartList:',cartList);
            }else{
                cartList.push({item: item, quantity: itemQuantity});
                console.log('New cartList:',cartList)
                //Alert.alert('Oops','Your cart appears to be empty.');
                
            }
            updateQuantityArr(quantities);
            //update prices too?
            updateItemSubtotalArr(itemTotals);
            let sumItemTotals = itemTotals.reduce((partialSum, a) => partialSum + a, 0);
            updatePricing(sumItemTotals);
            console.log(quantities,'x',prices,'=',itemTotals);
            return cartList;

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

    /*useUpdateEffect(() => { //does nothing yet.
        (async () => {
            try {  
                
            } catch (err) {
                // Handle error 
                Alert.alert(err.message); 
            } 
        })();
    }, []);*/
    
    return (
        <View style={styles.container}>
            <BackHeader navigation={navigation}/>
            <View style={styles.main}>
                <View style={{marginTop: 15, marginBottom: 15}}>
                    <Text style={styles.h1}>ORDER FOR DELIVERY!</Text>
                </View>
                <View style={{alignSelf: 'flex-start'}}>
                    <Text style={styles.h2}>Items in Cart</Text>
                </View>
                    <View style={styles.itemList}>
                        <FlatList //SectionList
                            style={styles.itemRow}
                            data={cartArr} //better as array of objects
                            keyExtractor={(item,index) => item+index} 
                            renderItem={( {item, index} ) => (
                                <View style={styles.itemCard}>
                                    <Item 
                                        name={item.item.name} price={item.item.price} 
                                        image={item.item.image} 
                                    />
                                    <View style={styles.buttonRow}>
                                        <Pressable onPress={ () => {
                                                console.log('Minus at',index),
                                                updateItemQuantity(index,item.quantity,'-')
                                                //updatePricing(item.quantity-1)
                                                }
                                            }
                                            style={styles.quantityButton}
                                        >
                                            <Text style={styles.quantityButtonText}>-</Text>
                                        </Pressable>
                                        <Text style={styles.quantityButtonText}>{item.quantity}</Text>
                                        <Pressable onPress={ () => {
                                                console.log('Plus at',index),
                                                updateItemQuantity(index,item.quantity,'+')
                                                //updatePricing(item.quantity+1)
                                                }
                                            }
                                            style={styles.quantityButton}
                                        >
                                            <Text style={styles.quantityButtonText}>+</Text>
                                        </Pressable>
                                    </View>
                                </View>
                                /*<Item name={item.name} price={item.price} 
                                image={item.image} quantity={quantity}/>*/
                                )}
                            //ListHeaderComponent={ItemSepatator}
                            ItemSeparatorComponent={ItemSepatator}
                            ListFooterComponent={ItemSepatator}
                        />
                        
                    </View>
            
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
                            console.log(`${orderTotal} Order total: ${formatPrice(orderTotal)}`),
                            navigation.navigate('Checkout', {itemSubtotal,tax,deliveryFee,orderTotal})
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
    itemList: {
        flexDirection: 'column',
        height: 325,
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
        width: 120, //may not be right place/way to set this
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