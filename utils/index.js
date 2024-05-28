export const validateEmail = (email) => {
    /*return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );*/
    var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return regex.test(email);
};

export const validateAlphaChar = (word) => {
  /*return word.match(
    /^[a-zA-Z]+$/
  );*/
  var regex = /^[a-zA-Z]+$/
  return regex.test(word);
};

export const validateName = (name) => {
  /*'Name may only contain upper and lower letters,
  and dash character*/
  /*return name.match(
    /^[a-zA-Z\-]+$/
  );*/
  var regex = /^[a-zA-Z\-]+$/
  return regex.test(name);

};

export const validatePassword = (password) => {
  /*'Password must contain one digit from 1 to 9, (not from 0 - 9 ?)
  one lowercase letter, one uppercase letter, 
  one special character, no space, 
  and it must be 8-16 characters long.'*/
  /*return password.match(
    /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/
  );*/
  var regex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/
  return regex.test(password);

};

export const confirmPassword = (password, confirmPass) => {
  let checked = false;
  if(password === confirmPass){
    checked = true;
  };
  return checked;
};

export const validateUSPhone = (phone) => {

  /*return phone.match(
    /^(\([0-9]{3}\)|[0-9]{3}-)[0-9]{3}-[0-9]{4}$/
   // /^(?=.*[0-9]).{10}$/
  );*/
  /* /^(\([0-9]{3}\)|[0-9]{3}-)[0-9]{3}-[0-9]{4}$/ */
  var regex = /^\+[1]\([0-9]{3}\)[0-9]{3}-[0-9]{4}$/
  return regex.test(phone);

};