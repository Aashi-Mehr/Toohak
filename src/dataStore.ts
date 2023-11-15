// Default Quiz Thumnail
const DEFAULT_QUIZ_THUMBNAIL = '';

// ERROR MESSAGES
// 403 Errors
const unauth403 = 'Valid token is provided, but user is unauthorised';

// 401 Errors
const token401 = 'Token is empty or invalid (does not refer to valid logged' +
  ' in user session)';

// 400 Errors
// Quiz errors
const nameChar400 = 'Name contains invalid characters. Valid characters are' +
  ' alphanumeric and spaces';
const nameLen400 = 'Name is either less than 3 characters long or more than' +
  ' 30 characters long';
const nameUsed400 = 'Name is already used by the current logged in user ' +
  'for another quiz';
const desc400 = 'Description is more than 100 characters in length ' +
  '(note: empty strings are OK)';
const notBin400 = 'Quiz ID refers to a quiz that is not currently in the trash';
const notUser400 = 'userEmail is not a real user';
const currUser400 = 'userEmail is the current logged in user';

// Question errors
const quesLen400 = 'Question is less than 5 or greater than 50 characters';
const ansNum400 = 'The question has more than 6 answers or less than 2 answers';
const quesDur400 = 'The question duration is not a positive number';
const quizDur400 = 'The quiz duration cannot exceed 3 minutes';
const quesPoints400 = 'The points awarded for the question are less than 1 ' +
  'or greater than 10';
const ansLen400 = 'The length of an answer is shorter than 1 or longer than 30';
const ansDup400 = 'Answer strings are duplicates of within the question';
const ansInc400 = 'There are no correct answers';
const quesID400 = 'Question Id does not refer to a question within this quiz';
const quesPos400 = 'NewPosition is less than 0, greater than number of ' +
  'questions, or current position';

// Auth errors
const emailUsed400 = 'Email address is used by another user';
const emailValid400 = 'Email does not satisfy validator';
const userChar400 = 'Name contains invalid characters or is less than 2 or ' +
  'more than 20 characters';
const passLen400 = 'Password is less than 8 characters';
const passChar400 = 'Password needs at least one number and one letter';
const passInv400 = 'Email or password is incorrect';
const oldPass400 = 'Old Password is not the correct old password';
const newPass400 = 'Old Password and New Password match exactly';

// Session errors
const auto400 = 'autoStartNum is a number greater than 50';
const tooMany400 = 'A maximum of 10 sessions not in END state currently exist';
const noQs400 = 'The quiz does not have any questions in it';
const unactive400 = 'Session Id does not refer to a valid session within this quiz';
const invalAct400 = 'Action provided in not a valid action';
const cantAct400 = 'Action cannot be applied in current state';

// Player errors
const playerId400 = 'Player ID does not exist';
const message400 = 'Message is less than 1 or more than 100 characters';

// Image errors
const invImg400 = 'When fetched, the URL doesn\'t return a valid file or type' +
  ' is not JPG/JPEG or PNG.';

// ENUM States
export enum SessionState {
  // Players can join in this state, and nothing has started
  LOBBY = 'lobby',

  // This is the question countdown period. It always exists before a question
  // is open and the frontend makes the request to move to the open state
  QUESTION_COUNTDOWN = 'question_countdown',

  // This is when players can see the question and answers, and submit their
  // answers (as many times as they like)
  QUESTION_OPEN = 'question_open',

  // This is when players can still see the question answers, but cannot submit
  QUESTION_CLOSE = 'question_close',

  // This is when players can see the correct answer, as well as everyone
  // playings' performance in that question, whilst they typically wait to go to
  // the next countdown
  ANSWER_SHOW = 'answer_show',

  // This is where the final results are displayed for all players and questions
  FINAL_RESULTS = 'final_results',

  // The game is now over and inactive
  END = 'end'
}

// ENUM Actions
export enum Actions {
  // Move onto the countdown for the next question
  NEXT_QUESTION = 'next_question',

  // This is how to skip the question countdown period immediately.
  SKIP_COUNTDOWN = 'skip_countdown',

  // Go straight to the next most immediate answers show state
  GO_TO_ANSWER = 'go_to_answer',

  // Go straight to the final results state
  GO_TO_FINAL_RESULTS = 'go_to_final_results',

  // Go straight to the END state
  END = 'end'
}

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

// INTERFACES Question
interface Answer {
  answerId: number,
  answer: string,
  colour: string,
  correct: boolean
}

interface Question {
  questionId: number,
  question: string,
  duration: number,
  points: number,
  answers: Answer[],
  thumbnailUrl: string
}

interface AnswerBody {
  answer: string,
  correct: boolean,
}

interface QuestionBody {
  question: string,
  duration: number,
  points: number,
  answers: AnswerBody[]
}

interface QuestionBodyV2 {
  question: string,
  duration: number,
  points: number,
  answers: AnswerBody[],
  thumbnailUrl: string
}

interface QuestionId {
  questionId: number
}

// INTERFACES Quiz
interface QuizInfo {
  quizId: number,
  name: string,
  timeCreated: number,
  timeLastEdited: number,
  description: string,
  numQuestions: number,
  questions: Question[],
  duration: number,
  thumbnailUrl: string
}

interface QuizBrief {
  quizId: number,
  name: string
}

interface QuizList { quizzes: QuizBrief[] }

interface QuizAdd { // Need to add thumbnail URL component
  quizId: number,
  authId: number,
  name: string,
  description: string,
  timeCreated: number,
  timeLastEdited: number,
  in_trash: boolean,
  questions: Question[],
  thumbnailUrl: string
}

interface QuizId { quizId: number }

// INTERFACE Session
interface SessionAdd {
  token: number,
  authUserId: number,
  is_valid: boolean,
}

interface Token {
  token: number
}

// INTERFACE Quiz Sessions
interface Message {
  messageBody: string,
  playerId: number,
  playerName: string,
  timeSent: number
}

interface MessageBody {
  messageBody: string
}

interface QuizSessionPlayer {
  name: string,
  playerId: number
}

interface QuizSessionAdd {
  sessionId: number,
  state: string,
  atQuestion: number,
  quiz: QuizAdd,
  players: QuizSessionPlayer[],
  messages: Message[]
}

// INTERFACE Datastore
interface Datastore {
  users: UserAdd[],
  quizzes: QuizAdd[],
  sessions: SessionAdd[],
  quizSessions: QuizSessionAdd[]
}

interface QuizSessionId {
  sessionId: number
}

// Datastore, initially set in server.ts on startup
let data: Datastore = {
  users: [],
  quizzes: [],
  sessions: [],
  quizSessions: []
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
    // Loops through all sessions, until is finds one with given token
    if (sess.token === token && sess.is_valid) {
      for (const user of allData.users) {
        // Finds the user with the authUserId tied to given session
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
  // Loops through all quizzes until it finds relevant, valid quiz
  for (const quiz of quizzes) if (quizId === quiz.quizId) return quiz;

  // Invalid / Never existed
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
  // Loops through all sessions until it finds relevant, valid session
  for (const sess of sessions) {
    if (token === sess.token && sess.is_valid === true) return sess;
  }

  // Invalid / Never existed
  return undefined;
}

interface PlayerSession {
  player: QuizSessionPlayer,
  quizSession: QuizSessionAdd
}

/** getPlayerSession
  * Loops through all players and quizSessions to find the relevant quiz session
  *
  * @param { number } playerId - The playerId for the player
  *
  * @returns { PlayerSession } - If the player exists
  * @returns { undefined } - If the playerIs is invalid
  */
function getPlayerSession(playerId: number, data: Datastore):
  PlayerSession | undefined {
  // Loops through all quizzes until it finds relevant, valid quiz
  for (const quizSession of data.quizSessions) {
    for (const player of quizSession.players) {
      // Loops through all players of every quiz until it finds the one
      if (player.playerId === playerId) {
        return {
          player: player,
          quizSession: quizSession
        };
      }
    }
  }

  // Invalid / Never existed
  return undefined;
}

/** getUniqueID
  * Creates a unique ID (For and Id in dataStore)
  *
  * @returns { number } - All cases
  */
function getUniqueID(allData: Datastore): number {
  // Creates a random 8 (Or greater) digit ID, which hasn't been used prior
  // List of used authUserIds, quizIds, tokens, answerIds, and questionIds
  const usedIds: number[] = [];
  const allIds: number[] = [];

  // Adding used sessionIds
  for (const sess of allData.quizSessions) usedIds.push(sess.sessionId);

  // Adding used authUserIds
  for (const user of allData.users) usedIds.push(user.authUserId);

  // Adding used tokens
  for (const sess of allData.sessions) usedIds.push(sess.token);

  // Adding used quizIds
  for (const quiz of allData.quizzes) {
    usedIds.push(quiz.quizId);

    // Adding used questionIds
    for (const question of quiz.questions) {
      usedIds.push(question.questionId);

      // Adding used answerIds
      for (const answer of question.answers) usedIds.push(answer.answerId);
    }
  }

  // To ensure that the Id is 8 digits (Or greater, but unlikely to be greater)
  const smallestId = 10000000;

  // So that the code is somewhat efficient, instead of a fully random 8-digit
  // number, a random 8-digit number with a 10,000 range is produced
  const increment = 10000;

  // Adding all possible IDs, then removing the ones that have been used
  // Then picking a random ID from the remaining IDs
  // The loop will be exitted as soon as there are valid IDs in the allIds list
  for (let j = 0; allIds.length <= 0; j++) {
    // All IDs within the range of 10,000
    const begin = smallestId + j * increment;
    const end = begin + increment;
    for (let i = begin; i < end; i++) allIds.push(i);

    // Removing usedIds
    const len = usedIds.length;
    for (let i = 0; i < len; i++) {
      /* istanbul ignore next */
      if (allIds.indexOf(usedIds[0]) !== -1) {
        // Having more than 10 000 users causes the tests to be too slow, so the
        // coverage error cannot be fixed
        allIds.splice(allIds.indexOf(usedIds[0]), 1);
        usedIds.splice(0, 1);
      }
    }
  }

  // Choosing from the valid unused IDs, and returning
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
  getPlayerSession,
  ErrorObject,
  AuthUserId,
  User,
  Details,
  UserAdd,
  QuizId,
  QuizBrief,
  QuizInfo,
  QuizList,
  Question,
  QuizAdd,
  SessionAdd,
  Token,
  Datastore,
  AnswerBody,
  QuestionBody,
  QuestionBodyV2,
  QuestionId,
  QuizSessionId,
  Answer,
  Message,
  QuizSessionPlayer,
  QuizSessionAdd,
  MessageBody,
  DEFAULT_QUIZ_THUMBNAIL,
  unauth403,
  token401,
  nameChar400,
  nameLen400,
  nameUsed400,
  desc400,
  notBin400,
  notUser400,
  currUser400,
  quesLen400,
  ansNum400,
  quesDur400,
  quizDur400,
  quesPoints400,
  ansLen400,
  ansDup400,
  ansInc400,
  quesID400,
  quesPos400,
  emailUsed400,
  emailValid400,
  userChar400,
  passLen400,
  passChar400,
  passInv400,
  oldPass400,
  newPass400,
  auto400,
  tooMany400,
  noQs400,
  playerId400,
  message400,
  invImg400
};
