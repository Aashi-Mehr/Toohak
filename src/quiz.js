// Import functions from files
import { getData, setData } from './dataStore.js';

// Function : adminQuizList
// Input    : authUserId
// Output   : quizzes : [{quizId: 1, name: 'My Quiz',}]

function adminQuizList( authUserId ) {
    return {
        quizzes: [
            {
              quizId: 1,
              name: 'My Quiz',
            }
        ]
    }
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
    return {
        quizId: 1,
        name: 'My Quiz',
        timeCreated: 1683125870,
        timeLastEdited: 1683125871,
        description: 'This is my quiz',
    };
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