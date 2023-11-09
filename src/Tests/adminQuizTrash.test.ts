import {
  requestRegister,
  requestQuizTrash,
  requestQuizRemove,
  requestQuizCreate,
  requestClear
} from './testHelper';
import { Token } from '../dataStore';

import HTTPError from 'http-errors';

/// ////////////////////////////////////////////////////////////////////////////
/// //////////////////////////////// Tests /////////////////////////////////////
/// ////////////////////////////////////////////////////////////////////////////

// Clear the dataBase before each test to avoid data interference
beforeEach(() => {
  requestClear();
});

// let result: QuizBrief | ErrorObject;

// Test : Invalid AuthUserId Format
test('Test Invalid AuthUserId Format', () => {
  // authUserId is empty
  expect(() => requestQuizTrash(0)).toThrow(HTTPError[401]);

  // authUserId contains out of range number
  expect(() => requestQuizTrash(-1)).toThrow(HTTPError[401]);

});

// Test : Non-Existing AuthUserId
test('Test Non-existing AuthUserId', () => {
  const userId: Token = requestRegister('validEmail@gmail.com', 'Val1dPassword',
    'first', 'last');

  // user with authUserId does not exist
  expect(() => requestQuizTrash(userId.token + 1)).toThrow(HTTPError[401]);

});

// Test : Valid Input
test('Test Valid Input', () => {
  const userId: Token = requestRegister('validEmail@gmail.com', 'Val1dPassword',
    'first', 'last');
  requestQuizCreate(userId.token, 'Quiz1', 'This is Quiz 1');

  const result = requestQuizTrash(userId.token);
  expect(result).toMatchObject({
    quizzes: [],
  });
});

// Test : Viewing Removed Quiz
test('Test Viewing Removed Quiz', () => {
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
