/*
  Test-Functions for:
   1. adminQuesMove
   2. adminQuesDup

  Author:
    Zhejun Gu (z5351573)

  Edited on:
    14/11/2023
  */

/// ////////////////////////////////////////////////////////////////////////////
/// ////////////////////////// Wrapper Functions ///////////////////////////////
/// ////////////////////////////////////////////////////////////////////////////

import { Token } from '../../dataStore';

import {
  requestRegister,
  requestQuizCreate,
  requestQuestionCreate,
  requestQuesMove,
  requestQuesDup,
  requestClear
} from '../testHelper';

import HTTPError from 'http-errors';

/// ////////////////////////////////////////////////////////////////////////////
/// //////////////////////////////// Tests /////////////////////////////////////
/// ////////////////////////////////////////////////////////////////////////////

// Defining base data
const validUrl = 'https://img.freepik.com/free-vector/support-local-business-' +
  'concept_23-2148592675.jpg';
const validUrl2 = 'https://img.freepik.com/free-vector/hand-drawn-iranian-wom' +
  'en-illustration_23-2149855924.jpg';
const validUrl3 = 'https://img.freepik.com/free-vector/people-analyzing-growt' +
  'h-charts_23-2148866843.jpg';

// Clear the dataBase before each test to avoid data interference
beforeEach(() => {
  requestClear();
});

// Test function : adminQuesMove Ver.1
describe('adminQuesMove Version 1', () => {
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
        ],
        thumbnailUrl: validUrl
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
        ],
        thumbnailUrl: validUrl2
      }
    ).questionId;

    expect(() => requestQuesMove(
      userId.token, 1, 555, quizId, true
    )).toThrow(HTTPError[400]);

    expect(() => requestQuesMove(
      userId.token, -12, quesId1, quizId, true
    )).toThrow(HTTPError[400]);

    expect(() => requestQuesMove(
      userId.token, 3, quesId1, quizId, true
    )).toThrow(HTTPError[400]);

    expect(() => requestQuesMove(
      userId.token + 1024, 1, quesId1, quizId, true
    )).toThrow(HTTPError[401]);
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
        ],
        thumbnailUrl: validUrl3
      }
    ).questionId;

    const result = requestQuesMove(userId.token, 1, quesId2, quizId, true);
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
        ],
        thumbnailUrl: validUrl2
      }
    ).questionId;

    expect(() => requestQuesMove(
      userId.token, 1, quesId2, quizId + 1, true
    )).toThrow(HTTPError[403]);
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
        ],
        thumbnailUrl: validUrl
      }
    ).questionId;

    expect(() => requestQuesMove(
      user2.token, 1, quesId2, quizId, true
    )).toThrow(HTTPError[403]);
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
        ],
        thumbnailUrl: validUrl2
      }
    ).questionId;

    expect(() => requestQuesMove(
      userId.token + 1, 1, quesId2, quizId, true
    )).toThrow(HTTPError[401]);
  });
});

// Test function : adminQuesMove Ver.2
describe('adminQuesMove Version 2', () => {
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
        ],
        thumbnailUrl: validUrl3
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
        ],
        thumbnailUrl: validUrl2
      }
    ).questionId;

    expect(() => requestQuesMove(
      userId.token, 1, 555, quizId
    )).toThrow(HTTPError[400]);

    expect(() => requestQuesMove(
      userId.token, -12, quesId1, quizId
    )).toThrow(HTTPError[400]);

    expect(() => requestQuesMove(
      userId.token, 3, quesId1, quizId
    )).toThrow(HTTPError[400]);

    expect(() => requestQuesMove(
      userId.token + 1024, 1, quesId1, quizId
    )).toThrow(HTTPError[401]);
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
        ],
        thumbnailUrl: validUrl
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
        ],
        thumbnailUrl: validUrl2
      }
    ).questionId;

    expect(() => requestQuesMove(
      userId.token, 1, quesId2, quizId + 1
    )).toThrow(HTTPError[403]);
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
        ],
        thumbnailUrl: validUrl3
      }
    ).questionId;

    expect(() => requestQuesMove(
      user2.token, 1, quesId2, quizId
    )).toThrow(HTTPError[403]);
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
        ],
        thumbnailUrl: validUrl2
      }
    ).questionId;

    expect(() => requestQuesMove(
      userId.token + 1, 1, quesId2, quizId
    )).toThrow(HTTPError[401]);
  });
});

// Test function : adminQuesDup Ver.1
describe('adminQuesDup Version 1', () => {
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
        ],
        thumbnailUrl: validUrl
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
        ],
        thumbnailUrl: validUrl2
      }
    ).questionId;

    expect(() => requestQuesDup(
      userId1.token, quizId, (quesId1 + 1), true
    )).toThrow(HTTPError[400]);

    expect(() => requestQuesDup(
      userId2.token, quizId, quesId1, true
    )).toThrow(HTTPError[403]);
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
      ],
      thumbnailUrl: validUrl3
    }).questionId;

    const result = requestQuesDup(userId1.token, quizId, quesId2, true);
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
        ],
        thumbnailUrl: validUrl2
      }
    ).questionId;

    expect(() => requestQuesDup(
      userId1.token + 1, quizId, quesId2, true
    )).toThrow(HTTPError[401]);
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
        ],
        thumbnailUrl: validUrl
      }
    ).questionId;

    expect(() => requestQuesDup(
      userId1.token, quizId + 1, quesId2, true
    )).toThrow(HTTPError[403]);
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
        ],
        thumbnailUrl: validUrl2
      }
    ).questionId;

    expect(() => requestQuesDup(
      userId1.token, quizId, quesId2, true
    )).toThrow(HTTPError[400]);
  });
});

// Test function : adminQuesDup Ver.2
describe('adminQuesDup Version 2', () => {
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
        ],
        thumbnailUrl: validUrl3
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
        ],
        thumbnailUrl: validUrl2
      }
    ).questionId;

    expect(() => requestQuesDup(
      userId1.token, quizId, (quesId1 + 1)
    )).toThrow(HTTPError[400]);

    expect(() => requestQuesDup(
      userId2.token, quizId, quesId1
    )).toThrow(HTTPError[403]);
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
      ],
      thumbnailUrl: validUrl
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
        ],
        thumbnailUrl: validUrl2
      }
    ).questionId;

    expect(() => requestQuesDup(
      userId1.token + 1, quizId, quesId2
    )).toThrow(HTTPError[401]);
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
        ],
        thumbnailUrl: validUrl3
      }
    ).questionId;

    expect(() => requestQuesDup(
      userId1.token, quizId + 1, quesId2
    )).toThrow(HTTPError[403]);
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
        ],
        thumbnailUrl: validUrl2
      }
    ).questionId;

    expect(() => requestQuesDup(
      userId1.token, quizId, quesId2
    )).toThrow(HTTPError[400]);
  });
});
