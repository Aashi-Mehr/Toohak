import { adminQuizNameUpdate } from './quiz.js';
import { adminAuthRegister } from './auth.js';
import { clear } from './other.js';

beforeEach(() => {
  clear();
});

test('Test Invalid User IDs', () => {
  // authUserId is not an integer
  let result = adminQuizNameUpdate("12345", 1, "New Quiz Name");
  expect(result).toMatchObject({ error: expect.any(String) });

  result = adminQuizNameUpdate("67890", 1, "New Quiz Name");
  expect(result).toMatchObject({ error: expect.any(String) });

  // authUserId is out of the range of User IDs.
  result = adminQuizNameUpdate(0, 1, "New Quiz Name");
  expect(result).toMatchObject({ error: expect.any(String) });
});

test('Test Valid User IDs', () => {
  // DEPENDENCY on adminAuthRegister
  let authUserId1 = adminAuthRegister("first.last1@gmail.com", "Val1dPassword1", "first1", "last1").authUserId;
  let authUserId2 = adminAuthRegister("first.last2@gmail.com", "Val1dPassword2", "first2", "last2").authUserId;
  let authUserId3 = adminAuthRegister("first.last3@gmail.com", "Val1dPassword3", "first3", "last3").authUserId;
  let authUserId4 = adminAuthRegister("first.last4@gmail.com", "Val1dPassword4", "first4", "last4").authUserId;
  
  let result = adminQuizNameUpdate(authUserId1, 1, "New Quiz Name");
  expect(result).toMatchObject({ success: true });

  result = adminQuizNameUpdate(authUserId2, 2, "Updated Quiz Name");
  expect(result).toMatchObject({ success: true });

  // authUserId4 does not own quiz 2, so it should return an error
  result = adminQuizNameUpdate(authUserId4, 2, "Updated Quiz Name");
  expect(result).toMatchObject({ error: expect.any(String) });
});

test('Test Invalid Quiz Name', () => {
  // Name contains invalid characters (should only contain alphanumeric and spaces)
  let authUserId = adminAuthRegister("first.last1@gmail.com", "Val1dPassword1", "first1", "last1").authUserId;
  let result = adminQuizNameUpdate(authUserId, 1, "Invalid@Name");
  expect(result).toMatchObject({ error: expect.any(String) });

  // Name is less than 3 characters long
  result = adminQuizNameUpdate(authUserId, 1, "A");
  expect(result).toMatchObject({ error: expect.any(String) });

  // Name is more than 30 characters long
  result = adminQuizNameUpdate(authUserId, 1, "Very Long Quiz Name With More Than 30 Characters");
  expect(result).toMatchObject({ error: expect.any(String) });

  // Name is already used by the current logged in user for another quiz
  adminQuizNameUpdate(authUserId, 1, "Existing Name");
  result = adminQuizNameUpdate(authUserId, 2, "Existing Name");
  expect(result).toMatchObject({ error: expect.any(String) });
});
