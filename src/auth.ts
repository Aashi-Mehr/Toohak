// Import functions from files
import {
  getData,
  getUser,
  ErrorObject,
  Details,
  getUniqueID,
  Token,
} from './dataStore';

/** adminAuthRegister
  * Checks email, password, and name then adds the user to the database
  *
  * @param { string } email - The email to register
  * @param { string } password - The user's password
  * @param { string } nameFirst - The user's first name
  * @param { string } nameLast - The user's last name
  *
  * @returns { Token } - If the deails are valid
  * @returns { ErrorObject } - If the details are invalid
  */
export function adminAuthRegister(email: string, password: string,
  nameFirst: string, nameLast: string): Token | ErrorObject {
  const data = getData();
  const users = data.users;
  const sessions = data.sessions;

  // ERROR CHECKING
  // Password needs to have letters and numbers, greater than 8 characters
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  // let hasUpperCase = /[A-Z]/.test(password);
  // let hasLowerCase = /[a-z]/.test(password);

  if (hasLetter === false) return { error: 'Password needs letters' };
  if (hasNumber === false) return { error: 'Password needs numbers' };
  if (password.length < 8) return { error: 'Password is too short' };

  // Name can only consist of letters, spaces and hyphens
  const invalidnameFirst = /[^a-zA-Z -']/.test(nameFirst);
  const invalidnameLast = /[^a-zA-Z -']/.test(nameLast);

  if (invalidnameFirst === true) return { error: 'Invalid name' };
  if (invalidnameLast === true) return { error: 'Invalid Name' };
  if (nameFirst.length < 2 || nameFirst.length > 20 ||
      nameLast.length < 2 || nameLast.length > 20) {
    return { error: 'Invalid name length' };
  }

  // Email needs to be valid
  const validator = require('validator');
  if (!validator.isEmail(email)) return { error: 'Invalid Email' };

  // Email cannot be duplicated
  for (const user of users) if (user.email === email) return { error: 'Used' };

  // ADDING TO DATA
  const authUserId = getUniqueID(data);
  const token = getUniqueID(data);

  // If no error, push the new user and return the token
  users.push({
    authUserId: authUserId,
    nameFirst: nameFirst,
    nameLast: nameLast,
    name: nameFirst + ' ' + nameLast,
    email: email,
    password: password,
    successful_log_time: 0,
    failed_password_num: 0,
  });

  sessions.push({
    token: token,
    authUserId: authUserId,
    is_valid: true
  });

  return { token: token };
}

/** adminUserLogin
  * Logs the user into the system if the given details are correct
  *
  * @param { string } email - The user's email
  * @param { string } password - The user's password
  *
  * @returns { Token } - If the deails are valid
  * @returns { ErrorObject } - If the details are invalid
  */
export function adminAuthLogin(email: string, password: string):
  Token | ErrorObject {
  const users = getData().users;

  for (const user of users) {
    // If the password is incorrect, but the email is correct, then attempts
    // need to be increased
    if (user.email === email && user.password !== password) {
      user.failed_password_num++;
    } else if (user.email === email && user.password === password) {
      // Both the password and email are correct, so the user is logged-in
      user.failed_password_num = 0;
      user.successful_log_time++;

      // The sessions needs to be added
      const token: number = getUniqueID(getData());
      getData().sessions.push({
        token: token,
        authUserId: user.authUserId,
        is_valid: true
      });

      // Token needs to be returned
      return { token: token };
    }
  }

  // If all of the above code ran, but the token wasn't returned, then the
  // details were incorrect
  return { error: 'Email or password is incorrect' };
}

/** adminUserDetails
  * Returns the user's details if their token exists
  *
  * @param { number } token - The user's ID
  *
  * @returns { Details } - If the token is valid
  * @returns { ErrorObject } - If the ID is invalid
  */
export function adminUserDetails(token: number): Details | ErrorObject {
  // Finds the user using the token, undefined is returned if not found
  const user = getUser(token, getData());
  if (!user) return { error: 'Invalid token' };

  // Return the user's details
  return {
    user:
      {
        userId: user.authUserId,
        name: user.name,
        email: user.email,
        numSuccessfulLogins: user.successful_log_time,
        numFailedPasswordsSinceLastLogin: user.failed_password_num,
      }
  };
}
