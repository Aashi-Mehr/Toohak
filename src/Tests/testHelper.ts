
import request from 'sync-request-curl';
import { port, url } from '../config.json';
import {
  Token,
  QuizId,
  QuizDetailed,
  QuestionBody,
  QuestionId,
  ErrorObject,
  Details,
  QuizList
} from '../dataStore';

const SERVER_URL = `${url}:${port}`;

export function requestClear() {
  const res = request(
    'DELETE',
    SERVER_URL + '/v1/clear',
    {
      qs: {}
    }
  );

  return JSON.parse(res.body.toString());
}

// POST REGISTER Define wrapper function
export function requestRegister(email: string, password: string, nameFirst: string,
  nameLast: string): Token {
  const res = request(
    'POST',
    SERVER_URL + '/v1/admin/auth/register',
    {
      json: {
        email: email,
        password: password,
        nameFirst: nameFirst,
        nameLast: nameLast
      }
    }
  );

  const result = JSON.parse(res.body.toString());

  if ('error' in result) return { token: -1 };
  else return result;
}

// POST LOGIN Define wrapper function
export function requestLogin(email: string, password: string): Token {
  const res = request(
    'POST',
    SERVER_URL + '/v1/admin/auth/login',
    {
      json: {
        email: email,
        password: password
      }
    }
  );

  const result = JSON.parse(res.body.toString());

  if ('error' in result) return { token: -1 };
  else return result;
}

// GET DETAILS Define wrapper function
export function requestDetails(token: number): Details | ErrorObject {
  const res = request(
    'GET',
    SERVER_URL + '/v1/admin/user/details?token=' + token,
    {
      qs: { }
    }
  );

  return JSON.parse(res.body.toString());
}

// POST LOGOUT Define wrapper function
export function requestLogout(token: number): ErrorObject | Record<string, never> {
  const res = request(
    'POST',
    SERVER_URL + '/v1/admin/auth/logout?token=' + token,
    {
      json: { }
    }
  );

  return JSON.parse(res.body.toString());
}

// PUT EDIT DETAILS Define wrapper function
export function requestDetailsEdit(token: number, email: string, nameFirst: string,
  nameLast: string): ErrorObject | Record<string, never> {
  const res = request(
    'PUT',
    SERVER_URL + '/v1/admin/user/details?token=' + token,
    {
      json: {
        email: email,
        nameFirst: nameFirst,
        nameLast: nameLast
      }
    }
  );

  return JSON.parse(res.body.toString());
}

// PUT EDIT PASSWORD Define wrapper function
export function requestPasswordEdit(token: number, oldPass: string, newPass: string):
  ErrorObject | Record<string, never> {
  const res = request(
    'PUT',
    SERVER_URL + '/v1/admin/user/password?token=' + token,
    {
      json: {
        oldPassword: oldPass,
        newPassword: newPass
      }
    }
  );

  return JSON.parse(res.body.toString());
}

// QUIZ CREATE Define wrapper function
export function requestQuizCreate(token: number, name: string,
  description: any): QuizId {
  const res = request(
    'POST',
    SERVER_URL + '/v1/admin/quiz?token=' + token,
    {
      json: {
        name: name,
        description: description
      }
    }
  );

  const result = JSON.parse(res.body.toString());

  if ('error' in result) return { quizId: -1 };
  else return result;
}

export function requestQuizInfo(token: number | string, quizId: number):
  QuizDetailed {
  const res = request(
    'GET',
    SERVER_URL + '/v1/admin/quiz/' + quizId + '?token=' + token,
    {
      qs: { }
    }
  );
  return JSON.parse(res.body.toString());
}

// QUIZ LIST Define wrapper function
export function requestQuizList(token: number | string): QuizList | ErrorObject {
  const res = request(
    'GET',
    SERVER_URL + '/v1/admin/quiz/list?token=' + token,
    {
      qs: {}
    }
  );
  const result = JSON.parse(res.body as string);

  if ('error' in result) return { error: 'error' };
  else return result;
}

export function requestQuizDescriptionUpdate(token: number | string,
  quizId: number, description: string) {
  const res = request(
    'PUT',
    SERVER_URL + '/v1/admin/quiz/' + quizId + '/description?token=' + token,
    {
      json: {
        description: description,
      }
    }
  );

  return JSON.parse(res.body.toString());
}

// QUIZ REMOVE Define wrapper function
export function requestQuizRemove(token: number, quizId: number):
  ErrorObject | Record<string, never> {
  const res = request(
    'DELETE',
    SERVER_URL + '/v1/admin/quiz/' + quizId + '?token=' + token,
    {
      qs: { }
    }
  );
  return JSON.parse(res.body.toString());
}

export function requestQuestionCreate(token: number | string,
  quizId: number, questionBody: QuestionBody): QuestionId {
  const res = request(
    'POST',
    SERVER_URL + '/v1/admin/quiz/' + quizId + '/question?token=' + token,
    {
      json: {
        questionBody: questionBody,
      }
    }
  );
  return JSON.parse(res.body.toString());
}

// GET QUIZ TRASH Define wrapper function
export function requestQuizTrash(token: number): QuizList | ErrorObject {
  const res = request(
    'GET',
    SERVER_URL + '/v1/admin/quiz/trash?token=' + token,
    {
      qs: { }
    }
  );
  // return JSON.parse(res.body.toString());
  const result = JSON.parse(res.body as string);

  if ('error' in result) { return { error: 'error' }; } else { return result; }
}
