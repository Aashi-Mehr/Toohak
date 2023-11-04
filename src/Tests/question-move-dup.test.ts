/*
  Test-Functions for:
   1. adminQuesMove
   2. adminQuesDup

  Author:
    Zhejun Gu (z5351573)

  Edited on:
    25/10/2023
  */

/// ////////////////////////////////////////////////////////////////////////////
/// ////////////////////////// Wrapper Functions ///////////////////////////////
/// ////////////////////////////////////////////////////////////////////////////

import { Token } from '../dataStore';

import {
  requestRegister,
  requestQuizCreate,
  requestQuestionCreate,
  requestQuesMove,
  requestQuesDup,
  requestClear
} from './testHelper';

/// ////////////////////////////////////////////////////////////////////////////
/// //////////////////////////////// Tests /////////////////////////////////////
/// ////////////////////////////////////////////////////////////////////////////

// Clear the dataBase before each test to avoid data interference
beforeEach(() => {
  return requestClear();
});

// Test function : adminQuesMove
describe('adminQuesMove', () => {
  let userId: Token;
  let quizId: number;
  let quesId1: number;
  let quesId2: number;

  test('INVALID INPUT: invalid quesId, newPosition or is current postion', () => {
    userId = requestRegister('first.last1@gmail.com', 'abcd1234', 'first', 'last');
    quizId = requestQuizCreate(userId.token, 'first last', 'first quiz').quizId;
    quesId1 = requestQuestionCreate(userId.token,
      quizId,
      {
        question: 'Who is the Monarch of England?',
        duration: 4,
        points: 5,
        answers: [
          {
            answer: 'Prince Charles',
            correct: true
          },
          {
            answer: 'Lovely Joe',
            correct: false
          }
        ]
      }
    ).questionId;

    quesId2 = requestQuestionCreate(userId.token,
      quizId,
      {
        question: 'Why is moon of the Earth bright in the sky?',
        duration: 3,
        points: 5,
        answers: [
          {
            answer: 'It reflects sun light',
            correct: true
          },
          {
            answer: 'It is self luminous',
            correct: false
          }
        ]
      }
    ).questionId;

    const result1 = requestQuesMove(userId.token, 1, 555, quizId);
    const result2 = requestQuesMove(userId.token, -12, quesId1, quizId);
    const result3 = requestQuesMove(userId.token, 3, quesId1, quizId);

    expect(result1).toMatchObject({ error: expect.any(String) });
    expect(result2).toMatchObject({ error: expect.any(String) });
    expect(result3).toMatchObject({ error: expect.any(String) });
  });

  test('VALID INPUT', () => {
    userId = requestRegister('first.last1@gmail.com', 'abcd1234', 'first', 'last');
    quizId = requestQuizCreate(userId.token, 'first last', 'first quiz').quizId;
    quesId2 = requestQuestionCreate(userId.token,
      quizId,
      {
        question: 'Who is the Monarch of England?',
        duration: 4,
        points: 5,
        answers: [
          {
            answer: 'Prince Charles',
            correct: true
          },
          {
            answer: 'Lovely Joe',
            correct: false
          }
        ]
      }
    ).questionId;

    const result = requestQuesMove(userId.token, 1, quesId2, quizId);
    expect(result).toMatchObject({});
  });

  test('INVALID Unauthorised 403: Case 1', () => {
    userId = requestRegister('first.last1@gmail.com', 'abcd1234', 'first', 'last');
    quizId = requestQuizCreate(userId.token, 'first last', 'first quiz').quizId;
    quesId2 = requestQuestionCreate(userId.token,
      quizId,
      {
        question: 'Who is the Monarch of England?',
        duration: 4,
        points: 5,
        answers: [
          {
            answer: 'Prince Charles',
            correct: true
          },
          {
            answer: 'Lovely Joe',
            correct: false
          }
        ]
      }
    ).questionId;

    const result = requestQuesMove(userId.token, 1, quesId2, quizId + 1);
    expect(result).toMatchObject({ error: expect.any(String) });
  });

  test('INVALID Unauthorised 403: Case 2', () => {
    userId = requestRegister('first.last1@gmail.com', 'abcd1234', 'first', 'last');
    const user2 = requestRegister('first.last2@gmail.com', 'abcd1234', 'first', 'last');
    quizId = requestQuizCreate(userId.token, 'first last', 'first quiz').quizId;
    quesId2 = requestQuestionCreate(userId.token,
      quizId,
      {
        question: 'Who is the Monarch of England?',
        duration: 4,
        points: 5,
        answers: [
          {
            answer: 'Prince Charles',
            correct: true
          },
          {
            answer: 'Lovely Joe',
            correct: false
          }
        ]
      }
    ).questionId;

    const result = requestQuesMove(user2.token, 1, quesId2, quizId);
    expect(result).toMatchObject({ error: expect.any(String) });
  });

  test('INVALID Unauthorised 401', () => {
    userId = requestRegister('first.last1@gmail.com', 'abcd1234', 'first', 'last');
    quizId = requestQuizCreate(userId.token, 'first last', 'first quiz').quizId;
    quesId2 = requestQuestionCreate(userId.token,
      quizId,
      {
        question: 'Who is the Monarch of England?',
        duration: 4,
        points: 5,
        answers: [
          {
            answer: 'Prince Charles',
            correct: true
          },
          {
            answer: 'Lovely Joe',
            correct: false
          }
        ]
      }
    ).questionId;

    const result = requestQuesMove(userId.token + 1, 1, quesId2, quizId);
    expect(result).toMatchObject({ error: expect.any(String) });
  });
});

// Test function : adminQuesDup
describe('adminQuesDup', () => {
  let userId1: Token;
  let userId2: Token;
  let quizId: number;
  let quesId1: number;
  let quesId2: number;

  test('INVALID INPUT: invalid quesId or token, valid token but not match', () => {
    userId1 = requestRegister('first.last1@gmail.com', 'abcd1234', 'first', 'last');
    userId2 = requestRegister('first.last2@gmail.com', 'DABc4231', 'firstt', 'lastt');
    quizId = requestQuizCreate(userId1.token, 'first last', 'first quiz').quizId;

    quesId1 = requestQuestionCreate(userId1.token,
      quizId,
      {
        question: 'Who is the Monarch of England?',
        duration: 4,
        points: 5,
        answers: [
          {
            answer: 'Prince Charles',
            correct: true
          },
          {
            answer: 'Lovely Joe',
            correct: false
          }
        ]
      }
    ).questionId;

    quesId2 = requestQuestionCreate(userId1.token,
      quizId,
      {
        question: 'Why is moon of the Earth bright in the sky?',
        duration: 3,
        points: 5,
        answers: [
          {
            answer: 'It reflects sun light',
            correct: true
          },
          {
            answer: 'It is self luminous',
            correct: false
          }
        ]
      }
    ).questionId;

    const result1 = requestQuesDup(userId1.token, quizId, (quesId1 + 1));
    const result3 = requestQuesDup(userId2.token, quizId, quesId1);

    expect(result1).toMatchObject({ error: expect.any(String) });
    expect(result3).toMatchObject({ error: expect.any(String) });
  });

  test('VALID INPUT', () => {
    userId1 = requestRegister('fir.last3@gmail.com', 'BaCd2134', 'firs', 'las');
    quizId = requestQuizCreate(userId1.token, 'firs las', 'Third quiz').quizId;
    quesId2 = requestQuestionCreate(userId1.token, quizId, {
      question: 'Who is the Monarch of England?',
      duration: 4,
      points: 5,
      answers: [
        {
          answer: 'Prince Charles',
          correct: true
        },
        {
          answer: 'Lovely Joe',
          correct: false
        }
      ]
    }).questionId;

    const result = requestQuesDup(userId1.token, quizId, quesId2);
    expect(result).toMatchObject({ questionId: expect.any(Number) });
  });

  test('INVALID Unauthorised 401', () => {
    userId1 = requestRegister('first.last1@gmail.com', 'abcd1234', 'first', 'last');
    quizId = requestQuizCreate(userId1.token, 'first last', 'first quiz').quizId;
    quesId2 = requestQuestionCreate(userId1.token,
      quizId,
      {
        question: 'Who is the Monarch of England?',
        duration: 4,
        points: 5,
        answers: [
          {
            answer: 'Prince Charles',
            correct: true
          },
          {
            answer: 'Lovely Joe',
            correct: false
          }
        ]
      }
    ).questionId;

    const result = requestQuesDup(userId1.token + 1, quizId, quesId2);
    expect(result).toMatchObject({ error: expect.any(String) });
  });

  test('INVALID Unauthorised 403', () => {
    userId1 = requestRegister('first.last1@gmail.com', 'abcd1234', 'first', 'last');
    quizId = requestQuizCreate(userId1.token, 'first last', 'first quiz').quizId;
    quesId2 = requestQuestionCreate(userId1.token,
      quizId,
      {
        question: 'Who is the Monarch of England?',
        duration: 4,
        points: 5,
        answers: [
          {
            answer: 'Prince Charles',
            correct: true
          },
          {
            answer: 'Lovely Joe',
            correct: false
          }
        ]
      }
    ).questionId;

    const result = requestQuesDup(userId1.token, quizId + 1, quesId2);
    expect(result).toMatchObject({ error: expect.any(String) });
  });

  test('INVALID Duration 400', () => {
    userId1 = requestRegister('first.last1@gmail.com', 'abcd1234', 'first', 'last');
    quizId = requestQuizCreate(userId1.token, 'first last', 'first quiz').quizId;
    quesId2 = requestQuestionCreate(userId1.token,
      quizId,
      {
        question: 'Who is the Monarch of England?',
        duration: 179,
        points: 5,
        answers: [
          {
            answer: 'Prince Charles',
            correct: true
          },
          {
            answer: 'Lovely Joe',
            correct: false
          }
        ]
      }
    ).questionId;

    const result = requestQuesDup(userId1.token, quizId, quesId2);
    expect(result).toMatchObject({ error: expect.any(String) });
  });
});
