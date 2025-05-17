'use client'

import React from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from './ui/button'
import { X } from 'lucide-react'
import axios from 'axios'
import { ApiResponse } from '@/types/apiResponse'
import { toast } from 'sonner'
import dayjs from 'dayjs';
import { Message } from '../../generated/prisma'


type MessageCardProps = {
  message: Message,
  onMessageDelete: (messageId: string) => void,
}

interface payloadInterface {
  id: string,
}

const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {

  const payload: payloadInterface = {
    id: message.id
  }

  const handleDeleteConfirm = async () => {
    const response = await axios.delete<ApiResponse>(`/api/delete-message`, { data: payload });
    toast(response.data.message);
    onMessageDelete(message.id);
  }

  return (
    <Card className="card-bordered">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{message.content}</CardTitle>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className='text-black bg-gray-100 border-1 transition-all ease-in-out duration-200 hover:bg-red-500 hover:text-white'>
                <X className="w-5 h-5" strokeWidth={5}/>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  this message.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteConfirm}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <div className="text-sm">
          {dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}
        </div>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  )
}

export default MessageCard