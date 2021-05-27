export const env = process.env.NODE_ENV;
const errorMessage = 'The envirement variable ';
export default {
  jwtSectetKey: process.env.SECRET || '',
};
export const getJwtSecret = () => {
  const config = process.env.jwtSectetKey;
  if (config == null) {
    throw new Error(errorMessage + 'jwt secret key is not defined.');
  }
  return config;
};

export const email = {
  user: process.env.EMAIL_USERNAME,
  pass: process.env.EMAIL_PASSWORD,
  clientId: process.env.OAUTH_CLIENTID,
  clientSecret: process.env.OAUTH_CLIENT_SECRET,
  refreshToken: process.env.OAUTH_REFRESH_TOKEN
}