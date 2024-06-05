import * as SQLite from 'expo-sqlite/legacy';

const db = SQLite.openDatabase('little_lemon');

//drop a table with table name.
export async function dropTable(tableName) {
  console.log(tableName,'table dropped');
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(  
          `DROP TABLE IF EXISTS ${tableName}`
        );
        },
        reject,
        resolve
      );
    });
  }
  
//create menuitems table
export async function createTable() {
  //console.log('db exists:', db)
  //console.log('creating table: in', db._db._name);
  //  'create table if not exists menuitems (id integer primary key not null, uuid text, title text, price text, category text);'
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS menuitems (id integer primary key not null, name text, price text, category text, description text, image text)',
          [], 
          (_tx, rs) => {
            console.log("create=" + JSON.stringify(rs));
          },
          (_tx, err) => {
            console.log("create error=" + JSON.stringify(err));
          }
        );
      },
      reject,
      resolve
      /*reject => {
        console.log("1error=" + JSON.stringify(reject));
      },
      resolve => {
        console.log("2success=" + JSON.stringify(resolve));
      }*/
    );

  });

}


//select and return all menuitems
export async function getMenuItems() {
  //console.log('getting menuitems from:',db._db._name);
  return new Promise((resolve) => {
    db.transaction((tx) => {
      tx.executeSql('SELECT * FROM menuitems', [], (_, { rows }) => {
        //console.log('all from table:',JSON.stringify(rows))
        resolve(rows._array);
      });
    });
  });

}

//select all by id, return 1st.
export async function getMenuItemByID(id) {
  //console.log('getting menuitems from:',db._db._name);
  return new Promise((resolve) => {
    db.transaction((tx) => {
      tx.executeSql(`SELECT * FROM menuitems WHERE id = ${id}`, [], (_, { rows }) => {
        //console.log('1st id match from table:',rows._array[0])
        resolve(rows._array[0]);
      });
    });
  });

}

//insert into menuitems table.
export async function saveMenuItems(menuItems) {
  let query = 'INSERT INTO menuitems (category, description, image, price, name) VALUES ';
  let values = menuItems.map((item) => 
  `("${item.category}", "${item.description}", "${item.image}", "${item.price}", "${item.name}")`).join(', ');

  db.transaction((tx) => {
    tx.executeSql(      
      query + values,
      //'INSERT INTO menuitems (category, description, image, price, name) VALUES ("desserts", "Freshmade vanilla ice cream", "icecream.jpg", "5.00", "Ice Cream")',
      //query + values,[], 
      [],(_tx, rs) => {
        console.log("insert=" + JSON.stringify(rs));
      },
      (_tx, err) => {
        console.log("insert error=" + err/*JSON.stringify(err)*/);
      }
    );
  });

}

//select menuitems matching by name and active categories
export async function filterByQueryAndCategories(query, activeCategories) {
  //console.log('filter active cats:',activeCategories);
  var filterParams = `WHERE`;
  switch (activeCategories.length) {
    case 2:
      filterParams += ` (category = '${activeCategories[0]}' OR category = '${activeCategories[1]}')` 
      break;
    case 1:
      filterParams += ` (category = '${activeCategories[0]}')` 
      break;
    default:
    filterParams += ` (category = '${activeCategories[0]}' OR category = '${activeCategories[1]}' OR category = '${activeCategories[2]}')` 
    break;
  }
  if (query !== ''){ // also could filter via descriptions with: OR description LIKE '%${query}%'
    filterParams += ` AND (name LIKE '%${query}%' )`;
  }
  //console.log(db);
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(`SELECT * FROM menuitems ${filterParams}`, [], (_, { rows }) => {
        resolve(rows._array),
        reject;
      });
    });
  
  });
} 