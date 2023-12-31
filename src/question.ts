import {
  ErrorObject,
  Answer,
  Question,
  QuestionId,
  QuestionBody,
  getData,
  setData,
  getUniqueID,
  getUser,
  getQuiz,
  unauth403,
  token401,
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
  invImg400
} from './dataStore';

import HTTPError from 'http-errors';

const COLOUR = ['red', 'blue', 'green', 'yellow', 'purple', 'brown', 'orange'];

/** validQuestionBody
  * Checks if a question body is valid
  *
  * @param { QuestionBody } questionBody - The question
  *
  * @returns { boolean } - If the token and the inputs is valid
  */
function validQuestionBody(questionBody: QuestionBody):
  ErrorObject {
  // Question is not within 5 and 50 characters in length
  if (questionBody.question.length < 5 || questionBody.question.length > 50) {
    return { error: quesLen400 };
  }

  // The question has more than 6 answers or less than 2 answers
  if (questionBody.answers.length < 2 || questionBody.answers.length > 6) {
    return { error: ansNum400 };
  }

  // The question duration is not a positive number
  if (questionBody.duration <= 0) return { error: quesDur400 };

  // The points awarded for the question are less than 1 or greater than 10
  if (questionBody.points < 1 || questionBody.points > 10) {
    return { error: quesPoints400 };
  }

  // The length of any answer is shorter than 1 character long, or longer than
  // 30 characters long
  // There are no correct answers
  let correct = false;
  for (const answer of questionBody.answers) {
    if (answer.correct === true) correct = true;
    if (answer.answer.length < 1 || answer.answer.length > 30) {
      return { error: ansLen400 };
    }
  }
  if (!correct) return { error: ansInc400 };

  // Any answer strings are duplicates of one another (within the same question)
  for (let i = 0; i < questionBody.answers.length; i++) {
    const isEqual = (an: Answer) => an.answer === questionBody.answers[i].answer;
    const firstInstance = questionBody.answers.findIndex(isEqual);
    if (firstInstance !== i) return { error: ansDup400 };
  }

  // Image url format is incorrect
  if (questionBody.thumbnailUrl) {
    // thumbnailUrl will not be empty if it is v2, as the server will set it to
    // 'Invalid' so that this function works for both v1 and v2 calls

    // Should start with 'https://'/'http://' and end with 'jpg'/'jpeg'/'png'
    if ((!questionBody.thumbnailUrl.startsWith('https://') &&
        !questionBody.thumbnailUrl.startsWith('http://')) ||
        (!questionBody.thumbnailUrl.endsWith('png') &&
        !questionBody.thumbnailUrl.endsWith('jpg') &&
        !questionBody.thumbnailUrl.endsWith('jpeg'))) {
      return { error: invImg400 };
    }
  }

  // This will mean that no errors occur
  return { error: '' };
}

/** adminQuestionCreate
  * Create a question for a given quiz
  *
  * @param { number } token - The token for the suer session
  * @param { number } quizId - The id for the quiz
  * @param { QuestionBody } questionBody - The question
  *
  * @returns { QuestionId } - If the token and the inputs is valid
  * @returns { ErrorObject } - If the token or the inputs is invalid
  */
export function adminQuestionCreate(token: number, quizId: number,
  questionBody: QuestionBody): QuestionId | ErrorObject {
  const data = getData();

  // Checking if the user exists
  const user = getUser(token, data);
  if (!user) throw HTTPError(401, token401);

  // Checking if user owns the quiz
  const quiz = getQuiz(quizId, data.quizzes);
  if (!quiz) throw HTTPError(403, unauth403);
  if (quiz.authId !== user.authUserId) throw HTTPError(403, unauth403);

  // Checking the question body is valid
  const valid = validQuestionBody(questionBody);
  if (valid.error) throw HTTPError(400, valid.error);

  // Ensuring the duration is valid
  let durationSum = questionBody.duration;
  for (const ques of quiz.questions) durationSum += ques.duration;
  if (durationSum > 180) throw HTTPError(400, quizDur400);

  // Creating answers
  const answers: Answer[] = [];
  for (const answer of questionBody.answers) {
    const answerId = getUniqueID(data);
    const randomInt = Math.floor(Math.random() * 7);
    answers.push({
      answerId: answerId,
      answer: answer.answer,
      colour: COLOUR[randomInt],
      correct: answer.correct
    });
  }

  // Generating an ID
  const questionId = getUniqueID(data);

  // Creating the question to push
  const newQuestion: Question = {
    questionId: questionId,
    question: questionBody.question,
    duration: questionBody.duration,
    points: questionBody.points,
    answers: answers,
    thumbnailUrl: questionBody.thumbnailUrl
  };

  // Updating the time editted
  const timestamp = Math.floor(Date.now() / 1000);
  quiz.timeLastEdited = timestamp;

  // Pushing to data
  quiz.questions.push(newQuestion);
  setData(data);

  // Returning questionId
  return { questionId: questionId };
}

/** adminQuestionMove
  * Move the given quiz question to a new position
  *
  * @param { number } token - The authUserId for the user
  * @param { number } newPosition - The new position of the moved question
  * @param { number } quizId - The quizId contain moved question
  * @param { number } quesId - The quesId of the question being moved
  *
  * @returns {} - If the question exists and is successfully moved
  * @returns { ErrorObject } - If any input error exists
  */
export function adminQuestionMove(token: number, newPosition: number,
  quesId: number, quizId: number): Record<string, never> {
  // Get data from database
  const quiz = getQuiz(quizId, getData().quizzes);
  if (!quiz) throw HTTPError(403, unauth403);

  // Ensuring the user owns the quiz
  const user = getUser(token, getData());
  if (!user) throw HTTPError(401, token401);
  if (user.authUserId !== quiz.authId) throw HTTPError(403, unauth403);

  // Get the question asked for moving
  let currQues: Question;
  let currPos: number;
  for (const question of quiz.questions) {
    if (question.questionId === quesId) {
      currQues = question;
      currPos = quiz.questions.indexOf(currQues);
    }
  }

  // Error check
  if (!currQues) throw HTTPError(400, quesID400);
  if (newPosition < 0 || newPosition > quiz.questions.length ||
      newPosition === currPos) throw HTTPError(400, quesPos400);

  // Get the question at the new position
  const swithedQues = quiz.questions[newPosition];

  // Switch the position of two questions
  quiz.questions[currPos] = swithedQues;
  quiz.questions[newPosition] = currQues;

  // Update time last edit
  quiz.timeLastEdited = Math.floor(Date.now() / 1000);

  // Successful movement, return { }
  return { };
}

/** updateQuestion
  * Updates the given question with new values
  *
  * @param { number } token - The authUserId for the user
  * @param { number } quizId - The quizId contain moved question
  * @param { number } quesId - The quesId of the question being moved
  * @param { Question } questionBody - The new details of the question
  *
  * @returns { Record<string, never> } - If the question is successfully updated
  * @returns { ErrorObject } - If any input error exists
  */
export function updateQuestion(token: number, quizId: number, quesId: number,
  questionBody: Question): ErrorObject | Record<string, never> {
  // Error Checking
  // Check if the user is valid
  const user = getUser(token, getData());
  if (!user) throw HTTPError(401, token401);

  // Check if the quiz exists
  const quiz = getQuiz(quizId, getData().quizzes);
  if (!quiz) throw HTTPError(403, unauth403);

  // Checking that the user owns the quiz
  if (quiz.authId !== user.authUserId) throw HTTPError(403, unauth403);

  // Check if the question exists within the quiz
  let question: Question;
  for (const ques of quiz.questions) {
    if (ques.questionId === quesId) question = ques;
  }
  if (!question) throw HTTPError(400, quesID400);

  const valid = validQuestionBody(questionBody);
  if (valid.error) throw HTTPError(400, valid.error);

  // Sum of the question durations in the quiz exceeds 3 minutes
  let durationSum = questionBody.duration;
  for (const ques of quiz.questions) {
    if (ques.questionId !== quesId) durationSum += ques.duration;
  }
  if (durationSum > 180) throw HTTPError(400, quizDur400);

  // No errors occur, so update the question
  question.question = questionBody.question;
  question.duration = questionBody.duration;
  question.points = questionBody.points;
  question.answers = questionBody.answers;
  question.thumbnailUrl = questionBody.thumbnailUrl;

  // Update the last edited time for the quiz
  quiz.timeLastEdited = Math.floor(Date.now() / 1000);

  return { };
}

/** deleteQuestion
  * Deletes the question from the quiz
  *
  * @param { number } token - The authUserId for the user
  * @param { number } quizId - The quizId contain moved question
  * @param { number } quesId - The quesId of the question being moved
  *
  * @returns { Record<string, never> } - If the question is successfully deleted
  * @returns { ErrorObject } - If any input error exists
  */
export function deleteQuestion(token: number, quizId: number, quesId: number):
  ErrorObject | Record<string, never> {
  // Error Checking
  // Check if the user is valid
  const user = getUser(token, getData());
  if (!user) throw HTTPError(401, token401);

  // Check if the quiz exists
  const quiz = getQuiz(quizId, getData().quizzes);
  if (!quiz) throw HTTPError(403, unauth403);

  // Checking that the user owns the quiz
  if (quiz.authId !== user.authUserId) throw HTTPError(403, unauth403);

  // Check if the question exists within the quiz
  for (const ques of quiz.questions) {
    if (ques.questionId === quesId) {
      quiz.questions.splice(quiz.questions.indexOf(ques), 1);
      return { };
    }
  }

  throw HTTPError(400, quesID400);
}

/** adminQuesDup
  * Duplicate the given quiz question
  *
  * @param { number } token - The authUserId for the user
  * @param { number } quizId - The quizId contain moved question
  * @param { number } quesId - The quesId of the question being moved
  *
  * @returns { newQuestionId } - If the question is successfully duplicated
  * @returns { ErrorObject } - If any input error exists
  */
export function adminQuestionDuplicate(token: number, quesId: number,
  quizId: number): QuestionId {
  // Get data from database, ensure the quiz exists
  const quiz = getQuiz(quizId, getData().quizzes);
  if (!quiz) throw HTTPError(403, unauth403);

  // Ensuring the user exists with a valid token
  const user = getUser(token, getData());
  if (!user) throw HTTPError(401, token401);

  // Ensuring the user owns the quiz
  if (user.authUserId !== quiz.authId) throw HTTPError(403, unauth403);

  // Get the question asked for moving, esnuring it exists
  let currQues: Question;
  for (const question of quiz.questions) {
    if (question.questionId === quesId) currQues = question;
  }
  if (!currQues) throw HTTPError(400, quesID400);

  // Checking duration remains valid after duplication
  let durationSum = currQues.duration;
  for (const ques of quiz.questions) {
    durationSum += ques.duration;
  }
  if (durationSum > 180) throw HTTPError(400, quizDur400);

  // Adding the new question to the list of questions
  const newId = getUniqueID(getData());
  quiz.questions.push({
    questionId: newId,
    question: currQues.question,
    duration: currQues.duration,
    points: currQues.points,
    answers: currQues.answers,
    thumbnailUrl: currQues.thumbnailUrl
  });

  // Update time last edit
  quiz.timeLastEdited = Math.floor(Date.now() / 1000);

  // Return newQuestionId
  return { questionId: newId };
}
