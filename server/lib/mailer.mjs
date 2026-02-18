export const sendOtpEmail = async ({ toEmail, doctorName, otp }) => {
  const resendApiKey = process.env.RESEND_API_KEY
  const fromEmail = process.env.RESEND_FROM_EMAIL
  const isProduction = process.env.NODE_ENV === 'production'

  if (!resendApiKey || !fromEmail) {
    if (isProduction) {
      throw new Error('OTP email service is not configured. Set RESEND_API_KEY and RESEND_FROM_EMAIL.')
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
    const raw = await response.text()
    let detail = raw
    try {
      const parsed = JSON.parse(raw)
      detail = parsed?.message || parsed?.error?.message || raw
    } catch {
      detail = raw
    }

    throw new Error(`Email send failed: ${detail}`)
  }

  return { delivered: true, simulated: false }
}
