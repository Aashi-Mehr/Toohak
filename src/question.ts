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
} from './dataStore';

const COLOUR = ['red', 'blue', 'green', 'yellow', 'purple', 'brown', 'orange'];

/** adminQuestionCreate
  * Create a question for a given quiz
  *
  * @param { number } token - The token for the suer session
  * @param { number } quizId - The id for the quiz
  * @param { number } questionBody - The question
  *
  * @returns { QuestionId } - If the token and the inputs is valid
  * @returns { ErrorObject } - If the token or the inputs is invalid
  */
export function adminQuestionCreate(token: number, quizId: number,
  questionBody: QuestionBody): QuestionId | ErrorObject {
  const data = getData();

  // Checking if the user exists
  const user = getUser(token, data);
  if (!user) {
    return {
      error: 'Token is empty or invalid (does not refer to ' +
    'valid logged in user session)'
    };
  }

  const quiz = getQuiz(quizId, data.quizzes);
  if (!quiz) return { error: 'Quiz is not owned by user' };

  if (quiz.authId !== user.authUserId) {
    return {
      error: 'Valid token is ' +
    'provided, but user is not an owner of this quiz'
    };
  }

  if (questionBody.question.length < 5 || questionBody.question.length > 50) {
    return {
      error: 'Question string is less than 5 characters in length or ' +
      'greater than 50 characters in length'
    };
  } else if (questionBody.answers.length < 2 ||
             questionBody.answers.length > 6) {
    return { error: 'The question has more than 6 or less than 2 answers' };
  } else if (questionBody.duration < 0) {
    return { error: 'The question duration is not a positive number' };
  }
  let duration = 0;
  for (const question of quiz.questions) {
    duration += question.duration;
  }
  duration += questionBody.duration;
  if (duration > 180) {
    return {
      error: 'The sum of the question durations in the quiz exceeds ' +
      '3 minutes'
    };
  }
  if (questionBody.points < 1 || questionBody.points > 10) {
    return {
      error: 'The points awarded for the question are less than 1 or ' +
      'greater than 10'
    };
  }
  const existedAnswers: string[] = [];
  for (const answer of questionBody.answers) {
    if (answer.answer.length < 1 || answer.answer.length > 30) {
      return {
        error: 'The length of any answer is shorter than 1 character ' +
        'long, or longer than 30 characters long'
      };
    } else if (existedAnswers.includes(answer.answer)) {
      return {
        error: 'Any answer strings are duplicates of one another ' +
        '(within the same question)'
      };
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
    question: questionBody.question,
    duration: questionBody.duration,
    points: questionBody.points,
    answers: answers,
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
  if (!quiz) return { error: 'Quiz ID is invalid' };

  const user = getUser(token, getData());
  if (!user) {
    return {
      error: 'Token is empty or invalid (does not refer to valid logged in ' +
             'user session)'
    };
  }

  if (user.authUserId !== quiz.authId) {
    return {
      error: 'Valid token is provided, but user is not an owner of this quiz'
    };
  }

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
  if (!currQues) return { error: 'Ques ID is invalid' };
  if (newPosition < 0 || newPosition > quiz.questions.length) {
    return { error: 'New Postion is invalid' };
  }

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
  if (!user) {
    return {
      error: 'Token is empty or invalid (does not refer to ' +
             'valid logged in user session)'
    };
  }

  // Check if the quiz exists
  const quiz = getQuiz(quizId, getData().quizzes);
  if (!quiz) return { error: 'Invalid quiz ID' };

  // Checking that the user owns the quiz
  if (quiz.authId !== user.authUserId) {
    return {
      error: 'Valid token is provided, but user is unauthorised'
    };
  }

  // Check if the question exists within the quiz
  let question: Question;
  for (const ques of quiz.questions) {
    if (ques.questionId === quesId) question = ques;
  }
  if (!question) return { error: 'Question Id is invalid within this quiz' };

  // Question is not within 5 and 50 characters in length
  if (questionBody.question.length < 5 || questionBody.question.length > 50) {
    return { error: 'Invalid question length' };
  }

  // The question has more than 6 answers or less than 2 answers
  if (questionBody.answers.length < 2 || questionBody.answers.length > 6) {
    return { error: 'Invalid number of answers' };
  }

  // The question duration is not a positive number
  if (questionBody.duration <= 0) {
    return { error: 'The question duration is not a positive number' };
  }

  // Sum of the question durations in the quiz exceeds 3 minutes
  let durationSum = questionBody.duration;
  for (const ques of quiz.questions) {
    if (ques.questionId !== quesId) durationSum += ques.duration;
  }
  if (durationSum > 180) return { error: 'The total duration is too long' };

  // The points awarded for the question are less than 1 or greater than 10
  if (questionBody.points < 1 || questionBody.points > 10) {
    return { error: 'Points are invalid' };
  }

  // The length of any answer is shorter than 1 character long, or longer than
  // 30 characters long
  // There are no correct answers
  let correct = false;
  for (const answer of questionBody.answers) {
    if (answer.correct === true) correct = true;
    if (answer.answer.length < 1 || answer.answer.length > 30) {
      return { error: 'Answers are too long/short' };
    }
  }
  if (!correct) return { error: 'No correct answer' };

  // Any answer strings are duplicates of one another (within the same question)
  for (let i = 0; i < questionBody.answers.length; i++) {
    const isEqual = (an: Answer) => an.answer === questionBody.answers[i].answer;
    const firstInstance = questionBody.answers.findIndex(isEqual);
    if (firstInstance !== i) return { error: 'Answers are duplicated' };
  }

  // No errors occur, so update the question
  question.question = questionBody.question;
  question.duration = questionBody.duration;
  question.points = questionBody.points;
  question.answers = questionBody.answers;

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
  if (!user) {
    return {
      error: 'Token is empty or invalid (does not refer to ' +
             'valid logged in user session)'
    };
  }

  // Check if the quiz exists
  const quiz = getQuiz(quizId, getData().quizzes);
  if (!quiz) return { error: 'Invalid quiz ID' };

  // Checking that the user owns the quiz
  if (quiz.authId !== user.authUserId) {
    return {
      error: 'Valid token is provided, but user is unauthorised'
    };
  }

  // Check if the question exists within the quiz
  for (const ques of quiz.questions) {
    if (ques.questionId === quesId) {
      quiz.questions.splice(quiz.questions.indexOf(ques), 1);
      return { };
    }
  }

  return { error: 'Question Id is invalid within this quiz' };
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
  quizId: number): QuestionId | ErrorObject {
  // Get data from database, ensure the quiz exists
  const quiz = getQuiz(quizId, getData().quizzes);
  if (!quiz) return { error: 'Quiz ID is invalid' };

  // Ensuring the user exists with a valid token
  const user = getUser(token, getData());
  if (!user) {
    return {
      error: 'Token is empty or invalid (does not refer to valid logged in ' +
             'user session)'
    };
  }

  // Ensuring the user owns the quiz
  if (user.authUserId !== quiz.authId) {
    return {
      error: 'Valid token is provided, but user is not an owner of this quiz'
    };
  }

  // Get the question asked for moving, esnuring it exists
  let currQues: Question;
  for (const question of quiz.questions) {
    if (question.questionId === quesId) currQues = question;
  }
  if (!currQues) return { error: 'Ques ID is invalid' };

  const newId = getUniqueID(getData());
  quiz.questions.push({
    questionId: newId,
    question: currQues.question,
    duration: currQues.duration,
    points: currQues.points,
    answers: currQues.answers
  });

  // Update time last edit
  quiz.timeLastEdited = Math.floor(Date.now() / 1000);

  // Return newQuestionId
  return { questionId: newId };
}
