import request from 'sync-request-curl';
import { port, url } from '../config.json';

const SERVER_URL = `${url}:${port}`;

/// /////////////////////////////////////////////////////////////////////////////
/// /////////////////////////////// Interfaces //////////////////////////////////
/// /////////////////////////////////////////////////////////////////////////////

interface ErrorObject {
  error : string
}

interface AuthUserId {
  authUserId : number
}

interface User {
  userId: number,
  name: string,
  email: string,
  numSuccessfulLogins: number,
  numFailedPasswordsSinceLastLogin: number
}

interface Details {
  user: User
}

/// /////////////////////////////////////////////////////////////////////////////
/// /////////////////////////// Wrapper Functions ///////////////////////////////
/// /////////////////////////////////////////////////////////////////////////////

// POST REGISTER Define wrapper function
function requestRegister(email: string, password: string, nameFirst: string,
  nameLast: string): AuthUserId {
  const res = request(
    'POST',
    SERVER_URL + '/v1/admin/auth/register',
    {
      json: {
        email: email,
        password: password,
        nameFirst: nameFirst,
        nameLast: nameLast
      }
    }
  );

  const result = JSON.parse(res.body.toString());

  if ('error' in result) return { authUserId: -1 };
  else return result;
}

// POST LOGIN Define wrapper function
function requestLogin(email: string, password: string): AuthUserId {
  const res = request(
    'POST',
    SERVER_URL + '/v1/admin/auth/login',
    {
      json: {
        email: email,
        password: password
      }
    }
  );

  const result = JSON.parse(res.body.toString());

  if ('error' in result) return { authUserId: -1 };
  else return result;
}

// GET DETAILS Define wrapper function
function requestDetails(authUserId: number): Details | ErrorObject {
  const res = request(
    'GET',
    SERVER_URL + '/v1/admin/user/details',
    {
      json: {
        authUserId: authUserId
      }
    }
  );

  return JSON.parse(res.body.toString());
}

/// /////////////////////////////////////////////////////////////////////////////
/// ///////////////////////////////// Tests /////////////////////////////////////
/// /////////////////////////////////////////////////////////////////////////////

// Clearing the datastore, so that the tests are independent of previous data
beforeEach(() => {
  const res = request(
    'DELETE',
    SERVER_URL + '/v1/clear',
    {
      qs: { }
    }
  );

  return JSON.parse(res.body.toString());
});

describe('adminAuthRegister', () => {
  let result: AuthUserId;

  test('INVALID Password: No numbers', () => {
    result = requestRegister('first.last1@gmail.com', 'invalidpassword',
      'first', 'last');
    expect(result.authUserId).toStrictEqual(-1);
  });

  test('INVALID Password: No letters', () => {
    result = requestRegister('first.last2@gmail.com', '123456789', 'first',
      'last');
    expect(result.authUserId).toStrictEqual(-1);
  });

  test('INVALID Password: Less than 8 characters', () => {
    result = requestRegister('first.last3@gmail.com', 'acb123', 'first',
      'last');
    expect(result.authUserId).toStrictEqual(-1);
  });

  test('INVALID Name: First name contains numbers', () => {
    result = requestRegister('first.last4@gmail.com', 'Val1dPassword',
      '1nval1d first', 'last');
    expect(result.authUserId).toStrictEqual(-1);
  });

  test('INVALID Name: Last name contains numbers', () => {
    result = requestRegister('first.last5@gmail.com', 'Val1dPassword',
      'first', '1nval1d last');
    expect(result.authUserId).toStrictEqual(-1);
  });

  test('INVALID Name: First name less than 2 characters', () => {
    result = requestRegister('first.last6@gmail.com', 'Val1dPassword', 'a',
      'last');
    expect(result.authUserId).toStrictEqual(-1);
  });

  test('INVALID Name: Last name less than 2 characters', () => {
    result = requestRegister('first.last9@gmail.com', 'Val1dPassword',
      'first', 'a');
    expect(result.authUserId).toStrictEqual(-1);
  });

  test('INVALID Name: First name more than 20 characters', () => {
    result = requestRegister('first.last7@gmail.com', 'Val1dPassword',
      'abcdefghijklmnopqrstuvwxyz', 'last');
    expect(result.authUserId).toStrictEqual(-1);
  });

  test('INVALID Name: Last name more than 20 characters', () => {
    result = requestRegister('first.last8@gmail.com', 'Val1dPassword', 'a',
      'abcdefghijklmnopqrstuvwxyz');
    expect(result.authUserId).toStrictEqual(-1);
  });

  test('INVALID Email: Does not satisfy validator.isEmail function', () => {
    result = requestRegister('first..last@email', 'Val1dPassword',
      'first', 'last');
    expect(result.authUserId).toStrictEqual(-1);
  });

  test('INVALID Email: Used by another user', () => {
    requestRegister('first.last@gmail.com', 'Val1dPassword', 'first',
      'last');

    result = requestRegister('first.last@gmail.com', 'Val1dPassword',
      'firstName', 'lastName');
    expect(result.authUserId).toStrictEqual(-1);
  });

  test('VALID Registration: Case 1', () => {
    result = requestRegister('first.last10@gmail.com', 'Val1dPassword',
      'first', 'last');
    expect(result.authUserId).toBeGreaterThan(0);
  });

  test('VALID Registration: Case 2', () => {
    result = requestRegister('first.last@gmail.com', 'Val1dPassword',
      'first', 'last');
    expect(result.authUserId).toBeGreaterThan(0);
  });

  test('VALID Registration: Case 3', () => {
    result = requestRegister('first.last2@gmail.com', 'Val1dPassword',
      'firstName', 'lastName');
    expect(result.authUserId).toBeGreaterThan(0);
  });
});

describe('adminUserDetails', () => {
  let result: Details | ErrorObject;
  let authUserId: number;

  test('INVALID authUserId: Out of the possible range', () => {
    expect(requestDetails(0)).toMatchObject({ error: expect.any(String) });
  });

  test('INVALID authUserId: Incorrect ID', () => {
    authUserId = requestRegister('first.last@gmail.com', 'Val1dPassword',
      'first', 'last').authUserId;
    result = requestDetails(authUserId + 1);
    expect(result).toMatchObject({ error: expect.any(String) });
  });

  test('VALID authUserId: Simple Case 1', () => {
    authUserId = requestRegister('first.last1@gmail.com',
      'Val1dPassword1', 'first', 'last').authUserId;
    result = requestDetails(authUserId);

    expect(result).toMatchObject({
      user:
      {
        userId: authUserId,
        name: 'first last',
        email: 'first.last1@gmail.com',
        numSuccessfulLogins: 0,
        numFailedPasswordsSinceLastLogin: 0,
      }
    });
  });

  test('VALID authUserId: Simple Case 2', () => {
    authUserId = requestRegister('first.last2@gmail.com',
      'Val1dPassword2', 'first', 'last').authUserId;
    result = requestDetails(authUserId);

    expect(result).toMatchObject({
      user:
      {
        userId: authUserId,
        name: 'first last',
        email: 'first.last2@gmail.com',
        numSuccessfulLogins: 0,
        numFailedPasswordsSinceLastLogin: 0,
      }
    });
  });

  test('VALID authUserId: Simple Case 3', () => {
    authUserId = requestRegister('first.last3@gmail.com',
      'Val1dPassword3', 'first', 'last').authUserId;
    result = requestDetails(authUserId);

    expect(result).toMatchObject({
      user:
      {
        userId: authUserId,
        name: 'first last',
        email: 'first.last3@gmail.com',
        numSuccessfulLogins: 0,
        numFailedPasswordsSinceLastLogin: 0,
      }
    });
  });

  test('VALID authUserId: Simple Case 4', () => {
    authUserId = requestRegister('first.last4@gmail.com',
      'Val1dPassword4', 'first', 'last').authUserId;
    result = requestDetails(authUserId);

    expect(result).toMatchObject({
      user:
      {
        userId: authUserId,
        name: 'first last',
        email: 'first.last4@gmail.com',
        numSuccessfulLogins: 0,
        numFailedPasswordsSinceLastLogin: 0,
      }
    });
  });

  /*
  test('VALID authUserId: Complex Case 1', () => {
    authUserId = requestRegister('first.last1@gmail.com', 'Val1dPassword1',
      'first', 'last').authUserId;

    requestLogin('first.last1@gmail.com', 'Val1dPassword1');
    result = requestDetails(authUserId);
    expect(result).toMatchObject({
      user:
      {
        userId: authUserId,
        name: 'first last',
        email: 'first.last1@gmail.com',
        numSuccessfulLogins: 1,
        numFailedPasswordsSinceLastLogin: 0,
      }
    });
  });

  test('VALID authUserId: Complex Case 2', () => {
    authUserId = requestRegister('first.last1@gmail.com', 'Val1dPassword1',
      'first', 'last').authUserId;

    requestLogin('first.last1@gmail.com', 'Val1dPassword1');
    result = requestDetails(authUserId);

    requestLogin('first.last1@gmail.com', 'INVal1dPassword1');
    result = requestDetails(authUserId);
    expect(result).toMatchObject({
      user:
      {
        userId: authUserId,
        name: 'first last',
        email: 'first.last1@gmail.com',
        numSuccessfulLogins: 1,
        numFailedPasswordsSinceLastLogin: 1,
      }
    });
  });

  test('VALID authUserId: Complex Case 3', () => {
    authUserId = requestRegister('first.last1@gmail.com', 'Val1dPassword1',
      'first', 'last').authUserId;

    requestLogin('first.last1@gmail.com', 'Val1dPassword1');
    result = requestDetails(authUserId);

    requestLogin('first.last1@gmail.com', 'INVal1dPassword1');
    result = requestDetails(authUserId);

    requestLogin('first.last1@gmail.com', 'INVal1dPassword1');
    result = requestDetails(authUserId);
    expect(result).toMatchObject({
      user:
      {
        userId: authUserId,
        name: 'first last',
        email: 'first.last1@gmail.com',
        numSuccessfulLogins: 1,
        numFailedPasswordsSinceLastLogin: 2,
      }
    });
  });

  test('VALID authUserId: Complex Case 4', () => {
    authUserId = requestRegister('first.last1@gmail.com', 'Val1dPassword1',
      'first', 'last').authUserId;

    requestLogin('first.last1@gmail.com', 'Val1dPassword1');
    result = requestDetails(authUserId);

    requestLogin('first.last1@gmail.com', 'INVal1dPassword1');
    result = requestDetails(authUserId);

    requestLogin('first.last1@gmail.com', 'INVal1dPassword1');
    result = requestDetails(authUserId);

    requestLogin('first.last1@gmail.com', 'Val1dPassword1');
    result = requestDetails(authUserId);
    expect(result).toMatchObject({
      user:
      {
        userId: authUserId,
        name: 'first last',
        email: 'first.last1@gmail.com',
        numSuccessfulLogins: 2,
        numFailedPasswordsSinceLastLogin: 0,
      }
    });
  });
  */
});
