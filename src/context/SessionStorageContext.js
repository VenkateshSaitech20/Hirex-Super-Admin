import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

const SessionStorageContext = createContext();

export const SessionStorageProvider = ({ children }) => {
  const [username, setUsername] = useState(sessionStorage.getItem('username'));
  const [empno, setEmpno] = useState(sessionStorage.getItem('empno'));
  const [token, setToken] = useState(sessionStorage.getItem('token'));

  const contextValue = useMemo(() => ({ username, setUsername, token, setToken, empno, setEmpno }), [username, token, empno]);

  useEffect(() => {
    if (username !== null && token !== null && empno !== null) {
      sessionStorage.setItem('username', username);
      sessionStorage.setItem('empno', empno);
      sessionStorage.setItem('token', token);
    }
  }, [username, token, empno]);

  return (
    <SessionStorageContext.Provider value={contextValue}>
      {children}
    </SessionStorageContext.Provider>
  );
};

SessionStorageProvider.propTypes = {
    children : PropTypes.any
}

export const useSessionStorage = () => {
  return useContext(SessionStorageContext);
};