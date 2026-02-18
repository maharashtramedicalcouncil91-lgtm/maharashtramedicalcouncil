import { useEffect, useState } from 'react'
import MMCBanner from '/src/assets/images/banners/MMCBanner.png'
import MMCBanner2 from '/src/assets/images/banners/MMCBanner2.png'
import MMCBanner3 from '/src/assets/images/banners/MMCBanner3.png'
import MMCBanner4 from '/src/assets/images/banners/MMCBanner4.png'

const slides = [
  { id: 1, img: MMCBanner },
  { id: 2, img: MMCBanner2 },
  { id: 3, img: MMCBanner3 },
  { id: 4, img: MMCBanner4 },
]

const Carousel = () => {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="w-full">
      <div className="relative overflow-hidden rounded-xl h-[190px] sm:h-[280px] md:h-[360px] lg:h-[520px] xl:h-[620px]">
        <div
          className="flex h-full transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {slides.map((slide) => (
            <img
              key={slide.id}
              src={slide.img}
              alt="Hero Banner"
              className="h-full w-full flex-shrink-0 object-fit"
            />
          ))}
        </div>
      </div>

      <div className="mt-2 flex justify-center gap-2 sm:mt-4 sm:gap-3">
        {slides.map((slide, i) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-2.5 w-2.5 rounded-full border border-[#E6E2D8] transition-all sm:h-3 sm:w-3 lg:h-4 lg:w-4 ${
              index === i ? 'bg-[#886718]' : 'bg-transparent'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

export default Carousel
