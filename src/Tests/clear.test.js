import { adminAuthRegister } from '../auth';
import { adminQuizCreate } from '../quiz.js';
import { clear } from '../other.js';

test('Clear Users', () => {
  // Register user
  adminAuthRegister('first.last1@gmail.com', 'Val1dPassword1', 'first1', 'last1');
  adminAuthRegister('first.last2@gmail.com', 'Val1dPassword2', 'first2', 'last2');

  const result = clear();
  expect(result).toMatchObject({ });
});

test('Clear Quizzes', () => {
  // Register user
  const authUserId1 = adminAuthRegister('first.last1@gmail.com', 'Val1dPassword1', 'first1', 'last1');
  adminQuizCreate(authUserId1, 'first last', 'fist_test');
  adminAuthRegister('first.last2@gmail.com', 'Val1dPassword2', 'first2', 'last2');

  const result = clear();
  expect(result).toMatchObject({ });
});
