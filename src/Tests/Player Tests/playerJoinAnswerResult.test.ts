import {
  // requestRegister,
  requestClear,
  // requestQuizCreate,
  // requestQuestionCreate,
  // requestguestJoinSession,
  // requestguestQuestionAnswer,
  // requestguestSessionResult,
  // requestQuizSessionStart,
  // requestQuizInfo,
  // requestSessionStatus,
  // requestSessionUpdate,
  // requestPlayerStatus,
} from '../testHelper';

/* const DO_NOT_DOWNLOAD = 'https://static.vecteezy.com/system/resources/thumbnails/016/894/217/small/white-background-white-polished-metal-abstract-white-gradient-background-blurred-white-backdrop-illustration-vector.jpg';

const sleep = require('atomic-sleep'); */

afterAll(() => {
  requestClear();
});

beforeEach(() => {
  requestClear();
});

describe('Test, plz remove', () => {
  test('Temp test', () => {
    expect(1 + 1).toBe(2);
  });
});

/*     interface Answer {
      answer: string
      correct: boolean
    }

    interface QuestionBody {
      thumbnailUrl: string,
      question: string,
      duration: number,
      points: number,
      answers: Answer[]
    }

describe('test for requestSubmitAnswer', () => {
  let token: number;
  let quizId: number;

  let sessionId: number;
  let playerId: number;
  let answerId11: number;
  let answerId12: number;

  const autoStartNum = 10;
  const questionBody1: QuestionBody = {
    question: "Who is Sam's favourite Disney princess?",
    duration: 1,
    points: 4,
    thumbnailUrl: DO_NOT_DOWNLOAD,
    answers: [
      {
        answer: 'Snow white',
        correct: true
      },
      {
        answer: 'Elsa',
        correct: false
      }
    ]
  };
  const questionBody2: QuestionBody = {
    question: "Who is Peter's favourite Pokemon?",
    thumbnailUrl: DO_NOT_DOWNLOAD,
    duration: 1,
    points: 4,
    answers: [
      {
        answer: 'Pikachu',
        correct: true
      },
      {
        answer: 'Eevee',
        correct: true
      }
    ]
  };

  beforeEach(() => {
    token = requestRegister('irene@gmail.com', 'Irene123', 'Irene', 'Abc').token;
    quizId = requestQuizCreate(token, 'Quiz', 'This is quiz 1').quizId;
    requestQuestionCreate(token, quizId, questionBody1);
    requestQuestionCreate(token, quizId, questionBody2);
    sessionId = requestQuizSessionStart(token, quizId, autoStartNum).sessionId;
    // LOBBY
    playerId = requestguestJoinSession(sessionId, 'Peter').playerId;
    //console.log(playerId)
    answerId11 = requestQuizInfo(token, quizId).questions[0].answers[0].answerId;
    answerId12 = requestQuizInfo(token,quizId).questions[0].answers[1].answerId;
  });

  describe('Error cases', () => {
    test("playerId doesn't exist", () => {
      requestSessionUpdate(token, quizId, sessionId, 'NEXT_QUESTION');
      // QUESTION1_COUNTDOWN
      sleep(100);
      // QUESTION1_OPEN
      const result = requestguestQuestionAnswer([answerId11], playerId + 1, 1);
      expect(result).toStrictEqual(400);
    });

    test('If question position is not valid for the session this player is in', () => {
      requestSessionUpdate(token, quizId, sessionId, 'NEXT_QUESTION');
      // QUESTION1_COUNTDOWN
      sleep(100);
      // QUESTION1_OPEN
      let result = requestguestQuestionAnswer([answerId11], playerId, 0);
      expect(result).toStrictEqual(400);
      result = requestguestQuestionAnswer([answerId11], playerId, 4);
      expect(result).toStrictEqual(400);
    });

    test('Session is not in QUESTION_OPEN state', () => {
      requestSessionUpdate(token, quizId, sessionId, 'NEXT_QUESTION');
      // QUESTION1_COUNTDOWN
      let result = requestguestQuestionAnswer([answerId11], playerId, 1);
      expect(result).toStrictEqual(400);
      sleep(100);
      // QUESTION1_OPEN
      sleep(1000);
      // QUESTION1_CLOSE
      result = requestguestQuestionAnswer([answerId11], playerId, 1);
      expect(result).toStrictEqual(400);
    });

    test('If session is not yet up to this question', () => {
      let result = requestguestQuestionAnswer([answerId11], playerId, 2);
      expect(result).toStrictEqual(400);
      requestSessionUpdate(token, quizId, sessionId, 'NEXT_QUESTION');
      // QUESTION1_COUNTDOWN
      result = requestguestQuestionAnswer([answerId11], playerId, 2);
      expect(result).toStrictEqual(400);
      sleep(100);
      // QUESTION1_OPEN
      result = requestguestQuestionAnswer([answerId11], playerId, 2);
      expect(result).toStrictEqual(400);
      sleep(1000);
      // QUESTION1_CLOSE
      result = requestguestQuestionAnswer([answerId11], playerId, 2);
      expect(result).toStrictEqual(400);
      requestSessionUpdate(token, quizId, sessionId, 'GO_TO_ANSWER');
      // ANSWER1_SHOW
      result = requestguestQuestionAnswer([answerId11], playerId, 2);
      expect(result).toStrictEqual(400);
      requestSessionUpdate(token, quizId, sessionId, 'NEXT_QUESTION');
      // QUESTION2_COUNTDOWN
      result = requestguestQuestionAnswer([answerId11], playerId, 2);
      expect(result).toStrictEqual(400);
      sleep(100);
      // QUESTION2_OPEN
      sleep(1000);
      // QUESTION2_CLOSE
      result = requestguestQuestionAnswer([answerId11], playerId, 2);
      expect(result).toStrictEqual(400);
      requestSessionUpdate(token, quizId, sessionId, 'GO_TO_FINAL_RESULTS');
    });
    test('Answer IDs are not valid for this particular question', () => {
      requestSessionUpdate(token, quizId, sessionId, 'NEXT_QUESTION');
      // QUESTION1_COUNTDOWN
      sleep(100);
      // QUESTION1_OPEN
      let result = requestguestQuestionAnswer([answerId11 + 100], playerId, 1);
      expect(result).toStrictEqual(400);
      result = requestguestQuestionAnswer([answerId11, answerId12 + 100], playerId, 1);
      expect(result).toStrictEqual(400);
    });

    test('There are duplicate answer IDs provided', () => {
      requestSessionUpdate(token, quizId, sessionId, 'NEXT_QUESTION');
      // QUESTION1_COUNTDOWN
      sleep(100);
      // QUESTION1_OPEN
      let result = requestguestQuestionAnswer([answerId11, answerId11], playerId, 1);
      expect(result).toStrictEqual(400);
      result = requestguestQuestionAnswer([answerId12, answerId12], playerId, 1);
      expect(result).toStrictEqual(400);
    });

    test('Less than 1 answer ID was submitted', () => {
      requestSessionUpdate(token, quizId, sessionId, 'NEXT_QUESTION');
      // QUESTION1_COUNTDOWN
      sleep(100);
      // QUESTION1_OPEN
      let result = requestguestQuestionAnswer([], playerId, 1);
      expect(result).toStrictEqual(400);
    });
  });

  describe('Successful cases', () => {
    test('Correct return', () => {
      requestSessionUpdate(token, quizId, sessionId, 'NEXT_QUESTION');
      // QUESTION1_COUNTDOWN
      sleep(100);
      // QUESTION1_OPEN
      expect(requestguestQuestionAnswer([answerId11], playerId, 1)).toStrictEqual({});
    });

    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! add test case after finish the score calculation
  });
});

describe('test for requestPlayerJoin', () => {
  let token: number;
  let quizId: number;
  let sessionId: number;
  const autoStartNum = 5;
  const questionBody1: QuestionBody = {
    question: "Who is Sam's favourite Disney princess?",
    duration: 1,
    points: 4,
    thumbnailUrl: DO_NOT_DOWNLOAD,
    answers: [
      {
        answer: 'Snow white',
        correct: true
      },
      {
        answer: 'Elsa',
        correct: false
      }
    ]
  };
  const questionBody2: QuestionBody = {
    question: "Who is Peter's favourite Pokemon?",
    thumbnailUrl: DO_NOT_DOWNLOAD,
    duration: 1,
    points: 4,
    answers: [
      {
        answer: 'Pikachu',
        correct: true
      },
      {
        answer: 'Eevee',
        correct: true
      }
    ]
  };

  beforeEach(() => {
    token = requestRegister('irene@gmail.com', 'Irene123', 'Irene', 'Abc').token;
    quizId = requestQuizCreate(token, 'Quiz', 'This is quiz 1').quizId;
    requestQuestionCreate(token, quizId, questionBody1);
    requestQuestionCreate(token, quizId, questionBody2);
    sessionId = requestQuizSessionStart(token, quizId, autoStartNum).sessionId;
  });

  describe('Error case', () => {
    test('Name of user entered is not unique (compared to other users who have already joined)', () => {
      requestguestJoinSession(sessionId, 'Peter');
      let result = requestguestJoinSession(sessionId, 'Peter');
      expect(result).toStrictEqual(400);
    });

    test('Session is not in LOBBY state', () => {
      requestSessionUpdate(token, quizId, sessionId, 'NEXT_QUESTION');
      // QUESTION1_COUNTDOWN
      let result = requestguestJoinSession(sessionId, 'Peter');
      expect(result).toStrictEqual(400);
      sleep(100);
      // QUESTION1_OPEN
      result = requestguestJoinSession(sessionId, 'Peter');
      expect(result).toStrictEqual(400);
      sleep(1000);
      // QUESTION1_CLOSE
      result = requestguestJoinSession(sessionId, 'Peter');
      expect(result).toStrictEqual(400);
      requestSessionUpdate(token, quizId, sessionId, 'GO_TO_ANSWER');
      // ANSWER1_SHOW
      result = requestguestJoinSession(sessionId, 'Peter');
      expect(result).toStrictEqual(400);
      requestSessionUpdate(token, quizId, sessionId, 'NEXT_QUESTION');
      // QUESTION2_COUNTDOWN
      result = requestguestJoinSession(sessionId, 'Peter');
      expect(result).toStrictEqual(400);
      sleep(100);
      // QUESTION2_OPEN
      result = requestguestJoinSession(sessionId, 'Peter');
      expect(result).toStrictEqual(400);
      sleep(1000);
      // QUESTION2_CLOSE
      result = requestguestJoinSession(sessionId, 'Peter');
      expect(result).toStrictEqual(400);
      requestSessionUpdate(token, quizId, sessionId, 'GO_TO_FINAL_RESULTS');
      // FINAL_RESULTS
      result = requestguestJoinSession(sessionId, 'Peter');
      expect(result).toStrictEqual(400);
      requestSessionUpdate(token, quizId, sessionId, 'END');
      // END
      result = requestguestJoinSession(sessionId, 'Peter');
      expect(result).toStrictEqual(400);
    });
  });
  describe('Successful case', () => {
    test('Correct return', () => {
      expect(requestguestJoinSession(sessionId, 'Peter')).toStrictEqual({ playerId: expect.any(Number) });
    });
    test('Correct return - empty name', () => {
      expect(requestguestJoinSession(sessionId, '')).toStrictEqual({ playerId: expect.any(Number) });
    });
    test('Add multiple players and player IDs are different', () => {
      const result = requestguestJoinSession(sessionId, 'Peter');
      expect(result).toStrictEqual({ playerId: expect.any(Number) });
      const result2 = requestguestJoinSession(sessionId, 'Billy');
      expect(result2).toStrictEqual({ playerId: expect.any(Number) });
      expect(result).not.toEqual(result2);
    });
    test('Check correct functionality using playerStatus', () => {
      const playerId = requestguestJoinSession(sessionId, 'Peter').playerId;
      const result = requestPlayerStatus(playerId);
      expect(result).toStrictEqual({
        state: 'LOBBY',
        numQuestions: 2,
        atQuestion: 0
      });
    });
    test('Check correct functionality using sessionStatus (ascending order of names)', () => {
      requestguestJoinSession(sessionId, 'Cake');
      requestguestJoinSession(sessionId, 'Peter');
      requestguestJoinSession(sessionId, 'Billy');
      const result = requestSessionStatus(token, quizId, sessionId);
      expect(result.players).toStrictEqual([
        'Billy',
        'Cake',
        'Peter',
      ]);
    });
    test('Check for auto start the game', () => {
      for (let i = 0; i < 4; i++) {
        requestguestJoinSession(sessionId, '');
        const result = requestSessionStatus(token, quizId, sessionId);
        expect(result.state).toStrictEqual('LOBBY');
      }
      requestguestJoinSession(sessionId, '');
      const result = requestSessionStatus(token, quizId, sessionId);
      expect(result.state).toStrictEqual('QUESTION_COUNTDOWN');
    });
  });
});

describe('Get player session result tests', () => {
  let token: number;
  let quizId: number;
  let sessionId: number;
  const autoStartNum = 10;
  let questionId1: number;
  let questionId2: number;
  let playerId: number;
  const questionBody1: QuestionBody = {
    question: "Who is Sam's favourite Disney princess?",
    duration: 10,
    points: 4,
    thumbnailUrl: DO_NOT_DOWNLOAD,
    answers: [
      {
        answer: 'Snow white',
        correct: true
      },
      {
        answer: 'Elsa',
        correct: false
      }
    ]
  };
  const questionBody2: QuestionBody = {
    question: "Who is Peter's favourite Pokemon?",
    thumbnailUrl: DO_NOT_DOWNLOAD,
    duration: 30,
    points: 7,
    answers: [
      {
        answer: 'Pikachu',
        correct: true
      },
      {
        answer: 'Eevee',
        correct: true
      }
    ]
  };

  beforeEach(() => {
    token = requestRegister('splashbro@gmail.com', 'pointguard5', 'Steph', 'Curry').token;
    quizId = requestQuizCreate(token, 'Quiz', 'This is quiz 1').quizId;
    questionId1 = requestQuestionCreate(token, quizId, questionBody1).questionId;
    questionId2 = requestQuestionCreate(token, quizId, questionBody2).questionId;
    sessionId = requestQuizSessionStart(token, quizId, autoStartNum).sessionId;
  });

  describe('Error cases', () => {
    test("playerId doesn't exist", () => {
      playerId = requestguestJoinSession(sessionId, 'Name').playerId;
      requestSessionUpdate(token, quizId, sessionId, 'NEXT_QUESTION');
      sleep(105);
      requestSessionUpdate(token, quizId, sessionId, 'GO_TO_ANSWER');
      requestSessionUpdate(token, quizId, sessionId, 'NEXT_QUESTION');
      sleep(105);
      requestSessionUpdate(token, quizId, sessionId, 'GO_TO_ANSWER');
      requestSessionUpdate(token, quizId, sessionId, 'GO_TO_FINAL_RESULTS');
      let result = requestguestSessionResult(playerId + 12345);
      expect(result).toStrictEqual(400);
    });

    test('Session is not in FINAL_RESULT state', () => {
      playerId = requestguestJoinSession(sessionId, 'Name').playerId;
      let result = requestguestSessionResult(playerId);
      expect(result).toStrictEqual(400);
    });
  });

  test('Successful case', () => {
    let questionNum: number;

    const playerName = 'Reynold';
    const playerName2 = 'Sam';
    const playerName3 = 'Nathaniel';

    const playerId = requestguestJoinSession(sessionId, playerName).playerId;
    const playerId2 = requestguestJoinSession(sessionId, playerName2).playerId;
    const playerId3 = requestguestJoinSession(sessionId, playerName3).playerId;

    const answerId1 = requestQuizInfo(token,quizId).questions[0].answers[0].answerId;
    const answerId2 = requestQuizInfo(token,quizId).questions[0].answers[1].answerId;
    const answerId3 = requestQuizInfo(token,quizId).questions[1].answers[0].answerId;
    const answerId4 = requestQuizInfo(token,quizId).questions[1].answers[1].answerId;

    requestSessionUpdate(token, quizId, sessionId, 'NEXT_QUESTION');
    sleep(100);
    // Open State
    questionNum = requestSessionStatus(token, quizId, sessionId).atQuestion;
    requestguestQuestionAnswer([answerId1], playerId, questionNum);
    requestguestQuestionAnswer([answerId2], playerId2, questionNum);
    requestguestQuestionAnswer([answerId1], playerId3, questionNum);

    // Closed State
    requestSessionUpdate(token, quizId, sessionId, 'GO_TO_ANSWER');
    requestSessionUpdate(token, quizId, sessionId, 'NEXT_QUESTION');
    sleep(100);
    questionNum = requestSessionStatus(token, quizId, sessionId).atQuestion;
    requestguestQuestionAnswer([answerId3, answerId4], playerId, questionNum);
    requestguestQuestionAnswer([answerId3, answerId4], playerId2, questionNum);
    requestguestQuestionAnswer([answerId3], playerId3, questionNum);

    requestSessionUpdate(token, quizId, sessionId, 'GO_TO_ANSWER');
    requestSessionUpdate(token, quizId, sessionId, 'GO_TO_FINAL_RESULTS');
    //console.log(playerId);
    const results = requestguestSessionResult(playerId);
    console.log(results);
    expect(results).toStrictEqual({
      usersRankedByScore: [
        {
          name: playerName,
          score: 11
        },
        {
          name: playerName2,
          score: 3.5
        },
        {
          name: playerName3,
          score: 2
        }
      ],
      questionResults: [
        {
          questionId: expect.any(Number),

          playersCorrentList: [
            playerName3,
            playerName,
          ],
          averageAnswerTime: expect.any(Number),
          percentCorrect: 66
        },
        {
          questionId: expect.any(Number),

            playersCorrentList: [
              playerName3,
              playerName,
              playerName2,
            ],
          averageAnswerTime: expect.any(Number),
          percentCorrect: 66
        }
      ]

    });
  });
}); */
