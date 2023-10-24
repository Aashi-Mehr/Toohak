import {
  requestClear,
  requestRegister,
  requestQuizCreate
} from './testHelper';

test('Clear Users', () => {
  // Register user
  requestRegister('first.last1@gmail.com', 'Val1dPassword1', 'first1', 'last1');
  requestRegister('first.last2@gmail.com', 'Val1dPassword2', 'first2', 'last2');

  const result = requestClear();
  expect(result).toMatchObject({ });
});

test('Clear Quizzes', () => {
  // Register user
  const authUserId1 = requestRegister('first.last1@gmail.com', 'Val1dPassword1', 'first1', 'last1');
  requestQuizCreate(authUserId1, 'first last', 'fist_test');
  requestRegister('first.last2@gmail.com', 'Val1dPassword2', 'first2', 'last2');

  const result = requestClear();
  expect(result).toMatchObject({ });
});
