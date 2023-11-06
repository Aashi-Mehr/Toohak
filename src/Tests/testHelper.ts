
import HTTPError from 'http-errors';
import request from 'sync-request-curl';
import { port, url } from '../config.json';

import {
  Token,
  QuizId,
  QuizInfo,
  QuestionBody,
  QuestionId,
  ErrorObject,
  Details,
  QuizList,
} from '../dataStore';

const SERVER_URL = `${url}:${port}`;

// DELETE CLEAR Define wrapper function
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
export function requestRegister(email: string, password: string,
  nameFirst: string, nameLast: string): Token {
  const res = request(
    'POST',
    SERVER_URL + '/v2/admin/auth/register',
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

  if (res.statusCode !== 200) {
    throw HTTPError(res.statusCode, result?.error || result || 'NO MESSAGE');
  }

  return result;
}

// POST LOGIN Define wrapper function
export function requestLogin(email: string, password: string): Token {
  const res = request(
    'POST',
    SERVER_URL + '/v2/admin/auth/login',
    {
      json: {
        email: email,
        password: password
      }
    }
  );

  const result = JSON.parse(res.body.toString());

  if (res.statusCode !== 200) {
    throw HTTPError(res.statusCode, result?.error || result || 'NO MESSAGE');
  }

  return result;
}

// GET DETAILS Define wrapper function
export function requestDetails(token: number): Details | ErrorObject {
  const res = request(
    'GET',
    SERVER_URL + '/v2/admin/user/details',
    {
      headers: {
        token: token.toString()
      }
    }
  );

  const result = JSON.parse(res.body.toString());

  if (res.statusCode !== 200) {
    throw HTTPError(res.statusCode, result?.error || result || 'NO MESSAGE');
  }

  return result;
}

// POST LOGOUT Define wrapper function
export function requestLogout(token: number):
  ErrorObject | Record<string, never> {
  const res = request(
    'POST',
    SERVER_URL + '/v2/admin/auth/logout',
    {
      headers: {
        token: token.toString(),
      }
    }
  );

  const result = JSON.parse(res.body.toString());

  if (res.statusCode !== 200) {
    throw HTTPError(res.statusCode, result?.error || result || 'NO MESSAGE');
  }

  return result;
}

// PUT EDIT DETAILS Define wrapper function
export function requestDetailsEdit(token: number, email: string,
  nameFirst: string, nameLast: string): ErrorObject | Record<string, never> {
  const res = request(
    'PUT',
    SERVER_URL + '/v2/admin/user/details',
    {
      json: {
        email: email,
        nameFirst: nameFirst,
        nameLast: nameLast
      },
      headers: {
        token: token.toString()
      }
    }
  );

  const result = JSON.parse(res.body.toString());

  if (res.statusCode !== 200) {
    throw HTTPError(res.statusCode, result?.error || result || 'NO MESSAGE');
  }

  return result;
}

// PUT EDIT PASSWORD Define wrapper function
export function requestPasswordEdit(token: number, oldPass: string,
  newPass: string): ErrorObject | Record<string, never> {
  const res = request(
    'PUT',
    SERVER_URL + '/v2/admin/user/password',
    {
      json: {
        oldPassword: oldPass,
        newPassword: newPass
      },
      headers: {
        token: token.toString()
      }
    }
  );

  const result = JSON.parse(res.body.toString());

  if (res.statusCode !== 200) {
    throw HTTPError(res.statusCode, result?.error || result || 'NO MESSAGE');
  }

  return result;
}

// POST QUIZ CREATE Define wrapper function
export function requestQuizCreate(token: number, name: string,
  description: any): QuizId {
  const res = request(
    'POST',
    SERVER_URL + '/v1/admin/quiz',
    {
      json: {
        token: token,
        name: name,
        description: description
      }
    }
  );

  const result = JSON.parse(res.body.toString());

  if ('error' in result) return { quizId: -1 };
  else return result;
}

// GET QUIZ INFO Define wrapper function
export function requestQuizInfo(token: number | string, quizId: number):
  QuizInfo {
  const res = request(
    'GET',
    SERVER_URL + '/v2/admin/quiz/' + quizId + '?token=' + token,
    {
      headers: {
        token: token.toString()
      }
    }
  );

  const result = JSON.parse(res.body.toString());

  if (res.statusCode !== 200) {
    throw HTTPError(res.statusCode, result?.error || result || 'NO MESSAGE');
  }

  return result;
}

// GET QUIZ LIST Define wrapper function
export function requestQuizList(token: number | string): QuizList {
  const res = request(
    'GET',
    SERVER_URL + '/v2/admin/quiz/list?token=' + token,
    {
      headers: {
        token: token.toString()
      }
    }
  );
    
  const result = JSON.parse(res.body.toString());

  if (res.statusCode !== 200) {
    throw HTTPError(res.statusCode, result?.error || result || 'NO MESSAGE');
  }

  return result;
}

// PUT QUIZ DESCRIPTION UODATE Define Wrapper Function
export function requestQuizDescriptionUpdate(token: number | string,
  quizId: number, description: string) {
  const res = request(
    'PUT',
    SERVER_URL + '/v1/admin/quiz/' + quizId + '/description',
    {
      json: {
        token: token,
        description: description,
      }
    }
  );

  return JSON.parse(res.body.toString());
}

export function requestQuizNameUpdate(token: number, quizId: number,
  name: string) {
  const res = request(
    'PUT',
    SERVER_URL + '/v1/admin/quiz/' + quizId + '/name',
    {
      json: {
        token: token,
        name: name,
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
    SERVER_URL + '/v1/admin/quiz/' + quizId + '/question',
    {
      json: {
        token: token,
        questionBody: questionBody,
      }
    }
  );

  return JSON.parse(res.body.toString());
}

export function requestQuizTransfer(token: number | string, quizId: number,
  userEmail: string) {
  const res = request(
    'POST',
    SERVER_URL + '/v1/admin/quiz/' + quizId + '/transfer',
    {
      json: {
        token: token,
        userEmail: userEmail,
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

// POST QUIZ RESTORE Define wrapper function
export function requestQuizRestore(token: number, quizId: number):
  ErrorObject | Record<string, never> {
  const res = request(
    'POST',
    SERVER_URL + '/v1/admin/quiz/' + quizId + '/restore',
    {
      json: {
        token: token,
      }
    }
  );
  return JSON.parse(res.body.toString());
}

// QUESTION MOVE Define wrapper function
export function requestQuesMove(token: number | string, newPosition: number,
  quesId: number, quizId: number): ErrorObject | Record<string, never> {
  const res = request(
    'PUT',
    `${SERVER_URL}/v1/admin/quiz/${quizId}/question/${quesId}/move`,
    {
      json: {
        token: token,
        newPosition: newPosition
      }
    }
  );
  return JSON.parse(res.body.toString());
}

// QUESTION Duplicate Define wrapper function
export function requestQuesDup(token: number, quizid: number,
  questionid: number): QuestionId | ErrorObject {
  const res = request(
    'POST',
    `${SERVER_URL}/v1/admin/quiz/${quizid}/question/${questionid}/duplicate`,
    {
      json: {
        token: token
      }
    }
  );
  return JSON.parse(res.body.toString());
}

// QUESTION Update Define wrapper function
export function requestQuesUpdate(token: number, quizId: number, quesId: number,
  questionBody: QuestionBody): ErrorObject | Record<string, never> {
  const res = request(
    'PUT',
    `${SERVER_URL}/v1/admin/quiz/${quizId}/question/${quesId}`,
    {
      json: {
        token: token,
        questionBody: questionBody
      }
    }
  );

  return JSON.parse(res.body.toString());
}

// QUESTION Update Define wrapper function
export function requestQuesDelete(token: number, quizId: number,
  quesId: number): ErrorObject | Record<string, never> {
  const res = request(
    'DELETE',
    `${SERVER_URL}/v1/admin/quiz/${quizId}/question/${quesId}?token=${token}`,
    {
      qs: { }
    }
  );

  return JSON.parse(res.body.toString());
}

// DELETE EMPTY TRASH Define Wrapper Function
export function requestQuizEmptyTrash(token: number, quizId: number[]):
  ErrorObject | Record<string, never> {
  const res = request(
    'DELETE',
    SERVER_URL + '/v1/admin/quiz/trash/empty?quizIds=[' + quizId +
      ']&token=' + token,
    {
      qs: { }
    }
  );
  return JSON.parse(res.body.toString());
}
