"use client";

import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
  } from "@/components/ui/form";
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from './ui/input';
import { Button } from './ui/button';
import { ArrowRightCircleIcon as ArrowRightCircle } from 'lucide-react';
import apiClient from '@/libs/api';
import { useSession } from 'next-auth/react';

const schema = z.object({
    instructions: z.string().refine(value => value.trim() !== '', { message: "Instructions are required." }),
    name: z.string().refine(value => value.trim() !== '', { message: "Name is required." }),
    tools: z.array(z.object({
      type: z.string().refine(value => value.trim() !== '', { message: "Tool type is required." })// UPDATE THIS TO BE A DROPDOWN FOR THE TYPE OF TOOL
    })).refine(tools => tools.length > 0, { message: "At least one tool is required." }),
    model: z.string().refine(value => value.trim() !== '', { message: "Model is required." })
  });

  interface FormData {
    instructions: string;
    name: string;
    tools: { type: string }[];
    model: string;
    // file_ids: File | null; 
    metadata: any;
  }

const CreateTaxAssistant = () => {
  const [assistantResponse, setAssistantResponse] = useState('');
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm({
    resolver: zodResolver(schema),
  });
/*
const [selectedFile, setSelectedFile] = useState<File | null>(null);
const [fileError, setFileError] = useState<string | null>(null);

const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files ? event.target.files[0] : null;
  setSelectedFile(file);
  setFileError(null); // Reset error on file change
};

react element:
      <div className="form-item">
        <label htmlFor="file" className="form-label">File Upload</label>
        <input
          id="file"
          type="file"
          className="input input-bordered w-full"
          onChange={handleFileChange}
        />
        {fileError && <div className="form-message">{fileError}</div>}
      </div>
*/

  const handleSubmit = async (data: FormData ) => {
    setIsLoading(true);

    try {

      if (!session || !session.user?.id) {
        throw new Error("User session is not available");
      }

      const response = await apiClient.post('/assistant/tax/create', { ...data, userId: session.user.id } );

      toast.success("Thanks for joining the community. Look for an Email in your inbox soon!");
      form.reset();
      setAssistantResponse(response.data.message);
    } catch (error) {
      console.error('Error communicating with the assistant:', error);
      setAssistantResponse('Error communicating with the assistant.');
    }

    setIsLoading(false);
  };

  

  return (
    <Form {...form}>
      <h3>Create a Tax Assistant</h3>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col space-y-3">
        
        {/* Name Field */}
        <FormField
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Enter name"
                  autoComplete="off"
                  className="input input-bordered w-full"
                  {...field}
                />
              </FormControl>
              {fieldState.error && <FormMessage>{fieldState.error.message}</FormMessage>}
            </FormItem>
          )}
        />
        {/* Instructions Field */}
        <FormField
          control={form.control}
          name="instructions"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Enter instructions"
                  autoComplete="off"
                  className="input input-bordered w-full"
                  {...field}
                />
              </FormControl>
              {fieldState.error && <FormMessage>{fieldState.error.message}</FormMessage>}
            </FormItem>
          )}
        />
  
        {/* Tool Type Field - Dropdown */}
        <FormField
          control={form.control}
          name="tools.0.type"
          render={({ field }) => (
            <FormItem>
              <Select onValueChange={field.onChange} defaultValue={field.value}
                >
                <FormControl>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Tools" />
                </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="code_interpreter">Code Interpreter Tool</SelectItem>
                  <SelectItem value="retrieval">Retrieval Tool</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
  
        {/* Model Field */}
        <FormField
          control={form.control}
          name="model"
          render={({ field }) => (
            <FormItem>
              <Select onValueChange={field.onChange} defaultValue={field.value}
                >
                <FormControl>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Model" />
                </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="gpt-4-1106-preview">gpt-4-1106-preview</SelectItem>
                  <SelectItem value="gpt-3.5-turbo-1106">gpt-3.5-turbo-1106</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button type="submit" className="btn btn-primary btn-block" disabled={isLoading}>
          {isLoading ? (
            <span className="loading loading-spinner loading-xs"></span>
          ) : (
            <>
              <ArrowRightCircle className="inline-block" />
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default CreateTaxAssistant;
