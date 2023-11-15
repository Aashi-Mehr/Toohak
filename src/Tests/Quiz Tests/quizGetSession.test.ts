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
  Token
//   sessionStatus
} from '../../dataStore';
import HTTPError from 'http-errors';
import {
  requestClear,
  requestQuizCreate,
  requestQuizGetSession,
  requestQuizSessionStart,
  requestQuestionCreate,

} from '../testHelper';

// Clear the dataBase before each test to avoid data interference
beforeEach(() => {
    requestClear();
});

interface sessionStatus {
    state: string,
    atQuestion: number,
    players: [],
    metadata: QuizInfo[]
}

interface QuizInfo {
    quizId: number,
    name: string,
    timeCreated: number,
    timeLastEdited: number,
    description: string,
    numQuestions: number,
    questions: Question[],
    duration: number,
    thumbnailUrl: string
}

interface Question {
    questionId: number,
    question: string,
    duration: number,
    points: number,
    answers: Answer[],
    thumbnailUrl: string
}

interface Answer {
    answerId: number,
    answer: string,
    colour: string,
    correct: boolean
}

let quizId: number;
let sessionId: number;
let token: number;
let questionId:

token = 
quizId = requestQuizCreate(token, 'Quiz 1', '').quizId;
requestQuestionCreate(token, quizId, questionBody);
sessionId = requestQuizSessionStart(token, quizId,3);

  
/// ////////////////////////////////////////////////////////////////////////////
/// //////////////////////////////// Tests /////////////////////////////////////
/// ////////////////////////////////////////////////////////////////////////////

describe('Invalid Tests', () => {
  // 400 : Invalid Session ID
  test('Empty Session ID', () => {
    // Session Id is empty
    expect(() => requestQuizGetSession(quizId, 0, token)).toThrow(HTTPError[400]);
  });
  test('Invalid Session ID', () => {
    // Session Id is empty
    expect(() => requestQuizGetSession(quizId, sessionId + 1, token)).toThrow(HTTPError[400]);
  });
  test('Out Of Range Session ID', () => {
    // Session Id is empty
    expect(() => requestQuizGetSession(quizId, -1, token)).toThrow(HTTPError[400]);
  });

  // 401 : Token in empty
  test('Empty Token', () => {
    // Token is empty
    expect(() => requestQuizGetSession(quizId, sessionId, 0)).toThrow(HTTPError[401]);
  });
  // Invalid Token
  test('Invalid Token', () => {
    // Token is invalid
    expect(() => requestQuizGetSession(quizId, sessionId, 'z544444')).toThrow(HTTPError[401]);
  });
  // Out of Range Token
  test('Out of Range Token', () => {
    // Token is out of range
    expect(() => requestQuizGetSession(quizId, sessionId, -1)).toThrow(HTTPError[401]);
  });
  
  // 403 : Unauthorised Session ID
  test('Session ID is unauthorised', () => {
    // Session ID is invalid
    expect(() => requestQuizGetSession(quizId, sessionId + 1, token)).toThrow(HTTPError[403]);
    expect(() => requestQuizGetSession(quizId, sessionId - 1, token)).toThrow(HTTPError[403]);
  });
  // Quiz does not match session ID
  test('Quiz ID does not match Session ID', () => {
    // Quiz ID is invalid
    expect(() => requestQuizGetSession(quizId + 1, sessionId, token)).toThrow(HTTPError[403]);
    expect(() => requestQuizGetSession(quizId - 1, sessionId, token)).toThrow(HTTPError[403]);
    // Quiz ID is empty
    expect(() => requestQuizGetSession(0, sessionId, token)).toThrow(HTTPError[403]);
    // Quiz ID is invalid
    expect(() => requestQuizGetSession('quizId', sessionId, token)).toThrow(HTTPError[403]);
  });
});

describe('Valid Tests', () => {
  // Attempt to get session
  let result = requestQuizGetSession(quizId, sessionId, token);
  const timestap = Math.floor(Date.now() / 1000);
  expect(result).toMatchObject({
    state: "LOBBY",
    atQuestion: 3,
    players: 'f'

  });
});