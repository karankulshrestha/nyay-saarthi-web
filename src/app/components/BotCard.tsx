"use client"
import React from "react";
import { useRouter } from "next/navigation";

interface Props {
  namespace: string;
  specialization:string;
  description:string;
  emoji:string;
  tags:string[];
};

export const BotCard = ({
  namespace,
  specialization,
  description,
  emoji,
  tags
}: Props) => {

  const router = useRouter();

  return (
    <div
      className="bg-gray-50 w-80 h-82 rounded-lg border-2 shadow-sm shadow-gray-100 cursor-pointer 
    hover:scale-105 hover:ease-in-out duration-200 flex flex-col justify-start p-4 items-start"
    >
      <span className="text-6xl">{emoji}</span>
      <div className="flex justify-between space-x-6 py-4">
      <h3 className="font-sans p-2 font-semibold">{specialization}</h3>
      <button className="bg-lime-400 px-2 py-1 rounded-lg
       text-sm text-white font-semibold font-sans tracking-wider text-center shadow-md" 
       onClick={() => router.push(`dashboard/chat/${namespace}?name=${specialization}`)}>Consult</button>
      </div>
      <span className="h-10 overflow-hidden h-12">
        <p className="line-clamp-2 text-sm text-gray-400 p-2">
          {description}
        </p>
      </span>
      <div className="flex-wrap p-4 justify-between space-x-2 space-y-2 w-full font-semibold">
        {tags[0] && <button className="bg-purple-500 rounded-xl p-2 text-white shadow-md text-xs tracking-wider ">{tags[0]}</button>}
        {tags[1] && <button className="bg-yellow-500 rounded-xl p-2 text-white shadow-md text-xs tracking-wider">{tags[1]}</button>}
        {tags[2] && <button className="bg-orange-500 rounded-xl p-2 text-white shadow-md text-xs tracking-wider">{tags[2]}</button>}
        {tags[3] && <button className="bg-green-500 rounded-xl p-2 text-white shadow-md text-xs tracking-wider">{tags[3]}</button>}
        {tags[4] && <button className="bg-red-500 rounded-xl p-2 text-white shadow-md text-xs tracking-wider">{tags[4]}</button>}
      </div>
    </div>
  );
};
