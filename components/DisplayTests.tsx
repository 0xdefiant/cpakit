"use client"

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import apiClient from "@/libs/api";

const DisplayTests = () => {
  const [tests, setTests] = useState([]);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchTests = async () => {
      if (session?.user?.id) {
        const userId = session.user.id;
        console.log("Fetching tests for userId:", userId); // Debug log
        try {
          // Correctly handle the response
          const response = await apiClient.get(`/test?userId=${userId}`);
          console.log("Full API Response:", response); // Log the full response

          // Assuming 'response' has a 'data' property
          console.log("Type of response.data:", typeof response.data); // Debug log for type of response.data
          console.log("Is response.data an array?", Array.isArray(response.data)); // Debug log for checking if response.data is an array

          if (Array.isArray(response)) {
            setTests(response);
          } else {
            console.error("Unexpected response structure:", response);
            setTests([]);
          }
        } catch (error) {
          console.error("Error fetching test data for userId:", userId, error);
        }
      } else {
        console.log("Session or User ID not found");
      }
    };

    fetchTests();
  }, [session]);

  if (!session) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h3>Your Tests</h3>
      <ul>
        {tests.length > 0 ? (
          tests.map((test) => (
            <li key={test.id}>{test.test}</li> // Using id as the key
          ))
        ) : (
          <li>No tests available</li>
        )}
      </ul>
    </div>
  );
};

export default DisplayTests;
