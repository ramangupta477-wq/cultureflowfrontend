"use client";

import { motion } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import React, { useEffect, useRef } from "react";
import {
  Autoplay,
  EffectCoverflow,
  Navigation,
  Pagination,
} from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-cards";

import { cn } from "@/lib/utils";

export interface Skiper49Props {
  activeStep?: number;
  onStepChange?: (index: number) => void;
  className?: string;
  images?: { src: string; alt: string }[];
}

const defaultImages = [
  {
    src: "https://res.cloudinary.com/pxd8he17/image/upload/v1792488717/1.png",
    alt: "Tech & Innovation — Frontier AI and robotics ecosystems",
  },
  {
    src: "https://res.cloudinary.com/pxd8he17/image/upload/v1792488786/2.png",
    alt: "Sustainability & Impact — Systems shaping global sustainability",
  },
  {
    src: "https://res.cloudinary.com/pxd8he17/image/upload/v1792488784/3.png",
    alt: "Heritage & Culture — Civilisations, traditions, and institutional heritage",
  },
];

const Skiper49: React.FC<Skiper49Props> = ({
  activeStep = 0,
  onStepChange,
  className,
  images = defaultImages,
}) => {
  return (
    <div className={cn("flex w-full items-center justify-center overflow-hidden", className)}>
      <Carousel_003
        className="w-full"
        images={images}
        showPagination
        loop={false}
        activeStep={activeStep}
        onStepChange={onStepChange}
      />
    </div>
  );
};

export { Skiper49 };

const Carousel_003 = ({
  images,
  className,
  showPagination = false,
  showNavigation = false,
  loop = false,
  autoplay = false,
  spaceBetween = 0,
  activeStep = 0,
  onStepChange,
}: {
  images: { src: string; alt: string }[];
  className?: string;
  showPagination?: boolean;
  showNavigation?: boolean;
  loop?: boolean;
  autoplay?: boolean;
  spaceBetween?: number;
  activeStep?: number;
  onStepChange?: (index: number) => void;
}) => {
  const swiperRef = useRef<SwiperType | null>(null);

  useEffect(() => {
    if (swiperRef.current && typeof activeStep === "number") {
      if (swiperRef.current.activeIndex !== activeStep) {
        swiperRef.current.slideTo(activeStep, 450);
      }
    }
  }, [activeStep]);

  const css = `
  .Carousal_003 {
    width: 100% !important;
    max-width: 100% !important;
    height: 540px !important;
    padding-bottom: 45px !important;
    overflow: hidden !important;
  }
  
  .Carousal_003 .swiper-slide {
    background-position: center;
    background-size: cover;
    width: 360px !important;
    height: 440px !important;
    border-radius: 0px !important;
    overflow: hidden;
  }

  .Carousal_003 .swiper-slide img {
    border-radius: 0px !important;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .Carousal_003 .swiper-pagination {
    bottom: 8px !important;
  }

  .swiper-pagination-bullet {
    background-color: #0B0B0B !important;
    opacity: 0.25 !important;
    width: 8px !important;
    height: 8px !important;
    margin: 0 5px !important;
    cursor: pointer !important;
    transition: opacity 0.3s ease, transform 0.3s ease, background-color 0.3s ease !important;
  }

  .swiper-pagination-bullet-active {
    opacity: 1 !important;
    background-color: #0B0B0B !important;
    transform: scale(1.25) !important;
  }

  @media (max-width: 768px) {
    .Carousal_003 {
      height: 420px !important;
      padding-bottom: 40px !important;
    }
    .Carousal_003 .swiper-slide {
      width: 280px !important;
      height: 340px !important;
    }
  }
`;
  return (
    <motion.div
      initial={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{
        duration: 0.3,
        delay: 0.2,
      }}
      className={cn("relative w-full max-w-4xl px-2 md:px-5", className)}
    >
      <style>{css}</style>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full"
      >
        <Swiper
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          onSlideChange={(swiper) => {
            if (onStepChange && swiper.activeIndex !== activeStep) {
              onStepChange(swiper.activeIndex);
            }
          }}
          initialSlide={activeStep ?? 0}
          observer={true}
          observeParents={true}
          spaceBetween={spaceBetween}
          autoplay={
            autoplay
              ? {
                  delay: 2500,
                  disableOnInteraction: true,
                }
              : false
          }
          effect="coverflow"
          grabCursor={true}
          slidesPerView="auto"
          centeredSlides={true}
          loop={loop}
          coverflowEffect={{
            rotate: 35,
            stretch: 0,
            depth: 90,
            modifier: 1,
            slideShadows: true,
          }}
          pagination={
            showPagination
              ? {
                  clickable: true,
                }
              : false
          }
          navigation={
            showNavigation
              ? {
                  nextEl: ".swiper-button-next",
                  prevEl: ".swiper-button-prev",
                }
              : false
          }
          className="Carousal_003"
          modules={[EffectCoverflow, Autoplay, Pagination, Navigation]}
        >
          {images.map((image, index) => (
            <SwiperSlide key={index} className="">
              <img
                className="h-full w-full object-cover"
                src={image.src}
                alt={image.alt}
              />
            </SwiperSlide>
          ))}
          {showNavigation && (
            <div>
              <div className="swiper-button-next after:hidden">
                <ChevronRightIcon className="h-6 w-6 text-white" />
              </div>
              <div className="swiper-button-prev after:hidden">
                <ChevronLeftIcon className="h-6 w-6 text-white" />
              </div>
            </div>
          )}
        </Swiper>
      </motion.div>
    </motion.div>
  );
};

export { Carousel_003 };
export default Skiper49;
