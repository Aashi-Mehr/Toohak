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
    // Check if authUserId is a positive number
    if (!authUserId || typeof authUserId !== 'number' || authUserId <= 0) {
        return { error: 'Invalid AuthUserId Format' };
    }

    // Check if name contains invalid characters (only allow alphanumeric and spaces)
    let invalidName = /[^a-zA-Z0-9 ']/.test(name);
    if (invalidName || name.length < 3 || name.length > 30) {
        return { error: 'Invalid Name Format' };
    }

    // Empty description is okay, only check if it exceeds the length limit
    if (description && description.length > 100) {
        return { error: 'Invalid Description Format' };
    }

    // Generate a random quizId (for example, using a unique timestamp-based approach)
    const quizId = Math.floor(Math.random() * 1000000) + 1;

    // Check if the quizId is already used (unlikely due to uniqueness)
    let createdQuizzes = getData().quizId;
    for (const quiz of createdQuizzes) {
        if (quiz.authUserId === authUserId && quiz.name === name) {
            return { error: 'Quiz Name Is Already Used' };
        }
    }

    return { quizId };
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