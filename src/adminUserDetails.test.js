import { adminUserDetails } from './auth.js';
import { adminAuthRegister } from './auth.js';

beforeEach(() => {
  clear();
});

test('Test Invalid User IDs', () => {
    // authUserId is not an integer
    let result = adminUserDetails("12345");
    expect(result).toMatchObject({ error: expect.any(String) });

    result = adminUserDetails("67890");
    expect(result).toMatchObject({ error: expect.any(String) });

    // authUserId is out of the range of User IDs
    result = adminUserDetails(0);
    expect(result).toMatchObject({ error: expect.any(String) });
});

test('Test Valid User IDs', () => {
    // DEPENDENCY on adminAuthRegister
    let authUserId1 = adminAuthRegister("first.last1@gmail.com",
                      "Val1dPassword1", "first1", "last1").authUserId;
    let authUserId2 = adminAuthRegister("first.last2@gmail.com",
                      "Val1dPassword2", "first2", "last2").authUserId;
    let authUserId3 = adminAuthRegister("first.last3@gmail.com",
                      "Val1dPassword3", "first3", "last3").authUserId;
    let authUserId4 = adminAuthRegister("first.last4@gmail.com",
                      "Val1dPassword4", "first4", "last4").authUserId;
    
    let result = adminUserDetails(authUserId1);
    expect(result).toMatchObject({ user:
        {
          userId: authUserId1,
          name: "first1 last1",
          email: "first.last1@gmail.com",
          numSuccessfulLogins: 0,
          numFailedPasswordsSinceLastLogin: 0,
        }
    });

    result = adminUserDetails(authUserId2);
    expect(result).toMatchObject({ user:
        {
          userId: authUserId2,
          name: "first2 last2",
          email: "first.last2@gmail.com",
          numSuccessfulLogins: 0,
          numFailedPasswordsSinceLastLogin: 0,
        }
    });

    result = adminUserDetails(authUserId3);
    expect(result).toMatchObject({ user:
        {
          userId: authUserId3,
          name: "first3 last3",
          email: "first.last3@gmail.com",
          numSuccessfulLogins: 0,
          numFailedPasswordsSinceLastLogin: 0,
        }
    });

    result = adminUserDetails(authUserId4);
    expect(result).toMatchObject({ user:
        {
          userId: authUserId4,
          name: "first4 last4",
          email: "first.last4@gmail.com",
          numSuccessfulLogins: 0,
          numFailedPasswordsSinceLastLogin: 0,
        }
    });
});