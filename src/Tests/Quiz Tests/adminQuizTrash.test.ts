import HTTPError from 'http-errors';
import { Token } from '../../dataStore';
import {
  requestRegister,
  requestQuizTrash,
  requestQuizRemove,
  requestQuizCreate,
  requestClear
} from '../testHelper';

// Clear the dataBase before each test to avoid data interference
beforeEach(() => { requestClear(); });

/// ////////////////////////////////////////////////////////////////////////////
/// ////////////////////////////// Tests V1 ////////////////////////////////////
/// ////////////////////////////////////////////////////////////////////////////
describe('adminQuizTrash Version 1', () => {
  // Test : Invalid AuthUserId Format
  test('Invalid AuthUserId Format', () => {
    // authUserId is empty
    expect(() => requestQuizTrash(0, true)).toThrow(HTTPError[401]);

    // authUserId contains out of range number
    expect(() => requestQuizTrash(-1, true)).toThrow(HTTPError[401]);
  });

  // Test : Non-Existing AuthUserId
  test('Non-existing AuthUserId', () => {
    const userId: Token = requestRegister('validEmail@gmail.com', 'Val1dPassword',
      'first', 'last');

    // user with authUserId does not exist
    expect(() => requestQuizTrash(userId.token + 1, true)).toThrow(HTTPError[401]);
  });

  // Test : Valid Input
  test('Valid Input', () => {
    // Register a user
    const userId: Token = requestRegister('validEmail@gmail.com', 'Val1dPassword',
      'first', 'last');
    // Create a quiz
    requestQuizCreate(userId.token, 'Quiz1', 'This is Quiz 1');
    // Attempt to view trash
    const result = requestQuizTrash(userId.token, true);
    // Return empty list since the quiz is not removed
    expect(result).toMatchObject({
      quizzes: [],
    });
  });

  // Test : Viewing Removed Quiz
  test('Viewing Removed Quiz', () => {
    // Register a user
    const userId: Token = requestRegister('validEmail@gmail.com', 'Val1dPassword',
      'first', 'last');
    // Create a quiz
    const quizId: number = requestQuizCreate(userId.token, 'Quiz 1',
      'This is Quiz 1').quizId;
    // Remove the quiz
    requestQuizRemove(userId.token, quizId);
    // Attempt to view the removed quiz
    const result = requestQuizTrash(userId.token, true);
    expect(result).toMatchObject({
      quizzes: [
        {
          quizId: quizId,
          name: 'Quiz 1',
        },
      ],
    });
  });
});

/// ////////////////////////////////////////////////////////////////////////////
/// ////////////////////////////// Tests V2 ////////////////////////////////////
/// ////////////////////////////////////////////////////////////////////////////

describe('adminQuizTrash Version 2', () => {
  // Test : Invalid AuthUserId Format
  test('Invalid AuthUserId Format', () => {
    // authUserId is empty
    expect(() => requestQuizTrash(0)).toThrow(HTTPError[401]);

    // authUserId contains out of range number
    expect(() => requestQuizTrash(-1)).toThrow(HTTPError[401]);
  });

  // Test : Non-Existing AuthUserId
  test('Non-existing AuthUserId', () => {
    const userId: Token = requestRegister('validEmail@gmail.com', 'Val1dPassword',
      'first', 'last');

    // user with authUserId does not exist
    expect(() => requestQuizTrash(userId.token + 1)).toThrow(HTTPError[401]);
  });

  // Test : Valid Input
  test('Valid Input : No Removed Quiz', () => {
    // Resgister a user
    const userId: Token = requestRegister('validEmail@gmail.com', 'Val1dPassword',
      'first', 'last');
    // Create a quiz
    requestQuizCreate(userId.token, 'Quiz1', 'This is Quiz 1');
    // Try viewing trash
    const result = requestQuizTrash(userId.token);
    // Returns empty list since the quiz is not removed
    expect(result).toMatchObject({
      quizzes: [],
    });
  });

  // Test : Viewing Removed Quiz
  test('Valid Input : Viewing Removed Quiz', () => {
    // Register a user
    const userId: Token = requestRegister('validEmail@gmail.com', 'Val1dPassword',
      'first', 'last');
    const quizId: number = requestQuizCreate(userId.token, 'Quiz 1',
      'This is Quiz 1').quizId;
    // Remove the quiz
    requestQuizRemove(userId.token, quizId);
    // Attempt to view the removed quiz
    const result = requestQuizTrash(userId.token);
    expect(result).toMatchObject({
      quizzes: [
        {
          quizId: quizId,
          name: 'Quiz 1',
        },
      ],
    });
  });
});
