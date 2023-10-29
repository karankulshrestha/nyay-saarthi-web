"use client";
import Image from "next/image";
import logo from "../assets/logo.png";
import women from "../assets/women.json";
import Lottie from "lottie-react";
import law from "../assets/law_logo.png";
import digital from "../assets/digital-India.png";
import { useState } from "react";
import SignupForm from "./components/SignupForm";
import LoginForm from "./components/LoginForm";
import { useSession, getSession } from "next-auth/react";
import { redirect } from "next/navigation";

type Props = {};

export default function AuthPage({}: Props) {
  const [signup, setIsSignup] = useState(true);

  const {data:session, status } = useSession()

  if(status == "loading") {
    return <p>loading</p>
  }

  if(session) {
    redirect('/dashboard');
  }


  return (
    <main className="flex max-h-screen lg:overflow-hidden h-screen items-center justify-center">
      <div className="flex flex-col w-full lg:w-[800px] justify-center items-center mt-5 lg:m-10 pl-4 pr-4 lg:pl-28 max-h-screen">
        <Image src={logo} alt="logo" width={150} height={80} className="mt-6" />

        <div className="max-w-screen w-full rounded shadow-lg p-16 lg:p-10 items-center justify-center font-sans">
          {signup == true ? <LoginForm /> : <SignupForm />}
          <div className="w-full overflow-hidden items-center justify-center">
            <p className="mt-6 font-sans lg:w-80">
              If you do not have account
              <span
                className="ml-2 text-green-500 font-semibold hover:cursor-pointer"
                onClick={() => setIsSignup(!signup)}
              >
                {signup == false ? "login" : "signup"}
              </span>
            </p>
          </div>
        </div>
      </div>
      <div className="bg-gray-100 w-screen h-screen ml-10 hidden lg:flex flex-col items-center max-h-full ">
        <Lottie
          animationData={women}
          width={10}
          height={100}
          className="ml-10 w-[700px]"
        />
        <div className="flex w-full justify-evenly mt-20">
          <Image
            src={law}
            alt="law"
            width={280}
            height={40}
            objectFit="cover"
          />
          <Image
            src={digital}
            alt="law"
            width={180}
            height={40}
            objectFit="cover"
          />
        </div>
      </div>
    </main>
  );
}
