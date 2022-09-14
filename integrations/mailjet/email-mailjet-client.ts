require('dotenv').config();
import Mailjet from 'node-mailjet'

const API_PUBLIC_KEY = process.env.MAILJET_API_KEY || 'no dev/staging key';
const API_SECRET_KEY = process.env.MAILJET_API_SECRET || 'no dev/staging key';

// create client
export const email_mailjet_client = new Mailjet({
  apiKey: API_PUBLIC_KEY,
  apiSecret: API_SECRET_KEY
});