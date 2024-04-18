"use client"
import React from "react";
import ContentRow from "../components/ContentRow";

const twitterUrls = [
  {
    title: 'Glow deep dive Q&A',
    author: '@GlowFND',
    url: 'https://twitter.com/i/spaces/1OdKrjmzWewKX',
    type: 'x',
    thumbnail: './x-logo.png',
  },
];

const glowVideosUrls = [
  {
    title: 'New Frontiers in Carbon Avoidance: Solar',
    author: 'Flowcarbon',
    url: 'https://youtu.be/m9AKGvJR9jw?si=Wab0TM_vQPRDzx5L',
    type: 'youtube',
    thumbnail: '',
  },
  {
    title: 'Glow Protocol last weeks recap',
    author: 'Glow Solutions',
    url: 'https://www.youtube.com/watch?v=-AdUYpVQzzc',
    type: 'youtube',
    thumbnail: '',
  },
  {
    title: 'Glow Token Protocol recap 1/13/2023',
    author: 'Glow Solutions',
    url: 'https://www.youtube.com/watch?v=2IbX4N8fgkM',
    type: 'youtube',
    thumbnail: '',
  },
  {
    title: 'Glow Token Protocol Recap 1/20/2024',
    author: 'Glow Solutions',
    url: 'https://youtu.be/hanD2vaYja4?si=KB8kxli-sYH5mGig',
    type: 'youtube',
    thumbnail: '',
  },
  {
    title: 'Glow token protocol recap 2/12/24',
    author: 'Glow Solutions',
    url: 'https://youtu.be/Tv13PB7w8Zg?si=N9nKyczgnKIi4kKF',
    type: 'youtube',
    thumbnail: '',
  },
  {
    title: 'Unleashing DePIN #015 - A Conversation With David Vorick From Glow',
    author: 'Unleashing DePIN',
    url: 'https://youtu.be/r5WK4wLN5No?si=GdQssyaUlFIOXmqh',
    type: 'youtube',
    thumbnail: '',
  },
  {
    title: "DePIN Incentives 101, David Vorick 📌 DePIN Day Denver' 24",
    author: 'Fluence DAO',
    url: 'https://youtu.be/x3pUTkFSksc?si=Mw8f9Sp44zEPOosK', 
    type: 'youtube',
    thumbnail: '',
  },
];

const relatedVideosUrls = [
  {
    title: 'Carbon Offsets: Last Week Tonight with John Oliver (HBO)',
    author: 'LastWeekTonight',
    url: 'https://youtu.be/6p8zAbFKpW0?si=yVeYL8jHKRT37HoK',
    type: 'youtube',
    thumbnail: '',
  },
  {
    title: 'Bogus Carbon Offsets Drive Carbon Neutral Claims',
    author: 'Bloomberg Originals',
    url: 'https://www.youtube.com/watch?v=m0Z_tzv9XCg',
    type: 'youtube',
    thumbnail: '',
  }
];

const blogData = [
  {
    title: 'The First Major Refactor of the Glow Audit Standard',
    author: 'David Vorick',
    url: 'https://glowlabs.org/blog/first-audit-refactor',
    type: 'blog',
    thumbnail: 'https://assets-global.website-files.com/6537b494fe5c52989474b734/66071d1c075bcaa07cc90b8a_o07400_A_visionary_3D_isometric_concept_of_a_solar-powered_tran-4.png'
  },
  {
    title: 'The Glow Impact Platform',
    author: 'David Vorick',
    url: 'https://glowlabs.org/blog/glow-impact-platform',
    type: 'blog',
    thumbnail: 'https://assets-global.website-files.com/6537b494fe5c52989474b734/659cca0070c9a5bc1f304424_6.png'
  },
  {
    title: 'Guarded Launch: Protecting Glow Users Against Hacks',
    author: 'David Vorick',
    url: 'https://glowlabs.org/blog/glow-guarded-launch',
    type: 'blog',
    thumbnail: 'https://assets-global.website-files.com/6537b494fe5c52989474b734/659cc1e3947b43db47da63c8_Screenshot%202024-01-08%20at%2014-37-07%20Figma.png'
  },
  {
    title: 'Why Glow Excites Me',
    author: 'David Vorick',
    url: 'https://glowlabs.org/blog/why-glow-excites-me',
    type: 'blog',
    thumbnail: './why-glow-excites-me.png'
  },
]

interface Resource {
  description: string;
  type: string;
  url: string;
}

const resources: Resource[] = [
  { description: "Glow Homepage", type: "Website", url: "https://glowlabs.org/" },
  { description: "Glow Foundation", type: "Website", url: "https://www.glow.org/" },
  { description: "Glow Blog", type: "Website", url: "https://glowlabs.org/blog" },
  { description: "Glow developer documentation", type: "Website", url: "https://solidity.glowlabs.org/" },
  { description: "Glow Governance", type: "Website", url: "https://www.glow-governance.com/" },
  { description: "Glow Whitepaper", type: "Document", url: "https://www.icrg.io/whitepaper.pdf" },
  { description: "Glow Audit Reports", type: "Website", url: "https://www.glow.org/audits" },
  { description: "Glow Veto Council Members", type: "Website", url: "https://www.glow.org/veto" },
  { description: "Glow Press & Media Kit", type: "Website", url: "https://glowlabs.org/press" },
  { description: "Interest form to run a solar farm on Glow", type: "Document", url: "https://docs.google.com/forms/d/16iNCg4stGSaa9YNS3qMRMNDHOivivAfSRUA_n2ZZgTk" },
  { description: "Buy $GLW", type: "Website", url: "https://app.glow.org/" },
  { description: "Community-built frontend to buy $GLW", type: "Website", url: "https://glowstation.tech/" },
  { description: "Community-built Glow statistcs dashboard", type: "Website", url: "https://www.glowstats.xyz/" }
];

const Content = () => {
  return (
    <main className="w-full items-center" style={{ maxWidth: "1244px" }}>

      <div id='divider' className='h-8'></div>

      <div className='text-4xl mb-8'>Blog</div>
      <ContentRow contentUrls={blogData}/>
      
      <div id='divider' className='h-8'></div>
      <div id='divider' className='h-10'></div>

      <div className='text-4xl mb-8'>Audios</div>
      <ContentRow contentUrls={twitterUrls}/>
      
      <div id='divider' className='h-8'></div>
      <div id='divider' className='h-10'></div>


      <div className='text-4xl mb-8'>Glow Videos</div>
      <ContentRow contentUrls={glowVideosUrls}/>
      
      <div id='divider' className='h-8'></div>
      <div id='divider' className='h-10'></div>


      <div className='text-4xl mb-8'>Related Videos</div>
      <ContentRow contentUrls={relatedVideosUrls}/>
      
      <div id='divider' className='h-8'></div>
      <div id='divider' className='h-10'></div>

      <div className='text-4xl mb-8'>Links</div>
      {resources.map((resource, index) => (
        <div key={index} className='mb-2'>
          <a 
            href={resource.url} 
            target="_blank" 
            className='underline text-xl hover:text-[#222222]'
          >
            {resource.description}
          </a>
        </div>
      ))}
      
      <div id='divider' className='h-8'></div>
      <div id='divider' className='h-10'></div>
    </main>
  )
}

export default Content;