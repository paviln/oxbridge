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

export const getEmailInfo = () => {

  const config ={
  user: process.env.MAIL_USERNAME,
  pass: process.env.MAIL_PASSWORD,
  clientId: process.env.OAUTH_CLIENTID,
  clientSecret: process.env.OAUTH_CLIENT_SECRET,
  refreshToken: process.env.OAUTH_REFRESH_TOKEN,
  redirectUrl: process.env.OAUTH_REDIRECT_URL
  }
  if (config == null) {
    throw new Error(errorMessage + 'you suck.');
  }
  return config;
}

export const mailOptions = {
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
      user: 'oxbridge.noreply@gmail.com',
      pass: 'Oxbridge1234!'
  },
}

export const mailConfigTest = {
  host: "smtp.ethereal.email",
  port: 587,
  secure: false,
  auth: {
      user: 'haylee.price@ethereal.email',
      pass: 'mRmv9EXz97jZHjr5JJ'
  },
}