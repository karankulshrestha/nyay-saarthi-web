"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { redirect, usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { BrainCog } from "lucide-react";
import { BadgePlus } from "lucide-react";
import { UserSquare2 } from "lucide-react";
import { Scale } from "lucide-react";
import { Search } from "lucide-react";
import { LogOut } from "lucide-react";
import { Menu } from "lucide-react";
import { X } from "lucide-react";
import { clsx } from "clsx";
import Sidebar from "../components/Sidebar";
import { BotCard } from "../components/BotCard";

type Props = {};

function DashboardPage({}: Props) {
  const { data: session, status } = useSession();
  const pathName = usePathname();
  const router = useRouter();

  console.log(pathName);

  console.log(session, "info_google");

  if (!session) {
    redirect("/");
  }

  const [isclose, setIsClose] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/api/models")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
      });
  }, []);

  console.log(data);

  return (
    <div className="bg-white h-screen w-full overflow-hidden flex">
      <div className="hidden lg:flex basis-[25%]">
        <Sidebar path={pathName} />
      </div>
      <div
        className={clsx(
          "sidebar fixed top-0 bottom-0 lg:left-0 p-2 w-[300px] overflow-y-auto text-center bg-gray-900 ease-in-out transition-all duration-300 z-30 lg:hidden shrink",
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

      <div className="w-full basis-[205%] flex-col">
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
            className="p-3 rounded-md shadow-md outline-none w-3/4
        lg:w-2/4 border-2 border-gray-200 flex items-center lg:justify-around mr-4"
          >
            <Search className="mr-5 text-gray-500" />
            <input
              type="text"
              className="w-full h-full border-none outline-none"
              placeholder="Search AI Legal Bots"
            />
            <div
              className="absolute inset-y-0 left-0 pl-3 
                    flex items-center 
                    pointer-events-none"
            >
              <i className="fas fa-envelope text-gray-400"></i>
            </div>
          </div>
        </div>
        {/* navbar ends */}

        <div
          className="overflow-y-auto scrollbar-hide max-h-screen w-full grid grid-cols-1 px-2 
        md:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-0 pb-56 pt-10 place-items-center justify-evenly items-center"
        >
          {data.map((item, index) => {
            return (
              <BotCard
                namespace={item.namespace}
                specialization={item.name}
                description={item.description}
                emoji={item.icon}
                key={item.description}
                tags={item.tags}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
