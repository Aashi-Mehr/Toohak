// import { Session } from "inspector"
// import { string } from "yaml/dist/schema/common/string"

// INTERFACES Other
interface ErrorObject { error: string }

interface Empty { }

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
  sessionId: number,
  authUserId: number,
  is_valid: boolean,
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
function getData(): Datastore { return data };

// Use setData(newData) to pass modified data
function setData(newData: Datastore): null {
  data = newData;
  return null;
}

export {
  getData,
  setData,
  ErrorObject,
  Empty,
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
  Datastore
};
