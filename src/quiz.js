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
function adminQuizCreate( authUserId, name, description ) {
    return {
        quizId: 2
    };
}

/*  adminQuizRemove
    Given a particular quiz, permanently remove the quiz.

    Parameters:
        authUserId:
        quizId:
    
    Returns:
        { }: Empty List
 */
function adminQuizRemove( authUserId, quizId ) {
    return { };
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
    return { };
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
export { adminQuizList, adminQuizInfo, adminQuizCreate };