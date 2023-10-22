import {
  adminQuizNameUpdate,
  adminQuizCreate,
  adminQuizInfo
} from '../quiz';

import { adminAuthRegister } from '../auth';
import { clear } from '../other.js';

beforeEach(() => {
  clear();
});

test('Test Invalid User IDs', () => {
  // authUserId is not an integer
  let result = adminQuizNameUpdate('12345', 1, 'New Quiz Name');
  expect(result).toMatchObject({ error: expect.any(String) });

  result = adminQuizNameUpdate('67890', 1, 'New Quiz Name');
  expect(result).toMatchObject({ error: expect.any(String) });

  // authUserId is out of the range of User IDs.
  result = adminQuizNameUpdate(0, 1, 'New Quiz Name');
  expect(result).toMatchObject({ error: expect.any(String) });
});

test('Test Valid User IDs', () => {
  const authUserId1 = adminAuthRegister('first.last1@gmail.com', 'Val1dPassword1',
    'first', 'last').token;
  const quizId1 = adminQuizCreate(authUserId1, 'New Name', '').quizId;

  let result = adminQuizNameUpdate(authUserId1, quizId1, 'Updated Name');
  expect(result).toMatchObject({ });

  let quiz = adminQuizInfo(authUserId1, quizId1);
  expect(quiz.name).toStrictEqual('Updated Name');

  result = adminQuizNameUpdate(authUserId1, quizId1, 'New Name');
  expect(result).toMatchObject({ });

  quiz = adminQuizInfo(authUserId1, quizId1);
  expect(quiz.name).toStrictEqual('New Name');
});

test('Test Invalid Quiz Name', () => {
  // Name contains invalid characters (should only contain alphanumeric and spaces)
  const authUserId = adminAuthRegister('first.last1@gmail.com', 'Val1dPassword1',
    'first', 'last').token;
  const quizId1 = adminQuizCreate(authUserId, 'New Quiz Name', '');

  let result = adminQuizNameUpdate(authUserId, quizId1, 'Invalid@Name');
  expect(result).toMatchObject({ error: expect.any(String) });

  // Name is less than 3 characters long
  result = adminQuizNameUpdate(authUserId, quizId1, 'A');
  expect(result).toMatchObject({ error: expect.any(String) });

  // Name is more than 30 characters long
  result = adminQuizNameUpdate(authUserId, quizId1, 'Very Long Quiz Name With More Than 30 Characters');
  expect(result).toMatchObject({ error: expect.any(String) });

  // Name is already used by the current logged in user
  adminQuizNameUpdate(authUserId, quizId1, 'Existing Name');
  result = adminQuizNameUpdate(authUserId, quizId1, 'Existing Name');
  expect(result).toMatchObject({ error: expect.any(String) });
});
