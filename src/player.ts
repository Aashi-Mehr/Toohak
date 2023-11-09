import HTTPError from 'http-errors';

import {
  Message,
  MessageBody,
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
