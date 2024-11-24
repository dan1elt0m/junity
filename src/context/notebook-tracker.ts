import { INotebookTracker } from '@jupyterlab/notebook';
import { createContext } from 'react';

export const NotebookTrackerContext = createContext<INotebookTracker | null>(
  null
);
