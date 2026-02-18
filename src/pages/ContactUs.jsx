import GoogleMap from '../components/GoogleMap.jsx'

const tableData = [
  { sno: 1, dept: 'Administration', desc: 'All matters related to Administration', mail: 'maharashtramcouncil@gmail.com' },
  {
    sno: 2,
    dept: 'Purchase, Establishment & Account Department',
    desc: 'All matters relating to Purchase, Establishment & Account',
    mail: 'mmcad072019@gmail.com',
  },
  {
    sno: 3,
    dept: 'Complaint Department',
    desc: "All matters relating to medical negligence Complaints against RMP'S",
    mail: 'mmccomplaintcell@gmail.com',
  },
  {
    sno: 4,
    dept: 'Court Matters and RTI Department',
    desc: 'All matters relating to Court Matters and RTI',
    mail: 'mmcrtiservices@gmail.com',
  },
  {
    sno: 5,
    dept: 'Continues Professional Development (CPD) Department',
    desc: 'All matters relating to CPD',
    mail: 'mmccmemumbai@yahoo.in',
  },
  {
    sno: 6,
    dept: 'Provisional Registration Department (Maharashtra State)',
    desc: 'All matters relating to Provisional Registration',
    mail: 'mmcprovservices@gmail.com',
  },
  {
    sno: 7,
    dept: 'Permanent Registration Department',
    desc: 'All matters relating to Permanent Registration',
    mail: 'mmcprservices@gmail.com',
  },
  {
    sno: 8,
    dept: 'Foreign Provisional / Permanent Registration Department',
    desc: 'All matters relating to Foreign Provisional / Permanent Registration',
    mail: 'mmcfmgeservices@gmail.com',
  },
  {
    sno: 9,
    dept: 'Additional Qualification Registration Department',
    desc: 'All matters relating to Registration of Additional qualifications',
    mail: 'mmcaqualservices@gmail.com',
  },
  {
    sno: 10,
    dept: 'Renewal of Registration Department',
    desc: 'All matters relating to Renewal of Registration',
    mail: 'mmcrenservices@gmail.com',
  },
  {
    sno: 11,
    dept: 'NOC, GSC & Verification Department',
    desc: 'All matters relating to NOC, GSC & Verification (For example ECFMG, CPSO, GMC & etc.)',
    mail: ['NOC-mmcnocservices@gmail.com', 'GSC-mmcgscservices@gmail.com'],
  },
  { sno: 12, dept: 'Technical Support Department', desc: 'All matters relating to Technical Support', mail: 'mmconlineservices1@gmail.com' },
]

const tableData2 = [
  { sno: 1, dept: 'All matters related to Administration', ext: 1 },
  { sno: 2, dept: 'All matters relating to Purchase, Establishment & Account', ext: 2 },
  { sno: 3, dept: "All matters relating to medical negligence Complaints against RMP'S", ext: 3 },
  { sno: 4, dept: 'All matters relating to Court Matters and RTI', ext: 4 },
  { sno: 5, dept: 'All matters relating to CPD', ext: 5 },
  { sno: 6, dept: 'Provisional Registration Department (Maharashtra State)', ext: 6 },
  { sno: 7, dept: 'Permanent Registration Department', ext: 7 },
  { sno: 8, dept: 'Foreign Provisional / Permanent Registration Department', ext: 8 },
  { sno: 9, dept: 'Additional Qualification Registration Department', ext: 9 },
  { sno: 10, dept: 'Renewal of Registration Department', ext: 10 },
  { sno: 11, dept: 'NOC, GSC & Verification Department', ext: 11 },
  { sno: 12, dept: 'Technical Support Department', ext: 12 },
]

const tableData3 = [
  { sno: 1, name: 'Mrs. Ruchi Mahadik', dept: 'Counter / Inward & Barcode Entry / Telephone', ext: 101 },
  { sno: 2, name: 'Mrs. Dhanashree Patiyane', dept: 'NOC / GSC / RTI / High Court / LAQ', ext: 109 },
  { sno: 3, name: 'Ms. Ashwini Harchande', dept: 'Additional Qualification Registration', ext: 103 },
  { sno: 4, name: 'Ms. Priyanka Jadhav', dept: 'Renewal of Registration', ext: 106 },
  { sno: 5, name: 'Ms. Pranali Mahajan', dept: 'IT / Foreign Qualification Registration', ext: 108 },
  { sno: 6, name: 'Ms. Susmita Bhole', dept: 'CPD', ext: 102 },
  { sno: 7, name: 'Mr. Chinmay Wadekar', dept: 'Complaint / Legal', ext: 105 },
  { sno: 8, name: 'Ms. Anagha Prabhu', dept: 'Permanent Registration', ext: 104 },
  { sno: 9, name: 'Omkar Agre', dept: 'Provisional Registration / Any other job', ext: 107 },
  { sno: 10, name: 'Pramila', dept: 'Technical Support from IBS', ext: 110 },
]

const tableWrapperClass = 'overflow-x-auto rounded-md border border-[#E6E2D8]'
const thClass = 'whitespace-nowrap border-b border-r border-[#D1B25E] px-4 py-3 text-left text-sm font-semibold text-[#2E2A21] lg:text-base'
const tdClass = 'border-b border-r border-[#E6E2D8] px-4 py-3 text-sm text-[#2E2A21] lg:text-base'

const ContactUs = () => {
  return (
    <main className="bg-[#F8F7F4] px-4 pb-10 pt-5 sm:px-6 sm:pt-7 lg:px-10">
      <div className="mx-auto flex max-w-[1300px] flex-col gap-4 lg:gap-6">
        <section className="rounded-lg bg-white p-5 sm:p-7 lg:p-10">
          <div className="flex flex-col gap-4 sm:gap-5">
            <h1 className="text-xl font-bold text-[#2E2A21] lg:text-2xl">Contact Us</h1>
            <p className="text-sm leading-relaxed text-[#2E2A21] sm:text-base">
              For queries specific to the section, please mail to the e-mail given in the table. Kindly provide your application tracking number, acknowledgement receipt etc., as attachment.
            </p>

            <div className={tableWrapperClass}>
              <table className="min-w-[760px] w-full">
                <thead className="bg-[#F3ECD8]">
                  <tr>
                    <th className={thClass}>S.no</th>
                    <th className={thClass}>Departments</th>
                    <th className="border-b border-[#D1B25E] px-4 py-3 text-left text-sm font-semibold text-[#2E2A21] lg:text-base">Email</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {tableData.map((row) => (
                    <tr key={row.sno} className="transition hover:bg-[#F8F7F4]">
                      <td className={tdClass}>{row.sno}</td>
                      <td className={tdClass}>
                        <span className="font-semibold">{row.dept}</span>
                        <br />
                        {row.desc}
                      </td>
                      <td className="border-b border-[#E6E2D8] px-4 py-3 text-sm text-[#2E2A21] lg:text-base">
                        <div className="flex flex-col gap-1">
                          {Array.isArray(row.mail) ? (
                            row.mail.map((email) => (
                              <a
                                key={email}
                                href={`mailto:${email}`}
                                className="break-all text-[#2E2A21] transition hover:text-[#6F5312] hover:underline"
                              >
                                {email}
                              </a>
                            ))
                          ) : (
                            <a
                              href={`mailto:${row.mail}`}
                              className="break-all text-[#2E2A21] transition hover:text-[#6F5312] hover:underline"
                            >
                              {row.mail}
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="rounded-lg bg-white p-5 sm:p-7 lg:p-10">
          <p className="pb-4 text-base font-semibold text-[#2E2A21] lg:text-lg">List of Department wise Extension</p>
          <div className={tableWrapperClass}>
            <table className="min-w-[620px] w-full">
              <thead className="bg-[#F3ECD8]">
                <tr>
                  <th className={thClass}>S.no</th>
                  <th className={thClass}>Departments</th>
                  <th className="border-b border-[#D1B25E] px-4 py-3 text-left text-sm font-semibold text-[#2E2A21] lg:text-base">Extension</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {tableData2.map((row) => (
                  <tr key={row.sno} className="transition hover:bg-[#F8F7F4]">
                    <td className={tdClass}>{row.sno}</td>
                    <td className={tdClass}>{row.dept}</td>
                    <td className="border-b border-[#E6E2D8] px-4 py-3 text-sm text-[#2E2A21] lg:text-base">{row.ext}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-lg bg-white p-5 sm:p-7 lg:p-10">
          <p className="pb-4 text-base font-semibold text-[#2E2A21] lg:text-lg">Extension List</p>
          <div className={tableWrapperClass}>
            <table className="min-w-[760px] w-full">
              <thead className="bg-[#F3ECD8]">
                <tr>
                  <th className={thClass}>S.no</th>
                  <th className={thClass}>Name</th>
                  <th className={thClass}>Department</th>
                  <th className="border-b border-[#D1B25E] px-4 py-3 text-left text-sm font-semibold text-[#2E2A21] lg:text-base">Ext.</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {tableData3.map((row) => (
                  <tr key={row.sno} className="transition hover:bg-[#F8F7F4]">
                    <td className={tdClass}>{row.sno}</td>
                    <td className={tdClass}>{row.name}</td>
                    <td className={tdClass}>{row.dept}</td>
                    <td className="border-b border-[#E6E2D8] px-4 py-3 text-sm text-[#2E2A21] lg:text-base">{row.ext}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-lg bg-white p-5 sm:p-7 lg:p-10">
            <h3 className="text-lg font-bold text-[#2E2A21]">Contact Information</h3>
            <h4 className="pt-4 text-base font-bold text-[#2E2A21]">Address :</h4>
            <p className="pt-2 text-sm leading-relaxed text-[#2E2A21] sm:text-base">
              Maharashtra Medical Council, Mumbai
              <br />
              189 - A, Anand Complex,
              <br />
              First Floor, Sane Guruji Marg,
              <br />
              Arthur Road Naka, Chinchpokali(W),
              <br />
              MUMBAI - 400011.
            </p>
            <h4 className="pt-4 text-base font-bold text-[#2E2A21]">Helpline :</h4>
            <p className="pt-2 text-sm text-[#2E2A21] sm:text-base">020 48556211</p>
            <h4 className="pt-4 text-base font-bold text-[#2E2A21]">Website :</h4>
            <p className="pt-2 text-sm text-[#2E2A21] sm:text-base">maharashtramedicalcouncil.in</p>
          </div>

          <div className="rounded-lg bg-white p-5 sm:p-7 lg:p-10">
            <h3 className="pb-4 text-lg font-bold text-[#2E2A21]">Find Us</h3>
            <GoogleMap />
          </div>
        </section>
      </div>
    </main>
  )
}

export default ContactUs
