"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import google from "../../assets/google.svg"
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
import { signIn } from "next-auth/react";
import { redirect } from "next/navigation";
import toast from 'react-hot-toast';
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
});

export default function LoginForm() {

  const [isloading, setisloading] = useState(false);


  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    console.log(values);
    setisloading(true);
    toast.loading("waiting...");
    try {
      const res = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if(res?.error) {
        toast.dismiss();
        setisloading(false);
        return toast.error("credentials are wrong");
      }

      console.log(res);

      if(res != null) {
        toast.dismiss();
        setisloading(false);
        redirect('/dashboard');
      }
      

    } catch (e:any) {
      toast.dismiss();
      setisloading(false);
      console.log(e.message);
    }
  }


  return (
    <div >
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
          <Button type="submit" className="bg-green-500 hover:bg-green-400" disabled={isloading}>
          Login
          </Button>
        </form>
      </Form>
      <div onClick={() => !isloading && signIn("google")}
      className="max-w-xs justify-center items-center mt-8 bg-black 
      hover:bg-black p-3 rounded-md flex text-white text-sm 
      md:font-semibold items-center justify-evenly hover:cursor-pointer">
        <Image src={google} alt="" width={20} height={20}/>
        <button>Continue with Google</button>
      </div>
    </div>
  );
}
