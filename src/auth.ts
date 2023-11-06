// Import functions from files
import {
  getData,
  getUser,
  getSession,
  ErrorObject,
  Details,
  getUniqueID,
  Token,
  emailUsed400,
  emailValid400,
  userChar400,
  passLen400,
  passChar400,
  passInv400,
  oldPass400,
  newPass400,
  token401
} from './dataStore';

import HTTPError from 'http-errors';
import crypto from 'crypto';

/** hash
  * Returns the hash of a given string (sha256 and hex)
  *
  * @param { string } plaintext - The string to hash
  *
  * @returns { string } - All cases
  */
function hash(plaintext: string): string {
  return crypto.createHash('sha256').update(plaintext).digest('hex').toString();
}

/** adminDetailsCheck
  * Checks email, password, and name then returns its validity
  *
  * @param { string } email - The email
  * @param { string } password - The user's password
  * @param { string } nameFirst - The user's first name
  * @param { string } nameLast - The user's last name
  *
  * @returns { Record<string, never> } - If the deails are valid
  * @returns { ErrorObject } - If the details are invalid
  */
function detailsCheck(email: string, password: string,
  nameFirst: string, nameLast: string): ErrorObject | Token {
  const data = getData();
  const users = data.users;

  // ERROR CHECKING
  // Password needs to have letters and numbers, greater than 8 characters
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /\d/.test(password);

  if (hasLetter === false || hasNumber === false) return { error: passChar400 };
  if (password.length < 8) return { error: passLen400 };

  // Name can only consist of letters, spaces and hyphens
  const invalidnameFirst = /[^a-zA-Z -']/.test(nameFirst);
  const invalidnameLast = /[^a-zA-Z -']/.test(nameLast);

  if (invalidnameFirst === true || invalidnameLast === true) {
    return { error: userChar400 };
  }
  if (nameFirst.length < 2 || nameFirst.length > 20 ||
      nameLast.length < 2 || nameLast.length > 20) {
    return { error: userChar400 };
  }

  // Email needs to be valid
  const validator = require('validator');
  if (!validator.isEmail(email)) return { error: emailValid400 };

  // Email cannot be duplicated
  for (const user of users) {
    if (user.email === email) return { error: emailUsed400 };
  }

  // No errors, hence details are valid
  return { token: -1 };
}

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
  nameFirst: string, nameLast: string): Token {
  const valid = detailsCheck(email, password, nameFirst, nameLast);
  if ('error' in valid) throw HTTPError(400, valid.error);

  const data = getData();

  // ADDING TO DATA
  const authUserId = getUniqueID(data);
  const token = getUniqueID(data);

  // If no error, push the new user and return the token
  data.users.push({
    authUserId: authUserId,
    nameFirst: nameFirst,
    nameLast: nameLast,
    name: nameFirst + ' ' + nameLast,
    email: email,
    password: hash(password),
    successful_log_time: 1,
    failed_password_num: 0,
    prev_passwords: [hash(password)]
  });

  data.sessions.push({
    token: token,
    authUserId: authUserId,
    is_valid: true
  });

  return { token: token };
}

/** adminUserDetailsEdit
  * Checks token, email, and name then changes the user's details
  *
  * @param { number } token - The user's token
  * @param { string } email - The new email
  * @param { string } nameFirst - The new first name
  * @param { string } nameLast - The new last name
  *
  * @returns { Record<string, never> } - If the deails are valid
  */
export function adminUserDetailsEdit(token: number, email: string,
  nameFirst: string, nameLast: string): Record<string, never> {
  // Get user details
  const user = getUser(token, getData());
  // If the token is invalid, return error
  if (!user) throw HTTPError(401, token401);

  // Get user details
  const users = getData().users;
  // Removing 'user' from user details
  getData().users.splice(users.indexOf(user), 1);

  // Checking the validity in user details
  const valid = detailsCheck(email, user.password, nameFirst, nameLast);
  if ('error' in valid) {
    users.push(user);
    throw HTTPError(400, valid.error);
  }

  // ALTERING DATA If no error, push the new user and return the token
  user.email = email;
  user.nameFirst = nameFirst;
  user.nameLast = nameLast;
  user.name = nameFirst + ' ' + nameLast;
  users.push(user);

  return { };
}

/** adminUserPasswordEdit
  * Checks token, email, and name then changes the user's details
  *
  * @param { number } token - The user's token
  * @param { number } oldPass - The new email
  * @param { number } newPass - The new first name
  *
  * @returns { Record<string, never> } - If the deails are valid
  */
export function adminUserPasswordEdit(token: number, oldPass: string,
  newPass: string): Record<string, never> {
  // ERROR CHECKING
  // Ensuring the user is valid
  const user = getUser(token, getData());

  // Return error message if token is invalid
  if (!user) throw HTTPError(401, token401);

  // Return error message if the password entered does not match old password
  if (user.password !== hash(oldPass)) throw HTTPError(400, oldPass400);

  // Password needs to have letters and numbers, greater than 8 characters
  const hasLetter = /[a-zA-Z]/.test(newPass);
  const hasNumber = /\d/.test(newPass);

  // Return error if password does not contain letters
  if (hasLetter === false || hasNumber === false) {
    throw HTTPError(400, passChar400);
  }

  // Return error if password is less than 8 characters
  if (newPass.length < 8) throw HTTPError(400, passLen400);

  // Loop through previous password and return error if the new password
  // is the same as the old password
  for (const pass of user.prev_passwords) {
    if (hash(newPass) === pass) throw HTTPError(400, newPass400);
  }

  // Push newPass into user details and set newPass to password
  user.prev_passwords.push(hash(newPass));
  user.password = hash(newPass);

  return { };
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

  // Loop through users
  for (const user of users) {
    // If the password is incorrect, but the email is correct, then attempts
    // need to be increased
    if (user.email === email && user.password !== hash(password)) {
      user.failed_password_num++;
    } else if (user.email === email && user.password === hash(password)) {
      // Both the password and email are correct, so the user is logged-in
      user.failed_password_num = 0;
      user.successful_log_time++;

      // Adding new session
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
  throw HTTPError(400, passInv400);
}

/** adminUserDetails
  * Returns the user's details if their token exists
  *
  * @param { number } token - The user's session token
  *
  * @returns { Details } - If the token is valid
  */
export function adminUserDetails(token: number): Details {
  // Finds the user using the token, undefined is returned if not found
  const user = getUser(token, getData());
  // Return error if token is invalid
  if (!user) throw HTTPError(401, token401);

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

/** adminAuthLogout
  * Returns the user's details if their token exists
  *
  * @param { number } token - The user's session token
  *
  * @returns { Record<string, never> } - If the token is valid
  * @returns { ErrorObject } - If the token is invalid
  */
export function adminAuthLogout(token: number): Record<string, never> {
  // Finds the user using the token, undefined is returned if not found
  const session = getSession(token, getData().sessions);

  // If session is not valid or exist
  if (!session) throw HTTPError(401, token401);

  // Set the validity of session to be false
  session.is_valid = false;
  return { };
}
