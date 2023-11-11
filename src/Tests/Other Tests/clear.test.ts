import { getData } from '../../dataStore';
import {
  requestClear,
  requestRegister,
  requestQuizCreate
} from '../testHelper';

beforeEach(() => { requestClear(); });

test('Clear Users', () => {
  // Register user
  requestRegister('first.last1@gmail.com', 'Val1dPassword1', 'first', 'last');
  requestRegister('first.last2@gmail.com', 'Val1dPassword2', 'first', 'last');

  const result = requestClear();
  expect(result).toMatchObject({ });

  expect(getData().users.length).toStrictEqual(0);
  expect(getData().quizzes.length).toStrictEqual(0);
  expect(getData().sessions.length).toStrictEqual(0);
  expect(getData().quizSessions.length).toStrictEqual(0);
});

test('Clear Quizzes', () => {
  // Register user
  const authUserId1 = requestRegister('first.last1@gmail.com', 'Val1dPassword1',
    'first', 'last').token;
  requestQuizCreate(authUserId1, 'first last', 'fist_test');
  requestRegister('first.last2@gmail.com', 'Val1dPassword2', 'first', 'last');

  const result = requestClear();
  expect(result).toMatchObject({ });

  expect(getData().users.length).toStrictEqual(0);
  expect(getData().quizzes.length).toStrictEqual(0);
  expect(getData().sessions.length).toStrictEqual(0);
  expect(getData().quizSessions.length).toStrictEqual(0);
});
