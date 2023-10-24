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

const SERVER_URL = `${url}:${port}`;

/// ////////////////////////////////////////////////////////////////////////////
/// ////////////////////////////// Interfaces //////////////////////////////////
/// ////////////////////////////////////////////////////////////////////////////

interface ErrorObject {
  error: string
}

interface Token {
  token: number
}

interface QuizId {
  quizId: number
}

interface QuizBrief {
  quizId: number,
  name: string
}

interface QuizDetailed {
  quizId: number,
  name: string,
  timeCreated: number,
  timeLastEdited: number,
  description: string
}

interface QuizList { quizzes: QuizBrief[] }

/// ////////////////////////////////////////////////////////////////////////////
/// ////////////////////////// Wrapper Functions ///////////////////////////////
/// ////////////////////////////////////////////////////////////////////////////

// POST REGISTER Define wrapper function
function requestRegister(email: string, password: string, nameFirst: string,
  nameLast: string): Token {
  const res = request(
    'POST',
    SERVER_URL + '/v1/admin/auth/register',
    {
      json: {
        email: email,
        password: password,
        nameFirst: nameFirst,
        nameLast: nameLast
      }
    }
  );

  const result = JSON.parse(res.body.toString());

  if ('error' in result) return { token: -1 };
  else return result;
}

// QUIZ CREATE Define wrapper function
function requestQuiz(token: number, name: string, description: any): QuizId {
  const res = request(
    'POST',
    SERVER_URL + '/v1/admin/quiz',
    {
      json: {
        token: token,
        name: name,
        description: description
      }
    }
  );

  const result = JSON.parse(res.body.toString());

  if ('error' in result) { return { quizId: -1 }; } else { return result; }
}

// QUIZ LIST Define wrapper function
function requestList(token: number | string): QuizList | ErrorObject {
  const res = request(
    'GET',
    `${SERVER_URL}/v1/admin/quiz/list?token=${token}`,
    {}
  );
  const result = JSON.parse(res.body as string);

  if ('error' in result) { return { error: 'error' }; } else { return result; }
}

/* // QUIZ REMOVE Define wrapper function
function requestRemove(token: number, quizId: number):
  ErrorObject | Record<string, never> {
  const res = request(
    'DELETE',
    SERVER_URL + '/v1/admin/quiz/' + quizId,
    {
      json: {
        token: token
      }
    }
  );
  return JSON.parse(res.body.toString());
} */

// QUIZ INFO Define wrapper function
function requestInfo(token: number | string, quizId: number): QuizDetailed {
  const res = request(
    'GET',
    SERVER_URL + '/v1/admin/quiz/' + quizId,
    {
      json: {
        token: token
      }
    }
  );
  return JSON.parse(res.body.toString());
}

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
    quiz = requestList('123321');
    expect(quiz).toMatchObject({ error: expect.any(String) });

    quiz = requestList(-1);
    expect(quiz).toMatchObject({ error: expect.any(String) });
  });

  test('INVALID User Id: Not in the data base', () => {
    /* userId = requestRegister('first.last1@gmail.com', 'abcd1234', 'first',
      'last'); */
    quiz = requestList(11);
    expect(quiz).toMatchObject({ error: expect.any(String) });
  });

  /* test('VALID 1 Quiz', () => {
    userId = requestRegister('1531_user1@gmail.com', 'C123321c', 'first',
      'last');
    quizId = requestQuiz(userId.token, 'first last', '').quizId;

    quiz = requestList(userId.token);
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
    const quizId1 = requestQuiz(userId.token, 'first last1', '');
    const quizId2 = requestQuiz(userId.token, 'first last2', '');

    quiz = requestList(userId.token);
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
    quizId = requestQuiz(userId.token, 'first last1', '').quizId;
    requestRemove(userId.token, quizId);

    const result = requestList(userId.token);
    expect(result).toMatchObject({ quizzes: [] });
  }); */
});

// Test function : adminQuizInfo
describe('adminQuizInfo', () => {
  let userId: Token;
  let quiz: QuizDetailed | ErrorObject;
  let quizId: number;

  test('INVALID User Id: Not a number or out of range number', () => {
    quiz = requestInfo('12321', 1);
    expect(quiz).toMatchObject({ error: expect.any(String) });

    quiz = requestInfo(-1, 1);
    expect(quiz).toMatchObject({ error: expect.any(String) });
  });

  test('INVALID User Id: Invalid quizId or quizId not matching', () => {
    // Register test id: 2 by user id: 1
    quizId = requestQuiz(1, 'first last', 'fist_test').quizId;

    // Quiz ID does not refer to a valid quiz
    quiz = requestInfo(1, -100);
    expect(quiz).toMatchObject({ error: expect.any(String) });

    // Quiz ID does not refer to a quiz that this user owns
    quiz = requestInfo(2, 2);
    expect(quiz).toMatchObject({ error: expect.any(String) });
  });

  test('INVALID User Id: UserId does not exist', () => {
    // Register user with id: 1
    userId = requestRegister('first.last1@gmail.com', 'abcd1234', 'first', 'last');

    // Correct format UserId but never is the Id being registered
    quiz = requestInfo(4, 1);
    expect(quiz).toMatchObject({ error: expect.any(String) });
  });

  test('Test Valid User and Quiz Ids', () => {
    userId = requestRegister('1531_user1@1531.com', 'C123321c', 'first', 'last');
    quizId = requestQuiz(userId.token, 'first last', '').quizId;

    expect(requestInfo(userId.token, quizId)).toMatchObject({
      quizId: quizId,
      name: 'first last',
      timeCreated: expect.any(Number),
      timeLastEdited: expect.any(Number),
      description: expect.any(String),
    });
  });

  test('Test successful quiz read - correct timestamp format', () => {
    userId = requestRegister('1531_user1@1531.com', 'C123321c', 'first', 'last');
    quizId = requestQuiz(userId.token, 'first last', '').quizId;

    quiz = requestInfo(userId.token, quizId);
    expect(quiz.timeCreated.toString()).toMatch(/^\d{10}$/);
    expect(quiz.timeLastEdited.toString()).toMatch(/^\d{10}$/);
  });

  test('Test quizId invalid error, cannot read', () => {
    userId = requestRegister('1531_user1@1531.com', 'C123321c', 'first', 'last');
    quizId = requestQuiz(userId.token, 'first last', '').quizId;

    const quiz = requestInfo(userId.token, quizId + 1);
    expect(quiz).toStrictEqual({ error: expect.any(String) });
  });
});
