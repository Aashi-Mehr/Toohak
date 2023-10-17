// Import functions from files
// import { UserInfo } from 'os';
import { UserAdd, Details, ErrorObject, getData } from './dataStore';

/*  adminAuthRegister

    Parameters:
      email:      string
      password:   string
      nameFirst:  string
      nameLast:   string

    Output:
      { authUserId: number } | { error: string }

    Edits:
      05/10/2023 by Zhejun Gu
      17/10/2023 by Aashi
        Migrating to TypeScript
 */
export function adminAuthRegister(email: string, password: string,
                                  nameFirst: string, nameLast: string) {
  const users = getData().users;

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
  for (let user of users) if (user.email === email) return { error: 'Used' };

  // ADDING TO DATA
  const timestamp = Math.floor(Date.now() / 1000);
  const randomId = (Math.floor(Math.random() * 1000000) + 1) % 100000000;
  const authUserId = timestamp * randomId % 100000000;

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

  return { authUserId: authUserId };
}

/*  adminUserLogin

    Parameters:
        email:
        password:

    Output:
        authUserId:

    Edits:
      17/10/2023 by Aashi
        Migrating to TypeScript
 */
export function adminAuthLogin(email: string, password: string) {
  const users = getData().users;

  for (const user of users) {
    if (user.email === email && user.password !== password) {
      user.failed_password_num++;
    } else if (user.email === email && user.password === password) {
      user.failed_password_num = 0;
      user.successful_log_time++;
      return { authUserId: user.authUserId };
    }
  }

  return { error: 'Email or password is incorrect ' };
}

/*  adminUserDetails

    Parameters:
      authUserId: number

    Output:
      { user: { userId, name, email, numSuccessfulLogins } } | { error: string }

    Edits:
      05/10/2023 by Zhejun Gu
      17/10/2023 by Aashi
        Migrating to TypeScript
 */
export function adminUserDetails(authUserId: number): Details | ErrorObject {
  let user: UserAdd;
  for (let person of getData().users) if (person.authUserId === authUserId) {
    user = person;
  }

  if (user === undefined) return { error: 'Invalid authUserId' };

  // Return the user's details
  return {
    user:
      {
        userId: authUserId,
        name: user.name,
        email: user.email,
        numSuccessfulLogins: user.successful_log_time,
        numFailedPasswordsSinceLastLogin: user.failed_password_num,
      }
  };
}
