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
  const invalidName = /[^a-zA-Z0-9 ']/.test(name);
  if (invalidName || name.length < 3 || name.length > 30) {
    return { error: 'Invalid Name' };
  }

  if (description.length > 100) {
    return { error: 'Invalid Description' };
  }

  const user = getUser(token, getData());
  if (!user) return { error: 'Invalid user ID' };

  // Error checking: In used quiz name
  const createdQuizzes = getData().quizzes;
  for (const quiz of createdQuizzes) {
    if (quiz.authId === user.authUserId && quiz.name === name) {
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
  if (!user) return { error: 'Invalid user ID' };

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
  if (!user) return { error: 'No such token' };

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
  if (!user) return { error: 'Invalid user ID' };

  // Check if the name contains invalid, non-alphanumeric characters
  const invalidName = /[^a-zA-Z0-9 ']/.test(name);
  if (invalidName || name.length < 3 || name.length > 30) {
    return { error: 'Invalid Name' };
  }

  const quiz = getQuiz(quizId, getData().quizzes);
  if (!quiz) return { error: 'Quiz ID is invalid' };

  for (const otherQuiz of getData().quizzes) {
    if (name === otherQuiz.name && quizId !== otherQuiz.quizId) {
      return { error: 'Name is already in use' };
    }
  }

  if (quiz.authId === user.authUserId && quiz.in_trash === false) {
    quiz.name = name;
    quiz.timeLastEdited = Math.floor(Date.now() / 1000);
    return { };
  }

  return { error: 'Quiz is not owned by user' };
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
  if (description.length > 100) return { error: 'Descrption too long' };

  const quiz = getQuiz(quizId, getData().quizzes);
  if (!quiz) return { error: "QuizId doesn't exist" };

  const user = getUser(token, getData());
  if (!user) return { error: 'Invaild token' };

  if (user.authUserId === quiz.authId && quiz.in_trash === false) {
    quiz.description = description;
    quiz.timeLastEdited = Math.floor(Date.now() / 1000);

    return { };
  }

  // Exit with an error message if the quiz not correct
  return { error: 'Quiz not owned by user' };
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
  if (!user) return { error: 'Invalid user ID' };

  const quiz = getQuiz(quizId, data.quizzes);
  if (!quiz) return { error: 'Quiz is not owned by user' };

  if (quiz.authId !== user.authUserId) return { error: 'Quiz is not owned by user' };

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
  if (!user) return { error: 'Invalid user ID' };

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

// last edit: 25/10/2023 by Alya

export {
  adminQuizList,
  adminQuizInfo,
  adminQuizCreate,
  adminQuizRemove,
  adminQuizNameUpdate,
  adminQuizDescriptionUpdate,
  adminQuizTransfer,
  adminQuizTrash,

};
