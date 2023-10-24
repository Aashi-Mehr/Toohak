import request from 'sync-request-curl';
import { port, url } from '../config.json';
import {
  Token,
  ErrorObject,
  Details
} from '../dataStore';
import {
  requestRegister,
  requestLogin,
  requestDetails,
  requestLogout,
  requestDetailsEdit,
  requestPasswordEdit,
  requestClear
} from './testHelper';

const SERVER_URL = `${url}:${port}`;

/// ////////////////////////////////////////////////////////////////////////////
/// //////////////////////////////// Tests /////////////////////////////////////
/// ////////////////////////////////////////////////////////////////////////////

// Clearing the datastore, so that the tests are independent of previous data
beforeEach(() => {
  requestClear();
});

describe('adminAuthRegister', () => {
  let result: Token;

  test('INVALID Password: No numbers', () => {
    result = requestRegister('first.last1@gmail.com', 'invalidpassword',
      'first', 'last');
    expect(result.token).toStrictEqual(-1);
  });

  test('INVALID Password: No letters', () => {
    result = requestRegister('first.last2@gmail.com', '123456789', 'first',
      'last');
    expect(result.token).toStrictEqual(-1);
  });

  test('INVALID Password: Less than 8 characters', () => {
    result = requestRegister('first.last3@gmail.com', 'acb123', 'first',
      'last');
    expect(result.token).toStrictEqual(-1);
  });

  test('INVALID Name: First name contains numbers', () => {
    result = requestRegister('first.last4@gmail.com', 'Val1dPassword',
      '1nval1d first', 'last');
    expect(result.token).toStrictEqual(-1);
  });

  test('INVALID Name: Last name contains numbers', () => {
    result = requestRegister('first.last5@gmail.com', 'Val1dPassword',
      'first', '1nval1d last');
    expect(result.token).toStrictEqual(-1);
  });

  test('INVALID Name: First name less than 2 characters', () => {
    result = requestRegister('first.last6@gmail.com', 'Val1dPassword', 'a',
      'last');
    expect(result.token).toStrictEqual(-1);
  });

  test('INVALID Name: Last name less than 2 characters', () => {
    result = requestRegister('first.last9@gmail.com', 'Val1dPassword',
      'first', 'a');
    expect(result.token).toStrictEqual(-1);
  });

  test('INVALID Name: First name more than 20 characters', () => {
    result = requestRegister('first.last7@gmail.com', 'Val1dPassword',
      'abcdefghijklmnopqrstuvwxyz', 'last');
    expect(result.token).toStrictEqual(-1);
  });

  test('INVALID Name: Last name more than 20 characters', () => {
    result = requestRegister('first.last8@gmail.com', 'Val1dPassword', 'a',
      'abcdefghijklmnopqrstuvwxyz');
    expect(result.token).toStrictEqual(-1);
  });

  test('INVALID Email: Does not satisfy validator.isEmail function', () => {
    result = requestRegister('first..last@email', 'Val1dPassword',
      'first', 'last');
    expect(result.token).toStrictEqual(-1);
  });

  test('INVALID Email: Used by another user', () => {
    requestRegister('first.last@gmail.com', 'Val1dPassword', 'first',
      'last');

    result = requestRegister('first.last@gmail.com', 'Val1dPassword',
      'firstName', 'lastName');
    expect(result.token).toStrictEqual(-1);
  });

  test('VALID Registration: Case 1', () => {
    result = requestRegister('first.last10@gmail.com', 'Val1dPassword',
      'first', 'last');
    expect(result.token).toBeGreaterThan(0);
  });

  test('VALID Registration: Case 2', () => {
    result = requestRegister('first.last@gmail.com', 'Val1dPassword',
      'first', 'last');
    expect(result.token).toBeGreaterThan(0);
  });

  test('VALID Registration: Case 3', () => {
    result = requestRegister('first.last2@gmail.com', 'Val1dPassword',
      'firstName', 'lastName');
    expect(result.token).toBeGreaterThan(0);
  });
});

/**
  * Potentialld add more tests for valid cases
  */
describe('adminAuthLogin', () => {
  let result: Token;

  test('INVALID Email: Case 1', () => {
    // Email does not exist
    result = requestLogin('nonexisting@gmail.com', 'Val1dPassword');
    expect(result).toMatchObject({ token: -1 });
  });

  test('INVALID Email: Case 2', () => {
    // Email is empty
    result = requestLogin('', 'Val1dPassword');
    expect(result).toMatchObject({ token: -1 });
  });

  test('INVALID Password: Case 1', () => {
    requestRegister('first.last1@gmail.com', 'Val1dPassword1', 'first', 'last');
    result = requestLogin('first.last1@gmail.com', 'Val1dPasswoord');
    expect(result).toMatchObject({ token: -1 });
  });

  test('INVALID Password: Case 2', () => {
    requestRegister('first.last2@gmail.com', 'Val1dPassword2', 'first', 'last');
    result = requestLogin('first.last2@gmail.com', 'Val1dPasswoord');
    expect(result).toMatchObject({ token: -1 });
  });

  test('INVALID Password: Case 3', () => {
    requestRegister('first.last3@gmail.com', 'Val1dPassword3', 'first', 'last');
    result = requestLogin('first.last3@gmail.com', 'Val1dPasswoord');
    expect(result).toMatchObject({ token: -1 });
  });

  test('INVALID Password: Case 4', () => {
    requestRegister('first.last4@gmail.com', 'Val1dPassword4', 'first', 'last');
    result = requestLogin('first.last4@gmail.com', 'Val1dPasswoord');
    expect(result).toMatchObject({ token: -1 });
  });

  test('INVALID Password: Case 5', () => {
    requestRegister('first.last4@gmail.com', 'Val1dPassword4', 'first', 'last');
    result = requestLogin('first.last4@gmail.com', '');
    expect(result).toMatchObject({ token: -1 });
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

describe('adminUserDetails', () => {
  let result: Details | ErrorObject;
  let token: number;

  test('INVALID token: Out of the possible range', () => {
    expect(requestDetails(0)).toMatchObject({ error: expect.any(String) });
  });

  test('INVALID token: Incorrect ID', () => {
    token = requestRegister('first.last@gmail.com', 'Val1dPassword', 'first',
      'last').token;
    result = requestDetails(token + 1);
    expect(result).toMatchObject({ error: expect.any(String) });
  });

  test('VALID token: Simple Case 1', () => {
    token = requestRegister('first.last1@gmail.com', 'Val1dPassword1', 'first',
      'last').token;
    result = requestDetails(token);

    expect(result).toMatchObject({
      user:
      {
        userId: expect.any(Number),
        name: 'first last',
        email: 'first.last1@gmail.com',
        numSuccessfulLogins: 0,
        numFailedPasswordsSinceLastLogin: 0,
      }
    });
  });

  test('VALID token: Simple Case 2', () => {
    token = requestRegister('first.last2@gmail.com',
      'Val1dPassword2', 'first', 'last').token;
    result = requestDetails(token);

    expect(result).toMatchObject({
      user:
      {
        userId: expect.any(Number),
        name: 'first last',
        email: 'first.last2@gmail.com',
        numSuccessfulLogins: 0,
        numFailedPasswordsSinceLastLogin: 0,
      }
    });
  });

  test('VALID token: Simple Case 3', () => {
    token = requestRegister('first.last3@gmail.com',
      'Val1dPassword3', 'first', 'last').token;
    result = requestDetails(token);

    expect(result).toMatchObject({
      user:
      {
        userId: expect.any(Number),
        name: 'first last',
        email: 'first.last3@gmail.com',
        numSuccessfulLogins: 0,
        numFailedPasswordsSinceLastLogin: 0,
      }
    });
  });

  test('VALID token: Simple Case 4', () => {
    token = requestRegister('first.last4@gmail.com',
      'Val1dPassword4', 'first', 'last').token;
    result = requestDetails(token);

    expect(result).toMatchObject({
      user:
      {
        userId: expect.any(Number),
        name: 'first last',
        email: 'first.last4@gmail.com',
        numSuccessfulLogins: 0,
        numFailedPasswordsSinceLastLogin: 0,
      }
    });
  });

  test('VALID token: Complex Case 1', () => {
    requestRegister('first.last1@gmail.com', 'Val1dPassword1', 'first', 'last');
    token = requestLogin('first.last1@gmail.com', 'Val1dPassword1').token;

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

  test('VALID token: Complex Case 2', () => {
    requestRegister('first.last1@gmail.com', 'Val1dPassword1', 'first', 'last');
    token = requestLogin('first.last1@gmail.com', 'Val1dPassword1').token;
    requestLogin('first.last1@gmail.com', 'INVal1dPassword1');

    result = requestDetails(token);
    expect(result).toMatchObject({
      user:
      {
        userId: expect.any(Number),
        name: 'first last',
        email: 'first.last1@gmail.com',
        numSuccessfulLogins: 1,
        numFailedPasswordsSinceLastLogin: 1,
      }
    });
  });

  test('VALID token: Complex Case 3', () => {
    requestRegister('first.last1@gmail.com', 'Val1dPassword1', 'first', 'last');
    token = requestLogin('first.last1@gmail.com', 'Val1dPassword1').token;
    requestLogin('first.last1@gmail.com', 'INVal1dPassword1');
    requestLogin('first.last1@gmail.com', 'INVal1dPassword1');

    result = requestDetails(token);
    expect(result).toMatchObject({
      user:
      {
        userId: expect.any(Number),
        name: 'first last',
        email: 'first.last1@gmail.com',
        numSuccessfulLogins: 1,
        numFailedPasswordsSinceLastLogin: 2,
      }
    });
  });

  test('VALID token: Complex Case 4', () => {
    requestRegister('first.last1@gmail.com', 'Val1dPassword1', 'first', 'last');
    requestLogin('first.last1@gmail.com', 'Val1dPassword1');
    requestLogin('first.last1@gmail.com', 'INVal1dPassword1');
    requestLogin('first.last1@gmail.com', 'INVal1dPassword1');
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
});

describe('adminAuthLogout', () => {
  let result: ErrorObject | Record<string, never>;
  let token: number;

  test('INVALID Token: Doesn\'t Exist', () => {
    // Logging out a token that doesn't exist
    token = requestRegister('first.last1@gmail.com', 'invalidpassword',
      'first', 'last').token;
    result = requestLogout(token + 1);
    expect(result).toMatchObject({ error: expect.any(String) });
  });

  test('INVALID Token: Outside valid range', () => {
    // Logging out a token that's outside the valid range
    result = requestLogout(0);
    expect(result).toMatchObject({ error: expect.any(String) });
  });

  test('INVALID Token: Already Logged Out', () => {
    // Logging out an invalid token
    token = requestRegister('first.last1@gmail.com', 'Val1dPassword',
      'first', 'last').token;
    requestLogout(token);
    result = requestLogout(token);
    expect(result).toMatchObject({ error: expect.any(String) });
  });

  test('VALID Token: Simple Case 1', () => {
    token = requestRegister('first.last1@gmail.com', 'Val1dPassword1',
      'first', 'last').token;
    result = requestLogout(token);
    expect(Object.keys(result).length).toStrictEqual(0);
  });

  test('VALID Token: Simple Case 2', () => {
    token = requestRegister('first.last2@gmail.com', 'Val1dPassword2',
      'first', 'last').token;
    result = requestLogout(token);
    expect(Object.keys(result).length).toStrictEqual(0);
  });

  test('VALID Token: Simple Case 3', () => {
    token = requestRegister('first.last3@gmail.com', 'Val1dPassword3',
      'first', 'last').token;
    result = requestLogout(token);
    expect(Object.keys(result).length).toStrictEqual(0);
  });

  test('VALID Token: Complex Case 1', () => {
    requestRegister('first.last1@gmail.com', 'Val1dPassword1', 'first', 'last');
    token = requestLogin('first.last1@gmail.com', 'Val1dPassword1').token;
    result = requestLogout(token);
    expect(Object.keys(result).length).toStrictEqual(0);
  });

  test('VALID Token: Complex Case 2', () => {
    token = requestRegister('first.last2@gmail.com', 'Val1dPassword2',
      'first', 'last').token;
    requestLogin('first.last2@gmail.com', 'Val1dPassword2');
    result = requestLogout(token);
    expect(Object.keys(result).length).toStrictEqual(0);
  });

  test('VALID Token: Complex Case 3', () => {
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

describe('adminUserDetailsEdit', () => {
  let result: Record<string, never> | ErrorObject;
  let token: number;

  beforeEach(() => {
    token = requestRegister('first.last@gmail.com', 'Val1dPassword', 'first',
      'last').token;
  });

  test('INVALID token: Out of the possible range', () => {
    result = requestDetailsEdit(0, 'hayden.smith@unsw.edu.au', 'Hayden',
      'Smith');
    expect(result).toMatchObject({ error: expect.any(String) });
  });

  test('INVALID token: Incorrect ID', () => {
    result = requestDetailsEdit(token + 1, 'hayden.smith@unsw.edu.au', 'Hayden',
      'Smith');
    expect(result).toMatchObject({ error: expect.any(String) });
  });

  test('INVALID Name: First name contains numbers', () => {
    result = requestDetailsEdit(token, 'first.last4@gmail.com', '1nval1d first',
      'last');
    expect(result).toMatchObject({ error: expect.any(String) });
  });

  test('INVALID Name: Last name contains numbers', () => {
    result = requestDetailsEdit(token, 'first.last5@gmail.com', 'first',
      '1nval1d last');
    expect(result).toMatchObject({ error: expect.any(String) });
  });

  test('INVALID Name: First name less than 2 characters', () => {
    result = requestDetailsEdit(token, 'first.last6@gmail.com', 'a', 'last');
    expect(result).toMatchObject({ error: expect.any(String) });
  });

  test('INVALID Name: Last name less than 2 characters', () => {
    result = requestDetailsEdit(token, 'first.last9@gmail.com', 'first', 'a');
    expect(result).toMatchObject({ error: expect.any(String) });
  });

  test('INVALID Name: First name more than 20 characters', () => {
    result = requestDetailsEdit(token, 'first.last7@gmail.com',
      'abcdefghijklmnopqrstuvwxyz', 'last');
    expect(result).toMatchObject({ error: expect.any(String) });
  });

  test('INVALID Name: Last name more than 20 characters', () => {
    result = requestDetailsEdit(token, 'first.last8@gmail.com', 'a',
      'abcdefghijklmnopqrstuvwxyz');
    expect(result).toMatchObject({ error: expect.any(String) });
  });

  test('INVALID Email: Does not satisfy validator.isEmail function', () => {
    result = requestDetailsEdit(token, 'first..last@email',
      'first', 'last');
    expect(result).toMatchObject({ error: expect.any(String) });
  });

  test('INVALID details: Email already exists', () => {
    requestRegister('first.last2@gmail.com', 'Val1dPassword1', 'first', 'last');
    result = requestDetailsEdit(token, 'first.last2@gmail.com', 'firs', 'last');
    expect(result).toMatchObject({ error: expect.any(String) });
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

describe('adminUserPasswordEdit', () => {
  let result: Record<string, never> | ErrorObject;
  let token: number;

  beforeEach(() => {
    token = requestRegister('first.last@gmail.com', 'Val1dPassword', 'first',
      'last').token;
  });

  test('INVALID token: Out of the possible range', () => {
    result = requestPasswordEdit(0, 'Val1dPassword', 'NewVal1dPassword');
    expect(result).toMatchObject({ error: expect.any(String) });
  });

  test('INVALID token: Incorrect ID', () => {
    result = requestPasswordEdit(token + 1, 'Val1dPassword', 'NewVal1dPass');
    expect(result).toMatchObject({ error: expect.any(String) });
  });

  test('INVALID Password: No numbers', () => {
    result = requestPasswordEdit(token, 'Val1dPassword', 'newpassword');
    expect(result).toMatchObject({ error: expect.any(String) });
  });

  test('INVALID Password: No letters', () => {
    result = requestPasswordEdit(token, 'Val1dPassword', '1234567890');
    expect(result).toMatchObject({ error: expect.any(String) });
  });

  test('INVALID Password: Less than 8 characters', () => {
    result = requestPasswordEdit(token, 'Val1dPassword', 'newpass');
    expect(result).toMatchObject({ error: expect.any(String) });
  });

  test('INVALID Password: Not changed', () => {
    requestPasswordEdit(token, 'Val1dPassword', 'NewVal1dPass');
    result = requestPasswordEdit(token, 'NewVal1dPass', 'Val1dPassword');
    expect(result).toMatchObject({ error: expect.any(String) });
  });

  test('INVALID Password: Used before', () => {
    result = requestPasswordEdit(token, 'Val1dPassword', 'newpass');
    expect(result).toMatchObject({ error: expect.any(String) });
  });

  test('VALID token: Simple Case 1', () => {
    result = requestPasswordEdit(token, 'Val1dPassword', 'NewVal1dPass');
    expect(Object.keys(result).length).toStrictEqual(0);
  });

  test('VALID token: Simple Case 2', () => {
    token = requestRegister('first.last2@gmail.com',
      'Val1dPassword2', 'first', 'last').token;
    result = requestPasswordEdit(token, 'Val1dPassword2', 'NEWVal1dPassword2');
    expect(Object.keys(result).length).toStrictEqual(0);
  });

  test('VALID token: Simple Case 3', () => {
    token = requestRegister('first.last2@gmail.com',
      'Val1dPassword2', 'first', 'last').token;
    result = requestPasswordEdit(token, 'Val1dPassword2', 'Val1dPassword');
    expect(Object.keys(result).length).toStrictEqual(0);
  });
});
