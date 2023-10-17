import {
  adminQuizCreate,
  adminQuizDescriptionUpdate,
  adminQuizInfo
} from '../quiz.js';
import { adminAuthRegister } from '../auth';
import { clear } from '../other.js';

const invalidUser = 10000;
const quizId = 1;
const description = 'New description';

beforeEach(() => {
  clear();
});

test('AuthUserId is not a valid user', () => {
  // authUserId is not an integer
  const result = adminQuizDescriptionUpdate(invalidUser, quizId, description);
  expect(result).toMatchObject({ error: expect.any(String) });
});

test('Quiz ID does not refer to a valid quiz', () => {
  const authUserId1 = adminAuthRegister('first.last1@gmail.com', 'abcd1234', 'first', 'last').authUserId;
  const result = adminQuizDescriptionUpdate(authUserId1, quizId, description);

  expect(result).toMatchObject({ error: expect.any(String) });
});

test('Quiz ID does not refer to a quiz that this user owns', () => {
  const authUserId1 = adminAuthRegister('first.last1@gmail.com', 'abcd1234', 'first', 'last').authUserId;
  const authUserId2 = adminAuthRegister('first.last2@gmail.com', 'abcd1234', 'first', 'last').authUserId;
  const quizId1 = adminQuizCreate(authUserId2, 'first last', 'fist_test').quizId;

  const result = adminQuizDescriptionUpdate(authUserId1, quizId1, description);

  expect(result).toMatchObject({ error: expect.any(String) });
});

test('Description is more than 100 characters in length', () => {
  const authUserId1 = adminAuthRegister('first.last1@gmail.com', 'abcd1234', 'first', 'last').authUserId;
  const quizId1 = adminQuizCreate(authUserId1, 'first last', 'fist_test').quizId;
  let longDescription = '';

  for (let i = 0; i <= 100; i++) longDescription += 'a';

  const result = adminQuizDescriptionUpdate(authUserId1, quizId1, longDescription);
  expect(result).toMatchObject({ error: expect.any(String) });
});

describe('VALID Tests', () => {
  test('Case 1', () => {
    const authUserId1 = adminAuthRegister('first.last1@gmail.com', 'abcd1234', 'first', 'last').authUserId;
    const quizId1 = adminQuizCreate(authUserId1, 'first last', 'fist_test').quizId;

    const result = adminQuizDescriptionUpdate(authUserId1, quizId1, description);
    expect(result).toMatchObject({ });
    expect(adminQuizInfo(authUserId1, quizId1).description).toMatch(description);
  });
});
