import { adminAuthLogin } from './auth.js';
import { adminAuthRegister } from './auth/js';

beforeEach(() => {
    clear();
});

test('Test Non-Existing Emails', () => {
    // Email does not exists
    let result = adminAuthLogin('nonexisting@gmail.com', 'Val1dPassword');
    expect(result).toMatchObject({ error: expect.any(String) });

    // Email is empty
    let result = adminAuthLogin('', 'Val1dPassword');
    expect(result).toMatchObject({ error: expect.any(String) });

});


test('Test Incorrect Password', () => {
    // Dependency on adminAuthRegister
    let password1 = adminAuthRegister('first.last1@gmail.com', 'Val1dPassword1', 'first1', 'last1').password;
    let password2 = adminAuthRegister('first.last2@gmail.com', 'Val1dPassword2', 'first2', 'last2').password;
    let password3 = adminAuthRegister('first.last3@gmail.com', 'Val1dPassword3', 'first3', 'last3').password;
    let password4 = adminAuthRegister('first.last4@gmail.com', 'Val1dPassword4', 'first4', 'last4').password;

    // Password does not match the given email
    let result = adminAuthLogin('first.last1@gmail.com', 'Val1dPasswoord');
    expect(result).toMatchObject({ error: expect.any(String) });

    let result = adminAuthLogin('first.last2@gmail.com', "Val1dPasswoord");
    expect(result).toMatchObject({ error: expect.any(String) });

    let result = adminAuthLogin('first.last3@gmail.com', "Val1dPasswoord");
    expect(result).toMatchObject({ error: expect.any(String) });

    let result = adminAuthLogin('first.last4@gmail.com', "Val1dPasswoord");
    expect(result).toMatchObject({ error: expect.any(String) });

    // Password is empty
    let result = adminAuthLogin('first.last4@gmail.com', '');
    expect(result).toMatchObject({ error: expect.any(String) });

});

test('Test Valid Email And Password', () => {
    // Dependency on adminAuthRegister
    let email1 = adminAuthRegister('first.last1@gmail.com', 'Val1dPassword1', 'first1', 'last1').email;
    let email2 = adminAuthRegister('first.last2@gmail.com', 'Val1dPassword2', 'first2', 'last2').email;
    let email3 = adminAuthRegister('first.last3@gmail.com', 'Val1dPassword3', 'first3', 'last3').email;
    let email4 = adminAuthRegister('first.last4@gmail.com', 'Val1dPassword4', 'first4', 'last4').email;

    let password1 = adminAuthRegister('first.last1@gmail.com', 'Val1dPassword1', 'first1', 'last1').password;
    let password2 = adminAuthRegister('first.last2@gmail.com', 'Val1dPassword2', 'first2', 'last2').password;
    let password3 = adminAuthRegister('first.last3@gmail.com', 'Val1dPassword3', 'first3', 'last3').password;
    let password4 = adminAuthRegister('first.last4@gmail.com', 'Val1dPassword4', 'first4', 'last4').password;

    
    let result = adminAuthLogin('email1', 'password1');
    expect(result).toMatchObject({ authUserId: expect.any(Number) });

    let result = adminAuthLogin('email2', 'password2');
    expect(result).toMatchObject({ authUserId: expect.any(Number) });

    let result = adminAuthLogin('email3', 'password3');
    expect(result).toMatchObject({ authUserId: expect.any(Number) });

    let result = adminAuthLogin('email4', 'password4');
    expect(result).toMatchObject({ authUserId: expect.any(Number) });

});
