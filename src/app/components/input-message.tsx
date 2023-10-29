import { Button } from "@/components/ui/button";
import { Bot, SendHorizontal } from "lucide-react";
// import { Spinner } from "@/components/ui/spinner";

type InputMessageProps = {
  input: string;
  setInput: (value: string) => void;
  sendMessage: (value: string) => void;
  placeholder: string;
  isLoading: boolean;
};

export function InputMessage({
  input,
  setInput,
  sendMessage,
  placeholder,
  isLoading,
}: InputMessageProps) {
  return (
    <div className="fixed bottom-0 w-[100%] justify-stretch lg:w-[81%] lg:px-32 bg-gray-200 md:pt-14">
      <div
        className="flex
        items-center outline-none border-2
         border-gray-200 p-3 lg:rounded-md md:pb-12"
      >
        <Bot className="mr-5 text-gray-500" />
        <input
          type="text"
          className="h-full border-none outline-none w-full p-4 rounded-md mr-2"
          placeholder={placeholder}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
          }}
          onKeyDown={async (e) => {
            if (e.key === "Enter") {
              sendMessage(input);
              setInput("");
            }
          }}
        />
        <Button
          className="bg-green-500"
          onClick={() => {
            sendMessage(input);
            setInput("");
          }}
        >
          <SendHorizontal />
        </Button>
      </div>
    </div>
  );
}
