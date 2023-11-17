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
import { createClient } from '@vercel/kv';

import data from '../data.json';

import { clear } from './other';
import { getData, setData } from './dataStore';

import {
  adminQuizSessionUpdate,
  quizGetSession,
  quizSessionStart
} from './sessions';

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

import {
  playerJoinSession,
  playerMessageChat,
  playerViewChat
} from './player';

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

const KV_REST_API_URL = "https://game-whale-34222.kv.vercel-storage.com";
const KV_REST_API_TOKEN = "AYWuASQgZGJlNGIwMDgtMTdkNi00MjE1LWIxMzctYjM2Njk2Nz" +
  "MyMmI0NWM1YmRjMDM2YzlhNDRmMGJlNDU1MTEzMmM1NGQwMGY=";

const database = createClient({
  url: KV_REST_API_URL,
  token: KV_REST_API_TOKEN,
});

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

// KV Data
app.get('/data', async (req: Request, res: Response) => {
  const data = await database.hgetall('data:toohak');
  res.status(200).json({data: data});
});

app.put('/data', async (req: Request, res: Response) => {
  const { data } = req.body;
  await database.hset("data:toohak", data);
  return res.status(200).json({ });
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
  res.json(adminQuizCreate(parseInt(token), name, description));
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

  res.json(adminQuizRemove(token, quizId));
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

  res.json(adminQuizNameUpdate(parseInt(token), quizId, name));
  backupData();
});

// adminQuizDescriptionUpdate
app.put('/v1/admin/quiz/:quizid/description', (req: Request, res: Response) => {
  const { token, description } = req.body;
  const quizId = parseInt(req.params.quizid);
  const response = adminQuizDescriptionUpdate(parseInt(token), quizId,
    description);

  res.json(response);
  backupData();
});

// adminQuizTransfer
app.post('/v1/admin/quiz/:quizid/transfer', (req: Request, res: Response) => {
  let { token, userEmail } = req.body;
  token = parseInt(token);
  const quizId = parseInt(req.params.quizid);

  res.json(adminQuizTransfer(token, quizId, userEmail));
  backupData();
});

// adminQuizRestore
app.post('/v1/admin/quiz/:quizid/restore', (req: Request, res: Response) => {
  const token = parseInt(req.body.token);
  const quizId = parseInt(req.params.quizid);

  res.json(adminQuizRestore(token, quizId));
  backupData();
});

// adminQuizEmptyTrash
app.delete('/v1/admin/quiz/trash/empty', (req: Request, res: Response) => {
  const token = parseInt(req.query.token as string);
  const quizId = JSON.parse(req.query.quizIds as string);

  res.json(adminQuizEmptyTrash(token, quizId));
  backupData();
});

// ====================================================================
//  ======================= SESSION FUNCTIONS ========================
// ====================================================================
//  =========================== VERSION 1 ============================
// ====================================================================
app.post('/v1/admin/quiz/:quizid/session/start',
  (req: Request, res: Response) => {
    const quizId = parseInt(req.params.quizid);
    const token = parseInt(req.headers.token as string);
    const autoStart = parseInt(req.body.autoStartNum);

    res.json(quizSessionStart(token, quizId, autoStart));
    backupData();
  });

app.get('/v1/admin/quiz/:quizid/session/:sessionid',
  (req: Request, res: Response) => {
    const quizId = parseInt(req.params.quizid);
    const sessionId = parseInt(req.params.sessionid);
    const token = parseInt(req.headers.token as string);

    res.json(quizGetSession(quizId, sessionId, token));
    backupData();
  });

app.put('/v1/admin/quiz/:quizid/session/:sessionid',
  (req: Request, res: Response) => {
    const token = parseInt(req.headers.token as string);
    const quizId = parseInt(req.params.quizid);
    const sessionId = parseInt(req.params.sessionid);
    const action = req.body.action;

    res.json(adminQuizSessionUpdate(quizId, sessionId, token, action));
    backupData();
  });

// ====================================================================
//  ========================= QUIZ FUNCTIONS =========================
// ====================================================================
//  =========================== VERSION 2 ============================
// ====================================================================

// adminQuizCreate
app.post('/v2/admin/quiz', (req: Request, res: Response) => {
  const { name, description } = req.body;
  const token = parseInt(req.headers.token as string);

  res.json(adminQuizCreate(token, name, description));
  backupData();
});

// adminQuizTrash
app.get('/v2/admin/quiz/trash', (req: Request, res: Response) => {
  const token = parseInt(req.headers.token as string);
  res.json(adminQuizTrash(token));
});

// adminQuizRemove
app.delete('/v2/admin/quiz/:quizid', (req: Request, res: Response) => {
  const token = parseInt(req.headers.token as string);
  const quizId = parseInt(req.params.quizid);

  res.json(adminQuizRemove(token, quizId));
  backupData();
});

// adminQuizList
app.get('/v2/admin/quiz/list', (req: Request, res: Response) => {
  const token = parseInt(req.headers.token as string);
  res.json(adminQuizList(token));
});

// adminQuizEmptyTrash
app.delete('/v2/admin/quiz/trash/empty', (req: Request, res: Response) => {
  const token = parseInt(req.headers.token as string);
  const quizIds = JSON.parse(req.query.quizIds as string);
  res.json(adminQuizEmptyTrash(token, quizIds));
  backupData();
});

// adminQuizInfo
app.get('/v2/admin/quiz/:quizid', (req: Request, res: Response) => {
  const token = parseInt(req.headers.token as string);
  const quizId = parseInt(req.params.quizid);
  res.json(adminQuizInfo(token, quizId));
});

// adminQuizNameUpdate
app.put('/v2/admin/quiz/:quizid/name', (req: Request, res: Response) => {
  const { name } = req.body;
  const quizId = parseInt(req.params.quizid);
  const token = parseInt(req.headers.token as string);

  res.json(adminQuizNameUpdate(token, quizId, name));
  backupData();
});

// adminQuizDescriptionUpdate
app.put('/v2/admin/quiz/:quizid/description', (req: Request, res: Response) => {
  const { description } = req.body;
  const quizId = parseInt(req.params.quizid);
  const token = parseInt(req.headers.token as string);

  res.json(adminQuizDescriptionUpdate(token, quizId, description));
  backupData();
});

// adminQuizTransfer
app.post('/v2/admin/quiz/:quizid/transfer', (req: Request, res: Response) => {
  const { userEmail } = req.body;
  const token = parseInt(req.headers.token as string);
  const quizId = parseInt(req.params.quizid);

  res.json(adminQuizTransfer(token, quizId, userEmail));
  backupData();
});

// adminQuizRestore
app.post('/v2/admin/quiz/:quizid/restore', (req: Request, res: Response) => {
  const token = parseInt(req.headers.token as string);
  const quizId = parseInt(req.params.quizid);

  res.json(adminQuizRestore(token, quizId));
  backupData();
});

// ====================================================================
//  ========================= QUESTION FUNCTIONS =====================
// ====================================================================
//  =========================== VERSION 1 ============================
// ====================================================================

// adminQuestionCreate
app.post('/v1/admin/quiz/:quizid/question', (req: Request, res: Response) => {
  const { token, questionBody } = req.body;
  const quizId = parseInt(req.params.quizid);

  res.json(adminQuestionCreate(parseInt(token), quizId, questionBody));
  backupData();
});

// adminQuizUpdateQuestion
app.put('/v1/admin/quiz/:quizid/question/:questionid',
  (req: Request, res: Response) => {
    const questionId = parseInt(req.params.questionid);
    const quizId = parseInt(req.params.quizid);
    let { token, questionBody } = req.body;
    token = parseInt(token);

    res.json(updateQuestion(token, quizId, questionId, questionBody));
    backupData();
  });

// adminQuizDeleteQuestion
app.delete('/v1/admin/quiz/:quizid/question/:questionid',
  (req: Request, res: Response) => {
    const token = parseInt(req.query.token as string);
    const quizId = parseInt(req.params.quizid);
    const questionId = parseInt(req.params.questionid);

    res.json(deleteQuestion(token, quizId, questionId));
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

// adminQuizUpdateImageURL
app.put('/v1/admin/quiz/:quizid/thumbnail', (req: Request, res: Response) => {
  const token = parseInt(req.headers.token as string);
  const quizId = parseInt(req.params.quizid);
  const { imgUrl } = req.body;

  res.json(adminQuizUpdateImageURL(token, quizId, imgUrl));
  backupData();
});

// ====================================================================
//  ======================= QUESTION FUNCTIONS =======================
// ====================================================================
//  =========================== VERSION 2 ============================
// ====================================================================

// adminQuestionCreate
app.post('/v2/admin/quiz/:quizid/question', (req: Request, res: Response) => {
  const { questionBody } = req.body;
  const quizId = parseInt(req.params.quizid);
  const token = parseInt(req.headers.token as string);

  // So that the same function works for both v1 and v2
  if (!questionBody.thumbnailUrl) questionBody.thumbnailUrl = 'Invalid';

  res.json(adminQuestionCreate(token, quizId, questionBody));
  backupData();
});

// adminQuizUpdateQuestion
app.put('/v2/admin/quiz/:quizid/question/:questionid',
  (req: Request, res: Response) => {
    const questionId = parseInt(req.params.questionid);
    const quizId = parseInt(req.params.quizid);
    const { questionBody } = req.body;
    const token = parseInt(req.headers.token as string);

    // So that the same function works for both v1 and v2
    if (!questionBody.thumbnailUrl) questionBody.thumbnailUrl = 'Invalid';

    res.json(updateQuestion(token, quizId, questionId, questionBody));
    backupData();
  });

// adminQuizDeleteQuestion
app.delete('/v2/admin/quiz/:quizid/question/:questionid',
  (req: Request, res: Response) => {
    const token = parseInt(req.headers.token as string);
    const quizId = parseInt(req.params.quizid);
    const questionId = parseInt(req.params.questionid);

    res.json(deleteQuestion(token, quizId, questionId));
    backupData();
  });

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
//  ======================== PLAYER FUNCTIONS ========================
// ====================================================================
//  =========================== VERSION 1 ============================
// ====================================================================
app.post('/v1/player/join', (req: Request, res: Response) => {
  const { sessionId, name } = req.body;
  res.json(playerJoinSession(sessionId, name));
  backupData();
});

app.get('/v1/player/:playerid/chat', (req: Request, res: Response) => {
  const playerId = parseInt(req.params.playerid);
  res.json(playerViewChat(playerId));
  backupData();
});

app.post('/v1/player/:playerid/chat', (req: Request, res: Response) => {
  const playerId = parseInt(req.params.playerid);
  const message = req.body.message;
  res.json(playerMessageChat(playerId, message));
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
