import nodemailer from "nodemailer";

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const MAIL_FROM = process.env.MAIL_FROM || "no-reply@example.com";

const resetpasswordURL =
  process.env.FRONTEND_URL ??
  "http://localhost:3000/auth/reset-password?referenceCode=";

if (!SMTP_HOST) {
  throw new Error("SMTP_HOST is not defined");
}

if (!SMTP_USER) {
  throw new Error("SMTP_USER is not defined");
}

if (!SMTP_PASS) {
  throw new Error("SMTP_PASS is not defined");
}

export const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

export async function verifySMTP() {
  await transporter.verify();
  console.log("✅ SMTP connected");
}

export async function sendEmailResetPassword(
  toEmail: string,
  referenceCode: string,
): Promise<void> {
  await transporter.sendMail({
    from: MAIL_FROM,
    to: toEmail,
    subject: "รีเซ็ตรหัสผ่านของคุณ",
    html: `
    <!DOCTYPE html>
    <html lang="th">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>รีเซ็ตรหัสผ่าน</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f2f2f2; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f2f2f2; padding: 40px 0;">
        <tr>
          <td align="center">
            <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(7, 2, 32, 0.08);">
              
              <!-- Header -->
              <tr>
                <td style="background-color: #070220; padding: 32px 40px; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 600;">
                    รีเซ็ตรหัสผ่าน
                  </h1>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding: 40px;">
                  <p style="margin: 0 0 16px 0; color: #171717; font-size: 16px; line-height: 1.6;">
                    เรียนผู้ใช้งาน
                  </p>
                  <p style="margin: 0 0 24px 0; color: #4d4d4d; font-size: 15px; line-height: 1.6;">
                    เราได้รับคำขอให้รีเซ็ตรหัสผ่านสำหรับบัญชีของคุณ
                    กรุณากดปุ่มด้านล่างเพื่อตั้งรหัสผ่านใหม่
                  </p>

                  <!-- Button (table-based for email client compatibility) -->
                  <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 0 auto 28px auto;">
                    <tr>
                      <td align="center" style="border-radius: 8px; background-color: #340fed;">
                        <a href="${resetpasswordURL}${referenceCode}"
                           style="display: inline-block; padding: 14px 36px; color: #ffffff; font-size: 15px; font-weight: 600; text-decoration: none; border-radius: 8px;">
                          ตั้งรหัสผ่านใหม่
                        </a>
                      </td>
                    </tr>
                  </table>

                  <p style="margin: 0 0 8px 0; color: #999999; font-size: 13px; line-height: 1.6;">
                    หากปุ่มด้านบนไม่ทำงาน กรุณาคัดลอกลิงก์ด้านล่างไปวางในเบราว์เซอร์ของคุณ:
                  </p>
                  <p style="margin: 0 0 24px 0; word-break: break-all;">
                    <a href="${resetpasswordURL}${referenceCode}" style="color: #340fed; font-size: 13px;">
                      ${resetpasswordURL}${referenceCode}
                    </a>
                  </p>

                  <hr style="border: none; border-top: 1px solid #e8e6f3; margin: 24px 0;" />

                  <p style="margin: 0; color: #999999; font-size: 13px; line-height: 1.6;">
                    หากคุณไม่ได้เป็นผู้ทำคำขอนี้ กรุณาเพิกเฉยต่ออีเมลฉบับนี้
                    รหัสผ่านของคุณจะไม่มีการเปลี่ยนแปลงใดๆ
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #f2f2f2; padding: 20px 40px; text-align: center;">
                  <p style="margin: 0; color: #999999; font-size: 12px;">
                    อีเมลนี้ถูกส่งโดยระบบอัตโนมัติ กรุณาอย่าตอบกลับ
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
    `,
  });
}