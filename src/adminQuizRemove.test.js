import { adminQuizRemove, adminQuizCreate } from './quiz.js';
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
  
  let quizId1 = adminQuizCreate(authUserId1, "New Quiz Name1", "");
  let quizId2 = adminQuizCreate(authUserId2, "New Quiz Name2", "");

  let result = adminQuizRemove(authUserId1, quizId1);
  expect(result).toMatchObject({ });

  result = adminQuizRemove(authUserId2, quizId2);
  expect(result).toMatchObject({ });

  quizId1 = adminQuizCreate(authUserId1, "New Quiz Name1", "");
  quizId2 = adminQuizCreate(authUserId2, "New Quiz Name2", "");

  // authUserId2 does not own quiz1, so it should return an error
  result = adminQuizRemove(authUserId2, quizId1);
  expect(result).toMatchObject({ error: expect.any(String) });

  result = adminQuizRemove(authUserId1, quizId2);
  expect(result).toMatchObject({ error: expect.any(String) });
});

test('Test Invalid QuizIDs', () => {
  let authUserId1 = adminAuthRegister("first.last1@gmail.com", "Val1dPassword1", "first1", "last1").authUserId;
  let quizId1 = adminQuizCreate(authUserId1, "New Quiz Name1", "");

  // Quiz ID does not refer to a valid quiz
  let result = adminQuizRemove(authUserId1, "invalidQuizId");
  expect(result).toMatchObject({ error: expect.any(String) });

  result = adminQuizRemove(authUserId1, quizId1 + 1);
  expect(result).toMatchObject({ error: expect.any(String) });
});
