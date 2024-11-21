import React from 'react';

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
