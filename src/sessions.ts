import HTTPError from 'http-errors';
import {
  // QuizAdd,
  QuizSessionId,
  // SessionAdd,
  // SessionState,
  auto400,
  getData,
  getQuiz,
  getUniqueID,
  getUser,
  noQs400,
  // setData,
  token401,
  tooMany400,
  unauth403
} from './dataStore';

/** quizSessionStart
  * Starts a quiz sessions
  *
  * @param { number } token - The token of the user starting the session
  * @param { number } quizId - The quizId of the quiz that's being started
  * @param { number } autoStart - The number of people after which the quiz
  *                               automaticaly starts
  *
  * @returns { QuizSessionId } - If all details are valid
  */
export function quizSessionStart(token: number, quizId: number,
  autoStart: number): QuizSessionId {
  // Error 401: Token is empty or invalid
  const user = getUser(token, getData());
  if (!user) throw HTTPError(401, token401);

  // Error 403: Valid token is provided, but user is not an owner of this quiz
  const quiz = getQuiz(quizId, getData().quizzes);
  if (!quiz || quiz.authId !== user.authUserId) {
    throw HTTPError(403, unauth403);
  }

  // Error 400: autoStartNum is a number greater than 50
  if (autoStart > 50) throw HTTPError(400, auto400);

  // Error 400: A maximum of 10 sessions not in END state currently exist
  let numSessions = 0;
  for (const session of getData().sessions) {
    if (session.state !== 'END') numSessions++;
  }
  if (numSessions >= 10) throw HTTPError(400, tooMany400);

  // Error 400: The quiz does not have any questions in it
  if (!quiz.questions.length) throw HTTPError(400, noQs400);

  // Otherwise, start the session and generate a random sessionId
  const sessionId = getUniqueID(getData());

  // This copies the quiz, so that any edits whilst a session is running does
  // not affect active session
  getData().sessions.push({
    autoStartNum: autoStart,
    playerNum: 0,
    sessionId: sessionId,
    messages: [],
    state: 'LOBBY',
    questionNow: 0,
    players: [],
    questionStartTime: null,
    quiz: quiz,
    currentQuestionResult: {
      questionId: null,
      playersCorrentList: [],
      averageAnswerTime: -1,
      percentCorrect: -1,
    },
    finalResult: {
      usersRankedByScore: [],
      questionResults: [],
    },
    csvOutputs: [],
    token: 0,
    authUserId: 0,
    is_valid: false
  });

  // Return sessionId object
  return { sessionId: sessionId };
}
