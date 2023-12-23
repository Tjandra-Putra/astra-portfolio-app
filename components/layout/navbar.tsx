"use client";

import { useState } from "react";
import { SignedIn, UserButton, useClerk } from "@clerk/nextjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAddressCard, faEnvelope, faFolder, faPenToSquare, faSquarePlus } from "@fortawesome/free-regular-svg-icons";
import Link from "next/link";
import { Button } from "../ui/button";

const Navbar = () => {
  return (
    <nav className="sticky top-[1rem] h-16 shadow-paper bg-white rounded-lg flex flex-row justify-between items-center px-6  overflow-x-auto z-10">
      <div className="nav-left flex gap-2">
        <Link href="/" className="nav-item">
          <Button variant="ash">
            <FontAwesomeIcon icon={faFolder} className="w-6 h-6 transition duration-300" color="#000000" />
          </Button>
        </Link>
        <Link href="/about" className="nav-item">
          <Button variant="link">
            <FontAwesomeIcon icon={faAddressCard} className="w-6 h-6 transition duration-300" color="#000000" />
          </Button>
        </Link>
        <Link href="/contact" className="nav-item">
          <Button variant="link">
            <FontAwesomeIcon icon={faEnvelope} className="w-6 h-6 transition duration-300" color="#000000" />
          </Button>
        </Link>
        {/* Only Authenticated Verified Users can see this */}
        <SignedIn>
          <Link href="/modify" className="nav-item">
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
      <div className="nav-right gap-2">
        <Link href="/" className="nav-item">
          <Button variant={"navy"}>
            <FontAwesomeIcon icon={faSquarePlus} className="me-2" color="#ffffff" />
            Hire Me
          </Button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
