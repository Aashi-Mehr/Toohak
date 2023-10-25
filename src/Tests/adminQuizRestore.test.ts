import request from 'sync-request-curl';
import { port, url } from '../config.json';
import {
    requestQuizRemove
} from './testHelper';

const SERVER_URL = `${url}:${port}`;

