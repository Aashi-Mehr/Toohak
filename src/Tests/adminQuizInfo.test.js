// adminQuizInfo test function
//
// authors:
// Zhejun Gu (z5351573)
//
// edit:
// 05/10/2023
//

import {
  adminQuizInfo,
  adminQuizCreate
} from '../quiz.js';

import { adminAuthRegister } from '../auth';
import { clear } from '../other.js';

beforeEach(() => {
  clear();
});

test('Test Invalid User Ids', () => {
  // Register user with id: 1
  adminAuthRegister('first.last1@gmail.com', 'abcd1234', 'first', 'last');

  // authUserId is not an integar
  let result = adminQuizInfo('12321', 1);
  expect(result).toMatchObject({ error: expect.any(String) });

  // authUserId is out of valid range
  result = adminQuizInfo(-1, 1);
  expect(result).toMatchObject({ error: expect.any(String) });
});

test('Test Invalid Quiz Ids', () => {
  // Register test id: 2 by user id: 1
  adminQuizCreate(1, 'first last', 'fist_test');

  // Quiz ID does not refer to a valid quiz
  let result = adminQuizInfo(1, -100);
  expect(result).toMatchObject({ error: expect.any(String) });

  // Quiz ID does not refer to a quiz that this user owns
  result = adminQuizInfo(2, 2);
  expect(result).toMatchObject({ error: expect.any(String) });
});

test('Test valid format User Id but not exist in data base', () => {
  // Register user with id: 1
  adminAuthRegister('first.last2@gmail.com', 'efgh5678', 'first2', 'last2');

  // Correct format UserId but never is the Id being registered
  const result = adminQuizInfo(4, 1);
  expect(result).toMatchObject({ error: expect.any(String) });
});

test('Test Valid User and Quiz Ids', () => {
  const authId = adminAuthRegister('1531_user1@1531.com', 'C123321c', 'first', 'last').authUserId;
  const qzId = adminQuizCreate(authId, 'first last', '').quizId;

  expect(adminQuizInfo(authId, qzId)).toMatchObject({
    quizId: qzId,
    name: 'first last',
    timeCreated: expect.any(Number),
    timeLastEdited: expect.any(Number),
    description: expect.any(String),
  });
});

test('Test successful quiz read - correct timestamp format', () => {
  const authId = adminAuthRegister('1531_user1@1531.com', 'C123321c', 'first',
    'last').authUserId;
  const quizId = adminQuizCreate(authId, 'first last', '').quizId;

  const quiz = adminQuizInfo(authId, quizId);
  expect(quiz.timeCreated.toString()).toMatch(/^\d{10}$/);
  expect(quiz.timeLastEdited.toString()).toMatch(/^\d{10}$/);
});

test('Test quizId invalid error, cannot read', () => {
  const authId = adminAuthRegister('1531_user1@1531.com', 'C123321c', 'first',
    'last').authUserId;
  const quizId = adminQuizCreate(authId, 'first last', '').quizId;

  const quiz = adminQuizInfo(authId, quizId + 1);
  expect(quiz).toStrictEqual({ error: expect.any(String) });
});
