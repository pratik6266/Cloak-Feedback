'use client'

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { resetPasswordSchema } from '@/schema/resetPasswordSchema';
import { ApiResponse } from '@/types/apiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { Loader2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const Page = () => {

  const params = useParams<{ email: string }>();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const router = useRouter();

  const email = decodeURIComponent(params.email);

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues:{
      old: '',
      one: '',
      two: ''
    }
  })

  const onSubmit = async (data: z.infer<typeof resetPasswordSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post('/api/update-password', {
        email,
        currPassword: data.old,
        newPassword: data.one,
        newPasswordAgain: data.two
      })
      toast(response.data.message);
      router.replace('/sign-in');
    } 
    catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast(axiosError.response?.data.message)
    }
    finally{
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-gray-800">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
              Reset Password
            </h1>
            <p className="mb-4">Enter your password</p>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

              <FormField
                name="old"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                      <Input type='password' placeholder="Enter Current Password" 
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="one"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input type='password' placeholder="Enter New Password" 
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="two"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input type='password' placeholder="Enter New Password Again" 
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
                  ) : ('Update')
                }
              </Button>

            </form>
          </Form>

        </div>
      </div>
    </>
  )
}

export default Page