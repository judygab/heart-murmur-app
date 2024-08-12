import { NavbarMobile } from "@/components/navbar/navbar-mobile";
import { NavbarUserLinks } from "@/components/navbar/navbar-user-links";
import { buttonVariants } from "@/components/ui/button";
import { Stethoscope, ScanTextIcon } from "lucide-react";
import Link from "next/link";
import { FC } from "react";

export const NavBar: FC = () => {
  return (
    <>
      <div className="animate-in fade-in w-full">
        <nav className="container px-6 md:px-8 py-4">
          <div className="flex items-center">
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <div className="flex items-center">
                <Stethoscope className="w-8 h-8 mr-2 inline text-red-500" />{" "}
                <span className="text-xl font-semibold tracking-tighter text-white mr-6">
                  Cardio <span className="text-red-500">AI</span>
                </span>
              </div>
            </Link>
            <div className="hidden md:flex justify-between grow">
              <div>
                <Link href="#1" className={buttonVariants({ variant: "link" })}>
                  Item 1
                </Link>
                <Link href="#2" className={buttonVariants({ variant: "link" })}>
                  Item 2
                </Link>
                <Link href="#3" className={buttonVariants({ variant: "link" })}>
                  Item 3
                </Link>
              </div>
            </div>
            <div className="grow md:hidden flex justify-end">
              <NavbarMobile />
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};
