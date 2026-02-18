import { Mail, MessageSquareText } from 'lucide-react'

const feedbackEmail = 'mmcfeedback17@gmail.com'

const Feedback = () => {
  return (
    <main className="bg-[#F8F7F4] px-4 pb-10 pt-5 sm:px-6 sm:pt-7 lg:px-10">
      <div className="mx-auto max-w-[1000px] rounded-lg bg-white p-5 sm:p-7 lg:p-10">
        <div className="flex flex-col gap-6">
          <section className="rounded-md border border-[#E6E2D8] bg-[#F3ECD8] px-4 py-4 sm:px-5">
            <div className="flex items-center gap-2">
              <MessageSquareText size={20} className="text-[#6F5312]" />
              <h1 className="text-xl font-bold text-[#2E2A21] lg:text-2xl">Feedback / Suggestion</h1>
            </div>
            <p className="pt-2 text-sm text-[#5C5543] sm:text-base">
              Please send your suggestion or feedback on the email below and we will get back to you at the earliest.
            </p>
          </section>

          <section className="rounded-lg border border-[#E6E2D8] bg-[#FCFAF4] p-5 sm:p-6">
            <p className="text-sm font-semibold text-[#6D6450] sm:text-base">Official Feedback Email</p>
            <a
              href={`mailto:${feedbackEmail}`}
              className="mt-2 inline-flex items-center gap-2 break-all text-base font-semibold text-[#886718] transition-colors hover:text-[#6F5312] sm:text-lg"
            >
              <Mail size={18} />
              {feedbackEmail}
            </a>

            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href={`mailto:${feedbackEmail}?subject=MMC%20Website%20Feedback`}
                className="rounded-md bg-[#886718] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#6F5312] sm:text-base"
              >
                Send Feedback Email
              </a>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}

export default Feedback
