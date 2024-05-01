"use client";

import { useEffect, useRef } from "react";
import { SignedIn, UserButton, useAuth } from "@clerk/nextjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAddressCard,
  faFolderBlank,
  faPenToSquare,
  faUserAstronaut,
  faCrown,
  faSquarePlus,
  faAward,
  faGraduationCap,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import { faFolder, faEnvelope } from "@fortawesome/free-regular-svg-icons";
import Link from "next/link";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useSelector, useDispatch } from "react-redux";
import { removeUserInfo } from "@/app/redux/features/user-slice";
import { CircleUserRound, Folder, FolderCog, Home, Mail, Square, SquareUser, User, GraduationCap } from "lucide-react";
import { usePathname } from "next/navigation";

const Navbar: React.FC = () => {
  const userInfo = useSelector((state: any) => state.userReducer);
  const { userId } = useAuth();
  const dispatch = useDispatch();
  const navbarRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname();

  const getButtonVariant = (path: string) => {
    return pathname === path ? "navy" : "ash";
  };

  useEffect(() => {
    if (!userId) {
      dispatch(removeUserInfo());
    }

    const navbar = navbarRef.current;
    let isDown = false;
    let startX: number;
    let scrollLeft: number;

    const handleStart = (e: TouchEvent | MouseEvent) => {
      isDown = true;
      startX = e instanceof TouchEvent ? e.touches[0].clientX : e.pageX;
      scrollLeft = navbar?.scrollLeft || 0;
    };

    const handleMove = (e: TouchEvent | MouseEvent) => {
      if (!isDown || !navbar) return;
      e.preventDefault();
      const x = e instanceof TouchEvent ? e.touches[0].clientX : e.pageX;
      const walk = (x - startX) * 1; // Adjust scrolling speed here
      navbar.scrollLeft = scrollLeft - walk;
    };

    const handleEnd = () => {
      isDown = false;
    };

    navbar?.addEventListener("mousedown", handleStart);
    navbar?.addEventListener("touchstart", handleStart);
    navbar?.addEventListener("mousemove", handleMove);
    navbar?.addEventListener("touchmove", handleMove);
    navbar?.addEventListener("mouseup", handleEnd);
    navbar?.addEventListener("touchend", handleEnd);

    return () => {
      navbar?.removeEventListener("mousedown", handleStart);
      navbar?.removeEventListener("touchstart", handleStart);
      navbar?.removeEventListener("mousemove", handleMove);
      navbar?.removeEventListener("touchmove", handleMove);
      navbar?.removeEventListener("mouseup", handleEnd);
      navbar?.removeEventListener("touchend", handleEnd);
    };
  }, [userId]);

  return (
    <nav
      ref={navbarRef}
      className="sticky top-3 h-16 shadow-paper bg-white rounded-xl flex flex-row justify-between items-center md:px-3 px-3 overflow-x-hidden z-10"
    >
      <div className="nav-left flex gap-3">
        <Link href={`/profile/${userInfo?.id}`} className="nav-item">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant={getButtonVariant(`/profile/${userInfo?.id}`)}>
                  <FontAwesomeIcon icon={faFolder} className="w-6 h-6 sm:w-6 sm:h-6  transition duration-300" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Home</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Link>
        <Link href="/about" className="nav-item">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant={getButtonVariant("/about")}>
                  <FontAwesomeIcon icon={faUserAstronaut} className="w-6 h-6 sm:w-6 sm:h-6 transition duration-300" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>About</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Link>

        <Link href="/certificate" className="nav-item">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant={getButtonVariant("/certificate")}>
                  <FontAwesomeIcon icon={faAward} className="w-6 h-6 sm:w-6 sm:h-6 transition duration-300" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Certificate</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Link>

        <Link href="/education" className="nav-item">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant={getButtonVariant("/education")}>
                  <FontAwesomeIcon icon={faGraduationCap} className="w-6 h-6 sm:w-6 sm:h-6 transition duration-300" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Education</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Link>

        {/* {userInfo?.workEmail ? (
          <Link href={`mailto:${userInfo?.workEmail}`} className={"me-3"}>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ash">
                    <FontAwesomeIcon icon={faEnvelope} className="w-6 h-6 sm:w-6 sm:h-6  transition duration-300" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{userInfo?.workEmail}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Link>
        ) : (
          <Link href={`mailto:${userInfo?.email}`} className={"me-3"}>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ash">
                    <Mail className="w-6 h-6 sm:w-6 sm:h-6  transition duration-300" strokeWidth={2.2} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Contact</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Link>
        )} */}

        <SignedIn>
          <Link href="/manage" className="nav-item">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant={getButtonVariant("/manage")}>
                    <FolderCog className="transition duration-300" strokeWidth={2.2} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Manage</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Link>
          <div className="nav-item">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ash">
                    <UserButton
                      appearance={{
                        elements: {
                          avatarBox: {
                            width: "1.65rem",
                            height: "1.65rem",
                          },
                        },
                      }}
                      afterSignOutUrl="/home"
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Account</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </SignedIn>
      </div>

      <SignedIn>
        <div className="px-3">
          <div className="h-[15px] bg-gray-200 w-[2px]"></div>
        </div>
      </SignedIn>

      <div className="nav-right flex gap-3">
        <SignedIn>
          {userInfo?.role == "ADMIN" && (
            <Link href="/admin/dashboard" className="nav-item">
              <Button variant={"sky"}>
                <FontAwesomeIcon icon={faCrown} color="#183153" className="me-2" />
                Admin
              </Button>
            </Link>
          )}
        </SignedIn>

        <Link href={`mailto:${userInfo?.workEmail ? userInfo?.workEmail : userInfo?.email}`} className="ms-3">
          <Button variant={"ocean"} className="font-semibold">
            <FontAwesomeIcon icon={faPaperPlane} className="mx-2" color="#ffffff" />
            Contact
          </Button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
