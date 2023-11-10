import {
  Token,
  ErrorObject,
  Details,
} from '../../dataStore';

import {
  requestRegister,
  requestLogin,
  requestDetails,
  requestLogout,
  requestDetailsEdit,
  requestPasswordEdit,
  requestClear
} from '../testHelper';

import HTTPError from 'http-errors';

/// ////////////////////////////////////////////////////////////////////////////
/// //////////////////////////////// Tests /////////////////////////////////////
/// ////////////////////////////////////////////////////////////////////////////

// Clearing the datastore, so that the tests are independent of previous data
beforeEach(() => { requestClear(); });

/// ////////////////////////////////////////////////////////////////////////////
/// ////////////////////////// adminAuthRegister ///////////////////////////////
/// ////////////////////////////////////////////////////////////////////////////

describe('adminAuthRegister', () => {
  let result: Token;

  // Error checking
  test('INVALID Password: No numbers', () => {
    // Password must contain numbers
    expect(() => requestRegister('first.last1@gmail.com', 'invalidpassword',
      'first', 'last')).toThrow(HTTPError[400]);
  });

  test('INVALID Password: No letters', () => {
    // Password must contain letters
    expect(() => requestRegister('first.last2@gmail.com', '123456789', 'first',
      'last')).toThrow(HTTPError[400]);
  });

  test('INVALID Password: Less than 8 characters', () => {
    // Password must be greater than or equal to 8 characters
    expect(() => requestRegister('first.last3@gmail.com', 'acb123', 'first',
      'last')).toThrow(HTTPError[400]);
  });

  test('INVALID Name: First name contains numbers', () => {
    // Name cannot have non-letter, non-space, non-spostrophe characters
    expect(() => requestRegister('first.last4@gmail.com', 'Val1dPassword',
      '1nval1d first', 'last')).toThrow(HTTPError[400]);
  });

  test('INVALID Name: Last name contains numbers', () => {
    // Name cannot have non-letter, non-space, non-spostrophe characters
    expect(() => requestRegister('first.last5@gmail.com', 'Val1dPassword',
      'first', '1nval1d last')).toThrow(HTTPError[400]);
  });

  test('INVALID Name: First name less than 2 characters', () => {
    // Name must be between 2 and 20 characters
    expect(() => requestRegister('first.last6@gmail.com', 'Val1dPassword', 'a',
      'last')).toThrow(HTTPError[400]);
  });

  test('INVALID Name: Last name less than 2 characters', () => {
    // Name must be between 2 and 20 characters
    expect(() => requestRegister('first.last9@gmail.com', 'Val1dPassword',
      'first', 'a')).toThrow(HTTPError[400]);
  });

  test('INVALID Name: First name more than 20 characters', () => {
    // Name must be between 2 and 20 characters
    expect(() => requestRegister('first.last7@gmail.com', 'Val1dPassword',
      'abcdefghijklmnopqrstuvwxyz', 'last')).toThrow(HTTPError[400]);
  });

  test('INVALID Name: Last name more than 20 characters', () => {
    // Name must be between 2 and 20 characters
    expect(() => requestRegister('first.last8@gmail.com', 'Val1dPassword', 'a',
      'abcdefghijklmnopqrstuvwxyz')).toThrow(HTTPError[400]);
  });

  test('INVALID Email: Does not satisfy validator.isEmail function', () => {
    // Email must satisfy validator
    expect(() => requestRegister('first..last@email', 'Val1dPassword',
      'first', 'last')).toThrow(HTTPError[400]);
  });

  test('INVALID Email: Used by another user', () => {
    // Emails must be unique
    requestRegister('first.last@gmail.com', 'Val1dPassword', 'first',
      'last');

    expect(() => requestRegister('first.last@gmail.com', 'Val1dPassword',
      'firstName', 'lastName')).toThrow(HTTPError[400]);
  });

  test('VALID Registration: Case 1', () => {
    // All correct details, checking simplest case
    result = requestRegister('first.last10@gmail.com', 'Val1dPassword',
      'first', 'last');
    expect(result.token).toBeGreaterThan(0);
  });

  test('VALID Registration: Case 2', () => {
    // All correct details, checking simplest case
    result = requestRegister('first.last@gmail.com', 'Val1dPassword',
      'first', 'last');
    expect(result.token).toBeGreaterThan(0);
  });

  test('VALID Registration: Case 3', () => {
    // All correct details, checking simplest case
    result = requestRegister('first.last2@gmail.com', 'Val1dPassword',
      'firstName', 'lastName');
    expect(result.token).toBeGreaterThan(0);
  });

  test('VALID Registrations: Multiple Users', () => {
    requestRegister('first1@gmail.com', 'Val1dPassword', 'first', 'last');
    requestRegister('first2@gmail.com', 'Val1dPassword', 'first', 'last');
    requestRegister('first3@gmail.com', 'Val1dPassword', 'first', 'last');
    requestRegister('first4@gmail.com', 'Val1dPassword', 'first', 'last');

    expect(requestLogin('first1@gmail.com', 'Val1dPassword')).toMatchObject({
      token: expect.any(Number)
    });
    expect(requestLogin('first2@gmail.com', 'Val1dPassword')).toMatchObject({
      token: expect.any(Number)
    });
    expect(requestLogin('first3@gmail.com', 'Val1dPassword')).toMatchObject({
      token: expect.any(Number)
    });
    expect(requestLogin('first4@gmail.com', 'Val1dPassword')).toMatchObject({
      token: expect.any(Number)
    });
  });
});

/// ////////////////////////////////////////////////////////////////////////////
/// /////////////////////////// adminAuthLogin /////////////////////////////////
/// ////////////////////////////////////////////////////////////////////////////

describe('adminAuthLogin Version 2', () => {
  let result: Token;

  test('INVALID Email: Case 1', () => {
    // Email does not exist
    expect(() => requestLogin(
      'nonexisting@gmail.com', 'Val1dPassword'
    )).toThrow(HTTPError[400]);
  });

  test('INVALID Email: Case 2', () => {
    // Email is empty
    expect(() => requestLogin('', 'Val1dPassword')).toThrow(HTTPError[400]);
  });

  test('INVALID Password: Case 1', () => {
    requestRegister('first.last1@gmail.com', 'Val1dPassword1', 'first', 'last');
    expect(() => requestLogin(
      'first.last1@gmail.com', 'Val1dPasswoord'
    )).toThrow(HTTPError[400]);
  });

  test('INVALID Password: Case 2', () => {
    requestRegister('first.last2@gmail.com', 'Val1dPassword2', 'first', 'last');
    expect(() => requestLogin(
      'first.last2@gmail.com', 'Val1dPasswoord'
    )).toThrow(HTTPError[400]);
  });

  test('INVALID Password: Case 3', () => {
    requestRegister('first.last3@gmail.com', 'Val1dPassword3', 'first', 'last');
    expect(() => requestLogin(
      'first.last3@gmail.com', 'Val1dPasswoord'
    )).toThrow(HTTPError[400]);
  });

  test('INVALID Password: Case 4', () => {
    requestRegister('first.last4@gmail.com', 'Val1dPassword4', 'first', 'last');
    expect(() => requestLogin(
      'first.last4@gmail.com', 'Val1dPasswoord'
    )).toThrow(HTTPError[400]);
  });

  test('INVALID Password: Case 5', () => {
    requestRegister('first.last4@gmail.com', 'Val1dPassword4', 'first', 'last');
    expect(() => requestLogin(
      'first.last4@gmail.com', ''
    )).toThrow(HTTPError[400]);
  });

  test('VALID Details: Case 1', () => {
    requestRegister('first.last1@gmail.com', 'Val1dPassword1', 'first', 'last');
    result = requestLogin('first.last1@gmail.com', 'Val1dPassword1');
    expect(result).toMatchObject({ token: expect.any(Number) });
  });

  test('VALID Details: Case 2', () => {
    requestRegister('first.last2@gmail.com', 'Val1dPassword2', 'first', 'last');
    result = requestLogin('first.last2@gmail.com', 'Val1dPassword2');
    expect(result).toMatchObject({ token: expect.any(Number) });
  });

  test('VALID Details: Case 3', () => {
    requestRegister('first.last3@gmail.com', 'Val1dPassword3', 'first', 'last');
    result = requestLogin('first.last3@gmail.com', 'Val1dPassword3');
    expect(result).toMatchObject({ token: expect.any(Number) });
  });

  test('VALID Details: Case 4', () => {
    requestRegister('first.last4@gmail.com', 'Val1dPassword4', 'first', 'last');
    result = requestLogin('first.last4@gmail.com', 'Val1dPassword4');
    expect(result).toMatchObject({ token: expect.any(Number) });
  });
});

describe('adminAuthLogin Version 1', () => {
  let result: Token;

  test('INVALID Email: Case 1', () => {
    // Email does not exist
    expect(() => requestLogin(
      'nonexisting@gmail.com', 'Val1dPassword', true
    )).toThrow(HTTPError[400]);
  });

  test('INVALID Email: Case 2', () => {
    // Email is empty
    expect(() => requestLogin('', 'Val1dPass', true)).toThrow(HTTPError[400]);
  });

  test('INVALID Password: Case 1', () => {
    requestRegister(
      'first.last1@gmail.com', 'Val1dPassword1', 'first', 'last', true
    );
    expect(() => requestLogin(
      'first.last1@gmail.com', 'Val1dPasswoord', true
    )).toThrow(HTTPError[400]);
  });

  test('INVALID Password: Case 2', () => {
    requestRegister(
      'first.last2@gmail.com', 'Val1dPassword2', 'first', 'last', true
    );
    expect(() => requestLogin(
      'first.last2@gmail.com', 'Val1dPasswoord', true
    )).toThrow(HTTPError[400]);
  });

  test('INVALID Password: Case 3', () => {
    requestRegister(
      'first.last3@gmail.com', 'Val1dPassword3', 'first', 'last', true
    );
    expect(() => requestLogin(
      'first.last3@gmail.com', 'Val1dPasswoord', true
    )).toThrow(HTTPError[400]);
  });

  test('INVALID Password: Case 4', () => {
    requestRegister(
      'first.last4@gmail.com', 'Val1dPassword4', 'first', 'last', true
    );
    expect(() => requestLogin(
      'first.last4@gmail.com', 'Val1dPasswoord', true
    )).toThrow(HTTPError[400]);
  });

  test('INVALID Password: Case 5', () => {
    requestRegister(
      'first.last4@gmail.com', 'Val1dPassword4', 'first', 'last', true
    );
    expect(() => requestLogin(
      'first.last4@gmail.com', '', true
    )).toThrow(HTTPError[400]);
  });

  test('VALID Details: Case 1', () => {
    requestRegister(
      'first.last1@gmail.com', 'Val1dPassword1', 'first', 'last', true
    );
    result = requestLogin('first.last1@gmail.com', 'Val1dPassword1', true);
    expect(result).toMatchObject({ token: expect.any(Number) });
  });

  test('VALID Details: Case 2', () => {
    requestRegister(
      'first.last2@gmail.com', 'Val1dPassword2', 'first', 'last', true
    );
    result = requestLogin('first.last2@gmail.com', 'Val1dPassword2', true);
    expect(result).toMatchObject({ token: expect.any(Number) });
  });

  test('VALID Details: Case 3', () => {
    requestRegister(
      'first.last3@gmail.com', 'Val1dPassword3', 'first', 'last', true
    );
    result = requestLogin('first.last3@gmail.com', 'Val1dPassword3', true);
    expect(result).toMatchObject({ token: expect.any(Number) });
  });

  test('VALID Details: Case 4', () => {
    requestRegister(
      'first.last4@gmail.com', 'Val1dPassword4', 'first', 'last', true
    );
    result = requestLogin('first.last4@gmail.com', 'Val1dPassword4', true);
    expect(result).toMatchObject({ token: expect.any(Number) });
  });
});

/// ////////////////////////////////////////////////////////////////////////////
/// ////////////////////////// adminUserDetails ////////////////////////////////
/// ////////////////////////////////////////////////////////////////////////////

describe('adminUserDetails Version 2', () => {
  let result: Details | ErrorObject;
  let token: number;

  test('INVALID token: Out of the possible range', () => {
    // Tokens must be positive, non-null integers
    expect(() => requestDetails(0)).toThrow(HTTPError[401]);
  });

  test('INVALID token: Incorrect ID', () => {
    // Testing cases where the token doesn't refer to a valid user
    token = requestRegister('first.last@gmail.com', 'Val1dPassword', 'first',
      'last').token;
    expect(() => requestDetails(token + 1)).toThrow(HTTPError[401]);
  });

  test('VALID token: Simple Case 1', () => {
    // Valid case 1, simplest case
    token = requestRegister('first.last1@gmail.com', 'Val1dPassword1', 'first',
      'last').token;
    result = requestDetails(token);

    expect(result).toMatchObject({
      user:
      {
        userId: expect.any(Number),
        name: 'first last',
        email: 'first.last1@gmail.com',
        numSuccessfulLogins: 1,
        numFailedPasswordsSinceLastLogin: 0,
      }
    });
  });

  test('VALID token: Simple Case 2', () => {
    // Valid case 2, simplest case
    token = requestRegister('first.last2@gmail.com',
      'Val1dPassword2', 'first', 'last').token;
    result = requestDetails(token);

    expect(result).toMatchObject({
      user:
      {
        userId: expect.any(Number),
        name: 'first last',
        email: 'first.last2@gmail.com',
        numSuccessfulLogins: 1,
        numFailedPasswordsSinceLastLogin: 0,
      }
    });
  });

  test('VALID token: Simple Case 3', () => {
    // Valid case 3, simplest case
    token = requestRegister('first.last3@gmail.com',
      'Val1dPassword3', 'first', 'last').token;
    result = requestDetails(token);

    expect(result).toMatchObject({
      user:
      {
        userId: expect.any(Number),
        name: 'first last',
        email: 'first.last3@gmail.com',
        numSuccessfulLogins: 1,
        numFailedPasswordsSinceLastLogin: 0,
      }
    });
  });

  test('VALID token: Simple Case 4', () => {
    // Valid case 4, simplest case
    token = requestRegister('first.last4@gmail.com',
      'Val1dPassword4', 'first', 'last').token;
    result = requestDetails(token);

    expect(result).toMatchObject({
      user:
      {
        userId: expect.any(Number),
        name: 'first last',
        email: 'first.last4@gmail.com',
        numSuccessfulLogins: 1,
        numFailedPasswordsSinceLastLogin: 0,
      }
    });
  });

  test('VALID token: Complex Case 1', () => {
    // Valid case logging in, then details must show valid logins increased
    requestRegister('first.last1@gmail.com', 'Val1dPassword1', 'first', 'last');
    token = requestLogin('first.last1@gmail.com', 'Val1dPassword1').token;

    result = requestDetails(token);
    expect(result).toMatchObject({
      user:
      {
        userId: expect.any(Number),
        name: 'first last',
        email: 'first.last1@gmail.com',
        numSuccessfulLogins: 2,
        numFailedPasswordsSinceLastLogin: 0,
      }
    });
  });

  test('VALID token: Complex Case 2', () => {
    // Valid case, failed login attempts must increase
    requestRegister('first.last1@gmail.com', 'Val1dPassword1', 'first', 'last');
    token = requestLogin('first.last1@gmail.com', 'Val1dPassword1').token;

    expect(() => requestLogin(
      'first.last1@gmail.com', 'INVal1dPassword1')
    ).toThrow(HTTPError[400]);

    result = requestDetails(token);
    expect(result).toMatchObject({
      user:
      {
        userId: expect.any(Number),
        name: 'first last',
        email: 'first.last1@gmail.com',
        numSuccessfulLogins: 2,
        numFailedPasswordsSinceLastLogin: 1,
      }
    });
  });

  test('VALID token: Complex Case 3', () => {
    // Adding more logins
    requestRegister('first.last1@gmail.com', 'Val1dPassword1', 'first', 'last');
    token = requestLogin('first.last1@gmail.com', 'Val1dPassword1').token;

    expect(() => requestLogin(
      'first.last1@gmail.com', 'INVal1dPassword1')
    ).toThrow(HTTPError[400]);

    expect(() => requestLogin(
      'first.last1@gmail.com', 'INVal1dPassword1')
    ).toThrow(HTTPError[400]);

    result = requestDetails(token);
    expect(result).toMatchObject({
      user:
      {
        userId: expect.any(Number),
        name: 'first last',
        email: 'first.last1@gmail.com',
        numSuccessfulLogins: 2,
        numFailedPasswordsSinceLastLogin: 2,
      }
    });
  });

  test('VALID token: Complex Case 4', () => {
    // Adding a mixture of logins and failed logins
    // Failed logins should reset after a successful login
    requestRegister('first.last1@gmail.com', 'Val1dPassword1', 'first', 'last');
    requestLogin('first.last1@gmail.com', 'Val1dPassword1');

    expect(() => requestLogin(
      'first.last1@gmail.com', 'INVal1dPassword1')
    ).toThrow(HTTPError[400]);

    expect(() => requestLogin(
      'first.last1@gmail.com', 'INVal1dPassword1')
    ).toThrow(HTTPError[400]);

    token = requestLogin('first.last1@gmail.com', 'Val1dPassword1').token;

    result = requestDetails(token);
    expect(result).toMatchObject({
      user:
      {
        userId: expect.any(Number),
        name: 'first last',
        email: 'first.last1@gmail.com',
        numSuccessfulLogins: 3,
        numFailedPasswordsSinceLastLogin: 0,
      }
    });
  });
});

describe('adminUserDetails Version 1', () => {
  let result: Details | ErrorObject;
  let token: number;

  test('INVALID token: Out of the possible range', () => {
    // Tokens must be positive, non-null integers
    expect(() => requestDetails(0, true)).toThrow(HTTPError[401]);
  });

  test('INVALID token: Incorrect ID', () => {
    // Testing cases where the token doesn't refer to a valid user
    token = requestRegister('first.last@gmail.com', 'Val1dPassword', 'first',
      'last', true).token;
    expect(() => requestDetails(token + 1, true)).toThrow(HTTPError[401]);
  });

  test('VALID token: Simple Case 1', () => {
    // Valid case 1, simplest case
    token = requestRegister('first.last1@gmail.com', 'Val1dPassword1', 'first',
      'last', true).token;
    result = requestDetails(token, true);

    expect(result).toMatchObject({
      user:
      {
        userId: expect.any(Number),
        name: 'first last',
        email: 'first.last1@gmail.com',
        numSuccessfulLogins: 1,
        numFailedPasswordsSinceLastLogin: 0,
      }
    });
  });

  test('VALID token: Simple Case 2', () => {
    // Valid case 2, simplest case
    token = requestRegister('first.last2@gmail.com',
      'Val1dPassword2', 'first', 'last', true).token;
    result = requestDetails(token, true);

    expect(result).toMatchObject({
      user:
      {
        userId: expect.any(Number),
        name: 'first last',
        email: 'first.last2@gmail.com',
        numSuccessfulLogins: 1,
        numFailedPasswordsSinceLastLogin: 0,
      }
    });
  });

  test('VALID token: Simple Case 3', () => {
    // Valid case 3, simplest case
    token = requestRegister('first.last3@gmail.com',
      'Val1dPassword3', 'first', 'last', true).token;
    result = requestDetails(token, true);

    expect(result).toMatchObject({
      user:
      {
        userId: expect.any(Number),
        name: 'first last',
        email: 'first.last3@gmail.com',
        numSuccessfulLogins: 1,
        numFailedPasswordsSinceLastLogin: 0,
      }
    });
  });

  test('VALID token: Simple Case 4', () => {
    // Valid case 4, simplest case
    token = requestRegister('first.last4@gmail.com',
      'Val1dPassword4', 'first', 'last', true).token;
    result = requestDetails(token, true);

    expect(result).toMatchObject({
      user:
      {
        userId: expect.any(Number),
        name: 'first last',
        email: 'first.last4@gmail.com',
        numSuccessfulLogins: 1,
        numFailedPasswordsSinceLastLogin: 0,
      }
    });
  });

  test('VALID token: Complex Case 1', () => {
    // Valid case logging in, then details must show valid logins increased
    requestRegister(
      'first.last1@gmail.com', 'Val1dPassword1', 'first', 'last', true
    );
    token = requestLogin('first.last1@gmail.com', 'Val1dPassword1', true).token;

    result = requestDetails(token, true);
    expect(result).toMatchObject({
      user:
      {
        userId: expect.any(Number),
        name: 'first last',
        email: 'first.last1@gmail.com',
        numSuccessfulLogins: 2,
        numFailedPasswordsSinceLastLogin: 0,
      }
    });
  });

  test('VALID token: Complex Case 2', () => {
    // Valid case, failed login attempts must increase
    requestRegister(
      'first.last1@gmail.com', 'Val1dPassword1', 'first', 'last', true
    );
    token = requestLogin('first.last1@gmail.com', 'Val1dPassword1', true).token;

    expect(() => requestLogin(
      'first.last1@gmail.com', 'INVal1dPassword1', true
    )).toThrow(HTTPError[400]);

    result = requestDetails(token, true);
    expect(result).toMatchObject({
      user:
      {
        userId: expect.any(Number),
        name: 'first last',
        email: 'first.last1@gmail.com',
        numSuccessfulLogins: 2,
        numFailedPasswordsSinceLastLogin: 1,
      }
    });
  });

  test('VALID token: Complex Case 3', () => {
    // Adding more logins
    requestRegister(
      'first.last1@gmail.com', 'Val1dPassword1', 'first', 'last', true
    );
    token = requestLogin('first.last1@gmail.com', 'Val1dPassword1', true).token;

    expect(() => requestLogin(
      'first.last1@gmail.com', 'INVal1dPassword1', true
    )).toThrow(HTTPError[400]);

    expect(() => requestLogin(
      'first.last1@gmail.com', 'INVal1dPassword1', true
    )).toThrow(HTTPError[400]);

    result = requestDetails(token, true);
    expect(result).toMatchObject({
      user:
      {
        userId: expect.any(Number),
        name: 'first last',
        email: 'first.last1@gmail.com',
        numSuccessfulLogins: 2,
        numFailedPasswordsSinceLastLogin: 2,
      }
    });
  });

  test('VALID token: Complex Case 4', () => {
    // Adding a mixture of logins and failed logins
    // Failed logins should reset after a successful login
    requestRegister(
      'first.last1@gmail.com', 'Val1dPassword1', 'first', 'last', true
    );
    requestLogin('first.last1@gmail.com', 'Val1dPassword1', true);

    expect(() => requestLogin(
      'first.last1@gmail.com', 'INVal1dPassword1', true
    )).toThrow(HTTPError[400]);

    expect(() => requestLogin(
      'first.last1@gmail.com', 'INVal1dPassword1', true
    )).toThrow(HTTPError[400]);

    token = requestLogin('first.last1@gmail.com', 'Val1dPassword1', true).token;

    result = requestDetails(token, true);
    expect(result).toMatchObject({
      user:
      {
        userId: expect.any(Number),
        name: 'first last',
        email: 'first.last1@gmail.com',
        numSuccessfulLogins: 3,
        numFailedPasswordsSinceLastLogin: 0,
      }
    });
  });
});

/// ////////////////////////////////////////////////////////////////////////////
/// /////////////////////////// adminAuthLogout ////////////////////////////////
/// ////////////////////////////////////////////////////////////////////////////

describe('adminAuthLogout Version 2', () => {
  let result: ErrorObject | Record<string, never>;
  let token: number;

  test('INVALID Token: Doesn\'t Exist', () => {
    // Logging out a token that doesn't exist
    token = requestRegister('first.last1@gmail.com', 'Val1dPassword',
      'first', 'last').token;
    expect(() => requestLogout(token + 1)).toThrow(HTTPError[401]);
  });

  test('INVALID Token: Outside valid range', () => {
    // Logging out a token that's outside the valid range
    expect(() => requestLogout(0)).toThrow(HTTPError[401]);
  });

  test('INVALID Token: Already Logged Out', () => {
    // Logging out an invalid token
    token = requestRegister('first.last1@gmail.com', 'Val1dPassword',
      'first', 'last').token;
    requestLogout(token);
    expect(() => requestLogout(token)).toThrow(HTTPError[401]);
  });

  test('VALID Token: Simple Case 1', () => {
    // Testing the simplest valid case
    token = requestRegister('first.last1@gmail.com', 'Val1dPassword1',
      'first', 'last').token;
    result = requestLogout(token);
    expect(Object.keys(result).length).toStrictEqual(0);

    expect(() => requestDetails(token)).toThrow(HTTPError[401]);
  });

  test('VALID Token: Simple Case 2', () => {
    // Testing the simplest valid case
    token = requestRegister('first.last2@gmail.com', 'Val1dPassword2',
      'first', 'last').token;
    result = requestLogout(token);
    expect(Object.keys(result).length).toStrictEqual(0);

    expect(() => requestDetails(token)).toThrow(HTTPError[401]);
  });

  test('VALID Token: Simple Case 3', () => {
    // Testing the simplest valid case
    token = requestRegister('first.last3@gmail.com', 'Val1dPassword3',
      'first', 'last').token;
    result = requestLogout(token);
    expect(Object.keys(result).length).toStrictEqual(0);

    expect(() => requestDetails(token)).toThrow(HTTPError[401]);
  });

  test('VALID Token: Complex Case 1', () => {
    // Testing logout of a second session
    requestRegister('first.last1@gmail.com', 'Val1dPassword1', 'first', 'last');
    token = requestLogin('first.last1@gmail.com', 'Val1dPassword1').token;
    result = requestLogout(token);
    expect(Object.keys(result).length).toStrictEqual(0);
  });

  test('VALID Token: Complex Case 2', () => {
    // Testing logout of initial login session
    token = requestRegister('first.last2@gmail.com', 'Val1dPassword2',
      'first', 'last').token;
    requestLogin('first.last2@gmail.com', 'Val1dPassword2');
    result = requestLogout(token);
    expect(Object.keys(result).length).toStrictEqual(0);
  });

  test('VALID Token: Complex Case 3', () => {
    // Testing multiple sessions
    token = requestRegister('first.last3@gmail.com', 'Val1dPassword3',
      'first', 'last').token;
    requestLogout(token);
    requestLogin('first.last3@gmail.com', 'Val1dPassword3');
    requestLogin('first.last3@gmail.com', 'Val1dPassword3');
    token = requestLogin('first.last3@gmail.com', 'Val1dPassword3').token;
    result = requestLogout(token);
    expect(Object.keys(result).length).toStrictEqual(0);
  });
});

describe('adminAuthLogout Version 1', () => {
  let result: ErrorObject | Record<string, never>;
  let token: number;

  test('INVALID Token: Doesn\'t Exist', () => {
    // Logging out a token that doesn't exist
    token = requestRegister('first.last1@gmail.com', 'Val1dPassword',
      'first', 'last', true).token;
    expect(() => requestLogout(token + 1, true)).toThrow(HTTPError[401]);
  });

  test('INVALID Token: Outside valid range', () => {
    // Logging out a token that's outside the valid range
    expect(() => requestLogout(0, true)).toThrow(HTTPError[401]);
  });

  test('INVALID Token: Already Logged Out', () => {
    // Logging out an invalid token
    token = requestRegister('first.last1@gmail.com', 'Val1dPassword',
      'first', 'last').token;
    requestLogout(token);
    expect(() => requestLogout(token, true)).toThrow(HTTPError[401]);
  });

  test('VALID Token: Simple Case 1', () => {
    // Testing the simplest valid case
    token = requestRegister('first.last1@gmail.com', 'Val1dPassword1',
      'first', 'last', true).token;
    result = requestLogout(token, true);
    expect(Object.keys(result).length).toStrictEqual(0);

    expect(() => requestDetails(token, true)).toThrow(HTTPError[401]);
  });

  test('VALID Token: Simple Case 2', () => {
    // Testing the simplest valid case
    token = requestRegister('first.last2@gmail.com', 'Val1dPassword2',
      'first', 'last', true).token;
    result = requestLogout(token, true);
    expect(Object.keys(result).length).toStrictEqual(0);

    expect(() => requestDetails(token, true)).toThrow(HTTPError[401]);
  });

  test('VALID Token: Simple Case 3', () => {
    // Testing the simplest valid case
    token = requestRegister('first.last3@gmail.com', 'Val1dPassword3',
      'first', 'last', true).token;
    result = requestLogout(token, true);
    expect(Object.keys(result).length).toStrictEqual(0);

    expect(() => requestDetails(token, true)).toThrow(HTTPError[401]);
  });

  test('VALID Token: Complex Case 1', () => {
    // Testing logout of a second session
    requestRegister(
      'first.last1@gmail.com', 'Val1dPassword1', 'first', 'last', true
    );
    token = requestLogin('first.last1@gmail.com', 'Val1dPassword1', true).token;
    result = requestLogout(token, true);
    expect(Object.keys(result).length).toStrictEqual(0);
  });

  test('VALID Token: Complex Case 2', () => {
    // Testing logout of initial login session
    token = requestRegister('first.last2@gmail.com', 'Val1dPassword2',
      'first', 'last', true).token;
    requestLogin('first.last2@gmail.com', 'Val1dPassword2', true);
    result = requestLogout(token, true);
    expect(Object.keys(result).length).toStrictEqual(0);
  });

  test('VALID Token: Complex Case 3', () => {
    // Testing multiple sessions
    token = requestRegister('first.last3@gmail.com', 'Val1dPassword3',
      'first', 'last', true).token;
    requestLogout(token, true);
    requestLogin('first.last3@gmail.com', 'Val1dPassword3', true);
    requestLogin('first.last3@gmail.com', 'Val1dPassword3', true);
    token = requestLogin('first.last3@gmail.com', 'Val1dPassword3', true).token;
    result = requestLogout(token, true);
    expect(Object.keys(result).length).toStrictEqual(0);
  });
});

/// ////////////////////////////////////////////////////////////////////////////
/// //////////////////////// adminUserDetailsEdit //////////////////////////////
/// ////////////////////////////////////////////////////////////////////////////

describe('adminUserDetailsEdit Version 2', () => {
  let result: Record<string, never> | ErrorObject;
  let token: number;

  beforeEach(() => {
    token = requestRegister('first.last@gmail.com', 'Val1dPassword', 'first',
      'last').token;
  });

  test('INVALID token: Out of the possible range', () => {
    expect(() => requestDetailsEdit(0, 'hayden.smith@unsw.edu.au', 'Hayden',
      'Smith')).toThrow(HTTPError[401]);
  });

  test('INVALID token: Incorrect ID', () => {
    expect(() => requestDetailsEdit(token + 1, 'hayden.smith@unsw.edu.au',
      'Hayden', 'Smith')).toThrow(HTTPError[401]);
  });

  test('INVALID Name: First name contains numbers', () => {
    expect(() => requestDetailsEdit(token, 'first.last4@gmail.com',
      '1nval1d first', 'last')).toThrow(HTTPError[400]);
  });

  test('INVALID Name: First name contains exclamation mark', () => {
    expect(() => requestDetailsEdit(token, 'first.last4@gmail.com',
      'tes!t', 'last')).toThrow(HTTPError[400]);
  });

  test('INVALID Name: Lasr name contains exclamation mark', () => {
    expect(() => requestDetailsEdit(token, 'first.last4@gmail.com',
      'first', 'tes!t')).toThrow(HTTPError[400]);
  });

  test('INVALID Name: Last name contains numbers', () => {
    expect(() => requestDetailsEdit(token, 'first.last5@gmail.com', 'first',
      '1nval1d last')).toThrow(HTTPError[400]);
  });

  test('INVALID Name: First name less than 2 characters', () => {
    expect(() => requestDetailsEdit(token, 'first.last6@gmail.com', 'a',
      'last')).toThrow(HTTPError[400]);
  });

  test('INVALID Name: Last name less than 2 characters', () => {
    expect(() => requestDetailsEdit(token, 'first.last9@gmail.com', 'first',
      'a')).toThrow(HTTPError[400]);
  });

  test('INVALID Name: First name more than 20 characters', () => {
    expect(() => requestDetailsEdit(token, 'first.last7@gmail.com',
      'abcdefghijklmnopqrstuvwxyz', 'last')).toThrow(HTTPError[400]);
  });

  test('INVALID Name: Last name more than 20 characters', () => {
    expect(() => requestDetailsEdit(token, 'first.last8@gmail.com', 'a',
      'abcdefghijklmnopqrstuvwxyz')).toThrow(HTTPError[400]);
  });

  test('INVALID Email: Does not satisfy validator.isEmail function', () => {
    expect(() => requestDetailsEdit(token, 'first..last@email',
      'first', 'last')).toThrow(HTTPError[400]);
  });

  test('INVALID details: Email already exists', () => {
    requestRegister('first.last2@gmail.com', 'Val1dPassword1', 'first', 'last');
    expect(() => requestDetailsEdit(token, 'first.last2@gmail.com', 'firs',
      'last')).toThrow(HTTPError[400]);
  });

  test('VALID token: Simple Case 1', () => {
    result = requestDetailsEdit(token, 'hayden.smith@unsw.edu.au', 'Hayden',
      'Smith');
    expect(Object.keys(result).length).toStrictEqual(0);
  });

  test('VALID token: Simple Case 2', () => {
    token = requestRegister('first.last2@gmail.com',
      'Val1dPassword2', 'first', 'last').token;
    result = requestDetailsEdit(token, 'hayden.smith@unsw.edu.au', 'Hayden',
      'Smith');

    expect(Object.keys(result).length).toStrictEqual(0);
  });

  test('VALID token: Simple Case 3', () => {
    token = requestRegister('first.last3@gmail.com',
      'Val1dPassword3', 'first', 'last').token;
    result = requestDetailsEdit(token, 'hayden.smith@unsw.edu.au', 'Hayden',
      'Smith');

    expect(Object.keys(result).length).toStrictEqual(0);
  });

  test('VALID token: Simple Case 4', () => {
    token = requestRegister('first.last4@gmail.com',
      'Val1dPassword4', 'first', 'last').token;
    result = requestDetailsEdit(token, 'hayden.smith@unsw.edu.au', 'Hayden',
      'Smith');

    expect(Object.keys(result).length).toStrictEqual(0);
  });
});

describe('adminUserDetailsEdit Version 1', () => {
  let result: Record<string, never> | ErrorObject;
  let token: number;

  beforeEach(() => {
    token = requestRegister('first.last@gmail.com', 'Val1dPassword', 'first',
      'last', true).token;
  });

  test('INVALID token: Out of the possible range', () => {
    expect(() => requestDetailsEdit(0, 'hayden.smith@unsw.edu.au', 'Hayden',
      'Smith', true)).toThrow(HTTPError[401]);
  });

  test('INVALID token: Incorrect ID', () => {
    expect(() => requestDetailsEdit(token + 1, 'hayden.smith@unsw.edu.au',
      'Hayden', 'Smith', true)).toThrow(HTTPError[401]);
  });

  test('INVALID Name: First name contains numbers', () => {
    expect(() => requestDetailsEdit(token, 'first.last4@gmail.com',
      '1nval1d first', 'last', true)).toThrow(HTTPError[400]);
  });

  test('INVALID Name: First name contains exclamation mark', () => {
    expect(() => requestDetailsEdit(token, 'first.last4@gmail.com',
      'tes!t', 'last', true)).toThrow(HTTPError[400]);
  });

  test('INVALID Name: Lasr name contains exclamation mark', () => {
    expect(() => requestDetailsEdit(token, 'first.last4@gmail.com',
      'first', 'tes!t', true)).toThrow(HTTPError[400]);
  });

  test('INVALID Name: Last name contains numbers', () => {
    expect(() => requestDetailsEdit(token, 'first.last5@gmail.com', 'first',
      '1nval1d last', true)).toThrow(HTTPError[400]);
  });

  test('INVALID Name: First name less than 2 characters', () => {
    expect(() => requestDetailsEdit(token, 'first.last6@gmail.com', 'a',
      'last', true)).toThrow(HTTPError[400]);
  });

  test('INVALID Name: Last name less than 2 characters', () => {
    expect(() => requestDetailsEdit(token, 'first.last9@gmail.com', 'first',
      'a', true)).toThrow(HTTPError[400]);
  });

  test('INVALID Name: First name more than 20 characters', () => {
    expect(() => requestDetailsEdit(token, 'first.last7@gmail.com',
      'abcdefghijklmnopqrstuvwxyz', 'last', true)).toThrow(HTTPError[400]);
  });

  test('INVALID Name: Last name more than 20 characters', () => {
    expect(() => requestDetailsEdit(token, 'first.last8@gmail.com', 'a',
      'abcdefghijklmnopqrstuvwxyz', true)).toThrow(HTTPError[400]);
  });

  test('INVALID Email: Does not satisfy validator.isEmail function', () => {
    expect(() => requestDetailsEdit(token, 'first..last@email',
      'first', 'last', true)).toThrow(HTTPError[400]);
  });

  test('INVALID details: Email already exists', () => {
    requestRegister('first.last2@gmail.com', 'Val1dPassword1', 'first', 'last');
    expect(() => requestDetailsEdit(token, 'first.last2@gmail.com', 'firs',
      'last', true)).toThrow(HTTPError[400]);
  });

  test('VALID token: Simple Case 1', () => {
    result = requestDetailsEdit(token, 'hayden.smith@unsw.edu.au', 'Hayden',
      'Smith', true);
    expect(Object.keys(result).length).toStrictEqual(0);
  });

  test('VALID token: Simple Case 2', () => {
    token = requestRegister('first.last2@gmail.com',
      'Val1dPassword2', 'first', 'last', true).token;
    result = requestDetailsEdit(token, 'hayden.smith@unsw.edu.au', 'Hayden',
      'Smith', true);

    expect(Object.keys(result).length).toStrictEqual(0);
  });

  test('VALID token: Simple Case 3', () => {
    token = requestRegister('first.last3@gmail.com',
      'Val1dPassword3', 'first', 'last', true).token;
    result = requestDetailsEdit(token, 'hayden.smith@unsw.edu.au', 'Hayden',
      'Smith', true);

    expect(Object.keys(result).length).toStrictEqual(0);
  });

  test('VALID token: Simple Case 4', () => {
    token = requestRegister('first.last4@gmail.com',
      'Val1dPassword4', 'first', 'last', true).token;
    result = requestDetailsEdit(token, 'hayden.smith@unsw.edu.au', 'Hayden',
      'Smith', true);

    expect(Object.keys(result).length).toStrictEqual(0);
  });
});

/// ////////////////////////////////////////////////////////////////////////////
/// //////////////////////// adminUserPasswordEdit /////////////////////////////
/// ////////////////////////////////////////////////////////////////////////////

describe('adminUserPasswordEdit Version 2', () => {
  let result: Record<string, never> | ErrorObject;
  let token: number;

  beforeEach(() => {
    token = requestRegister('first.last@gmail.com', 'Val1dPassword', 'first',
      'last').token;
  });

  test('INVALID token: Out of the possible range', () => {
    expect(() => requestPasswordEdit(
      0, 'Val1dPassword', 'NewVal1dPassword'
    )).toThrow(HTTPError[401]);
  });

  test('INVALID token: Incorrect ID', () => {
    expect(() => requestPasswordEdit(
      token + 1, 'Val1dPassword', 'NewVal1dPass'
    )).toThrow(HTTPError[401]);
  });

  test('INVALID Password: No numbers', () => {
    expect(() => requestPasswordEdit(
      token, 'Val1dPassword', 'newpassword'
    )).toThrow(HTTPError[400]);
  });

  test('INVALID Password: No letters', () => {
    expect(() => requestPasswordEdit(
      token, 'Val1dPassword', '1234567890'
    )).toThrow(HTTPError[400]);
  });

  test('INVALID Password: Less than 8 characters', () => {
    expect(() => requestPasswordEdit(
      token, 'Val1dPassword', 'newp0ss'
    )).toThrow(HTTPError[400]);
  });

  test('INVALID Password: Not changed', () => {
    requestPasswordEdit(token, 'Val1dPassword', 'NewVal1dPass');

    expect(() => requestPasswordEdit(
      token, 'NewVal1dPass', 'Val1dPassword'
    )).toThrow(HTTPError[400]);
  });

  test('INVALID Password: Used before', () => {
    requestPasswordEdit(token, 'Val1dPassword', 'newpass123');
    requestPasswordEdit(token, 'newpass123', 'newnewpass123');

    expect(() => requestPasswordEdit(
      token, 'newnewpass123', 'Val1dPassword'
    )).toThrow(HTTPError[400]);
  });

  test('INVALID Password: Given old password is wrong', () => {
    expect(() => requestPasswordEdit(
      token, 'Val0dPassword', 'NewVal1dPass'
    )).toThrow(HTTPError[400]);
  });

  test('VALID token: Simple Case 1', () => {
    result = requestPasswordEdit(token, 'Val1dPassword', 'NewVal1dPass');
    expect(Object.keys(result).length).toStrictEqual(0);

    const result2 = requestLogin('first.last@gmail.com', 'NewVal1dPass');
    expect(result2).toMatchObject({ token: expect.any(Number) });
  });

  test('VALID token: Simple Case 2', () => {
    token = requestRegister('first.last2@gmail.com',
      'Val1dPassword2', 'first', 'last').token;
    result = requestPasswordEdit(token, 'Val1dPassword2', 'NEWVal1dPassword2');
    expect(Object.keys(result).length).toStrictEqual(0);

    const result2 = requestLogin('first.last2@gmail.com', 'NEWVal1dPassword2');
    expect(result2).toMatchObject({ token: expect.any(Number) });
  });

  test('VALID token: Simple Case 3', () => {
    token = requestRegister('first.last2@gmail.com',
      'Val1dPassword2', 'first', 'last').token;
    result = requestPasswordEdit(token, 'Val1dPassword2', 'Val1dPassword');
    expect(Object.keys(result).length).toStrictEqual(0);
  });
});

describe('adminUserPasswordEdit Version 1', () => {
  let result: Record<string, never> | ErrorObject;
  let token: number;

  beforeEach(() => {
    token = requestRegister('first.last@gmail.com', 'Val1dPassword', 'first',
      'last', true).token;
  });

  test('INVALID token: Out of the possible range', () => {
    expect(() => requestPasswordEdit(
      0, 'Val1dPassword', 'NewVal1dPassword', true
    )).toThrow(HTTPError[401]);
  });

  test('INVALID token: Incorrect ID', () => {
    expect(() => requestPasswordEdit(
      token + 1, 'Val1dPassword', 'NewVal1dPass', true
    )).toThrow(HTTPError[401]);
  });

  test('INVALID Password: No numbers', () => {
    expect(() => requestPasswordEdit(
      token, 'Val1dPassword', 'newpassword', true
    )).toThrow(HTTPError[400]);
  });

  test('INVALID Password: No letters', () => {
    expect(() => requestPasswordEdit(
      token, 'Val1dPassword', '1234567890', true
    )).toThrow(HTTPError[400]);
  });

  test('INVALID Password: Less than 8 characters', () => {
    expect(() => requestPasswordEdit(
      token, 'Val1dPassword', 'newp0ss', true
    )).toThrow(HTTPError[400]);
  });

  test('INVALID Password: Not changed', () => {
    requestPasswordEdit(token, 'Val1dPassword', 'NewVal1dPass');

    expect(() => requestPasswordEdit(
      token, 'NewVal1dPass', 'Val1dPassword', true
    )).toThrow(HTTPError[400]);
  });

  test('INVALID Password: Used before', () => {
    requestPasswordEdit(token, 'Val1dPassword', 'newpass123');
    requestPasswordEdit(token, 'newpass123', 'newnewpass123');

    expect(() => requestPasswordEdit(
      token, 'newnewpass123', 'Val1dPassword', true
    )).toThrow(HTTPError[400]);
  });

  test('INVALID Password: Given old password is wrong', () => {
    expect(() => requestPasswordEdit(
      token, 'Val0dPassword', 'NewVal1dPass', true
    )).toThrow(HTTPError[400]);
  });

  test('VALID token: Simple Case 1', () => {
    result = requestPasswordEdit(token, 'Val1dPassword', 'NewVal1dPass', true);
    expect(Object.keys(result).length).toStrictEqual(0);

    const result2 = requestLogin('first.last@gmail.com', 'NewVal1dPass', true);
    expect(result2).toMatchObject({ token: expect.any(Number) });
  });

  test('VALID token: Simple Case 2', () => {
    token = requestRegister('first.last2@gmail.com',
      'Val1dPassword2', 'first', 'last', true).token;
    result = requestPasswordEdit(
      token, 'Val1dPassword2', 'NEWVal1dPassword2', true
    );
    expect(Object.keys(result).length).toStrictEqual(0);

    const result2 = requestLogin(
      'first.last2@gmail.com', 'NEWVal1dPassword2', true
    );
    expect(result2).toMatchObject({ token: expect.any(Number) });
  });

  test('VALID token: Simple Case 3', () => {
    token = requestRegister('first.last2@gmail.com',
      'Val1dPassword2', 'first', 'last', true).token;
    result = requestPasswordEdit(
      token, 'Val1dPassword2', 'Val1dPassword', true
    );
    expect(Object.keys(result).length).toStrictEqual(0);
  });
});
