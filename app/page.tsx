import Link from 'next/link';
import { buttonVariants } from "@/components/ui/button";
import {
  UserGroupIcon
} from '@heroicons/react/24/outline';

export default function Home() {
  return (
    <div>
      <h1 className="text-3xl">Welcome!</h1>

      <div className="mt-5">This project is for exploring Next.js & Tailwind CSS. It will be a simple CRUD application
        where you can search, add, delete & modify Customer records.</div>

      <div className="mt-5">Click the Customers link below to get started.</div>

      <Link className={buttonVariants({
          variant: "default",
          size: "default",
          className: "flex items-center gap-2 mt-5"
        })} href="/customers">
        <UserGroupIcon className="w-5 h-5" />
        <span>Customers</span>
      </Link>

    </div>
  );
}
