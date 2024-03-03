"use client";
import { removeUserInfo } from "@/app/redux/features/user-slice";
import Image from "next/image";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { SignOutButton } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const UnverifiedPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    dispatch(removeUserInfo());
  }, [dispatch]);

  return (
    <div className="bg-gradient-to-b from-yellow-300 to-yellow-500 w-full h-full min-h-screen text-center flex items-center flex-col p-6 absolute top-0 right-0 bottom-0 left-0  z-50">
      <Image src="https://cdn.rawgit.com/ahmedhosna95/upload/1731955f/sad404.svg" alt="404" width={400} height={400} />
      <div className="flex flex-col gap-3">
        <span className="sm:text-3xl text-2xl font-semibold">Please wait for the admin to verify your account</span>
        <p className="text-xl">Click the button below to redirect to the login page.</p>
        <div className="flex justify-center">
          <SignOutButton>
            <Button variant={"white"} className="w-25" onClick={() => router.push("/sign-in")}>
              Go to login page
            </Button>
          </SignOutButton>
        </div>
      </div>
    </div>
  );
};

export default UnverifiedPage;
