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
    let id1 = adminAuthRegister('first.last1@gmail.com', 'Val1dPassword1', 'first1', 'last1').authUserId;
    let id2 = adminAuthRegister('first.last2@gmail.com', 'Val1dPassword2', 'first2', 'last2').authUserId;
    let id3 = adminAuthRegister('first.last3@gmail.com', 'Val1dPassword3', 'first3', 'last3').authUserId;
    let id4 = adminAuthRegister('first.last4@gmail.com', 'Val1dPassword4', 'first4', 'last4').authUserId;

    // Password does not match the given email
    let result = adminAuthLogin('first.last1@gmail.com', 'Val1dPasswoord');
    expect(result).toMatchObject({ error: id1 });

    let result = adminAuthLogin('first.last2@gmail.com', "Val1dPasswoord");
    expect(result).toMatchObject({ error: id2 });

    let result = adminAuthLogin('first.last3@gmail.com', "Val1dPasswoord");
    expect(result).toMatchObject({ error: id3 });

    let result = adminAuthLogin('first.last4@gmail.com', "Val1dPasswoord");
    expect(result).toMatchObject({ error: id4 });

    // Password is empty
    let result = adminAuthLogin('first.last4@gmail.com', '');
    expect(result).toMatchObject({ error: expect.any(String) });

});

test('Test Valid Email And Password', () => {
    // Dependency on adminAuthRegister
    let id1 = adminAuthRegister('first.last1@gmail.com', 'Val1dPassword1', 'first1', 'last1').authUserId;
    let id2 = adminAuthRegister('first.last2@gmail.com', 'Val1dPassword2', 'first2', 'last2').authUserId;
    let id3 = adminAuthRegister('first.last3@gmail.com', 'Val1dPassword3', 'first3', 'last3').authUserId;
    let id4 = adminAuthRegister('first.last4@gmail.com', 'Val1dPassword4', 'first4', 'last4').authUserId;
    
    let result = adminAuthLogin('first.last1@gmail.com', 'Val1dPassword1');
    expect(result).toMatchObject({ authUserId: id1 });

    let result = adminAuthLogin('first.last2@gmail.com', 'Val1dPassword2');
    expect(result).toMatchObject({ authUserId: id2 });

    let result = adminAuthLogin('first.last3@gmail.com', 'Val1dPassword3');
    expect(result).toMatchObject({ authUserId: id3 });

    let result = adminAuthLogin('first.last4@gmail.com', 'Val1dPassword4');
    expect(result).toMatchObject({ authUserId: id4 });

});
