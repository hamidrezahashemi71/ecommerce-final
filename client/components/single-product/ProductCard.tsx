import React, {useState} from "react";
import Image from "next/image";
import ColorCard from "./ColorCard";
import {AiOutlinePlus, AiOutlineMinus, AiOutlineHeart} from "react-icons/ai";
import { CartBody, Product } from "../../lib/interfaces";
import { useMutation, useQuery } from "@tanstack/react-query";
import { addToCart, myCart } from "../../apis";
import { useSelector } from "react-redux";
import { selectUser } from "../../global-state/slice";

const ProductCard = ({ product }: { product: Product }) => {

  const thisUser = useSelector(selectUser);
  
  const [singleProductData, setSingleProductData] = useState({
    selectedImg: 0,
    selectedColor: product.variables.Color[0],
    selectedSize: product.variables.Size[0],
  });
  
  const [quantity, setQuantity] = useState(1)

  const { data } = useQuery({
    queryFn: async () => await myCart(),
    onSuccess: (res) => console.log(res)
  })

  const addCart = useMutation({
    mutationFn: async (body: CartBody) => await addToCart(body),
    onSuccess: (res) => console.log(res),
    onError: (res) => console.log(res)
  })

  const onSubmit = () => {
    addCart.mutate({
      productId: product?._id,
      userId: thisUser?._id
    })
  }

console.log("PRODUCT",product)
console.log("THIS USER",thisUser)
  return (
    <div className='grid grid-cols-2 md:grid-cols-1 gap-40 md:gap-8'>
      <div>
        <Image
          src={`${process.env.SERVER}/${product.images[singleProductData.selectedImg]}`}
          alt='product-img'
          width={505}
          height={505}
          className='object-cover aspect-square object-top mb-2'
        />
        <div className='grid grid-cols-4 w-full gap-2'>
          {product.images.map((img, i) => (
            <Image
              onClick={() => setSingleProductData({...singleProductData, selectedImg: i})}
              src={`${process.env.SERVER}/${img}`}
              alt='product-img'
              width={120}
              height={120}
              className='object-cover aspect-square object-top cursor-pointer'
            />
          ))}
        </div>
      </div>
      <div>
        <div className='relative flex flex-col w-full'>
          <p className='mt-4 text-3xl font-light md:text-lg'>
            {product.title}
          </p>
          <div className='flex justify-start items-center gap-6 text-3xl md:text-lg'>
            <p className=' text-grayish '>${product.price}</p>
          </div>
          <div className='w-full border-[1px] border-grayborder p-6 mt-8'>
            <p className='font-semibold text-sm mb-6'>COLOR</p>
            <div className='flex flex-col gap-5'>
              <div className='flex justify-center gap-3 items-center'>
                {product.variables.Color.map((color: string) => (
                  <ColorCard
                    color={color}
                    handleSelect={(selectedColor:string) => setSingleProductData({ ...singleProductData, selectedColor })}
                    selectedColor={singleProductData.selectedColor}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className='flex flex-col justify-start mt-8 text-sm font-light'>
            <div className='w-full border-[1px] border-grayborder p-6'>
              <p className='font-semibold text-sm mb-6'>SIZE</p>
              <div className='flex flex-col gap-5'>
                <div className='flex justify-center items-center overflow-y-auto'>
                  {product.variables.Size.map((size) => (
                    <div
                      className={`w-10 h-10 flex flex-col items-center justify-center cursor-pointer
                    ${
                      singleProductData.selectedSize === size
                        ? "bg-black text-white"
                        : "bg-white border-[1px] border-grayborder"
                    }`}
                      onClick={() => setSingleProductData({...singleProductData, selectedSize:size})}>
                      <p>{size}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className='flex flex-col justify-start mt-8 text-sm font-light'>
              <p className=' mb-2'>Quantity:</p>
              <div className='flex justify-start items-center gap-4 w-full'>
                <div className='flex justify-between items-center px-7 md:px-2 py-3 w-32 md:w-20 h-12 border-[1px] border-grayish rounded-full'>
                  <AiOutlineMinus
                    cursor={"pointer"}
                    onClick={() => setQuantity((prev) => prev === 1 ? 1 : prev - 1)}
                  />
                  <p className='font-bold'>{quantity}</p>
                  <AiOutlinePlus
                    cursor={"pointer"}
                    onClick={() => setQuantity((prev) => prev === product.quantity? product.quantity : prev + 1)}
                  />
                </div>
                {product.isAvalible ? (
                  <button onClick={onSubmit} className='btn-secondary border-[1px] py-3 border-grayish hover:border-primary md:px-2 xs:text-[10px]'>
                    Add to cart
                  </button>
                ) : (
                  <button disabled className='text-reddish font-semibold'>
                    Out of stock
                  </button>
                )}
                <div className='flex justify-center items-center border-[1px] border-grayish w-12 h-12 rounded-full cursor-pointer bg-white hover:bg-reddish hover:text-white hover:scale-110 transition-all'>
                  <AiOutlineHeart size={18} />
                </div>
              </div>
                {quantity === product.quantity && <p className="text-xs ml-4 text-reddish">Only { quantity } left in stock!</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
