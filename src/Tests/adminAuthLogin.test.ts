import {
  adminAuthLogin,
  adminAuthRegister
} from '../auth';

import { clear } from '../other.js';

beforeEach(() => {
  clear();
});

test('Test Non-Existing Emails', () => {
  // Email does not exists
  let result = adminAuthLogin('nonexisting@gmail.com', 'Val1dPassword');
  expect(result).toMatchObject({ error: expect.any(String) });

  // Email is empty
  result = adminAuthLogin('', 'Val1dPassword');
  expect(result).toMatchObject({ error: expect.any(String) });
});

test('Test Incorrect Password', () => {
  // Dependency on adminAuthRegister
  adminAuthRegister('first.last1@gmail.com', 'Val1dPassword1', 'first', 'last');
  adminAuthRegister('first.last2@gmail.com', 'Val1dPassword2', 'first', 'last');
  adminAuthRegister('first.last3@gmail.com', 'Val1dPassword3', 'first', 'last');
  adminAuthRegister('first.last4@gmail.com', 'Val1dPassword4', 'first', 'last');

  // Password does not match the given email
  let result = adminAuthLogin('first.last1@gmail.com', 'Val1dPasswoord');
  expect(result).toMatchObject({ error: expect.any(String) });

  result = adminAuthLogin('first.last2@gmail.com', 'Val1dPasswoord');
  expect(result).toMatchObject({ error: expect.any(String) });

  result = adminAuthLogin('first.last3@gmail.com', 'Val1dPasswoord');
  expect(result).toMatchObject({ error: expect.any(String) });

  result = adminAuthLogin('first.last4@gmail.com', 'Val1dPasswoord');
  expect(result).toMatchObject({ error: expect.any(String) });

  // Password is empty
  result = adminAuthLogin('first.last4@gmail.com', '');
  expect(result).toMatchObject({ error: expect.any(String) });
});

test('Test Valid Email And Password', () => {
  // Dependency on adminAuthRegister
  const id1 = adminAuthRegister('first.last1@gmail.com', 'Val1dPassword1', 'first', 'last').authUserId;
  const id2 = adminAuthRegister('first.last2@gmail.com', 'Val1dPassword2', 'first', 'last').authUserId;
  const id3 = adminAuthRegister('first.last3@gmail.com', 'Val1dPassword3', 'first', 'last').authUserId;
  const id4 = adminAuthRegister('first.last4@gmail.com', 'Val1dPassword4', 'first', 'last').authUserId;

  let result = adminAuthLogin('first.last1@gmail.com', 'Val1dPassword1');
  expect(result).toMatchObject({ authUserId: id1 });

  result = adminAuthLogin('first.last2@gmail.com', 'Val1dPassword2');
  expect(result).toMatchObject({ authUserId: id2 });

  result = adminAuthLogin('first.last3@gmail.com', 'Val1dPassword3');
  expect(result).toMatchObject({ authUserId: id3 });

  result = adminAuthLogin('first.last4@gmail.com', 'Val1dPassword4');
  expect(result).toMatchObject({ authUserId: id4 });
});
