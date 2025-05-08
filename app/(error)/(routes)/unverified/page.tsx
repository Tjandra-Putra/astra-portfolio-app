"use client";
import { removeUserInfo } from "@/app/redux/features/user-slice";
import Image from "next/image";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { SignOutButton } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const UnverifiedPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    dispatch(removeUserInfo());
  }, [dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800 p-4 text-center">
      <Card className="w-full max-w-lg bg-white dark:bg-gray-900 shadow-lg rounded-2xl">
        <CardHeader>
          <Image src="/assets/image/locked.png" alt="Locked" width={200} height={200} className="mx-auto mb-4" />
          <CardTitle className="text-3xl font-bold text-gray-800 dark:text-white">Access Denied</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Your account is not verified. Please wait for an administrator to approve your access. You will be notified once your account is verified.
          </p>
          <SignOutButton>
            <Button variant="default" className="w-full bg-sky-600 hover:bg-sky-700 text-white py-2 rounded-full" onClick={() => router.push("/")}>
              Return to Home
            </Button>
          </SignOutButton>
        </CardContent>
      </Card>
    </div>
  );
};

export default UnverifiedPage;
