"use client";

import { useState } from "react";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAddressCard, faEnvelope, faFolder, faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { faCrown, faSquarePlus } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { Button } from "../ui/button";

const Navbar = () => {
  const [isAdmin, setIsAdmin] = useState<boolean>(true);
  return (
    <nav className="sticky top-[1rem] h-16 shadow-paper bg-white rounded-xl flex flex-row justify-between items-center px-6  overflow-x-auto z-10">
      <div className="nav-left flex gap-2">
        <Link href="/profile/tjandra-putra" className="nav-item">
          <Button variant="ash">
            <FontAwesomeIcon
              icon={faFolder}
              className="w-6 h-6 sm:w-6 sm:h-6  transition duration-300"
              color="#000000"
            />
          </Button>
        </Link>
        <Link href="/about" className="nav-item">
          <Button variant="link">
            <FontAwesomeIcon
              icon={faAddressCard}
              className="w-6 h-6 sm:w-6 sm:h-6 transition duration-300"
              color="#000000"
            />
          </Button>
        </Link>
        <Link href="/contact" className="nav-item">
          <Button variant="link">
            <FontAwesomeIcon
              icon={faEnvelope}
              className="w-6 h-6 sm:w-6 sm:h-6 transition duration-300"
              color="#000000"
            />
          </Button>
        </Link>
        {/* Only Authenticated Verified Users can see this */}
        <SignedIn>
          <Link href="/manage" className="nav-item">
            <Button variant="link">
              <FontAwesomeIcon
                icon={faPenToSquare}
                className="w-[1.4rem] h-[1.4rem] transition duration-300"
                color="#000000"
              />
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
              />
            </Button>
          </div>
        </SignedIn>
      </div>

      <div className="nav-right flex gap-2">
        <SignedIn>
          {isAdmin && (
            <Link href="/admin/dashboard" className="nav-item">
              <Button variant={"ocean"}>
                <FontAwesomeIcon icon={faCrown} className="me-2" color="#183153" />
                Admin
              </Button>
            </Link>
          )}
        </SignedIn>
        <Link href="/" className="nav-item">
          <Button variant={"navy"}>
            <FontAwesomeIcon icon={faSquarePlus} className="me-2" color="#ffffff" />
            Collab
          </Button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
