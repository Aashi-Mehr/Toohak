import { adminAuthRegister } from '../auth.js';
import { clear } from '../other.js';

beforeEach(() => {
    clear();
});

test('Test Invalid Passwords', () => {
    // Password does not contain at least one number and at least one letter
    let result = adminAuthRegister("first.last1@gmail.com", "invalidpassword",
                                   "first", "last");
    expect(result).toMatchObject({ error: expect.any(String) });

    result = adminAuthRegister("first.last2@gmail.com", "123456789",
                               "first", "last");
    expect(result).toMatchObject({ error: expect.any(String) });

    // Password is less than 8 characters
    result = adminAuthRegister("first.last3@gmail.com", "acb123", "first",
                               "last");
    expect(result).toMatchObject({ error: expect.any(String) });
});

test('Test Invalid Names', () => {
    // NameFirst contains characters other than lowercase letters, uppercase
    // letters, spaces, hyphens, or apostrophes
    let result = adminAuthRegister("first.last4@gmail.com", "Val1dPassword",
                                   "1nval1d first", "last");
    expect(result).toMatchObject({ error: expect.any(String) });

    // NameLast contains characters other than lowercase letters, uppercase
    // letters, spaces, hyphens, or apostrophes
    result = adminAuthRegister("first.last5@gmail.com", "Val1dPassword",
                               "first", "1nval1d last");
    expect(result).toMatchObject({ error: expect.any(String) });

    // NameFirst is less than 2 characters or more than 20 characters
    result = adminAuthRegister("first.last6@gmail.com", "Val1dPassword", "a",
                               "last");
    expect(result).toMatchObject({ error: expect.any(String) });
    result = adminAuthRegister("first.last7@gmail.com", "Val1dPassword",
                               "abcdefghijklmnopqrstuvwxyz", "last");
    expect(result).toMatchObject({ error: expect.any(String) });

    // NameLast is less than 2 characters or more than 20 characters
    result = adminAuthRegister("first.last8@gmail.com", "Val1dPassword", "a",
                               "abcdefghijklmnopqrstuvwxyz");
    expect(result).toMatchObject({ error: expect.any(String) });
    result = adminAuthRegister("first.last9@gmail.com", "Val1dPassword",
                               "first", "a");
    expect(result).toMatchObject({ error: expect.any(String) });
});

test('Test Invalid Emails', () => {
    // Email does not satisfy validator.isEmail function
    let result = adminAuthRegister("first..last@email", "Val1dPassword",
                                   "first", "last");
    expect(result).toMatchObject({ error: expect.any(String) });

    // DEPENDENCY on adminAuthRegister
    result = adminAuthRegister("first.last@gmail.com", "Val1dPassword",
                               "first", "last");
    expect(result).toMatchObject({ authUserId: expect.any(Number) });

    // Email address is used by another user
    result = adminAuthRegister("first.last@gmail.com", "Val1dPassword",
                               "firstName", "lastName");
    expect(result).toMatchObject({ error: expect.any(String) });
});

test('Test Valid Registrations', () => {
    // DEPENDENCY on adminAuthRegister
    let result = adminAuthRegister("first.last10@gmail.com", "Val1dPassword",
                                   "first", "last");
    expect(result).toMatchObject({ authUserId: expect.any(Number) });

    // Ensuring that the registration is email dependent, not name
    result = adminAuthRegister("first.last@gmail.com", "Val1dPassword",
                               "first", "last");
    expect(result).toMatchObject({ authUserId: expect.any(Number) });
});
