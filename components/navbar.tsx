"use client";

import { useState } from "react";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAddressCard, faEnvelope, faFolder, faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { faLinkedin, faGithub } from "@fortawesome/free-brands-svg-icons";
import { faAt } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { Button } from "./ui/button";

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  return (
    <nav className="sticky top-[1rem] h-16 shadow-paper bg-white rounded-lg flex flex-row justify-between items-center py-5 px-2">
      <div className="nav-left flex gap-0">
        <Link href="/" className="nav-item">
          <Button variant="ghost">
            <FontAwesomeIcon icon={faFolder} className="w-6 h-6 transition duration-300" color="#9b9ca5" />
          </Button>
        </Link>
        <Link href="/about" className="nav-item">
          <Button variant="ghost">
            <FontAwesomeIcon icon={faAddressCard} className="w-6 h-6 transition duration-300" color="#9b9ca5" />
          </Button>
        </Link>
        <Link href="/contact" className="nav-item">
          <Button variant="ghost">
            <FontAwesomeIcon icon={faEnvelope} className="w-6 h-6 transition duration-300" color="#9b9ca5" />
          </Button>
        </Link>
      </div>
      <div className="nav-right flex gap-0">
        <Link href="/" className="nav-item">
          <Button variant="ghost">
            <FontAwesomeIcon icon={faAt} className="w-6 h-6 transition duration-300" color="#9b9ca5" />
          </Button>
        </Link>
        <Link href="/" className="nav-item">
          <Button variant="ghost">
            <FontAwesomeIcon icon={faGithub} className="w-6 h-6 transition duration-300" color="#9b9ca5" />
          </Button>
        </Link>
        <Link href="/" className="nav-item">
          <Button variant="ghost">
            <FontAwesomeIcon icon={faLinkedin} className="w-6 h-6 transition duration-300" color="#9b9ca5" />
          </Button>
        </Link>
        <SignedIn>
          <Link href="/" className="nav-item">
            <Button variant="ghost">
              <FontAwesomeIcon icon={faPenToSquare} className="w-6 h-6 transition duration-300" color="#9b9ca5" />
            </Button>
          </Link>
          <div className="nav-item">
            <Button variant="ghost">
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
    </nav>
  );
};

export default Navbar;
