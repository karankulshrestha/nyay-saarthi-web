"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import google from "../../assets/google.svg";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { useMutation } from "@tanstack/react-query";
import { postUser } from "../hooks/auth";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";
import { useState } from "react";

const loginSchema = z.object({
  email: z
    .string()
    .min(2, {
      message: "Input must be a valid email address",
    })
    .email(),
  password: z.string().min(5, {
    message: "Password must be at least 5 characters.",
  }),
  repassword: z.string().min(5, {
    message: "Password must be at least 5 characters.",
  }),
});

export default function SignupForm() {

  const [isloading, setIsLoading] = useState(false);


  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      repassword: "",
    },
  });

  const { mutate, error } = useMutation(postUser, {
    onSuccess: (data) => {
      console.log(data, "info");
      if(data.status == 200) {
        toast.dismiss();
        setIsLoading(false);
        toast.success("registered successfully");
        
      } else if(data.status == 403) {
        toast.error("already registered");
      } else {
        toast.error("internal server error");
      }
    },
  });

  function onSubmit(values: z.infer<typeof loginSchema>) {

    if(values.password != values.repassword) {
      return toast.error("password must be equal");
    }

    mutate({
      email: values.email,
      password: values.password
    });

    console.log(values);
    setIsLoading(true);
    toast.loading("Waiting...");
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="repassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Re-enter Password</FormLabel>
                <FormControl>
                  <Input placeholder="re-enter password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isloading} className="bg-green-500 hover:bg-green-400">
            Signup
          </Button>
        </form>
      </Form>
      <div onClick={() => !isloading && signIn("google")}
        className="max-w-xs justify-center items-center mt-8 bg-black 
      hover:bg-black p-3 rounded-md flex text-white text-sm 
      md:font-semibold items-center justify-evenly hover:cursor-pointer"
      >
        <Image src={google} alt="" width={20} height={20} />
        <button>Continue with Google</button>
      </div>
    </div>
  );
}
