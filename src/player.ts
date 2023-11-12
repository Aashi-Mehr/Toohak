import HTTPError from 'http-errors';

import {
  Message,
  MessageBody,
  getData,
  getPlayerSession,
  message400,
  playerId400,
  setData,
  Player,
  Result,
} from './dataStore';
//import { sessionUpdate } from './sessions';

/*
    LOBBY = 'LOBBY',
    QUESTION_COUNTDOWN = 'QUESTION_COUNTDOWN',
    QUESTION_OPEN = 'QUESTION_OPEN',
    QUESTION_CLOSE = 'QUESTION_CLOSE',
    ANSWER_SHOW = 'ANSWER_SHOW',
    FINAL_RESULTS = 'FINAL_RESULTS',
    END = 'END'

    NEXT_QUESTION = 'NEXT_QUESTION',
    GO_TO_ANSWER = 'GO_TO_ANSWER',
    GO_TO_FINAL_RESULTS = 'GO_TO_FINAL_RESULTS',
    END = 'END'
 */

    interface PlayerIdObject {
      playerId: number
  }

  interface EmptyReturn {
      [key: string]: never;
    }

/** playerViewChat
  * Finds the chat corresponding to the session the player is in
  *
  * @param { number } playerId - The playerId for the player
  *
  * @returns { { messages: Message[] } } - If the playerId exists
  */
export function playerViewChat(playerId: number): { messages: Message[] } {
  // Error 400 If player ID does not exist
  const playerSession = getPlayerSession(playerId, getData());
  if (!playerSession) throw HTTPError(400, playerId400);

  // Message[] Otherwise
  return { messages: playerSession.quizSession.messages };
}

/** playerMessageChat
  * Messages the entire chat for that quiz session
  *
  * @param { number } playerId - The playerId for the player
  * @param { MessageBody } message - The player's message to check
  *
  * @returns { Record<string, never> } - If the player's message is accepted
  */
export function playerMessageChat(playerId: number, message: MessageBody):
  Record<string, never> {
  // Error 400 If player ID does not exist
  const playerSession = getPlayerSession(playerId, getData());
  if (!playerSession) throw HTTPError(400, playerId400);

  // Error 400 If message body is less than 1 or more than 100 characters
  if (message.messageBody.length < 1 || message.messageBody.length > 100) {
    throw HTTPError(400, message400);
  }

  // Add message to chat
  playerSession.quizSession.messages.push({
    messageBody: message.messageBody,
    playerId: playerId,
    timeSent: Math.floor(Date.now()),
    playerName: playerSession.player.name
  });

  // Empty Object Otherwise
  return { };
}

/**
 * Generate a random name with 5 letters and 3 numbers with
 * no repetition in the name
 *
 * @returns {string} - a random name
 */
const generateRandomName = () => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';

  let result = '';

  // Generate the 5-letter part
  for (let i = 0; i < 5; i++) {
    result += letters.charAt(Math.floor(Math.random() * letters.length));
  }

  // Generate the 3-number part
  for (let i = 0; i < 3; i++) {
    result += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }

  return result;
};

/**
 * Player join the session
 *
 * @param {number} sessionId - a unique id
 * @param {string} name - unique name
 *
 * @returns {number} - return the playerId
 */
export const guestJoinSession = (sessionId: number, name: string): PlayerIdObject => {
  const data = getData();
  const session = data.sessions.find(session => session.sessionId === sessionId);
  if (name === '') {
    name = generateRandomName();
  }

  if (session.state !== 'LOBBY') {
    throw HTTPError(400, 'Session is not in LOBBY state');
  }

  if (session.players.some(player => player.playerName === name)) {
    throw HTTPError(400, 'Name of user entered is not unique');
  }

  session.playerNum++;
  const playerId = session.playerNum;
  const player: Player = {
    playerId: playerId,
    playerName: name,
    answerIds: [],
    answerTime: null,
    currentScore: 0,
  };

  session.players.push(player);

  //const token = data.users.find(t => t.authUserId === session.quiz.authId);

  setData(data);

  // if (session.players.length === session.autoStartNum) {
  //   sessionUpdate(token, session.quiz.quizId, sessionId, 'NEXT_QUESTION');
  // }

  return { playerId: playerId };
};

/**
 * Player submit their answers
 *
 * @param {Array<number>} answerIds - an array of answer ids
 * @param {number} playerId - a unique id to identify player
 * @param {number} questionPosition - position of the question (index start from 1)
 *
 * @returns {} - return an empty object
 */
export const guestQuestionAnswer = (answerIds: number[], playerId: number, questionPosition: number): EmptyReturn => {
  const data = getData();
  const session = data.sessions.find(session => session.players.some(player => player.playerId === playerId));
  if (!session) {
    throw HTTPError(400, 'player ID does not exist');
  }
  if (questionPosition > session.quiz.questions.length || questionPosition <= 0) {
    throw HTTPError(400, 'question position is not valid');
  }
  if (session.questionNow !== questionPosition) {
    throw HTTPError(400, 'not on this question');
  }
  if (session.state !== 'QUESTION_OPEN') {
    throw HTTPError(400, 'question not started');
  }

  const question = session.quiz.questions[questionPosition - 1];
  const allAnsValid = answerIds.every(answerId => question.answers.some(answer => answer.answerId === answerId));

  if (!allAnsValid) {
    throw HTTPError(400, 'answer not valid');
  }

  const seen = new Set();

  for (const id of answerIds) {
    if (seen.has(id)) {
      throw HTTPError(400, 'duplicate answers');
    }
    seen.add(id);
  }

  if (answerIds.length < 1) {
    throw HTTPError(400, 'Less than 1 answer ID was submitted');
  }

  const player = session.players.find(player => player.playerId === playerId);
  player.answerIds = answerIds;

  player.answerTime = Math.floor(Date.now());

  setData(data);

  return {};
};

/**
 * Show final result of a session
 *
 * @param {number} playerId - a unique id to identify player
 *
 * @returns {Result} - result of the session
 */
export const guestSessionResult = (playerId: number): Result => {
  const data = getData();
  const session = data.sessions.find(session => session.players.some(player => player.playerId === playerId));
  if (!session) {
    throw HTTPError(400, 'player ID does not exist');
  } else if (session.state !== 'FINAL_RESULTS') {
    throw HTTPError(400, 'Session is not in FINAL_RESULTS state');
  }

  return session.finalResult;
};
