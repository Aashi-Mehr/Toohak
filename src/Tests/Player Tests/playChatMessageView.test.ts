import HTTPError from 'http-errors';

import {
  requestClear,
  requestPlayerChat,
  requestPlayerMessage,
  requestQuestionCreate,
  requestQuizCreate,
  requestQuizSessionStart,
  requestRegister
} from '../testHelper';

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

let token: number;
let quizId: number;
// let sessionId: number;
let playerId: number;

const validMessage = { messageBody: 'Hello!' };
const tooShort = { messageBody: 'I' };
const tooLong = {
  messageBody: 'Test writing takes sooooooooooo long when ' +
               'other people haven\'t finished functions that you need ' +
               ':\'(... WAAAAAY TOO LOOOOOOOONG... :( :( :('
};

// Clear the dataBase before each test to avoid data interference
beforeEach(() => {
  requestClear();

  token = requestRegister('am@gmail.com', 'Val1Pass', 'fir', 'las').token;
  quizId = requestQuizCreate(token, 'Quiz1', '').quizId;
  requestQuestionCreate(token, quizId, questionBody);

  requestQuizSessionStart(token, quizId, 3);
  // sessionId = requestQuizSessionStart(token, quizId, 3).sessionId;
  // playerId = requestPlayerRegister(sessionId, 'Player1').playerId;
});

describe('playerChatMessage', () => {
  // let result: Record<string, never>;

  // 0 is never going to be generated as a playerId
  test('400: If player ID does not exist (Out of valid range)', () => {
    expect(() => requestPlayerMessage(0, validMessage)).toThrow(HTTPError[400]);
  });

  // As there is only one player, any other ID should throw an error
  test('400: If player ID does not exist (Within valid range)', () => {
    expect(() => requestPlayerMessage(
      playerId + 1, validMessage
    )).toThrow(HTTPError[400]);
  });

  // If message body is less than 1 character or more than 100 characters
  test('400: If message is less than 1 or more than 100 characters', () => {
    expect(() => requestPlayerMessage(
      playerId + 1, tooShort
    )).toThrow(HTTPError[400]);
  });

  // If message body is less than 1 character or more than 100 characters
  test('400: If message is less than 1 or more than 100 characters', () => {
    expect(() => requestPlayerMessage(
      playerId + 1, tooLong
    )).toThrow(HTTPError[400]);
  });

//  test('One message sent by only player', () => {
//    result = requestPlayerMessage(playerId, validMessage);
//    expect(Object.keys(result).length).toStrictEqual(0);
//  });
//
//  test('Messages sent by multiple players', () => {
//    let playerId2 = requestPlayerRegister(sessionId, 'Player2').playerId;
//    let playerId3 = requestPlayerRegister(sessionId, 'Player3').playerId;
//
//    requestPlayerMessage(playerId, validMessage);
//    requestPlayerMessage(playerId2, validMessage);
//    requestPlayerMessage(playerId3, validMessage);
//
//    result = requestPlayerMessage(playerId, validMessage);
//    expect(Object.keys(result).length).toStrictEqual(0);
//  });
//
//  test('Messages sent by multiple players, with errors', () => {
//    let playerId2 = requestPlayerRegister(sessionId, 'Player2').playerId;
//    let playerId3 = requestPlayerRegister(sessionId, 'Player3').playerId;
//
//    requestPlayerMessage(playerId, validMessage);
//    requestPlayerMessage(playerId2, validMessage);
//    requestPlayerMessage(playerId3, validMessage);
//
//    expect(() => requestPlayerMessage(
//      playerId, tooLong
//    )).toThrow(HTTPError[400]);
//
//    requestPlayerMessage(playerId, validMessage);
//    result = requestPlayerMessage(playerId, validMessage);
//    expect(Object.keys(result).length).toStrictEqual(0);
//  });
});

describe('playerChatView', () => {
  // let result: { messages: Message[] };

  // 0 is never going to be generated as a playerId
  test('400: If player ID does not exist (Out of valid range)', () => {
    expect(() => requestPlayerChat(0)).toThrow(HTTPError[400]);
  });

//   // As there is only one player, any other ID should throw an error
//   test('400: If player ID does not exist (Within valid range)', () => {
//     expect(() => requestPlayerChat(playerId + 1)).toThrow(HTTPError[400]);
//   });
//
//   test('No messages sent', () => {
//     expect(requestPlayerChat(playerId)).toMatchObject({ messages: [] });
//   });
//
//   test('One message sent by only player', () => {
//     const timestamp = Math.floor(Date.now() / 1000);
//     requestPlayerMessage(playerId, { messageBody: 'Hey!' });
//     result = requestPlayerChat(playerId);
//
//     expect(result).toMatchObject({ messages: [{
//       messageBody: 'Hey!',
//       playerId: playerId,
//       timeSent: expect.any(Number),
//       playerName: 'Player1'
//     }]});
//     expect(result.messages[0].timeSent).toBeGreaterThan(timestamp);
//     expect(result.messages[0].timeSent).toBeLessThan(timestamp + 1);
//   });
//
//   test('Messages sent by multiple players, with errors', () => {
//     let playerId2 = requestPlayerRegister(sessionId, 'Player2').playerId;
//     let playerId3 = requestPlayerRegister(sessionId, 'Player3').playerId;
//
//     requestPlayerMessage(playerId, { messageBody: 'Hey!' });
//     requestPlayerMessage(playerId2, { messageBody: 'How are you?' });
//     requestPlayerMessage(playerId3, { messageBody: 'What\'s up?' });
//
//     expect(() => requestPlayerMessage(
//       playerId, tooLong
//     )).toThrow(HTTPError[400]);
//
//     result = requestPlayerChat(playerId);
//     expect(result).toMatchObject({ messages: [
//       {
//         messageBody: 'Hey!',
//         playerId: playerId,
//         timeSent: expect.any(Number),
//         playerName: 'Player1'
//       },
//       {
//         messageBody: 'Hey!',
//         playerId: playerId2,
//         timeSent: expect.any(Number),
//         playerName: 'Player2'
//       },
//       {
//         messageBody: 'Hey!',
//         playerId: playerId3,
//         timeSent: expect.any(Number),
//         playerName: 'Player3'
//       }
//     ]});
//   });
});
