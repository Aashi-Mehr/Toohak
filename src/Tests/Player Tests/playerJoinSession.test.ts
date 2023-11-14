// Import requests
import { PlayerId } from '../../dataStore';

import {
  requestClear,
  requestRegister,
  requestQuizCreate,
  requestQuizSessionStart,
  requestQuestionCreate,
  requestPlayerJoin,
  requestPlayerChat,
  requestPlayerMessage
} from '../testHelper';

import HTTPError from 'http-errors';

/// ////////////////////////////////////////////////////////////////////////////
/// //////////////////////////////// Tests /////////////////////////////////////
/// ////////////////////////////////////////////////////////////////////////////

// Defining a constant questionBody
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

// Defnining a constant name structure
const regexName = /^(?!.*(.).*\1)[A-Za-z]{5}(?!(.*\d.*){2})\d{3}$/;

// Defining variables to be used later
let token: number;
let quizId: number;
let quizSessionId: number;

// Clearing the datastore, so that the tests are independent of previous data
beforeEach(() => {
  requestClear();

  // User, quiz, and quizSession
  token = requestRegister('am@gmail.com', 'Val1Pass', 'fir', 'las').token;
  quizId = requestQuizCreate(token, 'New Quiz', '').quizId;
  requestQuestionCreate(token, quizId, questionBody);
  quizSessionId = requestQuizSessionStart(token, quizId, 0).sessionId;
});

describe('Error Cases', () => {
  // Error 400: Name of user entered is not unique
  test('Error 400: Name of user entered is not unique', () => {
    requestPlayerJoin(quizSessionId, "Name1");

    expect(() => requestPlayerJoin(
      quizSessionId, "Name1"
    )).toThrow(HTTPError[400]);
  });

  // Error 400: Session is not in LOBBY state
  test('Error 400: Session is not in LOBBY state', () => {
    // requestUpdateSessionState(token, quizId, quizSessionId, "NEXT_QUESTION");

    // expect(() => requestPlayerJoin(
    //   quizSessionId, "Name1"
    // )).toThrow(HTTPError[400]);

    // Uncomment after requestUpdateSessionState is created
    expect(1 + 1).toStrictEqual(2);
  });
});

describe('Valid Cases', () => {
  let result: PlayerId;

  // Simple case where user 1 joins the session
  test('Simple Case 1', () => {
    result = requestPlayerJoin(quizSessionId, "Name1");
    expect(result).toMatchObject({ playerId: expect.any(Number) });
  });

  // Simple case where user needs a name generated
  test('Simple Case 2', () => {
    // Conforms to "[5 letters][3 numbers]" with no repeated characters
    result = requestPlayerJoin(quizSessionId, "");
    expect(result).toMatchObject({ playerId: expect.any(Number) });

    requestPlayerMessage(result.playerId, { messageBody: "Checking name" });
    let name = requestPlayerChat(result.playerId).messages[0].playerName;
    expect(regexName.test(name)).toBe(true);
  });

  // Simple case where user needs a name generated
  test('Simple Case 3', () => {
    // Conforms to "[5 letters][3 numbers]" with no repeated characters
    result = requestPlayerJoin(quizSessionId, "");
    expect(result).toMatchObject({ playerId: expect.any(Number) });

    requestPlayerMessage(result.playerId, { messageBody: "Checking name" });
    let name = requestPlayerChat(result.playerId).messages[0].playerName;
    expect(regexName.test(name)).toBe(true);
  });

  // Simple case where multiple users need their names generated
  test('Simple Case 4', () => {
    // Conforms to "[5 letters][3 numbers]" with no repeated characters
    result = requestPlayerJoin(quizSessionId, "");
    requestPlayerMessage(result.playerId, { messageBody: "Checking name" });
    let name = requestPlayerChat(result.playerId).messages[0].playerName;
    expect(regexName.test(name)).toBe(true);

    let player2 = requestPlayerJoin(quizSessionId, "").playerId;
    requestPlayerMessage(player2, { messageBody: "Checking name" });
    let name2 = requestPlayerChat(player2).messages[1].playerName;
    expect(regexName.test(name2)).toBe(true);

    expect(name).not.toEqual(name2);
  });
});
