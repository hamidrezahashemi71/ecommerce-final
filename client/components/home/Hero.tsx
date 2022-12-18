import React from "react";
import Image from "next/image";
import PillCard from "./PillCard";
import {pillsProps} from "../../lib/staticData";

const Hero = () => {
  return (
    <>
      <div className='h-screen bg-black '>
        <Image
          fill
          src={"/assets/site_images/hero.png"}
          alt='hero'
          className=' opacity-70 object-top'
        />
        <div className='h-screen px-72 lg:px-9 absolute flex flex-col justify-center items-start gap-16 w-full'>
          <h1 className='md:text-4xl text-6xl font-bold text-white w-[30%]'>
            Sale of the summer collection
          </h1>
          <div className='flex items-center gap-6 cursor-pointer'>
            <Image
              src={"/assets/icons/arrow-circle.png"}
              alt='arrow-circle'
              width={39}
              height={39}
            />
            <p className='text-white'>SHOP NOW</p>
          </div>
        </div>
        <div className='lg:hidden absolute flex justify-center items-center gap-24 bottom-0 w-[85%] h-[15%] bg-white rounded-tr-full'>
          {pillsProps.map((pill) => (
            <PillCard
              key={pill.id}
              icon={pill.icon}
              title={pill.title}
              desc={pill.desc}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Hero;
