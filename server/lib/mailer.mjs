const MAX_RETRIES = 3

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const parseErrorDetail = async (response) => {
  const raw = await response.text()
  try {
    const parsed = raw ? JSON.parse(raw) : {}
    return (
      parsed?.message ||
      parsed?.error?.message ||
      parsed?.error ||
      parsed?.code ||
      raw ||
      `HTTP ${response.status}`
    )
  } catch {
    return raw || `HTTP ${response.status}`
  }
}

const retryableRequest = async (requestFn) => {
  let lastError = null
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt += 1) {
    try {
      return await requestFn()
    } catch (error) {
      lastError = error
      if (attempt < MAX_RETRIES) {
        await delay(250 * 2 ** (attempt - 1))
      }
    }
  }
  throw lastError || new Error('Email request failed.')
}

const getOtpHtml = (doctorName, otp) =>
  `<p>Hello ${doctorName},</p><p>Your OTP is <strong>${otp}</strong>. It is valid for 2 minutes.</p>`

const sendViaResend = async ({ toEmail, doctorName, otp }) => {
  const resendApiKey = String(process.env.RESEND_API_KEY || '').trim()
  const fromEmail = String(process.env.RESEND_FROM_EMAIL || '').trim()
  if (!resendApiKey || !fromEmail) {
    return false
  }

  await retryableRequest(async () => {
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
        html: getOtpHtml(doctorName, otp),
      }),
    })

    if (!response.ok) {
      const detail = await parseErrorDetail(response)
      throw new Error(`Resend: ${detail}`)
    }
  })

  return true
}

const sendViaBrevo = async ({ toEmail, doctorName, otp }) => {
  const brevoApiKey = String(process.env.BREVO_API_KEY || '').trim()
  const fromEmail = String(process.env.BREVO_FROM_EMAIL || '').trim()
  const fromName = String(process.env.BREVO_FROM_NAME || 'Maharashtra Medical Council').trim()
  if (!brevoApiKey || !fromEmail) {
    return false
  }

  await retryableRequest(async () => {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': brevoApiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sender: { email: fromEmail, name: fromName },
        to: [{ email: toEmail, name: doctorName }],
        subject: 'MMC RMP Login OTP',
        htmlContent: getOtpHtml(doctorName, otp),
      }),
    })

    if (!response.ok) {
      const detail = await parseErrorDetail(response)
      throw new Error(`Brevo: ${detail}`)
    }
  })

  return true
}

export const sendOtpEmail = async ({ toEmail, doctorName, otp }) => {
  const isProduction = process.env.NODE_ENV === 'production'

  try {
    const resendSent = await sendViaResend({ toEmail, doctorName, otp })
    if (resendSent) {
      return { delivered: true, simulated: false, provider: 'resend' }
    }
  } catch (error) {
    console.error(`OTP send via Resend failed: ${error.message}`)
  }

  try {
    const brevoSent = await sendViaBrevo({ toEmail, doctorName, otp })
    if (brevoSent) {
      return { delivered: true, simulated: false, provider: 'brevo' }
    }
  } catch (error) {
    console.error(`OTP send via Brevo failed: ${error.message}`)
  }

  if (isProduction) {
    throw new Error(
      'OTP email service is not configured. Set RESEND_API_KEY + RESEND_FROM_EMAIL or BREVO_API_KEY + BREVO_FROM_EMAIL.',
    )
  }

  console.info(`Simulated OTP for ${doctorName} (${toEmail}): ${otp}`)
  return { delivered: false, simulated: true, provider: 'simulated' }
}
