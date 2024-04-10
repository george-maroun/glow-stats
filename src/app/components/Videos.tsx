import React, { useRef } from "react";
// import { useEffect, useState } from "react";
// import { IoIosArrowDroprightCircle, IoIosArrowDropleftCircle } from "react-icons/io";

// const blogUrls = [
//   'https://glowlabs.org/blog/why-glow-excites-me',
//   'https://glowlabs.org/blog/glow-guarded-launch',
//   'https://glowlabs.org/blog/glow-impact-platform',
//   'https://glowlabs.org/blog/first-audit-refactor',
// ];

// const twitterUrls = [
//   'https://twitter.com/i/spaces/1OdKrjmzWewKX',
// ];

const videoUrls = [
  'https://youtu.be/m9AKGvJR9jw?si=Wab0TM_vQPRDzx5L',
  'https://www.youtube.com/watch?v=-AdUYpVQzzc',
  'https://www.youtube.com/watch?v=2IbX4N8fgkM',
  'https://youtu.be/hanD2vaYja4?si=KB8kxli-sYH5mGig',
  'https://youtu.be/Tv13PB7w8Zg?si=N9nKyczgnKIi4kKF',
  'https://youtu.be/r5WK4wLN5No?si=GdQssyaUlFIOXmqh',
  'https://youtu.be/x3pUTkFSksc?si=Mw8f9Sp44zEPOosK',
  
];

const renderVideo = (url:string) => {
  const videoId = url.split('v=')[1]?.split('&')[0] || url.split('/').pop();
  return (
    <iframe
      style={{
        width: '100%',
        height: '100%',
        border: '0',
        borderRadius: '8px',
      }}
      src={`https://www.youtube.com/embed/${videoId}`}
      title="YouTube video player"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen>
    </iframe>
  );
};

const Videos = () => {
  const carouselRef = useRef(null);
  // const [isAtStart, setIsAtStart] = useState(true);
  // const [isAtEnd, setIsAtEnd] = useState(false);

  // const checkScrollPosition = () => {
  //   if (carouselRef.current) {
  //     const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
  //     setIsAtStart(scrollLeft === 0);
  //     setIsAtEnd(scrollLeft >= scrollWidth - clientWidth);
  //   }
  // };

  // useEffect(() => {
  //   checkScrollPosition();
  //   // Optionally, check the position again in case the initial check wasn't accurate due to rendering
  //   window.addEventListener('load', checkScrollPosition);
  //   return () => window.removeEventListener('load', checkScrollPosition);
  // }, []);

  // const scroll = (direction) => {
  //   if (direction === 'left') {
  //     carouselRef.current.scrollLeft -= 250; // Adjust scrolling step if needed
  //   } else {
  //     carouselRef.current.scrollLeft += 250; // Adjust scrolling step if needed
  //   }
  // };

  return (
    <main className="w-full flex items-center" style={{ maxWidth: "1244px" }}>
      {/* {!isAtStart && (
        <button className="w-16 h-16" onClick={() => scroll('left')} style={{ marginRight: '10px' }}>
          <IoIosArrowDropleftCircle size="48px" color="gray" opacity={30}/>
        </button>
      )} */}
      <div
        ref={carouselRef}
        // onScroll={checkScrollPosition}
        className="flex overflow-x-scroll scroll-smooth"
        style={{
          scrollBehavior: 'smooth',
          overflowX: 'scroll',
          WebkitOverflowScrolling: 'touch', // for smooth scrolling on iOS
          display: 'flex',
          maxWidth: 'calc(100% - 5px)', // Adjust based on button width to prevent overflow
        }}
      >
        {videoUrls.map((url, index) => (
          <div
            key={index}
            className="flex-none w-11/12 h-52 lg:w-5/12 lg:h-80 lg:mr-6 mr-4"
            // style={{
            //   width: '500px', // Adjust width as needed
            //   height: '320px', // Adjust height as needed
            //   marginRight: '24px',
            // }}
          >
            {renderVideo(url)}
          </div>
        ))}
      </div>
      {/* {!isAtEnd && (
        <button className="w-16 h-16" onClick={() => scroll('right')} style={{ marginLeft: '10px' }}>
          <IoIosArrowDroprightCircle size="48px" color="gray" opacity={30}/>
        </button>
      )} */}
    </main>
  );
};

export default Videos;