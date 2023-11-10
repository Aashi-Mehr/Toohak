// Import requests
import { QuizSessionId } from '../dataStore';
import {
  requestClear,
  requestRegister,
  requestQuizCreate,
  requestQuizSessionStart,
  requestQuestionCreate
} from './testHelper';

import HTTPError from 'http-errors';

/// ////////////////////////////////////////////////////////////////////////////
/// //////////////////////////////// Tests /////////////////////////////////////
/// ////////////////////////////////////////////////////////////////////////////

const questionBody1 = {
  question: 'What is the first letter of the alphabet?',
  duration: 10,
  points: 5,
  answers: [
    { answer: 'a', correct: true },
    { answer: 'b', correct: false },
    { answer: 'c', correct: false },
    { answer: 'd', correct: false }
  ]
};

let token1: number;
let quizId1: number;
let token2: number;
let quizId2: number;

// Clearing the datastore, so that the tests are independent of previous data
beforeEach(() => {
  requestClear();

  // User 1 and their quiz
  token1 = requestRegister('am@gmail.com', 'Val1Pass', 'fir', 'las').token;
  quizId1 = requestQuizCreate(token1, 'New Quiz', '').quizId;
  requestQuestionCreate(token1, quizId1, questionBody1);

  // User 2 and their quiz
  token2 = requestRegister('am@gmail.com', 'Val1Pass', 'fir', 'las').token;
  quizId2 = requestQuizCreate(token2, 'New Quiz', '').quizId;
  requestQuestionCreate(token2, quizId2, questionBody1);
});

describe('Error Cases', () => {
  // Error 403: Valid token is provided, but quiz doesn't exist
  test('Error 403: Valid token is provided, but quiz doesn\'t exist', () => {
    expect(() => requestQuizSessionStart(
      token1, quizId1 + 1, 0
    )).toThrow(HTTPError[403]);
  });

  // Error 403: Valid token is provided, but user is unauthorised
  test('Error 403: Valid token is provided, but user is unauthorised', () => {
    expect(() => requestQuizSessionStart(
      token1, quizId2, 0
    )).toThrow(HTTPError[403]);
  });

  // Error 401: Token is invalid
  test('Error 401: Token is invalid', () => {
    expect(() => requestQuizSessionStart(
      token1 * token2, quizId2, 0
    )).toThrow(HTTPError[401]);
  });

  // Error 401: Token is empty
  test('Error 401: Token is empty', () => {
    expect(() => requestQuizSessionStart(
      0, quizId1, 0
    )).toThrow(HTTPError[401]);
  });

  // Error 400: autoStartNum is a number greater than 50
  test('Error 400: autoStartNum is a number greater than 50', () => {
    expect(() => requestQuizSessionStart(
      token1, quizId1, 51
    )).toThrow(HTTPError[400]);
  });

  // Error 400: A maximum of 10 active sessions currently exist
  test('Error 400: A maximum of 10 active sessions currently exist', () => {
    for (let i = 0; i < 10; i++) {
      const quizId = requestQuizCreate(token1, 'Quiz ' + i, '').quizId;
      requestQuizSessionStart(token1, quizId, 0);
    }

    expect(() => requestQuizSessionStart(
      token1, quizId1, 0
    )).toThrow(HTTPError[400]);
  });

  // Error 400: The quiz does not have any questions in it
  test('Error 400: The quiz does not have any questions in it', () => {
    const quizId = requestQuizCreate(token1, 'Quiz 1', '').quizId;
    expect(() => requestQuizSessionStart(
      token1, quizId, 51
    )).toThrow(HTTPError[400]);
  });
});

describe('Valid Cases', () => {
  let result: QuizSessionId;

  // Simple case where user 1 starts the session
  test('Simple Case 1', () => {
    result = requestQuizSessionStart(token1, quizId1, 0);
    expect(Object.keys(result).length).toStrictEqual(0);
  });

  // Simple case where user 2 starts the session
  test('Simple Case 2', () => {
    result = requestQuizSessionStart(token2, quizId2, 0);
    expect(Object.keys(result).length).toStrictEqual(0);
  });

  // Simple case where users 1 and 2 both start sessions
  test('Simple Case 3', () => {
    requestQuizSessionStart(token1, quizId1, 0);
    result = requestQuizSessionStart(token2, quizId2, 0);
    expect(Object.keys(result).length).toStrictEqual(0);
  });
});
