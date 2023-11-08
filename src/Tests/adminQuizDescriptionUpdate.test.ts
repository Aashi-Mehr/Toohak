import {
  requestClear,
  requestRegister,
  requestQuizCreate,
  requestQuizInfo,
  requestQuizDescriptionUpdate,
  requestQuizRemove
} from './testHelper';

/// ////////////////////////////////////////////////////////////////////////////
/// //////////////////////////////// Tests /////////////////////////////////////
/// ////////////////////////////////////////////////////////////////////////////
const invalidUser = 10000;
const quizId = 1;
const description = 'New description';

beforeEach(() => {
  requestClear();
});

test('token is not a valid user', () => {
  // token is not invalid, out of range integer
  const result = requestQuizDescriptionUpdate(invalidUser, quizId, description);
  expect(result).toMatchObject({ error: expect.any(String) });
});

test('Token is invalid, but quiz exists', () => {
  // Token is invalid, but quiz exists
  const token2 = requestRegister('first.last2@gmail.com', 'abcd1234', 'first',
    'last').token;
  const quizId1 = requestQuizCreate(token2, 'first last', 'fist_test').quizId;
  const result = requestQuizDescriptionUpdate(token2 + 1, quizId1, description);
  expect(result).toMatchObject({ error: expect.any(String) });
});

test('Quiz is in trash', () => {
  // Token is invalid, but quiz exists
  const token2 = requestRegister('first.last2@gmail.com', 'abcd1234', 'first',
    'last').token;
  const quizId1 = requestQuizCreate(token2, 'first last', 'fist_test').quizId;
  requestQuizRemove(token2, quizId1);
  const result = requestQuizDescriptionUpdate(token2, quizId1, description);
  expect(result).toMatchObject({ error: expect.any(String) });
});

test('Quiz ID does not refer to a valid quiz', () => {
  const token1 = requestRegister('first.last1@gmail.com', 'abcd1234', 'first',
    'last').token;
  const result = requestQuizDescriptionUpdate(token1, quizId, description);

  expect(result).toMatchObject({ error: expect.any(String) });
});

test('Quiz ID does not refer to a quiz that this user owns', () => {
  const token1 = requestRegister('first.last1@gmail.com', 'abcd1234', 'first',
    'last').token;
  const token2 = requestRegister('first.last2@gmail.com', 'abcd1234', 'first',
    'last').token;
  const quizId1 = requestQuizCreate(token2, 'first last', 'fist_test').quizId;

  const result = requestQuizDescriptionUpdate(token1, quizId1, description);

  expect(result).toMatchObject({ error: expect.any(String) });
});

test('Description is more than 100 characters in length', () => {
  const token1 = requestRegister('first.last1@gmail.com', 'abcd1234', 'first',
    'last').token;
  const quizId1 = requestQuizCreate(token1, 'first last', 'fist_test').quizId;
  let longDescription = '';

  for (let i = 0; i <= 100; i++) longDescription += 'a';

  const result = requestQuizDescriptionUpdate(token1, quizId1, longDescription);
  expect(result).toMatchObject({ error: expect.any(String) });
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
