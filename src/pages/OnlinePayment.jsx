import { useMemo, useState } from 'react'
import { CreditCard, Printer, ShieldCheck, IndianRupee, QrCode, Smartphone } from 'lucide-react'
import { useSiteContent } from '../context/siteContentStore'
import { confirmRenewalPayment } from '../services/apiClient'

const RECEIPT_STORAGE_KEY = 'mmc_payment_receipt_latest'
const DOCTOR_SESSION_KEY = 'mmc_verified_doctor'
const DEFAULT_UPI_PAYEE_NAME = 'Maharashtra Medical Council'
const DEFAULT_UPI_ID = 'mmconline@oksbi'

const feeOptions = [
  { key: 'registration', label: 'Registration Fee', amount: 1500 },
  { key: 'renewal', label: 'Renewal Fee', amount: 2000 },
  { key: 'additional', label: 'Additional Qualification Fee', amount: 2500 },
  { key: 'verification', label: 'Verification Fee', amount: 1000 },
]

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(value)

const isValidUpiId = (value) => /^[a-zA-Z0-9.\-_]{2,}@[a-zA-Z]{2,}$/i.test(value.trim())

const buildUpiUri = ({ amount, txnNote, txnRef, upiId, payeeName }) => {
  const params = new URLSearchParams({
    pa: upiId,
    pn: payeeName,
    am: String(amount),
    cu: 'INR',
    tn: txnNote,
    tr: txnRef,
  })

  return `upi://pay?${params.toString()}`
}

const buildCustomUpiAppUri = (scheme, { amount, txnNote, txnRef, upiId, payeeName }) => {
  const params = new URLSearchParams({
    pa: upiId,
    pn: payeeName,
    am: String(amount),
    cu: 'INR',
    tn: txnNote,
    tr: txnRef,
  })

  return `${scheme}?${params.toString()}`
}

const persistReceipt = (nextReceipt, setReceipt) => {
  setReceipt(nextReceipt)
  sessionStorage.setItem(RECEIPT_STORAGE_KEY, JSON.stringify(nextReceipt))
}

const OnlinePayment = () => {
  const { siteContent } = useSiteContent()
  const [registrationId, setRegistrationId] = useState('')
  const [email, setEmail] = useState('')
  const [selectedFee, setSelectedFee] = useState(feeOptions[0].key)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [status, setStatus] = useState({ type: '', message: '' })
  const [receipt, setReceipt] = useState(() => {
    try {
      const saved = sessionStorage.getItem(RECEIPT_STORAGE_KEY)
      if (!saved) {
        return null
      }
      return JSON.parse(saved)
    } catch {
      return null
    }
  })
  const [utrNo, setUtrNo] = useState('')
  const configuredUpiId = (siteContent.paymentSettings?.upiId || DEFAULT_UPI_ID).trim()
  const configuredPayeeName = (siteContent.paymentSettings?.payeeName || DEFAULT_UPI_PAYEE_NAME).trim()
  const hasValidPaymentConfig = isValidUpiId(configuredUpiId) && Boolean(configuredPayeeName)

  const fee = useMemo(() => feeOptions.find((item) => item.key === selectedFee) || feeOptions[0], [selectedFee])

  const canProceed = acceptedTerms && registrationId.trim() && email.trim()

  const upiUri = useMemo(() => {
    if (!receipt) {
      return ''
    }

    return buildUpiUri({
      amount: receipt.amount,
      txnNote: `MMC ${receipt.feeType}`,
      txnRef: receipt.receiptNo,
      upiId: configuredUpiId,
      payeeName: configuredPayeeName,
    })
  }, [configuredPayeeName, configuredUpiId, receipt])

  const upiQrUrl = useMemo(() => {
    if (!upiUri) {
      return ''
    }

    return `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(upiUri)}`
  }, [upiUri])

  const gpayUri = useMemo(() => {
    if (!receipt) {
      return ''
    }
    return buildCustomUpiAppUri('gpay://upi/pay', {
      amount: receipt.amount,
      txnNote: `MMC ${receipt.feeType}`,
      txnRef: receipt.receiptNo,
      upiId: configuredUpiId,
      payeeName: configuredPayeeName,
    })
  }, [configuredPayeeName, configuredUpiId, receipt])

  const phonePeUri = useMemo(() => {
    if (!receipt) {
      return ''
    }
    return buildCustomUpiAppUri('phonepe://pay', {
      amount: receipt.amount,
      txnNote: `MMC ${receipt.feeType}`,
      txnRef: receipt.receiptNo,
      upiId: configuredUpiId,
      payeeName: configuredPayeeName,
    })
  }, [configuredPayeeName, configuredUpiId, receipt])

  const handlePayNow = () => {
    if (!canProceed) {
      setStatus({ type: 'error', message: 'Please complete details and accept terms before proceeding.' })
      return
    }
    if (!hasValidPaymentConfig) {
      setStatus({ type: 'error', message: 'Payment is temporarily unavailable. UPI settings are not configured by admin.' })
      return
    }

    const receiptData = {
      receiptNo: `MMC-${Date.now().toString().slice(-8)}`,
      date: new Date().toLocaleString('en-IN'),
      registrationId: registrationId.trim(),
      email: email.trim(),
      feeType: fee.label,
      amount: fee.amount,
      status: 'Awaiting Payment',
      mode: 'UPI',
      utrNo: '',
      lastUpdated: new Date().toLocaleString('en-IN'),
    }

    persistReceipt(receiptData, setReceipt)
    setStatus({
      type: 'success',
      message: 'Payment request created. Use UPI app or scan QR to pay, then enter UTR to confirm.',
    })
  }

  const handleConfirmPayment = async () => {
    if (!receipt) {
      setStatus({ type: 'error', message: 'Generate payment request first.' })
      return
    }

    const cleanedUtr = utrNo.trim()
    if (cleanedUtr.length < 8) {
      setStatus({ type: 'error', message: 'Please enter a valid UTR/transaction reference number.' })
      return
    }

    const updated = {
      ...receipt,
      status: 'Paid (User Confirmed)',
      utrNo: cleanedUtr,
      lastUpdated: new Date().toLocaleString('en-IN'),
    }

    persistReceipt(updated, setReceipt)
    if (String(updated.feeType || '').toLowerCase().includes('renewal')) {
      try {
        const renewalResult = await confirmRenewalPayment({
          registrationId: updated.registrationId,
          email: updated.email,
          feeType: updated.feeType,
          utrNo: cleanedUtr,
        })

        try {
          const rawDoctor = sessionStorage.getItem(DOCTOR_SESSION_KEY)
          if (rawDoctor) {
            const currentDoctor = JSON.parse(rawDoctor)
            const sameDoctor =
              String(currentDoctor.registrationId || '').trim() === String(updated.registrationId || '').trim() &&
              String(currentDoctor.email || '').trim().toLowerCase() === String(updated.email || '').trim().toLowerCase()

            if (sameDoctor && renewalResult?.doctor) {
              sessionStorage.setItem(DOCTOR_SESSION_KEY, JSON.stringify(renewalResult.doctor))
            }
          }
        } catch {
          // Ignore session update failure without blocking payment confirmation UX.
        }

        setStatus({
          type: 'success',
          message: `Payment marked as completed. Renewal applied successfully. Valid upto: ${renewalResult?.doctor?.validUpto || 'updated'}.`,
        })
        return
      } catch (error) {
        setStatus({
          type: 'error',
          message: `Payment marked as completed, but renewal update failed: ${error.message}`,
        })
        return
      }
    }

    setStatus({ type: 'success', message: 'Payment marked as completed. Receipt updated.' })
  }

  const handlePayViaUpiApp = () => {
    if (!upiUri) {
      setStatus({ type: 'error', message: 'Create payment request first.' })
      return
    }

    const next = {
      ...receipt,
      mode: 'Any UPI App',
      status: receipt.status === 'Awaiting Payment' ? 'Payment Initiated' : receipt.status,
      lastUpdated: new Date().toLocaleString('en-IN'),
    }
    persistReceipt(next, setReceipt)
    window.location.href = upiUri
  }

  const handlePayViaGpay = () => {
    if (!gpayUri) {
      setStatus({ type: 'error', message: 'Create payment request first.' })
      return
    }
    const next = {
      ...receipt,
      mode: 'Google Pay',
      status: receipt.status === 'Awaiting Payment' ? 'Payment Initiated' : receipt.status,
      lastUpdated: new Date().toLocaleString('en-IN'),
    }
    persistReceipt(next, setReceipt)
    window.location.href = gpayUri
  }

  const handlePayViaPhonePe = () => {
    if (!phonePeUri) {
      setStatus({ type: 'error', message: 'Create payment request first.' })
      return
    }
    const next = {
      ...receipt,
      mode: 'PhonePe',
      status: receipt.status === 'Awaiting Payment' ? 'Payment Initiated' : receipt.status,
      lastUpdated: new Date().toLocaleString('en-IN'),
    }
    persistReceipt(next, setReceipt)
    window.location.href = phonePeUri
  }

  const handlePrintReceipt = () => {
    if (!receipt) {
      setStatus({ type: 'error', message: 'No receipt generated yet. Click Create Payment first.' })
      return
    }

    window.print()
  }

  return (
    <main className="bg-[#F8F7F4] px-4 pb-10 pt-5 sm:px-6 sm:pt-7 lg:px-10">
      <style>{`
        @media print {
          .no-print { display: none !important; }
          #receipt-print { display: block !important; }
          body * { visibility: hidden; }
          #receipt-print, #receipt-print * { visibility: visible; }
          #receipt-print {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 16px;
            background: #fff;
          }
        }
      `}</style>

      <div className="mx-auto max-w-[1100px] rounded-lg bg-white p-5 sm:p-7 lg:p-10 no-print">
        <div className="flex flex-col gap-6">
          <section className="rounded-md border border-[#E6E2D8] bg-[#F3ECD8] px-4 py-4">
            <h1 className="text-xl font-bold text-[#2E2A21] lg:text-2xl">MMC Online Payment</h1>
            <p className="pt-2 text-sm text-[#5C5543] sm:text-base">
              UPI-based payment interface with QR support and printable one-page receipt.
            </p>
          </section>

          <section className="rounded-lg border border-[#E6E2D8] bg-[#FCFAF4] p-5 sm:p-6">
            <h2 className="text-lg font-semibold text-[#2E2A21]">Terms and Conditions for Refund</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[#3F3F3F] sm:text-base">
              <li>The request for refund, if found eligible, will be entertained only offline.</li>
              <li>The transaction once done cannot be cancelled online.</li>
              <li>Transaction above Rs. 2000 is accepted through Internet Banking, Credit Card and mobile banking.</li>
              <li>Transaction up to Rs. 2000 is accepted through Debit Card, Internet Banking, Credit Card and mobile banking.</li>
              <li>Please do not make payment through BHIM UPI.</li>
            </ul>
          </section>

          <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <article className="rounded-lg border border-[#E6E2D8] bg-[#FCFAF4] p-5 sm:p-6">
              <h3 className="text-lg font-semibold text-[#2E2A21]">Payment Details</h3>
              {!hasValidPaymentConfig && (
                <div className="mt-3 rounded-md border border-[#A94D4D] bg-[#FFF3F3] px-3 py-2 text-xs text-[#7A2C2C] sm:text-sm">
                  Payment is temporarily unavailable. Admin must configure UPI ID in dashboard.
                </div>
              )}
              <div className="mt-4 grid gap-3">
                <input
                  type="text"
                  value={registrationId}
                  onChange={(event) => setRegistrationId(event.target.value)}
                  placeholder="Registration ID"
                  className="rounded-md border border-[#D8D0BF] px-3 py-2.5 text-sm outline-none focus:border-[#886718] sm:text-base"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Registered Email"
                  className="rounded-md border border-[#D8D0BF] px-3 py-2.5 text-sm outline-none focus:border-[#886718] sm:text-base"
                />
                <select
                  value={selectedFee}
                  onChange={(event) => setSelectedFee(event.target.value)}
                  className="rounded-md border border-[#D8D0BF] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#886718] sm:text-base"
                >
                  {feeOptions.map((option) => (
                    <option key={option.key} value={option.key}>
                      {option.label} - {formatCurrency(option.amount)}
                    </option>
                  ))}
                </select>

                <label className="mt-1 inline-flex items-start gap-2 text-sm text-[#2E2A21] sm:text-base">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(event) => setAcceptedTerms(event.target.checked)}
                    className="mt-1 h-4 w-4 accent-[#886718]"
                  />
                  I have read and accepted the terms and conditions stated above.
                </label>

                <div className="mt-2 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handlePayNow}
                    disabled={!canProceed || !hasValidPaymentConfig}
                    className="inline-flex items-center gap-2 rounded-md bg-[#886718] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#6F5312] disabled:cursor-not-allowed disabled:opacity-60 sm:text-base"
                  >
                    <CreditCard size={16} />
                    Create Payment
                  </button>
                  <button
                    type="button"
                    onClick={handlePrintReceipt}
                    className="inline-flex items-center gap-2 rounded-md border border-[#886718] bg-white px-5 py-2.5 text-sm font-semibold text-[#886718] transition-colors hover:bg-[#F3ECD8] sm:text-base"
                  >
                    <Printer size={16} />
                    Print Receipt
                  </button>
                </div>

                {receipt && (
                  <div className="mt-2 rounded-md border border-[#D8D0BF] bg-white p-3">
                    <p className="text-sm font-semibold text-[#2E2A21] sm:text-base">UPI Payment Options</p>
                    <p className="pt-1 text-xs text-[#6D6450] sm:text-sm">Payee: {configuredPayeeName} ({configuredUpiId})</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={handlePayViaUpiApp}
                        className="inline-flex items-center gap-2 rounded-md bg-[#2E2A21] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#1F1D17]"
                      >
                        <Smartphone size={15} />
                        Any UPI App
                      </button>
                      <button
                        type="button"
                        onClick={handlePayViaGpay}
                        className="inline-flex items-center gap-2 rounded-md border border-[#2E2A21] bg-white px-4 py-2 text-sm font-semibold text-[#2E2A21] transition-colors hover:bg-[#F4F1E8]"
                      >
                        Google Pay
                      </button>
                      <button
                        type="button"
                        onClick={handlePayViaPhonePe}
                        className="inline-flex items-center gap-2 rounded-md border border-[#2E2A21] bg-white px-4 py-2 text-sm font-semibold text-[#2E2A21] transition-colors hover:bg-[#F4F1E8]"
                      >
                        PhonePe
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </article>

            <article className="rounded-lg border border-[#E6E2D8] bg-white p-5 sm:p-6">
              <h3 className="text-lg font-semibold text-[#2E2A21]">UPI QR & Receipt</h3>
              {receipt ? (
                <div className="mt-4 space-y-4">
                  <div className="rounded-md border border-[#D8D0BF] bg-[#FCFAF4] p-4 text-sm text-[#2E2A21] sm:text-base">
                    <p><strong>Receipt No:</strong> {receipt.receiptNo}</p>
                    <p><strong>Date:</strong> {receipt.date}</p>
                    <p><strong>Registration ID:</strong> {receipt.registrationId}</p>
                    <p><strong>Email:</strong> {receipt.email}</p>
                    <p><strong>Fee Type:</strong> {receipt.feeType}</p>
                    <p className="inline-flex items-center gap-1"><strong>Amount:</strong> <IndianRupee size={14} /> {receipt.amount}</p>
                    <p><strong>Mode:</strong> {receipt.mode}</p>
                    <p><strong>Status:</strong> {receipt.status}</p>
                    {receipt.utrNo && <p><strong>UTR No:</strong> {receipt.utrNo}</p>}
                    <p><strong>Last Updated:</strong> {receipt.lastUpdated}</p>
                  </div>

                  <div className="rounded-md border border-[#D8D0BF] bg-[#FCFAF4] p-4">
                    <div className="inline-flex items-center gap-2 pb-3 text-sm font-semibold text-[#2E2A21] sm:text-base">
                      <QrCode size={16} /> Scan & Pay (UPI)
                    </div>
                    <div className="flex justify-center">
                      <img src={upiQrUrl} alt="UPI QR Code" className="h-[220px] w-[220px] rounded-md border border-[#E6E2D8]" />
                    </div>
                    <p className="pt-2 text-center text-xs text-[#6D6450] sm:text-sm">Payee UPI ID: {configuredUpiId}</p>
                  </div>

                  <div className="rounded-md border border-[#D8D0BF] bg-[#FCFAF4] p-4">
                    <p className="text-sm font-semibold text-[#2E2A21] sm:text-base">Already Paid? Confirm with UTR</p>
                    <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                      <input
                        type="text"
                        value={utrNo}
                        onChange={(event) => setUtrNo(event.target.value)}
                        placeholder="Enter UTR / Transaction Reference"
                        className="flex-1 rounded-md border border-[#D8D0BF] px-3 py-2.5 text-sm outline-none focus:border-[#886718]"
                      />
                      <button
                        type="button"
                        onClick={handleConfirmPayment}
                        className="rounded-md bg-[#886718] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#6F5312]"
                      >
                        Confirm Payment
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="mt-4 text-sm text-[#5C5543] sm:text-base">Create payment request to generate QR and receipt.</p>
              )}

              <div className="mt-4 rounded-md border border-[#D8D0BF] bg-[#F8F7F4] p-3 text-xs text-[#5C5543] sm:text-sm">
                <p className="inline-flex items-start gap-2">
                  <ShieldCheck size={16} className="mt-0.5 text-[#6F5312]" />
                  This interface provides a real UPI payment option. For final reconciliation, integrate server-side transaction verification.
                </p>
              </div>
            </article>
          </section>

          {status.message && (
            <div
              className={`rounded-md border px-4 py-3 text-sm font-medium sm:text-base ${
                status.type === 'success'
                  ? 'border-[#3D7A4B] bg-[#ECF8EF] text-[#2D5C38]'
                  : 'border-[#A94D4D] bg-[#FFF3F3] text-[#7A2C2C]'
              }`}
            >
              {status.message}
            </div>
          )}
        </div>
      </div>

      <section id="receipt-print" className="hidden">
        {receipt && (
          <div style={{ border: '1px solid #d1c8b5', padding: '18px', fontFamily: 'Arial, sans-serif', color: '#2e2a21' }}>
            <h1 style={{ margin: '0 0 8px 0', fontSize: '22px' }}>Maharashtra Medical Council</h1>
            <p style={{ margin: '0 0 14px 0', fontSize: '14px' }}>Payment Receipt</p>
            <hr style={{ border: 'none', borderTop: '1px solid #e0d7c6', margin: '0 0 14px 0' }} />
            <p><strong>Receipt No:</strong> {receipt.receiptNo}</p>
            <p><strong>Date:</strong> {receipt.date}</p>
            <p><strong>Registration ID:</strong> {receipt.registrationId}</p>
            <p><strong>Registered Email:</strong> {receipt.email}</p>
            <p><strong>Fee Type:</strong> {receipt.feeType}</p>
            <p><strong>Amount:</strong> {formatCurrency(receipt.amount)}</p>
            <p><strong>Mode:</strong> {receipt.mode}</p>
            <p><strong>Status:</strong> {receipt.status}</p>
            {receipt.utrNo && <p><strong>UTR No:</strong> {receipt.utrNo}</p>}
            <p><strong>Last Updated:</strong> {receipt.lastUpdated}</p>
            <hr style={{ border: 'none', borderTop: '1px solid #e0d7c6', margin: '14px 0' }} />
            <p style={{ fontSize: '12px', margin: 0 }}>
              Note: Keep this receipt for record and reference. Final settlement is subject to payment confirmation.
            </p>
          </div>
        )}
      </section>
    </main>
  )
}

export default OnlinePayment
