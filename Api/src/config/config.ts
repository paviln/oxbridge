const env = process.env;
const errorMessage = 'The envirement variable ';

export const getJwtSecret = () => {
  const config = env.jwtSectetKey;
  if (config == null) {
    throw new Error(errorMessage + 'jwt secret key is not defined.');
  }
  return config;
};
