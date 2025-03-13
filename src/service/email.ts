// external imports
import nodemailer from "nodemailer";

// create transposter
async function createTransporter() {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    port: 465,
    auth: {
      user: "testmodedevelopment111@gmail.com",
      pass: "zhswqucmuqchbqwf",
    },
  });

  try {
    await transporter.verify();
    console.log("✅ Transporter is verified and ready to send emails.");
    return transporter;
  } catch (error) {
    console.error("❌ Transporter verification failed:", error);
    return null;
  }
}

async function sendSelfId(recieverEmail: string, selfId: string) {
  const transporter = await createTransporter();
  if (!transporter) {
    console.log("Cannot send email, transporter not available.");
    return;
  }

  const info = await transporter.sendMail({
    from: `"EntryBuddy Developer 👻" <testmodedevelopment111@gmail.com>`, // sender address
    to: `${recieverEmail}`, // recipient email
    subject: "Your Society Residence ID", // Subject line
    text: "Welcome to your new society! Your residence ID has been generated.", // plain text body
    html: `<h3>Welcome to Your New Society!</h3>
           <p><b>Residence ID</b>: ${selfId}</p>
           <br />
           <p><b>Note:</b> Please keep this ID safe as it will be required for verification at the society gate.</p>
    `,
  });

  return info;
}

// this mail for visitor to confirmation booked appointment with permission OTP
async function confirmMailToVisitor(recieverEmail: string, permitOTP: number) {
  const transporter = await createTransporter();
  if (!transporter) {
    console.log("Cannot send email, transporter not available.");
    return;
  }

  const info = await transporter.sendMail({
    from: `"EntryBuddy Developer 👻" <testmodedevelopment111@gmail.com>`, // sender address
    to: `${recieverEmail}`, // list of receivers
    subject: "Appointment Confirmation", // Subject line
    text: "Your appointment book is confirmed", // plain text body
    html: `<h3>Appointment Confirmation details</h3>
              <p><b>Permission OTP</b>: ${permitOTP}</p>
              <br />
              <p><b>Note:</b> This OTP is checked by society guard for allowing</p>
      `,
  });

  return info;
}

// this mail to visitor denied/canceled book appointment
async function denyMailToVisitor(recieverEmail: string) {
  const transporter = await createTransporter();
  if (!transporter) {
    console.log("Cannot send email, transporter not available.");
    return;
  }

  const info = await transporter.sendMail({
    from: `"EntryBuddy Developer 👻" <testmodedevelopment111@gmail.com>`, // sender address
    to: `${recieverEmail}`, // list of receivers
    subject: "Appointment Deny", // Subject line
    text: "Your appointment book is denied", // plain text body
    html: `<h3>Your appointment has beed denied</h3>
      `,
  });

  return info;
}

export default {
  sendSelfId,
  confirmMailToVisitor,
  denyMailToVisitor,
};
