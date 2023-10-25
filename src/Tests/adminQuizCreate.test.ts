// Import functions
import request from 'sync-request-curl';
import { port, url } from '../config.json';
import { QuizId } from '../dataStore';
import { Token } from '../dataStore';

const SERVER_URL = `${url}:${port}`;

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

// POST adminQuizCreate Define wrapper function
function requestQuizCreate(token: number, name: string, description: string): QuizId {
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

  if ('error' in result) return { quizId: -1 };
  else return result;
}

// Test : Invalid AuthUserId Format
test('Test Invalid AuthUserId Format', () => {
  // authUserId contains out of range number
  let result = requestQuizCreate(-1, 'Quiz', 'quizDescription');
  expect(result.quizId).toStrictEqual(-1);

  // authUserId is empty
  result = requestQuizCreate(0, 'Quiz', 'quizDescription');
  expect(result.quizId).toStrictEqual(-1);
});

// Test : Non-Existing AuthUserId
test('Test Non-existing AuthUserId', () => {
  requestRegister('validEmail@gmail.com', 'Val1dPassword', 'first', 'last');

  // Correct format authUserId but does not exist in data base
  const result = requestQuizCreate(0, 'QuizName', 'description');
  expect(result.quizId).toStrictEqual(-1);
});

// Test : Name With Invalid Characters
test('Test Name With Invalid Characters', () => {
  const authRegisterResult: Token = requestRegister('validEmail@gmail.com', 'Val1dPassword', 'first', 'last');
  const authId: number = authRegisterResult.token;

  // Name contains spaces, but also special characters
  let result = requestQuizCreate(authId, 'Qu1# COMP', 'quizDescription');
  expect(result.quizId).toStrictEqual(-1);

  // Non alphanumeric characters
  result = requestQuizCreate(authId, 'Quiz~COMP', 'quizDescription');
  expect(result.quizId).toStrictEqual(-1);

  result = requestQuizCreate(authId, 'Qu1z``+ COMP1511', 'quizDescription');
  expect(result.quizId).toStrictEqual(-1);

  result = requestQuizCreate(authId, 'Qu1z==_-C0MP1511', 'quizDescription');
  expect(result.quizId).toStrictEqual(-1);
});

// Test : Name Length
test('Test Name Length', () => {
  const authRegisterResult: Token = requestRegister('validEmail@gmail.com', 'Val1dPassword', 'first', 'last');
  const authId: number = authRegisterResult.token;

  // Name is less than 3 characters long
  let result = requestQuizCreate(authId, 'Qu', 'quizDescription');
  expect(result.quizId).toStrictEqual(-1);

  // Name is empty
  result = requestQuizCreate(authId, '', 'quizDescription');
  expect(result.quizId).toStrictEqual(-1);

  // Name is more than 30 characters long
  result = requestQuizCreate(authId, 'Quizzzzzzzzzzzzzzzz COMPPPPPPPPPPPPP', 'quizDescription');
  expect(result.quizId).toStrictEqual(-1);

  // Name is more than 30 characters long and contains special characters
  result = requestQuizCreate(authId, 'Quizzzzzzzzzzzzzzzz C@MPPPPPPPPPPPPP', 'quizDescription');
  expect(result.quizId).toStrictEqual(-1);

  // Name is more than 30 characters long and contains numbers
  result = requestQuizCreate(authId, 'Qu1zzzzzzzzzzzzzzzz COMPPPPPPPPPPPPP', 'quizDescription');
  expect(result.quizId).toStrictEqual(-1);

  // Name is more than 30 characters long, contains numbers and special character
  result = requestQuizCreate(authId, 'Qu1zzzzzzzzzzzzzzzz C@MPPPPPPPPPPPPP', 'quizDescription');
  expect(result.quizId).toStrictEqual(-1);
});

// Test : Quiz Name Is Already Used
test('Test Quiz Name Is Already Used', () => {
  const authRegisterResult: Token = requestRegister('validEmail@gmail.com', 'Val1dPassword', 'first', 'last');
  const authId: number = authRegisterResult.token;
  requestQuizCreate(authId, 'quizName1', 'This quiz is about COMP1531');

  // Name is already used by the current logged in user for another quiz
  const result = requestQuizCreate(authId, 'quizName1', 'quizDescription1');
  expect(result.quizId).toStrictEqual(-1);
});

// Test : Description Length
test('Test Description Length', () => {
  const authRegisterResult: Token = requestRegister('validEmail@gmail.com', 'Val1dPassword', 'first', 'last');
  const authId: number = authRegisterResult.token;

  // Description is more than 100 characters
  const result = requestQuizCreate(authId, 'COMP Quiz ', 'This might be the longest quiz description ever been tested. This quiz is the most amazing quiz ever been made.');
  expect(result.quizId).toStrictEqual(-1);
});

// Test : Valid AuthUserId, Name and Description
test('Test Valid AuthUserId, name and description', () => {
  const authRegisterResult: Token = requestRegister('validEmail@gmail.com', 'Val1dPassword', 'first', 'last');
  const authId: number = authRegisterResult.token;
  const result = requestQuizCreate(authId, 'COMP Quiz', 'COMP1531 Iteration 1 Quiz.');
  expect(result).toMatchObject({ quizId: expect.any(Number) });
});
