import React, {useState} from "react";
import GuideLink from "../components/main/GuideLink";
import {useRouter} from "next/router";
import ShoppingCart from "../components/cart/ShoppingCart";
import Checkout from "../components/cart/Checkout";
import {AiOutlineShoppingCart} from "react-icons/ai";
import {MdOutlineLocalShipping, MdPayment} from "react-icons/md";
import Summary from "../components/cart/Summary";

const Cart = () => {
  const {asPath} = useRouter();
  const [checkoutStep, setCheckoutStep] = useState("shoppingcart");
  return (
    <div>
      <GuideLink
        args={[
          {
            name: "Cart",
            href: {
              pathname: "/cart",
            },
          },
        ]}
      />
      <div className='main-container flex-col'>
        <div className='flex sm:flex-col justify-between items-center sm:justify-center mb-16 sm:mb-10'>
          <p className='text-xl font-semibold'>
            {checkoutStep === "shoppingcart"
              ? "Shopping Cart"
              : checkoutStep === "checkout"
              ? "Address data and types of delivery"
              : "Summary"}
          </p>
          <div className='flex items-center gap-4'>
            <div
              className={`${
                checkoutStep === "shoppingcart"
                  ? "flex items-center justify-center w-9 h-9 bg-primary rounded-full text-white cursor-pointer"
                  : "flex items-center justify-center text-grayish  w-9 h-9 cursor-pointer"
              }`}>
              <AiOutlineShoppingCart
                onClick={() => setCheckoutStep("shoppingcart")}
              />
            </div>
            <div className='w-16 h-[1px] bg-grayborder'></div>
            <div
              className={`${
                checkoutStep === "checkout"
                  ? "flex items-center justify-center w-9 h-9 bg-primary rounded-full text-white cursor-pointer"
                  : "flex items-center justify-center text-grayish  w-9 h-9 cursor-pointer"
              }`}>
              <MdOutlineLocalShipping
                onClick={() => setCheckoutStep("checkout")}
              />
            </div>
            <div className='w-16 h-[1px] bg-grayborder'></div>
            <div
              className={`${
                checkoutStep === "summary"
                  ? "flex items-center justify-center w-9 h-9 bg-primary rounded-full text-white cursor-pointer"
                  : "flex items-center justify-center text-grayish  w-9 h-9 cursor-pointer"
              }`}>
              <MdPayment onClick={() => setCheckoutStep("summary")} />
            </div>
          </div>
        </div>
        {checkoutStep === "shoppingcart" ? (
          <ShoppingCart />
        ) : checkoutStep === "checkout" ? (
          <Checkout />
        ) : (
          <Summary />
        )}
      </div>
    </div>
  );
};

export default Cart;