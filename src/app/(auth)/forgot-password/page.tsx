'use client'

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { forgotEmail, forgotOtp } from '@/schema/forgotPasswordSchema';
import { ApiResponse } from '@/types/apiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { Loader, Loader2 } from 'lucide-react';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import * as z from 'zod'
import { toast } from 'sonner';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useRouter } from 'next/navigation';
import OtpSpamAlert from '@/components/SpanAttention';

const Page = () => {

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitting2, setIsSubmitting2] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [sending, setSending] = useState<boolean>(false);
  const [otpSend, setOtpSend] = useState<boolean>(false);

  const form1 = useForm<z.infer<typeof forgotEmail>>({
    resolver: zodResolver(forgotEmail),
    defaultValues: {
      email: ""
    }
  })

  const onSubmit1 = async (data: z.infer<typeof forgotEmail>) => {
    setIsSubmitting(true);
    try {
      setEmail(data.email);
      const response = await axios.post<ApiResponse>(`/api/send-otp-forgotPassword`, {
        email: data.email,
      });
      toast(response.data.message);
    } 
    catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast(axiosError.response?.data.message || "Failed to set OTP")
    }
    finally{
      setIsSubmitting(false);
      setOtpSend(true);
    }
  }

  const form2 = useForm<z.infer<typeof forgotOtp>>({
    resolver: zodResolver(forgotOtp),
    defaultValues: {
      otp: ''
    }
  })

  const router = useRouter();

  const onSubmit2 = async (data: z.infer<typeof forgotOtp>) => {
    setIsSubmitting2(false);
    try {
      const response = await axios.post<ApiResponse>(`/api/verify-otp-forgotPassword`, {
        email,
        otp: data.otp
      })
      toast(response.data.message);
      router.replace(`/reset-password/${email}`);
    } 
    catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast(axiosError.response?.data.message || "OTP verification failed")
    }
    finally{
      setIsSubmitting2(false);
    }
  }

  const sendOTP = async () => {
    setSending(true);
    try {
      const response = await axios.post<ApiResponse>(`/api/send-otp-forgotPassword`, {
        email: email,
      });
      toast(response.data.message);
    } 
    catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast(axiosError.response?.data.message || "Failed to set OTP")
    }
    finally{
      setSending(false);
    }
  }

  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Forgot Password
          </h1>
          <p className="mb-4">Verify to reset your password</p>
        </div>
        
        <Form {...form1}>
          <form onSubmit={form1.handleSubmit(onSubmit1)} className="space-y-6">

            <FormField
              name="email"
              control={form1.control}
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

            <Button type="submit" disabled={isSubmitting} className="px-6 py-2 rounded-xl shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg">
              {
                isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin"/> Please wait
                  </>
                ) : ('Send OTP')
              }
            </Button>

          </form>
        </Form>

        <Form {...form2}>
          <form onSubmit={form2.handleSubmit(onSubmit2)} className="space-y-8">
            <FormField
              name="otp"
              control={form2.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>OTP</FormLabel>
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type='submit' disabled={isSubmitting2} className="px-6 py-2 rounded-xl shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg">
              {isSubmitting2 ? (
                <>
                  <Loader className='animate-spin'/>
                  <p>Verifying..</p>
                </>
              ) : (<p>Verify</p>)}
            </Button>

            {otpSend && <OtpSpamAlert />}

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
    </>
  )
}

export default Page