// Using ESM syntax
import sgMail from "@sendgrid/mail";

export async function sendMail(recipient, subject, message) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: recipient,
    from: "thomas@onecode.dk",
    subject: subject,
    text: message,
    html: `<strong>${message}</strong>`,
  };

  await sgMail.send(msg);
}
