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
    let quizzes = getData();

    for (quiz of quizzes) {
        if (quiz.quizId === quizId && quiz.quizAuthorId === authUserId) {
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
    return { };
}

// last edit: 29/09/2023 by Zhejun Gu
export { adminQuizList, adminQuizInfo, adminQuizCreate };