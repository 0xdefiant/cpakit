"use client";

import React, { useEffect, useState } from 'react';
import { useSession } from "next-auth/react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import apiClient from '@/libs/api';

export function ChatDisplay() {
    const [chatMessages, setChatMessages] = useState([]);
    const { data: session } = useSession();

    useEffect(() => {
        let intervalId: number;

        const fetchChatMessages = async () => {
            if (session?.user?.id) {
            const userId = session.user.id;
            console.log("ChatDisplay userID:", userId);
            try {
                const response = await apiClient.get(`/store/chatMessage?userId=${userId}`);
                if (Array.isArray(response)) {
                    setChatMessages(response);
                } else {
                    console.log("Unexpected chatMesssage strucute:", response)
                }
            } catch (error) {
                console.error("Error fetching chat messages:", error);
            }
        }
    };

    if (session) {
        fetchChatMessages();
        intervalId = window.setInterval(fetchChatMessages, 10000) as unknown as number; // Poll every 10 seconds
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

    return (
        <div>
        <Accordion type="single" collapsible className="w-full">
            {chatMessages.map((chat, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger>{chat.prompt}</AccordionTrigger>
                    <AccordionContent>
                        {chat.response}
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
        </div>
    );
}
