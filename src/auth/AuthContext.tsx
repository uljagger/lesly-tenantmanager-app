// authContext.js

import React, { createContext, useState } from 'react';

export const AuthContext = createContext('');

  
export const AuthContextProvider = ({ children }: any) => {
  const [token] = useState('init_token');

  return (
    <AuthContext.Provider value={token}>
      {children}
    </AuthContext.Provider>
  )
}

// export default AuthContext;
