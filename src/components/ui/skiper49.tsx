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
}

const defaultImages = [
  {
    src: "https://cdn.21st.dev/assets/localized/4a5d625e1432b674a463e803e9fe672f362ad7b1b267b16c8bb0793a5c81747d.jpg",
    alt: "Scholastic Immersion - Oxford and Cambridge pathways",
  },
  {
    src: "https://cdn.21st.dev/assets/localized/75561b1340c3d6965831289a69c3b61286af703f407eda10f5c21201f54586a7.jpg",
    alt: "Borderless Research - Ivy League & frontier labs",
  },
  {
    src: "https://cdn.21st.dev/assets/localized/89112484e2896a033a8e70574c9187cd06bb596347e408d57f7a6f7cbf8513f7.jpg",
    alt: "End-to-End Mobility - Housing, logistics and visas",
  },
];

const Skiper49: React.FC<Skiper49Props> = ({
  activeStep = 0,
  onStepChange,
  className,
}) => {
  return (
    <div className={cn("flex w-full items-center justify-center overflow-hidden", className)}>
      <Carousel_003
        className="w-full"
        images={defaultImages}
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
    height: 480px !important;
    padding-bottom: 50px !important;
    overflow: hidden !important;
  }
  
  .Carousal_003 .swiper-slide {
    background-position: center;
    background-size: cover;
    width: 320px !important;
    height: 380px !important;
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
      height: 400px !important;
      padding-bottom: 40px !important;
    }
    .Carousal_003 .swiper-slide {
      width: 260px !important;
      height: 310px !important;
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
