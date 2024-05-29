import { View, Pressable, Image, Text, StyleSheet } from "react-native"
import { BackHeader } from "./components/Header";
import { useState } from "react";

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
    console.log('Item Details Screen');
    const item = route.params.item;
    const itemQuantity = route.params.quantity;
    const [quantity, updateQuantity] = useState(itemQuantity);
    const [itemSubtotal, updateItemSubtotal] = useState(item.price*quantity);
    const [tax, updateTax] = useState(itemSubtotal*(0.0625));
    const deliveryFee = (1.99);
    const [orderTotal, updateOrderTotal] = useState(itemSubtotal+tax+deliveryFee);
    //console.log(item);

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

    return (
        <View style={styles.container}>
            <BackHeader navigation={navigation}/>
            <View style={styles.main}>
                <Text style={styles.h1}>ORDER FOR DELIVERY!</Text>
                <Text style={styles.h2}>Items in Cart</Text>
                    <View style={styles.itemRow}>
                        <Item name={item.name} price={item.price} image={item.image} quantity={quantity}/>
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
                    {/*Price totals -- TODO: Pending to limit values 2 decimal places */}
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
        justifyContent: 'space-between',
        alignItems: 'flex-start',
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