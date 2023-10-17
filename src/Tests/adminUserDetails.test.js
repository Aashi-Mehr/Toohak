import { adminAuthLogin, adminUserDetails } from '../auth.js';
import { adminAuthRegister } from '../auth.js';
import { clear } from '../other.js';

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
                      "Val1dPassword1", 'first', 'last').authUserId;
    let authUserId2 = adminAuthRegister("first.last2@gmail.com",
                      "Val1dPassword2", 'first', 'last').authUserId;
    let authUserId3 = adminAuthRegister("first.last3@gmail.com",
                      "Val1dPassword3", 'first', 'last').authUserId;
    let authUserId4 = adminAuthRegister("first.last4@gmail.com",
                      "Val1dPassword4", 'first', 'last').authUserId;
    
    let result = adminUserDetails(authUserId1);
    expect(result).toMatchObject({ user:
        {
          userId: authUserId1,
          name: "first last",
          email: "first.last1@gmail.com",
          numSuccessfulLogins: 0,
          numFailedPasswordsSinceLastLogin: 0,
        }
    });

    result = adminUserDetails(authUserId2);
    expect(result).toMatchObject({ user:
        {
          userId: authUserId2,
          name: "first last",
          email: "first.last2@gmail.com",
          numSuccessfulLogins: 0,
          numFailedPasswordsSinceLastLogin: 0,
        }
    });

    result = adminUserDetails(authUserId3);
    expect(result).toMatchObject({ user:
        {
          userId: authUserId3,
          name: "first last",
          email: "first.last3@gmail.com",
          numSuccessfulLogins: 0,
          numFailedPasswordsSinceLastLogin: 0,
        }
    });

    result = adminUserDetails(authUserId4);
    expect(result).toMatchObject({ user:
        {
          userId: authUserId4,
          name: "first last",
          email: "first.last4@gmail.com",
          numSuccessfulLogins: 0,
          numFailedPasswordsSinceLastLogin: 0,
        }
    });
});

test('Test Multiple Logins', () => {
  // DEPENDENCY on adminAuthRegister
  let authUserId = adminAuthRegister("first.last1@gmail.com",
                    "Val1dPassword1", 'first', 'last').authUserId;

  adminAuthLogin("first.last1@gmail.com", "Val1dPassword1");
  let result = adminUserDetails(authUserId);
  expect(result).toMatchObject({ user:
      {
        userId: authUserId,
        name: "first last",
        email: "first.last1@gmail.com",
        numSuccessfulLogins: 1,
        numFailedPasswordsSinceLastLogin: 0,
      }
  });

  adminAuthLogin("first.last1@gmail.com", "INVal1dPassword1");
  result = adminUserDetails(authUserId);
  expect(result).toMatchObject({ user:
      {
        userId: authUserId,
        name: "first last",
        email: "first.last1@gmail.com",
        numSuccessfulLogins: 1,
        numFailedPasswordsSinceLastLogin: 1,
      }
  });

  adminAuthLogin("first.last1@gmail.com", "INVal1dPassword1");
  result = adminUserDetails(authUserId);
  expect(result).toMatchObject({ user:
      {
        userId: authUserId,
        name: "first last",
        email: "first.last1@gmail.com",
        numSuccessfulLogins: 1,
        numFailedPasswordsSinceLastLogin: 2,
      }
  });

  adminAuthLogin("first.last1@gmail.com", "Val1dPassword1");
  result = adminUserDetails(authUserId);
  expect(result).toMatchObject({ user:
      {
        userId: authUserId,
        name: "first last",
        email: "first.last1@gmail.com",
        numSuccessfulLogins: 2,
        numFailedPasswordsSinceLastLogin: 0,
      }
  });
});