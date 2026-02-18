import RVM from '/src/assets/images/photos/RVM.png'
import RCBW from '/src/assets/images/photos/RCBW.png'

const AboutUs = () => {
  return (
    <main className="bg-[#F8F7F4] px-4 pb-10 pt-5 sm:px-6 sm:pt-7 lg:px-10">
      <div className="mx-auto max-w-[1300px] rounded-lg bg-white p-5 sm:p-7 lg:p-10">
        <div className="flex flex-col gap-4 sm:gap-5">
          <h1 className="text-xl font-bold text-[#2E2A21] lg:text-2xl">About Us</h1>
          <p className="text-sm leading-relaxed text-[#2E2A21] sm:text-base">
            The Maharashtra Medical Council is the oldest statutory body in the state and the successor to the former Bombay Medical Council, which was established in September 1912 and remained in existence until the bifurcation of the old Bombay State. The first meeting of the Bombay Medical Council was held on 24th September 1912 under the presidency of Mr. H. W. Stevenson. In his inaugural address, Mr. Stevenson emphasized the vital distinction between liberty and license. He further stated that the registration of a medical practitioner signifies the approval of the Government of the country and is accepted as a mark of professional integrity, responsibility, and ethical conduct.
          </p>
          <p className="text-sm leading-relaxed text-[#2E2A21] sm:text-base">
            In 1917, the Government of Bombay amended the Bombay Medical Council Act, 1912, introducing provisions for a reciprocal registration system between the two Councils, thereby facilitating professional recognition across jurisdictions. On the recommendation of the Bombay Medical Council, a Code of Medical Ethics was proposed to guide medical practitioners in their professional conduct. This Code was founded on three core principles, which continue to serve as the cornerstone of medical ethics: a medical practitioner must show due respect towards colleagues, patients, and the country.
          </p>
          <p className="text-sm leading-relaxed text-[#2E2A21] sm:text-base">
            Further strengthening professional practice, the Bombay Municipal Corporation, in its meeting held on 27th October 1929, unanimously passed a resolution stating that private dispensaries which dispense medicines after examining patients, and where there is no sale of medical drugs, should be exempted from payment under the Shop Act. This decision acknowledged the unique role of medical establishments and aimed to support ethical medical practice without unnecessary administrative burden.
          </p>
          <p className="text-sm leading-relaxed text-[#2E2A21] sm:text-base">
            By the year 1913, Total number of registered members of the Bombay Medical Council stood at 1,137, reflecting the growing recognition of the Council’s authority and the expanding medical profession during that period.
          </p>

          <div className="my-2 flex w-full flex-col items-center border-b border-[#D1B25E] bg-[#F3ECD8] p-2">
            <h2 className="text-base font-bold uppercase text-[#2E2A21] sm:text-lg">Office Bearers</h2>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="flex flex-col items-center border border-[#E6E2D8] p-5">
              <div className="flex w-full flex-col items-center border-b border-[#D1B25E] bg-[#F3ECD8] p-2">
                <h2 className="text-sm font-semibold uppercase text-[#2E2A21] sm:text-base">Administrator</h2>
              </div>
              <div className="pt-5">
                <img src={RVM} alt="RVM" className="h-auto w-44 object-contain sm:w-52 lg:w-60" />
              </div>
              <h3 className="pt-4 text-center text-sm font-semibold text-[#2E2A21] sm:text-base">
                Dr. Rughwani Vinki Mohanlal
              </h3>
              <p className="text-sm text-[#2E2A21] sm:text-base">Administrator</p>
            </div>

            <div className="flex flex-col items-center border border-[#E6E2D8] p-5">
              <div className="flex w-full flex-col items-center border-b border-[#D1B25E] bg-[#F3ECD8] p-2">
                <h2 className="text-sm font-semibold uppercase text-[#2E2A21] sm:text-base">Registrar</h2>
              </div>
              <div className="pt-5">
                <img src={RCBW} alt="RCBW" className="h-auto w-44 object-contain sm:w-52 lg:w-60" />
              </div>
              <h3 className="pt-4 text-center text-sm font-semibold text-[#2E2A21] sm:text-base">
                Dr. Rakesh Chhaya Balaji Waghmare
              </h3>
              <p className="text-sm text-[#2E2A21] sm:text-base">Registrar</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default AboutUs
