import HTTPError from 'http-errors';
import {
  QuizSessionId,
  SessionState,
  getData,
  getQuiz,
  getUser,
  getQuizSession,
  getUniqueID,
  unauth403,
  unactive400,
  token401,
  auto400,
  noQs400,
  tooMany400,
  cantAct400,
  sleepSync,
  ErrorObject
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
  for (const session of getData().quizSessions) {
    if (session.state !== SessionState.END) numSessions++;
  }
  if (numSessions >= 10) throw HTTPError(400, tooMany400);

  // Error 400: The quiz does not have any questions in it
  if (!quiz.questions.length) throw HTTPError(400, noQs400);

  // Otherwise, start the session and generate a random sessionId
  const sessionId = getUniqueID(getData());

  // This copies the quiz, so that any edits whilst a session is running does
  // not affect active session
  getData().quizSessions.push({
    sessionId: sessionId,
    state: SessionState.LOBBY,
    atQuestion: 1,
    quiz: quiz,
    players: [],
    messages: []
  });

  // Return sessionId object
  return { sessionId: sessionId };
}

/** adminQuizSessionUpdate
  * Update the state of a particular session by sending an action command
  *
  * @param { number } token - The token of the user starting the session
  * @param { number } quizId - The quizId of the quiz that's being started
  * @param { number } sessionId - The session id of an active session within the quiz
  * @param { string } action - Action enum to change the state
  *
  * @returns { Record<string, never>  } - If the details given are valid
  * @returns { ErrorObject } - If the details given are invalid
  */
export function adminQuizSessionUpdate(quizId: number, sessionId: number,
  token: number, action: string): ErrorObject | Record<string, never> {
  // Error 401 : Checking if user exists
  const user = getUser(token, getData());
  if (!user) throw HTTPError(401, token401);

  // Error 403 : Check if quizId is valid
  const quiz = getQuiz(quizId, getData().quizzes);
  if (!quiz || quiz.authId !== user.authUserId) {
    throw HTTPError(403, unauth403);
  }

  // Loop through the quiz to find valid active session
  // Error 400 : Invalid or unactive session id
  const session = getQuizSession(sessionId, getData().quizSessions);
  if (!session || session.sessionId !== quiz.sessionId) {
    throw HTTPError(400, unactive400);
  }

  // Update the session state based on the action given
  if (action === SessionState.END) {
    session.state = SessionState.END;
    return { };
  } else if (action === SessionState.NEXT_QUESTION) {
    if (session.state === SessionState.LOBBY ||
        session.state === SessionState.QUESTION_CLOSE ||
        session.state === SessionState.ANSWER_SHOW) { 
        session.state = SessionState.QUESTION_COUNTDOWN; 
        return { };
    } 
  } else if (action === SessionState.SKIP_COUNTDOWN) {
    if (session.state === SessionState.QUESTION_COUNTDOWN) {
      session.state = SessionState.QUESTION_OPEN;
      sleepSync(quiz.questions[session.atQuestion - 1].duration * 1000);
      session.state = SessionState.QUESTION_CLOSE;
      return { };
    }
  } else if (session.state === SessionState.QUESTION_COUNTDOWN) {
    // Wait for 3 seconds
    sleepSync(3000);
    session.state = SessionState.QUESTION_OPEN;
    sleepSync(quiz.questions[session.atQuestion - 1].duration * 1000);
    session.state = SessionState.QUESTION_CLOSE;
    return { };

    // End duration when the question opened???
  } else if (action === SessionState.GO_TO_ANSWER) {
    if (session.state === SessionState.QUESTION_OPEN ||
    session.state === SessionState.QUESTION_CLOSE) {
      session.state = SessionState.ANSWER_SHOW;
      return { };
    }
  } else if (action === SessionState.GO_TO_FINAL_RESULTS) {
    if (session.state === SessionState.QUESTION_CLOSE ||
    session.state === SessionState.ANSWER_SHOW) {
      session.state = SessionState.FINAL_RESULTS;
      return { };
    }
  }
  
  throw HTTPError(400, cantAct400);
}
