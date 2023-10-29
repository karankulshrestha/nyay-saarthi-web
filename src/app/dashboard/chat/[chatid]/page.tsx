"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import {
  redirect,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { signOut } from "next-auth/react";
import { BrainCog } from "lucide-react";
import { BadgePlus } from "lucide-react";
import { UserSquare2 } from "lucide-react";
import { Scale } from "lucide-react";
import { LogOut } from "lucide-react";
import { Menu } from "lucide-react";
import { X } from "lucide-react";
import { clsx } from "clsx";
import Sidebar from "../../../components/Sidebar";
import { ChatComponent } from "@/app/components/ChatComponent";

type Props = {
  params: {
    chatid: any;
  };
};

export default function ChatPage({ params: { chatid } }: Props) {
  const { data: session, status } = useSession();
  const pathName = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const name = searchParams.get("name");

  console.log(pathName);

  console.log(session, "info_google");

  if (!session) {
    redirect("/");
  }

  const [isclose, setIsClose] = useState(false);

  return (
    <div className="bg-white h-screen w-full overflow-hidden flex">
      <div className="hidden lg:flex basis-[25%]">
        <Sidebar path={pathName} />
      </div>
      <div
        className={clsx(
          "sidebar fixed top-0 bottom-0 lg:left-0 p-2 w-[300px] overflow-auto text-center bg-gray-900 ease-in-out transition-all duration-300 z-30 lg:hidden shrink",
          isclose && "-translate-x-full"
        )}
      >
        <div className="text-gray-300 text-xl">
          <div className="p-2.5 mt-4 flex items-center justify-start">
            <span className=" bg-blue-600 p-2 rounded-md">
              <Scale />
            </span>
            <h1 className="font-bold text-gray-200 text-[25px] ml-3">
              <span className="text-orange-600">Nyay</span>{" "}
              <span className="text-green-500">Saarthi</span>
            </h1>
            <span
              className="lg:hidden ml-8 mb-10 bg-blue-600 rounded-md"
              onClick={() => setIsClose(true)}
            >
              <X />
            </span>
          </div>
          <hr className="mt-6 text-gray-600" />
        </div>
        <div className="mt-30 pt-12 pb-12">
          <div
            className={clsx(
              "p-2.5 mt-5 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600 text-white",
              pathName === "/dashboard" && "bg-blue-600"
            )}
            onClick={() => redirect("/dashboard")}
          >
            <BrainCog />
            <span className="text-[15px] ml-4">AI Legal Bots</span>
          </div>
          <div
            className="p-2.5 mt-5 flex items-center rounded-md px-4 
          duration-300 cursor-pointer hover:bg-blue-600 text-white"
            onClick={() => router.replace("/dashboard/add-legal-bot")}
          >
            <BadgePlus />
            <span className="text-[15px] ml-4">Add a LegalBot</span>
          </div>
          <div
            className="p-2.5 mt-5 flex items-center rounded-md px-4 
          duration-300 cursor-pointer hover:bg-blue-600 text-white"
          >
            <UserSquare2 />
            <span className="text-[15px] ml-4">Add Advocate</span>
          </div>
        </div>
        <hr className="my-2 text-gray-600" />
        <div
          onClick={() => signOut()}
          className="p-2.5 mt-8 flex items-center rounded-md px-4 
          duration-300 cursor-pointer hover:bg-blue-600 text-white"
        >
          <LogOut />
          <span className="text-[15px] ml-4">Logout</span>
        </div>
      </div>

      <div className="basis-[205%] flex-col">
        {/* navbar starts */}
        <div className="flex items-center justify-between lg:justify-around bg-white h-20 shadow-md">
          <span className="m-4 lg:hidden" onClick={() => setIsClose(false)}>
            <Menu size={40} />
          </span>

          <h1 className="font-sans font-bold text-green-500 text-lg hidden lg:flex">
            Made with ❤️ Team DelhiBots
          </h1>

          {/* search input */}
          <div
            className="p-2 border-gray-200 flex items-center
               lg:justify-around border-2 bg-green-500 rounded-md mr-36 md:mr-96"
          >
            <h3 className="font-sans text-white font-bold text-sm lg:text-lg">
              {name}
            </h3>
          </div>
        </div>
        {/* navbar ends */}

        <div className="h-full lg:overflow-y-scroll fixed w-full">
          <ChatComponent namespace={chatid} />
        </div>
      </div>
    </div>
  );
}
