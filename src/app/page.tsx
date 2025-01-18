"use client"
import { CollaborativeApp } from "@/components/CollaborativeApp";
import { Room } from "./Room";
import Live from "@/components/Live";
import { use } from "react";
import Navbar from "@/components/Navbar";

export default function Page() {
  return (
    <div className="h-screen overflow-hidden">
      <Navbar />
      <section className="flex h-full flex-row">
        <Live />
      </section>
    </div>
  );
}