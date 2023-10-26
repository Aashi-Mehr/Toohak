import {
  ErrorObject,
  QuizId,
  QuizList,
  getData,
  setData,
  getQuiz,
  getUniqueID,
  getUser,
  QuizInfo
} from './dataStore';

/** adminQuizList
  * Lists all of the quizzes belonging to a particular user
  *
  * @param { number } token - The authUserId for the user
  *
  * @returns { QuizList } - If the authUserId exists and is valid
  * @returns { ErrorObject } - If the authUserId is invalid
  */
function adminQuizList(token: number): QuizList | ErrorObject {
  // Checking if the user exists
  const user = getUser(token, getData());
  if (!user) return { error: 'Invalid user ID' };

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
  if (!user) {
    return {
      error: 'Token is empty or invalid (does not refer to ' +
    ' valid logged in user session)'
    };
  }

  const invalidName = /[^a-zA-Z0-9 ']/.test(name);
  if (invalidName || name.length < 3 || name.length > 30) {
    return { error: 'Invalid Name' };
  }

  if (description.length > 100) {
    return { error: 'Invalid Description' };
  }

  // Error checking: In used quiz name
  const createdQuizzes = getData().quizzes;
  for (const quiz of createdQuizzes) {
    if (quiz.authId === user.authUserId && quiz.name === name &&
        quiz.in_trash === false) {
      return { error: 'Quiz Name Is Already Used' };
    }
  }

  // Returning and altering data
  const timestamp = Math.floor(Date.now() / 1000);
  const quizId = getUniqueID(getData());

  createdQuizzes.push({
    quizId: quizId,
    authId: user.authUserId,
    name: name,
    description: description,
    timeCreated: timestamp,
    timeLastEdited: timestamp,
    in_trash: false,
    questions: []
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
  // Check if authUserId is a positive integer
  const user = getUser(token, getData());
  if (!user) {
    return {
      error: 'Token is empty or invalid (does not refer to ' +
    'valid logged in user session)'
    };
  }

  const quiz = getQuiz(quizId, getData().quizzes);
  if (!quiz) return { error: 'Quiz ID is invalid' };

  if (quiz.authId === user.authUserId && quiz.in_trash === false) {
    quiz.timeLastEdited = Math.floor(Date.now() / 1000);
    quiz.in_trash = true;
    return { };
  }

  return { error: 'Quiz is not owned by user' };
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
function adminQuizInfo(token: number, quizId: number):
  QuizInfo | ErrorObject {
  // Ensuring the login session is valid

  const user = getUser(token, getData());
  if (!user) {
    return {
      error: 'Token is empty or invalid (does not refer to ' +
    'valid logged in user session)'
    };
  }

  // Gathering the quiz
  const quiz = getQuiz(quizId, getData().quizzes);
  if (!quiz) return { error: 'No such quiz' };

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
      duration: duration
    };
  }

  // If it gets through without returning, then it doesn't exist
  return { error: 'Quiz is not owned by user' };
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
  const user = getUser(token, getData());
  if (!user) {
    return {
      error: 'Token is empty or invalid (does not refer to ' +
    'valid logged in user session)'
    };
  }

  const quiz = getQuiz(quizId, getData().quizzes);
  if (!quiz) return { error: 'Quiz ID is invalid' };

  if (user.authUserId !== quiz.authId) {
    return {
      error: 'Valid token is ' +
    'provided, but user is not an owner of this quiz'
    };
  }

  // Check if the name contains invalid, non-alphanumeric characters
  const invalidName = /[^a-zA-Z0-9 ']/.test(name);
  if (invalidName || name.length < 3 || name.length > 30) {
    return { error: 'Invalid Name' };
  }

  for (const otherQuiz of getData().quizzes) {
    if (name === otherQuiz.name && quizId !== otherQuiz.quizId) {
      return { error: 'Name is already in use' };
    }
  }

  if (quiz.in_trash === false) {
    quiz.name = name;
    quiz.timeLastEdited = Math.floor(Date.now() / 1000);
    return { };
  }

  return { error: 'Quiz ID is invalid' };
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
  const quiz = getQuiz(quizId, getData().quizzes);
  if (!quiz) return { error: "QuizId doesn't exist" };

  const user = getUser(token, getData());
  if (!user) {
    return {
      error: 'Token is empty or invalid (does not refer to ' +
    'valid logged in user session)'
    };
  }

  if (user.authUserId !== quiz.authId) {
    return {
      error: 'Valid token is ' +
    'provided, but user is not an owner of this quiz'
    };
  }

  if (description.length > 100) return { error: 'Descrption too long' };

  if (user.authUserId !== quiz.authId) {
    return {
      error: 'Valid token is ' +
    'provided, but user is not an owner of this quiz'
    };
  }

  if (description.length > 100) return { error: 'Descrption too long' };
  if (quiz.in_trash === false) {
    quiz.description = description;
    quiz.timeLastEdited = Math.floor(Date.now() / 1000);

    return { };
  }

  // Exit with an error message if the quiz not correct
  return { error: "QuizId doesn't exist" };
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
  if (!user) return { error: 'Token is empty or invalid' };

  const quiz = getQuiz(quizId, data.quizzes);
  if (!quiz) return { error: 'Quiz is not owned by user' };

  if (quiz.authId !== user.authUserId) {
    return {
      error: 'Valid token is ' +
    'provided, but user is not an owner of this quiz'
    };
  }

  const newUser = data.users.find(user => user.email === userEmail);
  if (!newUser) {
    return { error: 'userEmail is not a real user' };
  } else if (user.email === userEmail) {
    return { error: 'userEmail is the current logged in user' };
  } else if (data.quizzes.some(quiz2 => quiz2.authId === newUser.authUserId && quiz2.name === quiz.name)) {
    return { error: 'Quiz ID refers to a quiz that has a name that is already used by the target user' };
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
  if (!user) {
    return {
      error: 'Token is empty or invalid (does not refer to ' +
    ' valid logged in user session)'
    };
  }

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
  if (!user) return { error: 'Invalid user ID' };

  // Check if quizId is valid
  const quiz = getQuiz(quizId, getData().quizzes);
  if (!quiz) return { error: 'Quiz is not owned by user' };

  // Loop through quizzes to check for existingQuizzes
  const existingQuizzes = getData().quizzes;
  for (const activeQuiz of existingQuizzes) {
    if (activeQuiz.name === quiz.name &&
      activeQuiz.authId === user.authUserId &&
      activeQuiz.in_trash === false) {
      // Return error if quiz name of the restored quiz is already used
      // by another active quiz or quiz is not in trash
      return { error: 'Quiz name is used by an active quiz' };
    }
  }

  // Looping through to match authUserId and quizId
  // Checking if the quiz is in trash
  if (user.authUserId === quiz.authId && quiz.in_trash === true) {
    quiz.timeLastEdited = Math.floor(Date.now() / 1000);
    quiz.in_trash = false;

    return { };
  }

  return { error: 'Quiz is not in trash' };
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
  if (!user) return { error: 'Invalid user ID' };

  // Check if quizId is valid
  const allQuizzes = getData().quizzes;
  console.log('This is all quizzes', allQuizzes);

  // Iterate through the array of quizIds
  for (const quizID of quizId) {
    // Finding matching quizId
    const index = allQuizzes.findIndex((quiz) => quiz.quizId === quizID);
    // Error 401 & 403: If index returns -1, quiz is not owned by user
    if (index === -1) {
      return { error: 'Quiz is not owned by the user' };
    }

    // Looping through the quizzes owned by user
    const quiz = allQuizzes[index];
    console.log('these are quizzes owned by user', allQuizzes[index]);
    // Looping through quizzes to find quiz that is in trash
    if (user.authUserId === quiz.authId && quiz.in_trash === true) {
      // Remove the quiz from the data permanently
      allQuizzes.splice(index, 1);
    } else {
      // Error 403: Return an error for quizzes that are not in trash
      return { error: 'One or more quizzes are not in the trash' };
    }
  }
  // Return an error if the quiz is not in the trash
  return {};
}

export {
  adminQuizList,
  adminQuizInfo,
  adminQuizCreate,
  adminQuizRemove,
  adminQuizNameUpdate,
  adminQuizDescriptionUpdate,
  adminQuizTransfer,
  adminQuizTrash,
  adminQuizRestore,
  adminQuizEmptyTrash

};
