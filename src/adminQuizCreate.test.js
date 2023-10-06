// Import functions
import { adminQuizCreate } from './quiz.js';
import { adminAuthRegister } from './auth.js';
import { clear } from './other.js';

beforeEach(() => {
    clear();
});

// Test : Invalid AuthUserId Format
test('Test Invalid AuthUserId Format', () => {
    let authId = adminAuthRegister("validEmail@gmail.com", "Val1dPassword", "first", "last").authUserId;

    // authUserId contains characters
    let result = adminQuizCreate('abc', 'Quiz', 'quizDescription');
    expect(result).toMatchObject({ error: expect.any(String) });

    // authUserId contains characters and numbers
    result = adminQuizCreate('abc123', 'Quiz', 'quizDescription');
    expect(result).toMatchObject({ error: expect.any(String) });

    // authUserId contains out of range number
    result = adminQuizCreate(-1, 'Quiz', 'quizDescription');
    expect(result).toMatchObject({ error: expect.any(String) });

    // authUserId is empty
    result = adminQuizCreate(0, 'Quiz', 'quizDescription');
    expect(result).toMatchObject({ error: expect.any(String) });

});

// Test : Non-Existing AuthUserId
test('Test Non-existing AuthUserId', () => {
    let authId = adminAuthRegister("validEmail@gmail.com", "Val1dPassword", "first", "last").authUserId;

    // Correct format authUserId but does not exist in data base
    let result = adminQuizCreate(0, "QuizName", "description");
    expect(result).toMatchObject({ error: expect.any(String) });
});

// Test : Name With Invalid Characters
test('Test Name With Invalid Characters', () => {
    let authId = adminAuthRegister("validEmail@gmail.com", "Val1dPassword", "first", "last").authUserId;

    // Name contains spaces, but also special characters
    let result = adminQuizCreate(authId, "Qu1# COMP", "quizDescription");
    expect(result).toMatchObject({ error: expect.any(String) });

    // Non alphanumeric characters
    result = adminQuizCreate(authId, "Quiz~COMP", "quizDescription");
    expect(result).toMatchObject({ error: expect.any(String) });

    result = adminQuizCreate(authId, "Qu1z``+ COMP1511", "quizDescription");
    expect(result).toMatchObject({ error: expect.any(String) });

    result = adminQuizCreate(authId, "Qu1z==_-C0MP1511", "quizDescription");
    expect(result).toMatchObject({ error: expect.any(String) });

});

// Test : Name Length
test('Test Name Length', () => {
    let authId = adminAuthRegister("validEmail@gmail.com", "Val1dPassword", "first", "last").authUserId;

    // Name is less than 3 characters long
    let result = adminQuizCreate(authId, "Qu", "quizDescription");
    expect(result).toMatchObject({ error: expect.any(String) });

    // Name is empty
    result = adminQuizCreate(authId, '', "quizDescription");
    expect(result).toMatchObject({ error: expect.any(String) });

    // Name is more than 30 characters long
    result = adminQuizCreate(authId, "Quizzzzzzzzzzzzzzzz COMPPPPPPPPPPPPP", "quizDescription");
    expect(result).toMatchObject({ error: expect.any(String) });

    // Name is more than 30 characters long and contains special characters
    result = adminQuizCreate(authId, "Quizzzzzzzzzzzzzzzz C@MPPPPPPPPPPPPP", "quizDescription");
    expect(result).toMatchObject({ error: expect.any(String) });

    // Name is more than 30 characters long and contains numbers
    result = adminQuizCreate(authId, "Qu1zzzzzzzzzzzzzzzz COMPPPPPPPPPPPPP", "quizDescription");
    expect(result).toMatchObject({ error: expect.any(String) });

    // Name is more than 30 characters long, contains numbers and special character
    result = adminQuizCreate(authId, "Qu1zzzzzzzzzzzzzzzz C@MPPPPPPPPPPPPP", "quizDescription");
    expect(result).toMatchObject({ error: expect.any(String) });
});


// Test : Quiz Name Is Already Used
test('Test Quiz Name Is Already Used', () => {
    let authId = adminAuthRegister("validEmail@gmail.com", "Val1dPassword", "first", "last").authUserId;

    let quiz1 = adminQuizCreate(authId, 'quizName1', 'This quiz is about COMP1531');

    // Name is already used by the current logged in user for another quiz
    let result = adminQuizCreate(authId, 'quizName1', 'quizDescription1');
    expect(result).toMatchObject({ error: expect.any(String) });
});


// Test : Description Length
test('Test Description Length', () => {
    let authId = adminAuthRegister("validEmail@gmail.com", "Val1dPassword", "first", "last").authUserId;

    // Description is more than 100 characters
    let result = adminQuizCreate(authId, 'COMP Quiz ', 'This might be the longest quiz description ever been tested. This quiz is the most amazing quiz ever been made.');
    expect(result).toMatchObject({ error: expect.any(String) }); 
});


// Test : Valid AuthUserId, Name and Description
test('Test Valid AuthUserId, name and description', () => {
    let authId = adminAuthRegister("validEmail@gmail.com", "Val1dPassword", "first", "last").authUserId;
    console.log(authId);
    let result = adminQuizCreate(authId, 'COMP Quiz', 'COMP1531 Iteration 1 Quiz.');
    expect(result).toMatchObject({ quizId: expect.any(Number) });
});
