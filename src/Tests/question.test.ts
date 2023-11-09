import {
  requestClear,
  requestRegister,
  requestQuizCreate,
  requestQuestionCreate,
  requestQuizInfo
} from './testHelper';

/// ////////////////////////////////////////////////////////////////////////////
/// //////////////////////////////// Tests /////////////////////////////////////
/// ////////////////////////////////////////////////////////////////////////////

const ERROR = { error: expect.any(String) };

const invalidUser = 10000;
const quizId = -4123214;
const invlalidQuestion1 = 'asdf';
const invlalidQuestion2 = 'qweasdzsfhkngkujdfhgujklhgjbfrtyfghvbnsadsafsafsafc';
const questionString = 'How to call a person without a body and a nose?';

const answers = [
  {
    answer: 'Nobody Knows',
    correct: true
  },
  {
    answer: 'Onebody Knows',
    correct: false
  }
];

const answers2 = [
  {
    answer: 'Nobody Knows',
    correct: true
  },
  {
    answer: 'Onebody Knows',
    correct: false
  },
  {
    answer: 'Twobody Knows',
    correct: true
  },
  {
    answer: 'Threebody Knows',
    correct: false
  }
];

const invalidAnswerLength1 = [
  {
    answer: 'Nobody Knows',
    correct: true
  }
];

const invalidAnswerLength2 = [
  {
    answer: 'Nobody Knows',
    correct: true
  },
  {
    answer: 'Onebody Knows',
    correct: false
  },
  {
    answer: 'Twobody Knows',
    correct: false
  },
  {
    answer: 'Threebody Knows',
    correct: false
  },
  {
    answer: 'Fourbody Knows',
    correct: false
  },
  {
    answer: 'Fivebody Knows',
    correct: false
  },
  {
    answer: 'Sixbody Knows',
    correct: false
  }
];

const answersInvliadStringLength1 = [
  {
    answer: 'Nobody Knows',
    correct: true
  },
  {
    answer: '',
    correct: false
  },
  {
    answer: 'Twobody Knows',
    correct: false
  },
  {
    answer: 'Threebody Knows',
    correct: false
  }
];

const answersInvliadStringLength2 = [
  {
    answer: 'Nobody Knows',
    correct: true
  },
  {
    answer: 'Onebody Knows',
    correct: false
  },
  {
    answer: 'Twobody Knows',
    correct: false
  },
  {
    answer: 'Threebody Knowsssssssssssssssss',
    correct: false
  }
];

const answersDuplicateAnswers = [
  {
    answer: 'Nobody Knows',
    correct: true
  },
  {
    answer: 'Onebody Knows',
    correct: false
  },
  {
    answer: 'Nobody Knows',
    correct: false
  },
  {
    answer: 'Threebody Knows',
    correct: false
  }
];

const answersNoCorrect = [
  {
    answer: 'Nobody Knows',
    correct: false
  },
  {
    answer: 'Onebody Knows',
    correct: false
  },
  {
    answer: 'Twobody Knows',
    correct: false
  },
  {
    answer: 'Threebody Knows',
    correct: false
  }
];

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

beforeEach(() => {
  requestClear();
});

describe('questionCreate', () => {
  describe('ERROR Tests 401 403', () => {
    test('token is not a valid user', () => {
      // token is not an integer
      const result = requestQuestionCreate(invalidUser, quizId, questionBody);
      expect(result).toMatchObject(ERROR);
    });

    test('Quiz ID does not refer to a valid quiz', () => {
      const token1 = requestRegister('first.last1@gmail.com', 'abcd1234', 'first', 'last').token;
      const result = requestQuestionCreate(token1, quizId, questionBody);

      expect(result).toMatchObject(ERROR);
    });

    test('Quiz ID does not refer to a quiz that this user owns', () => {
      const token1 = requestRegister('first.last1@gmail.com', 'abcd1234', 'first', 'last').token;
      const token2 = requestRegister('first.last2@gmail.com', 'abcd1234', 'first', 'last').token;
      const quizId1 = requestQuizCreate(token2, 'first last', 'fist_test').quizId;

      const result = requestQuestionCreate(token1, quizId1, questionBody);

      expect(result).toMatchObject(ERROR);
    });
  });

  describe('ERROR Tests 400', () => {
    let token1: number;
    let quizId1: number;

    beforeEach(() => {
      token1 = requestRegister('first.last1@gmail.com', 'abcd1234', 'first', 'last').token;
      quizId1 = requestQuizCreate(token1, 'first last', 'fist_test').quizId;
    });

    test('Question string is less than 5 characters in length', () => {
      const question = {
        question: invlalidQuestion1,
        duration: 60,
        points: 5,
        answers: answers,
      };
      const result = requestQuestionCreate(token1, quizId1, question);
      expect(result).toMatchObject(ERROR);
    });

    test('Question string is greater than 50 characters in length', () => {
      const question = {
        question: invlalidQuestion2,
        duration: 60,
        points: 5,
        answers: answers,
      };
      const result = requestQuestionCreate(token1, quizId1, question);
      expect(result).toMatchObject(ERROR);
    });

    test('The question has less than 2 answers', () => {
      const question = {
        question: questionString,
        duration: 60,
        points: 5,
        answers: invalidAnswerLength1,
      };
      const result = requestQuestionCreate(token1, quizId1, question);
      expect(result).toMatchObject(ERROR);
    });

    test('The question has more than 6 answers', () => {
      const question = {
        question: questionString,
        duration: 60,
        points: 5,
        answers: invalidAnswerLength2,
      };
      const result = requestQuestionCreate(token1, quizId1, question);
      expect(result).toMatchObject(ERROR);
    });

    test('The question duration is not a positive number', () => {
      const result = requestQuestionCreate(token1, quizId1, questionBodyNegativeDuration);
      expect(result).toMatchObject(ERROR);
    });

    test('The sum of the question durations in the quiz exceeds 3 minutes', () => {
      // question body has a length of 60 seconds
      for (let i = 0; i < 3; i++) {
        const result = requestQuestionCreate(token1, quizId1, questionBody);
        expect(result).not.toMatchObject(ERROR);
      }

      const result = requestQuestionCreate(token1, quizId1, questionBody);
      expect(result).toMatchObject(ERROR);
    });

    test('Sum of the question durations in the quiz will be 181 seconds', () => {
      // question body has a length of 60 seconds
      for (let i = 0; i < 3; i++) {
        const result = requestQuestionCreate(token1, quizId1, questionBody);
        expect(result).not.toMatchObject(ERROR);
      }

      const result = requestQuestionCreate(token1, quizId1, {
        question: 'Who let the dogs out?',
        duration: 1,
        points: 10,
        answers: [
          { answer: 'who?', correct: false },
          { answer: 'you?', correct: true }
        ]
      });
      expect(result).toMatchObject(ERROR);
    });

    test('The points awarded for the question are less than 1', () => {
      const result = requestQuestionCreate(token1, quizId1, questionBodyInvalidPoint1);
      expect(result).toMatchObject(ERROR);
    });

    test('The points awarded for the question are greater than 10', () => {
      const result = requestQuestionCreate(token1, quizId1, questionBodyInvalidPoint2);
      expect(result).toMatchObject(ERROR);
    });

    test('The length of any answer is shorter than 1 character long', () => {
      const question = {
        question: questionString,
        duration: 60,
        points: 5,
        answers: answersInvliadStringLength1,
      };
      const result = requestQuestionCreate(token1, quizId1, question);
      expect(result).toMatchObject(ERROR);
    });

    test('The length of any answer is longer than 30 characters long', () => {
      const question = {
        question: questionString,
        duration: 60,
        points: 5,
        answers: answersInvliadStringLength2,
      };
      const result = requestQuestionCreate(token1, quizId1, question);
      expect(result).toMatchObject(ERROR);
    });

    test('Any answer strings are duplicates of one another (within the same question)', () => {
      const question = {
        question: questionString,
        duration: 60,
        points: 5,
        answers: answersDuplicateAnswers,
      };
      const result = requestQuestionCreate(token1, quizId1, question);
      expect(result).toMatchObject(ERROR);
    });

    test('There are no correct answers', () => {
      const question = {
        question: questionString,
        duration: 60,
        points: 5,
        answers: answersNoCorrect,
      };
      const result = requestQuestionCreate(token1, quizId1, question);
      expect(result).toMatchObject(ERROR);
    });
  });

  describe('VALID Tests', () => {
    let token1: number;
    let quizId1: number;
    beforeEach(() => {
      token1 = requestRegister('first.last1@gmail.com', 'abcd1234', 'first', 'last').token;
      quizId1 = requestQuizCreate(token1, 'first last', 'fist_test').quizId;
    });

    test('return question id', () => {
      const result = requestQuestionCreate(token1, quizId1, questionBody);
      expect(result).toMatchObject({ questionId: expect.any(Number) });
    });

    test('return unique question id', () => {
      const result = requestQuestionCreate(token1, quizId1, questionBody);
      const result2 = requestQuestionCreate(token1, quizId1, questionBody2);
      expect(result).not.toMatchObject(result2);
    });

    test('successfully create the question with correct infos', () => {
      const questionId = requestQuestionCreate(
        token1,
        quizId1,
        questionBody
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
