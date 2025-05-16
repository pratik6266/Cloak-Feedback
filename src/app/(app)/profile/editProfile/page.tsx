'use client'

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { userNameScehma } from '@/schema/userNameSchema';
import { ApiResponse } from '@/types/apiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { Loader2 } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useDebounceCallback } from 'usehooks-ts';
import * as z from 'zod';

const Page = () => {

  const { data: session } = useSession();
  const loggedUser = session?.user;

  const[userName, setUserName] = useState<string>('');
  const[loggedUserName, setLoggedUserName] = useState<string>('');
  const[isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const[userNameMessage, setUserNameMessage] = useState<string>('');
  const[isUserNameChecking, setIsUserNameChecking] = useState<boolean>(false)

  const debounced = useDebounceCallback(setUserName, 300)
  useEffect(() => {
    setLoggedUserName(loggedUser?.userName || '');
  }, [loggedUser?.userName])

  const form = useForm<z.infer<typeof userNameScehma>>({
    resolver: zodResolver(userNameScehma),
    defaultValues: {
      userName: ''
    }
  });

  useEffect(() => {
    const checkIsAviable = async () => {
      if(userName){
        setIsUserNameChecking(true)
        try {
          const response = await axios.get<ApiResponse>(`/api/check-username-unique?userName=${userName}`);
          setUserNameMessage(response?.data.message)
        } 
        catch (error) {
          const axiosError = error as AxiosError<ApiResponse>
          setUserNameMessage(axiosError?.response?.data.message || 'Error Checking UserName')
        }
        finally{
          setIsUserNameChecking(false)
        }
      }
    }
    checkIsAviable();
  }, [userName]);

  const onSubmit = async (data: z.infer<typeof userNameScehma>) => {
    setIsSubmitting(true)
    try {
      const response = await axios.post<ApiResponse>(`/api/change-userName`, {
        old: loggedUserName,
        newName: data.userName
      })
      toast(`${response.data.message}, Please login again`)
      setTimeout(() => {
        signOut()
      }, 2000);
    } 
    catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast(axiosError.response?.data.message || "Error while submitting form")
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
            Update Profile
          </h1>
          <p className="mb-4">Please enter your new username</p>
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
                  {isUserNameChecking && <Loader2 className="animate-spin" />}
                  {!isUserNameChecking && userNameMessage && (
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

            <Button type="submit" disabled={isSubmitting} className="px-6 py-2 rounded-xl shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg" >
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
  )
}

export default Page