export const TOKEN_COOKIE_NAME = 'auth_token';
export const TOKEN_TYPE_COOKIE_NAME = 'token_type';

export const setAuthTokens = (tokens: { access_token: string; token_type: string }) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + (24 * 60 * 60 * 1000)); // 24 hours

  document.cookie = `${TOKEN_COOKIE_NAME}=${encodeURIComponent(tokens.access_token)}; expires=${expires.toUTCString()}; path=/; SameSite=Strict`;
  document.cookie = `${TOKEN_TYPE_COOKIE_NAME}=${encodeURIComponent(tokens.token_type)}; expires=${expires.toUTCString()}; path=/; SameSite=Strict`;
};

export const getAuthTokens = (): { access_token: string; token_type: string } | null => {
  const cookies = document.cookie.split(';');
  let accessToken = '';
  let tokenType = '';

  cookies.forEach(cookie => {
    const [name, value] = cookie.trim().split('=');
    if (name === TOKEN_COOKIE_NAME) accessToken = decodeURIComponent(value);
    if (name === TOKEN_TYPE_COOKIE_NAME) tokenType = decodeURIComponent(value);
  });

  return accessToken && tokenType ? { access_token: accessToken, token_type: tokenType } : null;
};

export const clearAuthTokens = () => {
  document.cookie = `${TOKEN_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  document.cookie = `${TOKEN_TYPE_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

export const isAuthenticated = (): boolean => {
  return getAuthTokens() !== null;
};