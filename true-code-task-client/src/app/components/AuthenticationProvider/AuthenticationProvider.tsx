import { PropsWithChildren, FC, useEffect, useState, useCallback } from 'react';
import { AuthForm } from './AuthForm';

export const AuthenticationProvider: FC<PropsWithChildren> = ({ children }) => {
  const [isAitenticated, setIsAuthenticated] = useState(false);

  const onStorageChange = useCallback(() => {
    const token = localStorage.getItem('token');
    if (token) setIsAuthenticated(true);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setIsAuthenticated(true);
  }, []);

  useEffect(() => {
    window.addEventListener('storage', onStorageChange);
    return () => window.removeEventListener('storage', onStorageChange);
  }, [onStorageChange]);

  return isAitenticated ? children : <AuthForm />;
};
