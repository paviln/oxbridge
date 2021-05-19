const env = process.env;

export default {
  jwtSectetKey: env.SECRET || '',
};
