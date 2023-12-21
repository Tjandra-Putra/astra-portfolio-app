"use client";

import { useState } from "react";
import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleDot,
  faMessage,
  faAddressCard,
  faUser,
  faEnvelope,
  faPaperPlane,
  faFolder,
} from "@fortawesome/free-regular-svg-icons";
import { faLinkedin, faGithub } from "@fortawesome/free-brands-svg-icons";
import { faAt } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  return (
    <nav className="sticky h-16 shadow-paper bg-white rounded-lg flex flex-row justify-between items-center p-5">
      <div className="nav-left flex gap-7">
        <Link href="/" className="nav-item">
          <FontAwesomeIcon
            icon={faFolder}
            className="w-6 h-6 transition duration-300 hover:text-black"
            color="#9b9ca5"
          />
        </Link>
        <Link href="/about" className="nav-item">
          <FontAwesomeIcon
            icon={faAddressCard}
            className="w-6 h-6 transition duration-300 hover:text-black"
            color="#9b9ca5"
          />
        </Link>
        <Link href="/contact" className="nav-item">
          <FontAwesomeIcon
            icon={faEnvelope}
            className="w-6 h-6 transition duration-300 hover:text-black"
            color="#9b9ca5"
          />
        </Link>
      </div>
      <div className="nav-right flex gap-7">
        <Link href="/" className="nav-item">
          <FontAwesomeIcon icon={faAt} className="w-6 h-6 transition duration-300 hover:text-black" color="#9b9ca5" />
        </Link>
        <Link href="/" className="nav-item">
          <FontAwesomeIcon
            icon={faGithub}
            className="w-6 h-6 transition duration-300 hover:text-black"
            color="#9b9ca5"
          />
        </Link>
        <Link href="/" className="nav-item">
          <FontAwesomeIcon
            icon={faLinkedin}
            className="w-6 h-6 transition duration-300 hover:text-black"
            color="#9b9ca5"
          />
        </Link>
        <div className="nav-item">
          <SignedIn>
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
          </SignedIn>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
