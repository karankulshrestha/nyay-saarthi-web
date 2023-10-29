"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { redirect, usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { BrainCog, Flag } from "lucide-react";
import { BadgePlus } from "lucide-react";
import { UserSquare2 } from "lucide-react";
import { Scale } from "lucide-react";
import { LogOut } from "lucide-react";
import { Menu } from "lucide-react";
import { X } from "lucide-react";
import { clsx } from "clsx";
import Sidebar from "../../components/Sidebar";
import { ChangeEvent } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { useDetectClickOutside } from "react-detect-click-outside";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import validator from "validator";

type Props = {};

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  bio: z.string().min(10, {
    message: "write sufficient bio",
  }),
  phoneNumber: z.string().refine(validator.isMobilePhone, {
    message: "write correct phone number",
  }),
  email: z.string().refine(validator.isEmail, {
    message: "write correct email",
  }),
});

function AdvocatePage({}: Props) {
  const { data: session, status } = useSession();
  const pathName = usePathname();
  const router = useRouter();

  console.log(pathName);

  console.log(session, "info_google");

  const [isclose, setIsClose] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [isSelect, setIsSelect] = useState(false);
  const [file, setFile] = useState<File>();
  const [selectedEmoji, setSelectedEmoji] = useState<string>("");
  const [added, setAdded] = useState([]);

  if (!session) {
    redirect("/");
  }

  console.log(session.user?.email);

  const onFileUploadChange = (e: ChangeEvent<HTMLInputElement>) => {
    const fileInput = e.target;

    if (!fileInput.files) {
      toast.error("No file was chosen");
      return;
    }

    if (!fileInput.files || fileInput.files.length === 0) {
      toast.error("Files list is empty");
      return;
    }

    const currfile = fileInput.files[0];

    /** File validation */
    if (currfile.type !== "image/png" && currfile.type !== "image/jpeg") {
      toast.error("Please select a image");
      return;
    }

    setFile(currfile);

    console.log(URL.createObjectURL(currfile));
  };

  const ref = useDetectClickOutside({
    onTriggered: () => {
      setIsSelect(false);
    },
  });

  // form defination
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      bio: "",
      phoneNumber: "",
      email: "",
    },
  });

  // form handler
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    toast.loading("loading...");

    const email = session!.user!.email;

    if (
      !email ||
      !file ||
      !values.name ||
      !values.bio ||
      !values.phoneNumber ||
      !values.email
    ) {
      toast.dismiss();
      toast.error("please submit all values");
      return;
    }

    try {
      var data = new FormData();
      data.set("file", file!);
      data.set("name", values.name);
      data.set("bio", values.bio);
      data.set("email", values.email);
      data.set("phone", values.phoneNumber);

      const res = await fetch("/api/advocate", {
        method: "POST",
        body: data,
      });

      if (!res.ok) {
        setLoading(false);
        toast.error("something went wrong");
        toast.dismiss();
      }

      if (res.status === 200) {
        setLoading(false);
        toast.dismiss();
        toast.success("Profile Added");
        setSelectedEmoji("");
        setFile(undefined);
        setAdded([]);
        form.reset({
          name: "",
          bio: "",
          email: "",
          phoneNumber: "",
        });
      }

      console.log(res.json());
    } catch (error: any) {
      setLoading(false);
      toast.dismiss();
      toast.error(error);
      console.log(error);
    }
  }



  return (
    <div className="bg-white h-screen w-full overflow-hidden relative flex">
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
            onClick={() => router.replace("/dashboard")}
          >
            <BrainCog />
            <span className="text-[15px] ml-4">AI Legal Bots</span>
          </div>
          <div
            className={clsx(
              "p-2.5 mt-5 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600 text-white",
              pathName === "/dashboard/add-legal-bot" && "bg-blue-600"
            )}
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

      <div className="w-full basis-[205%] flex-col overflow-y-auto scrollbar-hide max-h-screen w-full">
        {/* navbar starts */}
        <div className="flex items-center justify-between md:justify-start lg:justify-center bg-white h-20 shadow-md">
          <span className="m-4 lg:hidden" onClick={() => setIsClose(false)}>
            <Menu size={40} />
          </span>

          <h1 className="font-sans font-bold text-green-500 text-lg hidden lg:flex mr-4">
            Made with ❤️ Team DelhiBots
          </h1>

          <h1 className="font-sans font-bold text-blue-600 text-lg hidden lg:flex">
            |
          </h1>

          <h1 className="font-sans font-bold text-orange-600 text-lg lg:ml-4 mr-20 md:ml-52">
            Add AI Legal Bot 🤖
          </h1>
        </div>
        {/* navbar ends */}

        {/* file uploading widget */}

        <div className="flex items-center justify-center px-5 lg:px-20 pt-5">
          <label
            htmlFor="dropzone-file"
            className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-500 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              {file ? (
                <p>{file?.name + " added"}</p>
              ) : (
                <>
                  <UserSquare2 className="text-gray-700 w-24 h-44 pb-4" />
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Profile Picture (MAX. 20mb)
                  </p>
                </>
              )}
            </div>
            <input
              id="dropzone-file"
              type="file"
              className="hidden"
              onChange={onFileUploadChange}
            />
          </label>
        </div>

        {/* File uploading wiget ends */}

        {/* form start */}

        <div className="lg:px-20 my-4 px-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name of the Advocate</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Give name to your Advocate"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Short Bio max (50 words)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Write description for your bot."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Phone Number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email Address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isLoading}>
                Register
              </Button>
            </form>
          </Form>
        </div>

        {/* form finish */}
      </div>
    </div>
  );
}

export default AdvocatePage;
