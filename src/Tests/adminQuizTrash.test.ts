/* adminQuizTrashTest
* Test file for adminQuizTrash function
** adminQuizTrash
* View the quizzes that are currently in the trash for the logged in user
*
* @param { number } token - The authUserId for the user
*
* @returns { QuizBrief } - If the details given are valid
* @returns { ErrorObject } - If the details given are invalid
*/

import request from 'sync-request-curl';
import { port, url } from '../config.json';
import {
  requestRegister,
  requestQuizTrash,
  requestQuizRemove,
  requestQuizCreate
} from './testHelper';
import { Token } from '../dataStore';

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

// let result: QuizBrief | ErrorObject;

// Test : Invalid AuthUserId Format
test('Test Invalid AuthUserId Format', () => {
  // authUserId is empty
  let result = requestQuizTrash(0);
  expect(result).toMatchObject({ error: expect.any(String) });

  // authUserId contains out of range number
  result = requestQuizTrash(-1);
  expect(result).toMatchObject({ error: expect.any(String) });
});

// Test : Non-Existing AuthUserId
test('Test Non-existing AuthUserId', () => {
  const userId: Token = requestRegister('validEmail@gmail.com', 'Val1dPassword', 'first', 'last');

  // user with authUserId does not exist
  const result = requestQuizTrash(userId.token + 1);
  expect(result).toMatchObject({ error: expect.any(String) });
});

// Test : Valid Input
test('Test Valid Input', () => {
  const userId: Token = requestRegister('validEmail@gmail.com', 'Val1dPassword', 'first', 'last');
  const quizId: number = requestQuizCreate(userId.token, 'Quiz1', 'This is Quiz 1').quizId;

  const result = requestQuizTrash(userId.token);
  expect(result).toMatchObject({
    quizzes: [
      {
        quizId: quizId,
        name: 'first last',
      },
    ],
  });
});

// Test : Viewing Removed Quiz
test('Test Viewing Removed Quiz', () => {
  const userId: Token = requestRegister('validEmail@gmail.com', 'Val1dPassword', 'first', 'last');
  const quizId: number = requestQuizCreate(userId.token, 'Quiz 1', 'This is Quiz 1').quizId;

  // Remove the quiz
  requestQuizRemove(userId.token, quizId);

  // Attempt to view the removed quiz
  const result = requestQuizTrash(userId.token);
  expect(result).toMatchObject({
    quizzes: [
      {
        quizId: quizId,
        name: 'first last',
      },
    ],
  });
});
