// Test for adminQuizEmptyTrash
import { Token } from '../../dataStore';
import HTTPError from 'http-errors';
import {
  requestQuizEmptyTrash,
  requestClear,
  requestRegister,
  requestQuizCreate,
  requestQuizRemove,
} from '../testHelper';

// Clear the dataBase before each test to avoid data interference
beforeEach(() => {
  requestClear();
});

/// ////////////////////////////////////////////////////////////////////////////
/// //////////////////////////////// Tests V1 //////////////////////////////////
/// ////////////////////////////////////////////////////////////////////////////

describe('adminQuizEmptyTrash Version 1', () => {
  // Test 401 : Invalid AuthUserId Format
  test('Test Invalid AuthUserId Format', () => {
    // authUserId is empty
    // Register a user
    const token = requestRegister('v@gmail.com', 'Val1Pass', 'fir', 'las').token;
    // Create quizzes
    const quizId1 = requestQuizCreate(token, 'Quiz 1', '').quizId;
    const quizId2 = requestQuizCreate(token, 'Quiz 2', '').quizId;
    // Remove Quizzes
    requestQuizRemove(token, quizId1);
    requestQuizRemove(token, quizId2);

    expect(() => requestQuizEmptyTrash(0, [quizId1, quizId2], true)).toThrow(HTTPError[401]);

    // authUserId contains out of range number
    expect(() => requestQuizEmptyTrash(-1, [quizId1, quizId2], true)).toThrow(HTTPError[401]);
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
    expect(() => requestQuizEmptyTrash(userId.token + 1, [quizId], true)).toThrow(HTTPError[401]);
  });

  // Test 403: One or more of the quiz ids is not a valid quiz
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
    expect(() => requestQuizEmptyTrash(userId.token, [quizId1 + 1], true)).toThrow(HTTPError[403]);
    expect(() => requestQuizEmptyTrash(userId.token, [quizId2 + 100], true)).toThrow(HTTPError[403]);
    expect(() => requestQuizEmptyTrash(userId.token, [-1], true)).toThrow(HTTPError[403]);
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
    expect(() => requestQuizEmptyTrash(userId.token, [quizId1], true)).toThrow(HTTPError[400]);
    expect(() => requestQuizEmptyTrash(userId.token, [quizId2], true)).toThrow(HTTPError[400]);
    expect(() => requestQuizEmptyTrash(userId.token, [quizId1, quizId2], true)).toThrow(HTTPError[400]);
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
    // Move the quizzes to the trash
    requestQuizRemove(userId1.token, quizId);
    // Permanently delete the quizzes that is not owned by user
    expect(() => requestQuizEmptyTrash(userId2.token, [quizId], true)).toThrow(HTTPError[403]);
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
    const result = requestQuizEmptyTrash(userId.token, [quizId1], true);
    expect(Object.keys(result).length).toStrictEqual(0);
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
    const result = requestQuizEmptyTrash(userId.token, [quizId1, quizId2], true);
    expect(Object.keys(result).length).toStrictEqual(0);
  });
});

/// ////////////////////////////////////////////////////////////////////////////
/// //////////////////////////////// Tests V2 //////////////////////////////////
/// ////////////////////////////////////////////////////////////////////////////

describe('adminQuizEmptyTrash Version 2', () => {
  // Test 401 : Invalid AuthUserId Format
  test('Test Invalid AuthUserId Format', () => {
    // authUserId is empty
    // Register a user
    const token = requestRegister('v@gmail.com', 'Val1Pass', 'fir', 'las').token;
    // Create quizzes
    const quizId1 = requestQuizCreate(token, 'Quiz 1', '').quizId;
    const quizId2 = requestQuizCreate(token, 'Quiz 2', '').quizId;
    // Remove Quizzes
    requestQuizRemove(token, quizId1);
    requestQuizRemove(token, quizId2);
    // Attempt to permanently remove quiz
    expect(() => requestQuizEmptyTrash(0, [quizId1, quizId2])).toThrow(HTTPError[401]);

    // authUserId contains out of range number
    expect(() => requestQuizEmptyTrash(-1, [quizId1, quizId2])).toThrow(HTTPError[401]);
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
    expect(() => requestQuizEmptyTrash(userId.token + 1, [quizId])).toThrow(HTTPError[401]);
  });

  // Test 403: One or more of the quiz ids is not a valid quiz
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
    expect(() => requestQuizEmptyTrash(userId.token, [quizId1 + 1])).toThrow(HTTPError[403]);
    expect(() => requestQuizEmptyTrash(userId.token, [quizId2 + 100])).toThrow(HTTPError[403]);
    expect(() => requestQuizEmptyTrash(userId.token, [-1])).toThrow(HTTPError[403]);
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
    expect(() => requestQuizEmptyTrash(userId.token, [quizId1])).toThrow(HTTPError[400]);
    expect(() => requestQuizEmptyTrash(userId.token, [quizId2])).toThrow(HTTPError[400]);
    expect(() => requestQuizEmptyTrash(userId.token, [quizId1, quizId2])).toThrow(HTTPError[400]);
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
    // Move the quizzes to the trash
    requestQuizRemove(userId1.token, quizId);
    // Permanently delete the quizzes that is not owned by user
    expect(() => requestQuizEmptyTrash(userId2.token, [quizId])).toThrow(HTTPError[403]);
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
    expect(Object.keys(result).length).toStrictEqual(0);
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
    expect(Object.keys(result).length).toStrictEqual(0);
  });
});
