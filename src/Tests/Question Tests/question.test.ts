import {
  requestClear,
  requestRegister,
  requestQuizCreate,
  requestQuestionCreate,
  requestQuizInfo
} from '../testHelper';

import HTTPError from 'http-errors';

/// ////////////////////////////////////////////////////////////////////////////
/// //////////////////////////////// Tests /////////////////////////////////////
/// ////////////////////////////////////////////////////////////////////////////

// Defining base urls
const validUrl = 'https://image.jpg';
const validUrl2 = 'http://image.jpeg';
const validUrl3 = 'http://image.png';

const invalidType = 'https://image.gif';
const invalidType2 = 'https://en.wikipedia.org/wiki/Food';
const invalidFile1 = 'htp://ThisIsCompletelyInvalid.jpg';
const invalidFile2 = 'htt://ThisIsCompletelyInvalid.png';

// Defining other base data
const invalidUser = 10000;
const quizId = -4123214;
const invlalidQuestion1 = 'asdf';
const invlalidQuestion2 = 'qweasdzsfhkngkujdfhgujklhgjbfrtyfghvbnsadsafsafsafc';
const questionString = 'How to call a person without a body and a nose?';

const answers = [
  { answer: 'Nobody Knows', correct: true },
  { answer: 'Onebody Knows', correct: false }
];

const answers2 = [
  { answer: 'Nobody Knows', correct: true },
  { answer: 'Onebody Knows', correct: false },
  { answer: 'Twobody Knows', correct: true },
  { answer: 'Threebody Knows', correct: false }
];

const invalidAnswerLength1 = [
  { answer: 'Nobody Knows', correct: true }
];

const invalidAnswerLength2 = [
  { answer: 'Nobody Knows', correct: true },
  { answer: 'Onebody Knows', correct: false },
  { answer: 'Twobody Knows', correct: false },
  { answer: 'Threebody Knows', correct: false },
  { answer: 'Fourbody Knows', correct: false },
  { answer: 'Fivebody Knows', correct: false },
  { answer: 'Sixbody Knows', correct: false }
];

const answersInvliadStringLength1 = [
  { answer: 'Nobody Knows', correct: true },
  { answer: '', correct: false },
  { answer: 'Twobody Knows', correct: false },
  { answer: 'Threebody Knows', correct: false }
];

const answersInvliadStringLength2 = [
  { answer: 'Nobody Knows', correct: true },
  { answer: 'Onebody Knows', correct: false },
  { answer: 'Twobody Knows', correct: false },
  { answer: 'Threebody Knowsssssssssssssssss', correct: false }
];

const answersDuplicateAnswers = [
  { answer: 'Nobody Knows', correct: true },
  { answer: 'Onebody Knows', correct: false },
  { answer: 'Nobody Knows', correct: false },
  { answer: 'Threebody Knows', correct: false }
];

const answersNoCorrect = [
  { answer: 'Nobody Knows', correct: false },
  { answer: 'Onebody Knows', correct: false },
  { answer: 'Twobody Knows', correct: false },
  { answer: 'Threebody Knows', correct: false }
];

// Question bodies for version 1
const questionBody = {
  question: questionString,
  duration: 60,
  points: 5,
  answers: answers,
};

const questionBody2 = {
  question: questionString,
  duration: 30,
  points: 7,
  answers: answers2,
};

const questionBodyNegativeDuration = {
  question: questionString,
  duration: -1,
  points: 5,
  answers: answers,
};

const questionBodyInvalidPoint1 = {
  question: questionString,
  duration: 60,
  points: 0,
  answers: answers,
};

const questionBodyInvalidPoint2 = {
  question: questionString,
  duration: 60,
  points: 11,
  answers: answers,
};

// Question bodies for version 2
const questionBodyV2 = {
  question: questionString,
  duration: 60,
  points: 5,
  answers: answers,
  thumbnailUrl: validUrl
};

const questionBody2V2 = {
  question: questionString,
  duration: 30,
  points: 7,
  answers: answers2,
  thumbnailUrl: validUrl2
};

const questionBody3V2 = {
  question: questionString,
  duration: 30,
  points: 7,
  answers: answers2,
  thumbnailUrl: validUrl3
};

const questionBodyNegativeDurationV2 = {
  question: questionString,
  duration: -1,
  points: 5,
  answers: answers,
  thumbnailUrl: validUrl3
};

const questionBodyInvalidPoint1V2 = {
  question: questionString,
  duration: 60,
  points: 0,
  answers: answers,
  thumbnailUrl: validUrl
};

const questionBodyInvalidPoint2V2 = {
  question: questionString,
  duration: 60,
  points: 11,
  answers: answers,
  thumbnailUrl: validUrl2
};

const questionBodyInvFile1V2 = {
  question: questionString,
  duration: 60,
  points: 5,
  answers: answers,
  thumbnailUrl: invalidFile1
};

const questionBodyInvFile2V2 = {
  question: questionString,
  duration: 60,
  points: 5,
  answers: answers,
  thumbnailUrl: invalidFile2
};

const questionBodyInvType1V2 = {
  question: questionString,
  duration: 30,
  points: 7,
  answers: answers2,
  thumbnailUrl: invalidType
};

const questionBodyInvType2V2 = {
  question: questionString,
  duration: 30,
  points: 7,
  answers: answers2,
  thumbnailUrl: invalidType2
};

beforeEach(() => { requestClear(); });

/// /////////////////////////////////////////////////////////////////////////////
/// /////////////////////////////// VERSION 2 ///////////////////////////////////
/// /////////////////////////////////////////////////////////////////////////////

describe('questionCreate', () => {
  describe('ERROR Tests 401 403', () => {
    test('token is not a valid user', () => {
      // token is not an integer
      expect(() => requestQuestionCreate(
        invalidUser, quizId, questionBodyV2
      )).toThrow(HTTPError[401]);
    });

    test('Quiz ID does not refer to a valid quiz', () => {
      const token1 = requestRegister(
        'first.last1@gmail.com', 'abcd1234', 'first', 'last'
      ).token;

      expect(() => requestQuestionCreate(
        token1, quizId, questionBodyV2
      )).toThrow(HTTPError[403]);
    });

    test('Quiz ID does not refer to a quiz that this user owns', () => {
      const token1 = requestRegister(
        'first.last1@gmail.com', 'abcd1234', 'first', 'last'
      ).token;

      const token2 = requestRegister(
        'first.last2@gmail.com', 'abcd1234', 'first', 'last'
      ).token;

      const quizId1 = requestQuizCreate(
        token2, 'first last', 'fist_test'
      ).quizId;

      expect(() => requestQuestionCreate(
        token1, quizId1, questionBodyV2
      )).toThrow(HTTPError[403]);
    });
  });

  describe('ERROR Tests 400', () => {
    let token1: number;
    let quizId1: number;

    beforeEach(() => {
      token1 = requestRegister(
        'first.last1@gmail.com', 'abcd1234', 'first', 'last'
      ).token;
      quizId1 = requestQuizCreate(
        token1, 'first last', 'fist_test'
      ).quizId;
    });

    test('Question string is less than 5 characters in length', () => {
      const question = {
        question: invlalidQuestion1,
        duration: 60,
        points: 5,
        answers: answers,
      };
      expect(() => requestQuestionCreate(
        token1, quizId1, question
      )).toThrow(HTTPError[400]);
    });

    test('Question string is greater than 50 characters in length', () => {
      const question = {
        question: invlalidQuestion2,
        duration: 60,
        points: 5,
        answers: answers,
      };
      expect(() => requestQuestionCreate(
        token1, quizId1, question
      )).toThrow(HTTPError[400]);
    });

    test('The question has less than 2 answers', () => {
      const question = {
        question: questionString,
        duration: 60,
        points: 5,
        answers: invalidAnswerLength1,
      };
      expect(() => requestQuestionCreate(
        token1, quizId1, question
      )).toThrow(HTTPError[400]);
    });

    test('The question has more than 6 answers', () => {
      const question = {
        question: questionString,
        duration: 60,
        points: 5,
        answers: invalidAnswerLength2,
      };
      expect(() => requestQuestionCreate(
        token1, quizId1, question
      )).toThrow(HTTPError[400]);
    });

    test('The question duration is not a positive number', () => {
      expect(() => requestQuestionCreate(
        token1, quizId1, questionBodyNegativeDurationV2
      )).toThrow(HTTPError[400]);
    });

    test('The sum of the question durations exceeds 3 minutes', () => {
      // question body has a length of 60 seconds
      for (let i = 0; i < 3; i++) {
        requestQuestionCreate(token1, quizId1, questionBodyV2);
      }

      // This will tip it up from 180 seconds.
      expect(() => requestQuestionCreate(
        token1, quizId1, questionBodyV2
      )).toThrow(HTTPError[400]);
    });

    test('Sum of the question durations will be 181 seconds', () => {
      // question body has a length of 60 seconds
      for (let i = 0; i < 3; i++) {
        requestQuestionCreate(token1, quizId1, questionBodyV2);
      }

      expect(() => requestQuestionCreate(token1, quizId1, {
        question: 'Who let the dogs out?',
        duration: 1,
        points: 10,
        answers: [
          { answer: 'who?', correct: false },
          { answer: 'you?', correct: true }
        ]
      })).toThrow(HTTPError[400]);
    });

    test('The points awarded for the question are less than 1', () => {
      expect(() => requestQuestionCreate(
        token1, quizId1, questionBodyInvalidPoint1V2
      )).toThrow(HTTPError[400]);
    });

    test('The points awarded for the question are greater than 10', () => {
      expect(() => requestQuestionCreate(
        token1, quizId1, questionBodyInvalidPoint2V2
      )).toThrow(HTTPError[400]);
    });

    test('The length of any answer is shorter than 1 character long', () => {
      const question = {
        question: questionString,
        duration: 60,
        points: 5,
        answers: answersInvliadStringLength1,
      };
      expect(() => requestQuestionCreate(
        token1, quizId1, question
      )).toThrow(HTTPError[400]);
    });

    test('The length of any answer is longer than 30 characters long', () => {
      const question = {
        question: questionString,
        duration: 60,
        points: 5,
        answers: answersInvliadStringLength2,
      };
      expect(() => requestQuestionCreate(
        token1, quizId1, question
      )).toThrow(HTTPError[400]);
    });

    test('Any answer strings are duplicates within the same question', () => {
      const question = {
        question: questionString,
        duration: 60,
        points: 5,
        answers: answersDuplicateAnswers,
      };
      expect(() => requestQuestionCreate(
        token1, quizId1, question
      )).toThrow(HTTPError[400]);
    });

    test('There are no correct answers', () => {
      const question = {
        question: questionString,
        duration: 60,
        points: 5,
        answers: answersNoCorrect,
      };
      expect(() => requestQuestionCreate(
        token1, quizId1, question
      )).toThrow(HTTPError[400]);
    });

    // Error 400: The thumbnailUrl is an empty string
    test('Error 400: The thumbnailUrl is an empty string', () => {
      const question = {
        question: questionString,
        duration: 60,
        points: 5,
        answers: answers,
        thumbnailUrl: ''
      };

      expect(() => requestQuestionCreate(
        token1, quizId1, question
      )).toThrow(HTTPError[400]);
    });

    // Error 400: The thumbnailUrl is not jpg, jpeg, or png
    test('Error 400: The thumbnailUrl is not jpg, jpeg, or png', () => {
      expect(() => requestQuestionCreate(
        token1, quizId1, questionBodyInvType1V2
      )).toThrow(HTTPError[400]);

      expect(() => requestQuestionCreate(
        token1, quizId1, questionBodyInvType2V2
      )).toThrow(HTTPError[400]);
    });

    // Error 400: The thumbnailUrl does not begin with 'http://' or 'https://'
    test('Error 400: The thumbnailUrl does not begin with \'http://\' or ' +
         '\'https://\'', () => {
      expect(() => requestQuestionCreate(
        token1, quizId1, questionBodyInvFile1V2
      )).toThrow(HTTPError[400]);

      expect(() => requestQuestionCreate(
        token1, quizId1, questionBodyInvFile2V2
      )).toThrow(HTTPError[400]);
    });
  });

  describe('VALID Tests', () => {
    let token1: number;
    let quizId1: number;
    beforeEach(() => {
      token1 = requestRegister(
        'first.last1@gmail.com', 'abcd1234', 'first', 'last'
      ).token;
      quizId1 = requestQuizCreate(token1, 'first last', 'fist_test').quizId;
    });

    test('return question id', () => {
      const result = requestQuestionCreate(token1, quizId1, questionBodyV2);
      expect(result).toMatchObject({ questionId: expect.any(Number) });
    });

    test('return unique question id', () => {
      const result = requestQuestionCreate(token1, quizId1, questionBodyV2);
      const result2 = requestQuestionCreate(token1, quizId1, questionBody2V2);
      expect(result).not.toMatchObject(result2);
    });

    test('successfully create the question with correct infos', () => {
      const questionId = requestQuestionCreate(
        token1,
        quizId1,
        questionBodyV2
      ).questionId;

      const result = requestQuizInfo(token1, quizId1);

      expect(result.questions[0].questionId).toStrictEqual(questionId);
      expect(result.questions[0].question).toStrictEqual(questionString);
      expect(result.questions[0].duration).toStrictEqual(60);
      expect(result.questions[0].points).toStrictEqual(5);
      expect(result.questions[0].answers.length).toStrictEqual(2);
    });

    test('return question id', () => {
      const result = requestQuestionCreate(token1, quizId1, questionBody2V2);
      expect(result).toMatchObject({ questionId: expect.any(Number) });
    });

    test('return unique question id', () => {
      const result = requestQuestionCreate(token1, quizId1, questionBody2V2);
      const result2 = requestQuestionCreate(token1, quizId1, questionBody3V2);
      expect(result).not.toMatchObject(result2);
    });

    test('successfully create the question with correct infos', () => {
      const questionId = requestQuestionCreate(
        token1,
        quizId1,
        questionBodyV2
      ).questionId;

      const result = requestQuizInfo(token1, quizId1);

      expect(result.questions[0].questionId).toStrictEqual(questionId);
      expect(result.questions[0].question).toStrictEqual(questionString);
      expect(result.questions[0].duration).toStrictEqual(60);
      expect(result.questions[0].points).toStrictEqual(5);
      expect(result.questions[0].answers.length).toStrictEqual(2);
    });
  });
});

/// /////////////////////////////////////////////////////////////////////////////
/// /////////////////////////////// VERSION 1 ///////////////////////////////////
/// /////////////////////////////////////////////////////////////////////////////

describe('questionCreate', () => {
  describe('ERROR Tests 401 403', () => {
    test('token is not a valid user', () => {
      // token is not an integer
      expect(() => requestQuestionCreate(
        invalidUser, quizId, questionBody, true
      )).toThrow(HTTPError[401]);
    });

    test('Quiz ID does not refer to a valid quiz', () => {
      const token1 = requestRegister(
        'first.last1@gmail.com', 'abcd1234', 'first', 'last', true
      ).token;

      expect(() => requestQuestionCreate(
        token1, quizId, questionBody, true
      )).toThrow(HTTPError[403]);
    });

    test('Quiz ID does not refer to a quiz that this user owns', () => {
      const token1 = requestRegister(
        'first.last1@gmail.com', 'abcd1234', 'first', 'last', true
      ).token;

      const token2 = requestRegister(
        'first.last2@gmail.com', 'abcd1234', 'first', 'last', true
      ).token;

      const quizId1 = requestQuizCreate(
        token2, 'first last', 'fist_test', true
      ).quizId;

      expect(() => requestQuestionCreate(
        token1, quizId1, questionBody, true
      )).toThrow(HTTPError[403]);
    });
  });

  describe('ERROR Tests 400', () => {
    let token1: number;
    let quizId1: number;

    beforeEach(() => {
      token1 = requestRegister(
        'first.last1@gmail.com', 'abcd1234', 'first', 'last', true
      ).token;
      quizId1 = requestQuizCreate(
        token1, 'first last', 'fist_test', true
      ).quizId;
    });

    test('Question string is less than 5 characters in length', () => {
      const question = {
        question: invlalidQuestion1,
        duration: 60,
        points: 5,
        answers: answers,
      };
      expect(() => requestQuestionCreate(
        token1, quizId1, question, true
      )).toThrow(HTTPError[400]);
    });

    test('Question string is greater than 50 characters in length', () => {
      const question = {
        question: invlalidQuestion2,
        duration: 60,
        points: 5,
        answers: answers,
      };
      expect(() => requestQuestionCreate(
        token1, quizId1, question, true
      )).toThrow(HTTPError[400]);
    });

    test('The question has less than 2 answers', () => {
      const question = {
        question: questionString,
        duration: 60,
        points: 5,
        answers: invalidAnswerLength1,
      };
      expect(() => requestQuestionCreate(
        token1, quizId1, question, true
      )).toThrow(HTTPError[400]);
    });

    test('The question has more than 6 answers', () => {
      const question = {
        question: questionString,
        duration: 60,
        points: 5,
        answers: invalidAnswerLength2,
      };
      expect(() => requestQuestionCreate(
        token1, quizId1, question, true
      )).toThrow(HTTPError[400]);
    });

    test('The question duration is not a positive number', () => {
      expect(() => requestQuestionCreate(
        token1, quizId1, questionBodyNegativeDuration, true
      )).toThrow(HTTPError[400]);
    });

    test('The sum of the question durations exceeds 3 minutes', () => {
      // question body has a length of 60 seconds
      for (let i = 0; i < 3; i++) {
        requestQuestionCreate(token1, quizId1, questionBody, true);
      }

      // This will tip it up from 180 seconds.
      expect(() => requestQuestionCreate(
        token1, quizId1, questionBody, true
      )).toThrow(HTTPError[400]);
    });

    test('Sum of the question durations will be 181 seconds', () => {
      // question body has a length of 60 seconds
      for (let i = 0; i < 3; i++) {
        requestQuestionCreate(token1, quizId1, questionBody, true);
      }

      expect(() => requestQuestionCreate(token1, quizId1, {
        question: 'Who let the dogs out?',
        duration: 1,
        points: 10,
        answers: [
          { answer: 'who?', correct: false },
          { answer: 'you?', correct: true }
        ]
      }, true)).toThrow(HTTPError[400]);
    });

    test('The points awarded for the question are less than 1', () => {
      expect(() => requestQuestionCreate(
        token1, quizId1, questionBodyInvalidPoint1, true
      )).toThrow(HTTPError[400]);
    });

    test('The points awarded for the question are greater than 10', () => {
      expect(() => requestQuestionCreate(
        token1, quizId1, questionBodyInvalidPoint2, true
      )).toThrow(HTTPError[400]);
    });

    test('The length of any answer is shorter than 1 character long', () => {
      const question = {
        question: questionString,
        duration: 60,
        points: 5,
        answers: answersInvliadStringLength1,
      };
      expect(() => requestQuestionCreate(
        token1, quizId1, question, true
      )).toThrow(HTTPError[400]);
    });

    test('The length of any answer is longer than 30 characters long', () => {
      const question = {
        question: questionString,
        duration: 60,
        points: 5,
        answers: answersInvliadStringLength2,
      };
      expect(() => requestQuestionCreate(
        token1, quizId1, question, true
      )).toThrow(HTTPError[400]);
    });

    test('Any answer strings are duplicates within the same question', () => {
      const question = {
        question: questionString,
        duration: 60,
        points: 5,
        answers: answersDuplicateAnswers,
      };
      expect(() => requestQuestionCreate(
        token1, quizId1, question, true
      )).toThrow(HTTPError[400]);
    });

    test('There are no correct answers', () => {
      const question = {
        question: questionString,
        duration: 60,
        points: 5,
        answers: answersNoCorrect,
      };
      expect(() => requestQuestionCreate(
        token1, quizId1, question, true
      )).toThrow(HTTPError[400]);
    });
  });

  describe('VALID Tests', () => {
    let token1: number;
    let quizId1: number;
    beforeEach(() => {
      token1 = requestRegister(
        'first.last1@gmail.com', 'abcd1234', 'first', 'last', true
      ).token;
      quizId1 = requestQuizCreate(
        token1, 'first last', 'fist_test', true
      ).quizId;
    });

    test('return question id', () => {
      const result = requestQuestionCreate(token1, quizId1, questionBody, true);
      expect(result).toMatchObject({ questionId: expect.any(Number) });
    });

    test('return unique question id', () => {
      const result = requestQuestionCreate(token1, quizId1, questionBody, true);
      const result2 = requestQuestionCreate(
        token1, quizId1, questionBody2, true
      );
      expect(result).not.toMatchObject(result2);
    });

    test('successfully create the question with correct infos', () => {
      const questionId = requestQuestionCreate(
        token1,
        quizId1,
        questionBody,
        true
      ).questionId;

      const result = requestQuizInfo(token1, quizId1, true);

      expect(result.questions[0].questionId).toStrictEqual(questionId);
      expect(result.questions[0].question).toStrictEqual(questionString);
      expect(result.questions[0].duration).toStrictEqual(60);
      expect(result.questions[0].points).toStrictEqual(5);
      expect(result.questions[0].answers.length).toStrictEqual(2);
    });
  });
});
