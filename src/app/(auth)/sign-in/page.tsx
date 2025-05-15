'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z  from "zod"
import React, { useState } from 'react'
import Link from "next/link";
import { toast } from "sonner"
import { useRouter } from "next/navigation";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader } from 'lucide-react';
import { signInSchema } from "@/schema/signInSchema";
import { signIn } from "next-auth/react"


const Page = () => {

  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);
    const result = await signIn('credentials', {
      redirect: false,
      email: data.email,
      password: data.password
    })
    if(result?.error){
      toast("Incorrect username or password");
      setIsSubmitting(false);
    }
    if(result?.url){
      setIsSubmitting(false);
      router.replace('/dashboard');
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Welcome Back to True Feedback
          </h1>
          <p className="mb-4">Sign in to continue your secret conversations</p>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" 
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Password" 
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting} className="px-6 py-2 rounded-xl shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg">
              {
                isSubmitting ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin"/> Please wait
                  </>
                ) : ('Sign In')
              }
            </Button>

          </form>
        </Form>

        <div className="text-center mt-4">
          <p>
            Not a member yet?{' '}
            <Link href="/sign-up" className="bg-transparent p-0 m-0 border-0 text-blue-600 cursor-pointer hover:underline focus:outline-none hover:tracking-wide transition-all ease-in-out duration-300 hover:text-blue-800">
              Sign Up
            </Link>
          </p>
        </div>

      </div>
    </div>
  )
}

export default Page