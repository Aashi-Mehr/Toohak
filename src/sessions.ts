// import HTTPError from 'http-errors';
import { QuizSessionId } from './dataStore';

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
  // Error 403: Valid token is provided, but user is not an owner of this quiz
  // Error 401: Token is empty or invalid
  // Error 400: autoStartNum is a number greater than 50
  // Error 400: A maximum of 10 sessions not in END state currently exist
  // Error 400: The quiz does not have any questions in it

  // Otherwise, start the session and generate a random sessionId
  return { sessionId: 0 };
}
