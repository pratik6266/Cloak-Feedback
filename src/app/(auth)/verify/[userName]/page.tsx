'use client'

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { verifySchema } from '@/schema/verifySchema';
import { ApiResponse } from '@/types/apiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useParams, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { toast } from "sonner"
import * as z from 'zod';
import { Loader } from 'lucide-react';

const Page = () => {
  const router = useRouter();
  const params = useParams<{userName: string}>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues:{
      code: ''
    }
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    setIsSubmitting(true)
    try {
      const response = await axios.post(`/api/verify-code/`, {
        userName: params.userName,
        code: data.code
      });
      toast(response.data.message);
      router.replace('/sign-in');
    } 
    catch (error) {
      console.error('Error during verifying otp:', error);
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message || "OTP verification failed, Try Again later";
      toast(errorMessage);
    }
    finally{
      setIsSubmitting(false)
    }
  }
  
  const userName: string = params.userName;
  const payload = {
    userName, 
  }
  const [sending, setSending] = useState(false);
  const sendOTP = async () => {
    setSending(true)
    try {
      const response = await axios.get('/api/send-otp', {data: payload})
      toast(response.data.message)
    } 
    catch (error) {
      console.error('Error during resending otp:', error);
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message || "OTP resend fail, Try Again";
      toast(errorMessage);
    }
    finally{
      setSending(false);
    }
  }

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-800'>
      <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
        <div className='text-center'>
          <h1 className='text-4xl font-extrabold tracking-tight lg:text-5xl mb-6'>
            Verify your account
          </h1>
          <p className='mb-4'>
            Enter the verification code sent to your email
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              name="code"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>OTP</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your OTP" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type='submit' disabled={isSubmitting} className="px-6 py-2 rounded-xl shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg">
              {isSubmitting ? (
                <>
                  <Loader className='animate-spin'/>
                  <p>Verifying..</p>
                </>
              ) : (<p>Verify</p>)}
            </Button>

            <div className='flex items-center justify-center'>
              <div className='mr-2'>Didn&apos;t Recive OTP</div>
              <button
                disabled={sending}
                onClick={sendOTP}
                className="bg-transparent p-0 m-0 border-0 text-blue-600 cursor-pointer hover:underline focus:outline-none hover:tracking-wide transition-all ease-in-out duration-300 hover:text-blue-800"
              >
                Send again
              </button>   
            </div>

          </form>
        </Form>
      </div>
    </div>
  )
}

export default Page