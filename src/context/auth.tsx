import React, { createContext } from 'react';

interface AuthContextProps {
  accessToken: string;
  authenticated: boolean;
  currentUser: string;
}

const AuthContext = React.createContext<AuthContextProps>({
  accessToken: '',
  authenticated: false,
  currentUser: ''
});

AuthContext.displayName = 'AuthContext';

export default AuthContext;

interface LogoutContextProps {
  logout: () => void;
}

export const LogoutContext = createContext<LogoutContextProps>({
  logout: () => {
    console.warn('No logout provider found');
  }
});
