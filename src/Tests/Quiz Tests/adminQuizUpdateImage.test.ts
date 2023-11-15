// Importing Functions
import HTTPError from 'http-errors';

import {
  requestClear,
  requestQuizCreate,
  requestQuizDescriptionUpdate,
  requestQuizImageUpdate,
  requestQuizInfo,
  requestRegister
} from '../testHelper';

// Defining base data
const validUrl = 'https://img.freepik.com/free-vector/support-local-business-' +
  'concept_23-2148592675.jpg';
const validUrl2 = 'https://img.freepik.com/free-vector/hand-drawn-iranian-wom' +
  'en-illustration_23-2149855924.jpg';
const validUrl3 = 'https://img.freepik.com/free-vector/people-analyzing-growt' +
  'h-charts_23-2148866843.jpg';
const invalidType = 'https://i0.wp.com/www.galvanizeaction.org/wp-content/upl' +
  'oads/2022/06/Wow-gif.gif';
const invalidType2 = 'https://en.wikipedia.org/wiki/Food';
const invalidFile = 'ThisIsCompletelyInvalid.jpg';

let token1: number;
let quizId1: number;
let token2: number;
let quizId2: number;

// Ensuring data is clear
beforeEach(() => {
  requestClear();

  token1 = requestRegister('am@gmail.com', 'Vl1dPass', 'fir', 'las').token;
  quizId1 = requestQuizCreate(token1, 'Quiz 11', '').quizId;

  token2 = requestRegister('ab@gmail.com', 'Vl1dPass', 'fir', 'las').token;
  quizId2 = requestQuizCreate(token2, 'Quiz 21', '').quizId;
});

// Error Checking
describe('adminQuizImageUpdate Error Cases', () => {
  // 403: Valid token is provided, but user is unauthorised
  test('403: Valid token is provided, but user is unauthorised', () => {
    expect(() => requestQuizImageUpdate(
      token2, quizId1, validUrl
    )).toThrow(HTTPError[403]);
  });

  // 401: Token is empty
  test('401: Token is empty', () => {
    expect(() => requestQuizImageUpdate(
      0, quizId1, validUrl
    )).toThrow(HTTPError[401]);
  });

  // 401: Token is invalid
  test('401: Token is invalid', () => {
    // Minimum possible token is 8 digits
    expect(() => requestQuizImageUpdate(
      9999999, quizId1, validUrl
    )).toThrow(HTTPError[401]);
  });

  // 400: imgUrl when fetch is not a JPG or PNG image
  test('400: imgUrl when fetch is not a JPG or PNG image', () => {
    expect(() => requestQuizImageUpdate(
      token1, quizId1, invalidType
    )).toThrow(HTTPError[400]);
  });

  // 400: imgUrl when fetch is not a JPG or PNG image
  test('400: imgUrl when fetch is not a JPG or PNG image', () => {
    expect(() => requestQuizImageUpdate(
      token1, quizId1, invalidType2
    )).toThrow(HTTPError[400]);
  });

  // 400: imgUrl when fetched does not return a valid file
  test('400: imgUrl when fetched does not return a valid file', () => {
    expect(() => requestQuizImageUpdate(
      token1, quizId1, invalidFile
    )).toThrow(HTTPError[400]);
  });

  // Compounded errors, should return largest number
  test('401: Token and image URL are invalid', () => {
    expect(() => requestQuizImageUpdate(
      token1 * token2, quizId1, invalidFile
    )).toThrow(HTTPError[401]);
  });

  // Compounded errors, should return largest number
  test('403: Quiz Id and image URL are invalid', () => {
    expect(() => requestQuizImageUpdate(
      token1, quizId2, invalidFile
    )).toThrow(HTTPError[403]);
  });

  // Compounded errors, should return largest number
  test('403: Quiz Id and token are invalid', () => {
    expect(() => requestQuizImageUpdate(
      token2, quizId1, invalidFile
    )).toThrow(HTTPError[403]);
  });
});

// Valid Updates
describe('adminQuizImageUpdate Valid Cases', () => {
  // Valid token is provided, user authorised, and the URL is valid
  test('Simple Case 1', () => {
    const result = requestQuizImageUpdate(token1, quizId1, validUrl);
    expect(Object.keys(result).length).toStrictEqual(0);
  });

  // Valid token is provided, user authorised, and the URL is valid
  test('Simple Case 2', () => {
    const result = requestQuizImageUpdate(token1, quizId1, validUrl2);
    expect(Object.keys(result).length).toStrictEqual(0);
  });

  // Valid token is provided, user authorised, and the URL is valid
  test('Simple Case 3', () => {
    const result = requestQuizImageUpdate(token1, quizId1, validUrl3);
    expect(Object.keys(result).length).toStrictEqual(0);
  });

  // Valid token is provided, user authorised, and the URL is valid
  test('Complex Case 1', () => {
    requestQuizImageUpdate(token1, quizId1, validUrl);
    const result = requestQuizImageUpdate(token1, quizId1, validUrl2);
    expect(Object.keys(result).length).toStrictEqual(0);
  });

  // Valid token is provided, user authorised, and the URL is valid
  test('Complex Case 2', () => {
    requestQuizImageUpdate(token1, quizId1, validUrl);
    requestQuizDescriptionUpdate(token1, quizId1, 'New Desc');
    const result = requestQuizInfo(token1, quizId1);
    expect(result.thumbnailUrl).toStrictEqual(validUrl);
  });
});
