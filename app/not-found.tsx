"use client";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const NotFound: React.FC = () => {
  const router = useRouter();

  const goBack = () => {
    router.back(); // Navigates back to the previous page
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800 p-4 text-center">
      <Card className="w-full max-w-lg bg-white dark:bg-gray-900 shadow-lg rounded-2xl">
        <CardHeader>
          <Image src="/assets/image/error-404.png" alt="404" width={200} height={200} className="mx-auto mb-4" />
          <CardTitle className="text-3xl font-bold text-gray-800 dark:text-white">Page Not Found</CardTitle>
        </CardHeader>
        <CardContent className="text-center flex flex-col items-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Sorry, the page you are looking for does not exist. Please check the URL or go back to the homepage.
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="secondary" className="w-full  py-2 rounded-full" onClick={goBack}>
              Go Back
            </Button>
            <Link href="/">
              <Button variant="secondary" className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-full">
                Go to Home
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
