const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export const generateShortCode = (length = 6): string => {
  let code = '';
  for (let i = 0; i < length; i++) {
    code += charset[Math.floor(Math.random() * charset.length)];
  }
  return code;
};
