
import request from 'sync-request-curl';
import { port, url } from '../config.json';
import {
  Token,
  QuizId,
  QuizDetailed,
  QuestionBody,
  QuestionId
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

export function requestRegister(email: string, password: string,
  nameFirst: string, nameLast: string): Token {
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

  return JSON.parse(res.body.toString());
}

export function requestQuizCreate(token: number | string, name: string,
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

  return JSON.parse(res.body.toString());
}

export function requestQuizInfo(token: number | string, quizId: number):
  QuizDetailed {
  const res = request(
    'GET',
    SERVER_URL + '/v1/admin/quiz/' + quizId,
    {
      json: {
        token: token
      }
    }
  );
  return JSON.parse(res.body.toString());
}

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
