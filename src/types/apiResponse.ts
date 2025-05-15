interface Message{
  content: string;
  createdAt: Date;
}

export interface ApiResponse{
  success: boolean;
  message: string;
  isAcceptingMessages?: boolean;
  messages?: Message[];
}