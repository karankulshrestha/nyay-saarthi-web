"use client";
import ChatBox from "./ChatBox";
import { useRef, useState } from "react";
import { scrollToBottom, initialMessage, cn } from "../../utils/utils";
import { ChatGPTMessage } from "@/types";
import { InputMessage } from "./input-message";


type Props = {
  namespace: string;
};

export const ChatComponent = ({namespace}: Props) => {
  const endpoint = "/api/chat-api";
  const [input, setInput] = useState("");
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [messages, setMessages] = useState<ChatGPTMessage[]>(initialMessage);
  const [chatHistory, setChatHistory] = useState<[string, string][]>([]);
  const [streamingAIContent, setStreamingAIContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const updateMessages = (message: ChatGPTMessage) => {
    setMessages((previousMessages) => [...previousMessages, message]);
    setTimeout(() => scrollToBottom(containerRef), 100);
  };

  const updateChatHistory = (question: string, answer: string) => {
    setChatHistory((previousHistory) => [
      ...previousHistory,
      [question, answer],
    ]);
  };

  const handleStreamEnd = (
    question: string,
    streamingAIContent: string,
    sourceDocuments: string
  ) => {
    const sources = JSON.parse(sourceDocuments);

    // Add the streamed message as the AI response
    // And clear the streamingAIContent state
    updateMessages({
      role: "assistant",
      content: streamingAIContent,
      sources,
    });
    updateStreamingAIContent("");
    updateChatHistory(question, streamingAIContent);
  };

  const updateStreamingAIContent = (streamingAIContent: string) => {
    setStreamingAIContent(streamingAIContent);
    setTimeout(() => scrollToBottom(containerRef), 100);
  };

  // send message to API /api/chat endpoint
  const sendQuestion = async (question: string) => {
    setIsLoading(true);
    updateMessages({ role: "user", content: question });

    try {
      
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain",
          "Transfer-Encoding": "chunked"
        },
        body: JSON.stringify({
          question,
          chatHistory,
          namespace:namespace
        }),
      });

      const reader = response?.body?.getReader();
      let streamingAIContent = "";
      let tokensEnded = false;
      let sourceDocuments = "";

      while (true) {
        const { done, value } = (await reader?.read()) || {};

        if (done) {
          break;
        }

        const text = new TextDecoder().decode(value);
        if (text === "tokens-ended" && !tokensEnded) {
          tokensEnded = true;
        } else if (tokensEnded) {
          sourceDocuments = text;
        } else {
          streamingAIContent = streamingAIContent + text;
          updateStreamingAIContent(streamingAIContent);
        }
      }

      handleStreamEnd(question, streamingAIContent, sourceDocuments);
    } catch (error) {
      console.log("Error occured ", error);
    } finally {
      setIsLoading(false);
    }
  };

    let placeholder = "Type a message to start ...";

  if (messages.length > 2) {
    placeholder = "Type to continue your conversation";
  }


  return (
    <>
      <div className="overflow-scroll h-full justify-between" >
        <div className="h-[80%] md:h-[70%] items-center overflow-y-scroll justify-center
         lg:px-44 px-2  md:pl-32 lg:pb-16 pt-4" ref={containerRef}>
          {messages.map(({ content, role, sources }, index) => (
            <ChatBox
              key={index}
              role={role}
              content={content}
              sources={sources}
            />
          ))}
          {streamingAIContent ? (
            <ChatBox role={"assistant"} content={streamingAIContent} />
          ) : (
            <></>
          )}
        </div>
      <InputMessage
        input={input}
        setInput={setInput}
        sendMessage={sendQuestion}
        placeholder={placeholder}
        isLoading={isLoading}
      />
    </div>
    </>
  );
};
