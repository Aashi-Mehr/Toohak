/*
  Test-Functions for:
   1. adminQuizList
   2. adminQuizInfo

  Author:
  Zhejun Gu (z5351573)

  Edited on:
  20/10/2023
  */

import request from 'sync-request-curl';
import { port, url } from '../config.json';

import {
  ErrorObject,
  Token,
  QuizList,
  QuizDetailed
} from '../dataStore';

import {
  requestRegister,
  requestQuizCreate,
  requestQuizList,
  // requestQuizRemove,
  requestQuizInfo
} from './testHelper';

const SERVER_URL = `${url}:${port}`;

/// ////////////////////////////////////////////////////////////////////////////
/// //////////////////////////////// Tests /////////////////////////////////////
/// ////////////////////////////////////////////////////////////////////////////

// Clear the dataBase before each test to avoid data interference
beforeEach(() => {
  const res = request(
    'DELETE',
    SERVER_URL + '/v1/clear',
    {
      qs: { }
    }
  );
  return JSON.parse(res.body.toString());
});

// Test function : adminQuizList
describe('adminQuizList', () => {
  /* let userId: token; */
  let quiz: QuizList | ErrorObject;
  /* let quizId: number; */

  test('INVALID User Id: Type of string or negative number', () => {
    quiz = requestQuizList('123321');
    expect(quiz).toMatchObject({ error: expect.any(String) });

    quiz = requestQuizList(-1);
    expect(quiz).toMatchObject({ error: expect.any(String) });
  });

  test('INVALID User Id: Not in the data base', () => {
    /* userId = requestRegister('first.last1@gmail.com', 'abcd1234', 'first',
      'last'); */
    quiz = requestQuizList(11);
    expect(quiz).toMatchObject({ error: expect.any(String) });
  });

  /* test('VALID 1 Quiz', () => {
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
          quizId: quizId1,
          name: 'first last1',
        },
        {
          quizId: quizId2,
          name: 'first last2',
        }
      ]
    });
  });

  test('VALID After Removal', () => {
    userId = requestRegister('1531_user1@gmail.com', 'C123321c', 'first',
      'last');
    quizId = requestQuizCreate(userId.token, 'first last1', '').quizId;
    requestRemove(userId.token, quizId);

    const result = requestQuizList(userId.token);
    expect(result).toMatchObject({ quizzes: [] });
  }); */
});

// Test function : adminQuizInfo
describe('adminQuizInfo', () => {
  let userId: Token;
  let quiz: QuizDetailed | ErrorObject;
  let quizId: number;

  test('INVALID User Id: Not a number or out of range number', () => {
    quiz = requestQuizInfo('12321', 1);
    expect(quiz).toMatchObject({ error: expect.any(String) });

    quiz = requestQuizInfo(-1, 1);
    expect(quiz).toMatchObject({ error: expect.any(String) });
  });

  test('INVALID User Id: Invalid quizId or quizId not matching', () => {
    // Register test id: 2 by user id: 1
    quizId = requestQuizCreate(1, 'first last', 'fist_test').quizId;

    // Quiz ID does not refer to a valid quiz
    quiz = requestQuizInfo(1, -100);
    expect(quiz).toMatchObject({ error: expect.any(String) });

    // Quiz ID does not refer to a quiz that this user owns
    quiz = requestQuizInfo(2, 2);
    expect(quiz).toMatchObject({ error: expect.any(String) });
  });

  test('INVALID User Id: UserId does not exist', () => {
    // Register user with id: 1
    userId = requestRegister('firstlast@gmail.com', 'abcd1234', 'firs', 'last');

    // Correct format UserId but never is the Id being registered
    quiz = requestQuizInfo(4, 1);
    expect(quiz).toMatchObject({ error: expect.any(String) });
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
    });
  });

  test('Test successful quiz read - correct timestamp format', () => {
    userId = requestRegister('user1531@gmail.com', 'Password1', 'firs', 'last');
    quizId = requestQuizCreate(userId.token, 'first last', '').quizId;

    quiz = requestQuizInfo(userId.token, quizId);
    expect(quiz.timeCreated.toString()).toMatch(/^\d{10}$/);
    expect(quiz.timeLastEdited.toString()).toMatch(/^\d{10}$/);
  });

  test('Test quizId invalid error, cannot read', () => {
    userId = requestRegister('user1@gmail.com', 'C123321c', 'first', 'last');
    quizId = requestQuizCreate(userId.token, 'first last', '').quizId;

    const quiz = requestQuizInfo(userId.token, quizId + 1);
    expect(quiz).toStrictEqual({ error: expect.any(String) });
  });
});
