import { INotebookTracker } from '@jupyterlab/notebook';

// Inserts entity from the catalog explorer to the current cell's editor
export const insertEntityToNotebook = (
  entity: string,
  notebookTracker: INotebookTracker
) => {
  // Get the current notebook instance
  const current = notebookTracker.currentWidget;
  if (!current) {
    console.error('No active notebook found');
    return;
  }
  const notebook = current.content;

  // Get the current cell
  const currentCell = notebook.activeCell;
  if (!currentCell) {
    console.error('No active cell found');
    return;
  }

  // Get the current cell's editor
  const editor = currentCell.editor;
  if (!editor) {
    console.error('No editor found in the current cell');
    return;
  } // Check if replaceSelection is defined
  if (typeof editor.replaceSelection === 'function') {
    // Insert the Entity at the current cursor position
    editor.replaceSelection(entity);
  } else {
    console.error('replaceSelection method is not available on the editor');
  }
};
