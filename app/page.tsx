"use client";
import LiquidEther from '../hooks/liquid-bg';
import Image from 'next/image';

export default function Home() {
  return (
    <div>
      <div className="fixed top-0 left-0 w-screen h-screen flex justify-center items-center">
        <div className='bg-[#e8e8e8]/10 w-[1200px] h-[600px] rounded-[20px] flex p-10 justify-between'>
          <div className='w-[550px] h-full rounded-[20px] flex overflow-hidden relative outline-8 outline-[#f8f8f8]/8'>
            <Image 
              src="https://wallpapers.com/images/hd/yoru-valorant-rau8iuqeaoatkrbw.jpg" 
              alt='amaan'
              fill={true}
              className="object-cover opacity-80 hover:opacity-100"/>
          </div>
          <div className='w-[550px] h-full flex flex-col justify-between'>
              <div className='w-[550px] flex h-[250px] justify-between'>
                <div className='w-[265px] h-[250px] rounded-[20px] flex outline-8 outline-[#f8f8f8]/8 overflow-hidden relative'>
                <Image 
                  src="https://files.bo3.gg/uploads/image/24221/image/webp-3bb0b9fbb4ee015400f42d23bdc203c1.webp" 
                  alt='amaan'
                  fill={true}
                  className="object-cover opacity-80 hover:opacity-100"/>
                </div>
                <div className='w-[265px] h-[250px] rounded-[20px] flex outline-8 outline-[#f8f8f8]/8 overflow-hidden relative'>
                <Image 
                  src="https://img.esportsku.com/wp-content/uploads//2021/01/viper-valorant-pc-games-2020-games-3840x2160-1271-scaled.jpg" 
                  alt='amaan'
                  fill={true}
                  className="object-cover opacity-80 hover:opacity-100"/>                
                </div>
              </div>
              <div className='w-[550px] h-[250px] rounded-[20px] flex outline-8 outline-[#f8f8f8]/8 overflow-hidden relative'>
              <Image 
                src="https://img.goodfon.com/original/3840x2160/6/7c/valorant-riot-riot-games-games-sova-valorant.jpg" 
                alt='amaan'
                fill={true}
                className="object-cover opacity-80 hover:opacity-100"/>
              </div>
          </div>
        </div>
      </div>

      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: -1
      }}>
        <LiquidEther
          colors={[ '#ff0000', '#ff5500', '#ffdd00' ]}
          mouseForce={20}
          cursorSize={100}
          isViscous={false}
          viscous={30}
          iterationsViscous={32}
          iterationsPoisson={32}
          resolution={0.5}
          isBounce={false}
          autoDemo={true}
          autoSpeed={0.5}
          autoIntensity={2.2}
          takeoverDuration={0.25}
          autoResumeDelay={3000}
          autoRampDuration={0.6}
        />

      </div>
    </div>
    
  );
}
