import { adminQuizRemove, adminQuizCreate, adminQuizList } from '../quiz';
import { adminAuthRegister } from '../auth';
import { clear } from '../other.js';

beforeEach(() => {
  clear();
});

test('Test Invalid User IDs', () => {
  // authUserId is not an integer
  let result = adminQuizRemove('12345', 1);
  expect(result).toMatchObject({ error: expect.any(String) });

  result = adminQuizRemove('67890', 1);
  expect(result).toMatchObject({ error: expect.any(String) });

  // authUserId is out of the range of User IDs.
  result = adminQuizRemove(0, 1);
  expect(result).toMatchObject({ error: expect.any(String) });
});

test('Test Valid User IDs', () => {
  // DEPENDENCY on adminAuthRegister
  const authUserId1 = adminAuthRegister('first.last1@gmail.com', 'Val1dPassword1', 'first', 'last').token;
  const authUserId2 = adminAuthRegister('first.last2@gmail.com', 'Val1dPassword2', 'first', 'last').token;

  let quizId1 = adminQuizCreate(authUserId1, 'New Quiz Name1', '').quizId;
  let quizId2 = adminQuizCreate(authUserId2, 'New Quiz Name2', '').quizId;

  let result = adminQuizRemove(authUserId1, quizId1);
  expect(result).toMatchObject({ });
  expect(adminQuizList(authUserId1).quizzes).toStrictEqual([]);

  result = adminQuizRemove(authUserId2, quizId2);
  expect(result).toMatchObject({ });
  expect(adminQuizList(authUserId2).quizzes).toStrictEqual([]);

  quizId1 = adminQuizCreate(authUserId1, 'New Quiz Name1', '');
  quizId2 = adminQuizCreate(authUserId2, 'New Quiz Name2', '');

  // authUserId2 does not own quiz1, so it should return an error
  result = adminQuizRemove(authUserId2, quizId1);
  expect(result).toMatchObject({ error: expect.any(String) });

  result = adminQuizRemove(authUserId1, quizId2);
  expect(result).toMatchObject({ error: expect.any(String) });
});

test('Test Invalid QuizIDs', () => {
  const authUserId1 = adminAuthRegister('first.last1@gmail.com', 'Val1dPassword1', 'first1', 'last1').token;
  const quizId1 = adminQuizCreate(authUserId1, 'New Quiz Name1', '');

  // Quiz ID does not refer to a valid quiz
  let result = adminQuizRemove(authUserId1, 'invalidQuizId');
  expect(result).toMatchObject({ error: expect.any(String) });

  result = adminQuizRemove(authUserId1, quizId1 + 1);
  expect(result).toMatchObject({ error: expect.any(String) });
});
