"use client";

import Image from "next/image";
import { memo } from "react";
import { ActiveElement, NavbarProps } from "../../types/type";
import ActiveUsers from "./users/ActiveUsers";
import { navElements } from "../../constants";
import NewThread from "./comments/NewThread";
import ShapesMenu from "./ShapesMenu";
import { Button } from "./ui/button";


const Navbar = ({ activeElement, handleActiveElement }: NavbarProps) => {
    const isActive = (value: string | Array<ActiveElement>) =>
        (activeElement && activeElement.value === value) ||
        (Array.isArray(value) && value.some((val) => val?.value === activeElement?.value));
    return (
        <nav
            className="flex select-none items-center justify-between 
            gap-4 bg-primary-black px-5 text-white">
            <Image
                src="/assets/logo.svg"
                alt="FigPro Logo"
                width={58}
                height={20} />

            {navElements.map((item: any) => (
                <li
                    key={item.name}
                    onClick={() => {
                        if (Array.isArray(item.value)) return;
                        handleActiveElement(item);
                    }}
                    className={`group px-2.5 py-5 flex justify-center items-center
                ${isActive(item.value) ? "bg-primary-green" : "hover:bg-primary-grey-200"}
                `}>
                    {Array.isArray(item.icon) ? (
                        <ShapesMenu />
                    ) : item?.value === "comments" ? (
                        <NewThread>

                        </NewThread>
                    ) : (
                        <Button>
                        </Button>
                    )}
                </li>
            ))
            }

            <ActiveUsers />
        </nav >
    );
};

export default memo(Navbar, (prevProps, nextProps) => prevProps.activeElement === nextProps.activeElement);