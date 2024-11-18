// external import
import nodemailer from "nodemailer";

// this function sends mail to selected user by admin
async function sendMailByAdmin(
  receivers: string,
  password: string,
  id: string,
  role: string,
  verifyToken: string
) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    port: 465,
    auth: {
      user: "testmodedevelopment111@gmail.com",
      pass: "zhswqucmuqchbqwf",
    },
  });

  transporter.verify(function (error, _success) {
    if (error) {
      console.log(error);
    } else {
      console.log("Server is ready to take our messages");
    }
  });

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: `"EntryBuddy Developer 👻" <testmodedevelopment111@gmail.com>`, // sender address
    to: `${receivers}`, // list of receivers
    subject: "Authentication", // Subject line
    text: "This id and password is sent for user login purpose and make it secure", // plain text body
    html: `<h3>Use this Id and password for login</h3>
            <p><b>${
              role === "guard" ? "Working Id" : "Residence Id"
            }</b>: ${id}</p>
            <p><b>password</b>: ${password}</p>
            <p><b>Verify Token</b>: ${verifyToken}</p>
            <br />
            <p><b>Note:</b> Token will expired after 10 minutes</p>
    `,
  });

  // TODO: This logs for development
  // console.log("Message sent: %s", info.messageId);
  // console.log(info);
}

async function sendOtpByMail(receiverMail: string, otp: string) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    port: 465,
    auth: {
      user: "testmodedevelopment111@gmail.com",
      pass: "zhswqucmuqchbqwf",
    },
  });

  await transporter.sendMail({
    from: `"EntryBuddy Developer 👻" <testmodedevelopment111@gmail.com>`, // sender address
    to: `${receiverMail}`, // list of receivers
    subject: "Authentication", // Subject line
    text: "user can set new password after verify this OTP", // plain text body
    html: `<h3>OTP: ${otp}</h3>`,
  });
}

export default {
  sendMailByAdmin,
  sendOtpByMail,
};
