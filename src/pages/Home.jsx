import Carousel from '../components/Carousel'
import NoticeBoard from '../components/NoticeBoard'
import InfoCards from '../components/InfoCards'
import DataCards from '../components/DataCards'

const Home = () => {
  return (
    <main className="bg-[#F8F7F4] px-4 pb-10 pt-5 sm:px-6 sm:pt-7 lg:px-10">
      <Carousel />
      <NoticeBoard />
      <InfoCards />
      <DataCards />
    </main>
  )
}

export default Home
