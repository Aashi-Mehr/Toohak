import request from 'sync-request-curl';
import { port, url } from '../config.json';

const SERVER_URL = `${url}:${port}`;

// Helper function for making POST requests
function makePostRequest(endpoint: string, data: { email?: string; password?: string; nameFirst?: string; nameLast?: string; authUserId?: any; name?: string; description?: string; quizId?: any; }) {
  const res = request('POST', SERVER_URL + endpoint, { json: data });
  return JSON.parse(res.body.toString());
}

// Helper function for making DELETE requests
function makeDeleteRequest(endpoint: string, data: { authUserId: any; quizId: any; }) {
  const res = request('DELETE', SERVER_URL + endpoint, { json: data });
  return JSON.parse(res.body.toString());
}

// Clear the database before each test to avoid data interference
beforeEach(() => {
  const res = request('DELETE', SERVER_URL + '/v1/clear', { qs: {} });
  return JSON.parse(res.body.toString());
});

// Test function: adminQuizRemove
describe('adminQuizRemove', () => {
  test('Invalid User IDs', () => {
    // Test with invalid user IDs (non-integer)
    const result1 = makeDeleteRequest('/v1/admin/quiz/remove', { authUserId: '12345', quizId: 1 });
    expect(result1).toMatchObject({ error: expect.any(String) });

    const result2 = makeDeleteRequest('/v1/admin/quiz/remove', { authUserId: '67890', quizId: 1 });
    expect(result2).toMatchObject({ error: expect.any(String) });

    // Test with user ID out of range
    const result3 = makeDeleteRequest('/v1/admin/quiz/remove', { authUserId: 0, quizId: 1 });
    expect(result3).toMatchObject({ error: expect.any(String) });
  });

  test('Invalid Quiz IDs', () => {
    // Test with invalid quiz IDs
    const result1 = makeDeleteRequest('/v1/admin/quiz/remove', { authUserId: 1, quizId: '12345' });
    expect(result1).toMatchObject({ error: expect.any(String) });

    // Test with a quiz ID that does not refer to a valid quiz
    const result2 = makeDeleteRequest('/v1/admin/quiz/remove', { authUserId: 1, quizId: 'invalidQuizId' });
    expect(result2).toMatchObject({ error: expect.any(String) });
  });

  test('Valid User and Quiz IDs', () => {
    // Register a user and create a quiz
    const authUserId = makePostRequest('/v1/admin/auth/register', {
      email: 'user@example.com',
      password: 'password',
      nameFirst: 'John',
      nameLast: 'Doe',
    }).authUserId;

    const quizId = makePostRequest('/v1/admin/quiz', {
      authUserId,
      name: 'New Quiz',
      description: 'Description of the quiz',
    }).quizId;

    // Remove the quiz
    const result = makeDeleteRequest('/v1/admin/quiz/remove', { authUserId, quizId });
    expect(result).toMatchObject({});
  });
});

// Test function: adminQuizNameUpdate
describe('adminQuizNameUpdate', () => {
  test('Invalid User IDs', () => {
    // Test with invalid user IDs (non-integer)
    const result1 = makePostRequest('/v1/admin/quiz/nameupdate', {
      authUserId: '12345',
      quizId: 1,
      name: 'New Quiz Name',
    });
    expect(result1).toMatchObject({ error: expect.any(String) });

    const result2 = makePostRequest('/v1/admin/quiz/nameupdate', {
      authUserId: '67890',
      quizId: 1,
      name: 'New Quiz Name',
    });
    expect(result2).toMatchObject({ error: expect.any(String) });

    // Test with user ID out of range
    const result3 = makePostRequest('/v1/admin/quiz/nameupdate', {
      authUserId: 0,
      quizId: 1,
      name: 'New Quiz Name',
    });
    expect(result3).toMatchObject({ error: expect.any(String) });
  });

  test('Invalid Quiz Name', () => {
    // Test with invalid quiz names
    const authUserId = makePostRequest('/v1/admin/auth/register', {
      email: 'user@example.com',
      password: 'password',
      nameFirst: 'John',
      nameLast: 'Doe',
    }).authUserId;

    const quizId = makePostRequest('/v1/admin/quiz', {
      authUserId,
      name: 'New Quiz Name',
      description: 'Description of the quiz',
    }).quizId;

    // Test with name containing invalid characters
    const result1 = makePostRequest('/v1/admin/quiz/nameupdate', {
      authUserId,
      quizId,
      name: 'Invalid@Name',
    });
    expect(result1).toMatchObject({ error: expect.any(String) });

    // Test with name less than 3 characters
    const result2 = makePostRequest('/v1/admin/quiz/nameupdate', {
      authUserId,
      quizId,
      name: 'A',
    });
    expect(result2).toMatchObject({ error: expect.any(String) });

    // Test with name more than 30 characters
    const result3 = makePostRequest('/v1/admin/quiz/nameupdate', {
      authUserId,
      quizId,
      name: 'Very Long Quiz Name With More Than 30 Characters',
    });
    expect(result3).toMatchObject({ error: expect.any(String) });

    // Test with a name already used by the user
    const result4 = makePostRequest('/v1/admin/quiz/nameupdate', {
      authUserId,
      quizId,
      name: 'New Quiz Name',
    });
    expect(result4).toMatchObject({ error: expect.any(String) });
  });

  test('Valid User and Quiz IDs', () => {
    // Register a user and create a quiz
    const authUserId = makePostRequest('/v1/admin/auth/register', {
      email: 'user@example.com',
      password: 'password',
      nameFirst: 'John',
      nameLast: 'Doe',
    }).authUserId;

    const quizId = makePostRequest('/v1/admin/quiz', {
      authUserId,
      name: 'New Quiz Name',
      description: 'Description of the quiz',
    }).quizId;

    // Update the quiz name
    const result = makePostRequest('/v1/admin/quiz/nameupdate', {
      authUserId,
      quizId,
      name: 'Updated Quiz Name',
    });
    expect(result).toMatchObject({});
  });
});
