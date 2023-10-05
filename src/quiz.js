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
function adminQuizCreate(authUserId, name, description) {
    if (!authUserId || typeof authUserId !== 'string' || authUserId.length < 1) {
        return { error: 'Invalid AuthUserId Format' };
    }
          
    if (!name || typeof name !== 'string' || name.length < 3 || name.length > 30) {
        return { error: 'Invalid Name Format' };
    }
         
    if (!description || typeof description !== 'string' || description.length > 100) {
        return { error: 'Invalid Description Format' };
    }
          
    return { quizId: 1 }; 
}

/*  adminQuizRemove
    Given a particular quiz, permanently remove the quiz

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
    return { };
}

// last edit: 29/09/2023 by Zhejun Gu
export { adminQuizList, adminQuizInfo, adminQuizCreate };