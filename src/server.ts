import express, { json, Request, Response } from 'express';
import { echo } from './newecho';
import morgan from 'morgan';
import config from './config.json';
import cors from 'cors';
import errorHandler from 'middleware-http-errors';
import YAML from 'yaml';
import sui from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import process from 'process';

import data from '../data.json';

import {
  adminAuthLogin,
  adminAuthRegister,
  adminUserDetails,
  adminAuthLogout,
  adminUserDetailsEdit,
  adminUserPasswordEdit,
} from './auth';

import {
  adminQuizList,
  adminQuizInfo,
  adminQuizCreate,
  adminQuizDescriptionUpdate,
  adminQuizTransfer,
  adminQuizRemove,
  adminQuizNameUpdate,
  adminQuizTrash,
  adminQuizRestore,
  adminQuizEmptyTrash,
  adminQuizUpdateImageURL
} from './quiz';

import {
  adminQuestionCreate,
  adminQuestionMove,
  adminQuestionDuplicate,
  updateQuestion,
  deleteQuestion,
} from './question';

import { clear } from './other';
import {
  getData,
  setData,
  token401,
  unauth403
} from './dataStore';

// Set up web app
const app = express();
// Use middleware that allows us to access the JSON body of requests
app.use(json());
// Use middleware that allows for access from other domains
app.use(cors());
// for logging errors (print to terminal)
app.use(morgan('dev'));
// for producing the docs that define the API
const file = fs.readFileSync(path.join(process.cwd(), 'swagger.yaml'), 'utf8');
app.get('/', (req: Request, res: Response) => res.redirect('/docs'));
app.use('/docs', sui.serve, sui.setup(YAML.parse(file), {
  swaggerOptions: { docExpansion: config.expandDocs ? 'full' : 'list' }
}));

const PORT: number = parseInt(process.env.PORT || config.port);
const HOST: string = process.env.IP || 'localhost';

// ====================================================================
//  ================= WORK IS DONE BELOW THIS LINE ===================
// ====================================================================
// Used after every put, post, delete routes to keep data.json updated
function backupData() {
  fs.writeFileSync('data.json', JSON.stringify(getData()));
}

// Example get request
app.get('/echo', (req: Request, res: Response) => {
  const data = req.query.echo as string;
  return res.json(echo(data));
});

// ====================================================================
//  ========================= AUTH FUNCTIONS =========================
// ====================================================================
//  =========================== VERSION 1 ============================
// ====================================================================

// adminAuthRegister
app.post('/v1/admin/auth/register', (req: Request, res: Response) => {
  const { email, password, nameFirst, nameLast } = req.body;
  res.json(adminAuthRegister(email, password, nameFirst, nameLast));
  backupData();
});

// adminAuthLogin
app.post('/v1/admin/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  res.json(adminAuthLogin(email, password));
  backupData();
});

// adminUserDetails
app.get('/v1/admin/user/details', (req: Request, res: Response) => {
  res.json(adminUserDetails(parseInt(req.query.token as string)));
});

// adminAuthLogout
app.post('/v1/admin/auth/logout', (req: Request, res: Response) => {
  res.json(adminAuthLogout(req.body.token));
  backupData();
});

// adminUserDetailsEdit
app.put('/v1/admin/user/details', (req: Request, res: Response) => {
  const { token, email, nameFirst, nameLast } = req.body;
  res.json(adminUserDetailsEdit(parseInt(token), email, nameFirst, nameLast));
  backupData();
});

// adminUserPasswordEdit
app.put('/v1/admin/user/password', (req: Request, res: Response) => {
  const { token, oldPassword, newPassword } = req.body;
  res.json(adminUserPasswordEdit(parseInt(token), oldPassword, newPassword));
  backupData();
});

// ====================================================================
//  ========================= AUTH FUNCTIONS =========================
// ====================================================================
//  =========================== VERSION 2 ============================
// ====================================================================

// adminAuthRegister
app.post('/v2/admin/auth/register', (req: Request, res: Response) => {
  const { email, password, nameFirst, nameLast } = req.body;
  res.json(adminAuthRegister(email, password, nameFirst, nameLast));
  backupData();
});

// adminAuthLogin
app.post('/v2/admin/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  res.json(adminAuthLogin(email, password));
  backupData();
});

// adminUserDetails
app.get('/v2/admin/user/details', (req: Request, res: Response) => {
  const token = parseInt(req.headers.token as string);
  res.json(adminUserDetails(token));
});

// adminAuthLogout
app.post('/v2/admin/auth/logout', (req: Request, res: Response) => {
  const token = parseInt(req.headers.token as string);
  res.json(adminAuthLogout(token));
  backupData();
});

// adminUserDetailsEdit
app.put('/v2/admin/user/details', (req: Request, res: Response) => {
  const { email, nameFirst, nameLast } = req.body;
  const token = parseInt(req.headers.token as string);

  res.json(adminUserDetailsEdit(token, email, nameFirst, nameLast));
  backupData();
});

// adminUserPasswordEdit
app.put('/v2/admin/user/password', (req: Request, res: Response) => {
  const { oldPassword, newPassword } = req.body;
  const token = parseInt(req.headers.token as string);

  res.json(adminUserPasswordEdit(token, oldPassword, newPassword));
  backupData();
});

// ====================================================================
//  ========================= QUIZ FUNCTIONS =========================
// ====================================================================
//  =========================== VERSION 1 ============================
// ====================================================================

// adminQuizCreate
app.post('/v1/admin/quiz', (req: Request, res: Response) => {
  const { token, name, description } = req.body;
  const response = adminQuizCreate(parseInt(token), name, description);

  if ('error' in response) {
    if (response.error === token401) return res.status(401).json(response);
    return res.status(400).json(response);
  }

  res.json(response);
  backupData();
});

// adminQuizTrash
app.get('/v1/admin/quiz/trash', (req: Request, res: Response) => {
  const token = parseInt(req.query.token as string);
  res.json(adminQuizTrash(token));
});

// adminQuizRemove
app.delete('/v1/admin/quiz/:quizid', (req: Request, res: Response) => {
  const token = parseInt(req.query.token as string);
  const quizId = parseInt(req.params.quizid);
  const response = adminQuizRemove(token, quizId);

  if ('error' in response) {
    if (response.error === token401) return res.status(401).json(response);
    else return res.status(403).json(response);
  }

  res.json(response);
  backupData();
});

// adminQuizList
app.get('/v1/admin/quiz/list', (req: Request, res: Response) => {
  const token = parseInt(req.query.token as string);
  res.json(adminQuizList(token));
});

// adminQuizInfo
app.get('/v1/admin/quiz/:quizid', (req: Request, res: Response) => {
  const token = parseInt(req.query.token as string);
  const quizId = parseInt(req.params.quizid);
  res.json(adminQuizInfo(token, quizId));
});

// adminQuizNameUpdate
app.put('/v1/admin/quiz/:quizid/name', (req: Request, res: Response) => {
  const { token, name } = req.body;
  const quizId = parseInt(req.params.quizid);
  const response = adminQuizNameUpdate(parseInt(token), quizId, name);

  if ('error' in response) {
    if (response.error === token401) return res.status(401).json(response);
    else if (response.error === unauth403) return res.status(403).json(response);
    else return res.status(400).json(response);
  }

  res.json(response);
  backupData();
});

// adminQuizDescriptionUpdate
app.put('/v1/admin/quiz/:quizid/description', (req: Request, res: Response) => {
  const { token, description } = req.body;
  const quizId = parseInt(req.params.quizid);
  const response = adminQuizDescriptionUpdate(parseInt(token), quizId,
    description);

  if ('error' in response) {
    if (response.error === token401) return res.status(401).json(response);
    else if (response.error === unauth403) return res.status(403).json(response);
    else return res.status(400).json(response);
  }

  res.json(response);
  backupData();
});

// adminQuizTransfer
app.post('/v1/admin/quiz/:quizid/transfer', (req: Request, res: Response) => {
  let { token, userEmail } = req.body;
  token = parseInt(token);
  const quizId = parseInt(req.params.quizid);
  const response = adminQuizTransfer(token, quizId, userEmail);

  if ('error' in response) {
    if (response.error === token401) return res.status(401).json(response);
    if (response.error === unauth403) return res.status(403).json(response);
    return res.status(400).json(response);
  }

  res.json(response);
  backupData();
});

// adminQuizRestore
app.post('/v1/admin/quiz/:quizid/restore', (req: Request, res: Response) => {
  const token = parseInt(req.body.token);
  const quizId = parseInt(req.params.quizid);
  const response = adminQuizRestore(token, quizId);

  if ('error' in response) {
    if (response.error === token401) return res.status(401).json(response);
    if (response.error === unauth403) return res.status(403).json(response);
    return res.status(400).json(response);
  }

  res.json(response);
  backupData();
});

// adminQuizEmptyTrash
app.delete('/v1/admin/quiz/trash/empty', (req: Request, res: Response) => {
  const token = parseInt(req.query.token as string);
  const quizId = JSON.parse(req.query.quizIds as string);

  res.json(adminQuizEmptyTrash(token, quizId));
  backupData();
});

// adminQuizTrash
app.get('/v1/admin/quiz/trash', (req: Request, res: Response) => {
  const token = parseInt(req.query.token as string);
  console.log('is this error');
  const response = adminQuizTrash(token);

  if ('error' in response) return res.status(401).json(response);
  res.json(response);
});

// ====================================================================
//  ========================= QUIZ FUNCTIONS =========================
// ====================================================================
//  =========================== VERSION 2 ============================
// ====================================================================

// adminQuizList
app.get('/v2/admin/quiz/list', (req: Request, res: Response) => {
  const token = parseInt(req.headers.token as string);
  res.json(adminQuizList(token));
});

// adminQuizTrash
app.get('/v2/admin/quiz/trash', (req: Request, res: Response) => {
  const token = parseInt(req.headers.token as string);
  res.json(adminQuizTrash(token));
});

// adminQuizInfo
app.get('/v2/admin/quiz/:quizid', (req: Request, res: Response) => {
  const token = parseInt(req.headers.token as string);
  const quizId = parseInt(req.params.quizid);
  res.json(adminQuizInfo(token, quizId));
});

// ====================================================================
//  ========================= QUESTION FUNCTIONS =====================
// ====================================================================
//  =========================== VERSION 1 ============================
// ====================================================================

// adminQuestionCreate
app.put('/v1/admin/quiz/:quizid/thumbnail', (req: Request, res: Response) => {
  const token = parseInt(req.headers.token as string);
  const quizId = parseInt(req.params.quizid);
  const { imgUrl } = req.body;

  adminQuizUpdateImageURL(token, quizId, imgUrl).then((resp) => {
    res.json(resp);
  }).catch((reason) => {
    res.status(reason.statusCode).json(reason);
  });
  backupData();
});

// adminQuestionCreate
app.post('/v1/admin/quiz/:quizid/question', (req: Request, res: Response) => {
  const { token, questionBody } = req.body;
  const quizId = parseInt(req.params.quizid);
  const response = adminQuestionCreate(parseInt(token), quizId, questionBody);

  if ('error' in response) {
    if (response.error === token401) return res.status(401).json(response);
    if (response.error === unauth403) return res.status(403).json(response);
    return res.status(400).json(response);
  }

  res.json(response);
  backupData();
});

// adminQuizUpdateQuestion
app.put('/v1/admin/quiz/:quizid/question/:questionid',
  (req: Request, res: Response) => {
    const questionId = parseInt(req.params.questionid);
    const quizId = parseInt(req.params.quizid);
    let { token, questionBody } = req.body;
    token = parseInt(token);

    const response = updateQuestion(token, quizId, questionId, questionBody);

    if ('error' in response) {
      if (response.error === token401) return res.status(401).json(response);
      if (response.error === unauth403) return res.status(403).json(response);
      return res.status(400).json(response);
    }

    res.json(response);
    backupData();
  });

// adminQuizDeleteQuestion
app.delete('/v1/admin/quiz/:quizid/question/:questionid',
  (req: Request, res: Response) => {
    const token = parseInt(req.query.token as string);
    const quizId = parseInt(req.params.quizid);
    const questionId = parseInt(req.params.questionid);

    const response = deleteQuestion(token, quizId, questionId);

    if ('error' in response) {
      if (response.error === token401) return res.status(401).json(response);
      if (response.error === unauth403) return res.status(403).json(response);
      return res.status(400).json(response);
    }

    res.json(response);
    backupData();
  });

// adminQuestionMove
app.put('/v1/admin/quiz/:quizid/question/:questionid/move',
  (req: Request, res: Response) => {
    const quizId = parseInt(req.params.quizid);
    const quesId = parseInt(req.params.questionid);
    const token = parseInt(req.body.token as string);
    const newPosition = parseInt(req.body.newPosition as string);

    res.json(adminQuestionMove(token, newPosition, quesId, quizId));
    backupData();
  });

// adminQuestionDuplicate
app.post('/v1/admin/quiz/:quizid/question/:questionid/duplicate',
  (req: Request, res: Response) => {
    const quizId = parseInt(req.params.quizid as string);
    const quesId = parseInt(req.params.questionid as string);
    const token = parseInt(req.body.token as string);

    res.json(adminQuestionDuplicate(token, quesId, quizId));
    backupData();
  });

// ====================================================================
//  ======================= QUESTION FUNCTIONS =======================
// ====================================================================
//  =========================== VERSION 2 ============================
// ====================================================================

// adminQuestionMove
app.put('/v2/admin/quiz/:quizid/question/:questionid/move',
  (req: Request, res: Response) => {
    const quizId = parseInt(req.params.quizid);
    const quesId = parseInt(req.params.questionid);
    const token = parseInt(req.headers.token as string);

    let { newPosition } = req.body;
    newPosition = parseInt(newPosition);

    res.json(adminQuestionMove(token, newPosition, quesId, quizId));
    backupData();
  });

// adminQuestionDuplicate
app.post('/v2/admin/quiz/:quizid/question/:questionid/duplicate',
  (req: Request, res: Response) => {
    const quizId = parseInt(req.params.quizid as string);
    const quesId = parseInt(req.params.questionid as string);
    const token = parseInt(req.headers.token as string);

    res.json(adminQuestionDuplicate(token, quesId, quizId));
    backupData();
  });

// ====================================================================
//  ======================== OTHER FUNCTIONS =========================
// ====================================================================
//  ========================= VERSION 1 + 2 ==========================
// ====================================================================

// clear: version 1
app.delete('/v1/clear', (req: Request, res: Response) => {
  res.json(clear());
  backupData();
});

// clear: version 2
app.delete('/v2/clear', (req: Request, res: Response) => {
  res.json(clear());
  backupData();
});

// ====================================================================
//  ================= WORK IS DONE ABOVE THIS LINE ===================
// ====================================================================

app.use((req: Request, res: Response) => {
  const error = `
    404 Not found - This could be because:
      0. You have defined routes below (not above) this middleware in server.ts
      1. You have not implemented the route ${req.method} ${req.path}
      2. There is a typo in either your test or server, e.g. /posts/list in one
         and, incorrectly, /post/list in the other
      3. You are using ts-node (instead of ts-node-dev) to start your server and
         have forgotten to manually restart to load the new changes
      4. You've forgotten a leading slash (/), e.g. you have posts/list instead
         of /posts/list in your server.ts or test file
  `;
  res.status(404).json({ error });
});

// For handling errors
app.use(errorHandler());

// start server
const server = app.listen(PORT, HOST, () => {
  // DO NOT CHANGE THIS LINE
  console.log(`⚡️ Server started on port ${PORT} at ${HOST}`);

  // On start, import all data from data.json and set it to data in dataStore
  if (data) setData(data);
  else clear();
});

// For coverage, handle Ctrl+C gracefully
process.on('SIGINT', () => {
  backupData();
  server.close(() => console.log('Shutting down server gracefully.'));
});
