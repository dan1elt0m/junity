import { insertEntityToNotebook } from '../../notebook/insertEntity';

import { INotebookTracker } from '@jupyterlab/notebook';

describe('insertEntityToNotebook', () => {
  let mockNotebookTracker: jest.Mocked<INotebookTracker>;
  let mockEditor: { replaceSelection: jest.Mock };

  beforeEach(() => {
    mockEditor = { replaceSelection: jest.fn() };
    mockNotebookTracker = {
      currentWidget: {
        content: {
          activeCell: {
            editor: mockEditor
          }
        }
      }
    } as unknown as jest.Mocked<INotebookTracker>;
  });

  it('should insert the path into the current cell\'s editor', () => {
    const entity = 'catalog1.schema1.table1';
    insertEntityToNotebook(entity, mockNotebookTracker);

    expect(mockEditor.replaceSelection).toHaveBeenCalledWith(entity);
  });

  it('should log an error if there is no active notebook', () => {
    console.error = jest.fn();
    mockNotebookTracker.currentWidget = null;

    insertEntityToNotebook('catalog1.schema1.table1', mockNotebookTracker);

    expect(console.error).toHaveBeenCalledWith('No active notebook found');
  });

  it('should log an error if there is no active cell', () => {
    console.error = jest.fn();
    mockNotebookTracker.currentWidget.content.activeCell = null;

    insertEntityToNotebook('catalog1.schema1.table1', mockNotebookTracker);

    expect(console.error).toHaveBeenCalledWith('No active cell found');
  });

  it('should log an error if there is no editor in the current cell', () => {
    console.error = jest.fn();
    mockNotebookTracker.currentWidget.content.activeCell.editor = null;

    insertEntityToNotebook('catalog1.schema1.table1', mockNotebookTracker);

    expect(console.error).toHaveBeenCalledWith('No editor found in the current cell');
  });

  it('should log an error if replaceSelection method is not available on the editor', () => {
    console.error = jest.fn();
    mockEditor.replaceSelection = undefined;

    insertEntityToNotebook('catalog1.schema1.table1', mockNotebookTracker);

    expect(console.error).toHaveBeenCalledWith('replaceSelection method is not available on the editor');
  });
});