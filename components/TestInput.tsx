"use client";

import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-hot-toast";
import apiClient from "@/libs/api";
import { useSession } from "next-auth/react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ArrowRightCircleIcon as ArrowRightCircle } from "lucide-react"; // Import the ArrowLeftIcon

const schema = z.object({
    test: z.string().refine(value => value !== '', { message: "Invalid test input." }),
  });

const ButtonTest = ({ extraStyle }: { extraStyle?: string }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { data: session } = useSession();
  const form = useForm({
    resolver: zodResolver(schema),
  });

  const handleSubmit = async (data: { test: string }) => {
    setIsLoading(true);
    try {
      // Ensure we have a session and user id
      if (!session || !session.user?.id) {
        throw new Error("User session is not available");
      }
      
      // Include the userId in the data sent to the API
      await apiClient.post("/test", { ...data, userId: session.user.id });

      toast.success("Thanks for joining the community. Look for an Email in your inbox soon!");
      form.reset();
    } catch (error) {
      console.error(error);
      toast.error("An error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className={`flex flex-col space-y-3 ${extraStyle || ""}`}>
      <span className="font-semibold">test submit </span>
      <div className="flex items-center space-x-2">
        <FormField
          control={form.control}
          name="test"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="text"
                  placeholder="try and break me"
                  autoComplete="text"
                  className="input input-bordered w-full placeholder:opacity-60"
                  {...field}
                />
              </FormControl>
              {fieldState.error && (
                <FormMessage>{fieldState.error.message}</FormMessage>
              )}
            </FormItem>
          )}
        />

        <Button type="submit" className="btn btn-primary btn-block" disabled={isLoading}>
          {isLoading ? (
            <span className="loading loading-spinner loading-xs"></span>
          ) : (
            <>
              <ArrowRightCircle className="inline-block" />
            </>
          )}
        </Button>
      </div>
      </form>
    </Form>
  );
};

export default ButtonTest;
