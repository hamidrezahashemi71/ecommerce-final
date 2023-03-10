import { ProductCards } from "../../lib/interfaces";
import Image from "next/image";
import Link from "next/link";

const ProductCard = ({_id, images, title, price}: ProductCards) => {
  return ( 
      <div className='flex flex-col justify-start items-start w-full shadow-md rounded-2xl overflow-hidden'>
        <Link style={{width: '100%'}} href={{pathname: "/product/[_id]", query: {_id}}}>
          <div className='relative h-[385px] w-full bg-black'>
            <Image
              className='absolute object-cover object-top'
              src={`${process.env.SERVER}/${images[0]}`}
              alt={title}
              fill
            />
          </div>
        </Link> 
        <div className="px-4">
          <Link href={{pathname: "/product/[_id]", query: {_id}}}>
            <p className='mt-7 md:mt-2 text-lg mb-2 hover:text-primary'>{title}</p>
          </Link>
          <div className='flex justify-start items-center gap-9'>
            <p className='font-semibold'>${price}</p>
          </div>
        </div>
        <Link style={{ width: '100%', padding: "16px", margin: "10px 0" }}
          href={{pathname: "/product/[_id]", query: {_id}}}>
          <button className="opacity-100 btn-secondary font-semibold py-3 w-full">View Product</button>
        </Link>
      </div>
  );
};

export default ProductCard;
