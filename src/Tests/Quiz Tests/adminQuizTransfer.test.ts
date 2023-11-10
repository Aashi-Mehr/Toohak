import {
  requestClear,
  requestRegister,
  requestQuizCreate,
  requestQuizInfo,
  requestQuizTransfer
} from '../testHelper';

import HTTPError from 'http-errors';

/// ////////////////////////////////////////////////////////////////////////////
/// //////////////////////////////// Tests /////////////////////////////////////
/// ////////////////////////////////////////////////////////////////////////////

const invalidUser = -10000;
const quizId = -214213;
const email1 = 'first.last1@gmail.com';
const email2 = 'first.last2@gmail.com';

beforeEach(() => {
  requestClear();
});

describe('requestQuizTransfer', () => {
  let token1: number;
  let token2: number;
  let quizId1: number;

  beforeEach(() => {
    token1 = requestRegister(email1, 'abcd1234', 'first', 'last').token;
    token2 = requestRegister(email2, 'abcd1234', 'first', 'last').token;
    quizId1 = requestQuizCreate(token1, 'first last', 'fist_test').quizId;
  });

  describe('ERROR Tests', () => {
    test('token is not a valid user', () => {
      // token is not an integer
      const result = requestQuizTransfer(invalidUser, quizId1, email2);
      expect(result).toStrictEqual(401);
    });

    test('Quiz ID does not refer to a valid quiz', () => {
      const result = requestQuizTransfer(token1, quizId, email2);
      expect(result).toStrictEqual(400);
    });

    test('Quiz ID does not refer to a quiz that this user owns', () => {
      const quizId2 = requestQuizCreate(token2, 'first last', 'fist_test').quizId;

      const result = requestQuizTransfer(token1, quizId2, email2);

      expect(result).toStrictEqual(403);
    });

    test('userEmail is not a real user', () => {
      const result = requestQuizTransfer(token1, quizId1, 'invalid@gmail.com');
      expect(result).toStrictEqual(400);
    });

    test('userEmail is the current logged in user', () => {
      const result = requestQuizTransfer(token1, quizId1, email1);
      expect(result).toStrictEqual(400);
    });

    test('Quiz ID refers to a quiz that has a name that is already used by the target user', () => {
      requestQuizCreate(token2, 'first last', 'fist_test');
      const result = requestQuizTransfer(token1, quizId1, email2);
      expect(result).toStrictEqual(400);
    });
  });

  describe('VALID Tests', () => {
    test('successful case', () => {
      const result = requestQuizTransfer(token1, quizId1, email2);
      expect(result).toMatchObject({});
    });

    test('successful transferred', () => {
      requestQuizTransfer(token1, quizId1, email2);
      expect(() => requestQuizInfo(token1, quizId1)).toThrow(HTTPError[403]);
      expect(() => requestQuizInfo(token2, quizId1)).not.toThrow(HTTPError[401]);
    });
  });
});
