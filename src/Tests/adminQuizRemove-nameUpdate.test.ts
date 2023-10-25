import {
  requestClear,
  requestQuizNameUpdate,
  requestQuizRemove,
  requestRegister,
  requestQuizCreate
} from './testHelper';

// Clear the database before each test to avoid data interference
beforeEach(() => {
  requestClear();
});

// Test function: adminQuizRemove
describe('adminQuizRemove', () => {
  test('Invalid User IDs', () => {
    // No longer need to test non-integer tokens
    // Test with user ID out of range
    const result3 = requestQuizRemove(0, 1);
    expect(result3).toMatchObject({ error: expect.any(String) });
  });

  test('Valid User and Quiz IDs', () => {
    // Register a user and create a quiz
    const token = requestRegister('user@gmail.com', 'password1', 'John', 'Doe');
    const quizId = requestQuizCreate(token.token, 'New Quiz', 'Description');

    // Remove the quiz
    const result = requestQuizRemove(token.token, quizId.quizId);
    expect(Object.keys(result).length).toStrictEqual(0);
  });
});

// Test function: adminQuizNameUpdate
describe('adminQuizNameUpdate', () => {
  test('Invalid User IDs', () => {
    // No longer need to test non-integer
    // Test with user ID out of range
    const result = requestQuizNameUpdate(1, 0, 'New Quiz Name');
    expect(result).toMatchObject({ error: expect.any(String) });
  });

  test('Invalid Quiz Name', () => {
    // Test with invalid quiz names
    const token = requestRegister('user@gmail.com', 'password1', 'John', 'Doe');
    const quizId = requestQuizCreate(token.token, 'New Quiz', 'Description');

    // Test with name containing invalid characters
    const result = requestQuizNameUpdate(token.token, quizId.quizId,
      'Invalid@Name');
    expect(result).toMatchObject({ error: expect.any(String) });

    // Test with name less than 3 characters
    const result2 = requestQuizNameUpdate(token.token, quizId.quizId, 'A');
    expect(result2).toMatchObject({ error: expect.any(String) });

    // Test with name more than 30 characters
    const result3 = requestQuizNameUpdate(token.token, quizId.quizId, 'Very ' +
      'Long Quiz Name With More Than 30 Characters');
    expect(result3).toMatchObject({ error: expect.any(String) });

    // Test with a name already used by the user
    requestQuizCreate(token.token, 'New Quiz2', 'Description');
    const result4 = requestQuizNameUpdate(token.token, quizId.quizId,
      'New Quiz2');
    expect(result4).toMatchObject({ error: expect.any(String) });
  });

  test('Valid User and Quiz IDs', () => {
    // Register a user and create a quiz
    const token = requestRegister('user@gmail.com', 'password1', 'John', 'Doe');
    const quizId = requestQuizCreate(token.token, 'New Quiz', 'Description');

    // Update the quiz name
    const result = requestQuizNameUpdate(token.token, quizId.quizId,
      'Updated Quiz Name');
    expect(Object.keys(result).length).toStrictEqual(0);
  });
});
