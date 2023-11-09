import {
  AnswerBody,
  ErrorObject,
  QuestionBody
} from '../dataStore';

import {
  requestClear,
  requestQuesDelete,
  requestQuesDup,
  requestQuesMove,
  requestQuesUpdate,
  requestQuestionCreate,
  requestQuizCreate,
  requestQuizInfo,
  requestQuizTransfer,
  requestRegister
} from './testHelper';

/** questionBody
  * Returns a questionBody object with given values
  *
  * @param { number } question - Optional question
  * @param { number } duration - Optional question duration
  * @param { number } points - Optional question points
  * @param { Question } answers - Optional questions answers
  *
  * @returns { QuestionBody } - All cases
  */
function questionBody(question?: string, duration?: number, points?: number,
  answers?: AnswerBody[]): QuestionBody {
  return {
    question: question || 'What is the second letter of the alphabet?',
    duration: duration || 10,
    points: points || 5,
    answers: answers || [{
      answer: 'a',
      correct: true
    },
    {
      answer: 'b',
      correct: false
    }]
  };
}

const shortQ = 'Wha?';
const longQ = 'What is the first letter of the alphabettttttttttttttttttttttt?';
const shortAnswers = [{ answer: 'b', correct: true }];
const longAnswers = [
  { answer: 'b', correct: true },
  { answer: 'a', correct: false },
  { answer: 'c', correct: false },
  { answer: 'd', correct: false },
  { answer: 'e', correct: false },
  { answer: 'f', correct: false },
  { answer: 'g', correct: false }
];

const initialQ = questionBody('What is the first letter of the alphabet?');
const finalQ = questionBody(undefined, 15, 10, [{ answer: 'b', correct: true },
  { answer: 'a', correct: false }]);

let token1: number;
let quizId1: number;
let questionId1: number;
let result: ErrorObject | Record<string, never>;

beforeEach(() => {
  // Clearing any previous data
  requestClear();

  // Defining base data to be manipulated in the tests (Updated/Deleted)
  token1 = requestRegister('am@gmail.com', 'Vl1dPass', 'fir', 'las').token;
  quizId1 = requestQuizCreate(token1, 'New Quiz 1', '').quizId;
  questionId1 = requestQuestionCreate(token1, quizId1, initialQ).questionId;
});

describe('adminQuizQuestionUpdate', () => {
  // Error Checking

  test('QuestionId does not refer to a valid question', () => {
    // QuestionId does not refer to a valid question
    result = requestQuesUpdate(token1, quizId1, questionId1 + 1, finalQ);
    expect(result).toMatchObject({ error: expect.any(String) });
  });

  test('QuestionId does not refer to a valid question in this quiz', () => {
    // QuestionId does not refer to a valid question in this quiz
    const quizId2 = requestQuizCreate(token1, 'New Quiz 2', '').quizId;
    const questionId2 = requestQuestionCreate(token1, quizId2, finalQ).questionId;

    result = requestQuesUpdate(token1, quizId1, questionId2, initialQ);
    expect(result).toMatchObject({ error: expect.any(String) });
  });

  test('QuestionId is out of the valid range', () => {
    // QuestionId is out of the valid range
    result = requestQuesUpdate(token1, quizId1, 0, finalQ);
    expect(result).toMatchObject({ error: expect.any(String) });
  });

  test('Question string is less than 5 characters in length', () => {
    // Question string is less than 5 characters in length
    result = requestQuesUpdate(
      token1,
      quizId1,
      questionId1,
      questionBody(shortQ)
    );
    expect(result).toMatchObject({ error: expect.any(String) });
  });

  test('Question string is greater than 50 characters in length', () => {
    // Question string is greater than 50 characters in length
    result = requestQuesUpdate(
      token1,
      quizId1,
      questionId1,
      questionBody(longQ)
    );
    expect(result).toMatchObject({ error: expect.any(String) });
  });

  test('The question has more than 6 answers', () => {
    // The question has more than 6 answers
    result = requestQuesUpdate(token1, quizId1, questionId1, questionBody(
      undefined,
      undefined,
      undefined,
      longAnswers
    ));
    expect(result).toMatchObject({ error: expect.any(String) });
  });

  test('The question has less than 2 answers', () => {
    // The question has less than 2 answers
    result = requestQuesUpdate(token1, quizId1, questionId1, questionBody(
      undefined,
      undefined,
      undefined,
      shortAnswers
    ));
    expect(result).toMatchObject({ error: expect.any(String) });
  });

  test('The question duration is not a positive number', () => {
    // The question duration is not a positive number
    result = requestQuesUpdate(token1, quizId1, questionId1, questionBody(
      undefined, -1
    ));
    expect(result).toMatchObject({ error: expect.any(String) });
  });

  test('1 question duration is larger than 3 minutes', () => {
    // 1 question duration is larger than 3 minutes
    result = requestQuesUpdate(token1, quizId1, questionId1, questionBody(
      undefined, 181
    ));
    expect(result).toMatchObject({ error: expect.any(String) });
  });

  test('The question duration is lerger than 3 minutes', () => {
    // The question duration is lerger than 3 minutes
    const q2 = questionBody('Question 2', 30);
    const q3 = questionBody('Question 3', 30);
    const q4 = questionBody('Question 4', 30);
    const q5 = questionBody('Question 5', 30);
    const q6 = questionBody('Question 6', 30);

    requestQuestionCreate(token1, quizId1, q2);
    requestQuestionCreate(token1, quizId1, q3);
    requestQuestionCreate(token1, quizId1, q4);
    requestQuestionCreate(token1, quizId1, q5);
    requestQuestionCreate(token1, quizId1, q6);

    result = requestQuesUpdate(token1, quizId1, questionId1, questionBody(
      undefined, 31
    ));
    expect(result).toMatchObject({ error: expect.any(String) });
  });

  test('The points awarded for the question are less than 1', () => {
    // The points awarded for the question are less than 1
    result = requestQuesUpdate(token1, quizId1, questionId1, questionBody(
      undefined, undefined, -1
    ));
    expect(result).toMatchObject({ error: expect.any(String) });
  });

  test('The points awarded for the question are greater than 10', () => {
    // The points awarded for the question are greater than 10
    result = requestQuesUpdate(token1, quizId1, questionId1, questionBody(
      undefined, undefined, 11
    ));
    expect(result).toMatchObject({ error: expect.any(String) });
  });

  test('The length of any answer is shorter than 1 character', () => {
    // The length of any answer is shorter than 1 character
    result = requestQuesUpdate(token1, quizId1, questionId1, questionBody(
      undefined, undefined, undefined,
      [{ answer: '', correct: false }, { answer: 'a', correct: true }]
    ));
    expect(result).toMatchObject({ error: expect.any(String) });
  });

  test('The length of any answer is longer than 30 characters', () => {
    // The length of any answer is longer than 30 characters
    result = requestQuesUpdate(token1, quizId1, questionId1, questionBody(
      undefined, undefined, undefined, [{ answer: 'a', correct: true },
        { answer: '1234567890123456789012345678901', correct: true }]
    ));
    expect(result).toMatchObject({ error: expect.any(String) });
  });

  test('Answer strings are duplicated within the question once (1)', () => {
    // Answer strings are duplicated within the question once
    result = requestQuesUpdate(token1, quizId1, questionId1, questionBody(
      undefined, undefined, undefined,
      [{ answer: 'a', correct: true }, { answer: 'a', correct: false }]
    ));
    expect(result).toMatchObject({ error: expect.any(String) });
  });

  test('Answer strings are duplicated within the question once (2)', () => {
    // Answer strings are duplicated within the question
    result = requestQuesUpdate(token1, quizId1, questionId1, questionBody(
      undefined, undefined, undefined,
      [{ answer: 'a', correct: true }, { answer: 'b', correct: false },
        { answer: 'c', correct: false }, { answer: 'b', correct: false }]
    ));
    expect(result).toMatchObject({ error: expect.any(String) });
  });

  test('Answer strings are duplicated within the question', () => {
    // Answer strings are duplicated within the question
    result = requestQuesUpdate(token1, quizId1, questionId1, questionBody(
      undefined, undefined, undefined,
      [{ answer: 'a', correct: true }, { answer: 'b', correct: false },
        { answer: 'c', correct: false }, { answer: 'd', correct: false },
        { answer: 'a', correct: false }, { answer: 'b', correct: false }]
    ));
    expect(result).toMatchObject({ error: expect.any(String) });
  });

  test('There are no correct answers', () => {
    // There are no correct answers
    result = requestQuesUpdate(token1, quizId1, questionId1, questionBody(
      undefined, undefined, undefined,
      [{ answer: 'a', correct: false }, { answer: 'a', correct: false }]
    ));
    expect(result).toMatchObject({ error: expect.any(String) });
  });

  test('Token is empty', () => {
    // Token is empty
    result = requestQuesUpdate(0, quizId1, questionId1, finalQ);
    expect(result).toMatchObject({ error: expect.any(String) });
  });

  test('Token does not refer to valid logged in user session', () => {
    // Token does not refer to valid logged in user session
    result = requestQuesUpdate(token1 + 1, quizId1, questionId1, finalQ);
    expect(result).toMatchObject({ error: expect.any(String) });
  });

  test('Valid token is provided, but the user is unauthorised', () => {
    // Valid token is provided, but the user is unauthorised
    const token2 = requestRegister('a@gmail.com', 'Val1Pass', 'fir', 'las').token;
    result = requestQuesUpdate(token2, quizId1, questionId1, finalQ);
    expect(result).toMatchObject({ error: expect.any(String) });
  });

  test('Valid token is provided, but the quiz is invalid', () => {
    // Valid token is provided, but the user is unauthorised
    result = requestQuesUpdate(token1, quizId1 + 1, questionId1, finalQ);
    expect(result).toMatchObject({ error: expect.any(String) });
  });

  test('Valid token is provided, but unauthorised after transfer', () => {
    // Valid token is provided, but unauthorised after transfer
    requestRegister('a@gmail.com', 'Val1Pass', 'fir', 'las');
    requestQuizTransfer(token1, quizId1, 'a@gmail.com');
    result = requestQuesUpdate(token1, quizId1, questionId1, finalQ);
    expect(result).toMatchObject({ error: expect.any(String) });
  });

  // Valid Cases
  test('Checking a simple case of restructuring a question', () => {
    // Checking a simple case of restructuring a question
    result = requestQuesUpdate(token1, quizId1, questionId1, finalQ);
    expect(Object.keys(result).length).toStrictEqual(0);

    const info = requestQuizInfo(token1, quizId1);
    expect(info).toMatchObject({
      quizId: quizId1,
      name: 'New Quiz 1',
      timeCreated: expect.any(Number),
      timeLastEdited: expect.any(Number),
      description: '',
      numQuestions: 1,
      questions: [{
        questionId: questionId1,
        question: 'What is the second letter of the alphabet?',
        duration: 15,
        points: 10,
        answers: [
          { answer: 'b', correct: true },
          { answer: 'a', correct: false }
        ]
      }],
      duration: 15
    });
  });

  test('Updating the same question multiple times', () => {
    // Updating multiple times
    requestQuesUpdate(token1, quizId1, questionId1, finalQ);
    requestQuesUpdate(token1, quizId1, questionId1, initialQ);
    result = requestQuesUpdate(token1, quizId1, questionId1, finalQ);
    expect(Object.keys(result).length).toStrictEqual(0);

    const info = requestQuizInfo(token1, quizId1);
    expect(info).toMatchObject({
      quizId: quizId1,
      name: 'New Quiz 1',
      timeCreated: expect.any(Number),
      timeLastEdited: expect.any(Number),
      description: '',
      numQuestions: 1,
      questions: [{
        questionId: questionId1,
        question: 'What is the second letter of the alphabet?',
        duration: 15,
        points: 10,
        answers: [
          { answer: 'b', correct: true },
          { answer: 'a', correct: false }
        ]
      }],
      duration: 15
    });
  });

  test('Moving, then updating', () => {
    // Moving, then updating
    const question2 = requestQuestionCreate(token1, quizId1, initialQ);
    requestQuesMove(token1, 1, questionId1, quizId1);
    result = requestQuesUpdate(token1, quizId1, questionId1, finalQ);
    expect(Object.keys(result).length).toStrictEqual(0);

    const info = requestQuizInfo(token1, quizId1);
    expect(info).toMatchObject({
      quizId: quizId1,
      name: 'New Quiz 1',
      timeCreated: expect.any(Number),
      timeLastEdited: expect.any(Number),
      description: '',
      numQuestions: 2,
      questions: [{
        questionId: question2.questionId,
        question: 'What is the first letter of the alphabet?',
        duration: 10,
        points: 5,
        answers: [
          { answer: 'a', correct: true },
          { answer: 'b', correct: false }
        ]
      },
      {
        questionId: questionId1,
        question: 'What is the second letter of the alphabet?',
        duration: 15,
        points: 10,
        answers: [
          { answer: 'b', correct: true },
          { answer: 'a', correct: false }
        ]
      }
      ],
      duration: 25
    });
  });

  test('Duplicating, then updating', () => {
    // Duplicating, then updating
    const question2 = requestQuesDup(token1, quizId1, questionId1);

    if ('questionId' in question2) {
      const questionId2 = question2.questionId;
      requestQuesUpdate(token1, quizId1, questionId1, finalQ);
      requestQuesUpdate(token1, quizId1, questionId2, finalQ);
      expect(Object.keys(result).length).toStrictEqual(0);

      const info = requestQuizInfo(token1, quizId1);
      expect(info).toMatchObject({
        quizId: quizId1,
        name: 'New Quiz 1',
        timeCreated: expect.any(Number),
        timeLastEdited: expect.any(Number),
        description: '',
        numQuestions: 2,
        questions: [{
          questionId: questionId1,
          question: 'What is the second letter of the alphabet?',
          duration: 15,
          points: 10,
          answers: [
            { answer: 'b', correct: true },
            { answer: 'a', correct: false }
          ]
        },
        {
          questionId: questionId2,
          question: 'What is the second letter of the alphabet?',
          duration: 15,
          points: 10,
          answers: [
            { answer: 'b', correct: true },
            { answer: 'a', correct: false }
          ]
        }
        ],
        duration: 30
      });
    } else expect(question2).toMatchObject({ questionId: expect.any(Number) });
  });

  test('Checking that question duration can be upto 180 seconds', () => {
    // Checking that question duration can be upto 180 seconds
    const q2 = questionBody('Question 2', 30);
    const q3 = questionBody('Question 3', 30);
    const q4 = questionBody('Question 4', 30);
    const q5 = questionBody('Question 5', 30);
    const q6 = questionBody('Question 6', 30);

    requestQuestionCreate(token1, quizId1, q2);
    requestQuestionCreate(token1, quizId1, q3);
    requestQuestionCreate(token1, quizId1, q4);
    requestQuestionCreate(token1, quizId1, q5);
    requestQuestionCreate(token1, quizId1, q6);

    result = requestQuesUpdate(token1, quizId1, questionId1, questionBody(
      undefined, 30
    ));
    expect(Object.keys(result).length).toStrictEqual(0);

    const info = requestQuizInfo(token1, quizId1);
    expect(info.numQuestions).toStrictEqual(6);
    expect(info.duration).toStrictEqual(180);
  });
});

describe('adminQuizQuestionDelete', () => {
  // Error Checking

  test('Question Id does not refer to a valid question', () => {
    // Question Id does not refer to a valid question
    result = requestQuesDelete(token1, quizId1, questionId1 + 1);
    expect(result).toMatchObject({ error: expect.any(String) });
  });

  test('Question Id refers to a question that\'s already been deleted', () => {
    // Question Id does not refer to a valid question
    requestQuesDelete(token1, quizId1, questionId1);
    result = requestQuesDelete(token1, quizId1, questionId1);
    expect(result).toMatchObject({ error: expect.any(String) });
  });

  test('QuestionId does not refer to a valid question in this quiz', () => {
    // QuestionId does not refer to a valid question in this quiz
    const quizId2 = requestQuizCreate(token1, 'New Quiz 2', '').quizId;
    const questionId2 = requestQuestionCreate(token1, quizId2, finalQ).questionId;

    result = requestQuesDelete(token1, quizId1, questionId2);
    expect(result).toMatchObject({ error: expect.any(String) });
  });

  test('QuestionId is out of the valid range', () => {
    // QuestionId is out of the valid range
    result = requestQuesDelete(token1, quizId1, 0);
    expect(result).toMatchObject({ error: expect.any(String) });
  });

  test('Token is empty', () => {
    // Token is empty
    result = requestQuesDelete(0, quizId1, questionId1);
    expect(result).toMatchObject({ error: expect.any(String) });
  });

  test('Token does not refer to valid logged in user session', () => {
    // Token does not refer to valid logged in user session
    result = requestQuesDelete(token1 + 1, quizId1, questionId1);
    expect(result).toMatchObject({ error: expect.any(String) });
  });

  test('Valid token is provided, but the user is unauthorised', () => {
    // Valid token is provided, but the user is unauthorised
    const token2 = requestRegister('a@gmail.com', 'Val1Pass', 'fir', 'las').token;
    result = requestQuesDelete(token2, quizId1, questionId1);
    expect(result).toMatchObject({ error: expect.any(String) });
  });

  test('Valid token is provided, but the quiz is invalid', () => {
    // Valid token is provided, but the user is unauthorised
    result = requestQuesDelete(token1, quizId1 + 1, questionId1);
    expect(result).toMatchObject({ error: expect.any(String) });
  });

  test('Valid token is provided, but unauthorised after transfer', () => {
    // Valid token is provided, but unauthorised after transfer
    requestRegister('a@gmail.com', 'Val1Pass', 'fir', 'las');
    requestQuizTransfer(token1, quizId1, 'a@gmail.com');
    result = requestQuesDelete(token1, quizId1, questionId1);
    expect(result).toMatchObject({ error: expect.any(String) });
  });

  // Valid Cases
  test('Checking a simple case of deleting a question', () => {
    // Checking a simple case of deleting a question
    result = requestQuesDelete(token1, quizId1, questionId1);
    expect(Object.keys(result).length).toStrictEqual(0);

    const info = requestQuizInfo(token1, quizId1);
    expect(info).toMatchObject({
      quizId: quizId1,
      name: 'New Quiz 1',
      timeCreated: expect.any(Number),
      timeLastEdited: expect.any(Number),
      description: '',
      numQuestions: 0,
      questions: [],
      duration: 0
    });
  });

  test('Duplicating, then deleting a question', () => {
    // Duplicating, then deleting a question
    requestQuesDup(token1, quizId1, questionId1);
    result = requestQuesDelete(token1, quizId1, questionId1);
    expect(Object.keys(result).length).toStrictEqual(0);

    const info = requestQuizInfo(token1, quizId1);
    expect(info).toMatchObject({
      quizId: quizId1,
      name: 'New Quiz 1',
      timeCreated: expect.any(Number),
      timeLastEdited: expect.any(Number),
      description: '',
      numQuestions: 1,
      questions: [{
        question: 'What is the first letter of the alphabet?',
        duration: 10,
        points: 5,
        answers: [
          { answer: 'a', correct: true },
          { answer: 'b', correct: false }
        ]
      }],
      duration: 10
    });
  });

  test('Updating, then deleting a question', () => {
    // Updating, then deleting a question
    requestQuesUpdate(token1, quizId1, questionId1, finalQ);
    result = requestQuesDelete(token1, quizId1, questionId1);
    expect(Object.keys(result).length).toStrictEqual(0);

    const info = requestQuizInfo(token1, quizId1);
    expect(info).toMatchObject({
      quizId: quizId1,
      name: 'New Quiz 1',
      timeCreated: expect.any(Number),
      timeLastEdited: expect.any(Number),
      description: '',
      numQuestions: 0,
      questions: [],
      duration: 0
    });
  });
});
