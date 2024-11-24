import React from 'react';
import { JupyterFrontEnd } from '@jupyterlab/application';

export interface AppContextProps {
  app: JupyterFrontEnd;
}

const AppContext = React.createContext<AppContextProps>({
  app: {} as JupyterFrontEnd
});

AppContext.displayName = 'AppContext';

export default AppContext;
