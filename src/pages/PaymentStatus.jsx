import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const STORAGE_KEY = 'mmc_payment_receipt_latest'

const normalize = (value) => String(value || '').trim().toLowerCase()

const PaymentStatus = () => {
  const location = useLocation()
  const [receipt, setReceipt] = useState(null)

  const query = useMemo(() => new URLSearchParams(location.search), [location.search])

  useEffect(() => {
    const statusRaw = query.get('status') || query.get('txnStatus') || query.get('payment_status') || ''
    const txnId = query.get('txnId') || query.get('transaction_id') || query.get('ref') || 'N/A'
    const receiptNo = query.get('receiptNo') || query.get('receipt_no') || ''
    const normalizedStatus = normalize(statusRaw)

    let nextStatus = 'Pending Confirmation'
    if (['success', 'paid', 'captured', 'ok'].includes(normalizedStatus)) {
      nextStatus = 'Paid'
    } else if (['failed', 'failure', 'cancelled', 'canceled', 'error'].includes(normalizedStatus)) {
      nextStatus = 'Failed'
    }

    try {
      const raw = sessionStorage.getItem(STORAGE_KEY)
      if (!raw) {
        return
      }

      const saved = JSON.parse(raw)
      if (receiptNo && saved.receiptNo && saved.receiptNo !== receiptNo) {
        return
      }

      const updated = {
        ...saved,
        status: nextStatus,
        gatewayTxnId: txnId,
        lastUpdated: new Date().toLocaleString('en-IN'),
      }

      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      setReceipt(updated)
    } catch {
      setReceipt(null)
    }
  }, [query])

  return (
    <main className="bg-[#F8F7F4] px-4 pb-10 pt-5 sm:px-6 sm:pt-7 lg:px-10">
      <div className="mx-auto max-w-[900px] rounded-lg bg-white p-5 sm:p-7 lg:p-10">
        <div className="flex flex-col gap-4">
          <h1 className="text-xl font-bold text-[#2E2A21] lg:text-2xl">Payment Status</h1>
          <p className="text-sm text-[#5C5543] sm:text-base">
            Gateway callback received. Receipt status has been synchronized for this session.
          </p>

          {receipt ? (
            <div className="rounded-md border border-[#D8D0BF] bg-[#FCFAF4] p-4 text-sm text-[#2E2A21] sm:text-base">
              <p><strong>Receipt No:</strong> {receipt.receiptNo}</p>
              <p><strong>Status:</strong> {receipt.status}</p>
              <p><strong>Gateway Transaction ID:</strong> {receipt.gatewayTxnId || 'N/A'}</p>
              <p><strong>Last Updated:</strong> {receipt.lastUpdated || 'N/A'}</p>
            </div>
          ) : (
            <div className="rounded-md border border-[#D8D0BF] bg-[#FCFAF4] p-4 text-sm text-[#5C5543] sm:text-base">
              No matching receipt found in this browser session.
            </div>
          )}

          <div>
            <Link
              to="/online-payment"
              className="inline-flex rounded-md bg-[#886718] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#6F5312] sm:text-base"
            >
              Back to Online Payment
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}

export default PaymentStatus
