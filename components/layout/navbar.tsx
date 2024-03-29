"use client";

import { useState, useEffect } from "react";
import { SignedIn, UserButton, useAuth } from "@clerk/nextjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAddressCard, faEnvelope, faFolder, faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { faCrown, faSquarePlus } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { Button } from "../ui/button";
import { useSelector, useDispatch } from "react-redux";
import { removeUserInfo } from "@/app/redux/features/user-slice";
import { CircleUserRound, Folder, FolderCog, Home, Mail, Square, SquareUser, User } from "lucide-react";
import axios from "axios";

const Navbar = () => {
  const userInfo = useSelector((state: any) => state.userReducer);
  const { userId } = useAuth();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!userId) {
      // clear redux state
      dispatch(removeUserInfo());
    }
  }, [userId]);

  return (
    <nav className="sticky top-[1rem] h-16 shadow-paper bg-white rounded-xl flex flex-row justify-between items-center md:px-6 px-3 overflow-x-hidden z-10">
      <div className="nav-left flex gap-2">
        <Link href={`/profile/${userInfo?.id}`} className="nav-item">
          <Button variant="ash">
            {/* <FontAwesomeIcon
              icon={faFolder}
              className="w-6 h-6 sm:w-6 sm:h-6  transition duration-300"
              color="#000000"
            /> */}
            <Folder className="w-6 h-6 sm:w-6 sm:h-6  transition duration-300" strokeWidth={2.2} />
          </Button>
        </Link>
        <Link href="/about" className="nav-item">
          <Button variant="link">
            {/* <FontAwesomeIcon
              icon={faAddressCard}
              className="w-6 h-6 sm:w-6 sm:h-6 transition duration-300"
              color="#000000"
            /> */}
            <User className="w-6 h-6 sm:w-6 sm:h-6  transition duration-300" strokeWidth={2.2} />
          </Button>
        </Link>
        {userInfo?.workEmail ? (
          <Link href={`mailto:${userInfo?.workEmail}`} className="nav-item">
            <Button variant="link">
              {/* <FontAwesomeIcon
                icon={faEnvelope}
                className="w-6 h-6 sm:w-6 sm:h-6 transition duration-300"
                color="#000000"
              /> */}
              <Mail className="w-6 h-6 sm:w-6 sm:h-6  transition duration-300" strokeWidth={2.2} />
            </Button>
          </Link>
        ) : (
          <Link href={`mailto:${userInfo?.email}`} className="nav-item">
            <Button variant="link">
              {/* <FontAwesomeIcon
                icon={faEnvelope}
                className="w-6 h-6 sm:w-6 sm:h-6 transition duration-300"
                color="#000000"
              /> */}
              <Mail className="w-6 h-6 sm:w-6 sm:h-6  transition duration-300" strokeWidth={2.2} />
            </Button>
          </Link>
        )}
        {/* Only Authenticated Verified Users can see this */}
        <SignedIn>
          <Link href="/manage" className="nav-item">
            <Button variant="link">
              {/* <FontAwesomeIcon
                icon={faPenToSquare}
                className="w-[1.4rem] h-[1.4rem] transition duration-300"
                color="#000000"
              /> */}
              <FolderCog className="w-6 h-6 sm:w-6 sm:h-6  transition duration-300" strokeWidth={2.2} />
            </Button>
          </Link>
          <div className="nav-item me-2">
            <Button variant="link">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: {
                      width: "1.65rem",
                      height: "1.65rem",
                    },
                  },
                }}
                afterSignOutUrl="/sign-in"
              />
            </Button>
          </div>
        </SignedIn>
      </div>

      <div className="nav-right flex gap-2">
        <SignedIn>
          {userInfo?.role == "ADMIN" && (
            <Link href="/admin/dashboard" className="nav-item">
              <Button variant={"ocean"}>
                <FontAwesomeIcon icon={faCrown} className="me-2" color="#ffffff" />
                Admin
              </Button>
            </Link>
          )}
        </SignedIn>
        {userInfo?.workEmail ? (
          <Link href={`mailto:${userInfo?.workEmail}`} className="nav-item">
            <Button variant={"navy"}>
              <FontAwesomeIcon icon={faSquarePlus} className="me-2" color="#ffffff" />
              Collab
            </Button>
          </Link>
        ) : (
          <Link href={`mailto:${userInfo?.email}`} className="nav-item">
            <Button variant={"navy"}>
              <FontAwesomeIcon icon={faSquarePlus} className="me-2" color="#ffffff" />
              Collab
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
