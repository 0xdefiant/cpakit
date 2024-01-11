"use client";

import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-hot-toast";
import apiClient from "@/libs/api";
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
  email: z.string().email({ message: "Invalid email address." }),
});

const ButtonLead = ({ extraStyle }: { extraStyle?: string }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const form = useForm({
    resolver: zodResolver(schema),
  });

  const handleSubmit = async (data: { email: string }) => {
    setIsLoading(true);
    try {
      await apiClient.post("/lead", data);
      await apiClient.post("/lead/send", data)

      toast.success("Thanks for joining the community. Look for an Email in you inbox soon!");
      form.reset();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className={`flex flex-col space-y-3 ${extraStyle || ""}`}>
      <span className="font-semibold">Build with us</span>
      <div className="flex items-center space-x-2">
        <FormField
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="email"
                  placeholder="tom@cruise.com"
                  autoComplete="email"
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

export default ButtonLead;
