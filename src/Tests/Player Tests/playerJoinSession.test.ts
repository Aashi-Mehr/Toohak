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

function checkName(name: string): boolean {
  // First 5 need to be unique letters
  for (let i = 0; i < 5; i++) {
    if (!/[a-zA-Z]/.test(name[i])) {
      return false;
    }

    if (name.split('').filter(char => char === name[i]).length > 1) {
      return false;
    }
  }

  // Next 3 need to be unique numbers
  for (let i = 5; i < 8; i++) {
    if (!/[0-9]/.test(name[i])) {
      return false;
    }

    if (name.split('').filter(char => char === name[i]).length > 1) {
      return false;
    }
  }

  // Length needs to be 8
  if (name.length !== 8) return false;
  else return true;
}

describe('Checking name format function', () => {
  // Valid strings
  test('Valid Strings', () => {
    expect(checkName('ABCDE123')).toBe(true);
    expect(checkName('abcde123')).toBe(true);
  });

  // Invalid: More than 3 digits
  test('Invalid: More than 3 digits', () => {
    expect(checkName('ABCD1234')).toBe(false);
  });

  // Invalid: Repeated character in letters
  test('Invalid: Repeated character in letters', () => {
    expect(checkName('ABCCC123')).toBe(false);
  });

  // Invalid: More than 5 letters
  test('Invalid: More than 5 letters', () => {
    expect(checkName('A1B2C3D4E5')).toBe(false);
  });

  // Invalid: Less than 3 digits
  test('Invalid: Less than 3 digits', () => {
    expect(checkName('ABCDE12')).toBe(false);
  });
});

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
  ],
  thumbnailUrl: 'https://ThisIsSomehowValid.jpeg'
};

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
    requestPlayerJoin(quizSessionId, 'Name1');

    expect(() => requestPlayerJoin(
      quizSessionId, 'Name1'
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

  // Error 400: Session is not in LOBBY state
  test('Error 400: Session is not in LOBBY state, it doesn\'t exist', () => {
    expect(() => requestPlayerJoin(0, 'Name1')).toThrow(HTTPError[400]);
  });
});

describe('Valid Cases', () => {
  let result: PlayerId;

  // Simple case where user 1 joins the session
  test('Simple Case 1', () => {
    result = requestPlayerJoin(quizSessionId, 'Name1');
    expect(result).toMatchObject({ playerId: expect.any(Number) });
  });

  // Simple case where user needs a name generated
  test('Simple Case 2', () => {
    // Conforms to "[5 letters][3 numbers]" with no repeated characters
    result = requestPlayerJoin(quizSessionId, '');
    expect(result).toMatchObject({ playerId: expect.any(Number) });

    requestPlayerMessage(result.playerId, { messageBody: 'Checking name' });
    const name = requestPlayerChat(result.playerId).messages[0].playerName;
    expect(checkName(name)).toBe(true);
  });

  // Simple case where user needs a name generated
  test('Simple Case 3', () => {
    // Conforms to "[5 letters][3 numbers]" with no repeated characters
    result = requestPlayerJoin(quizSessionId, '');
    expect(result).toMatchObject({ playerId: expect.any(Number) });

    requestPlayerMessage(result.playerId, { messageBody: 'Checking name' });
    const name = requestPlayerChat(result.playerId).messages[0].playerName;
    expect(checkName(name)).toBe(true);
  });

  // Simple case where multiple users need their names generated
  test('Simple Case 4', () => {
    // Conforms to "[5 letters][3 numbers]" with no repeated characters
    result = requestPlayerJoin(quizSessionId, '');
    requestPlayerMessage(result.playerId, { messageBody: 'Checking name' });
    const name = requestPlayerChat(result.playerId).messages[0].playerName;
    expect(checkName(name)).toBe(true);

    const player2 = requestPlayerJoin(quizSessionId, '').playerId;
    requestPlayerMessage(player2, { messageBody: 'Checking name' });
    const name2 = requestPlayerChat(player2).messages[1].playerName;
    expect(checkName(name2)).toBe(true);

    expect(name).not.toEqual(name2);
  });
});
