import HTTPError from 'http-errors';

import {
  Message,
  MessageBody,
  PlayerId,
  getData,
  getPlayerSession,
  message400,
  playerId400
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
  // Error 400: Name of user entered is not unique
  
  // Error 400: Session is not in LOBBY state

  // If the name entered is an empty string, a name must be randomly generated
  // Structure: "[5 letters][3 numbers]" (e.g. valid123, ifjru483, ofijr938)
  // where there are no repetitions of numbers or characters within the name
  return { playerId: 0 };
}
