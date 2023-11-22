import twilio from 'twilio';

export async function sendSMS(body, sendTo) {
  const accountSid = process.env.ACCOUNTSID;
  const authToken = process.env.AUTHTOKEN;
  const client = twilio(accountSid, authToken);

  try {
    const message = await client.messages.create({
      body: body, // Add the message body
      from: '+13344542084',
      to: sendTo,
    });
    console.log(message.sid);
  } catch (error) {
    console.error(error);
  }
}
