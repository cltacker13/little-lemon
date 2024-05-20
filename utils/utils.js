import { useRef, useEffect } from 'react';

/*export const SECTION_LIST_MOCK_DATA = [

    {
      title: 'Appetizers',
      data: [
        {
          id: '1',
          title: 'Pasta',
          price: '10',
        },
        {
          id: '3',
          title: 'Pizza',
          price: '8',
        },
      ],
    },
    {
      title: 'Salads',
      data: [
        {
          id: '2',
          title: 'Caesar',
          price: '2',
        },
        {
          id: '4',
          title: 'Greek',
          price: '3',
        },
      ],
    },
  ];
*/

/**
 * 3. Implement this function to transform the raw data
 * retrieved by the getMenuItems() function inside the database.js file
 * into the data structure a SectionList component expects as its "sections" prop.
 * @see https://reactnative.dev/docs/sectionlist as a reference
 */
export function getSectionListData(data) {
  // SECTION_LIST_MOCK_DATA is an example of the data structure you need to return from this function.
  // The title of each section should be the category.
  // The data property should contain an array of menu items. 
  // Each item has the following properties: "id", "title" and "price"
  //console.log('sectionListData:',data);
  //simplified 
  const dataByCategory = data.reduce((acc, curr) => {
    const menuItem = {
      /*id: curr.id,
      title: curr.title,
      price: curr.price,
      */
       //for capstone
      id: curr.id,
      name: curr.name,
      price: curr.price,
      description: curr.description,
      image: curr.image,
      //category: curr.category,
    };
    //console.log('curr cat:',curr.category);
    if(!Array.isArray(acc[curr.category])){
      acc[curr.category] = [menuItem];
    }else{
      acc[curr.category].push(menuItem);
    };
    //console.log('acc:',acc);
    return acc;
  }, {});
  /*const sectionListData = Object.entries(dataByCategory).map(([key,item]) => {
    return {
      title: key,
      data: item,
    };*/
  const sectionListData = Object.entries(dataByCategory).map(([key,item]) => {
    //console.log(`items in ${key}:`,item);
    return {
      title: key,
      data: item,
    };
  
  });
  console.log('return as sectionListData:', sectionListData);
  return sectionListData;
};

/*//cluttered. my original solve.
  const sections = ['Appetizers', 'Salads', 'Beverages'];
    let count = data.length; 
    let apps = [];
    let salads = [];
    let bevs = [];
    let result = []; 
  let mapped = data.map((obj) => {
    
    if(obj.category == sections[0]){
      apps.push({
        id: obj.uuid,
        title: obj.title,
        price: obj.price
      });
      count--;
    }else if(obj.category == sections[1]){
      salads.push({
        id: obj.uuid,
        title: obj.title,
        price: obj.price
      });
      count--;
    }else if(obj.category == sections[2]){
      bevs.push({
        id: obj.uuid,
        title: obj.title,
        price: obj.price
      });
      count--;
    }else {
      console.log('Not App, Salad, or Bev');
    };

    if(count==0){
      if(apps.length>0){
        result.push({
          'data': 
            apps,
          title: sections[0]})
      }
      if(salads.length>0){
        result.push({
          'data': 
            salads,
          title: sections[1]})
      }
      if(bevs.length>0){
        result.push({
          'data': 
            bevs,
          title: sections[2]})
      }
      if(apps.lenth==0 && salads.length==0 && bevs.length==0){
        result.push({});
      }
    }

    return ( result )     
  }); 

  let values = [];
  if(mapped.length>0){
    values = mapped[0];
  }
  return values; 
  //SECTION_LIST_MOCK_DATA;  
}*/

export function useUpdateEffect(effect, dependencies = []) {
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      return effect();
    }
  }, dependencies);
} 