'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z  from "zod"
import { useDebounceCallback } from 'usehooks-ts';
import React, { useEffect, useState } from 'react'
import Link from "next/link";
import { toast } from "sonner"
import { useRouter } from "next/navigation";
import { singUpSchema } from "@/schema/signUpSchema";
import axios, { AxiosError } from 'axios';
import { ApiResponse } from "@/types/apiResponse";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader } from 'lucide-react';


const Page = () => {

  const [userName, setUserName] = useState("");
  const [userNameMessage, setUserNameMessage] = useState("");
  const [isCheckingUserName, setIsCheckingUserName] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debounced = useDebounceCallback(setUserName, 300);
  const router = useRouter();

  const form = useForm<z.infer<typeof singUpSchema>>({
    resolver: zodResolver(singUpSchema),
    defaultValues: {
      userName: '',
      email: '',
      password: ''
    }
  })

  useEffect(() => {
    const checkUserNameUnique = async () => {
      if(userName){
        setIsCheckingUserName(true)
        setUserNameMessage('')
        try {
          const response = await axios.get(`/api/check-username-unique?userName=${userName}`);
          setUserNameMessage(response.data.message)
        } 
        catch (error) {
          const axiosError = error as AxiosError<ApiResponse>
          setUserNameMessage(axiosError.response?.data.message ?? "Error checking username")
        }
        finally{
          setIsCheckingUserName(false)
        }
      }
    }
    checkUserNameUnique();
  }, [userName]);

  if(false){ //todo: Remove as it is just to get rid of error 
    console.log(userNameMessage, isCheckingUserName);
  }

  const onSubmit = async (data: z.infer<typeof singUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>('/api/sign-up', data)
      toast(response.data.message);
      router.replace(`/verify/${userName}`);
    } 
    catch (error) {
      console.error('Error during sign-up:', error);
      const axiosError = error as AxiosError<ApiResponse>;

      const errorMessage = axiosError.response?.data.message || "SingUp Failed, Try Again later";
      toast(errorMessage);
    }
    finally{
      setIsSubmitting(false)
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
              name="userName"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="UserName" 
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        debounced(e.target.value);
                      }}
                    />
                  </FormControl>
                  {isCheckingUserName && <Loader className="animate-spin" />}
                  {!isCheckingUserName && userNameMessage && (
                    <p
                      className={`text-sm ${
                        userNameMessage === 'UserName is aviable'
                          ? 'text-green-500'
                          : 'text-red-500'
                      }`}
                    >
                      {userNameMessage}
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

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

            <Button type="submit" disabled={isSubmitting} >
              {
                isSubmitting ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin"/> Please wait
                  </>
                ) : ('Sign  Up')
              }
            </Button>

          </form>
        </Form>

        <div className="text-center mt-4">
          <p>
            Already a member?{' '}
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
              Sign In
            </Link>
          </p>
        </div>

      </div>
    </div>
  )
}

export default Page