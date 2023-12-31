import {
  AnswerBody,
  ErrorObject,
  QuestionBody
} from '../../dataStore';

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
} from '../testHelper';

import HTTPError from 'http-errors';

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
  answers?: AnswerBody[], thumb?: string): QuestionBody {
  if (!thumb) {
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
  } else {
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
      }],
      thumbnailUrl: thumb
    };
  }
}

const validUrl = 'http://ThisIsValid.png';
const newUrl = 'https://ThisIsNew.png';
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

const initialQV1 = questionBody('What is the first letter of the alphabet?');
const finalQV1 = questionBody(
  undefined,
  15,
  10,
  [{ answer: 'b', correct: true }, { answer: 'a', correct: false }]
);
const initialQV2 = questionBody(
  'What is the first letter of the alphabet?',
  undefined,
  undefined,
  undefined,
  validUrl
);
const finalQV2 = questionBody(
  undefined,
  15,
  10,
  [{ answer: 'b', correct: true }, { answer: 'a', correct: false }],
  newUrl
);

let token1: number;
let quizId1: number;
let questionId1: number;
let result: ErrorObject | Record<string, never>;

beforeEach(() => {
  // Clearing any previous data
  requestClear();
});

/// /////////////////////////////////////////////////////////////////////////////
/// /////////////////////////////// VERSION 2 ///////////////////////////////////
/// /////////////////////////////////////////////////////////////////////////////

describe('adminQuizQuestionUpdate', () => {
  beforeEach(() => {
    // Defining base data to be manipulated in the tests (Updated/Deleted)
    token1 = requestRegister('am@gmail.com', 'Vl1dPass', 'fir', 'las').token;
    quizId1 = requestQuizCreate(token1, 'New Quiz 1', '').quizId;
    questionId1 = requestQuestionCreate(token1, quizId1, initialQV2).questionId;
  });

  // Error Checking

  test('QuestionId does not refer to a valid question', () => {
    // QuestionId does not refer to a valid question
    expect(() => requestQuesUpdate(
      token1, quizId1, questionId1 + 1, finalQV2
    )).toThrow(HTTPError[400]);
  });

  test('QuestionId does not refer to a valid question in this quiz', () => {
    // QuestionId does not refer to a valid question in this quiz
    const quizId2 = requestQuizCreate(token1, 'New Quiz 2', '').quizId;
    const questionId2 = requestQuestionCreate(
      token1, quizId2, finalQV2
    ).questionId;

    expect(() => requestQuesUpdate(
      token1, quizId1, questionId2, initialQV2
    )).toThrow(HTTPError[400]);
  });

  test('QuestionId is out of the valid range', () => {
    // QuestionId is out of the valid range
    expect(() => requestQuesUpdate(
      token1, quizId1, 0, finalQV2
    )).toThrow(HTTPError[400]);
  });

  test('Question string is less than 5 characters in length', () => {
    // Question string is less than 5 characters in length
    expect(() => requestQuesUpdate(
      token1,
      quizId1,
      questionId1,
      questionBody(shortQ)
    )).toThrow(HTTPError[400]);
  });

  test('Question string is greater than 50 characters in length', () => {
    // Question string is greater than 50 characters in length
    expect(() => requestQuesUpdate(
      token1,
      quizId1,
      questionId1,
      questionBody(longQ)
    )).toThrow(HTTPError[400]);
  });

  test('The question has more than 6 answers', () => {
    // The question has more than 6 answers
    expect(() => requestQuesUpdate(token1, quizId1, questionId1, questionBody(
      undefined,
      undefined,
      undefined,
      longAnswers
    ))).toThrow(HTTPError[400]);
  });

  test('The question has less than 2 answers', () => {
    // The question has less than 2 answers
    expect(() => requestQuesUpdate(token1, quizId1, questionId1, questionBody(
      undefined,
      undefined,
      undefined,
      shortAnswers
    ))).toThrow(HTTPError[400]);
  });

  test('The question duration is not a positive number', () => {
    // The question duration is not a positive number
    expect(() => requestQuesUpdate(token1, quizId1, questionId1, questionBody(
      undefined, -1
    ))).toThrow(HTTPError[400]);
  });

  test('1 question duration is larger than 3 minutes', () => {
    // 1 question duration is larger than 3 minutes
    expect(() => requestQuesUpdate(token1, quizId1, questionId1, questionBody(
      undefined, 181
    ))).toThrow(HTTPError[400]);
  });

  test('The question duration is lerger than 3 minutes', () => {
    // The question duration is lerger than 3 minutes
    const q2 = questionBody('Question 2', 30, 5, undefined, validUrl);
    const q3 = questionBody('Question 3', 30, 5, undefined, validUrl);
    const q4 = questionBody('Question 4', 30, 5, undefined, validUrl);
    const q5 = questionBody('Question 5', 30, 5, undefined, validUrl);
    const q6 = questionBody('Question 6', 30, 5, undefined, validUrl);

    requestQuestionCreate(token1, quizId1, q2);
    requestQuestionCreate(token1, quizId1, q3);
    requestQuestionCreate(token1, quizId1, q4);
    requestQuestionCreate(token1, quizId1, q5);
    requestQuestionCreate(token1, quizId1, q6);

    expect(() => requestQuesUpdate(token1, quizId1, questionId1, questionBody(
      undefined, 31
    ))).toThrow(HTTPError[400]);
  });

  test('The points awarded for the question are less than 1', () => {
    // The points awarded for the question are less than 1
    expect(() => requestQuesUpdate(token1, quizId1, questionId1, questionBody(
      undefined, undefined, -1
    ))).toThrow(HTTPError[400]);
  });

  test('The points awarded for the question are greater than 10', () => {
    // The points awarded for the question are greater than 10
    expect(() => requestQuesUpdate(token1, quizId1, questionId1, questionBody(
      undefined, undefined, 11
    ))).toThrow(HTTPError[400]);
  });

  test('The length of any answer is shorter than 1 character', () => {
    // The length of any answer is shorter than 1 character
    expect(() => requestQuesUpdate(token1, quizId1, questionId1, questionBody(
      undefined, undefined, undefined,
      [{ answer: '', correct: false }, { answer: 'a', correct: true }]
    ))).toThrow(HTTPError[400]);
  });

  test('The length of any answer is longer than 30 characters', () => {
    // The length of any answer is longer than 30 characters
    expect(() => requestQuesUpdate(token1, quizId1, questionId1, questionBody(
      undefined, undefined, undefined, [{ answer: 'a', correct: true },
        { answer: '1234567890123456789012345678901', correct: true }]
    ))).toThrow(HTTPError[400]);
  });

  test('Answer strings are duplicated within the question once (1)', () => {
    // Answer strings are duplicated within the question once
    expect(() => requestQuesUpdate(token1, quizId1, questionId1, questionBody(
      undefined, undefined, undefined,
      [{ answer: 'a', correct: true }, { answer: 'a', correct: false }]
    ))).toThrow(HTTPError[400]);
  });

  test('Answer strings are duplicated within the question once (2)', () => {
    // Answer strings are duplicated within the question
    expect(() => requestQuesUpdate(token1, quizId1, questionId1, questionBody(
      undefined, undefined, undefined,
      [{ answer: 'a', correct: true }, { answer: 'b', correct: false },
        { answer: 'c', correct: false }, { answer: 'b', correct: false }]
    ))).toThrow(HTTPError[400]);
  });

  test('Answer strings are duplicated within the question', () => {
    // Answer strings are duplicated within the question
    expect(() => requestQuesUpdate(token1, quizId1, questionId1, questionBody(
      undefined, undefined, undefined,
      [{ answer: 'a', correct: true }, { answer: 'b', correct: false },
        { answer: 'c', correct: false }, { answer: 'd', correct: false },
        { answer: 'a', correct: false }, { answer: 'b', correct: false }]
    ))).toThrow(HTTPError[400]);
  });

  test('There are no correct answers', () => {
    // There are no correct answers
    expect(() => requestQuesUpdate(token1, quizId1, questionId1, questionBody(
      undefined, undefined, undefined,
      [{ answer: 'a', correct: false }, { answer: 'a', correct: false }]
    ))).toThrow(HTTPError[400]);
  });

  test('Token is empty', () => {
    // Token is empty
    expect(() => requestQuesUpdate(
      0, quizId1, questionId1, finalQV2
    )).toThrow(HTTPError[401]);
  });

  test('Token does not refer to valid logged in user session', () => {
    // Token does not refer to valid logged in user session
    expect(() => requestQuesUpdate(
      token1 + 1, quizId1, questionId1, finalQV2
    )).toThrow(HTTPError[401]);
  });

  test('Valid token is provided, but the user is unauthorised', () => {
    // Valid token is provided, but the user is unauthorised
    const token2 = requestRegister(
      'a@gmail.com', 'Val1Pass', 'fir', 'las'
    ).token;
    expect(() => requestQuesUpdate(
      token2, quizId1, questionId1, finalQV2
    )).toThrow(HTTPError[403]);
  });

  test('Valid token is provided, but the quiz is invalid', () => {
    // Valid token is provided, but the user is unauthorised
    expect(() => requestQuesUpdate(
      token1, quizId1 + 1, questionId1, finalQV2
    )).toThrow(HTTPError[403]);
  });

  test('Valid token is provided, but unauthorised after transfer', () => {
    // Valid token is provided, but unauthorised after transfer
    requestRegister('a@gmail.com', 'Val1Pass', 'fir', 'las');
    requestQuizTransfer(token1, quizId1, 'a@gmail.com');
    expect(() => requestQuesUpdate(
      token1, quizId1, questionId1, finalQV2
    )).toThrow(HTTPError[403]);
  });

  // Valid Cases
  test('Checking a simple case of restructuring a question', () => {
    // Checking a simple case of restructuring a question
    result = requestQuesUpdate(token1, quizId1, questionId1, finalQV2);
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
        question: finalQV2.question,
        duration: finalQV2.duration,
        points: finalQV2.points,
        answers: finalQV2.answers,
        thumbnailUrl: finalQV2.thumbnailUrl
      }],
      duration: 15
    });
  });

  test('Updating the same question multiple times', () => {
    // Updating multiple times
    requestQuesUpdate(token1, quizId1, questionId1, finalQV2);
    requestQuesUpdate(token1, quizId1, questionId1, initialQV2);
    result = requestQuesUpdate(token1, quizId1, questionId1, finalQV2);
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
        ],
        thumbnailUrl: finalQV2.thumbnailUrl
      }],
      duration: 15
    });
  });

  test('Moving, then updating', () => {
    // Moving, then updating
    const question2 = requestQuestionCreate(token1, quizId1, initialQV2);
    requestQuesMove(token1, 1, questionId1, quizId1);
    result = requestQuesUpdate(token1, quizId1, questionId1, finalQV2);
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
        question: initialQV2.question,
        duration: 10,
        points: 5,
        answers: [
          { answer: 'a', correct: true },
          { answer: 'b', correct: false }
        ],
        thumbnailUrl: initialQV2.thumbnailUrl
      },
      {
        questionId: questionId1,
        question: 'What is the second letter of the alphabet?',
        duration: 15,
        points: 10,
        answers: [
          { answer: 'b', correct: true },
          { answer: 'a', correct: false }
        ],
        thumbnailUrl: finalQV2.thumbnailUrl
      }],
      duration: 25
    });
  });

  test('Duplicating, then updating', () => {
    // Duplicating, then updating
    const question2 = requestQuesDup(token1, quizId1, questionId1);

    if ('questionId' in question2) {
      const questionId2 = question2.questionId;
      requestQuesUpdate(token1, quizId1, questionId1, finalQV2);
      requestQuesUpdate(token1, quizId1, questionId2, finalQV2);
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
          ],
          thumbnailUrl: finalQV2.thumbnailUrl
        },
        {
          questionId: questionId2,
          question: 'What is the second letter of the alphabet?',
          duration: 15,
          points: 10,
          answers: [
            { answer: 'b', correct: true },
            { answer: 'a', correct: false }
          ],
          thumbnailUrl: finalQV2.thumbnailUrl
        }],
        duration: 30
      });
    } else expect(question2).toMatchObject({ questionId: expect.any(Number) });
  });

  test('Checking that question duration can be upto 180 seconds', () => {
    // Checking that question duration can be upto 180 seconds
    const q2 = questionBody('Question 2', 30, undefined, undefined, validUrl);
    const q3 = questionBody('Question 3', 30, undefined, undefined, validUrl);
    const q4 = questionBody('Question 4', 30, undefined, undefined, validUrl);
    const q5 = questionBody('Question 5', 30, undefined, undefined, validUrl);
    const q6 = questionBody('Question 6', 30, undefined, undefined, validUrl);

    requestQuestionCreate(token1, quizId1, q2);
    requestQuestionCreate(token1, quizId1, q3);
    requestQuestionCreate(token1, quizId1, q4);
    requestQuestionCreate(token1, quizId1, q5);
    requestQuestionCreate(token1, quizId1, q6);

    result = requestQuesUpdate(token1, quizId1, questionId1, questionBody(
      undefined, 30, undefined, undefined, newUrl
    ));
    expect(Object.keys(result).length).toStrictEqual(0);

    const info = requestQuizInfo(token1, quizId1);
    expect(info.numQuestions).toStrictEqual(6);
    expect(info.duration).toStrictEqual(180);
  });
});

describe('adminQuizQuestionDelete', () => {
  beforeEach(() => {
    // Defining base data to be manipulated in the tests (Updated/Deleted)
    token1 = requestRegister('am@gmail.com', 'Vl1dPass', 'fir', 'las').token;
    quizId1 = requestQuizCreate(token1, 'New Quiz 1', '').quizId;
    questionId1 = requestQuestionCreate(token1, quizId1, initialQV2).questionId;
  });

  // Error Checking

  test('Question Id does not refer to a valid question', () => {
    // Question Id does not refer to a valid question
    expect(() => requestQuesDelete(
      token1, quizId1, questionId1 + 1
    )).toThrow(HTTPError[400]);
  });

  test('Question Id refers to a question that\'s already been deleted', () => {
    // Question Id does not refer to a valid question
    requestQuesDelete(token1, quizId1, questionId1);
    expect(() => requestQuesDelete(
      token1, quizId1, questionId1
    )).toThrow(HTTPError[400]);
  });

  test('QuestionId does not refer to a valid question in this quiz', () => {
    // QuestionId does not refer to a valid question in this quiz
    const quizId2 = requestQuizCreate(token1, 'New Quiz 2', '').quizId;
    const questionId2 = requestQuestionCreate(
      token1, quizId2, finalQV2
    ).questionId;

    expect(() => requestQuesDelete(
      token1, quizId1, questionId2
    )).toThrow(HTTPError[400]);
  });

  test('QuestionId is out of the valid range', () => {
    // QuestionId is out of the valid range
    expect(() => requestQuesDelete(
      token1, quizId1, 0
    )).toThrow(HTTPError[400]);
  });

  test('Token is empty', () => {
    // Token is empty
    expect(() => requestQuesDelete(
      0, quizId1, questionId1
    )).toThrow(HTTPError[401]);
  });

  test('Token does not refer to valid logged in user session', () => {
    // Token does not refer to valid logged in user session
    expect(() => requestQuesDelete(
      token1 + 1, quizId1, questionId1
    )).toThrow(HTTPError[401]);
  });

  test('Valid token is provided, but the user is unauthorised', () => {
    // Valid token is provided, but the user is unauthorised
    const token2 = requestRegister(
      'a@gmail.com', 'Val1Pass', 'fir', 'las'
    ).token;
    expect(() => requestQuesDelete(
      token2, quizId1, questionId1
    )).toThrow(HTTPError[403]);
  });

  test('Valid token is provided, but the quiz is invalid', () => {
    // Valid token is provided, but the user is unauthorised
    expect(() => requestQuesDelete(
      token1, quizId1 + 1, questionId1
    )).toThrow(HTTPError[403]);
  });

  test('Valid token is provided, but unauthorised after transfer', () => {
    // Valid token is provided, but unauthorised after transfer
    requestRegister('a@gmail.com', 'Val1Pass', 'fir', 'las');
    requestQuizTransfer(token1, quizId1, 'a@gmail.com');
    expect(() => requestQuesDelete(
      token1, quizId1, questionId1
    )).toThrow(HTTPError[403]);
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
        question: initialQV2.question,
        duration: 10,
        points: 5,
        answers: [
          { answer: 'a', correct: true },
          { answer: 'b', correct: false }
        ],
        thumbnailUrl: initialQV2.thumbnailUrl
      }],
      duration: 10
    });
  });

  test('Updating, then deleting a question', () => {
    // Updating, then deleting a question
    requestQuesUpdate(token1, quizId1, questionId1, finalQV2);
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

/// /////////////////////////////////////////////////////////////////////////////
/// /////////////////////////////// VERSION 1 ///////////////////////////////////
/// /////////////////////////////////////////////////////////////////////////////

beforeEach(() => {
  // Clearing any previous data
  requestClear();
});

describe('adminQuizQuestionUpdate', () => {
  beforeEach(() => {
    // Defining base data to be manipulated in the tests (Updated/Deleted)
    token1 = requestRegister(
      'am@gmail.com', 'Vl1dPass', 'fir', 'las', true
    ).token;

    quizId1 = requestQuizCreate(token1, 'New Quiz 1', '', true).quizId;

    questionId1 = requestQuestionCreate(
      token1, quizId1, initialQV1, true
    ).questionId;
  });

  // Error Checking

  test('QuestionId does not refer to a valid question', () => {
    // QuestionId does not refer to a valid question
    expect(() => requestQuesUpdate(
      token1, quizId1, questionId1 + 1, finalQV1, true
    )).toThrow(HTTPError[400]);
  });

  test('QuestionId does not refer to a valid question in this quiz', () => {
    // QuestionId does not refer to a valid question in this quiz
    const quizId2 = requestQuizCreate(token1, 'New Quiz 2', '', true).quizId;
    const questionId2 = requestQuestionCreate(
      token1, quizId2, finalQV1, true
    ).questionId;

    expect(() => requestQuesUpdate(
      token1, quizId1, questionId2, initialQV1, true
    )).toThrow(HTTPError[400]);
  });

  test('QuestionId is out of the valid range', () => {
    // QuestionId is out of the valid range
    expect(() => requestQuesUpdate(
      token1, quizId1, 0, finalQV1, true
    )).toThrow(HTTPError[400]);
  });

  test('Question string is less than 5 characters in length', () => {
    // Question string is less than 5 characters in length
    expect(() => requestQuesUpdate(
      token1,
      quizId1,
      questionId1,
      questionBody(shortQ),
      true
    )).toThrow(HTTPError[400]);
  });

  test('Question string is greater than 50 characters in length', () => {
    // Question string is greater than 50 characters in length
    expect(() => requestQuesUpdate(
      token1,
      quizId1,
      questionId1,
      questionBody(longQ)
    )).toThrow(HTTPError[400]);
  });

  test('The question has more than 6 answers', () => {
    // The question has more than 6 answers
    expect(() => requestQuesUpdate(token1, quizId1, questionId1, questionBody(
      undefined,
      undefined,
      undefined,
      longAnswers
    ), true)).toThrow(HTTPError[400]);
  });

  test('The question has less than 2 answers', () => {
    // The question has less than 2 answers
    expect(() => requestQuesUpdate(token1, quizId1, questionId1, questionBody(
      undefined,
      undefined,
      undefined,
      shortAnswers
    ), true)).toThrow(HTTPError[400]);
  });

  test('The question duration is not a positive number', () => {
    // The question duration is not a positive number
    expect(() => requestQuesUpdate(token1, quizId1, questionId1, questionBody(
      undefined, -1, undefined, undefined
    ), true)).toThrow(HTTPError[400]);
  });

  test('1 question duration is larger than 3 minutes', () => {
    // 1 question duration is larger than 3 minutes
    expect(() => requestQuesUpdate(token1, quizId1, questionId1, questionBody(
      undefined, 181, undefined, undefined
    ), true)).toThrow(HTTPError[400]);
  });

  test('The question duration is lerger than 3 minutes', () => {
    // The question duration is lerger than 3 minutes
    const q2 = questionBody('Question 2', 30);
    const q3 = questionBody('Question 3', 30);
    const q4 = questionBody('Question 4', 30);
    const q5 = questionBody('Question 5', 30);
    const q6 = questionBody('Question 6', 30);

    requestQuestionCreate(token1, quizId1, q2, true);
    requestQuestionCreate(token1, quizId1, q3, true);
    requestQuestionCreate(token1, quizId1, q4, true);
    requestQuestionCreate(token1, quizId1, q5, true);
    requestQuestionCreate(token1, quizId1, q6, true);

    expect(() => requestQuesUpdate(token1, quizId1, questionId1, questionBody(
      undefined, 31, undefined, undefined
    ), true)).toThrow(HTTPError[400]);
  });

  test('The points awarded for the question are less than 1', () => {
    // The points awarded for the question are less than 1
    expect(() => requestQuesUpdate(token1, quizId1, questionId1, questionBody(
      undefined, undefined, -1, undefined
    ), true)).toThrow(HTTPError[400]);
  });

  test('The points awarded for the question are greater than 10', () => {
    // The points awarded for the question are greater than 10
    expect(() => requestQuesUpdate(token1, quizId1, questionId1, questionBody(
      undefined, undefined, 11, undefined
    ), true)).toThrow(HTTPError[400]);
  });

  test('The length of any answer is shorter than 1 character', () => {
    // The length of any answer is shorter than 1 character
    expect(() => requestQuesUpdate(token1, quizId1, questionId1, questionBody(
      undefined, undefined, undefined,
      [{ answer: '', correct: false }, { answer: 'a', correct: true }]
    ), true)).toThrow(HTTPError[400]);
  });

  test('The length of any answer is longer than 30 characters', () => {
    // The length of any answer is longer than 30 characters
    expect(() => requestQuesUpdate(token1, quizId1, questionId1, questionBody(
      undefined, undefined, undefined, [{ answer: 'a', correct: true },
        { answer: '1234567890123456789012345678901', correct: true }]
    ), true)).toThrow(HTTPError[400]);
  });

  test('Answer strings are duplicated within the question once (1)', () => {
    // Answer strings are duplicated within the question once
    expect(() => requestQuesUpdate(token1, quizId1, questionId1, questionBody(
      undefined, undefined, undefined,
      [{ answer: 'a', correct: true }, { answer: 'a', correct: false }]
    ), true)).toThrow(HTTPError[400]);
  });

  test('Answer strings are duplicated within the question once (2)', () => {
    // Answer strings are duplicated within the question
    expect(() => requestQuesUpdate(token1, quizId1, questionId1, questionBody(
      undefined, undefined, undefined,
      [{ answer: 'a', correct: true }, { answer: 'b', correct: false },
        { answer: 'c', correct: false }, { answer: 'b', correct: false }]
    ), true)).toThrow(HTTPError[400]);
  });

  test('Answer strings are duplicated within the question', () => {
    // Answer strings are duplicated within the question
    expect(() => requestQuesUpdate(token1, quizId1, questionId1, questionBody(
      undefined, undefined, undefined,
      [{ answer: 'a', correct: true }, { answer: 'b', correct: false },
        { answer: 'c', correct: false }, { answer: 'd', correct: false },
        { answer: 'a', correct: false }, { answer: 'b', correct: false }]
    ), true)).toThrow(HTTPError[400]);
  });

  test('There are no correct answers', () => {
    // There are no correct answers
    expect(() => requestQuesUpdate(token1, quizId1, questionId1, questionBody(
      undefined, undefined, undefined,
      [{ answer: 'a', correct: false }, { answer: 'a', correct: false }]
    ), true)).toThrow(HTTPError[400]);
  });

  test('Token is empty', () => {
    // Token is empty
    expect(() => requestQuesUpdate(
      0, quizId1, questionId1, finalQV1, true
    )).toThrow(HTTPError[401]);
  });

  test('Token does not refer to valid logged in user session', () => {
    // Token does not refer to valid logged in user session
    expect(() => requestQuesUpdate(
      token1 + 1, quizId1, questionId1, finalQV1, true
    )).toThrow(HTTPError[401]);
  });

  test('Valid token is provided, but the user is unauthorised', () => {
    // Valid token is provided, but the user is unauthorised
    const token2 = requestRegister(
      'a@gmail.com', 'Val1Pass', 'fir', 'las', true
    ).token;
    expect(() => requestQuesUpdate(
      token2, quizId1, questionId1, finalQV1, true
    )).toThrow(HTTPError[403]);
  });

  test('Valid token is provided, but the quiz is invalid', () => {
    // Valid token is provided, but the user is unauthorised
    expect(() => requestQuesUpdate(
      token1, quizId1 + 1, questionId1, finalQV1, true
    )).toThrow(HTTPError[403]);
  });

  test('Valid token is provided, but unauthorised after transfer', () => {
    // Valid token is provided, but unauthorised after transfer
    requestRegister('a@gmail.com', 'Val1Pass', 'fir', 'las', true);
    requestQuizTransfer(token1, quizId1, 'a@gmail.com', true);
    expect(() => requestQuesUpdate(
      token1, quizId1, questionId1, finalQV1, true
    )).toThrow(HTTPError[403]);
  });

  // Valid Cases
  test('Checking a simple case of restructuring a question', () => {
    // Checking a simple case of restructuring a question
    result = requestQuesUpdate(token1, quizId1, questionId1, finalQV1, true);
    expect(Object.keys(result).length).toStrictEqual(0);

    const info = requestQuizInfo(token1, quizId1, true);
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
    requestQuesUpdate(token1, quizId1, questionId1, finalQV1, true);
    requestQuesUpdate(token1, quizId1, questionId1, initialQV1, true);
    result = requestQuesUpdate(token1, quizId1, questionId1, finalQV1, true);
    expect(Object.keys(result).length).toStrictEqual(0);

    const info = requestQuizInfo(token1, quizId1, true);
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
    const question2 = requestQuestionCreate(token1, quizId1, initialQV1, true);
    requestQuesMove(token1, 1, questionId1, quizId1, true);
    result = requestQuesUpdate(token1, quizId1, questionId1, finalQV1, true);
    expect(Object.keys(result).length).toStrictEqual(0);

    const info = requestQuizInfo(token1, quizId1, true);
    expect(info).toMatchObject({
      quizId: quizId1,
      name: 'New Quiz 1',
      timeCreated: expect.any(Number),
      timeLastEdited: expect.any(Number),
      description: '',
      numQuestions: 2,
      questions: [{
        questionId: question2.questionId,
        question: initialQV1.question,
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
    const question2 = requestQuesDup(token1, quizId1, questionId1, true);

    if ('questionId' in question2) {
      const questionId2 = question2.questionId;
      requestQuesUpdate(token1, quizId1, questionId1, finalQV1, true);
      requestQuesUpdate(token1, quizId1, questionId2, finalQV1, true);
      expect(Object.keys(result).length).toStrictEqual(0);

      const info = requestQuizInfo(token1, quizId1, true);
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

    requestQuestionCreate(token1, quizId1, q2, true);
    requestQuestionCreate(token1, quizId1, q3, true);
    requestQuestionCreate(token1, quizId1, q4, true);
    requestQuestionCreate(token1, quizId1, q5, true);
    requestQuestionCreate(token1, quizId1, q6, true);

    result = requestQuesUpdate(token1, quizId1, questionId1, questionBody(
      undefined, 30
    ), true);
    expect(Object.keys(result).length).toStrictEqual(0);

    const info = requestQuizInfo(token1, quizId1, true);
    expect(info.numQuestions).toStrictEqual(6);
    expect(info.duration).toStrictEqual(180);
  });
});

describe('adminQuizQuestionDelete', () => {
  beforeEach(() => {
    // Defining base data to be manipulated in the tests (Updated/Deleted)
    token1 = requestRegister(
      'am@gmail.com', 'Vl1dPass', 'fir', 'las', true
    ).token;

    quizId1 = requestQuizCreate(token1, 'New Quiz 1', '', true).quizId;

    questionId1 = requestQuestionCreate(
      token1, quizId1, initialQV1, true
    ).questionId;
  });

  // Error Checking

  test('Question Id does not refer to a valid question', () => {
    // Question Id does not refer to a valid question
    expect(() => requestQuesDelete(
      token1, quizId1, questionId1 + 1, true
    )).toThrow(HTTPError[400]);
  });

  test('Question Id refers to a question that\'s already been deleted', () => {
    // Question Id does not refer to a valid question
    requestQuesDelete(token1, quizId1, questionId1, true);
    expect(() => requestQuesDelete(
      token1, quizId1, questionId1, true
    )).toThrow(HTTPError[400]);
  });

  test('QuestionId does not refer to a valid question in this quiz', () => {
    // QuestionId does not refer to a valid question in this quiz
    const quizId2 = requestQuizCreate(token1, 'New Quiz 2', '', true).quizId;
    const questionId2 = requestQuestionCreate(
      token1, quizId2, finalQV1, true
    ).questionId;

    expect(() => requestQuesDelete(
      token1, quizId1, questionId2, true
    )).toThrow(HTTPError[400]);
  });

  test('QuestionId is out of the valid range', () => {
    // QuestionId is out of the valid range
    expect(() => requestQuesDelete(
      token1, quizId1, 0, true
    )).toThrow(HTTPError[400]);
  });

  test('Token is empty', () => {
    // Token is empty
    expect(() => requestQuesDelete(
      0, quizId1, questionId1, true
    )).toThrow(HTTPError[401]);
  });

  test('Token does not refer to valid logged in user session', () => {
    // Token does not refer to valid logged in user session
    expect(() => requestQuesDelete(
      token1 + 1, quizId1, questionId1, true
    )).toThrow(HTTPError[401]);
  });

  test('Valid token is provided, but the user is unauthorised', () => {
    // Valid token is provided, but the user is unauthorised
    const token2 = requestRegister(
      'a@gmail.com', 'Val1Pass', 'fir', 'las', true
    ).token;

    expect(() => requestQuesDelete(
      token2, quizId1, questionId1, true
    )).toThrow(HTTPError[403]);
  });

  test('Valid token is provided, but the quiz is invalid', () => {
    // Valid token is provided, but the user is unauthorised
    expect(() => requestQuesDelete(
      token1, quizId1 + 1, questionId1, true
    )).toThrow(HTTPError[403]);
  });

  test('Valid token is provided, but unauthorised after transfer', () => {
    // Valid token is provided, but unauthorised after transfer
    requestRegister('a@gmail.com', 'Val1Pass', 'fir', 'las', true);
    requestQuizTransfer(token1, quizId1, 'a@gmail.com', true);
    expect(() => requestQuesDelete(
      token1, quizId1, questionId1, true
    )).toThrow(HTTPError[403]);
  });

  // Valid Cases
  test('Checking a simple case of deleting a question', () => {
    // Checking a simple case of deleting a question
    result = requestQuesDelete(token1, quizId1, questionId1, true);
    expect(Object.keys(result).length).toStrictEqual(0);

    const info = requestQuizInfo(token1, quizId1, true);
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
    requestQuesDup(token1, quizId1, questionId1, true);
    result = requestQuesDelete(token1, quizId1, questionId1, true);
    expect(Object.keys(result).length).toStrictEqual(0);

    const info = requestQuizInfo(token1, quizId1, true);
    expect(info).toMatchObject({
      quizId: quizId1,
      name: 'New Quiz 1',
      timeCreated: expect.any(Number),
      timeLastEdited: expect.any(Number),
      description: '',
      numQuestions: 1,
      questions: [{
        question: initialQV1.question,
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
    requestQuesUpdate(token1, quizId1, questionId1, finalQV1, true);
    result = requestQuesDelete(token1, quizId1, questionId1, true);
    expect(Object.keys(result).length).toStrictEqual(0);

    const info = requestQuizInfo(token1, quizId1, true);
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
