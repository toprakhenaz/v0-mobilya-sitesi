"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CarouselItem {
  id: number
  imageUrl: string
  title: string
  subtitle: string
  description: string
}

// carouselItems dizisini güncelleyelim
const carouselItems: CarouselItem[] = [
  {
    id: 1,
    imageUrl: "/hero-1-new.png",
    title: "YAZ FIRSATLARI",
    subtitle: "Bahçe Mobilyalarında",
    description: "%30 İNDİRİM",
  },
  {
    id: 2,
    imageUrl: "/hero-2-new.png",
    title: "BAHÇE TAKIMI ALANA",
    subtitle: "Şezlong",
    description: "HEDİYE",
  },
  {
    id: 3,
    imageUrl: "/hero-3-new.png",
    title: "YENİ SEZON",
    subtitle: "Rattan Bahçe Mobilyaları",
    description: "STOKLARDA",
  },
]

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === carouselItems.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? carouselItems.length - 1 : prev - 1))
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide()
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden">
      {/* Carousel Items */}
      {carouselItems.map((item, index) => (
        <div
          key={item.id}
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ${
            index === currentSlide ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <Image
            src={item.imageUrl || "/placeholder.svg"}
            alt={item.title}
            fill
            className="object-cover"
            priority={index === 0}
          />
          <div className="absolute inset-0 bg-black bg-opacity-30">
            <div className="container mx-auto px-4 h-full flex flex-col justify-center items-start text-white">
              <h2 className="text-xl md:text-3xl font-bold mb-2">{item.title}</h2>
              <h3 className="text-lg md:text-2xl mb-2">{item.subtitle}</h3>
              <p className="text-3xl md:text-5xl font-bold">{item.description}</p>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-70 text-black rounded-full"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-70 text-black rounded-full"
        onClick={nextSlide}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {carouselItems.map((_, index) => (
          <button
            key={index}
            className={`h-2 w-2 rounded-full ${index === currentSlide ? "bg-white" : "bg-white bg-opacity-50"}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

export default HeroCarousel
