// import HttpError from "http-errors";

import {
  Message,
  MessageBody
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
  // Message[] Otherwise

  return {
    messages: [
      {
        messageBody: 'This is a message body',
        playerId: 5546,
        playerName: 'Yuchao Jiang',
        timeSent: 1683019484
      }
    ]
  };
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
  // Error 400 If message body is less than 1 or more than 100 characters
  // Message[] Otherwise

  return { };
}
