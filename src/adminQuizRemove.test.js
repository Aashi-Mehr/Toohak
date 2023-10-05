import { adminQuizRemove } from './quiz.js';
import { adminAuthRegister } from './auth.js';
import { clear } from './other.js';

beforeEach(() => {
  clear();
});

test('Test Invalid User IDs', () => {
  // authUserId is not an integer
  let result = adminQuizRemove("12345", 1);
  expect(result).toMatchObject({ error: expect.any(String) });

  result = adminQuizRemove("67890", 1);
  expect(result).toMatchObject({ error: expect.any(String) });

  // authUserId is out of the range of User IDs.
  result = adminQuizRemove(0, 1);
  expect(result).toMatchObject({ error: expect.any(String) });
});

test('Test Valid User IDs', () => {
  // DEPENDENCY on adminAuthRegister
  let authUserId1 = adminAuthRegister("first.last1@gmail.com", "Val1dPassword1", "first1", "last1").authUserId;
  let authUserId2 = adminAuthRegister("first.last2@gmail.com", "Val1dPassword2", "first2", "last2").authUserId;
  let authUserId3 = adminAuthRegister("first.last3@gmail.com", "Val1dPassword3", "first3", "last3").authUserId;
  let authUserId4 = adminAuthRegister("first.last4@gmail.com", "Val1dPassword4", "first4", "last4").authUserId;
  
  let result = adminQuizRemove(authUserId1, 1);
  expect(result).toMatchObject({ success: true });

  result = adminQuizRemove(authUserId2, 2);
  expect(result).toMatchObject({ success: true });

  // authUserId4 does not own quiz 2, so it should return an error
  result = adminQuizRemove(authUserId4, 2);
  expect(result).toMatchObject({ error: expect.any(String) });
});

test('Test New Error Conditions', () => {
  // authUserId is not a valid user
  let result = adminQuizRemove("invalidUserId", 1);
  expect(result).toMatchObject({ error: expect.any(String) });

  // Quiz ID does not refer to a valid quiz
  result = adminQuizRemove(authUserId1, "invalidQuizId");
  expect(result).toMatchObject({ error: expect.any(String) });

  // Quiz ID does not refer to a quiz that this user owns
  result = adminQuizRemove(authUserId1, 2);
  expect(result).toMatchObject({ error: expect.any(String) });
});
