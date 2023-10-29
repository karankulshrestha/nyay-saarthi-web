"use client";
import React, { useState } from "react";
import { signOut } from "next-auth/react";
import { BrainCog } from "lucide-react";
import { BadgePlus } from "lucide-react";
import { UserSquare2 } from "lucide-react";
import { Scale } from "lucide-react";
import { LogOut } from "lucide-react";
import { X } from "lucide-react";
import { clsx } from "clsx";
import { redirect, useRouter } from "next/navigation";

interface Props {
  path: string;
}

const Sidebar = ({ path }: Props) => {
  const [isclose, setIsClose] = useState(false);
  const router = useRouter();

  return (
    <div
      className={clsx(
        "sidebar top-0 bottom-0 lg:left-0 p-2 w-[300px] overflow-y-auto text-center bg-gray-900 ease-in-out transition-all duration-300 ",
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
            path === "/dashboard" && "bg-blue-600",
            path.startsWith("/chat") && "bg-blue-600"
          )}
          onClick={() => router.replace("/dashboard")}
        >
          <BrainCog />
          <span className="text-[15px] ml-4">AI Legal Bots</span>
        </div>
        <div
          className={clsx(
            "p-2.5 mt-5 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600 text-white",
            path === "/dashboard/add-legal-bot" && "bg-blue-600"
          )}
          onClick={() => router.replace("/dashboard/add-legal-bot")}
        >
          <BadgePlus />
          <span className="text-[15px] ml-4">Add a LegalBot</span>
        </div>
        <div
          className={clsx(
            "p-2.5 mt-5 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600 text-white",
            path === "/dashboard/advocate" && "bg-blue-600"
          )}
          onClick={() => router.replace("/dashboard/advocate")}
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
  );
};

export default Sidebar;
