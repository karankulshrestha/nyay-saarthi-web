import React, { useEffect, useRef } from "react";
import { Bot, User } from "lucide-react";
import { Message } from "ai/react";
import { cn } from "@/lib/utils";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ChatGPTMessage } from "@/types";
import { CardDescription, CardFooter } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ReactMarkdown from "react-markdown";
import { sanitizeAndFormatText } from "@/utils/utils";
import axios from "axios";


type Props = {
  messages: ChatGPTMessage[];
};

const ChatBox = ({
  role = "assistant",
  content,
  sources,
}: ChatGPTMessage) => {


  return (
    <div className="flex items-center py-6">
      {role != "assistant" ? (
        <User
          className={cn(
            "bg-pink-700 text-white w-10 h-10 rounded-md mr-1 justify-center p-1"
          )}
        />
      ) : (
        <Bot
          className={cn(
            "bg-green-500 text-white w-10 h-10 rounded-md mr-1 justify-center p-1"
          )}
        />
      )}
      <div
        className={cn(
          "w-[100%] h-fit  border-2 rounded-md p-4 font-sans w-72 md:w-[70%]",
          {
            "bg-gray-300 border-gray-400": role == "assistant",
          },
          { "bg-gray-200 border-gray-300": role != "assistant" }
        )}
      >
        <Markdown
          remarkPlugins={[remarkGfm]}
          components={{
            pre: ({ node, ...props }) => (
              <div className="overflow-auto w-full my-2 bg-black/10 p-2 rounded-lg">
                <pre {...props} />
              </div>
            ),
          }}
        >
          {content}
        </Markdown>
        {sources ? (
          <CardFooter>
            <CardDescription className="w-full">
              {sources ? (
                <Accordion
                  type="single"
                  collapsible
                  className="w-full text-black"
                >
                  {sources.map((source, index) => (
                    <AccordionItem value={`source-${index}`} key={index}>
                      <AccordionTrigger className="text-black">{`Source ${
                        index + 1
                      }`}</AccordionTrigger>
                      <AccordionContent>
                        <ReactMarkdown className="text-black">
                          {sanitizeAndFormatText(source)}
                        </ReactMarkdown>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <></>
              )}
            </CardDescription>
          </CardFooter>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default ChatBox;
