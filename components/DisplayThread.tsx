"use client";

import React, { useEffect, useState } from 'react';
import { useSession } from "next-auth/react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import apiClient from '@/libs/api';

interface ApiResponse {
    allMessageContents: string[];
    threadData: {
      thread_id: string;
      assistantId: string;
      runId: string;
      userId: string;
      metadata: unknown;
    };
  }


export function DisplayThread() {
    const [chatMessages, setChatMessages] = useState([]);
    const { data: session } = useSession();

    useEffect(() => {
        let intervalId: number;

        const fetchThreads = async () => {
            if (session?.user?.id) {
            const userId = session.user.id;
            console.log("Thread userID: ", userId);
            try {
                const response = await apiClient.get(`/store/thread?userId=${userId}`) as ApiResponse;
                console.log("Response from Threads:", response);
                if (Array.isArray(response)) {
                    setChatMessages(response);
                } else {
                    console.log("Unexpected allMessageContents strucute:", response)
                }
            } catch (error) {
                console.error("Error fetching thread: ", error);
            }
        }
    };

    if (session) {
        fetchThreads();
        intervalId = window.setInterval(fetchThreads, 10000) as unknown as number; // Poll every 10 seconds
      }
  
      return () => {
        if (intervalId) {
          clearInterval(intervalId); // Clear the interval on component unmount
        }
      };
    }, [session]); // Dependency array includes session to restart interval if session changes

    if (!session) {
        return <div>Loading...</div>;
    }

    const renderMessage = (message: any) => {
        try {
          if (message && typeof message.content === 'string') {
            return <div key={message.id} className="message">{message.content}</div>;
          } else {
            console.error('Invalid message object:', message);
            return <div className="error-message">RENDERMESSAGE DID NOT WORK</div>;
          }
        } catch (error) {
          console.error('Error rendering message:', error);
          return <div className="error-message">Error in renderMessage</div>;
        }
      };

    return (
        <div>
        <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">Chat History</h3>
        <Accordion type="single" collapsible className="">
            {chatMessages.map((chat, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger>{chat.thread_id}</AccordionTrigger>
                    <AccordionContent>
                        {chat.allMessageContents}
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
        </div>
    );
}
