import { setupServer } from 'msw/node';
import { ucHandlers } from './ucHandlers';

export const ucServer = setupServer(...ucHandlers);
