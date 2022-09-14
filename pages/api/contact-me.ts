// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import type { SendEmailV3_1 } from 'node-mailjet';
import { email_mailjet_client as mailjet_client } from '@/integrations/mailjet';

export type RequestData = {
  /** Contact name, comes from form */
  contact_name: string,
  /** Contact email, comes from form */
  contact_email: string,
  /** Contact message, comes from form */
  contact_message: string,
  /** Name of the source which request comes from. i.e. portfolio | facebook  */
  source_key: string,
  /** Name of the path which request comes from. i.e. /contact-me | /about  */
  source_path: string,
  /** Date of the request, in Unix timestamp */
  date_timestamp: number,
  /** Date of the request, in ISO */
  date_iso_string: string,
  /** Date of the request, in locale string. Locale depends on the client that performed the request, i.e the user browser that filled the form. This is a good format to be understood by the user who performed the request. Use this if you need to inform the user vie email when the request happened. */
  date_locale_string: string,
}
type ResponseData = {
  success: boolean
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {

  try {
    // extract request data
    const {
      contact_name,
      contact_email,
      contact_message,
      source_key,
      source_path,
      date_timestamp,
      date_iso_string,
      date_locale_string
    }: RequestData = req.body;

    // send mail to me
    const forwarded_to_me = await forwardMessageToMyEmail({
      contact_name,
      contact_email,
      contact_message,
      source_key,
      source_path,
      date_timestamp,
      date_iso_string,
    });
    if (!forwarded_to_me) {
      throw new Error("Error forwarding message to my email.");
    }

    // send mail to contactor
    const confirmed_to_contactor = await sendConfirmationEmailToContactor({
      contact_name,
      contact_email,
      contact_message,
      date_locale_string
    });
    if (!confirmed_to_contactor) {
      throw new Error("Error sending confirmation email to contactor.");
    }

    // response
    res
      .status(200)
      .json({ success: true });

  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false });
  }

}


type ForwardMessageToMyEmailData = Pick<
  RequestData,
  | 'contact_name'
  | 'contact_email'
  | 'contact_message'
  | 'source_key'
  | 'source_path'
  | 'date_timestamp'
  | 'date_iso_string'
>;
async function forwardMessageToMyEmail(data: ForwardMessageToMyEmailData) {

  const {
    contact_name,
    contact_email,
    contact_message,
    source_key,
    source_path,
    date_timestamp,
    date_iso_string
  } = data;

  try {
    const data: SendEmailV3_1.IBody = {
      Messages: [
        {
          From: {
            Email: "jacopo.marrone27@gmail.com",
            Name: "Jacopo Marrone"
          },
          To: [
            {
              Email: "jacopo.marrone27@gmail.com",
              Name: "Jacopo Marrone"
            }
          ],
          Subject: "New Contact from portfolio.",
          TextPart: `
          New Contact from portfolio.
          Name: ${contact_name}
          Email: ${contact_email}
          Message: ${contact_message}
          Source Key: ${source_key}
          Source Path: ${source_path}
          Date Timestamp: ${date_timestamp}
          Date ISO: ${date_iso_string}
          `,
          HTMLPart: `
          <h3>New Contact from portfolio.</h3>
          <br />
          <br />
          <br />Name: ${contact_name}
          <br />Email: ${contact_email}
          <br />Message: ${contact_message}
          <br />Source Key: ${source_key}
          <br />Source Path: ${source_path}
          <br />Date Timestamp: ${date_timestamp}
          <br />Date ISO: ${date_iso_string}
          `,
        }
      ]
    };

    const result = await mailjet_client
      .post("send", { version: 'v3.1' })
      .request({ ...data });

    console.log(result.body);

    const { Status } = (result.body as unknown as SendEmailV3_1.IResponse).Messages[0];
    if (Status === 'success') {
      return true;
    }

    throw new Error('Unexpected error');
  } catch (err) {
    console.log(err);
    return false;
  }
}

type SendConfirmationToContactorData = Pick<
  RequestData,
  | 'contact_name'
  | 'contact_email'
  | 'contact_message'
  | 'date_locale_string'
>;
async function sendConfirmationEmailToContactor(data: SendConfirmationToContactorData) {

  const {
    contact_name,
    contact_email,
    contact_message,
    date_locale_string
  } = data;

  try {

    const data: SendEmailV3_1.IBody = {
      Messages: [
        {
          From: {
            Email: "jacopo.marrone27@gmail.com",
            Name: "Jacopo Marrone"
          },
          To: [
            {
              Email: contact_email,
              Name: contact_name
            }
          ],
          Subject: "Your message is arrived.",
          TextPart: `
          Your message has been delivered to me.

          Thank for your interest.
          I will contact you as soon as possible.

          Your message:
          Name: ${contact_name}
          Email: ${contact_email}
          Message: ${contact_message}
          Date: ${date_locale_string}
          `,
          HTMLPart: `
            <h3>Your message has been delivered to me.</h3>
            <br />
            Thank for your interest.
            I will contact you as soon as possible.
            <br />
            <br />
            Your message:<br />
            Name: ${contact_name}<br />
            Email: ${contact_email}<br />
            Message: ${contact_message}<br />
            Date: ${date_locale_string}<br />
          `,
        }
      ]
    };

    const result = await mailjet_client
      .post("send", { version: 'v3.1' })
      .request({ ...data });

    // console.log(result.body);

    const { Status } = (result.body as unknown as SendEmailV3_1.IResponse).Messages[0];
    if (Status === 'success') {
      return true;
    }

    throw new Error('Unexpected error');
  } catch (err) {
    console.log(err);
    return false;
  }
}