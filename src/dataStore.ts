// import { Session } from "inspector"
// import { string } from "yaml/dist/schema/common/string"

// INTERFACES Other
interface ErrorObject { error: string }

// INTERFACES Auth
interface AuthUserId { authUserId: number }

interface User {
  userId: number,
  name: string,
  email: string,
  numSuccessfulLogins: number,
  numFailedPasswordsSinceLastLogin: number
}

interface Details { user: User }

interface UserAdd {
  authUserId: number,
  nameFirst: string,
  nameLast: string,
  name: string,
  email: string,
  password: string,
  successful_log_time: number,
  failed_password_num: number
}

// INTERFACES Quiz
interface QuizId { quizId: number }

interface QuizBrief {
  quizId: number,
  name: string
}

interface QuizDetailed {
  quizId: number,
  name: string,
  timeCreated: number,
  timeLastEdited: number,
  description: string
}

interface QuizList { quizzes: QuizBrief[] }

interface Question {
  question: string,
  duration: number,
  points: number,
  answer: string,
}

interface QuizAdd {
  quizId: number,
  authId: number,
  name: string,
  description: string,
  timeCreated: number,
  timeLastEdited: number,
  in_trash: boolean,
  questions: Question[]
}

// INTERFACE Session
interface SessionAdd {
  token: number,
  authUserId: number,
  is_valid: boolean,
}

interface Token {
  token: number
}

// INTERFACE Datastore
interface Datastore {
  users: UserAdd[],
  quizzes: QuizAdd[],
  sessions: SessionAdd[]
}

// Datastore
let data: Datastore = {
  users: [],
  quizzes: [],
  sessions: []
};

// Use getData() to access the data
function getData(): Datastore { return data; }

// Use setData(newData) to pass modified data
function setData(newData: Datastore) { data = newData; }

/** getUniqueID
  * Creates a unique ID (For authUserId, quizId, or token)
  *
  * @returns { number } - All cases
*/
function getUniqueID(allData: Datastore): number {
  // Creates a random 8 digit ID, which hasn't been used prior
  const usedIds: number[] = [];
  const allIds: number[] = [];

  for (const user of allData.users) usedIds.push(user.authUserId);
  for (const quiz of allData.quizzes) usedIds.push(quiz.quizId);
  for (const sess of allData.sessions) usedIds.push(sess.token);

  for (let i = 10000000; i < 100000000; i++) allIds.push(i);

  for (const id of usedIds) {
    if (allIds.indexOf(id) !== -1) {
      allIds.splice(allIds.indexOf(id), 1);
    }
  }

  const randomPos = Math.floor(Math.random() * allIds.length);

  return allIds[randomPos];
}

export {
  getData,
  setData,
  getUniqueID,
  ErrorObject,
  AuthUserId,
  User,
  Details,
  UserAdd,
  QuizId,
  QuizBrief,
  QuizDetailed,
  QuizList,
  Question,
  QuizAdd,
  SessionAdd,
  Token,
  Datastore
};
