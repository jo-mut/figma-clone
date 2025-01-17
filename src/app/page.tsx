"use client"
import { CollaborativeApp } from "@/components/CollaborativeApp";
import { Room } from "./Room";
import Live from "@/components/Live";
import { use } from "react";

export default function Page() {
  return (
    <div>
      <h1 className="text-white">Live blocks</h1>
      <Live/>
    </div>
  );
}