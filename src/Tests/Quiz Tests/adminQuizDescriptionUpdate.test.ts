import {
  requestClear,
  requestRegister,
  requestQuizCreate,
  requestQuizInfo,
  requestQuizDescriptionUpdate,
  requestQuizRemove
} from '../testHelper';

import HTTPError from 'http-errors';

/// ////////////////////////////////////////////////////////////////////////////
/// //////////////////////////////// Tests /////////////////////////////////////
/// ////////////////////////////////////////////////////////////////////////////
const invalidUser = 10000;
const quizId = 1;
const description = 'New description';

beforeEach(() => { requestClear(); });

/// /////////////////////////////////////////////////////////////////////////////
/// /////////////////////////////// VERSION 2 ///////////////////////////////////
/// /////////////////////////////////////////////////////////////////////////////

test('token is not a valid user', () => {
  // token is not invalid, out of range integer
  expect(() => requestQuizDescriptionUpdate(
    invalidUser, quizId, description
  )).toThrow(HTTPError[401]);
});

test('Token is invalid, but quiz exists', () => {
  // Token is invalid, but quiz exists
  const token2 = requestRegister('first.last2@gmail.com', 'abcd1234', 'first',
    'last').token;
  const quizId1 = requestQuizCreate(token2, 'first last', 'fist_test').quizId;

  expect(() => requestQuizDescriptionUpdate(
    token2 + 1, quizId1, description
  )).toThrow(HTTPError[401]);
});

test('Quiz is in trash', () => {
  // Token is invalid, but quiz exists
  const token2 = requestRegister('first.last2@gmail.com', 'abcd1234', 'first',
    'last').token;
  const quizId1 = requestQuizCreate(token2, 'first last', 'fist_test').quizId;
  requestQuizRemove(token2, quizId1);

  expect(() => requestQuizDescriptionUpdate(
    token2, quizId1, description
  )).toThrow(HTTPError[403]);
});

test('Quiz ID does not refer to a valid quiz', () => {
  const token1 = requestRegister('first.last1@gmail.com', 'abcd1234', 'first',
    'last').token;
  expect(() => requestQuizDescriptionUpdate(
    token1, quizId, description
  )).toThrow(HTTPError[403]);
});

test('Quiz ID does not refer to a quiz that this user owns', () => {
  const token1 = requestRegister('first.last1@gmail.com', 'abcd1234', 'first',
    'last').token;
  const token2 = requestRegister('first.last2@gmail.com', 'abcd1234', 'first',
    'last').token;
  const quizId1 = requestQuizCreate(token2, 'first last', 'fist_test').quizId;

  expect(() => requestQuizDescriptionUpdate(
    token1, quizId1, description
  )).toThrow(HTTPError[403]);
});

test('Description is more than 100 characters in length', () => {
  const token1 = requestRegister('first.last1@gmail.com', 'abcd1234', 'first',
    'last').token;
  const quizId1 = requestQuizCreate(token1, 'first last', 'fist_test').quizId;
  let longDescription = '';

  for (let i = 0; i <= 100; i++) longDescription += 'a';

  expect(() => requestQuizDescriptionUpdate(
    token1, quizId1, longDescription
  )).toThrow(HTTPError[400]);
});

describe('VALID Tests', () => {
  test('Case 1', () => {
    const token1 = requestRegister('first.last1@gmail.com', 'abcd1234', 'first',
      'last').token;
    const quizId1 = requestQuizCreate(token1, 'first last', 'fist_test').quizId;

    const result = requestQuizDescriptionUpdate(token1, quizId1, description);
    expect(result).toMatchObject({ });
    expect(requestQuizInfo(token1, quizId1).description).toMatch(description);
  });
});

/// /////////////////////////////////////////////////////////////////////////////
/// /////////////////////////////// VERSION 1 ///////////////////////////////////
/// /////////////////////////////////////////////////////////////////////////////

test('token is not a valid user', () => {
  // token is not invalid, out of range integer
  expect(() => requestQuizDescriptionUpdate(
    invalidUser, quizId, description, true
  )).toThrow(HTTPError[401]);
});

test('Token is invalid, but quiz exists', () => {
  // Token is invalid, but quiz exists
  const token2 = requestRegister('first.last2@gmail.com', 'abcd1234', 'first',
    'last', true).token;
  const quizId1 = requestQuizCreate(
    token2, 'first last', 'fist_test', true
  ).quizId;

  expect(() => requestQuizDescriptionUpdate(
    token2 + 1, quizId1, description, true
  )).toThrow(HTTPError[401]);
});

test('Quiz is in trash', () => {
  // Token is invalid, but quiz exists
  const token2 = requestRegister('first.last2@gmail.com', 'abcd1234', 'first',
    'last', true).token;
  const quizId1 = requestQuizCreate(
    token2, 'first last', 'fist_test', true
  ).quizId;
  requestQuizRemove(token2, quizId1, true);

  expect(() => requestQuizDescriptionUpdate(
    token2, quizId1, description, true
  )).toThrow(HTTPError[403]);
});

test('Quiz ID does not refer to a valid quiz', () => {
  const token1 = requestRegister('first.last1@gmail.com', 'abcd1234', 'first',
    'last', true).token;
  expect(() => requestQuizDescriptionUpdate(
    token1, quizId, description, true
  )).toThrow(HTTPError[403]);
});

test('Quiz ID does not refer to a quiz that this user owns', () => {
  const token1 = requestRegister('first.last1@gmail.com', 'abcd1234', 'first',
    'last', true).token;
  const token2 = requestRegister('first.last2@gmail.com', 'abcd1234', 'first',
    'last', true).token;
  const quizId1 = requestQuizCreate(
    token2, 'first last', 'fist_test', true
  ).quizId;

  expect(() => requestQuizDescriptionUpdate(
    token1, quizId1, description, true
  )).toThrow(HTTPError[403]);
});

test('Description is more than 100 characters in length', () => {
  const token1 = requestRegister('first.last1@gmail.com', 'abcd1234', 'first',
    'last', true).token;
  const quizId1 = requestQuizCreate(
    token1, 'first last', 'fist_test', true
  ).quizId;
  let longDescription = '';

  for (let i = 0; i <= 100; i++) longDescription += 'a';

  expect(() => requestQuizDescriptionUpdate(
    token1, quizId1, longDescription, true
  )).toThrow(HTTPError[400]);
});

describe('VALID Tests', () => {
  test('Case 1', () => {
    const token1 = requestRegister('first.last1@gmail.com', 'abcd1234', 'first',
      'last', true).token;
    const quizId1 = requestQuizCreate(
      token1, 'first last', 'fist_test', true
    ).quizId;

    const result = requestQuizDescriptionUpdate(
      token1, quizId1, description, true
    );

    expect(result).toMatchObject({ });
    expect(requestQuizInfo(
      token1, quizId1, true
    ).description).toMatch(description);
  });
});
