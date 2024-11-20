import { BroadcastChannel } from 'worker_threads';
import { ucServer } from './src/__mocks__/ucServer';
import xhr2 from 'xhr2';

Reflect.set(globalThis, 'BroadcastChannel', BroadcastChannel);
// global.XMLHttpRequest = xhr2;

beforeAll(() => {
  // Start the interception.
  ucServer.listen();
});

afterEach(() => {
  // Remove any handlers you may have added
  // in individual tests (runtime handlers).
  ucServer.resetHandlers();
});

afterAll(() => {
  // Disable request interception and clean up.
  ucServer.close();
});
