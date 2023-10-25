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
  getQuiz
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
