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

// INTERFACE Datastore
let data: Datastore = {
  users: [],
  quizzes: [],
  sessions: []
};

// DATASTORE FUNCTIONS
/** getData
  * Access the data
  *
  * @returns { Datastore } - All cases
  */
function getData(): Datastore { return data; }

/** setData
  * Reset data to modified date
  *
  * @param { Datastore } newData - Data to set
  */
function setData(newData: Datastore) { data = newData; }

/** getUniqueID
  * Creates a unique ID (For authUserId, quizId, or token)
  *
  * @returns { number } - All cases
  */
function getUniqueID(allData: Datastore): number {
  // Creates a random 8 (Or greater) digit ID, which hasn't been used prior
  const usedIds: number[] = [];
  const allIds: number[] = [];

  for (const user of allData.users) usedIds.push(user.authUserId);
  for (const quiz of allData.quizzes) usedIds.push(quiz.quizId);
  for (const sess of allData.sessions) usedIds.push(sess.token);

  const smallestId = 10000000;
  const increment = 10000;
  for (let j = 0; allIds.length <= 0; j++) {
    const begin = smallestId + j * increment;
    const end = begin + increment;
    for (let i = begin; i < end; i++) allIds.push(i);

    const len = usedIds.length;
    for (let i = 0; i < len; i++) {
      if (allIds.indexOf(usedIds[0]) !== -1) {
        allIds.splice(allIds.indexOf(usedIds[0]), 1);
        usedIds.splice(0, 1);
      }
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
