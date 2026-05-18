import { useAppDispatch, useAppSelector } from '@/redux/store';
import { loginUser, registerUser, logoutUser } from '@/redux/thunks/authThunks';
import { setTheme } from '@/redux/slices/uiSlice';
import { LoginPayload, RegisterPayload } from '@/types';
import { useCallback } from 'react';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, token, loading, error, isAuthenticated } = useAppSelector(
    (state) => state.auth
  );

  const login = useCallback(
    (credentials: LoginPayload) => dispatch(loginUser(credentials)).unwrap(),
    [dispatch]
  );

  const register = useCallback(
    (data: RegisterPayload) => dispatch(registerUser(data)).unwrap(),
    [dispatch]
  );

  const logout = useCallback(() => dispatch(logoutUser()), [dispatch]);

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
  };
};

export const useTheme = () => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.ui.theme);

  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    dispatch(setTheme(newTheme));
  }, [theme, dispatch]);

  return {
    theme,
    toggleTheme,
  };
};
