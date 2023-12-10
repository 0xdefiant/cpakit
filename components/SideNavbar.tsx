"use client"

import Link from 'next/link';
import { useState } from 'react';
import ButtonAccount from './ButtonAccount';
import ButtonCheckout from "./ButtonCheckout";
import config from "@/config";

const SideNavbar = () => {
  const [isNavVisible, setIsNavVisible] = useState(false);

  return (
    <div>
      <button onClick={() => setIsNavVisible(!isNavVisible)} className="p-4 md:hidden">
        {isNavVisible ? 'Hide' : 'Show'} Menu
      </button>
      <nav className={`fixed inset-y-0 left-0 w-64 bg-gray-200 dark:bg-gray-800 transition duration-200 ease-in-out z-10 transform ${isNavVisible || 'hidden'} md:block md:translate-x-0`}>
        <div className="flex flex-col h-full py-7 px-2 space-y-6">
        <ButtonAccount />
        <Link href="/dashboard" className="text-gray-600 dark:text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
            Dashboard
        </Link>
        <Link href="/settings" className="text-gray-600 dark:text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
            Settings
        </Link>
        <Link href="/TaxForms" className="text-gray-600 dark:text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
            Tax Forms
        </Link>
        <Link href="/AccountingAdvisory" className="text-gray-600 dark:text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
            Advisory
        </Link>
        <ButtonCheckout
          mode="subscription"
          priceId={config.stripe.plans[0].priceId}
        />
        {/* More navigation links */}
      </div>
    </nav>
  </div>
  );
};

export default SideNavbar;
