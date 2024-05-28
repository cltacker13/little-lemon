//import { useState } from 'react';
//import { Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
//import { localData } from '../utils/localData';

import { useEffect, useState, useCallback, useMemo } from 'react';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  SectionList,
  SafeAreaView,
  StatusBar,
  Pressable,
  Image,
  Alert,
  TextInput,
  ScrollView,
} from 'react-native';
//import { Searchbar } from 'react-native-paper';
import debounce from 'lodash.debounce';
import {
  createTable,
  getMenuItems,
  saveMenuItems,
  filterByQueryAndCategories,
  dropTable,
} from '../utils/database';
import Filters from '../utils/filters';
import { getSectionListData, useUpdateEffect } from '../utils/utils';
import { MainHeader } from './components/Header';

const API_URL = 
'https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json';
const sections = ['starters', 'mains', 'desserts'];

const ItemSepatator = () => (
  <View style={styles.itemSepatator}></View>
);
const Item = ({ category, /*id,*/ name, price, description, image }) => (
    <View style={styles.itemCard} id={category} /*key={id}*/>
      <View style={styles.itemText}>
        <Text style={styles.title}>{name}</Text>
        <Text style={styles.itemDesc}>{description}</Text>
        <Text style={styles.itemPrice}>${price}</Text>
      </View>
      <Image style={styles.itemImage} 
      source={{uri: `https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/${image}?raw=true`}} />
    </View>
);
const heroImage = 'https://github.com/cltacker13/little-lemon/blob/master/assets/ll-images/Hero%20image.png?raw=true';

export default function HomeScreen({navigation}){
    console.log('Home Screen');
    //const { updateIsLoggedIn } = route.params;

    const [data, setData] = useState([]);
    const [searchBarText, setSearchBarText] = useState('');
    const [query, setQuery] = useState('');
    const [filterSelections, setFilterSelections] = useState(
      sections.map(() => false)
    );
  
    const fetchData = async() => {
      // 1. Implement this function
        // Fetch the menu from the API_URL endpoint. You can visit the API_URL in your browser to inspect the data returned
        // The category field comes as an object with a property called "title". You just need to get the title value and set it under the key "category".
        // So the server response should be slighly transformed in this function (hint: map function) to flatten out each menu item in the array,
      let menuData = [];
      try {
        const response = await fetch(API_URL);
        const json = await response.json();
        return menuData = json.menu.map( (obj, index)=> {
          return { 
            id: index + 1,
            name: obj.name,
            price: obj.price,
            description: obj.description,
            image: obj.image,
            category: obj.category,
            
         } 
        
        });
      } catch (err) {
        Alert.alert("Fetch Error:",err.message);
      }
    }
  
    useEffect(() => {
      (async () => {
        try {
          //drop table to clear data during dev testing
          //await dropTable('menuItems');

          await createTable(); 
          let menuItems = await getMenuItems(); 
          console.log('getmenuitems:',menuItems)
          // The application only fetches the menu data once from a remote URL
          // and then stores it into a SQLite database.
          // After that, every application restart loads the menu from the database
          if (!menuItems.length) {
            menuItems = await fetchData(); 
            saveMenuItems(menuItems); 
            //console.log('fetched to createTable:',menuItems);
          } 
          setData(menuItems);
          /*const sectionListData = getSectionListData(menuItems);
          setData(sectionListData);*/
        } catch (err) {
          // Handle error 
          Alert.alert(err.message); 
        } 
      })();
    }, []);
  
    useUpdateEffect(() => {
      (async () => {
        const activeCategories = sections.filter((s, i) => {
          //const sect = s.toLowerCase();
          //console.log('s:',s,'& i:',i);
          // If all filters are deselected, all categories are active
          if (filterSelections.every((item) => item === false)) {
            //console.log('sect item:',item)
            return true;
          }
          //console.log(s,':',filterSelections[i])
          return filterSelections[i];
        }); 
        //console.log('active Cats:',activeCategories)
        try {
          const menuItems = await filterByQueryAndCategories(
            query,
            activeCategories
          );
          //console.log('menuitems after filter:',menuItems)
          /*const sectionListData = getSectionListData(menuItems);
          setData(sectionListData);*/
          setData(menuItems);
        } catch (err) {
          Alert.alert(err.message);
        }
      })();
    }, [filterSelections, query]);
  
    const lookup = useCallback((q) => {
      setQuery(q);
    }, []);
  
    const debouncedLookup = useMemo(() => debounce(lookup, 500), [lookup]);
  
    const handleSearchChange = (text) => {
      setSearchBarText(text);
      debouncedLookup(text);
    };
  
    const handleFiltersChange = async (index) => {
      const arrayCopy = [...filterSelections];
      arrayCopy[index] = !filterSelections[index];
      setFilterSelections(arrayCopy);
    };


    return (
        <View style={styles.container}>
          <MainHeader navigation={navigation} />
          <View style={styles.main}>
                <View style={styles.heroBox}>
                  <Text style={styles.heroH1}>Little Lemon</Text>
                  <View style={styles.heroRow}>
                    <View style={styles.heroTextColumn}>
                      <Text style={styles.heroH2}>Chicago</Text>
                      <Text style={styles.heroDesc}>We are a family-owned Mediterranean restaurant, focused on traditional recipes served with a modern twist.</Text>
                    </View>
                    <View style={styles.heroImageColumn}>
                      <Image style={styles.heroImage} 
                        source={{uri: heroImage}} />
                    </View>
                  </View>
                  <TextInput
                      placeholder="Search"
                      placeholderTextColor="#495E57"
                      onChangeText={handleSearchChange}
                      value={searchBarText}
                      style={styles.searchBar}
                      iconColor="#495E57"
                      inputStyle={{ color: "#495E57" }}
                      elevation={0}
                  />
                </View>  
                <View style={{ paddingVertical: 5 }}>  
                  <Text style={styles.h2}>ORDER FOR DELIVERY!</Text>
                  <Filters
                    selections={filterSelections}
                    onChange={handleFiltersChange}
                    sections={sections}
                  />
                </View>
                <View style={styles.menuList}>
                  {/*console.log('data for FlatList:',data[0].data[0].name)*/}
                  <FlatList //SectionList
                    style={styles.sectionList}
                    data={data} 
                    //sections={data}
                    keyExtractor={(item,index) => item+index} //{(item) => item.id}
                    renderItem={({ item }) => (
                      <Pressable onPress={ () => {
                        //console.log({item})
                        navigation.navigate('ItemDetails',{item})
                      }}>
                        <Item //id={item.id} title={item.title} price={item.price} 
                          category={item.title} // id={item.id}
                          name={item.name} price={item.price} 
                          description={item.description} image={item.image}
                        />
                      </Pressable>
                        )}
                    ListHeaderComponent={ItemSepatator}
                    ItemSeparatorComponent={ItemSepatator}
                    /*renderSectionHeader={({ section: { title } }) => (
                    <ItemSepatator/>//<Text style={styles.sectionHeader}>{title}</Text>
                    )}*/
                  />
                </View>

          </View>
        </View>

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
        backgroundColor: 'green',
    },
    main: {
      //alignItems: 'center',
      //justifyContent: 'center',
      marginBottom: 50,

    },
    heroBox: {
      alignSelf: 'center',
      //alignItems: 'left',
      justifyContent: 'flex-start',
      backgroundColor: '#495E57',
      marginBottom: 5,
      width: 450,
      paddingHorizontal: 20,
    },
    heroRow: {
      flexDirection: 'row',
    },  
    heroTextColumn: {
      width: 225,
      marginLeft: 20,
      flexDirection: 'column',
      alignContent: 'left',
      //justifyContent: 'flex-start',
    },
    heroH1: {
      fontSize: 56,
      color: '#F4CE14',
      marginLeft: 20,
    },
    heroH2: {
      fontSize: 34,
      color: 'white',
      //marginLeft: 20,
      marginBottom: 5,
      textAlignVertical: 'top',
    },
    heroDesc: {
      //marginLeft: 20,
      fontSize: 18,
      color: 'white',
      //width: 225,
      marginRight: 5,
      paddingVertical: 5,
    },
    heroImageColumn: {
      alignContent: 'right',
      justifyContent: 'center',
      marginRight: 20,
      //borderWidth: 1,
      //borderColor: 'black',
      borderRadius: 26,
      marginTop: 15,
      height: 160,
    },
    heroImage: {
      resizeMode: 'cover',
      width: 140,
      height: 160,
      borderRadius: 26,
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
    menuList: {
        maxHeight: 275,//or something else to define max screen view
    },
    sectionList: {
      //paddingHorizontal: 16,
    },
    searchBar: {
      alignSelf: 'center',
      marginBottom: 24,
      marginTop: 24,
      padding: 5,
      borderColor: 'black',
      borderWidth: 1,
      borderRadius: 8,
      shadowRadius: 0,
      shadowOpacity: 0,
      width: 350,
      backgroundColor: 'white',
    },
    itemCard: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      paddingTop: 10,
      height: 120,
    },
    itemText: {
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      width: 225, //may not be right place/way to set this
      paddingRight: 2,
    },
    title: {
      fontSize: 18,
      color: 'black',
      fontWeight: 'bold',
    },
    itemDesc: {
      fontSize: 16,
      color: 'black',
      paddingVertical: 5,
      overflow: 'hidden',
      height: 50,
    },
    itemPrice: {
      fontSize: 16,
      color: 'black',
      fontWeight: 'bold',
    },
    sectionHeader: {
        fontSize: 16,
        paddingVertical: 5,
        color: '#495E57',//'#FBDABB',
        backgroundColor: 'white',//'#495E57',
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
      height: 1,
      width: 'auto',
      backgroundColor: '#D9D9D9',
    },
    

});