/*
- Get session status
- Parameters :
        - quizId (path)
        - sessionId (path)
        - token (header)
- Return : sessionStatus

ERROR : 400
inval400 : Session Id does not refer to a valid session within this quiz

ERROR : 401
token401 : Token is empty or invalid

ERROR : 403
unauth403 : Valid token, user unauthorised

*/

import {
  sessionStatus,
  DEFAULT_QUIZ_THUMBNAIL,
  ErrorObject
} from '../../dataStore';

import HTTPError from 'http-errors';

import {
  requestClear,
  requestRegister,
  requestQuizCreate,
  requestQuizGetSession,
  requestQuizSessionStart,
  requestQuestionCreate,
  requestPlayerJoin
} from '../testHelper';

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
let result: sessionStatus | ErrorObject;
let token1: number;
let token2: number;
let quizId1: number;
let quizId2: number;
let sessionId1: number;
let sessionId2: number;

// Clear the dataBase before each test to avoid data interference
beforeEach(() => {
  requestClear();

  token1 = requestRegister('am@gmail.com', 'Vl1dPass', 'fir', 'las').token;
  quizId1 = requestQuizCreate(token1, 'Quiz 1', '').quizId;
  requestQuestionCreate(token1, quizId1, questionBody);
  sessionId1 = requestQuizSessionStart(token1, quizId1, 3).sessionId;
  requestPlayerJoin(sessionId1, 'Name1');

  token2 = requestRegister('ab@gmail.com', 'Vl3dPass', 'firs', 'last').token;
  quizId2 = requestQuizCreate(token2, 'Quiz 2', '').quizId;
  requestQuestionCreate(token2, quizId2, questionBody);
  sessionId2 = requestQuizSessionStart(token2, quizId2, 2).sessionId;
  requestPlayerJoin(sessionId2, 'Name2');
});

/// ////////////////////////////////////////////////////////////////////////////
/// //////////////////////////////// Tests /////////////////////////////////////
/// ////////////////////////////////////////////////////////////////////////////

describe('Invalid Tests', () => {
  // 400 : Invalid Session ID
  test('Empty Session ID', () => {
    // Session Id is empty
    expect(() => requestQuizGetSession(quizId1, 0, token1)).toThrow(HTTPError[400]);
  });
  test('Invalid Session ID', () => {
    // Session Id is empty
    expect(() => requestQuizGetSession(quizId1, sessionId1 + 1, token1)).toThrow(HTTPError[400]);
  });
  test('Out Of Range Session ID', () => {
    // Session Id is empty
    expect(() => requestQuizGetSession(quizId1, -1, token1)).toThrow(HTTPError[400]);
  });

  // 401 : Invalid token
  test('Empty Token', () => {
    // Token is empty
    expect(() => requestQuizGetSession(quizId1, sessionId1, 0)).toThrow(HTTPError[401]);
  });
  // Invalid Token
  test('Invalid Token', () => {
    // Token is invalid
    expect(() => requestQuizGetSession(quizId1, sessionId1, token1 + 1)).toThrow(HTTPError[401]);
    expect(() => requestQuizGetSession(quizId1, sessionId1, token1 - 1)).toThrow(HTTPError[401]);
  });
  // Out of Range Token
  test('Out of Range Token', () => {
    // Token is out of range
    expect(() => requestQuizGetSession(quizId1, sessionId1, -1)).toThrow(HTTPError[401]);
  });

  // 403 : Invalid Quiz ID
  test('Empty Quiz ID', () => {
    // Quiz ID is empty
    expect(() => requestQuizGetSession(0, sessionId1, token1)).toThrow(HTTPError[403]);
  });
  test('Invalid Quiz ID', () => {
    // Quiz ID is invalid
    expect(() => requestQuizGetSession(quizId1 + 1, sessionId1, token1)).toThrow(HTTPError[403]);
    expect(() => requestQuizGetSession(quizId1 - 1, sessionId1, token1)).toThrow(HTTPError[403]);
  });

  // 403 : Unauthorised Session ID
  test('Session ID is unauthorised', () => {
    // Session ID is invalid
    expect(() => requestQuizGetSession(quizId1, sessionId1 + 1, token1)).toThrow(HTTPError[403]);
    expect(() => requestQuizGetSession(quizId1, sessionId1 - 1, token1)).toThrow(HTTPError[403]);
  });

  // Quiz does not match session ID
  test('Quiz ID does not match Session ID', () => {
    // Quiz does not match session ID
    expect(() => requestQuizGetSession(quizId1, sessionId2, token1)).toThrow(HTTPError[403]);
    expect(() => requestQuizGetSession(quizId2, sessionId1, token2)).toThrow(HTTPError[403]);
  });
});

describe('Valid Tests', () => {
  test('Simple Case 1', () => {
  // Attempt to get session
    result = requestQuizGetSession(quizId1, sessionId1, token1);
    expect(result).toMatchObject({
      state: 'LOBBY',
      atQuestion: expect.any(Number),
      players: [expect.any(String)],
      metadata: {
        quizId: quizId1,
        name: expect.any(String),
        timeCreated: expect.any(Number),
        timeLastEdited: expect.any(Number),
        description: expect.any(String),
        numQuestions: expect.any(Number),
        questions: [
          {
            questionId: expect.any(Number),
            question: expect.any(String),
            duration: expect.any(String),
            thumbnailUrl: DEFAULT_QUIZ_THUMBNAIL,
            points: expect.any(Number),
            answers: [
              {
                answerId: expect.any(Number),
                answer: expect.any(Number),
                colour: expect.any(Number),
                correct: expect.any(Number)
              }
            ]
          }
        ],
        duration: expect.any(Number),
        thumbnailUrl: DEFAULT_QUIZ_THUMBNAIL
      }
    });
  });
  test('Simple Case 2', () => {
    // Attempt to get session
      result = requestQuizGetSession(quizId2, sessionId2, token2);
      expect(result).toMatchObject({
        state: 'LOBBY',
        atQuestion: expect.any(Number),
        players: [expect.any(String)],
        metadata: {
          quizId: quizId2,
          name: expect.any(String),
          timeCreated: expect.any(Number),
          timeLastEdited: expect.any(Number),
          description: expect.any(String),
          numQuestions: expect.any(Number),
          questions: [
            {
              questionId: expect.any(Number),
              question: expect.any(String),
              duration: expect.any(String),
              thumbnailUrl: DEFAULT_QUIZ_THUMBNAIL,
              points: expect.any(Number),
              answers: [
                {
                  answerId: expect.any(Number),
                  answer: expect.any(Number),
                  colour: expect.any(Number),
                  correct: expect.any(Number)
                }
              ]
            }
          ],
          duration: expect.any(Number),
          thumbnailUrl: DEFAULT_QUIZ_THUMBNAIL
        }
      });
    });
});
