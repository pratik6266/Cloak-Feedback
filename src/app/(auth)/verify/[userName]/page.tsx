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
      console.log(response); //todo to be reomved
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

            <Button type='submit' disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader className='animate-spin'/>
                  <p>Verifying..</p>
                </>
              ) : (<p>Verify</p>)}
            </Button>

          </form>
        </Form>
      </div>
    </div>
  )
}

export default Page