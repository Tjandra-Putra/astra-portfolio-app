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
    <div className="bg-gradient-to-b from-yellow-300 to-yellow-500 w-full h-full min-h-screen flex justify-center items-center flex-col p-6">
      <Image src="/assets/image/error-404.png" alt="404" width={400} height={400} />
      <div className="flex flex-col items-center gap-8 text-center">
        <span className="sm:text-6xl text-2xl font-bold uppercase">Not Found</span>
        <p className="text:l sm:text-xl">The page you were looking for could not be found</p>
        {/* <Button variant="secondary" onClick={goBack}>
          Back to previous page
        </Button> */}
      </div>
    </div>
  );
};

export default NotFound;
