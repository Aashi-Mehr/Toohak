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
  getSession
} from './dataStore';

const COLOUR = ['red', 'blue', 'green', 'yellow', 'purple', 'brown', 'orange'];

/** adminQuestionCreate
  * Create a question for a given quiz
  *
  * @param { number } questionId - The id for the question
  *
  * @returns { QuestionId } - If the token and the inputs is valid
  * @returns { ErrorObject } - If the token or the inputs is invalid
  */
export function adminQuestionCreate(token: number, quizId: number, questionBody: QuestionBody): QuestionId | ErrorObject {
  const data = getData();
  // Checking if the user exists
  const user = getUser(token, data);
  if (!user) return { error: 'Invalid user ID' };

  const quiz = getQuiz(quizId, data.quizzes);
  if (!quiz) return { error: 'Quiz is not owned by user' };

  if (quiz.authId !== user.authUserId) return { error: 'Quiz is not owned by user' };

  if (questionBody.question.length < 5 || questionBody.question.length > 50) {
    return { error: 'Question string is less than 5 characters in length or greater than 50 characters in length' };
  } else if (questionBody.answers.length < 2 || questionBody.answers.length > 6) {
    return { error: 'The question has more than 6 answers or less than 2 answers' };
  } else if (questionBody.duration < 0) {
    return { error: 'The question duration is not a positive number' };
  }
  let duration = 0;
  for (const question of quiz.questions) {
    duration += question.duration;
  }
  duration += questionBody.duration;
  if (duration > 180) {
    return { error: 'The sum of the question durations in the quiz exceeds 3 minutes' };
  }
  if (questionBody.points < 1 || questionBody.points > 10) {
    return { error: 'The points awarded for the question are less than 1 or greater than 10' };
  }
  const existedAnswers: string[] = [];
  for (const answer of questionBody.answers) {
    if (answer.answer.length < 1 || answer.answer.length > 30) {
      return { error: 'The length of any answer is shorter than 1 character long, or longer than 30 characters long' };
    } else if (existedAnswers.includes(answer.answer)) {
      return { error: 'Any answer strings are duplicates of one another (within the same question)' };
    }
    existedAnswers.push(answer.answer);
  }
  if (!questionBody.answers.some(answer => answer.correct === true)) {
    return { error: 'There are no correct answers' };
  }

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

  const questionId = getUniqueID(data);

  const newQuestion: Question = {
    questionId: questionId,
    position: quiz.questions.length,
    question: questionBody.question,
    duration: questionBody.duration,
    points: questionBody.points,
    answer: answers,
  };

  const timestamp = Math.floor(Date.now() / 1000);
  quiz.timeLastEdited = timestamp;

  quiz.questions.push(newQuestion);

  setData(data);

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
  quesId: number, quizId: number): ErrorObject | Record<string, never> {
  // Get data from database
  const quiz = getQuiz(quizId, getData().quizzes);
  const user = getSession(token, getData().sessions);

  // Get the question asked for moving
  let currQues;
  let findQues = false;
  for (const question of quiz.questions) {
    if (question.questionId === quesId) {
      findQues = true;
      currQues = question;
    }
  }

  // Error check
  if (!quiz) return { error: 'Quiz ID is invalid' };
  if (findQues === false) return { error: 'Ques ID is invalid' };
  if (newPosition < 0 || newPosition > quiz.questions.length) { return { error: 'New Postion is invalid' }; }
  if (token === undefined) return { error: 'Token Empty' };
  if (quiz.authId !== token) { return { error: 'Does not match the given quiz' }; }
  if (user.is_valid === false) return { error: 'Token is not valid' };

  // Get the question at the new position
  let swithedQues;
  for (const question of quiz.questions) {
    if (question.position === newPosition) {
      swithedQues = question;
    }
  }

  // Switch the position of two questions
  const tempPos = currQues.position;
  currQues.position = newPosition;
  swithedQues.position = tempPos;

  // Update time last edit
  quiz.timeLastEdited = Math.floor(Date.now() / 1000);

  // Successful movement, return {}
  return {};
}

/** adminQuesDup
  * Duplicate the given quiz question
  *
  * @param { number } token - The authUserId for the user
  * @param { number } quizId - The quizId contain moved question
  * @param { number } quesId - The quesId of the question being moved
  *
  * @returns { newQuestionId } - If the question exists and is successfully duplicated
  * @returns { ErrorObject } - If any input error exists
  */
export function adminQuestionDuplicate(token: number, quesId: number,
  quizId: number): QuestionId | ErrorObject {
  // Get data from database
  const data = getData();
  const quiz = getQuiz(quizId, getData().quizzes);
  const user = getSession(token, getData().sessions);

  // Get the question asked for duplicating
  let currQues;
  let findQues = false;
  for (const question of quiz.questions) {
    if (question.questionId === quesId) {
      findQues = true;
      currQues = question;
    }
  }

  // Error check
  if (!quiz) return { error: 'Quiz ID is invalid' };
  if (findQues === false) return { error: 'Ques ID is invalid' };
  if (token === undefined) return { error: 'Token empty' };
  if (quiz.authId !== token) { return { error: 'Does not match the given quiz' }; }
  if (user.is_valid === false) return { error: 'Token is not valid' };

  // Calculate the duplicated question position
  const newQuesPos = currQues.position + 1;

  // Move all questions that is after the current question right once
  for (const question of quiz.questions) {
    if (question.position > currQues.position) {
      question.position++;
    }
  }

  // Create a new question using the newQuesPosition
  // Put the newQuestion after the immidiate question
  const newQuestionId = getUniqueID(data);
  const newQuestion: Question = {
    questionId: newQuestionId,
    position: newQuesPos,
    question: currQues.question,
    duration: currQues.duration,
    points: currQues.points,
    answer: currQues.answer,
  };

  // Push newQuestion into data base
  quiz.questions.push(newQuestion);

  // Update time last edit
  quiz.timeLastEdited = Math.floor(Date.now() / 1000);

  // Return newQuestionId
  return { questionId: newQuestionId };
}
