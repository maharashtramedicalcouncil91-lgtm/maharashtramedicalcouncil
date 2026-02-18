import { useState } from 'react'
import { AlertCircle, CheckCircle2, FileText } from 'lucide-react'

const initialForm = {
  complainantName: '',
  email: '',
  mobile: '',
  registrationId: '',
  subject: '',
  complaintDetails: '',
  acceptedDeclaration: false,
}

const Complaint = () => {
  const [form, setForm] = useState(initialForm)
  const [status, setStatus] = useState({ type: '', message: '' })

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!form.complainantName.trim() || !form.email.trim() || !form.mobile.trim() || !form.subject.trim() || !form.complaintDetails.trim()) {
      setStatus({ type: 'error', message: 'Please fill all required fields before submitting.' })
      return
    }

    if (!form.acceptedDeclaration) {
      setStatus({ type: 'error', message: 'Please accept the declaration to continue.' })
      return
    }

    setStatus({ type: 'success', message: 'Complaint submitted successfully.' })
    setForm(initialForm)
  }

  return (
    <main className="bg-[#F8F7F4] px-4 pb-10 pt-5 sm:px-6 sm:pt-7 lg:px-10">
      <div className="mx-auto max-w-[1100px] rounded-lg bg-white p-5 sm:p-7 lg:p-10">
        <div className="flex flex-col gap-6">
          <section className="rounded-md border border-[#E6E2D8] bg-[#F3ECD8] px-4 py-4">
            <h1 className="text-xl font-bold text-[#2E2A21] lg:text-2xl">Complaint Portal</h1>
            <p className="pt-2 text-sm text-[#5C5543] sm:text-base">
              Submit your grievance with complete details for review by the concerned MMC authority.
            </p>
          </section>

          <section className="rounded-lg border border-[#E6E2D8] bg-[#FCFAF4] p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-[#2E2A21]">Requirements Before Submission</h2>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[#5C5543] sm:text-base">
                  <li>Complainant name, email, and mobile number are mandatory.</li>
                  <li>Provide clear subject and full complaint details with dates/facts.</li>
                  <li>Do not submit duplicate complaints for the same issue.</li>
                </ul>
              </div>
              <a
                href="https://www.maharashtramedicalcouncil.in/Complaint/SOP%20for%20complaint.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md border border-[#886718] bg-white px-4 py-2 text-sm font-semibold text-[#886718] transition-colors hover:bg-[#F3ECD8]"
              >
                <FileText size={16} />
                SOP for Complaint
              </a>
            </div>
          </section>

          <form onSubmit={handleSubmit} className="rounded-lg border border-[#E6E2D8] bg-[#FCFAF4] p-5 sm:p-6">
            <h2 className="text-lg font-semibold text-[#2E2A21]">Complaint Form</h2>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input
                type="text"
                value={form.complainantName}
                onChange={(event) => handleChange('complainantName', event.target.value)}
                placeholder="Complainant Name *"
                className="rounded-md border border-[#D8D0BF] px-3 py-2.5 text-sm outline-none focus:border-[#886718] sm:text-base"
              />
              <input
                type="email"
                value={form.email}
                onChange={(event) => handleChange('email', event.target.value)}
                placeholder="Email Address *"
                className="rounded-md border border-[#D8D0BF] px-3 py-2.5 text-sm outline-none focus:border-[#886718] sm:text-base"
              />
              <input
                type="tel"
                value={form.mobile}
                onChange={(event) => handleChange('mobile', event.target.value)}
                placeholder="Mobile Number *"
                className="rounded-md border border-[#D8D0BF] px-3 py-2.5 text-sm outline-none focus:border-[#886718] sm:text-base"
              />
              <input
                type="text"
                value={form.registrationId}
                onChange={(event) => handleChange('registrationId', event.target.value)}
                placeholder="Registration ID (if applicable)"
                className="rounded-md border border-[#D8D0BF] px-3 py-2.5 text-sm outline-none focus:border-[#886718] sm:text-base"
              />
              <input
                type="text"
                value={form.subject}
                onChange={(event) => handleChange('subject', event.target.value)}
                placeholder="Complaint Subject *"
                className="rounded-md border border-[#D8D0BF] px-3 py-2.5 text-sm outline-none focus:border-[#886718] sm:col-span-2 sm:text-base"
              />
              <textarea
                value={form.complaintDetails}
                onChange={(event) => handleChange('complaintDetails', event.target.value)}
                placeholder="Complaint Details *"
                rows={6}
                className="rounded-md border border-[#D8D0BF] px-3 py-2.5 text-sm outline-none focus:border-[#886718] sm:col-span-2 sm:text-base"
              />
            </div>

            <label className="mt-4 inline-flex items-start gap-2 text-sm text-[#2E2A21] sm:text-base">
              <input
                type="checkbox"
                checked={form.acceptedDeclaration}
                onChange={(event) => handleChange('acceptedDeclaration', event.target.checked)}
                className="mt-1 h-4 w-4 accent-[#886718]"
              />
              I declare that the information provided is true to the best of my knowledge.
            </label>

            <div className="mt-5">
              <button
                type="submit"
                className="rounded-md bg-[#886718] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#6F5312] sm:text-base"
              >
                Submit Complaint
              </button>
            </div>
          </form>

          {status.message && (
            <div
              className={`inline-flex items-center gap-2 rounded-md border px-4 py-3 text-sm font-medium sm:text-base ${
                status.type === 'success'
                  ? 'border-[#3D7A4B] bg-[#ECF8EF] text-[#2D5C38]'
                  : 'border-[#A94D4D] bg-[#FFF3F3] text-[#7A2C2C]'
              }`}
            >
              {status.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              {status.message}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

export default Complaint
