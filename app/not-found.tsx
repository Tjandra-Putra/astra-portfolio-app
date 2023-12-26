"use client";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const NotFound: React.FC = () => {
  const router = useRouter();

  const goBack = () => {
    router.back(); // Navigates back to the previous page
  };

  return (
    <div
      id="oopss"
      className="bg-gradient-to-b from-yellow-300 to-yellow-500 w-full h-full min-h-screen text-center flex items-center flex-col p-6"
    >
      <Image src="https://cdn.rawgit.com/ahmedhosna95/upload/1731955f/sad404.svg" alt="404" width={400} height={400} />
      <div className="flex flex-col gap-8">
        <span className="sm:text-8xl text-4xl font-bold">404 PAGE</span>
        <p className="text-xl">The page you were looking for could not be found</p>
        <Button variant="secondary" onClick={goBack}>
          Back to previous page
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
