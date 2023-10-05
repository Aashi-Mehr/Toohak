// Import adminQuizCreate function from quiz.js
import { adminQuizCreate } from './quiz.js';
// Import adminAuthRegister from auth.js
import { adminAuthRegister } from './auth.js';

// Test : Invalid AuthUserId Format
test('Test Invalid AuthUserId Format', () => {
    // authUserId contains characters
    let result = adminQuizCreate('abc', 'Quiz', 'quizDescription');
    expect(result).toMatchObject({ error: expect.any(String) });

    // authUserId contains characters and numbers
    let result = adminQuizCreate('abc123', 'Quiz', 'quizDescription');
    expect(result).toMatchObject({ error: expect.any(String) });

    // authUserId contains out of range number
    let result = adminQuizCreate('-1', 'Quiz', 'quizDescription');
    expect(result).toMatchObject({ error: expect.any(String) });

    // authUserId is empty
    let result = adminQuizCreate('', 'Quiz', 'quizDescription');
    expect(result).toMatchObject({ error: expect.any(String) });

});

// Test : Non-Existing AuthUserId
test('Test Non-existing AuthUserId', () => {
    // Register user by id 1
    adminAuthRegister('first.last1@gmail.com', 'Val1dPassword1', 'first1', 'last1');

    // Correct format authUserId but does not exist in data base
    let result = adminQuizInfo(4, 1);
    expect(result).toMatchObject({ error: expect.any(String) });
});

// Test : Name With Invalid Characters
test('Test Name With Invalid Characters', () => {
    // Name contains spaces, but also special characters
    let result = adminQuizCreate("1, Qu1# COMP, quizDescription");
    expect(result).toMatchObject({ error: expect.any(String) });

    // Name does not contain spaces
    let result = adminQuizCreate("1, QuizCOMP, quizDescription");
    expect(result).toMatchObject({ error: expect.any(String) });

    // Name contains spaces, but also number
    let result = adminQuizCreate("1, Qu1z COMP1511, quizDescription");
    expect(result).toMatchObject({ error: expect.any(String) });

    // Name does not contain spaces, but contains numbers and special characters
    let result = adminQuizCreate("1, Qu1zC0MP1511, quizDescription");
    expect(result).toMatchObject({ error: expect.any(String) });

});

// Test : Name Length
test('Test Name Length', () => {
    // Name is less than 3 characters long
    let result = adminQuizCreate("1, Qu, quizDescription");
    expect(result).toMatchObject({ error: expect.any(String) });

    // Name is empty
    let result = adminQuizCreate("1, '', quizDescription");
    expect(result).toMatchObject({ error: expect.any(String) });

    // Name is more than 30 characters long
    let result = adminQuizCreate("1, Quizzzzzzzzzzzzzzzz COMPPPPPPPPPPPPP, quizDescription");
    expect(result).toMatchObject({ error: expect.any(String) });

    // Name is more than 30 characters long and contains special characters
    let result = adminQuizCreate("1, Quizzzzzzzzzzzzzzzz C@MPPPPPPPPPPPPP, quizDescription");
    expect(result).toMatchObject({ error: expect.any(String) });

    // Name is more than 30 characters long and contains numbers
    let result = adminQuizCreate("1, Qu1zzzzzzzzzzzzzzzz COMPPPPPPPPPPPPP, quizDescription");
    expect(result).toMatchObject({ error: expect.any(String) });

    // Name is more than 30 characters long, contains numbers and special character
    let result = adminQuizCreate("1, Qu1zzzzzzzzzzzzzzzz C@MPPPPPPPPPPPPP, quizDescription");
    expect(result).toMatchObject({ error: expect.any(String) });

});

// Test : Quiz Name Is Already Used
test('Test Quiz Name Is Already Used', () => {
    let quizName1 = adminQuizCreate('1', 'COMP Quiz', 'This quiz is about COMP1531').name;
    let quizDescription1 = adminQuizCreate('1', 'Quiz Comp', 'This quiz is about COMP1531').description;

    // Name is already used by the current logged in user for another quiz
    let result = adminQuizCreate('1', 'quizName1', 'quizDescription1');
    expect(result).toMatchObject({ error: expect.any(String) });
});

// Test : Description Length
test('Test Description Length', () => {
    // Description is more than 100 characters
    let result = adminQuizCreate('1', 'COMP Quiz ', 'This might be the longest quiz description ever been tested. This quiz is the most amazing quiz ever been made.');
    expect(result).toMatchObject({ error: expect.any(String) }); 
});

// Test : Valid AuthUserId, Name and Description
test('Test Valid AuthUserId, name and description', () => {
    let result = adminQuizCreate('1', 'COMP Quiz', 'COMP1531 Iteration 1 Quiz.');
    expect(result).toMatchObject({ quizId: expect.any(number)});
});
