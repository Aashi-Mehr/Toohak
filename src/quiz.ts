import {
  ErrorObject,
  QuizId,
  QuizList,
  getData,
  setData,
  getQuiz,
  getUniqueID,
  getUser,
  QuizInfo,
  token401,
  nameChar400,
  nameLen400,
  desc400,
  nameUsed400,
  unauth403,
  notUser400,
  currUser400,
  notBin400,
  QuizAdd,
  DEFAULT_QUIZ_THUMBNAIL,
  invFile400,
  invType400,
  imgUrlValid
} from './dataStore';

import HTTPError from 'http-errors';

/** adminQuizList
  * Lists all of the quizzes belonging to a particular user
  *
  * @param { number } token - The authUserId for the user
  *
  * @returns { QuizList } - If the authUserId exists and is valid
  * @returns { ErrorObject } - If the authUserId is invalid
  */
function adminQuizList(token: number): QuizList {
  // Checking if the user exists
  const user = getUser(token, getData());
  if (!user) throw HTTPError(401, token401);

  // Gathering quizzes
  const allQuizzes = getData().quizzes;
  const userQuizzes = [];

  // Looping through quizzes in dataStore
  for (const quiz of allQuizzes) {
    if (quiz.authId === user.authUserId && quiz.in_trash === false) {
      // If it belongs to the relevant user, it needs to be returned
      userQuizzes.push({
        quizId: quiz.quizId,
        name: quiz.name
      });
    }
  }

  // Quizzes list
  return { quizzes: userQuizzes };
}

/** adminQuizCreate
  * Creates a quiz for a particular user
  *
  * @param { number } token - The authUserId for the user
  * @param { string } name - The name of the quiz
  * @param { string } description - The description for the quiz
  *
  * @returns { QuizId } - If the details given are valid
  * @returns { ErrorObject } - If the details given are invalid
  */
function adminQuizCreate(token: number, name: string, description: string):
  QuizId | ErrorObject {
  // Error checking
  const user = getUser(token, getData());
  if (!user) return { error: token401 };

  // Name can only have alphanumeric characters, spaces and apostrophes
  // Length should be between 3 and 30
  const invalidName = /[^a-zA-Z0-9 ']/.test(name);
  if (invalidName || name.length < 3 || name.length > 30) {
    return { error: nameChar400 + ' ' + nameLen400 };
  }

  if (description.length > 100) return { error: desc400 };

  // Error checking: In used quiz name
  const quizzes: QuizAdd[] = [];
  for (const quiz of getData().quizzes) {
    if (quiz.authId === user.authUserId && quiz.in_trash === false) {
      quizzes.push(quiz);
    }
  }

  for (const quiz of quizzes) {
    if (quiz.name === name) return { error: nameUsed400 };
  }

  // Returning and altering data
  const timestamp = Math.floor(Date.now() / 1000);
  const quizId = getUniqueID(getData());

  getData().quizzes.push({
    quizId: quizId,
    authId: user.authUserId,
    name: name,
    description: description,
    timeCreated: timestamp,
    timeLastEdited: timestamp,
    in_trash: false,
    questions: [],
    thumbnailUrl: DEFAULT_QUIZ_THUMBNAIL
  });

  return { quizId: quizId };
}

/** adminQuizRemove
  * Given a particular quiz, permanently remove the quiz
  *
  * @param { number } token - The authUserId for the user
  * @param { number } quizId - The quizId of the quiz
  *
  * @returns { Record<string, never> } - If the details given are valid
  * @returns { ErrorObject } - If the details given are invalid
  */
function adminQuizRemove(token: number, quizId: number):
  ErrorObject | Record<string, never> {
  // Check if token is in a valid session
  const user = getUser(token, getData());
  if (!user) return { error: token401 };

  // Finding the quiz
  const quiz = getQuiz(quizId, getData().quizzes);
  if (!quiz) return { error: unauth403 };

  // Deleting the quiz if it's owned by the correct user
  if (quiz.authId === user.authUserId && quiz.in_trash === false) {
    quiz.timeLastEdited = Math.floor(Date.now() / 1000);
    quiz.in_trash = true;
    return { };
  } else {
    // It's not owned by given user
    return { error: unauth403 };
  }
}

/** adminQuizInfo
  * Get all of the relevant information about the current quiz.
  *
  * @param { number } token - The authUserId for the user
  * @param { number } quizId - The quizId of the quiz
  *
  * @returns { QuizInfo } - If the details given are valid
  * @returns { ErrorObject } - If the details given are invalid
  */
function adminQuizInfo(token: number, quizId: number): QuizInfo {
  // Ensuring the login session is valid
  const user = getUser(token, getData());
  if (!user) throw HTTPError(401, token401);

  // Gathering the quiz
  const quiz = getQuiz(quizId, getData().quizzes);
  if (!quiz) throw HTTPError(403, unauth403);

  // Calculating the duration of the quiz
  let duration = 0;
  for (const question of quiz.questions) {
    duration += question.duration;
  }

  if (quiz.authId === user.authUserId && quiz.in_trash === false) {
    // If it's the quiz that's being searched for, return it
    return {
      quizId: quiz.quizId,
      name: quiz.name,
      timeCreated: quiz.timeCreated,
      timeLastEdited: quiz.timeLastEdited,
      description: quiz.description,
      numQuestions: quiz.questions.length,
      questions: quiz.questions,
      duration: duration,
      thumbnailUrl: quiz.thumbnailUrl
    };
  }

  // If it gets through without returning, then it doesn't exist
  throw HTTPError(403, unauth403);
}

/** adminQuizNameUpdate
  * Update the name of the relevant quiz.
  *
  * @param { number } token - The authUserId for the user
  * @param { number } quizId - The quizId of the quiz
  * @param { string } name - The new name of the quiz
  *
  * @returns { Record<string, never> } - If the details given are valid
  * @returns { ErrorObject } - If the details given are invalid
  */
function adminQuizNameUpdate(token: number, quizId: number, name: string):
  ErrorObject | Record<string, never> {
  // Checking if user exists
  const user = getUser(token, getData());
  if (!user) return { error: token401 };

  // Checking if quiz exists
  const quiz = getQuiz(quizId, getData().quizzes);
  if (!quiz) return { error: unauth403 };

  // Checking if given user owns the quiz
  if (user.authUserId !== quiz.authId) return { error: token401 };

  // Check if the name contains invalid, non-alphanumeric characters
  const invalidName = /[^a-zA-Z0-9 ']/.test(name);
  if (invalidName || name.length < 3 || name.length > 30) {
    return { error: nameChar400 };
  }

  // Checking if the user has another quiz with the same name
  for (const otherQuiz of getData().quizzes) {
    if (name === otherQuiz.name && quizId !== otherQuiz.quizId &&
        user.authUserId === otherQuiz.authId && otherQuiz.in_trash === false) {
      return { error: nameUsed400 };
    }
  }

  // Quiz is not invalid
  if (quiz.in_trash === false) {
    quiz.name = name;
    quiz.timeLastEdited = Math.floor(Date.now() / 1000);
    return { };
  } else {
    // Quiz is invalid
    return { error: unauth403 };
  }
}

/** adminQuizDescriptionUpdate
  * Update the description of the relevant quiz.
  *
  * @param { number } token - The authUserId for the user
  * @param { number } quizId - The quizId of the quiz
  * @param { string } description - The new description of the quiz
  *
  * @returns { Record<string, never> } - If the details given are valid
  * @returns { ErrorObject } - If the details given are invalid
  */
function adminQuizDescriptionUpdate(token: number, quizId: number,
  description: string): ErrorObject | Record<string, never> {
  // Ensuring the quiz exists
  const quiz = getQuiz(quizId, getData().quizzes);
  if (!quiz) return { error: unauth403 };

  // Ensuring the token is valid
  const user = getUser(token, getData());
  if (!user) return { error: token401 };

  // Ensuring the user owns the quiz
  if (user.authUserId !== quiz.authId) return { error: unauth403 };

  // Dexcriotion must be within 100 characters
  if (description.length > 100) return { error: desc400 };

  // Quiz is valid
  if (quiz.in_trash === false) {
    quiz.description = description;
    quiz.timeLastEdited = Math.floor(Date.now() / 1000);
    return { };
  } else {
    // Exit with an error message if the quiz is invalid
    return { error: unauth403 };
  }
}

/** adminQuizTransfer
  * Transfer a quiz from one user to another user
  *
  * @param { number } token - The authUserId for the user
  * @param { number } quizId - The quizId of the quiz
  * @param { string } userEmail - the email of the new user
  *
  * @returns { Record<string, never> } - If the inputs are valid
  * @returns { ErrorObject } - If the inputs are invalid
  */
function adminQuizTransfer(token: number, quizId: number,
  userEmail: string): ErrorObject | Record<string, never> {
  const data = getData();
  // Checking if the user exists
  const user = getUser(token, data);
  if (!user) return { error: token401 };

  // Checking if the quiz exists
  const quiz = getQuiz(quizId, data.quizzes);
  if (!quiz) return { error: unauth403 };

  // Checking the user owns the quiz
  if (quiz.authId !== user.authUserId) return { error: unauth403 };

  const newUser = data.users.find(user => user.email === userEmail);
  if (!newUser) return { error: notUser400 };
  else if (user.email === userEmail) return { error: currUser400 };
  else if (data.quizzes.some(quiz2 => quiz2.authId === newUser.authUserId &&
                             quiz2.name === quiz.name)) {
    return { error: nameUsed400 };
  }

  quiz.authId = newUser.authUserId;
  setData(data);

  return {};
}

// last edit: 18/10/2023 by Zhejun Gu
/** adminQuizTrash
  * View the quizzes that are currently in the trash for the logged in user
  *
  * @param { number } token - The authUserId for the user
  *
  * @returns { QuizList } - If the details given are valid
  * @returns { ErrorObject } - If the details given are invalid
  */
function adminQuizTrash(token: number):
  ErrorObject | QuizList {
  // Check if authUserId is a positive integer
  const user = getUser(token, getData());
  if (!user) return { error: token401 };

  // Gathering quizzes
  const allQuizzes = getData().quizzes;
  const removedQuizzes = [];

  // Looping through quizzes in dataStore
  for (const quiz of allQuizzes) {
    if (quiz.authId === user.authUserId && quiz.in_trash === true) {
      // If it belongs to the relevant user, it needs to be returned
      removedQuizzes.push({
        quizId: quiz.quizId,
        name: quiz.name
      });
    }
  }

  // Return QuizList of removedQuizzes
  return { quizzes: removedQuizzes };
}

/** adminQuizRestore
  * Restore a particular quiz from the trash back to an active quiz.
  *
  * @param { number } token - The authUserId for the user
  * @param { number } quizId - The quizId for the quiz
  *
  * @returns { Record<string, never>  } - If the details given are valid
  * @returns { ErrorObject } - If the details given are invalid
  */
function adminQuizRestore(token: number, quizId: number):
  ErrorObject | Record<string, any> {
  // Check if authUserId is valid
  const user = getUser(token, getData());
  if (!user) return { error: token401 };

  // Check if quizId is valid
  const quiz = getQuiz(quizId, getData().quizzes);
  if (!quiz) return { error: unauth403 };

  // Loop through quizzes to check for existingQuizzes
  const existingQuizzes = getData().quizzes;
  for (const activeQuiz of existingQuizzes) {
    if (activeQuiz.name === quiz.name &&
      activeQuiz.authId === user.authUserId &&
      activeQuiz.in_trash === false &&
      activeQuiz.quizId !== quizId) {
      // Return error if quiz name of the restored quiz is already used
      // by another active quiz or quiz is not in trash
      return { error: nameUsed400 };
    }
  }

  // Looping through to match authUserId and quizId
  // Checking if the quiz is in trash
  if (user.authUserId === quiz.authId && quiz.in_trash === true) {
    quiz.timeLastEdited = Math.floor(Date.now() / 1000);
    quiz.in_trash = false;

    return { };
  } else return { error: notBin400 };
}

/** adminQuizEmptyTrash
  * Permanently delete specific quizzes currently in the trash
  *
  * @param { number } token - The authUserId for the user
  * @param { number } quizId - The quizId for the quiz
  *
  * @returns { Record<string, never>  } - If the details given are valid
  * @returns { ErrorObject } - If the details given are invalid
  */
function adminQuizEmptyTrash(token: number, quizId: number[]):
  ErrorObject | Record<string, never> {
  // Check if authUserId is valid
  const user = getUser(token, getData());
  // Error 401: Invalid token
  if (!user) return { error: token401 };

  // Check if quizId is valid
  const allQuizzes = getData().quizzes;

  // Iterate through the array of quizIds
  for (const quizID of quizId) {
    // Finding matching quizId
    const index = allQuizzes.findIndex((quiz) => quiz.quizId === quizID);
    // Error 401 & 403: If index returns -1, quiz is not owned by user
    if (index === -1) {
      return { error: unauth403 };
    }

    // Looping through the quizzes owned by user
    const quiz = allQuizzes[index];
    // Looping through quizzes to find quiz that is in trash
    if (user.authUserId === quiz.authId && quiz.in_trash === true) {
      // Remove the quiz from the data permanently
      allQuizzes.splice(index, 1);
    } else {
      // Error 403: Return an error for quizzes that are not in trash
      return { error: notBin400 };
    }
  }
  // Return an error if the quiz is not in the trash
  return {};
}

/** adminQuizUpdateImageURL
  * Updates the quiz's thumbnail URL
  *
  * @param { number } token - The user's token
  * @param { number } quizId - The quizId for which the thumnail needs changing
  * @param { string } imgUrl - The new thumbnail URL
  *
  * @returns { Record<string, never> } - If the details given are valid
  * @throws { HTTPError } - If the details given are invalid
  */
function adminQuizUpdateImageURL(token: number, quizId: number, imgUrl: string):
  Record<string, never> {

  return { };
}

export {
  adminQuizList,
  adminQuizInfo,
  adminQuizCreate,
  adminQuizRemove,
  adminQuizNameUpdate,
  adminQuizDescriptionUpdate,
  adminQuizTrash,
  adminQuizRestore,
  adminQuizTransfer,
  adminQuizEmptyTrash,
  adminQuizUpdateImageURL
};
