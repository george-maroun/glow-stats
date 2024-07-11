"use client"
import { ReactNode } from "react";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface Props {
  children?: ReactNode
}

const navItems = [
  {
    label: 'Stats',
    description: 'Main dashboard for Glow stats',
    path: '/'
  },
  {
    label: 'Content',
    description: 'Media content for Glow',
    path: '/content'
  },
];

export const Navbar: React.FC<Props> = ({ children }) => {
  const currentPath = usePathname();

  return (
    <div className={`relative font-manrope min-h-screen bg-beige items-center justify-start p-4`}>
      <header 
        className='w-full mb-2 flex flex-row justify-between items-end z-40 relative gap-3'
      >
        <Link href={'/'}>
          <div className={`text-2xl mr-2`}>Glow Stats</div>
        </Link>
        <div className="flex flex-row gap-4">
          {navItems.map((item, index) => (
            <Link key={index} href={item.path}>
              <div 
                className={`text-lg ${currentPath === item.path ? "underline decoration-1 underline-offset-1" : ""}`}
              >
                {item.label}
              </div>  
            </Link>
          ))
          }
        </div>
      </header>
      <main className={`flex justify-center transition-opacity duration-300 ease-in-out z-20`}>
        {children}
      </main>
      <div id='divider' className='h-16'></div>
      <div id='divider' className='h-10'></div>

      <div className='mt-4 mb-6 text-md align-center' style={{color: "#777777"}}>
        <p className='text-center'>Learn more at <a className='underline' target="_blank" href='https://glow.org/'>glow.org</a> and <a className='underline' target="_blank" href='https://twitter.com/glowFND/'>@GlowFND.</a></p>
      </div>
    </div>
  );
};
  
    


// "use client"
// import { ReactNode } from "react";
// import { useState, useRef, useEffect } from 'react';
// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// // TODO: Refactor this since we're not doing a multi-page app

// interface Props {
//   children?: ReactNode
// }

// interface NavItem {
//   label: string;
//   description: string;
//   path: string;
// }

// const navItems = [
//   {
//     label: 'Home',
//     description: 'Main dashboard for Glow stats',
//     path: '/'
//   },
//   {
//     label: 'Farms',
//     description: 'Farms data',
//     path: '/farms'
//   },
// ];

// export const Navbar: React.FC<Props> = ({ children }) => {
//   const [isActive, setIsActive] = useState(false);
//   const navRef = useRef(null); // Ref to track the nav element
//   const pathname = usePathname();

//   // Determine the href based on the current path
//   const href = pathname === '/farms' ? '/' : '/farms';
//   const linkText = pathname === '/farms' ? 'Home' : 'Farms';

//   const handleClick = () => {
//     setIsActive(!isActive);
//   };

//   // useEffect(() => {
//   //   const handleClickOutside = (event:any) => {
//   //     if (isActive && navRef.current && !(navRef.current as any).contains(event.target)) {
//   //       setIsActive(false);
//   //     }
//   //   };

//   //   // Add click event listener
//   //   document.addEventListener('mousedown', handleClickOutside);

//   //   return () => {
//   //     // Cleanup the event listener on component unmount
//   //     document.removeEventListener('mousedown', handleClickOutside);
//   //   };
//   // }, [isActive]);

//   return (
//     <div className={`relative ${isActive && 'bg-black bg-opacity-50'} font-manrope min-h-screen bg-beige items-center justify-start p-4`}>
//       <header className='w-full mb-2 flex flex-row justify-between items-center z-40 relative gap-2'>
//         <Link href={'/'}>
//           <div className='text-3xl'>Glow</div>   
//         </Link>
//         <Link href={'/'}>
//           <div className='text-lg'>Stats</div>   
//         </Link>
//         <Link href={'/glow-content'}>
//           <div className='text-lg'>Content</div>   
//         </Link>

//         <div>
//         {/* <div>
//           <Link href={href}>
//             <div className='text-lg underline decoration-1 underline-offset-1'>{linkText}</div>    
//           </Link>
//         </div> */}
//         </div>

//         {/* {!isActive && <button onClick={() => setIsActive(!isActive)} className="z-40">
//           Menu
//         </button>} */}
//       </header>
//       {/* {isActive && (
//         // This div acts as an overlay
//         <div className='fixed inset-0 bg-black opacity-75 z-30'></div>
//       )} */}
//       {/* <nav ref={navRef} className={`fixed top-0 right-0 h-full bg-white z-40 transform ${isActive ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out`} style={{backgroundColor: "white"}}>
//         {navItems.map((item:NavItem, index:number) => (
//           <div key={index} className='p-4 border-b border-gray-200'>
            
//             <Link
//               className='lg:inline-flex lg:w-auto w-full px-4 py-2 rounded text-white items-center justify-center hover:text-green-400'
//               key={item.path}
//               onClick={handleClick}
//               href={item.path}
//             >
//               {item.label}
//             </Link>
//           </div>
//         ))}
//       </nav> */}
//       <main className={`flex justify-center ${isActive ? 'opacity-50' : ''} transition-opacity duration-300 ease-in-out z-20`}>
//         {children}
//       </main>
//     </div>
//   );
// };

