import HTTPError from 'http-errors';
import {
  QuizSessionId,
  SessionState,
  auto400,
  getData,
  getQuiz,
  getUniqueID,
  getUser,
  noQs400,
  token401,
  tooMany400,
  unauth403,
  getSession,
  unactive400,
  inval400,
  cantAct400,
  sessionStatus,
  getQuizSession
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

/** quizGetSession
  * Get the status of a particular quiz session
  *
  * @param { number } token - The token of the user starting the session
  * @param { number } quizId - The quizId of the quiz that's being started
  * @param { number } sessionId - The session id of an active session within the quiz
  *
  * @returns { Record<string, never>  } - If the details given are valid
  * @returns { ErrorObject } - If the details given are invalid
  */
export function quizGetSession(quizId: number, sessionId: number, token: number):
sessionStatus {
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
  // const session = getQuizSession(sessionId, getData().quizSessions);
  // if (!session || session.quiz.quizId !== quizId || session.state === SessionState.END) {
  //   throw HTTPError(400, unactive400);
  // }
  const session = getQuizSession(sessionId, getData().quizSessions);
  if (!session || !session.quiz || session.quiz.quizId !== quizId || session.state === SessionState.END) {
    throw HTTPError(400, unactive400);
  }

  // get player names in session
  const playersInSession: string[] = [];
  // Add players to the array
  for (const player of session.players) {
    playersInSession.push(player.name);
  }

  // get questions in the quiz
  const quizQuest: string[] = [];
  for (const questionInQuiz of session.quiz.questions) {
    quizQuest.push(questionInQuiz);
  }

  // const quizAns: string;
  // for (const questionAnswers of quiz.questions.answers) {
  //   quizAnswer = questionAnswers;
  // }

  // Calculating the duration of the quiz
  let duration = 0;
  for (const question of quizQuest) {
    duration += question.duration;
  }

  return {
    state: session.state,
    atQuestion: 3,
    players: playersInSession,
    metadata: {
      quizId: quizId,
      name: quiz.name,
      timeCreated: quiz.timeCreated,
      timeLastEdited: quiz.timeLastEdited,
      description: quiz.description,
      numQuestions: quiz.questions.length,
      questions: [
        {
          questionId: quiz.questions.quiestionId,
          question: quiz.questions.question,
          duration: quiz.questions.duration,
          thumbnailUrl: quiz.questions.thumbnailUrl,
          points: quiz.questions.points,
          answers: [
            {
              // answerId: quiz.questions.question.answers.answerId,
              // answer: quiz.questions.question.answers.answer,
              // colour: quiz.questions.question.answers.colour,
              // correct: quiz.questions.question.answers.correct
              answerId: quiz.questions.question.quizAnswer.answerId,
              answer: quiz.questions.question.quizAnswer.answer,
              colour: quiz.questions.question.quizAnswer.colour,
              correct: quiz.questions.question.quizAnswer.correct
            }
          ]
        }
      ],
      duration: duration,
      thumbnailUrl: quiz.thumbnailUrl
    }
  };
}
