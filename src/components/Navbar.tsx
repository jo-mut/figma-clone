"use client";

import Image from "next/image";
import { memo } from "react";
import { ActiveElement, NavbarProps } from "../../types/type";
import ActiveUsers from "./users/ActiveUsers";
import { navElements } from "../../constants";
import ShapesMenu from "./ShapesMenu";
import { Button } from "./ui/button";
import { NewThread } from "./comments/NewThread";


const Navbar = ({ activeElement, handleActiveElement, imageInputRef, handleImageUpload }: NavbarProps) => {
    const isActive = (value: string | Array<ActiveElement>) =>
        (activeElement && activeElement.value === value) ||
        (Array.isArray(value) && value.some((val) => val?.value === activeElement?.value));
    return (
        <nav
            className="flex select-none items-center 
            gap-4 bg-primary-black px-5 text-white ">

            <p className="font-bold font-4xl mr-20">Dezaino</p>

            <ul className="flex">
                {navElements.map((item: ActiveElement | any) => (
                    <li
                        key={item?.name}
                        onClick={() => {
                            if (Array.isArray(item?.value)) return;
                            handleActiveElement(item);
                        }}
                        className={`group px-2.5 py-5 flex justify-center items-center
                ${isActive(item?.value) ? "bg-primary-green" : "hover:bg-primary-grey-200"}`}>
                        {Array.isArray(item?.value) ? (
                            <ShapesMenu
                                item={item}
                                imageInputRef={imageInputRef}
                                handleImageUpload={handleImageUpload}
                                handleActiveElement={handleActiveElement}
                                activeElement={activeElement} />
                        ) : item?.value === "comments" ? (
                            <NewThread>
                                <Button className="relative w-5 h-5 object-contain">
                                    <Image
                                        src={item.icon}
                                        alt={item.name}
                                        fill
                                        className={isActive(item?.value) ? "invert" : ""}
                                    />
                                </Button>
                            </NewThread>
                        ) : (
                            <Button className="relative w-5 h-5 object-contain">
                                <Image
                                    src={item.icon}
                                    alt={item.name}
                                    fill
                                    className={isActive(item.value) ? "invert" : ""}
                                />
                            </Button>
                        )}
                    </li>
                ))}
            </ul>

            <div className="flex flex-1 justify-end items-cente pr-5">
            <ActiveUsers />
            </div>
        </nav >
    );
};

export default memo(Navbar, (prevProps, nextProps) => prevProps.activeElement === nextProps.activeElement);