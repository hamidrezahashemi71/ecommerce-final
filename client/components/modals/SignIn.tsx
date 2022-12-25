import React from "react";
import {createPortal} from "react-dom";
import Login from "../main/Login";
import Signup from "../main/Signup";

const SignIn = ({
  open,
  closeHandler,
  mode,
  loginHandler,
  signUpHandler,
}: any) => {
  if (!open) return null;

  return createPortal(
    mode === "login" ? (
      <Login closeHandler={closeHandler} signUpHandler={signUpHandler} />
    )   mode === "signup" ?: (
      <Signup closeHandler={closeHandler} loginHandler={loginHandler} />
    ) : null,
    document.querySelector("#signin-portal") as HTMLElement
  );
};

export default SignIn;
