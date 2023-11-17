
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
  Message,
  MessageBody,
  QuizSessionId,
  sessionStatus
} from '../dataStore';

const SERVER_URL = `${url}:${port}`;

// ====================================================================
//  ======================== OTHER FUNCTIONS =========================
// ====================================================================

// DELETE CLEAR Define wrapper function: Version 1
export function requestClearV1() {
  const res = request('DELETE', SERVER_URL + '/v1/clear');
  return JSON.parse(res.body.toString());
}

// DELETE CLEAR Define wrapper function: Version 1
export function requestClear() {
  const res = request('DELETE', SERVER_URL + '/v2/clear');
  return JSON.parse(res.body.toString());
}

// ====================================================================
//  ========================= AUTH FUNCTIONS =========================
// ====================================================================

// POST REGISTER Define wrapper function
export function requestRegister(email: string, password: string,
  nameFirst: string, nameLast: string, v1?:boolean): Token {
  let compUrl: string;
  if (v1) compUrl = SERVER_URL + '/v1/admin/auth/register';
  else compUrl = SERVER_URL + '/v2/admin/auth/register';

  const res = request(
    'POST', compUrl,
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
export function requestLogin(email: string, password: string, v1?:boolean):
  Token {
  let compUrl: string;
  if (v1) compUrl = SERVER_URL + '/v1/admin/auth/login';
  else compUrl = SERVER_URL + '/v2/admin/auth/login';

  const res = request(
    'POST', compUrl,
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
export function requestDetails(token: number, v1?:boolean): Details {
  let res;

  if (v1) {
    res = request(
      'GET',
      SERVER_URL + '/v1/admin/user/details',
      { qs: { token: token } }
    );
  } else {
    res = request(
      'GET',
      SERVER_URL + '/v2/admin/user/details',
      { headers: { token: token.toString() } }
    );
  }

  const result = JSON.parse(res.body.toString());

  if (res.statusCode !== 200) {
    throw HTTPError(res.statusCode, result?.error || result || 'NO MESSAGE');
  }

  return result;
}

// POST LOGOUT Define wrapper function
export function requestLogout(token: number, v1?:boolean):
  ErrorObject | Record<string, never> {
  let res;

  if (v1) {
    res = request(
      'POST',
      SERVER_URL + '/v1/admin/auth/logout',
      { json: { token: token } }
    );
  } else {
    res = request(
      'POST',
      SERVER_URL + '/v2/admin/auth/logout',
      { headers: { token: token.toString() } }
    );
  }

  const result = JSON.parse(res.body.toString());

  if (res.statusCode !== 200) {
    throw HTTPError(res.statusCode, result?.error || result || 'NO MESSAGE');
  }

  return result;
}

// PUT EDIT DETAILS Define wrapper function
export function requestDetailsEdit(token: number, email: string,
  nameFirst: string, nameLast: string, v1?: boolean):
  ErrorObject | Record<string, never> {
  let res;

  if (v1) {
    res = request(
      'PUT',
      SERVER_URL + '/v1/admin/user/details',
      {
        json: {
          email: email,
          nameFirst: nameFirst,
          nameLast: nameLast,
          token: token
        }
      }
    );
  } else {
    res = request(
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
  }

  const result = JSON.parse(res.body.toString());

  if (res.statusCode !== 200) {
    throw HTTPError(res.statusCode, result?.error || result || 'NO MESSAGE');
  }

  return result;
}

// PUT EDIT PASSWORD Define wrapper function
export function requestPasswordEdit(token: number, oldPass: string,
  newPass: string, v1?: boolean): ErrorObject | Record<string, never> {
  let res;

  if (v1) {
    res = request(
      'PUT',
      SERVER_URL + '/v1/admin/user/password',
      {
        json: {
          oldPassword: oldPass,
          newPassword: newPass,
          token: token
        }
      }
    );
  } else {
    res = request(
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
  }

  const result = JSON.parse(res.body.toString());

  if (res.statusCode !== 200) {
    throw HTTPError(res.statusCode, result?.error || result || 'NO MESSAGE');
  }

  return result;
}

// ====================================================================
//  ========================= QUIZ FUNCTIONS =========================
// ====================================================================

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
export function requestQuizInfo(token: number | string, quizId: number,
  v1?: boolean): QuizInfo {
  // Return 'v1' to const ver if v1 is ture, else return 'v2'
  const ver = v1 ? 'v1' : 'v2';
  const res = request(
    'GET',
    `${SERVER_URL}/${ver}/admin/quiz/${quizId}?token=${token}`,
    {
      // v1 ? {Ope1} : {Ope2}, include Ope1 if v1 is true else include Ope2
      ...(v1
        ? {
            qs: { token: token }
          }
        : {
            headers: { token: token.toString() }
          })
    }
  );

  const result = JSON.parse(res.body.toString());

  if (res.statusCode !== 200) {
    throw HTTPError(res.statusCode, result?.error || result || 'NO MESSAGE');
  }

  return result;
}

// GET QUIZ LIST Define wrapper function
export function requestQuizList(token: number | string,
  v1?: boolean): QuizList {
  const ver = v1 ? 'v1' : 'v2';
  const res = request(
    'GET',
    `${SERVER_URL}/${ver}/admin/quiz/list?token=${token}`,
    {
      ...(v1
        ? {
            qs: { token: token }
          }
        : {
            headers: { token: token.toString() }
          })
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
    SERVER_URL + '/v1/admin/quiz/' + quizId,
    { qs: { token: token } }
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

export function requestQuizTrash(token: number | string, v1?: boolean):
  QuizList | ErrorObject {
  let res;
  if (v1) {
    res = request(
      'GET',
      SERVER_URL + '/v1/admin/quiz/trash',
      { qs: { token: token } }
    );
  } else {
    res = request(
      'GET',
      SERVER_URL + '/v2/admin/quiz/trash',
      { headers: { token: token.toString() } }
    );
  }
  const result = JSON.parse(res.body.toString());

  if (res.statusCode !== 200) {
    throw HTTPError(res.statusCode, result?.error || result || 'NO MESSAGE');
  }

  return result;
}

// POST QUIZ RESTORE Define wrapper function
export function requestQuizRestore(token: number, quizId: number, v1?: boolean):
  ErrorObject | Record<string, never> {
  let res;

  if (v1) {
    res = request(
      'POST',
      SERVER_URL + '/v1/admin/quiz/' + quizId + '/restore',
      {
        json: { token: token }
      }
    );
  } else {
    res = request(
      'POST',
      SERVER_URL + '/v2/admin/quiz/' + quizId + '/restore',
      {
        headers: { token: token.toString() }
      }
    );
  }
  const result = JSON.parse(res.body.toString());

  if (res.statusCode !== 200) {
    throw HTTPError(res.statusCode, result?.error || result || 'NO MESSAGE');
  }

  return result;
}

// DELETE EMPTY TRASH Define Wrapper Function
export function requestQuizEmptyTrash(token: number, quizId: number[], v1?: boolean):
  ErrorObject | Record<string, never> {
  let res;
  if (v1) {
    res = request(
      'DELETE',
      SERVER_URL + '/v1/admin/quiz/trash/empty?quizIds=[' + quizId + ']',
      { qs: { token: token } }
    );
  } else {
    res = request(
      'DELETE',
      SERVER_URL + '/v2/admin/quiz/trash/empty?quizIds=[' + quizId + ']',
      { headers: { token: token.toString() } }
    );
  }
  const result = JSON.parse(res.body.toString());

  if (res.statusCode !== 200) {
    throw HTTPError(res.statusCode, result?.error || result || 'NO MESSAGE');
  }

  return result;
}

// DELETE EMPTY TRASH Define Wrapper Function
export function requestQuizImageUpdate(token: number, quizId: number,
  imgUrl: string): Record<string, never> {
  const res = request(
    'PUT',
    SERVER_URL + '/v1/admin/quiz/' + quizId + '/thumbnail',
    {
      headers: { token: token.toString() },
      json: { imgUrl: imgUrl }
    }
  );

  const result = JSON.parse(res.body.toString());

  if (res.statusCode !== 200) {
    throw HTTPError(res.statusCode, result?.error || result || 'NO MESSAGE');
  }

  return result;
}

// ====================================================================
//  ======================== SESSION FUNCTIONS =======================
// ====================================================================
// POST START SESSION Define Wrapper Function
export function requestQuizSessionStart(token: number, quizId: number,
  autoStart: number): QuizSessionId {
  const res = request(
    'POST',
    SERVER_URL + '/v1/admin/quiz/' + quizId + '/session/start',
    {
      headers: { token: token.toString() },
      json: { autoStartNum: autoStart }
    }
  );

  const result = JSON.parse(res.body.toString());

  if (res.statusCode !== 200) {
    throw HTTPError(res.statusCode, result?.error || result || 'NO MESSAGE');
  }

  return result;
}

export function requestQuizGetSession(quizId: number, sessionId: number,
  token: number): sessionStatus {
  const res = request(
    'GET',
    SERVER_URL + '/v1/admin/quiz/' + quizId + '/session/' + sessionId,
    {
      headers: { token: token.toString() },
    }
  );

  const result = JSON.parse(res.body.toString());

  if (res.statusCode !== 200) {
    throw HTTPError(res.statusCode, result?.error || result || 'NO MESSAGE');
  }

  return result;
}

// ====================================================================
//  ======================= QUESTION FUNCTIONS =======================
// ====================================================================

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

// QUESTION MOVE Define wrapper function
export function requestQuesMove(token: number | string, newPosition: number,
  quesId: number, quizId: number, v1?: boolean): Record<string, never> {
  const ver = v1 ? 'v1' : 'v2';
  const res = request(
    'PUT',
    `${SERVER_URL}/${ver}/admin/quiz/${quizId}/question/${quesId}/move`,
    {
      ...(v1
        ? {
            json: {
              token: token,
              newPosition: newPosition
            }
          }
        : {
            json: { newPosition: newPosition },
            headers: { token: token.toString() }
          })
    }
  );

  const result = JSON.parse(res.body.toString());

  if (res.statusCode !== 200) {
    throw HTTPError(res.statusCode, result?.error || result || 'NO MESSAGE');
  }

  return result;
}

// QUESTION Duplicate Define wrapper function
export function requestQuesDup(token: number, quizid: number,
  questionid: number, v1?: boolean): QuestionId {
  const v = v1 ? 'v1' : 'v2';
  const res = request(
    'POST',
    `${SERVER_URL}/${v}/admin/quiz/${quizid}/question/${questionid}/duplicate`,
    {
      ...(v1
        ? { json: { token: token } }
        : { headers: { token: token.toString() } }
      )
    }
  );

  const result = JSON.parse(res.body.toString());

  if (res.statusCode !== 200) {
    throw HTTPError(res.statusCode, result?.error || result || 'NO MESSAGE');
  }

  return result;
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
    `${SERVER_URL}/v1/admin/quiz/${quizId}/question/${quesId}?token=${token}`
  );

  return JSON.parse(res.body.toString());
}

// ====================================================================
//  ======================== PLAYER FUNCTIONS ========================
// ====================================================================
export function requestPlayerMessage(playerId: number, message: MessageBody):
  Record<string, never> {
  const res = request(
    'POST',
    SERVER_URL + '/v1/player/' + playerId + '/chat',
    { json: { message: message } }
  );
  const result = JSON.parse(res.body.toString());

  if (res.statusCode !== 200) {
    throw HTTPError(res.statusCode, result?.error || result || 'NO MESSAGE');
  }

  return result;
}

export function requestPlayerChat(playerId: number): { messages: Message[] } {
  const res = request('GET', SERVER_URL + '/v1/player/' + playerId + '/chat');
  const result = JSON.parse(res.body.toString());

  if (res.statusCode !== 200) {
    throw HTTPError(res.statusCode, result?.error || result || 'NO MESSAGE');
  }

  return result;
}
