import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { sendMailWithGmail } from "@/integrations/nodemail/server/gmail-client";

// Schema + Types
const requestDataSchema = z.object({
  contact_name: z.string(),
  contact_email: z.string().email(),
  contact_message: z.string(),
  /** Name of the source which request comes from. i.e. portfolio | facebook  */
  source_key: z.string(),
  /** URL of the source. i.e. /contact-me | /about  */
  source_href: z.string(),
  /** Date of the request, in ISO */
  date_iso_string: z.string(),
  /** Date of the request, in locale string. Locale depends on the client that performed the request, i.e the user browser that filled the form. This is a good format to be understood by the user who performed the request. Use this if you need to inform the user vie email when the request happened. */
  date_locale_string: z.string(),
});
export type RequestData = z.infer<typeof requestDataSchema>;
export type ResponseData = {
  success: boolean,
};


// Handler

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {

  try {
    // extract request data
    const data = requestDataSchema.safeParse(req.body);
    if (!data.success) {
      throw new Error(
        `Invalid request data. This should never happens because we have Client Side Validation, so check the code.
        \n
        request:
        ${JSON.stringify(req.body ?? {}, null, 2)}`
      );
    }

    // send mail to me
    const forwarded_to_me = await sendMailWithGmail({
      from: 'Jacopo Marrone jacopo.marrone27@gmail.com',
      to: 'jacopo.marrone27@gmail.com',
      subject: "New Contact from portfolio.",
      text: `
      New Contact from portfolio.
      Name: ${data.data.contact_name}
      Email: ${data.data.contact_email}
      Message: ${data.data.contact_message}

      Source Key: ${data.data.source_key}
      Source Path: ${data.data.source_href}
      Date ISO: ${data.data.date_iso_string}
      Date Locale String (for who submit the form): ${data.data.date_locale_string}
      `,
      html: `
      <h3>New Contact from portfolio.</h3>
      <br />
      <br />
      <br />Name: ${data.data.contact_name}
      <br />Email: ${data.data.contact_email}
      <br />Message: ${data.data.contact_message}
      <br />
      <br />
      <br />Source Key: ${data.data.source_key}
      <br />Source Path: ${data.data.source_href}
      <br />Date ISO: ${data.data.date_iso_string}
      <br />Date Locale String (for who submit the form): ${data.data.date_locale_string}
      `
    });

    if (!forwarded_to_me) {
      throw new Error("Error forwarding message to my email.");
    }


    // send email of confirmation to who submit the form
    const confimed_to_requester = await sendMailWithGmail({
      from: 'Jacopo Marrone jacopo.marrone27@gmail.com',
      to: data.data.contact_email,
      subject: "Thank You for Your Message",
      text: `
      Hello ${data.data.contact_name},

      I just wanted to let you know that I received your message through the contact form on jacopomarrone.com.
      I appreciate the time you've taken to reach out to me.  

      I will respond you as soon as possible.

      Best regards,
      Jacopo Marrone

      Your message:
      Name: ${data.data.contact_name}
      Email: ${data.data.contact_email}
      Message: ${data.data.contact_message}
      Date: ${data.data.date_locale_string}
      `,
      html: `
      <p>
      Hello ${data.data.contact_name},
      <br />
      <br />I just wanted to let you know that I received your message through the contact form on jacopomarrone.com.
      <br />I appreciate the time you've taken to reach out to me.
      <br />
      <br />I will respond you as soon as possible
      <br />
      <br />Best regards,
      <br />Jacopo Marrone
      </p>
      <br />
      <br />
      Your message:<br />
      Name: ${data.data.contact_name}<br />
      Email: ${data.data.contact_email}<br />
      Message: ${data.data.contact_message}<br />
      Date: ${data.data.date_locale_string}<br />
      `
    });
    if (!confimed_to_requester) {
      throw new Error("Error forwarding message to my who submitted the form.");
    }

    // response
    console.log({ who: "/api/sendmail", success: true });
    res
      .status(200)
      .json({ success: true });

  } catch (error) {
    console.log({ who: "/api/sendmail", success: false });
    console.error(error);
    res
      .status(500)
      .json({ success: false });
  }

}