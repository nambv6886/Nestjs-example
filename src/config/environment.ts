import * as dotenv from 'dotenv';

dotenv.config();

export const EMAIL_USERNAME = process.env.EMAIL_USERNAME;

export const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;

export const ROLE_ID = +(process.env.ROLE_ID);

export const DOMAIN = process.env.DOMAIN;

export const ACTIVE_HASH_SALT = +(process.env.ACTIVE_HASH_SALT)

export const VERIFY_MAIL_SUBJECT = process.env.VERIFY_MAIL_SUBJECT;

export const PORT = +(process.env.PORT);

export const HOST = process.env.HOST;

export const SECRET_KEY_JWT = process.env.SECRET_KEY_JWT;

export const REFRESH_LOGIN_KEY_LENGTH = +(process.env.REFRESH_LOGIN_KEY_LENGTH);

export const REFRESH_LOGIN_TIME_EXPIRES = process.env.REFRESH_LOGIN_TIME_EXPIRES;

export const REFRESH_LOGIN_JWT_KEY = process.env.REFRESH_LOGIN_JWT_KEY;