import {Pill} from "../../lib/interfaces";
import React from "react";

const PillCard = (props: Pill) => {
  return (
    <div className='md:hidden w-full flex justify-start gap-5 xl:gap-2 lg:gap-0'>
      <div className='w-10 h-10 rounded-lg bg-secondary flex justify-center items-center'>
        {props.icon}
      </div>
      <div className='w-[160px] flex flex-col justify-start gap-3'>
        <p className='font-semibold text-sm'>{props.title}</p>
        <p className='text-xs text-grayish'>{props.desc}</p>
      </div>
    </div>
  );
};

export default PillCard;
