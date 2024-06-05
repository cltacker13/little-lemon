import { useRef, useEffect } from 'react';

//only used for SectionList, not used with FlatList menu display.
export function getSectionListData(data) {
  // The data property should contain an array of menu items. 
  //console.log('sectionListData:',data);
  const dataByCategory = data.reduce((acc, curr) => {
    const menuItem = {
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