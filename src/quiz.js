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