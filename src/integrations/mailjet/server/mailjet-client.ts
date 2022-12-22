import Mailjet from 'node-mailjet';
import { MAILJET_API_KEY, MAILJET_API_SECRET } from '@/constants/server';

export const mailjet_client = new Mailjet({
  apiKey: MAILJET_API_KEY,
  apiSecret: MAILJET_API_SECRET,
});
