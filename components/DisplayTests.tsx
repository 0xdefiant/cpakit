"use client"

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import apiClient from "@/libs/api";

const DisplayTests = () => {
  const [tests, setTests] = useState([]);
  const { data: session } = useSession();

  useEffect(() => {
    let intervalId: number;  // Updated type here

    const fetchTests = async () => {
      if (session?.user?.id) {
        const userId = session.user.id;
        try {
          const response = await apiClient.get(`/test?userId=${userId}`);
          if (Array.isArray(response)) {
            setTests(response);
          } else {
            console.error("Unexpected response structure:", response);
          }
        } catch (error) {
          console.error("Error fetching test data for userId:", userId, error);
        }
      }
    };

    if (session) {
      fetchTests();
      intervalId = window.setInterval(fetchTests, 2000) as unknown as number; // Poll every 2 seconds
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
      <h3>Your Tests</h3>
      <ul>
        {tests.map((test) => (
          <li key={test.id}>{test.test}</li> // Using id as the key
        ))}
      </ul>
    </div>
  );
};

export default DisplayTests;
