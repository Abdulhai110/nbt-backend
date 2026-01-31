const path = require("path");
const transporter = require("../config/mail");

exports.sendContactMail = async (req, res) => {
  const { firstName, lastName, email, phone, message, contactMethod } =
    req.body;

  if (!firstName || !lastName || !email || !message || !contactMethod) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  if (contactMethod === "email") {
  try {
    await transporter.sendMail({
      from: `"NBT Contact" <${process.env.MAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      replyTo: email,
      subject: "📩 New Contact Form Submission",
      attachments: [
        {
          filename: "nbt-logo.png",
          path: path.join(__dirname, "../assets/img/nbt-logo.png"),
          cid: "nbtlogo", // 👈 same id used in img src
        },
      ],
      html: `
        <div style="background:#f4f6f8;padding:20px;font-family:Arial,Helvetica,sans-serif">
          <div style="max-width:600px;margin:auto;background:#ffffff;border-radius:8px;overflow:hidden">

            <!-- HEADER -->
            <div style="background:#4CAF50;padding:20px;text-align:center">
              <img 
                src="cid:nbtlogo" 
                alt="NBT Logo" 
                style="max-width:140px;margin-bottom:10px"
              />
              <h2 style="color:#ffffff;margin:0;font-weight:500">
                New Contact Request
              </h2>
            </div>

            <!-- BODY -->
            <div style="padding:24px;color:#333333">
              <p style="margin-top:0">
                You have received a new message from your website contact form.
              </p>

              <table style="width:100%;border-collapse:collapse">
                <tr>
                  <td style="padding:8px 0;font-weight:bold;width:120px">
                    Name:
                  </td>
                  <td style="padding:8px 0">
                    ${firstName} ${lastName}
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 0;font-weight:bold">
                    Email:
                  </td>
                  <td style="padding:8px 0">
                    ${email}
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 0;font-weight:bold">
                    Phone:
                  </td>
                  <td style="padding:8px 0">
                    ${phone || "N/A"}
                  </td>
                </tr>
              </table>

              <div style="margin-top:20px">
                <p style="font-weight:bold;margin-bottom:8px">
                  Message:
                </p>
                <div style="
                  background:#f1f8f4;
                  border-left:4px solid #4CAF50;
                  padding:15px;
                  border-radius:6px;
                  white-space:pre-line
                ">
                  ${message}
                </div>
              </div>
            </div>

            <!-- FOOTER -->
            <div style="
              background:#f1f1f1;
              padding:12px;
              text-align:center;
              font-size:12px;
              color:#777
            ">
              © ${new Date().getFullYear()} NBT. All rights reserved.
            </div>

          </div>
        </div>
      `,
    });

    res.status(200).json({ success: true, message: "Email sent" });
  } catch (error) {
    console.error("Mail Error:", error);
    res.status(500).json({ success: false, message: "Mail failed" });
  }
}
};
