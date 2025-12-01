import dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT || 5001;
export const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-change-me';
