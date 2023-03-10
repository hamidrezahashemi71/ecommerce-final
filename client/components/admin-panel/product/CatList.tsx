import { CatListProps } from "../../../lib/interfaces";
import {BsCheck} from "react-icons/bs/index";

const CatList = ({cat, i, thisCategory, onCategorySelect}: CatListProps) => {
  return (
    <div key={cat._id} className='flex gap-3 justify-between px-4'>
      <li className='flex gap-2 items-center mb-3'>
        <p className={`${cat._id === thisCategory._id ? 'font-semibold ' : 'font-light'}`}>{cat.name}</p>
        <div className={` w-4 h-4 cursor-pointer rounded-md p-[1.5px]`}><BsCheck fill='white' size='14px' /></div>
      </li>
      <div
        className={` w-5 h-5 cursor-pointer rounded-md p-[1.5px] ${cat._id === thisCategory._id ? "bg-gray-700" : "bg-white border-2 border-gray-200"}`}
        onClick={() => onCategorySelect(i)} >
        {cat._id === thisCategory._id&& (<BsCheck fill='white' size='18px' />)}
      </div>
    </div>
  )
}

export default CatList