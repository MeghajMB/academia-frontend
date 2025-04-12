import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";

// Dummy images for the carousel
const carouselImages = [
  "https://picsum.photos/id/20/1350/300",
  "https://picsum.photos/id/60/1350/300",
  "https://picsum.photos/id/119/1350/300",
  "https://picsum.photos/id/355/1350/300",
];

export default function Carousel() {
  // Settings for react-slick
  const settings = {
    dots: true, // Show navigation dots
    infinite: true, // Loop the carousel
    speed: 500, // Transition speed in milliseconds
    slidesToShow: 1, // Show one slide at a time
    slidesToScroll: 1, // Scroll one slide at a time
    autoplay: true, // Automatically cycle through slides
    autoplaySpeed: 3000, // Time between slides in milliseconds
    arrows: false, // Show next/prev arrows
    fade: true,
    waitForAnimate: false,
  };

  return (
    <div className="w-full">
      <Slider {...settings}>
        {carouselImages.map((image, index) => (
          <div key={index}>
            <Image
              src={image}
              alt={`Carousel slide ${index + 1}`}
              width={1350}
              height={300}
              className="w-full h-96 object-cover rounded-lg" // Adjust height and styling as needed
            />
          </div>
        ))}
      </Slider>
    </div>
  );
}
