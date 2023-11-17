import {
  requestClear,
  requestQuizNameUpdate,
  requestQuizRemove,
  requestRegister,
  requestQuizCreate,
  requestQuizList,
  requestQuizInfo
} from '../testHelper';

import HTTPError from 'http-errors';

// Clear the database before each test to avoid data interference
beforeEach(() => {
  requestClear();
});

/// /////////////////////////////////////////////////////////////////////////////
/// /////////////////////////////// VERSION 2 ///////////////////////////////////
/// /////////////////////////////////////////////////////////////////////////////

// Test function: adminQuizRemove
describe('adminQuizRemove', () => {
  test('Invalid User IDs', () => {
    // No longer need to test non-integer tokens
    // Test with user ID out of range
    expect(() => requestQuizRemove(0, 1)).toThrow(HTTPError[401]);
  });

  test('Invalid Quiz', () => {
    // INVALID Unauthorised 403
    const token = requestRegister('user@gmail.com', 'password1', 'John', 'Doe');
    const quizId = requestQuizCreate(token.token, 'New Quiz', 'Description');

    expect(() => requestQuizRemove(
      token.token, quizId.quizId + 1
    )).toThrow(HTTPError[403]);
  });

  test('Invalid Token Authorisation', () => {
    // INVALID Unauthorised 403
    const token = requestRegister('user@gmail.com', 'password1', 'John', 'Doe');
    const t2 = requestRegister('jd@gmail.com', 'Val1dPas', 'Joe', 'Doe').token;
    const quizId = requestQuizCreate(token.token, 'New Quiz', 'Description');

    expect(() => requestQuizRemove(
      t2, quizId.quizId
    )).toThrow(HTTPError[403]);
  });

  test('Valid User and Quiz IDs', () => {
    // Register a user and create a quiz
    const token = requestRegister('user@gmail.com', 'password1', 'John', 'Doe');
    const quizId = requestQuizCreate(token.token, 'New Quiz', 'Description');

    // Remove the quiz
    const result = requestQuizRemove(token.token, quizId.quizId);
    expect(Object.keys(result).length).toStrictEqual(0);
    expect(requestQuizList(token.token)).toMatchObject({
      quizzes: []
    });
    expect(() => requestQuizInfo(
      token.token, quizId.quizId
    )).toThrow(HTTPError[403]);
  });
});

// Test function: adminQuizNameUpdate
describe('adminQuizNameUpdate', () => {
  test('Invalid User IDs', () => {
    // No longer need to test non-integer
    // Test with user ID out of range
    expect(() => requestQuizNameUpdate(
      1, 0, 'New Quiz Name'
    )).toThrow(HTTPError[401]);
  });

  test('Invalid Quiz', () => {
    // INVALID Unauthorised 403
    const token = requestRegister('user@gmail.com', 'password1', 'John', 'Doe');
    const quizId = requestQuizCreate(token.token, 'New Quiz', 'Description');

    expect(() => requestQuizNameUpdate(
      token.token, quizId.quizId + 1, 'New'
    )).toThrow(HTTPError[403]);
  });

  test('Invalid Token Authorisation', () => {
    // INVALID Unauthorised 403
    const token = requestRegister('user@gmail.com', 'password1', 'John', 'Doe');
    const t2 = requestRegister('jd@gmail.com', 'Val1dPas', 'Joe', 'Doe').token;
    const quizId = requestQuizCreate(token.token, 'New Quiz', 'Description');

    expect(() => requestQuizNameUpdate(
      t2, quizId.quizId, 'New'
    )).toThrow(HTTPError[403]);
  });

  test('Invalid Token Authorisation', () => {
    // INVALID Unauthorised 403
    const t2 = requestRegister('jd@gmail.com', 'Val1dPas', 'Joe', 'Doe').token;
    const quizId = requestQuizCreate(t2, 'New Quiz', 'Description');

    requestQuizRemove(t2, quizId.quizId);

    expect(() => requestQuizNameUpdate(
      t2, quizId.quizId, 'New'
    )).toThrow(HTTPError[403]);
  });

  test('Invalid Quiz Name', () => {
    // Test with invalid quiz names
    const timestamp = Math.floor(Date.now() / 1000);
    const token = requestRegister('user@gmail.com', 'password1', 'John', 'Doe');
    const quizId = requestQuizCreate(token.token, 'New Quiz', 'Description');

    // Test with name containing invalid characters
    expect(() => requestQuizNameUpdate(
      token.token, quizId.quizId, 'Invalid@Name'
    )).toThrow(HTTPError[400]);

    // Test with name less than 3 characters
    expect(() => requestQuizNameUpdate(
      token.token, quizId.quizId, 'A'
    )).toThrow(HTTPError[400]);

    // Test with name more than 30 characters
    expect(() => requestQuizNameUpdate(
      token.token, quizId.quizId, 'Very Long Quiz Name With More Than 30 ' +
      'Characters'
    )).toThrow(HTTPError[400]);

    // Test with a name already used by the user
    requestQuizCreate(token.token, 'New Quiz2', 'Description');
    expect(() => requestQuizNameUpdate(
      token.token, quizId.quizId, 'New Quiz2'
    )).toThrow(HTTPError[400]);

    const quiz = requestQuizInfo(token.token, quizId.quizId);
    expect(quiz).toMatchObject({
      quizId: quizId.quizId,
      name: 'New Quiz',
      timeCreated: expect.any(Number),
      timeLastEdited: expect.any(Number),
      description: expect.any(String)
    });

    // Checking the time that it was editted hasn't changed
    expect(quiz.timeCreated).toBeGreaterThanOrEqual(timestamp);
    expect(quiz.timeCreated).toBeLessThan(timestamp + 3);
    expect(quiz.timeCreated).toStrictEqual(quiz.timeLastEdited);
  });

  test('Valid User and Quiz IDs', () => {
    // Register a user and create a quiz
    const token = requestRegister('user@gmail.com', 'password1', 'John', 'Doe');
    const timestamp1 = Math.floor(Date.now() / 1000);
    const quizId = requestQuizCreate(token.token, 'New Quiz', 'Description');

    // Update the quiz name
    const timestamp2 = Math.floor(Date.now() / 1000);
    const result = requestQuizNameUpdate(token.token, quizId.quizId,
      'Updated Quiz Name');
    expect(Object.keys(result).length).toStrictEqual(0);

    const quiz = requestQuizInfo(token.token, quizId.quizId);
    expect(quiz).toMatchObject({
      quizId: quizId.quizId,
      name: 'Updated Quiz Name',
      timeCreated: expect.any(Number),
      timeLastEdited: expect.any(Number),
      description: expect.any(String)
    });

    // Checking the time that it was editted hasn't changed
    expect(quiz.timeCreated).toBeGreaterThanOrEqual(timestamp1);
    expect(quiz.timeCreated).toBeLessThan(timestamp1 + 3);
    expect(quiz.timeLastEdited).toBeGreaterThanOrEqual(timestamp2);
    expect(quiz.timeLastEdited).toBeLessThan(timestamp2 + 3);
  });
});

/// /////////////////////////////////////////////////////////////////////////////
/// /////////////////////////////// VERSION 1 ///////////////////////////////////
/// /////////////////////////////////////////////////////////////////////////////

// Test function: adminQuizRemove
describe('adminQuizRemove', () => {
  test('Invalid User IDs', () => {
    // No longer need to test non-integer tokens
    // Test with user ID out of range
    expect(() => requestQuizRemove(0, 1, true)).toThrow(HTTPError[401]);
  });

  test('Invalid Quiz', () => {
    // INVALID Unauthorised 403
    const token = requestRegister(
      'user@gmail.com', 'password1', 'John', 'Doe', true
    );
    const quizId = requestQuizCreate(
      token.token, 'New Quiz', 'Description', true
    );

    expect(() => requestQuizRemove(
      token.token, quizId.quizId + 1, true
    )).toThrow(HTTPError[403]);
  });

  test('Invalid Token Authorisation', () => {
    // INVALID Unauthorised 403
    const token = requestRegister(
      'user@gmail.com', 'password1', 'John', 'Doe', true
    );

    const t2 = requestRegister(
      'jd@gmail.com', 'Val1dPas', 'Joe', 'Doe', true
    ).token;

    const quizId = requestQuizCreate(
      token.token, 'New Quiz', 'Description', true
    );

    expect(() => requestQuizRemove(
      t2, quizId.quizId, true
    )).toThrow(HTTPError[403]);
  });

  test('Valid User and Quiz IDs', () => {
    // Register a user and create a quiz
    const token = requestRegister(
      'user@gmail.com', 'password1', 'John', 'Doe', true
    );
    const quizId = requestQuizCreate(
      token.token, 'New Quiz', 'Description', true
    );

    // Remove the quiz
    const result = requestQuizRemove(token.token, quizId.quizId, true);
    expect(Object.keys(result).length).toStrictEqual(0);
    expect(requestQuizList(token.token, true)).toMatchObject({
      quizzes: []
    });
    expect(() => requestQuizInfo(
      token.token, quizId.quizId, true
    )).toThrow(HTTPError[403]);
  });
});

// Test function: adminQuizNameUpdate
describe('adminQuizNameUpdate', () => {
  test('Invalid User IDs', () => {
    // No longer need to test non-integer
    // Test with user ID out of range
    expect(() => requestQuizNameUpdate(
      1, 0, 'New Quiz Name', true
    )).toThrow(HTTPError[401]);
  });

  test('Invalid Quiz', () => {
    // INVALID Unauthorised 403
    const token = requestRegister(
      'user@gmail.com', 'password1', 'John', 'Doe', true
    );
    const quizId = requestQuizCreate(
      token.token, 'New Quiz', 'Description', true
    );

    expect(() => requestQuizNameUpdate(
      token.token, quizId.quizId + 1, 'New', true
    )).toThrow(HTTPError[403]);
  });

  test('Invalid Token Authorisation', () => {
    // INVALID Unauthorised 403
    const token = requestRegister(
      'user@gmail.com', 'password1', 'John', 'Doe', true
    );
    const t2 = requestRegister(
      'jd@gmail.com', 'Val1dPas', 'Joe', 'Doe', true
    ).token;
    const quizId = requestQuizCreate(
      token.token, 'New Quiz', 'Description', true
    );

    expect(() => requestQuizNameUpdate(
      t2, quizId.quizId, 'New', true
    )).toThrow(HTTPError[403]);
  });

  test('Invalid Token Authorisation', () => {
    // INVALID Unauthorised 403
    const t2 = requestRegister(
      'jd@gmail.com', 'Val1dPas', 'Joe', 'Doe', true
    ).token;
    const quizId = requestQuizCreate(t2, 'New Quiz', 'Description', true);

    requestQuizRemove(t2, quizId.quizId, true);

    expect(() => requestQuizNameUpdate(
      t2, quizId.quizId, 'New', true
    )).toThrow(HTTPError[403]);
  });

  test('Invalid Quiz Name', () => {
    // Test with invalid quiz names
    const timestamp = Math.floor(Date.now() / 1000);
    const token = requestRegister(
      'user@gmail.com', 'password1', 'John', 'Doe', true
    );
    const quizId = requestQuizCreate(
      token.token, 'New Quiz', 'Description', true
    );

    // Test with name containing invalid characters
    expect(() => requestQuizNameUpdate(
      token.token, quizId.quizId, 'Invalid@Name', true
    )).toThrow(HTTPError[400]);

    // Test with name less than 3 characters
    expect(() => requestQuizNameUpdate(
      token.token, quizId.quizId, 'A', true
    )).toThrow(HTTPError[400]);

    // Test with name more than 30 characters
    expect(() => requestQuizNameUpdate(
      token.token, quizId.quizId, 'Very Long Quiz Name With More Than 30 ' +
      'Characters', true
    )).toThrow(HTTPError[400]);

    // Test with a name already used by the user
    requestQuizCreate(token.token, 'New Quiz2', 'Description', true);
    expect(() => requestQuizNameUpdate(
      token.token, quizId.quizId, 'New Quiz2', true
    )).toThrow(HTTPError[400]);

    const quiz = requestQuizInfo(token.token, quizId.quizId, true);
    expect(quiz).toMatchObject({
      quizId: quizId.quizId,
      name: 'New Quiz',
      timeCreated: expect.any(Number),
      timeLastEdited: expect.any(Number),
      description: expect.any(String)
    });

    // Checking the time that it was editted hasn't changed
    expect(quiz.timeCreated).toBeGreaterThanOrEqual(timestamp);
    expect(quiz.timeCreated).toBeLessThan(timestamp + 3);
    expect(quiz.timeCreated).toStrictEqual(quiz.timeLastEdited);
  });

  test('Valid User and Quiz IDs', () => {
    // Register a user and create a quiz
    const token = requestRegister(
      'user@gmail.com', 'password1', 'John', 'Doe', true
    );
    const timestamp1 = Math.floor(Date.now() / 1000);
    const quizId = requestQuizCreate(
      token.token, 'New Quiz', 'Description', true
    );

    // Update the quiz name
    const timestamp2 = Math.floor(Date.now() / 1000);
    const result = requestQuizNameUpdate(token.token, quizId.quizId,
      'Updated Quiz Name', true);
    expect(Object.keys(result).length).toStrictEqual(0);

    const quiz = requestQuizInfo(token.token, quizId.quizId, true);
    expect(quiz).toMatchObject({
      quizId: quizId.quizId,
      name: 'Updated Quiz Name',
      timeCreated: expect.any(Number),
      timeLastEdited: expect.any(Number),
      description: expect.any(String)
    });

    // Checking the time that it was editted hasn't changed
    expect(quiz.timeCreated).toBeGreaterThanOrEqual(timestamp1);
    expect(quiz.timeCreated).toBeLessThan(timestamp1 + 3);
    expect(quiz.timeLastEdited).toBeGreaterThanOrEqual(timestamp2);
    expect(quiz.timeLastEdited).toBeLessThan(timestamp2 + 3);
  });
});
