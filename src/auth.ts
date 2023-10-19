// Import functions from files
// import { UserInfo } from 'os';
// import { getTokenSourceMapRange } from 'typescript';
import {
  getData,
  ErrorObject,
  Details,
  UserAdd,
  AuthUserId,
  getUniqueID
} from './dataStore';

/** getUser
  * Loops through all tokens and users to identify the user
  *
  * @param { number } token - The session ID for the user
  *
  * @returns { UserAdd } - If the token exists and is valid
  * @returns { undefined } - If the token is invalid
*/
/*
function getUser(token: number): UserAdd | null {
  for (const sess of getData().sessions) {
    if (sess.token === token && sess.is_valid) {
      for (const user of getData().users) {
        if (user.authUserId === sess.authUserId) {
          return user;
        }
      }
    }
  }
}
*/

/** adminAuthRegister
  * Checks email, password, and name then adds the user to the database
  *
  * @param { string } email - The email to register
  * @param { string } password - The user's password
  * @param { string } nameFirst - The user's first name
  * @param { string } nameLast - The user's last name
  *
  * @returns { AuthUserId } - If the deails are valid
  * @returns { ErrorObject } - If the details are invalid
  */
export function adminAuthRegister(email: string, password: string,
  nameFirst: string, nameLast: string): AuthUserId | ErrorObject {
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

  // If no error, push the new user and return the authUserId
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

  // return { token: token };
  return { authUserId: authUserId };
}

/** adminUserLogin
  * Logs the user into the system if the given details are correct
  *
  * @param { string } email - The user's email
  * @param { string } password - The user's password
  *
  * @returns { AuthUserId } - If the deails are valid
  * @returns { ErrorObject } - If the details are invalid
  */
export function adminAuthLogin(email: string, password: string):
  AuthUserId | ErrorObject {
  const users = getData().users;

  for (const user of users) {
    if (user.email === email && user.password !== password) {
      user.failed_password_num++;
    } else if (user.email === email && user.password === password) {
      user.failed_password_num = 0;
      user.successful_log_time++;
      // Need to create a token (getUniqueId()) and add it to sessions,
      // then return token
      return { authUserId: user.authUserId };
    }
  }

  return { error: 'Email or password is incorrect' };
}

/** adminUserDetails
  * Returns the user's details if their authUserId exists
  *
  * @param { number } authUserId - The user's ID
  *
  * @returns { Details } - If the authUserId is valid
  * @returns { ErrorObject } - If the ID is invalid
  */
export function adminUserDetails(authUserId: number): Details | ErrorObject {
  // let user = getUser(token);
  let user: UserAdd;
  let exists = false;
  for (const person of getData().users) {
    if (person.authUserId === authUserId) {
      user = person;
      exists = true;
    }
  }

  if (!exists) return { error: 'Invalid token' };

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
