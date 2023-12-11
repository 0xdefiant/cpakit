import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { getSession } from 'next-auth/react';

 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function withAuth(getServerSidePropsFunc: (context: any, session: any) => any) {
  return async (context: any) => {
    const session = await getSession(context);

    if (!session) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }

    return getServerSidePropsFunc ? getServerSidePropsFunc(context, session) : { props: { session } };
  };
}