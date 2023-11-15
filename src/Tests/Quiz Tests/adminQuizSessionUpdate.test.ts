/*
adminQuizSessionUpdate {quizId: number, sessionId: number, token: number, state: string}
- Update the state of a particular session by sending an action command

To Do
400
// - unactive400 : Session Id does not refer to a valid session within this quiz
- invalAct400 : Action provided is not a valid Action enum
- cantAct400 : Action enum cannot be applied in the current state (see spec for details)

401
// - token401 : Token is empty or invalid

403
- unauth403 : Valid token, unauthoried to modify session

200
- return : {}
*/

import HTTPError from 'http-errors';
// import { Action } from '../dataStore';
import {
  requestClear,
  requestRegister,
  requestQuizCreate,
  requestQuizSessionStart,
  requestQuestionCreate,
  requestQuizSessionUpdate
} from './testHelper';

/// ////////////////////////////////////////////////////////////////////////////
/// //////////////////////////////// Tests /////////////////////////////////////
/// ////////////////////////////////////////////////////////////////////////////

const questionBody = {
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
let sessionId1: number;
let token2: number;
let quizId2: number;
let sessionId2: number;

// Clearing the datastore
beforeEach(() => {
  requestClear();

  // User 1 and their quiz
  token1 = requestRegister('am@gmail.com', 'Val1Pass', 'fir', 'las').token;
  quizId1 = requestQuizCreate(token1, 'New Quiz', '').quizId;
  requestQuestionCreate(token1, quizId1, questionBody);
  sessionId1 = requestQuizSessionStart(token1, quizId1, 20).sessionId;

  // User 2 and their quiz
  token2 = requestRegister('ab@gmail.com', 'Val1Pass', 'fir', 'las').token;
  quizId2 = requestQuizCreate(token2, 'New Quiz', '').quizId;
  requestQuestionCreate(token2, quizId2, questionBody);
  sessionId2 = requestQuizSessionStart(token2, quizId2, 40).sessionId;
});

describe('Invalid Cases', () => {
  // 400 : Invalid Session Id
  test('400 : Empty Session Id', () => {
    expect(() => requestQuizSessionUpdate(
      quizId1, 0, token1, 'NEXT_QUESTION')).toThrow(HTTPError[400]);
  });
  test('400 : Invalid Session Id', () => {
    expect(() => requestQuizSessionUpdate(
      quizId1, sessionId1 + 1, token1, 'NEXT_QUESTION')).toThrow(HTTPError[400]);
  });

  // 400 : Empty action
  test('400 : Empty Action', () => {
    expect(() => requestQuizSessionUpdate(
      quizId1, sessionId1, token1, '')).toThrow(HTTPError[400]);
  });

  // 400 : Invalid Action
  test('400 : Invalid Action 1', () => {
    expect(() => requestQuizSessionUpdate(
      quizId1, sessionId1, token1, 'NEXT_QUESTIONS')).toThrow(HTTPError[400]);
  });
  test('400 : Invalid Action 2', () => {
    expect(() => requestQuizSessionUpdate(
      quizId1, sessionId1, token1, 'Next Question')).toThrow(HTTPError[400]);
  });
  // if can use other than next q, add tests for other actions
  // More invalid function for cantAct!!!

  // 401 : Invalid Token
  test('401 : Empty Token', () => {
    expect(() => requestQuizSessionUpdate(
      quizId1, sessionId1, 0, 'NEXT_QUESTION')).toThrow(HTTPError[401]);
  });
  test('401 : Invalid Token', () => {
    expect(() => requestQuizSessionUpdate(
      quizId1, sessionId1, token1 + 1, 'NEXT_QUESTION')).toThrow(HTTPError[401]);
  });
  test('401 : Empty Token', () => {
    expect(() => requestQuizSessionUpdate(
      quizId1, sessionId1, -1, 'NEXT_QUESTION')).toThrow(HTTPError[401]);
  });

  // 403 : Invalid Quiz Id
  test('403 : Invalid Quiz Id', () => {
    expect(() => requestQuizSessionUpdate(
      quizId1 + 1, sessionId1, token1, 'NEXT_QUESTION')).toThrow(HTTPError[403]);
  });
  test('403 : Empty Quiz Id', () => {
    expect(() => requestQuizSessionUpdate(
      0, sessionId1, token1, 'NEXT_QUESTION')).toThrow(HTTPError[403]);
  });
  test('403 : Out of range Quiz Id', () => {
    expect(() => requestQuizSessionUpdate(
      -1, sessionId1, token1, 'NEXT_QUESTION')).toThrow(HTTPError[403]);
  });

  // 403 : Quiz not owned by user
  test('403 : Quiz Not Owned By User 1', () => {
    expect(() => requestQuizSessionUpdate(
      quizId2, sessionId2, token1, 'NEXT_QUESTION')).toThrow(HTTPError[403]);
  });
  test('403 : Quiz Not Owned By User 2', () => {
    expect(() => requestQuizSessionUpdate(
      quizId1, sessionId2, token2, 'NEXT_QUESTION')).toThrow(HTTPError[403]);
  });

  // Not sure whether these 2 400 or 403
  test('403 : Session Does Not Owned by Quiz', () => {
    expect(() => requestQuizSessionUpdate(
      quizId1, sessionId2, token1, 'NEXT_QUESTION')).toThrow(HTTPError[403]);
  });
  test('403 : Session Does Not Owned by Quiz', () => {
    expect(() => requestQuizSessionUpdate(
      quizId2, sessionId1, token2, 'NEXT_QUESTION')).toThrow(HTTPError[403]);
  });
});

describe('Valid Cases', () => {
  test('Perfect Case 1', () => {
    const result = requestQuizSessionUpdate(
      quizId1, sessionId1, token1, 'NEXT_QUESTION');
    expect(result).toMatchObject({});
  });
  test('Perfect Case 2', () => {
    const result = requestQuizSessionUpdate(
      quizId2, sessionId2, token2, 'NEXT_QUESTION');
    expect(result).toMatchObject({});
  });
  test('Perfect Case 3', () => {
    requestQuizSessionUpdate(quizId1, sessionId1, token1, 'NEXT_QUESTION');
    const result = requestQuizSessionUpdate(
      quizId2, sessionId2, token2, 'NEXT_QUESTION');
    expect(result).toMatchObject({});
  });
});
