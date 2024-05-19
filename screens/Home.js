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

//pulled from menu page of previous project
/*const API_URL =
'https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/menu-items-by-category.json';
const sections = ['Appetizers', 'Salads', 'Beverages'];
*/
 //capstone api data 
const API_URL = 
'https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json';
const sections = ['Starters', 'Mains', 'Desserts'];


/*const Item = ({ id, title, price }) => (
    <View key={id} style={styles.item} >
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.title}>${price}</Text>
    </View>
);*/
//for capstone
const Item = ({ name, price, description, image }) => (
    <View style={styles.item} >
      <Text style={styles.title}>{name}</Text>
      <Text style={styles.title}>${price}</Text>
      <Text style={styles.title}>{description}</Text>
      <Text style={styles.title}>{image}</Text>
    </View>
);

export default function HomeScreen({navigation}){
    console.log('Home Screen');
    //const { updateIsLoggedIn } = route.params;

    //pulled from menu page of previous project  
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
        return menuData = json.menu.map( (obj)=> {
          return { 
            /*
            uuid: obj.id,
            title: obj.title,
            price: obj.price,
            category: obj.category.title,
            */
            //capstone data
            //id: obj,
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
          //drop table to clear data
          await dropTable('menuItems');

          await createTable(); 
          let menuItems = await getMenuItems(); 
          // The application only fetches the menu data once from a remote URL
          // and then stores it into a SQLite database.
          // After that, every application restart loads the menu from the database
          if (!menuItems.length) {
            const menuItems = await fetchData(); 
            saveMenuItems(menuItems); 
            console.log(menuItems);
          } 
  
          const sectionListData = getSectionListData(menuItems);
          setData(sectionListData);
        } catch (err) {
          // Handle error 
          Alert.alert(err.message); 
        } 
      })();
    }, []);
  
    useUpdateEffect(() => {
      (async () => {
        const activeCategories = sections.filter((s, i) => {
          // If all filters are deselected, all categories are active
          if (filterSelections.every((item) => item === false)) {
            return true;
          }
          return filterSelections[i];
        }); 
        try {
          const menuItems = await filterByQueryAndCategories(
            query,
            activeCategories
          );
          const sectionListData = getSectionListData(menuItems);
          setData(sectionListData);
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
                <View style={styles.hero}>
                    <Text style={styles.h1}>Welcome Back!</Text>
                    <Text style={styles.h2}>Little Lemon Home Page!</Text>
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
                    <Filters
                        selections={filterSelections}
                        onChange={handleFiltersChange}
                        sections={sections}
                    />
                </View>
                <View style={styles.menuList}>
                    <SectionList //FlatList
                        style={styles.sectionList}
                        //data={data}
                        sections={data}
                        keyExtractor={(item,index) => item+index} //{(item) => item.id}
                        renderItem={({ item }) => (
                          <Pressable onPress={ () => {
                            navigation.navigate('ItemDetails',{item})}
                          }>
                            <Item //id={item.id} title={item.title} price={item.price} 
                              name={item.name} price={item.price} description={item.description} image={item.image}
                            />
                          </Pressable>
                        )}
                        renderSectionHeader={({ section: { title } }) => (
                        <Text style={styles.sectionHeader}>{title}</Text>
                        )}
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
    hero: {
        alignItems: 'center',
        justifyContent: 'center',
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
    menuList: {
        maxHeight: 500,//or something else to define max screen view
    },
    sectionList: {
        paddingHorizontal: 16,
    },
    searchBar: {
        marginBottom: 24,
        marginTop: 24,
        padding: 5,
        borderColor: '#495E57',
        borderWidth: 1,
        borderRadius: 8,
        shadowRadius: 0,
        shadowOpacity: 0,
        width: 250,
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    sectionHeader: {
        fontSize: 24,
        paddingVertical: 8,
        color: '#495E57',//'#FBDABB',
        backgroundColor: 'white',//'#495E57',
    },
    title: {
        fontSize: 20,
        color: 'black',
    },

});