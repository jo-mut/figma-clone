"use client"
import { CollaborativeApp } from "@/components/CollaborativeApp";
import { Room } from "./Room";
import Live from "@/components/Live";
import { act, use, useEffect, useRef, useState } from "react";
import Navbar from "@/components/Navbar";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";
import { fabric } from "fabric";
import { handleCanvasMouseDown, handleResize, initializeFabric } from "../../lib/canvas";
import { ActiveElement } from "../../types/type";

export default function Page() {

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const isDrawing = useRef<boolean>(false);
  const shapeRef = useRef<fabric.Object | null>(null);
  const selectedShapeRef = useRef<fabric.Object | null>('rectangle');
  const [activeElement, setActiveElement] = useState({
    name: '',
    value: '',
    icon: ''
  });

  const handleActiveElement = (element: ActiveElement) => {
    setActiveElement(element)
  }

  useEffect(() => {
    const canvas = initializeFabric({ canvasRef, fabricRef });


    canvas.on('mouse:down', (options) => {
      handleCanvasMouseDown({
        options,
        canvas,
        isDrawing,
        shapeRef,
        selectedShapeRef
      });
    })

    window.addEventListener('resize', () => {
      handleResize({ fabricRef });
    })

  }, [])

  return (
    <div className="h-screen overflow-hidden">
      <Navbar
        activeElement={activeElement}
        handleActiveElement={handleActiveElement} />
      <section className="flex h-full flex-row">
        <LeftSidebar />
        <Live canvasRef={canvasRef} />
        <RightSidebar />
      </section>
    </div>
  );
}