import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "./ui/button";
import Image from "next/image";

export default function Navbar() {
    const { user } = useUser()
    return (
        <nav className="flex w-full items-center justify-between border-t border-b border-neutral-200 px-4 py-4 dark:border-neutral-800">
            <div className="flex items-center gap-2">
                <Image src={'/logo.svg'} alt='logo' width={150} height={80} />
            </div>
            {!user ? <Link href={'/sign-in'}><button className="w-24 transform rounded-lg bg-black px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800 md:w-32 dark:bg-white dark:text-black dark:hover:bg-gray-200 cursor-pointer">
                Login
            </button></Link> :
                <div className="flex gap-5 items-center"> <UserButton /> <Link href={'/dashboard'}><Button className="hover: cursor-pointer">Dashboard</Button></Link></div>
            }
        </nav>
    );
};
