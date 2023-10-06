// Import functions from files
import { getData, setData } from './dataStore.js';

// Function : adminAuthRegister
// Input : email, password, nameFirst, nameLast
// Output : authUserId
// Edit : 05/10/2023 by Zhejun Gu

export function adminAuthRegister(email, password, nameFirst, nameLast) {
    let data = getData();
    
    let hasLetter = /[a-zA-Z]/.test(password);
    let hasNumber = /\d/.test(password);
    let invalidnameFirst = /[^a-zA-Z -']/.test(nameFirst);
    let invalidnameLast = /[^a-zA-Z -']/.test(nameLast);

    var validator = require('validator');

    // Individual tests for checking if password contain upper or lower case
    // Uncomment if it is needed
    //
    // let hasUpperCase = /[A-Z]/.test(password);
    // let hasLowerCase = /[a-z]/.test(password);

    // Test invalid email
    for (const user of data.users) {
        if (user.email === email) {
            return { error: "Email already used" };
        }
    }
    if (validator.isEmail(email) === false) {
        return { error: "Email format does not meet requirement" };
    }

    // Test invalid password
    if (hasLetter === false) {
        return { error: "Password needs at least one letter" };
    }
    if (hasNumber === false) {
        return { error: "Password needs at least one number" };
    }
    if (password.length < 8) {
        return { error: "Password is too short (less than 8)" };
    }

    // Test invalid name
    if (invalidnameFirst === true) {
        return { error: "nameFirst contains invalid characters" };
    }
    if (invalidnameLast === true) {
        return { error: "nameLast contains invalid characters" };
    }
    if (nameFirst.length < 2 || nameFirst.length > 20) {
        return { error: "nameFirst is too short or too long" };
    }
    if (nameLast.length < 2 || nameLast.length > 20) {
        return { error: "nameLast is too short or too long" };
    }

    let timestamp = new Date().valueOf();
    let randomId = Math.floor(Math.random() * 1000000) + 1;
    let authUserId = timestamp*randomId;

    // If no error, push the new user and return the authUserId
    data.users.push({
        authUserId: authUserId,
        nameFirst: nameFirst,
        nameLast: nameLast,
        name: `${nameFirst} ${nameFirst}`,
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
 */
export function adminAuthLogin(email, password) {
    if (user.email === email && user.password === password) {
        return { error: "Email and password are required" };
    }

    let data = getData().users;
    for (let user in data) {
        if (user.password === password && user.password === password) {
            return { authUserId: user.authUserId };
        }
    }
    
    return { error: "Invalid login" };
}

// Function : adminUserDetails
// Input    : authUserId
// Output   : user {userId: 1, name: 'Hayden Smith',
//            email: 'hayden.smith@unsw.edu.au', numSuccessfulLogins: 3}
// Edit     : 05/10/2023 by Zhejun Gu 

export function adminUserDetails(authUserId) {
    let data = getData();
    let invalidId = /[^\d]/.test(authUserId);
    let userFound;

    // Test invalid User IDs
    if (invalidId === true) {
        return { error: "Given authUserId must be an integer"};
    }
    for (const user of data.users) {
        if (user.authUserId === authUserId) {
            ifFind = true;
            userFound = user;
        }
    }
    if (userFound === undefined) {
        return { error: "No user with given authUserId" };
    }

    // No further errors occur, return the user detail
    return { 
        user:
        {
            userId: `${authUserId}`,
            name: `${userFound.name}`,
            email: `${userFound.email}`,
            numSuccessfulLogins: `${userFound.successful_log_time}`,
            numFailedPasswordsSinceLastLogin: `${userFound.failed_password_num}`,
        }
    }
}