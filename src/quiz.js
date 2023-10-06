import { getData } from './dataStore.js';

/*  adminQuizList
    Provide a list of all quizzes that are owned by the currently logged in user.

    Parameters:
        authUserId:

    Output:
        quizzes: { quizId: , name: }
 */

function adminQuizList( authUserId ) {
    let allQuizzes = getData().quizzes;
    let userQuizzes = [];

    for (let quiz of allQuizzes) {
        if (quiz.authId === authUserId) {
            userQuizzes.push({
                quizId: quiz.quizId,
                name: quiz.name
            });
        }
    }

    if (userQuizzes.length < 1) return { error: "Invalid user ID" };
    else return { quizzes: userQuizzes };
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
    let invalidName = /[^a-zA-Z0-9 ']/.test(name);
    if (invalidName || name.length < 3 || name.length > 30) {
        return { error: 'Invalid Name Format' };
    }

    if (description.length > 100) {
        return { error: 'Invalid Description Format' };
    }

    let exists = false;
    let users = getData().users
    for (let user of users) {
        if (user.authUserId === authUserId) {
            exists = true;
        }
    }

    if (!exists) return { error: 'Invalid authUserId' };

    let createdQuizzes = getData().quizzes;
    for (const quiz of createdQuizzes) {
        if (quiz.authId === authUserId && quiz.name === name) {
            return { error: 'Quiz Name Is Already Used' };
        }
    }

    // Returning and altering data
    const timestamp = new Date().valueOf(); 
    const randomId = Math.floor(Math.random() * 1000000) + 1;
    const quizId = timestamp * randomId;

    createdQuizzes.push({
        quizId: quizId,
        authId: authUserId,
        name: name,
        description: description,
        time_created: timestamp,
        time_last_edit: timestamp,
    })

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
    if (!Number.isInteger(authUserId) || authUserId <= 0) {
        return {error: 'AuthUserId is not a valid user'};
    }
    if (!Number.isInteger(quizId) || quizId <= 0) {
        return {error: 'QuizId is not a valid Quiz'};
    }

    const data = getData();
    const user = data.users.find((user) => user.id === authUserId);

    if (! user) {
        return {error: 'AuthUserId is not a valid user'};
    }

    let quizzes = data.quizzes;
    for (let i = 0; i < quizzes.length; i++) {
        if (quizzes[i].quizId === quizId && quizzes[i].authId === authUserId) {
            quizzes.splice(i, 1);
            return { };
        }
    }
    return {error: 'Quiz ID does not refer to a valid quiz or Quiz ID does not refer to a quiz that this user owns'};
}



/*  adminQuizInfo
    Get all of the relevant information about the current quiz.

    Parameters:
        authUserId:
        quizId:
    
    Returns:
        Quiz Object
 */
function adminQuizInfo( authUserId, quizId ) {
    let quizzes = getData().quizzes;

    for (let quiz of quizzes) {
        if (quiz.quizId === quizId && quiz.authId === authUserId) {
            return {
                quizId: quiz.quizId,
                name: quiz.name,
                timeCreated: quiz.time_created,
                timeLastEdited:quiz.time_last_edit,
                description: quiz.description
            };
        }
    }

    return { error: "No such quiz" };
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
function adminQuizNameUpdate( authUserId, quizId, name ) {
    if (!Number.isInteger(authUserId) || authUserId <= 0) {
        return {error: 'AuthUserId is not a valid user'};
    }
    if (!Number.isInteger(quizId) || quizId <= 0) {
        return {error: 'QuizId is not a valid Quiz'};
    }

    const data = getData();
    const user = data.users.find((user) => user.id === authUserId);

    if (! user) {
        return {error: 'AuthUserId is not a valid user'};
    }

      // Check if the name contains invalid characters (only alphanumeric and spaces allowed)
    if (!/^[a-zA-Z0-9\s]+$/.test(name)) {
        return { error: 'Name contains invalid characters.' };
    }

    // Check if the name length is within the specified limits
    if (name.length < 3 || name.length > 30) {
        return { error: 'Name must be between 3 and 30 characters long' };
    }

    let quizzes = data.quizzes;
    for (let i = 0; i < quizzes.length; i++) {
        if (quizzes[i].quizId === quizId && quizzes[i].authId === authUserId && quizzes[i].name === name) {
            return { error: 'Name has exist' };
        }
    }
    for (let i = 0; i < quizzes.length; i++) {
        if (quizzes[i].quizId === quizId && quizzes[i].authId === authUserId) {
            quizzes[i].name = name;
            return { };
        }
    }
    return {error: 'Quiz ID does not refer to a valid quiz or Quiz ID does not refer to a quiz that this user owns'};
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
function adminQuizDescriptionUpdate( authUserId, quizId, description ) {
    // Getting quizz data from dataStore
    let quizzesData = getData().quizzes;

    // Looping through quizzesData to find the quiz with matching authUserId and quizId
    for ( let quiz of quizzesData ) {
        // Compare authUserId and quizId
        if ( authUserId === quiz.authUserId && quizId === quiz.quizId) {
            // Updating the initial quiz description with the new description
            quiz.description = description;
            // Exit when its done
            return { };
        }
    }
    // Exit with an error message if the quiz with inputted authId and quizId is not found
    return {error: "Quiz with inputted authUserId and quizId id not found"};
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