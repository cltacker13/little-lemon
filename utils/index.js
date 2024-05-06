export const validateEmail = (email) => {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

export const validateAlphaChar = (word) => {
  return word.match(
    /^[a-zA-Z]+$/
  );
};

export const validateName = (name) => {
  /*'Name may only contain upper and lower letters,
  and dash character*/
  return name.match(
    /^[a-zA-Z\-]+$/
  );
};

export const validatePassword = (password) => {
  /*'Password must contain one digit from 1 to 9, 
  one lowercase letter, one uppercase letter, 
  one special character, no space, 
  and it must be 8-16 characters long.'*/
  return password.match(
    /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/
  );
};

export const confirmPassword = (password, confirmPass) => {
  let checked = false;
  if(password === confirmPass){
    checked = true;
  }
  return checked;
}