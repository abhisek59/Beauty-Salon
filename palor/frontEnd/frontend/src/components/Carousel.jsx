import React, { useEffect, useState, useRef } from 'react';

const Carousel = ({ slides, interval = 4000 }) => {
  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    startTimer();
    return () => stopTimer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  const startTimer = () => {
    stopTimer();
    timerRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, interval);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const goTo = (i) => {
    setIndex(i % slides.length);
  };

  const prev = () => {
    setIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
  };

  const next = () => {
    setIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  if (!slides || slides.length === 0) return null;

  return (
    <div className="relative w-full overflow-hidden rounded-lg">
      <div className="relative h-72 md:h-96 w-full">
        {slides.map((slide, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              i === index ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
            aria-hidden={i === index ? 'false' : 'true'}
          >
            <img
              src={slide.image}
              alt={slide.alt || `slide-${i}`}
              className="object-cover w-full h-full"
              onError={(e) => {
                console.error(`Failed to load image: ${slide.image}`, e);
                e.target.style.backgroundColor = '#f3f4f6';
                e.target.style.border = '2px dashed #ef4444';
              }}
              onLoad={() => {
                console.log(`Successfully loaded image: ${slide.image}`);
              }}
            />
            {/* Overlay (semi-transparent) */}
            <div className="absolute inset-0 bg-black bg-opacity-30"></div>

            {/* Positioned text in front */}
            <div className="absolute inset-0 flex items-center justify-center p-6">
              <div className="text-center max-w-3xl text-white">
                <h2 className="text-2xl md:text-4xl font-bold drop-shadow-lg">{slide.title}</h2>
                {slide.subtitle && (
                  <p className="mt-2 text-sm md:text-lg drop-shadow-md">{slide.subtitle}</p>
                )}
                {slide.cta && (
                  <div className="mt-4">
                    <a
                      href={slide.cta.href}
                      className="inline-block bg-pink-600 hover:bg-pink-700 text-white py-2 px-4 rounded-lg"
                    >
                      {slide.cta.text}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <button
        aria-label="Previous"
        onClick={() => {
          prev();
          startTimer();
        }}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-60 hover:bg-opacity-80 text-pink-700 rounded-full p-2"
      >
        ‹
      </button>

      <button
        aria-label="Next"
        onClick={() => {
          next();
          startTimer();
        }}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-60 hover:bg-opacity-80 text-pink-700 rounded-full p-2"
      >
        ›
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => {
              goTo(i);
              startTimer();
            }}
            className={`h-2 w-8 rounded-full transition-colors ${
              i === index ? 'bg-pink-600' : 'bg-white bg-opacity-60'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
