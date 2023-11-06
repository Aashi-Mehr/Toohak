import { Token } from '../dataStore';
import {
  requestQuizRestore,
  requestClear,
  requestRegister,
  requestQuizCreate,
  requestQuizRemove
} from './testHelper';

/// ////////////////////////////////////////////////////////////////////////////
/// //////////////////////////////// Tests /////////////////////////////////////
/// ////////////////////////////////////////////////////////////////////////////

// Clear the dataBase before each test to avoid data interference
beforeEach(() => {
  requestClear();
});

// Test 400 : Quiz Name of restored quiz is already used by another active quiz
test('Test Restored Quiz Name', () => {
  // Register a user
  const userId: Token = requestRegister('validEmail@gmail.com', 'Val1dPassword',
    'first', 'last');
  // Create a quiz with userId
  const quizId: number = requestQuizCreate(userId.token, 'Quiz 1',
    'This is Quiz 1').quizId;

  // Remove the quiz
  requestQuizRemove(userId.token, quizId);

  // Create a new quiz with the name of removed quiz
  requestQuizCreate(userId.token, 'Quiz 1', 'This is the new Quiz 1');

  // Restore the quiz with same name
  const result = requestQuizRestore(userId.token, quizId);
  expect(result).toHaveProperty('error');
});

// Test 400 : Quiz ID refers to a quiz thats not in trash
test('Test Restored Quiz Not In Trash', () => {
  // Test : Restoring a quiz that is not in trash
  // Register a user
  const userId: Token = requestRegister('validEmail@gmail.com', 'Val1dPassword',
    'first', 'last');
    // Create a quiz with userId
  const quizId: number = requestQuizCreate(userId.token, 'Quiz 1',
    'This is Quiz 1').quizId;

  // Restore the quiz that has not been removed
  const result = requestQuizRestore(userId.token, quizId);
  expect(result).toMatchObject({ error: expect.any(String) });
});

test('Quiz ID does not exist', () => {
  // Register a user
  const userId: Token = requestRegister('validEmail@gmail.com', 'Val1dPassword',
    'first', 'last');
  // Create a quiz with userId
  const quizId: number = requestQuizCreate(userId.token, 'Quiz 1',
    'This is Quiz 1').quizId;

  // Restore a quiz with non-existing or wrongly inputted quizId
  const result = requestQuizRestore(userId.token, quizId + 1);
  expect(result).toMatchObject({ error: expect.any(String) });
});

test('Quiz not in trash', () => {
  // Register a user
  const userId: number = requestRegister('validEmail@gmail.com',
    'Val1dPassword', 'first', 'last').token;
  // Create a quiz with userId
  const quizId: number = requestQuizCreate(userId, 'Quiz1', '').quizId;

  // Restore a quiz with non-existing or wrongly inputted quizId
  const result = requestQuizRestore(userId, quizId);
  expect(result).toMatchObject({ error: expect.any(String) });
});

// Test 401 : Invalid AuthUserId Format
test('Test Invalid AuthUserId Format', () => {
  // authUserId is empty
  let result = requestQuizRestore(0, 11);
  expect(result).toMatchObject({ error: expect.any(String) });

  // authUserId contains out of range number
  result = requestQuizRestore(-1, 11);
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

  // Restore the quiz with invalid userId
  const result = requestQuizRestore(userId.token + 1, quizId);
  expect(result).toMatchObject({ error: expect.any(String) });
});

// Test 403 : Valid token but user is not the owner of the quiz
test('Quiz ID does not owned by user', () => {
  // Register a user
  const userId1: Token = requestRegister('validEmail1@gmail.com', 'Val1dPass',
    'first', 'last');
    // Register another user
  const userId2: Token = requestRegister('validEmail2@gmail.com', 'Val1dPass',
    'first', 'last');
    // Create a quiz owned by user 1
  const quizId: number = requestQuizCreate(userId1.token, 'Quiz 1',
    'This is Quiz 1').quizId;

  // Restoring the quiz from user 1 using userId of user 2
  const result = requestQuizRestore(userId2.token, quizId);
  expect(result).toMatchObject({ error: expect.any(String) });
});

// Test 200 : Perfect Case
test('Perfect Case', () => {
  // Register a user
  const userId: Token = requestRegister('validEmail@gmail.com', 'Val1dPassword',
    'first', 'last');
    // Create a quiz with userId
  const quizId: number = requestQuizCreate(userId.token, 'Quiz 1',
    'This is Quiz 1').quizId;

  // Remove the quiz
  requestQuizRemove(userId.token, quizId);

  // Restore the quiz with invalid userId
  const result = requestQuizRestore(userId.token, quizId);
  expect(result).not.toHaveProperty('error');
});
