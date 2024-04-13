import React from "react"

interface ContentInfo {
  title: string;
  author: string;
  url: string;
  type: string;
  thumbnail: string;
}

interface ContentProps {
  contentUrls: ContentInfo[];
}

const renderVideo = (info:ContentInfo) => {
  const { url, title, author } = info;
  const videoId = info.url.split('v=')[1]?.split('&')[0] || url.split('/').pop();
  return (
    <div className="h-auto">
      <div className="lg:h-60 md:h-60 h-52 mb-2">
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
      </div>
      <a className="max-w-8/12 hover:opacity-80" href={url} target="_blank">
        <p className="mb-1" style={{color: 'gray'}}>{author}</p>
        <h1 className="text-2xl">{title}</h1>
      
      </a>
    </div>
  );
};

const renderBlogPost = (info:ContentInfo) => {
  const { url, title, author, thumbnail } = info;
  return (
    <>
    <a
      style={{
        width: '100%',
        height: '100%',
        border: '0',
        borderRadius: '8px',
      }}
      className="hover:text-blue-500"
      href={url}
      target="_blank"
      title="YouTube video player"
      >
      <div className="h-auto">
        <img 
          src={thumbnail}
          className="lg:h-64"
          style={{
            width: '100%',
            borderRadius: '8px',
          }}
          alt={title}
        >

        </img>
      </div>
      <div className="max-w-8/12 mt-2 hover:opacity-80">
        <p className="mb-1" style={{color: 'gray'}}>{author}</p>
        <h1 className="text-2xl">{title}</h1>
        
      </div>

    </a>
    </>
  );
};

const ContentRow = ({ contentUrls }: ContentProps) => {
  return (
    <main className="w-full flex items-center">
      <div
        className="flex overflow-x-scroll scroll-smooth lg:w-full lg:mr-6
        "
        style={{
          scrollBehavior: 'smooth',
          overflowX: 'scroll',
          WebkitOverflowScrolling: 'touch', // for smooth scrolling on iOS
          display: 'flex',
        }}
      >
        {contentUrls.map((info, index) => (
          <div
            key={index}
            className="flex-none w-11/12 lg:w-4/12 md:w-6/12  lg:mr-6 mr-4 h-auto"

          >
            {info.type == 'youtube' ? renderVideo(info) : renderBlogPost(info)}
          </div>
        ))}
      </div>
    </main>
  );
};

export default ContentRow;