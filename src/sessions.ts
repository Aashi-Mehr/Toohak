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
    messages: [],
    timers: []
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
  action = action.toUpperCase();

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
  if (!session ||
      session.quiz.quizId !== quizId ||
      session.state === SessionState.END) {
    throw HTTPError(400, unactive400);
  }

  // Update the session state based on the action given
  if (action === 'END') {
    // Action : End - Change session state to end
    session.state = SessionState.END;
    return { };
  } else if (action === 'NEXT_QUESTION') {
    // Action : next_question

    // player must be in lobby, question close or answer show
    if (session.state === SessionState.LOBBY ||
        session.state === SessionState.QUESTION_CLOSE ||
        session.state === SessionState.ANSWER_SHOW) {
      // change session state to question countdown
      session.state = SessionState.QUESTION_COUNTDOWN;

      // Set a 3 second timer which will move to question_open
      const countdownTimer = setTimeout(() => {
        adminQuizSessionUpdate(quizId, sessionId, token, 'SKIP_COUNTDOWN');
      }, 3000);

      // Add that to timers
      session.timers.push(countdownTimer);

      return { };
    }
  } else if (action === 'SKIP_COUNTDOWN') {
    // Action : skip_countdown

    // player must be in question countdown
    if (session.state === SessionState.QUESTION_COUNTDOWN) {
      // Remove timers
      while (session.timers.length > 0) {
        clearTimeout(session.timers[0]);
        session.timers.splice(0, 1);
      }

      // Switch state to QUESTION_OPEN
      session.state = SessionState.QUESTION_OPEN;

      // At question open, a timer to get to question_close starts
      const duration = quiz.questions[session.atQuestion - 1].duration;
      const openTimer = setTimeout(() => {
        session.state = SessionState.QUESTION_CLOSE;

        // Remove timers
        while (session.timers.length > 0) {
          clearTimeout(session.timers[0]);
          session.timers.splice(0, 1);
        }
      }, duration * 1000);

      // Add that to timers
      session.timers.push(openTimer);

      return { };
    }
  } else if (action === 'GO_TO_ANSWER') {
    // Action : go_to_answer

    // Player must be in question_open or question_close
    if (session.state === SessionState.QUESTION_OPEN ||
        session.state === SessionState.QUESTION_CLOSE) {
      // Remove timers, as question no longer needs to close
      while (session.timers.length > 0) {
        clearTimeout(session.timers[0]);
        session.timers.splice(0, 1);
      }

      // change player state to answer_show
      session.state = SessionState.ANSWER_SHOW;
      return { };
    }
  } else if (action === 'GO_TO_FINAL_RESULTS') {
    // Action : go_to_final_results

    // Player must be in question_close or answer_show
    if (session.state === SessionState.QUESTION_CLOSE ||
        session.state === SessionState.ANSWER_SHOW) {
      // change player state to final_results
      session.state = SessionState.FINAL_RESULTS;

      return { };
    }
  }

  throw HTTPError(400, cantAct400);
}
