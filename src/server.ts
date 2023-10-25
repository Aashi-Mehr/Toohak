import express, { json, Request, Response } from 'express';
import { echo } from './newecho';
import morgan from 'morgan';
import config from './config.json';
import cors from 'cors';
import YAML from 'yaml';
import sui from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import process from 'process';

import data from './data.json';

import {
  adminAuthLogin,
  adminAuthRegister,
  adminUserDetails,
  adminAuthLogout,
  adminUserDetailsEdit,
  adminUserPasswordEdit
} from './auth';

import {
  adminQuizList,
  adminQuizInfo,
  adminQuizCreate,
  // Uncomment the functions that you need (Lint gives an error if it's not in a
  // comment :/)
  // adminQuizRemove,
  // adminQuizNameUpdate,
  adminQuizDescriptionUpdate,
  adminQuizRemove,
  adminQuizNameUpdate
} from './quiz';

import {
  adminQuestionCreate
} from './question';

import { clear } from './other.js';
import { getData, setData } from './dataStore';

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
app.use('/docs', sui.serve, sui.setup(YAML.parse(file), { swaggerOptions: { docExpansion: config.expandDocs ? 'full' : 'list' } }));

const PORT: number = parseInt(process.env.PORT || config.port);
const HOST: string = process.env.IP || 'localhost';

// ====================================================================
//  ================= WORK IS DONE BELOW THIS LINE ===================
// ====================================================================
function backupData(req: Request, res: Response, response: any) {
  fs.writeFile('./data.json', JSON.stringify(getData()), (err) => {
    if (err) return res.status(404).json(response);
  });
}

// Example get request
app.get('/echo', (req: Request, res: Response) => {
  const data = req.query.echo as string;
  const ret = echo(data);

  if ('error' in ret) res.status(400);
  return res.json(ret);
});

// ====================================================================
//  ========================= AUTH FUNCTIONS =========================
// ====================================================================

// adminAuthRegister
app.post('/v1/admin/auth/register', (req: Request, res: Response) => {
  const { email, password, nameFirst, nameLast } = req.body;
  const response = adminAuthRegister(email, password, nameFirst, nameLast);

  if ('error' in response) return res.status(400).json(response);
  res.json(response);
  backupData(req, res, response);
});

// adminAuthLogin
app.post('/v1/admin/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  const response = adminAuthLogin(email, password);

  if ('error' in response) return res.status(400).json(response);
  res.json(response);
  backupData(req, res, response);
});

// adminUserDetails
app.get('/v1/admin/user/details', (req: Request, res: Response) => {
  const token = parseInt(req.query.token as string);
  const response = adminUserDetails(token);

  if ('error' in response) return res.status(400).json(response);
  res.json(response);
});

// adminAuthLogout
app.post('/v1/admin/auth/logout', (req: Request, res: Response) => {
  const token = parseInt(req.body.token);
  const response = adminAuthLogout(token);

  if ('error' in response) return res.status(401).json(response);
  res.json(response);
  backupData(req, res, response);
});

// adminUserDetailsEdit
app.put('/v1/admin/user/details', (req: Request, res: Response) => {
  const { token, email, nameFirst, nameLast } = req.body;
  const response = adminUserDetailsEdit(parseInt(token), email,
    nameFirst, nameLast);

  if ('error' in response) {
    if (response.error.includes('Token')) return res.status(401).json(response);
    return res.status(400).json(response);
  }

  res.json(response);
  backupData(req, res, response);
});

// adminUserPasswordsEdit
app.put('/v1/admin/user/password', (req: Request, res: Response) => {
  const { token, oldPassword, newPassword } = req.body;
  const response = adminUserPasswordEdit(parseInt(token), oldPassword,
    newPassword);

  if ('error' in response) {
    if (response.error.includes('Token')) return res.status(401).json(response);
    return res.status(400).json(response);
  }

  res.json(response);
  backupData(req, res, response);
});

// ====================================================================
//  ========================= QUIZ FUNCTIONS =========================
// ====================================================================

// adminQuizList
app.get('/v1/admin/quiz/list', (req: Request, res: Response) => {
  const token = parseInt(req.query.token as string);
  const response = adminQuizList(token);

  if ('error' in response) return res.status(401).json(response);
  res.json(response);
});

// adminQuizCreate
app.post('/v1/admin/quiz', (req: Request, res: Response) => {
  const { token, name, description } = req.body;
  const response = adminQuizCreate(parseInt(token), name, description);

  if ('error' in response) return res.status(400).json(response);
  res.json(response);
  backupData(req, res, response);
});

// adminQuizRemove
app.delete('/v1/admin/quiz/:quizid', (req: Request, res: Response) => {
  const token = parseInt(req.query.token as string);
  const quizId = parseInt(req.params.quizid);
  const response = adminQuizRemove(token, quizId);

  res.json(response);
  backupData(req, res, response);
});

// adminQuizNameUpdate
app.put('/v1/admin/quiz/:quizid/name', (req: Request, res: Response) => {
  const { token, name } = req.body;
  const quizId = parseInt(req.params.quizid);
  const response = adminQuizNameUpdate(parseInt(token), quizId, name);

  if ('Quiz is not owned by user' in response) {
    return res.status(403).json(response);
  }
  if ('error' in response) return res.status(400).json(response);

  res.json(response);
  backupData(req, res, response);
});

// adminQuizDescriptionUpdate
app.put('/v1/admin/quiz/:quizid/description', (req: Request, res: Response) => {
  const { token, description } = req.body;
  const quizId = parseInt(req.params.quizid);
  const response = adminQuizDescriptionUpdate(parseInt(token), quizId,
    description);

  if ('Quiz is not owned by user' in response) {
    return res.status(403).json(response);
  }
  if ('error' in response) return res.status(400).json(response);

  res.json(response);
  backupData(req, res, response);
});

// adminQuizInfo
app.get('/v1/admin/quiz/:quizid', (req: Request, res: Response) => {
  const token = parseInt(req.query.token as string);
  const quizId = req.params.quizid;
  const response = adminQuizInfo(token, parseInt(quizId));

  if ('No such quiz' in response) return res.status(400).json(response);
  if ('Quiz is not owned by user' in response) { return res.status(403).json(response); }
  res.json(response);
});

// ====================================================================
//  ========================= QUESTION FUNCTIONS ======================
// ====================================================================

// adminQuestionCreate
app.post('/v1/admin/quiz/:quizid/question', (req: Request, res: Response) => {
  const { token, questionBody } = req.body;
  const quizId = parseInt(req.params.quizid);
  const response = adminQuestionCreate(parseInt(token), quizId, questionBody);

  if ('Quiz is not owned by user' in response) {
    return res.status(403).json(response);
  }
  if ('error' in response) return res.status(400).json(response);

  res.json(response);
  backupData(req, res, response);
});

// ====================================================================
//  ======================== OTHER FUNCTIONS =========================
// ====================================================================

// clear
app.delete('/v1/clear', (req: Request, res: Response) => {
  const response = clear();

  res.json(response);
  backupData(req, res, response);
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

// start server
const server = app.listen(PORT, HOST, () => {
  // DO NOT CHANGE THIS LINE
  console.log(`⚡️ Server started on port ${PORT} at ${HOST}`);

  // On start, import all data from data.json and set it to data in dataStore
  setData(data);
  console.log('Data has been set to:', getData());
});

// For coverage, handle Ctrl+C gracefully
process.on('SIGINT', () => {
  backupData(null, null, null);
  console.log('Final data should be:', getData());
  server.close(() => console.log('Shutting down server gracefully.'));
});
