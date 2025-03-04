// external imports
import nodemailer from "nodemailer";

async function notifyResident(
  residentMail: string,
  visitorName: string,
  visitorPhone: string
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

  // checkin error
  transporter.verify(function (error, _success) {
    if (error) {
      console.log(error);
    } else {
      console.log("Server is ready to take our messages");
    }
  });

  const info = await transporter.sendMail({
    from: `"EntryBuddy Developer 👻" <testmodedevelopment111@gmail.com>`, // sender address
    to: `${residentMail}`, // list of receivers
    subject: "Request Appointment", // Subject line
    text: "You are requested to an appointment", // plain text body
    html: `<h3>Visitor details</h3>
              <p><b>Visitor Name</b>: ${visitorName}</p>
              <br />
              <p><b>Visitor phone number:</b>${visitorPhone}</p>
              <br />
              <p><b>Note:</b> More details, visit your society profile :)</p>
      `,
  });
}

async function sendSocietyId(receivers: string, societyId: string) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    port: 465,
    auth: {
      user: "testmodedevelopment111@gmail.com",
      pass: "zhswqucmuqchbqwf",
    },
  });

  // checkin error
  transporter.verify(function (error, _success) {
    if (error) {
      console.log(error);
    } else {
      console.log("Server is ready to take our messages");
    }
  });

  const info = await transporter.sendMail({
    from: `"EntryBuddy Developer 👻" <testmodedevelopment111@gmail.com>`, // sender address
    to: `${receivers}`, // list of receivers
    subject: "Authentication", // Subject line
    text: "This id is sent for user login purpose and make it secure", // plain text body
    html: `<h3>Use this Id and password for login</h3>
              <p><b>${"Society Id"}</b>: ${societyId}</p>
              <br />
              <p><b>Note:</b>society id should be saved</p>
              
      `,
  });
}

// this function sends mail to selected user by admin
async function sendMailByAdmin(
  receiverMail: string,
  password: string,
  societyId: string
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
    to: `${receiverMail}`, // list of receivers
    subject: "Authentication", // Subject line
    text: "This id and password is sent for user login purpose and make it secure", // plain text body
    html: `<h3>Use this Id and password for login</h3>
              <p><b>${"Society Id"}</b>: ${societyId}</p>
              <p><b>password</b>: ${password}</p>
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

async function confirmMailToVisitor(visitorEmail: string, permitOTP: number) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    port: 465,
    auth: {
      user: "testmodedevelopment111@gmail.com",
      pass: "zhswqucmuqchbqwf",
    },
  });

  // checkin error
  transporter.verify(function (error, _success) {
    if (error) {
      console.log(error);
    } else {
      console.log("Server is ready to take our messages");
    }
  });

  const info = await transporter.sendMail({
    from: `"EntryBuddy Developer 👻" <testmodedevelopment111@gmail.com>`, // sender address
    to: `${visitorEmail}`, // list of receivers
    subject: "Appointment Confirmation", // Subject line
    text: "Your appointment book is confirmed", // plain text body
    html: `<h3>Appointment Confirmation details</h3>
              <p><b>Permission OTP</b>: ${permitOTP}</p>
              <br />
              <p><b>Note:</b> This OTP is checked by society guard for allowing</p>
      `,
  });
}

async function denyMailToVisitor(visitorEmail: string) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    port: 465,
    auth: {
      user: "testmodedevelopment111@gmail.com",
      pass: "zhswqucmuqchbqwf",
    },
  });

  // checkin error
  transporter.verify(function (error, _success) {
    if (error) {
      console.log(error);
    } else {
      console.log("Server is ready to take our messages");
    }
  });

  const info = await transporter.sendMail({
    from: `"EntryBuddy Developer 👻" <testmodedevelopment111@gmail.com>`, // sender address
    to: `${visitorEmail}`, // list of receivers
    subject: "Appointment Deny", // Subject line
    text: "Your appointment book is denied", // plain text body
    html: `<h3>Your appointment has beed denied</h3>
      `,
  });
}

export default {
  sendMailByAdmin,
  sendOtpByMail,
  sendSocietyId,
  notifyResident,
  confirmMailToVisitor,
  denyMailToVisitor,
};
