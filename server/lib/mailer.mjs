export const sendOtpEmail = async ({ toEmail, doctorName, otp }) => {
  const resendApiKey = process.env.RESEND_API_KEY
  const fromEmail = process.env.RESEND_FROM_EMAIL
  const isProduction = process.env.NODE_ENV === 'production'

  if (!resendApiKey || !fromEmail) {
    if (isProduction) {
      throw new Error('Email provider is not configured for production.')
    }
    console.info(`Simulated OTP for ${doctorName} (${toEmail}): ${otp}`)
    return { delivered: false, simulated: true }
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [toEmail],
      subject: 'MMC RMP Login OTP',
      html: `<p>Hello ${doctorName},</p><p>Your OTP is <strong>${otp}</strong>. It is valid for 2 minutes.</p>`,
    }),
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Email send failed: ${text}`)
  }

  return { delivered: true, simulated: false }
}
