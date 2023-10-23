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
  failed_password_num: number,
  prev_passwords: string[]
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

/** getUser
  * Loops through all tokens and users to identify the user
  *
  * @param { number } token - The session ID for the user
  *
  * @returns { UserAdd } - If the token exists and is valid
  * @returns { undefined } - If the token is invalid
*/
function getUser(token: number, allData: Datastore): UserAdd | undefined {
  for (const sess of allData.sessions) {
    if (sess.token === token && sess.is_valid) {
      for (const user of allData.users) {
        if (user.authUserId === sess.authUserId) {
          return user;
        }
      }
    }
  }

  return undefined;
}

/** getQuiz
  * Loops through all quizzes to find the quiz with given quizId
  *
  * @param { number } quizId - The quizID for the quiz
  *
  * @returns { QuizAdd } - If the quiz exists and is valid
  * @returns { undefined } - If the quizId is invalid
  */
function getQuiz(quizId: number, quizzes: QuizAdd[]): QuizAdd | undefined {
  for (const quiz of quizzes) {
    if (quizId === quiz.quizId) {
      return quiz;
    }
  }

  return undefined;
}

/** getSession
  * Loops through all sessions to find the session with given token
  *
  * @param { number } token - The token for the session
  *
  * @returns { SessionAdd } - If the token exists and is valid
  * @returns { undefined } - If the token is invalid
  */
function getSession(token: number, sessions: SessionAdd[]):
  SessionAdd | undefined {
  for (const sess of sessions) {
    if (token === sess.token && sess.is_valid === true) {
      return sess;
    }
  }

  return undefined;
}

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
  getUser,
  getQuiz,
  getSession,
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
