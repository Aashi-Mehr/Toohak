/*
  Test-Functions for:
   1. adminQuizList
   2. adminQuizInfo

  Author:
  Zhejun Gu (z5351573)

  Edited on:
  06/11/2023
  */

import {
  ErrorObject,
  Token,
  QuizList,
  QuizInfo
} from '../dataStore';

import {
  requestRegister,
  requestQuizCreate,
  requestQuizList,
  requestQuizInfo,
  requestQuizRemove,
  requestClear
} from './testHelper';

import HTTPError from 'http-errors';

/// ////////////////////////////////////////////////////////////////////////////
/// //////////////////////////////// Tests /////////////////////////////////////
/// ////////////////////////////////////////////////////////////////////////////

// Clearing the datastore, so that the tests are independent of previous data
beforeEach(() => {
  requestClear();
});

// Test function : adminQuizList
describe('adminQuizList', () => {
  let userId: Token;
  let quiz: QuizList | ErrorObject;
  let quizId: number;

  test('INVALID User Id: Type of string or negative number', () => {
    expect(() => requestQuizList('123321')).toThrow(HTTPError[401]);
    expect(() => requestQuizList(-1)).toThrow(HTTPError[401]);
  });

  test('INVALID User Id: Not in the data base', () => {
    userId = requestRegister('first.last1@gmail.com', 'abcd1234', 'first', 
      'last');
    expect(() => requestQuizList(11)).toThrow(HTTPError[401]);
  });

  test('VALID 1 Quiz', () => {
    userId = requestRegister('1531_user1@gmail.com', 'C123321c', 'first',
      'last');
    quizId = requestQuizCreate(userId.token, 'first last', '').quizId;

    quiz = requestQuizList(userId.token);
    expect(quiz).toMatchObject({
      quizzes: [
        {
          quizId: quizId,
          name: 'first last',
        }
      ]
    });
  });

  test('VALID 2 Quizzes', () => {
    userId = requestRegister('1531_user1@gmail.com', 'C123321c', 'first',
      'last');
    const quizId1 = requestQuizCreate(userId.token, 'first last1', '');
    const quizId2 = requestQuizCreate(userId.token, 'first last2', '');

    quiz = requestQuizList(userId.token);
    expect(quiz).toMatchObject({
      quizzes: [
        {
          quizId: quizId1.quizId,
          name: 'first last1',
        },
        {
          quizId: quizId2.quizId,
          name: 'first last2',
        }
      ]
    });
  });

  test('VALID After Removal', () => {
    userId = requestRegister('1531_user1@gmail.com', 'C123321c', 'first',
      'last');
    quizId = requestQuizCreate(userId.token, 'first last1', '').quizId;
    requestQuizRemove(userId.token, quizId);

    const result = requestQuizList(userId.token);
    expect(result).toMatchObject({ quizzes: [] });
  });
});

// Test function : adminQuizInfo
describe('adminQuizInfo', () => {
  let userId: Token;
  let quiz: QuizInfo | ErrorObject;
  let quizId: number;

  test('INVALID User Id: Not a number or out of range number', () => {
    expect(() => requestQuizInfo('123321', 1)).toThrow(HTTPError[401]);
    expect(() => requestQuizInfo(-1, 1)).toThrow(HTTPError[401]);
  });

  test('INVALID User Id: Invalid quizId or quizId not matching', () => {
    // Register test id: 2 by user id: 1
    quizId = requestQuizCreate(1, 'first last', 'fist_test').quizId;

    // Quiz ID does not refer to a valid quiz
    expect(() => requestQuizInfo(1, 100)).toThrow(HTTPError[403]);

    // Quiz ID does not refer to a quiz that this user owns
    expect(() => requestQuizInfo(2, 2)).toThrow(HTTPError[403]);
  });

  test('INVALID User Id: UserId does not exist', () => {
    // Register user with id: 1
    userId = requestRegister('firstlast@gmail.com', 'abcd1234', 'firs', 'last');

    // Correct format UserId but never is the Id being registered
    expect(() => requestQuizInfo(4, 1)).toThrow(HTTPError[401]);
  });

  test('Test Valid User and Quiz Ids', () => {
    userId = requestRegister('user1531@gmail.com', 'Password1', 'firs', 'last');
    quizId = requestQuizCreate(userId.token, 'QuizName', '').quizId;

    expect(requestQuizInfo(userId.token, quizId)).toMatchObject({
      quizId: quizId,
      name: 'QuizName',
      timeCreated: expect.any(Number),
      timeLastEdited: expect.any(Number),
      description: expect.any(String),
      numQuestions: 0,
      questions: [],
      duration: 0
    });
  });

  test('Test successful quiz read - correct timestamp format', () => {
    userId = requestRegister('user1531@gmail.com', 'Password1', 'firs', 'last');
    quizId = requestQuizCreate(userId.token, 'first last', '').quizId;

    quiz = requestQuizInfo(userId.token, quizId);
    expect(quiz).toMatchObject({
      quizId: quizId,
      name: 'first last',
      timeCreated: expect.any(Number),
      timeLastEdited: expect.any(Number),
      description: expect.any(String),
      numQuestions: 0,
      questions: [],
      duration: 0
    });

    // This will always be true if the above expect-test passes
    if ('timeCreated' in quiz && 'timeLastEdited' in quiz) {
      expect(quiz.timeCreated.toString()).toMatch(/^\d{10}$/);
      expect(quiz.timeLastEdited.toString()).toMatch(/^\d{10}$/);
    }
  });

  test('Test quizId invalid error, cannot read', () => {
    userId = requestRegister('user1@gmail.com', 'C123321c', 'first', 'last');
    quizId = requestQuizCreate(userId.token, 'first last', '').quizId;

    expect(() => requestQuizInfo(
      userId.token, quizId + 1
    )).toThrow(HTTPError[403]);
  });
});
