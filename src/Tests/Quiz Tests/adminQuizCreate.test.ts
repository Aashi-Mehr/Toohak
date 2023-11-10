// Import interfaces, requests
import { QuizId, Token } from '../../dataStore';
import {
  requestClear,
  requestRegister,
  requestQuizCreate,
  requestQuizRemove
} from '../testHelper';

beforeEach(() => {
  requestClear();
});

// Token is empty or invalid (does not refer to valid logged in user session)
describe('INVALID Tokens', () => {
  let result: QuizId;

  test('Token is out of valid range', () => {
    // Token contains out of range number
    result = requestQuizCreate(-1, 'Quiz', 'quizDescription');
    expect(result.quizId).toStrictEqual(-1);
  });

  test('Token is empty', () => {
    // Token is empty
    result = requestQuizCreate(0, 'Quiz', 'quizDescription');
    expect(result.quizId).toStrictEqual(-1);
  });

  test('Token doesn\'t exist', () => {
    // Token doesn't exist
    const token = requestRegister('validEmail@gmail.com', 'Val1dPassword',
      'first', 'last').token;

    // Correct format for token but does not exist in data base
    const result = requestQuizCreate(token + 1, 'QuizName', 'description');
    expect(result.quizId).toStrictEqual(-1);
  });
});

// Name contains invalid (Not alphanumeric or spaces) characters
// Name is either less than 3 characters or more than 30 characters long
// Name is already used by the current logged in user for another active quiz
describe('INVALID Quiz Name', () => {
  let result: QuizId;
  let authRegisterResult: Token;
  let authId: number;

  beforeEach(() => {
    authRegisterResult = requestRegister('validEmail@gmail.com',
      'Val1dPassword', 'first', 'last');
    authId = authRegisterResult.token;
  });

  // Test : Name With Invalid Characters
  test('Name With Invalid Character \'#\'', () => {
    // Name contains spaces, but also special characters
    result = requestQuizCreate(authId, 'Qu1# COMP', 'quizDescription');
    expect(result.quizId).toStrictEqual(-1);
  });

  test('Name With Invalid Character \'~\'', () => {
    // Non alphanumeric characters
    result = requestQuizCreate(authId, 'Quiz~COMP', 'quizDescription');
    expect(result.quizId).toStrictEqual(-1);
  });

  test('Name With Invalid Characters \'``+\'', () => {
    result = requestQuizCreate(authId, 'Qu1z``+ COMP1511', 'quizDescription');
    expect(result.quizId).toStrictEqual(-1);
  });

  test('Name With Invalid Characters \'==_-\'', () => {
    result = requestQuizCreate(authId, 'Qu1z==_-C0MP1511', 'quizDescription');
    expect(result.quizId).toStrictEqual(-1);
  });

  // Invalid Name Lengths
  test('Name Length Less than 3', () => {
    // Name is less than 3 characters long
    const result = requestQuizCreate(authId, 'Qu', 'quizDescription');
    expect(result.quizId).toStrictEqual(-1);
  });

  test('Name Empty', () => {
    // Name is empty
    result = requestQuizCreate(authId, '', 'quizDescription');
    expect(result.quizId).toStrictEqual(-1);
  });

  test('Name Length Greater than 30', () => {
    // Name is more than 30 characters long
    result = requestQuizCreate(authId, 'Quizzzzzzzzzzzzzzzz COMPPPPPPPPPPPPP',
      'quizDescription');
    expect(result.quizId).toStrictEqual(-1);
  });

  test('Name Length Greater than 30 with Special Characters', () => {
    // Name is more than 30 characters long and contains special characters
    result = requestQuizCreate(authId, 'Quizzzzzzzzzzzzzzzz C@MPPPPPPPPPPPPP',
      'quizDescription');
    expect(result.quizId).toStrictEqual(-1);
  });

  test('Name Length Greater than 30 with Valid Numbers', () => {
    // Name is more than 30 characters long and contains numbers
    result = requestQuizCreate(authId, 'Qu1zzzzzzzzzzzzzzzz COMPPPPPPPPPPPPP',
      'quizDescription');
    expect(result.quizId).toStrictEqual(-1);
  });

  // Test : Quiz Name Is Already Used
  test('Name Is Already Used by Current User', () => {
    requestQuizCreate(authId, 'quizName1', 'This quiz is about COMP1531');

    // Name is already used by the current logged in user for another quiz
    const result = requestQuizCreate(authId, 'quizName1', 'quizDescription1');
    expect(result.quizId).toStrictEqual(-1);
  });
});

// Description is more than 100 characters in length
describe('INVALID Description', () => {
  test('Description Length Greater than 100', () => {
    const authRegisterResult: Token = requestRegister('validEmail@gmail.com',
      'Val1dPassword', 'first', 'last');
    const authId: number = authRegisterResult.token;

    // Description is more than 100 characters
    const result = requestQuizCreate(authId, 'COMP Quiz ',
      'This might be the longest quiz description ever been tested. This quiz ' +
        'is the most amazing quiz ever been made.');
    expect(result.quizId).toStrictEqual(-1);
  });
});

// Valid Token, Name and Description
describe('VALID Details', () => {
  let authRegisterResult: Token;
  let authId: number;
  let result: QuizId;

  // Registering 1 valid user
  beforeEach(() => {
    authRegisterResult = requestRegister('validEmail@gmail.com',
      'Val1dPassword', 'first', 'last');
    authId = authRegisterResult.token;
  });

  // 1 user, 1 quiz
  test('Simple Case 1: Creating 1 Quiz', () => {
    result = requestQuizCreate(authId, 'COMP Quiz', 'COMP1531 Quiz.');
    expect(result).toMatchObject({ quizId: expect.any(Number) });
  });

  // 1 user, 2 quizzes
  test('Simple Case 2: Creating 2 Quizzes', () => {
    requestQuizCreate(authId, 'COMP Quiz', 'COMP1531 Quiz.');
    result = requestQuizCreate(authId, 'COMP Quiz2', 'COMP1531 Quiz.');
    expect(result).toMatchObject({ quizId: expect.any(Number) });
  });

  // 1 user, multiple quizzes
  test('Simple Case 3: Creating Multiple Quizzes', () => {
    requestQuizCreate(authId, 'COMP Quiz1', 'COMP1531 Quiz.');
    requestQuizCreate(authId, 'COMP Quiz2', 'COMP1531 Quiz.');
    result = requestQuizCreate(authId, 'COMP Quiz3', 'COMP1531 Quiz.');
    expect(result).toMatchObject({ quizId: expect.any(Number) });
  });

  // 2 users with 1 quiz each of the same name
  test('Complex Case 1: 2 Users 1 Quiz Each', () => {
    const authRegisterResult2 = requestRegister('validEmail2@gmail.com',
      'Val1dPassword', 'first', 'last');
    const authId2 = authRegisterResult2.token;

    requestQuizCreate(authId, 'COMP Quiz1', 'COMP1531 Quiz.');
    result = requestQuizCreate(authId2, 'COMP Quiz1', 'COMP1531 Quiz.');
    expect(result).toMatchObject({ quizId: expect.any(Number) });
  });

  // Multiple users with multiple quizzes, some same names
  test('Complex Case 1: Multiple Users Multiple Quizzes', () => {
    const authRegisterResult2 = requestRegister('validEmail2@gmail.com',
      'Val1dPassword', 'first', 'last');
    const authId2 = authRegisterResult2.token;

    const authRegisterResult3 = requestRegister('validEmail3@gmail.com',
      'Val1dPassword', 'first', 'last');
    const authId3 = authRegisterResult3.token;

    const authRegisterResult4 = requestRegister('validEmail4@gmail.com',
      'Val1dPassword', 'first', 'last');
    const authId4 = authRegisterResult4.token;

    requestQuizCreate(authId, 'COMP Quiz1', 'COMP1531 Quiz.');
    requestQuizCreate(authId2, 'COMP Quiz1', 'COMP1531 Quiz.');
    requestQuizCreate(authId3, 'COMP Quiz1', 'COMP1531 Quiz.');
    requestQuizCreate(authId4, 'COMP Quiz1', 'COMP1531 Quiz.');

    result = requestQuizCreate(authId2, 'COMP Quiz2', 'COMP1531 Quiz.');
    expect(result).toMatchObject({ quizId: expect.any(Number) });
  });

  test('Reusing the name of a deleted quiz', () => {
    const quizId = requestQuizCreate(authId, 'quizName1', '').quizId;
    requestQuizRemove(authId, quizId);

    // Name is already used by the current logged in user for another quiz
    const result = requestQuizCreate(authId, 'quizName1', '');
    expect(result).toStrictEqual({ quizId: expect.any(Number) });
  });
});
