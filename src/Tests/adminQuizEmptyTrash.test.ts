// Test for adminQuizEmptyTrash
import { Token } from '../dataStore';
import {
  requestQuizEmptyTrash,
  requestClear,
  requestRegister,
  requestQuizCreate,
  requestQuizRemove,
} from './testHelper';

/// ////////////////////////////////////////////////////////////////////////////
/// //////////////////////////////// Tests /////////////////////////////////////
/// ////////////////////////////////////////////////////////////////////////////

// Clear the dataBase before each test to avoid data interference
beforeEach(() => {
  requestClear();
});

// Test 401 : Invalid AuthUserId Format
test('Test Invalid AuthUserId Format', () => {
  // authUserId is empty
  let result = requestQuizEmptyTrash(0, [11, 90, 700]);
  expect(result).toMatchObject({ error: expect.any(String) });

  // authUserId contains out of range number
  result = requestQuizEmptyTrash(-1, [11]);
  expect(result).toMatchObject({ error: expect.any(String) });
});

test('Test Invalid AuthUserId', () => {
  // Register a user
  const userId: Token = requestRegister('validEmail@gmail.com', 'Val1dPassword',
    'first', 'last');
    // Create a quiz with userId
  const quizId: number = requestQuizCreate(userId.token, 'Quiz 1',
    'This is Quiz 1').quizId;

  // Remove the quiz
  requestQuizRemove(userId.token, quizId);

  // Permanently delete the quiz with invalid userId
  const result = requestQuizEmptyTrash(userId.token + 1, [quizId]);
  expect(result).toMatchObject({ error: expect.any(String) });
});

// Test 400: One or more of the quiz ids is not a valid quiz
test('Quiz ID(s) is not a valid quiz', () => {
  // Register a user
  const userId: Token = requestRegister('validEmail@gmail.com', 'Val1dPassword',
    'first', 'last');
  // Create quizzes with userId
  const quizId1: number = requestQuizCreate(userId.token,
    'Quiz 1', 'This is Quiz 1').quizId;
  const quizId2: number = requestQuizCreate(userId.token,
    'Quiz 2', 'This is Quiz 2').quizId;

  // Move the quizzes to the trash
  requestQuizRemove(userId.token, quizId1);
  requestQuizRemove(userId.token, quizId2);

  // Permanently delete the quizzes with invalid quizIds
  const result1 = requestQuizEmptyTrash(userId.token, [quizId1 + 1]);
  expect(result1).toMatchObject({ error: expect.any(String) });

  const result2 = requestQuizEmptyTrash(userId.token, [quizId2 + 100]);
  expect(result2).toMatchObject({ error: expect.any(String) });

  const result3 = requestQuizEmptyTrash(userId.token, [-1]);
  expect(result3).toMatchObject({ error: expect.any(String) });
});

// Test 400 : Quiz ID refers to a quiz thats not in trash
test('Test Restored Quiz Not In Trash', () => {
  // Register a user
  const userId: Token = requestRegister('validEmail@gmail.com', 'Val1dPassword',
    'first', 'last');
  // Create a quiz with userId
  const quizId1: number = requestQuizCreate(userId.token, 'Quiz 1',
    'This is Quiz 1').quizId;
  // Create a quiz with userId
  const quizId2: number = requestQuizCreate(userId.token, 'Quiz 2',
    'This is Quiz 2').quizId;

  // Permanently delete the quizzes that has not been removed
  const result1 = requestQuizEmptyTrash(userId.token, [quizId1]);
  expect(result1).toMatchObject({ error: expect.any(String) });

  const result2 = requestQuizEmptyTrash(userId.token, [quizId2]);
  expect(result2).toMatchObject({ error: expect.any(String) });

  const result3 = requestQuizEmptyTrash(userId.token, [quizId1, quizId2]);
  expect(result3).toMatchObject({ error: expect.any(String) });
});

// Test 403 : Valid token but user is not the owner of the quiz
test('Quiz ID does not owned by user', () => {
  // Register a user
  const userId1: Token = requestRegister('validEmail@gmail.com', 'Val1dPassword',
    'first', 'last');
  // Register another user
  const userId2: Token = requestRegister('validEmail@gmail.com', 'Val1dPassword',
    'first', 'last');
  // Create a quiz owned by user 1
  const quizId: number = requestQuizCreate(userId1.token, 'Quiz 1',
    'This is Quiz 1').quizId;

  // Move the quizzes to the trash
  requestQuizRemove(userId1.token, quizId);

  // Restoring the quiz from user 1 using userId of user 2
  const result = requestQuizEmptyTrash(userId2.token, [quizId]);
  expect(result).toMatchObject({ error: expect.any(String) });
});

// Test 200 : Valid inputs
test('Perfect Case 1', () => {
  // Register a user
  const userId: Token = requestRegister('validEmail@gmail.com', 'Val1dPassword',
    'first', 'last');
  // Create a quiz with userId
  const quizId1: number = requestQuizCreate(userId.token, 'Quiz 1',
    'This is Quiz 1').quizId;

  // Move the quizzes to the trash
  requestQuizRemove(userId.token, quizId1);

  // Restoring the quiz from user 1 using userId of user 2
  const result = requestQuizEmptyTrash(userId.token, [quizId1]);
  expect(result).toMatchObject({ error: expect.any(String) });
});

test('Perfect Case 2', () => {
  // Register a user
  const userId: Token = requestRegister('validEmail@gmail.com', 'Val1dPassword',
    'first', 'last');
  // Create a quiz with userId
  const quizId1: number = requestQuizCreate(userId.token, 'Quiz 1',
    'This is Quiz 1').quizId;
  // Create a quiz with userId
  const quizId2: number = requestQuizCreate(userId.token, 'Quiz 2',
    'This is Quiz 2').quizId;

  // Move the quizzes to the trash
  requestQuizRemove(userId.token, quizId1);
  requestQuizRemove(userId.token, quizId2);

  // Restoring the quiz from user 1 using userId of user 2
  const result = requestQuizEmptyTrash(userId.token, [quizId1, quizId2]);
  expect(result).toMatchObject({ error: expect.any(String) });
});
