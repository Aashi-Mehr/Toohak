import { getData } from './dataStore.js';

/*  findQuiz
    Given a quizId, returns the quiz object

    Parameters:
        quizId

    Output:
        quiz: refer to data.md
 */
function findQuiz(quizId) {
  for (const quiz of getData().quizzes) {
    if (quizId === quiz.quizId) {
      return quiz;
    }
  }

  return null;
}

/*  adminQuizList
    Provide a list of all quizzes that are owned by the currently logged in user.

    Parameters:
        authUserId:

    Output:
        quizzes: { quizId: , name: }
 */
function adminQuizList(authUserId) {
  // Checking if the user exists
  const users = getData().users;
  let exists = false;

  for (const user of users) if (user.authUserId === authUserId) exists = true;
  if (!exists) return { error: 'Invalid user ID' };

  // Gathering quizzes
  const allQuizzes = getData().quizzes;
  const userQuizzes = [];

  // Looping through quizzes in dataStore
  for (const quiz of allQuizzes) {
    if (quiz.authId === authUserId && quiz.in_trash === false) {
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

/*  adminQuizCreate
    Given basic details about a new quiz, create one for the logged in user.

    Parameters:
        authUserId:
        name:
        description:

    Returns:
        quizId:
 */
function adminQuizCreate(authUserId, name, description) {
  // Error checking
  const invalidName = /[^a-zA-Z0-9 ']/.test(name);
  if (invalidName || name.length < 3 || name.length > 30) {
    return { error: 'Invalid Name' };
  }

  if (description.length > 100) {
    return { error: 'Invalid Description' };
  }

  const users = getData().users;
  let exists = false;

  for (const user of users) if (user.authUserId === authUserId) exists = true;
  if (!exists) return { error: 'Invalid user ID' };

  const createdQuizzes = getData().quizzes;
  for (const quiz of createdQuizzes) {
    if (quiz.authId === authUserId && quiz.name === name) {
      return { error: 'Quiz Name Is Already Used' };
    }
  }

  // Returning and altering data
  const timestamp = Math.floor(Date.now() / 1000);
  const randomId = Math.floor(Math.random() * 1000000) + 1;
  const quizId = timestamp * randomId % 100000000;

  createdQuizzes.push({
    quizId: quizId,
    authId: authUserId,
    name: name,
    description: description,
    timeCreated: timestamp,
    timeLastEdited: timestamp,
    in_trash: false,
    questions: []
  });

  return { quizId: quizId };
}

/*  adminQuizRemove
    Given a particular quiz, permanently remove the quiz

    Parameters:
        authUserId:
        quizId:

    Returns:
        { }: Empty List
 */
function adminQuizRemove(authUserId, quizId) { // Check if authUserId is a positive integer
  const users = getData().users;
  let exists = false;

  for (const user of users) if (user.authUserId === authUserId) exists = true;
  if (!exists) return { error: 'Invalid user ID' };

  const quiz = findQuiz(quizId);
  if (!quiz) return { error: 'Quiz ID is invalid' };

  if (quiz.authId === authUserId && quiz.in_trash === false) {
    quiz.timeLastEdited = Math.floor(Date.now() / 1000);
    quiz.in_trash = true;
    return { done: true };
  }

  return { error: 'Quiz is not owned by user' };
}

/*  adminQuizInfo
    Get all of the relevant information about the current quiz.

    Parameters:
        authUserId:
        quizId:

    Returns:
        Quiz Object
 */
function adminQuizInfo(authUserId, quizId) {
  // Gathering all quizzes
  const quiz = findQuiz(quizId);
  if (!quiz) return { error: 'No such quiz' };

  if (quiz.authId === authUserId && quiz.in_trash === false) {
    // If it's the quiz that's being searched for, return it
    return {
      quizId: quiz.quizId,
      name: quiz.name,
      timeCreated: quiz.timeCreated,
      timeLastEdited: quiz.timeLastEdited,
      description: quiz.description
    };
  }

  // If it gets through without returning, then it doesn't exist
  return { error: 'Quiz is not owned by user' };
}

/*  adminQuizNameUpdate
    Update the name of the relevant quiz.

    Parameters:
        authUserId:
        quizId:
        name:

    Returns:
        { }: Rempty Object
 */
function adminQuizNameUpdate(authUserId, quizId, name) {
  const users = getData().users;
  let exists = false;

  for (const user of users) if (user.authUserId === authUserId) exists = true;
  if (!exists) return { error: 'Invalid user ID' };

  // Check if the name contains invalid characters (only alphanumeric and spaces allowed)
  if (!/^[a-zA-Z0-9\s]+$/.test(name)) {
    return { error: 'Name contains invalid characters.' };
  }

  // Check if the name length is within the specified limits
  if (name.length < 3 || name.length > 30) {
    return { error: 'Name must be between 3 and 30 characters long' };
  }

  const quiz = findQuiz(quizId);
  if (!quiz) return { error: 'Quiz ID is invalid' };

  for (const quiz of getData().quizzes) {
    if (name === quiz.name && quizId !== quiz.quizId) {
      return { error: 'Name is already in use' };
    }
  }

  if (quiz.authId === authUserId && quiz.in_trash === false) {
    quiz.name = name;
    quiz.timeLastEdited = Math.floor(Date.now() / 1000);
    return {};
  }

  return { error: 'Quiz is not owned by user' };
}

/*  adminQuizDescriptionUpdate
    Update the description of the relevant quiz.

    Parameters:
        authUserId:
        quizId:
        description:

    Returns:
        { }: Rempty Object
 */
function adminQuizDescriptionUpdate(authUserId, quizId, description) {
  if (description.length > 100) return { error: 'Descrption too long' };

  const quiz = findQuiz(quizId);
  if (!quiz) return { error: "QuizId doesn't exist" };

  if (authUserId === quiz.authId && quiz.in_trash === false) {
    quiz.description = description;
    quiz.timeLastEdited = Math.floor(Date.now() / 1000);

    return { };
  }

  // Exit with an error message if the quiz not correct
  return { error: 'Quiz not owned by user' };
}

// last edit: 29/09/2023 by Zhejun Gu
export {
  adminQuizList,
  adminQuizInfo,
  adminQuizCreate,
  adminQuizRemove,
  adminQuizNameUpdate,
  adminQuizDescriptionUpdate
};
