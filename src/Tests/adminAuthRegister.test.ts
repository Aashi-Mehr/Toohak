import request from 'sync-request-curl';
import { port, url } from '../config.json';

const SERVER_URL = `${url}:${port}`;

interface ErrorObject {
    error : string
}

interface AuthUserId {
    authUserId : number
}

// POST REGISTER Define wrapper function
function requestRegister(email: string, password: string, nameFirst: string,
                         nameLast: string) {
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

    return JSON.parse(res.body.toString());
}

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

describe('INVALID Passwords', () => {
    let result: ErrorObject | AuthUserId;

    test('No numbers', () => {
        result = requestRegister("first.last1@gmail.com", "invalidpassword",
                                 "first", "last");
        expect(result).toMatchObject({ error: expect.any(String) });
    });

    test('No letters', () => {
        result = requestRegister("first.last2@gmail.com", "123456789", "first",
                                 "last");
        expect(result).toMatchObject({ error: expect.any(String) });
    });

    test('Less than 8 characters', () => {
        result = requestRegister("first.last3@gmail.com", "acb123", "first",
                                 "last");
        expect(result).toMatchObject({ error: expect.any(String) });
    });
});

describe('INVALID Names', () => {
    let result: ErrorObject | AuthUserId;

    test('First name contains numbers', () => {
        result = requestRegister("first.last4@gmail.com", "Val1dPassword",
                                 "1nval1d first", "last");
        expect(result).toMatchObject({ error: expect.any(String) });
    });

    test('Last name contains numbers', () => {
        result = requestRegister("first.last5@gmail.com", "Val1dPassword",
                                 "first", "1nval1d last");
        expect(result).toMatchObject({ error: expect.any(String) });
    });

    test('First name less than 2 characters', () => {
        result = requestRegister("first.last6@gmail.com", "Val1dPassword", "a",
                                 "last");
        expect(result).toMatchObject({ error: expect.any(String) });
    });

    test('Last name less than 2 characters', () => {
        result = requestRegister("first.last9@gmail.com", "Val1dPassword",
                                 "first", "a");
        expect(result).toMatchObject({ error: expect.any(String) });
    });

    test('First name more than 20 characters', () => {
        result = requestRegister("first.last7@gmail.com", "Val1dPassword",
                                 "abcdefghijklmnopqrstuvwxyz", "last");
        expect(result).toMatchObject({ error: expect.any(String) });
    });

    test('Last name more than 20 characters', () => {
        result = requestRegister("first.last8@gmail.com", "Val1dPassword", "a",
                                 "abcdefghijklmnopqrstuvwxyz");
        expect(result).toMatchObject({ error: expect.any(String) });
    });
});

describe('INVALID Emails', () => {
    let result: ErrorObject | AuthUserId;

    test('Does not satisfy validator.isEmail function', () => {
        result = requestRegister("first..last@email", "Val1dPassword",
                                 "first", "last");
        expect(result).toMatchObject({ error: expect.any(String) });
    });

    test('Used by another user', () => {
        requestRegister("first.last@gmail.com", "Val1dPassword", "first",
                        "last");

        result = requestRegister("first.last@gmail.com", "Val1dPassword",
                                 "firstName", "lastName");
        expect(result).toMatchObject({ error: expect.any(String) });
    });
});

describe('VALID Registrations', () => {
    let result: ErrorObject | AuthUserId;

    test('Valid Case 1', () => {
        result = requestRegister("first.last10@gmail.com", "Val1dPassword",
                                 "first", "last");
        expect(result).toMatchObject({ authUserId: expect.any(Number) });
    });

    test('Valid Case 2', () => {
        result = requestRegister("first.last@gmail.com", "Val1dPassword",
                                 "first", "last");
        expect(result).toMatchObject({ authUserId: expect.any(Number) });
    });

    test('Valid Case 3', () => {
        result = requestRegister("first.last2@gmail.com", "Val1dPassword",
                                 "firstName", "lastName");
        expect(result).toMatchObject({ authUserId: expect.any(Number) });
    });
});
