// Function : adminAuthRegister
// Input : email, password, nameFirst, nameLast
// Output : authUserId

export function adminAuthRegister(email, password, nameFirst, nameLast) {
    return { 
        authUserId: 1,
    }
}

// Function : adminUserLogin
// Input    : email, password
// Output   : authUserId

export function adminAuthLogin(email, password) {
    return {
        authUserId: 1,
    }
}

// Function : adminUserDetails
// Input    : authUserId
// Output   : user {userId: 1, name: 'Hayden Smith', 
//            email: 'hayden.smith@unsw.edu.au', numSuccessfulLogins: 3}

export function adminUserDetails(authUserId) {
    return { 
        user:
        {
          userId: 1,
          name: 'Hayden Smith',
          email: 'hayden.smith@unsw.edu.au',
          numSuccessfulLogins: 3,
          numFailedPasswordsSinceLastLogin: 1,
        }
    }
}