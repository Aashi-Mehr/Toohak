import HTTPError from 'http-errors';
// import { Action } from '../dataStore';
import {
  requestClear,
  requestRegister,
  requestQuizCreate,
  requestQuizSessionStart,
  requestQuestionCreate,
  requestQuizSessionUpdate
} from '../testHelper';

import { sleepSync } from '../../dataStore';

/// ////////////////////////////////////////////////////////////////////////////
/// //////////////////////////////// Tests /////////////////////////////////////
/// ////////////////////////////////////////////////////////////////////////////

const questionBody = {
  question: 'What is the first letter of the alphabet?',
  duration: 10,
  points: 5,
  answers: [
    { answer: 'a', correct: true },
    { answer: 'b', correct: false },
    { answer: 'c', correct: false },
    { answer: 'd', correct: false }
  ]
};

let token1: number;
let quizId1: number;
let sessionId1: number;
let token2: number;
let quizId2: number;
let sessionId2: number;

// Clearing the datastore
beforeEach(() => {
  requestClear();

  // User 1 and their quiz
  token1 = requestRegister('am@gmail.com', 'Val1Pass', 'fir', 'las').token;
  quizId1 = requestQuizCreate(token1, 'New Quiz', '').quizId;
  requestQuestionCreate(token1, quizId1, questionBody);
  sessionId1 = requestQuizSessionStart(token1, quizId1, 20).sessionId;

  // User 2 and their quiz
  token2 = requestRegister('ab@gmail.com', 'Val1Pass', 'fir', 'las').token;
  quizId2 = requestQuizCreate(token2, 'New Quiz', '').quizId;
  requestQuestionCreate(token2, quizId2, questionBody);
  sessionId2 = requestQuizSessionStart(token2, quizId2, 40).sessionId;
});

describe('Invalid Cases - Session ID, Quiz ID and Token', () => {
  // 400 : Invalid Session Id
  test('400 : Empty Session Id', () => {
    expect(() => requestQuizSessionUpdate(
      quizId1, 0, token1, 'NEXT_QUESTION')).toThrow(HTTPError[400]);
  });
  test('400 : Invalid Session Id', () => {
    expect(() => requestQuizSessionUpdate(
      quizId1, sessionId1 + 1, token1, 'next_question')).toThrow(HTTPError[400]);
  });

  // 401 : Invalid Token
  test('401 : Empty Token', () => {
    expect(() => requestQuizSessionUpdate(
      quizId1, sessionId1, 0, 'next_question')).toThrow(HTTPError[401]);
  });
  test('401 : Invalid Token', () => {
    expect(() => requestQuizSessionUpdate(
      quizId1, sessionId1, token1 + 1, 'next_question')).toThrow(HTTPError[401]);
  });
  test('401 : Empty Token', () => {
    expect(() => requestQuizSessionUpdate(
      quizId1, sessionId1, -1, 'next_question')).toThrow(HTTPError[401]);
  });

  // 403 : Invalid Quiz Id
  test('403 : Invalid Quiz Id', () => {
    expect(() => requestQuizSessionUpdate(
      quizId1 + 1, sessionId1, token1, 'next_question')).toThrow(HTTPError[403]);
  });
  test('403 : Empty Quiz Id', () => {
    expect(() => requestQuizSessionUpdate(
      0, sessionId1, token1, 'next_question')).toThrow(HTTPError[403]);
  });
  test('403 : Out of range Quiz Id', () => {
    expect(() => requestQuizSessionUpdate(
      -1, sessionId1, token1, 'next_question')).toThrow(HTTPError[403]);
  });

  // 403 : Quiz not owned by user
  test('403 : Quiz Not Owned By User 1', () => {
    expect(() => requestQuizSessionUpdate(
      quizId2, sessionId2, token1, 'next_question')).toThrow(HTTPError[403]);
  });
  test('403 : Quiz Not Owned By User 2', () => {
    expect(() => requestQuizSessionUpdate(
      quizId1, sessionId2, token2, 'next_question')).toThrow(HTTPError[403]);
  });

  // Not sure whether these 2 400 or 403
  test('403 : Session Does Not Owned by Quiz', () => {
    expect(() => requestQuizSessionUpdate(
      quizId1, sessionId2, token1, 'next_question')).toThrow(HTTPError[400]);
  });
  test('403 : Session Does Not Owned by Quiz', () => {
    expect(() => requestQuizSessionUpdate(
      quizId2, sessionId1, token2, 'next_question')).toThrow(HTTPError[400]);
  });
});

describe('Invalid Cases - Action', () => {
  // 400 : Empty action
  test('400 : Empty Action', () => {
    expect(() => requestQuizSessionUpdate(
      quizId1, sessionId1, token1, '')).toThrow(HTTPError[400]);
  });

  // 400 : Invalid Actions - NEXT_QUESTION
  // Errors when user in question_open
  test('400 : Invalid Action - Next question at Question Open', () => {
    // Move player to question countdown by action next_question
    requestQuizSessionUpdate(quizId1, sessionId1, token1, 'next_question');
    // Move player to question open by action skip_countdown
    requestQuizSessionUpdate(quizId1, sessionId1, token1, 'skip_countdown');
    // Player input skip_countdown action
    expect(() => requestQuizSessionUpdate(
      quizId1, sessionId1, token1, 'next_question')).toThrow(HTTPError[400]);
  });
  // Errors when user in question_countdown
  test('400 : Invalid Action - Next question at Question Countdown', () => {
    // Move player to question countdown by action next_question
    requestQuizSessionUpdate(quizId1, sessionId1, token1, 'next_question');
    // Player input skip_countdown action
    expect(() => requestQuizSessionUpdate(
      quizId1, sessionId1, token1, 'next_question')).toThrow(HTTPError[400]);
  });
  // Error when user in final_results
  test('400 : Invalid Action - Next question at Final Results', () => {
    // Move player to question countdown by action next_question
    requestQuizSessionUpdate(quizId1, sessionId1, token1, 'next_question');
    // Move player to question open by action skip_countdown
    requestQuizSessionUpdate(quizId1, sessionId1, token1, 'skip_countdown');
    // Move player to answer show by action go_to_answer
    requestQuizSessionUpdate(quizId1, sessionId1, token1, 'go_to_answer');
    // Move player to results show by action go_to_final_results
    requestQuizSessionUpdate(quizId1, sessionId1, token1, 'go_to_final_results');
    // Player input skip_countdown action
    expect(() => requestQuizSessionUpdate(
      quizId1, sessionId1, token1, 'next_question')).toThrow(HTTPError[400]);
  });
  // Error when user in end
  test('400 : Invalid Action - Next question at End', () => {
    // Move player to question countdown by action next_question
    requestQuizSessionUpdate(quizId1, sessionId1, token1, 'end');
    // Player input skip_countdown action
    expect(() => requestQuizSessionUpdate(
      quizId1, sessionId1, token1, 'next_question')).toThrow(HTTPError[400]);
  });

  // 400 : Invalid Actions - SKIP COUNTDOWN
  // Errors when user in lobby
  test('400 : Invalid Action - Skip countdown at Lobby', () => {
    expect(() => requestQuizSessionUpdate(
      quizId1, sessionId1, token1, 'skip_countdown')).toThrow(HTTPError[400]);
  });
  // Errors when user in question open
  test('400 : Invalid Action - Skip countdown at Question Open', () => {
    // Move player to question countdown by action next_question
    requestQuizSessionUpdate(quizId1, sessionId1, token1, 'next_question');
    // Move player to question open by action skip_countdown
    requestQuizSessionUpdate(quizId1, sessionId1, token1, 'skip_countdown');
    // Player input skip_countdown action
    expect(() => requestQuizSessionUpdate(
      quizId1, sessionId1, token1, 'skip_countdown')).toThrow(HTTPError[400]);
  });
  // Error when user in answer_show
  test('400 : Invalid Action - Skip countdown at Answer Show', () => {
    // Move player to question countdown by action next_question
    requestQuizSessionUpdate(quizId1, sessionId1, token1, 'next_question');
    // Move player to question open by action skip_countdown
    requestQuizSessionUpdate(quizId1, sessionId1, token1, 'skip_countdown');
    // Move player to answer show by action go_to_answer
    requestQuizSessionUpdate(quizId1, sessionId1, token1, 'go_to_answer');
    // Player input skip_countdown action
    expect(() => requestQuizSessionUpdate(
      quizId1, sessionId1, token1, 'skip_countdown')).toThrow(HTTPError[400]);
  });
  // Error when user in final_results
  test('400 : Invalid Action - Skip countdown at Final Results', () => {
    // Move player to question countdown by action next_question
    requestQuizSessionUpdate(quizId1, sessionId1, token1, 'next_question');
    // Move player to question open by action skip_countdown
    requestQuizSessionUpdate(quizId1, sessionId1, token1, 'skip_countdown');
    // Move player to answer show by action go_to_answer
    requestQuizSessionUpdate(quizId1, sessionId1, token1, 'go_to_answer');
    // Move player to results show by action go_to_final_results
    requestQuizSessionUpdate(quizId1, sessionId1, token1, 'go_to_final_results');
    // Player input skip_countdown action
    expect(() => requestQuizSessionUpdate(
      quizId1, sessionId1, token1, 'skip_countdown')).toThrow(HTTPError[400]);
  });
  // Error when user in end
  test('400 : Invalid Action - Skip countdown at End', () => {
    // Move player to question countdown by action next_question
    requestQuizSessionUpdate(quizId1, sessionId1, token1, 'end');
    // Player input skip_countdown action
    expect(() => requestQuizSessionUpdate(
      quizId1, sessionId1, token1, 'skip_countdown')).toThrow(HTTPError[400]);
  });

  // 400 : Invalid Actions - GO TO ANSWER
  // Error when user in lobby
  test('400 : Invalid Action - Go to answer at Lobby', () => {
    expect(() => requestQuizSessionUpdate(
      quizId1, sessionId1, token1, 'go_to_answer')).toThrow(HTTPError[400]);
  });
  // Error when user in question_countdown
  test('400 : Invalid Action - Go to answer at Question Countdown', () => {
    // Move player to question countdown by action next_question
    requestQuizSessionUpdate(quizId1, sessionId1, token1, 'next_question');
    // Player input go_to_answer action
    expect(() => requestQuizSessionUpdate(
      quizId1, sessionId1, token1, 'go_to_answer')).toThrow(HTTPError[400]);
  });
  // Error when user in final_result
  test('400 : Invalid Action - Go to answer at Final Result', () => {
    // Move player to question countdown by action next_question
    requestQuizSessionUpdate(quizId1, sessionId1, token1, 'next_question');
    // Move player to question open by action skip_countdown
    requestQuizSessionUpdate(quizId1, sessionId1, token1, 'skip_countdown');
    // Move player to answer show by action go_to_answer
    requestQuizSessionUpdate(quizId1, sessionId1, token1, 'go_to_answer');
    // Move player to final results by action go_to_final_results
    requestQuizSessionUpdate(quizId1, sessionId1, token1, 'go_to_final_result');
    // Player input go_to_answer action
    expect(() => requestQuizSessionUpdate(
      quizId1, sessionId1, token1, 'go_to_answer')).toThrow(HTTPError[400]);
  });
  // Error when user in end
  test('400 : Invalid Action - Go to answer at End', () => {
    // Move player to end by action end
    requestQuizSessionUpdate(quizId1, sessionId1, token1, 'end');
    // Player input go_to_answer action
    expect(() => requestQuizSessionUpdate(
      quizId1, sessionId1, token1, 'go_to_answer')).toThrow(HTTPError[400]);
  });

  // 400 : Invalid Actions - GO TO FINAL RESULTS
  // Error when user in lobby
  test('400 : Invalid Action - Go to final results at Lobby', () => {
    // Player input go_to_final_results action
    expect(() => requestQuizSessionUpdate(
      quizId1, sessionId1, token1, 'go_to_final_results')).toThrow(HTTPError[400]);
  });
  // Error when user in question_countdown
  test('400 : Invalid Action - Go to final results at Question Countdown', () => {
    // Move player to question countdown by next_question action
    requestQuizSessionUpdate(quizId1, sessionId1, token1, 'next_question');
    // Player input go_to_final_results action
    expect(() => requestQuizSessionUpdate(
      quizId1, sessionId1, token1, 'go_to_final_results')).toThrow(HTTPError[400]);
  });
  // Error when user in question_open
  test('400 : Invalid Action - Go to final results at Question Open', () => {
    // Move player to question countdown by next_question action
    requestQuizSessionUpdate(quizId1, sessionId1, token1, 'next_question');
    // Move player to question open by skip_countdown action
    requestQuizSessionUpdate(quizId1, sessionId1, token1, 'skip_countdown');
    // Player input go_to_final_results action
    expect(() => requestQuizSessionUpdate(
      quizId1, sessionId1, token1, 'go_to_final_results')).toThrow(HTTPError[400]);
  });
  // Error when user in end
  test('400 : Invalid Action - Go to final results at End', () => {
    // Move player to end by end action
    requestQuizSessionUpdate(quizId1, sessionId1, token1, 'end');
    // Player input go_to_final_results action
    expect(() => requestQuizSessionUpdate(
      quizId1, sessionId1, token1, 'go_to_final_results')).toThrow(HTTPError[400]);
  });
});

describe('Valid Cases', () => {
  test('next_question at LOBBY', () => {
    const result = requestQuizSessionUpdate(
      quizId1, sessionId1, token1, 'next_question');
    expect(result).toMatchObject({});
  });
  test('end at LOBBY', () => {
    const result = requestQuizSessionUpdate(
      quizId2, sessionId2, token2, 'end');
    expect(result).toMatchObject({});
  });

  // When player at question countdown state
  test('skip_countdown at QUESTION COUNTDOWN route 1', () => {
    requestQuizSessionUpdate(quizId1, sessionId1, token1, 'next_question');
    const result = requestQuizSessionUpdate(
      quizId2, sessionId2, token2, 'skip_countdown');
    expect(result).toMatchObject({});
  });
  test('skip_countdown at QUESTION COUNTDOWN route 2', () => {
    requestQuizSessionUpdate(quizId1, sessionId1, token1, 'next_question');
    requestQuizSessionUpdate(quizId1, sessionId1, token1, 'skip_countdown');
    requestQuizSessionUpdate(quizId1, sessionId1, token1, 'go_to_answer');
    requestQuizSessionUpdate(quizId1, sessionId1, token1, 'next_question');
    const result = requestQuizSessionUpdate(
      quizId2, sessionId2, token2, 'skip_countdown');
    expect(result).toMatchObject({});
  });
  test('end at QUESTION COUNTDOWN', () => {
    const result = requestQuizSessionUpdate(
      quizId2, sessionId2, token2, 'end');
    expect(result).toMatchObject({});
  });

  // When player at question open state
  test('go_to_answer at QUESTION OPEN route 1', () => {
    requestQuizSessionUpdate(quizId1, sessionId1, token1, 'next_question');
    requestQuizSessionUpdate(quizId1, sessionId1, token1, 'skip_countdown');
    const result = requestQuizSessionUpdate(
      quizId2, sessionId2, token2, 'go_to_answer');
    expect(result).toMatchObject({});
  });
  test('go_to_answer at QUESTION OPEN route 2', () => {
    requestQuizSessionUpdate(quizId1, sessionId1, token1, 'next_question');
    sleepSync(3000);
    const result = requestQuizSessionUpdate(
      quizId2, sessionId2, token2, 'go_to_answer');
    expect(result).toMatchObject({});
  });
  test('end at QUESTION OPEN route 1', () => {
    requestQuizSessionUpdate(quizId1, sessionId1, token1, 'next_question');
    requestQuizSessionUpdate(quizId1, sessionId1, token1, 'skip_countdown');
    const result = requestQuizSessionUpdate(
      quizId2, sessionId2, token2, 'end');
    expect(result).toMatchObject({});
  });
  test('end at QUESTION OPEN route 2', () => {
    requestQuizSessionUpdate(quizId1, sessionId1, token1, 'next_question');
    sleepSync(3000);
    const result = requestQuizSessionUpdate(
      quizId2, sessionId2, token2, 'end');
    expect(result).toMatchObject({});
  });

  // When player at question close state
  test('go_to_answer at QUESTION CLOSE', () => {
    requestQuizSessionUpdate(quizId1, sessionId1, token1, 'next_question');
    requestQuizSessionUpdate(quizId1, sessionId1, token1, 'skip_countdown');
    // how to move player to question close?????
    requestQuizSessionUpdate(quizId1, sessionId1, token1, '');
    const result = requestQuizSessionUpdate(
      quizId2, sessionId2, token2, 'go_to_answer');
    expect(result).toMatchObject({});
  });
  test('next_question at QUESTION CLOSE', () => {
    requestQuizSessionUpdate(quizId1, sessionId1, token1, 'next_question');
    requestQuizSessionUpdate(quizId1, sessionId1, token1, 'skip_countdown');
    // how to move player to question close?????
    requestQuizSessionUpdate(quizId1, sessionId1, token1, '');
    const result = requestQuizSessionUpdate(
      quizId2, sessionId2, token2, 'next_question');
    expect(result).toMatchObject({});
  });
  test('end at QUESTION CLOSE', () => {
    requestQuizSessionUpdate(quizId1, sessionId1, token1, 'next_question');
    requestQuizSessionUpdate(quizId1, sessionId1, token1, 'skip_countdown');
    // how to move player to question close?????
    requestQuizSessionUpdate(quizId1, sessionId1, token1, '');
    const result = requestQuizSessionUpdate(
      quizId2, sessionId2, token2, 'end');
    expect(result).toMatchObject({});
  });

  // When player at answer show state
  test('next_question at ANSWER SHOW route 1', () => {
    requestQuizSessionUpdate(quizId1, sessionId1, token1, 'next_question');
    requestQuizSessionUpdate(quizId1, sessionId1, token1, 'skip_countdown');
    requestQuizSessionUpdate(quizId1, sessionId1, token1, 'go_to_answer');
    const result = requestQuizSessionUpdate(
      quizId2, sessionId2, token2, 'next_question');
    expect(result).toMatchObject({});
  });
  test('next_question at ANSWER SHOW route 2', () => {
    requestQuizSessionUpdate(quizId1, sessionId1, token1, 'next_question');
    requestQuizSessionUpdate(quizId1, sessionId1, token1, 'skip_countdown');
    // how to move player to question close?????
    requestQuizSessionUpdate(quizId1, sessionId1, token1, '');
    requestQuizSessionUpdate(quizId1, sessionId1, token1, 'go_to_answer');
    const result = requestQuizSessionUpdate(
      quizId2, sessionId2, token2, 'next_question');
    expect(result).toMatchObject({});
  });
  test('go_to_final_results at ANSWER SHOW route 1', () => {
    requestQuizSessionUpdate(quizId1, sessionId1, token1, 'next_question');
    requestQuizSessionUpdate(quizId1, sessionId1, token1, 'skip_countdown');
    requestQuizSessionUpdate(quizId1, sessionId1, token1, 'go_to_answer');
    const result = requestQuizSessionUpdate(
      quizId2, sessionId2, token2, 'go_to_final_results');
    expect(result).toMatchObject({});
  });
  test('go_to_final_results at ANSWER SHOW route 2', () => {
    requestQuizSessionUpdate(quizId1, sessionId1, token1, 'next_question');
    requestQuizSessionUpdate(quizId1, sessionId1, token1, 'skip_countdown');
    // how to move player to question close?????
    requestQuizSessionUpdate(quizId1, sessionId1, token1, '');
    requestQuizSessionUpdate(quizId1, sessionId1, token1, 'go_to_answer');
    const result = requestQuizSessionUpdate(
      quizId2, sessionId2, token2, 'go_to_final_results');
    expect(result).toMatchObject({});
  });
  test('end at ANSWER SHOW route 1', () => {
    requestQuizSessionUpdate(quizId1, sessionId1, token1, 'next_question');
    requestQuizSessionUpdate(quizId1, sessionId1, token1, 'skip_countdown');
    requestQuizSessionUpdate(quizId1, sessionId1, token1, 'go_to_answer');
    const result = requestQuizSessionUpdate(
      quizId2, sessionId2, token2, 'end');
    expect(result).toMatchObject({});
  });
  test('end at ANSWER SHOW route 2', () => {
    requestQuizSessionUpdate(quizId1, sessionId1, token1, 'next_question');
    requestQuizSessionUpdate(quizId1, sessionId1, token1, 'skip_countdown');
    // how to move player to question close?????
    requestQuizSessionUpdate(quizId1, sessionId1, token1, '');
    requestQuizSessionUpdate(quizId1, sessionId1, token1, 'go_to_answer');
    requestQuizSessionUpdate(quizId1, sessionId1, token1, 'go_to_final_results');
    const result = requestQuizSessionUpdate(
      quizId2, sessionId2, token2, 'end');
    expect(result).toMatchObject({});
  });

  // When player at final results state
  test('end at FINAL RESULTS route 1', () => {
    requestQuizSessionUpdate(quizId1, sessionId1, token1, 'next_question');
    requestQuizSessionUpdate(quizId1, sessionId1, token1, 'skip_countdown');
    requestQuizSessionUpdate(quizId1, sessionId1, token1, 'go_to_answer');
    requestQuizSessionUpdate(quizId1, sessionId1, token1, 'go_to_final_results');
    const result = requestQuizSessionUpdate(
      quizId2, sessionId2, token2, 'end');
    expect(result).toMatchObject({});
  });
  test('end at FINAL RESULTS route 2', () => {
    requestQuizSessionUpdate(quizId1, sessionId1, token1, 'next_question');
    requestQuizSessionUpdate(quizId1, sessionId1, token1, 'skip_countdown');
    // how to move player to question close?????
    requestQuizSessionUpdate(quizId1, sessionId1, token1, '');
    requestQuizSessionUpdate(quizId1, sessionId1, token1, 'go_to_answer');
    requestQuizSessionUpdate(quizId1, sessionId1, token1, 'go_to_final_results');
    const result = requestQuizSessionUpdate(
      quizId2, sessionId2, token2, 'end');
    expect(result).toMatchObject({});
  });
  test('end at FINAL RESULTS route 3', () => {
    requestQuizSessionUpdate(quizId1, sessionId1, token1, 'next_question');
    requestQuizSessionUpdate(quizId1, sessionId1, token1, 'skip_countdown');
    // how to move player to question close?????
    requestQuizSessionUpdate(quizId1, sessionId1, token1, '');
    requestQuizSessionUpdate(quizId1, sessionId1, token1, 'go_to_final_results');
    const result = requestQuizSessionUpdate(
      quizId2, sessionId2, token2, 'end');
    expect(result).toMatchObject({});
  });
});
