import HTTPError from 'http-errors';

import {
  Message,
  MessageBody,
  PlayerId,
  SessionState,
  getData,
  getPlayerSession,
  getQuizSession,
  getUniqueID,
  message400,
  playerId400,
  playerJoin400,
  playerName400
} from './dataStore';

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

/** playerJoinSession
  * Allows a guest player to join a session
  *
  * @param { number } sessionId - The sessionId that the player is joining
  * @param { string } name - The player's name
  *
  * @returns { PlayerId } - If the player's message is accepted
  */
export function playerJoinSession(sessionId: number, name: string): PlayerId {
  // Error 400: Session is not in LOBBY state
  const quizSess = getQuizSession(sessionId, getData().quizSessions);
  if (!quizSess) throw HTTPError(400, playerJoin400);
  if (quizSess.state !== SessionState.LOBBY) {
    throw HTTPError(400, playerJoin400);
  }

  // Error 400: Name of user entered is not unique
  for (const player of quizSess.players) {
    if (player.name === name) throw HTTPError(400, playerName400);
  }

  // If the name entered is an empty string, a name must be randomly generated
  // Structure: "[5 letters][3 numbers]" (e.g. valid123, ifjru483, ofijr938)
  // where there are no repetitions of numbers or characters within the name
  while (!name) {
    // Initialising letters and numbers to generate name from
    const letters = [
      'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
      'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
    ];
    const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

    // Choosing 5 random letters
    for (let i = 0; i < 5; i++) {
      const index = Math.floor(Math.random() * letters.length);
      name += letters[index];
      letters.splice(index, 1);
    }

    // Choosing 3 random numbers
    for (let i = 0; i < 3; i++) {
      const index = Math.floor(Math.random() * numbers.length);
      name += numbers[index];
      numbers.splice(index, 1);
    }

    // Ensuring name is unique
    for (const player of quizSess.players) {
      if (player.name === name) name = '';
    }
  }

  // Generating playerId
  const playerId = getUniqueID(getData());

  // Adding player to session
  quizSess.players.push({
    name: name,
    playerId: playerId
  });

  return { playerId: playerId };
}
