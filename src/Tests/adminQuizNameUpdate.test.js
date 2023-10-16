import { adminQuizNameUpdate, adminQuizCreate } from '../quiz.js';
import { adminAuthRegister } from '../auth.js';
import { clear } from '../other.js';

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
  let authUserId1 = adminAuthRegister("first.last1@gmail.com", "Val1dPassword1", "first1", "last1").authUserId;
  let quizId1 = adminQuizCreate(authUserId1, "New Quiz Name", "");

  let result = adminQuizNameUpdate(authUserId1, quizId1, "Updated Quiz Name");
  expect(result).toMatchObject({ });

  // authUserId4 does not own quiz 2, so it should return an error
  result = adminQuizNameUpdate(authUserId1, quizId1, "New Updated Name");
  expect(result).toMatchObject({ });
});

test('Test Invalid Quiz Name', () => {
  // Name contains invalid characters (should only contain alphanumeric and spaces)
  let authUserId = adminAuthRegister("first.last1@gmail.com", "Val1dPassword1", "first1", "last1").authUserId;
  let quizId1 = adminQuizCreate(authUserId, "New Quiz Name", "");
  
  let result = adminQuizNameUpdate(authUserId, quizId1, "Invalid@Name");
  expect(result).toMatchObject({ error: expect.any(String) });

  // Name is less than 3 characters long
  result = adminQuizNameUpdate(authUserId, quizId1, "A");
  expect(result).toMatchObject({ error: expect.any(String) });

  // Name is more than 30 characters long
  result = adminQuizNameUpdate(authUserId, quizId1, "Very Long Quiz Name With More Than 30 Characters");
  expect(result).toMatchObject({ error: expect.any(String) });

  // Valid Name
  adminQuizNameUpdate(authUserId, quizId1, "Existing Name");
  expect(result).toMatchObject({ });

  // Name is already used by the current logged in user
  result = adminQuizNameUpdate(authUserId, quizId1, "Existing Name");
  expect(result).toMatchObject({ error: expect.any(String) });
});
