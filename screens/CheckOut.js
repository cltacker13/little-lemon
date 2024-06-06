import { View, Pressable, Image, Text, StyleSheet, Alert, FlatList } from "react-native";
import { BackHeader } from "./components/Header";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";


const formatPrice = (price) => {
    let dec = parseFloat(price).toFixed(2);
    return dec;
};

const SectionSepatator = () => (
    <View style={styles.sectionSepatator}></View>
);

export default function CheckOutScreen({navigation, route}){
    //console.log('Checkout Screen');
    const itemSubtotal = route.params.itemSubtotal ? (Number(route.params.itemSubtotal)) : 0;
    const tax = route.params.tax ? (Number(route.params.tax)) : 0;
    const deliveryFee = route.params.deliveryFee ? (Number(route.params.deliveryFee)) : 0;
    const orderTotal = route.params.orderTotal ? (Number(route.params.orderTotal)) : 0;
    const [name, updateName] = useState('Shelby Smith');
    const [isValidOrderForm, toggleIsValidOrderForm] = useState(true);

    const retrieveUserProfileData = async () => {
        //console.log('retrieving user name data at checkout');
        try {
            const userFirstName = await AsyncStorage.getItem('firstName');
            const userLastName = await AsyncStorage.getItem('lastName');
            if(userFirstName != '' || userLastName != ''){
                let name = userFirstName+' '+userLastName;
                updateName(name);
            }
        } catch (error) {
            console.log('retrieving user name data at checkout error:', error)
        }
    }
    retrieveUserProfileData();

    const removingCartItems = async () => {
        //console.log('removing cart items...');
        try {
            await AsyncStorage.removeItem('userCartItems');
        } catch (error) {
            console.log('error removing cart items after checkout: ', error);
        }
    }

    const completeCheckout = async () => {
        //console.log('completing checkout');
        if(isValidOrderForm){
            removingCartItems();
            Alert.alert('Order Complete.',`Thank you for placing your order. Payment of ${formatPrice(orderTotal)} has been captured. Your order will be delivered shortly.`);
            navigation.navigate('Home')
        }
    };

    return (
        <View style={styles.container}>
            <BackHeader navigation={navigation}/>
            <View style={styles.main}>
                <View style={{marginTop: 15, marginBottom: 20}}>
                    <Text style={styles.h1}>ORDER FOR DELIVERY!</Text>
                </View>
                <View style={styles.addressSection}>
                    <View style={styles.textSection}>
                        <Text style={styles.h2}>Delivering to:</Text>
                        <Text style={styles.text}>{name}</Text>
                        <Text style={styles.text}>1234 East 18th Street</Text>
                        <Text style={styles.text}>Chicago, IL 60613</Text>
                    </View>
                    <View style={styles.buttonSection}>
                        <Pressable onPress={ () => {
                                    Alert.alert('Change Delivery Address','Changing Delivery Address')
                                    }
                                }
                                style={styles.updateButton}
                                >
                                <Text style={styles.updateButtonText}>Change</Text>
                        </Pressable>
                    </View>
                </View>
                <SectionSepatator />
                <View style={styles.pricingSection}>
                    <Text style={styles.orderPrice}>Item Subtotal:            ${formatPrice(itemSubtotal)}</Text>
                    <Text style={styles.orderPrice}>Total Tax:                    ${formatPrice(tax)}</Text>
                    <Text style={styles.orderPrice}>Delivery Fee:               ${formatPrice(deliveryFee)}</Text>
                    <Text style={styles.totalOrderPrice}>Order Total:       ${formatPrice(orderTotal)}</Text>
                </View>
                <SectionSepatator />
                <View style={styles.paymentMethodSection}>
                    <View style={styles.textSection}>
                        <Text style={styles.h2}>Payment Method</Text>
                        <Text style={styles.text}>VISA Card  # ... 4242</Text>
                    </View>
                    <View style={styles.buttonSection}>
                        <Pressable onPress={ () => {
                                    Alert.alert('Change Delivery Address','Changing Delivery Address')
                                    }
                                }
                                style={styles.updateButton}
                                >
                                <Text style={styles.updateButtonText}>Change</Text>
                        </Pressable>
                    </View>
                </View>

                <View style={styles.checkoutSection}>
                    <View style={styles.buttonRow}>
                        <Pressable onPress={ () => {
                                //console.log(`Order Complete. Paid ${formatPrice(orderTotal)}`),
                                completeCheckout()
                                }
                            }
                            style={styles.mainButton}
                        >
                            <Text style={styles.mainButtonText}>Purchase Order</Text>
                        </Pressable>
                    </View>
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
    },
    main: {
        alignItems: 'center',
        marginBottom: 50,
        height: 425,
    },
    sectionSepatator: {
        marginVertical: 10,
        height: 1,
        width: 375,
        backgroundColor: '#D9D9D9',
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
        marginBottom: 20,
    },
    addressSection: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignSelf: 'flex-start',
        height: 150,
        marginVertical: 5,
        marginBottom: 10,
        paddingTop: 10,
    },
    textSection:{
        flexDirection: 'column',
        width: 200,
    },
    text: {
        fontSize: 20,
    },
    pricingSection: {
        justifyContent: 'center',
        alignSelf: 'flex-start',
        height: 150,
        marginVertical: 5,
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
    paymentMethodSection: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignSelf: 'flex-start',
        height: 100,
        paddingTop: 10,
    },
    checkoutSection: {
        marginVertical: 15,
    }, 
    buttonSection: {
        marginHorizontal: 20,
        justifyContent: 'center',
        alignContent: 'center',
    },
    updateButton: {
        backgroundColor: '#495E57',
        borderColor: '#495E57',
        borderWidth: 2,
        alignContent: 'center',
        justifyContent: 'center',
        padding: 10,
        margin: 20,
        maxWidth: 150,
        maxHeight: 45,
        borderRadius: 8,
    },
    updateButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
    },
    mainButton: {
        backgroundColor: '#F4CE14', //'#495E57',
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 10,
        width: 300,
        height: 50,
        borderRadius: 8,
        marginTop: 100,
    },
    mainButtonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
    },
});