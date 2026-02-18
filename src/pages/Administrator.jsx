import RVM from '/src/assets/images/photos/RVM.png'

const Administrator = () => {
  return (
    <main className="bg-[#F8F7F4] px-4 pb-10 pt-5 sm:px-6 sm:pt-7 lg:px-10">
      <div className="mx-auto max-w-[960px] rounded-lg bg-white p-5 sm:p-7 lg:p-10">
        <div className="flex flex-col gap-6">
          <div className="rounded-md border border-[#E6E2D8] bg-[#F3ECD8] px-4 py-4">
            <h1 className="text-xl font-bold text-[#2E2A21] lg:text-2xl">Administrator</h1>
            <p className="pt-2 text-sm text-[#5C5543] sm:text-base">Maharashtra Medical Council</p>
          </div>

          <div className="rounded-lg border border-[#E6E2D8] bg-[#FCFAF4] p-5 sm:p-6">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-6">
              <img src={RVM} alt="Dr. Rughwani Vinki Mohanlal" className="h-auto w-56 rounded-md border border-[#E6E2D8] object-contain sm:w-64 lg:w-72" />
              <div className="flex flex-col gap-2 text-center sm:text-left">
                <h2 className="text-lg font-bold text-[#2E2A21] sm:text-xl">Dr. Rughwani Vinki Mohanlal</h2>
                <p className="text-sm font-semibold text-[#6D6450] sm:text-base">Designation: Administrator</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Administrator
