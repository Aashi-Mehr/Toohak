import { ErrorObject } from "../dataStore";
import {
	requestClear,
	requestQuesDelete,
	requestQuesDup,
	requestQuesMove,
	requestQuesUpdate,
	requestQuestionCreate,
	requestQuizCreate,
	requestRegister
} from "./testHelper";

let token1: number;
let quizId1: number;
let questionId1: number;
let result: ErrorObject | Record<string, never>;

const initialQ = {
	question: 'What is the first letter of the alphabet?',
	duration: 10,
	points: 5,
	answers: [{
		answer: 'a',
		correct: true
	},
	{
		answer: 'b',
		correct: false
	}]
};

const finalQ = {
	question: 'What is the second letter of the alphabet?',
	duration: 15,
	points: 10,
	answers: [{
		answer: 'b',
		correct: true
	},
	{
		answer: 'a',
		correct: false
	}]
};

beforeEach(() => {
	// Clearing any previous data
	requestClear();

	// Defining base data to be manipulated in the tests (Updated/Deleted)
	token1 = requestRegister('am@gmail.com', 'Vl1dPass', 'fir', 'las').token;
	quizId1 = requestQuizCreate(token1, 'New Quiz 1', '').quizId;
	questionId1 = requestQuestionCreate(token1, quizId1, initialQ).questionId;
});

describe('adminQuizQuestionUpdate', () => {
	// Error Checking

	test('QuestionId does not refer to a valid question within this quiz', () => {
		// QuestionId does not refer to a valid question within this quiz
		result = requestQuesUpdate(token1, quizId1, questionId1 + 1, finalQ);
		expect(result).toMatchObject({ error: expect.any(String) });
	});

  // Question string is less than 5 characters in length or greater than 50 characters in length
  // The question has more than 6 answers or less than 2 answers
  // The question duration is not a positive number
  // If this question were to be updated, the sum of the question durations in the quiz exceeds 3 minutes
  // The points awarded for the question are less than 1 or greater than 10
  // The length of any answer is shorter than 1 character long, or longer than 30 characters long
  // Any answer strings are duplicates of one another (within the same question)
  // There are no correct answers
	// Token is empty or invalid (does not refer to valid logged in user session)
	// Valid token is provided, but user is unauthorised to complete this action
	// Multiple erros, so the response should have a correct 'status code'

	// Valid Cases
	// Checking a simple case of restructuring a question
	// Rstructuring multiple questions
	// Moving, then updating
	// Duplicating then updating
});

describe('adminQuizQuestionDelete', () => {
	// Error Checking

	test('Question Id does not refer to a valid question within this quiz', () => {
		// Question Id does not refer to a valid question within this quiz
		result = requestQuesDelete(token1, quizId1, questionId1 + 1);
		expect(result).toMatchObject({ error: expect.any(String) });
	});

	// Token is empty or invalid (does not refer to valid logged in user session)
	// Valid token is provided, but user is unauthorised to complete this action
	// Multiple erros, so the response should have a correct 'status code'

	// Valid Cases
	// Checking a simple case of deleting a question
	// Updating, then deleting a question
});