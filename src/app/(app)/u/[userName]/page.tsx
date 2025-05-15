'use client'

import { useParams } from 'next/navigation'
import { messageSchema } from '@/schema/messageSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form'; 
import * as z from 'zod'
import { ApiResponse } from '@/types/apiResponse';
import { toast } from 'sonner';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';



const Page = () => {

  const params = useParams<{ userName: string }>();
  const userName: string = params.userName;

  const {data: session} = useSession();
  const loggedUser = session?.user;

  const [submitting, setSubmitting] = useState(false);

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: '',
    }
  })

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setSubmitting(true)
    try {
      const response = await axios.post<ApiResponse>(`/api/send-message`, {
        userName,
        content: data.content
      })
      toast(response.data.message);
    } 
    catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast(axiosError.request?.data.message || "Failed to send feedback")
    }
    finally{
      form.reset();
      setSubmitting(false)
    }
  }

  if(userName === loggedUser?.userName){
    return (
      <>
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="max-w-md w-full scale-110">
            <Alert variant="destructive">
              <AlertCircle className="h-5 w-5" />
              <AlertTitle className="text-lg">Invalid</AlertTitle>
              <AlertDescription className="text-base">
                You cannot give feedback to yourself
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
        <div className="text-center">
          <h1 className="text-4xl tracking-tight lg:text-5xl mb-6">
            Send Anonymous Message to @{userName}
          </h1>
          <p className="mb-4"></p>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

            <FormField
              name="content"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Feedback</FormLabel>
                  <FormControl>
                    <Input placeholder="Write your anonymous message here" 
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={submitting} className="px-6 py-2 rounded-xl shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg">
              {
                submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin"/> Please wait
                  </>
                ) : ('Send')
              }
            </Button>

          </form>
        </Form>

    </div>
    </>
  )
}

export default Page