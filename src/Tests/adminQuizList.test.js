// adminQuizList test function
//
// authors:
// Zhejun Gu (z5351573)
//
// edit:
// 05/10/2023
//

import {
  adminQuizList,
  adminQuizCreate,
  adminQuizInfo,
  adminQuizRemove
} from '../quiz.js';

import { adminAuthRegister } from '../auth.js';
import { clear } from '../other.js';

beforeEach(() => {
  clear();
});

test('Test Invalid User Ids', () => {
  // Register user with id: 1
  adminAuthRegister('first.last1@gmail.com', 'abcd1234', 'first', 'last');

  // authUserId is not an integar
  let result = adminQuizList('12321');
  expect(result).toMatchObject({ error: expect.any(String) });

  // authUserId is out of valid range
  result = adminQuizList(-1);
  expect(result).toMatchObject({ error: expect.any(String) });
});

test('Test valid format User Id but not exist in data base', () => {
  // Register user with id: 1
  adminAuthRegister('first.last2@gmail.com', 'efgh5678', 'first2', 'last2');

  // Correct format UserId but never is the Id being registered
  const result = adminQuizInfo(4, 1);
  expect(result).toMatchObject({ error: expect.any(String) });
});

test('VALID 1 Quiz', () => {
  const authId = adminAuthRegister('1531_user1@gmail.com', 'C123321c', 'first',
    'last').authUserId;
  const qzId = adminQuizCreate(authId, 'first last', '').quizId;

  const result = adminQuizList(authId);
  expect(result).toMatchObject({
    quizzes: [
      {
        quizId: qzId,
        name: 'first last',
      }
    ]
  });
});

test('VALID 2 Quizzes', () => {
  const authId = adminAuthRegister('1531_user1@gmail.com', 'C123321c', 'first',
    'last').authUserId;
  const qzId1 = adminQuizCreate(authId, 'first last1', '').quizId;
  const qzId2 = adminQuizCreate(authId, 'first last2', '').quizId;

  const result = adminQuizList(authId);
  expect(result).toMatchObject({
    quizzes: [
      {
        quizId: qzId1,
        name: 'first last1',
      },
      {
        quizId: qzId2,
        name: 'first last2',
      }
    ]
  });
});

test('VALID After Removal', () => {
  const authId = adminAuthRegister('1531_user1@gmail.com', 'C123321c', 'first',
    'last').authUserId;
  const qzId = adminQuizCreate(authId, 'first last1', '').quizId;
  adminQuizRemove(authId, qzId);

  const result = adminQuizList(authId);
  expect(result).toMatchObject({ quizzes: [] });
});
