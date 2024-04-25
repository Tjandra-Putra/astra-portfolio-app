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
    <div className="p-6 bg-gradient-to-b from-yellow-300 to-yellow-500 w-full h-full min-h-screen text-center flex flex-col items-center justify-center">
      <Image src="/assets/image/layout.png" alt="404" width={400} height={400} />
      <div className="flex flex-col gap-3">
        <span className="sm:text-6xl text-2xl font-bold uppercase">Unauthorised</span>
        <p className="text:l sm:text-xl">Click the button below to redirect back.</p>
        <div className="flex justify-center">
          <SignOutButton>
            <Button variant={"white"} className="w-25" onClick={() => router.push("/")}>
              Return
            </Button>
          </SignOutButton>
        </div>
      </div>
    </div>
  );
};

export default UnverifiedPage;
