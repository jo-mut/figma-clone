"use client"
import { CollaborativeApp } from "@/components/CollaborativeApp";
import { Room } from "./Room";
import Live from "@/components/Live";
import { act, use, useEffect, useRef, useState } from "react";
import Navbar from "@/components/Navbar";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";
import { fabric } from "fabric";
import { handleCanvaseMouseMove, handleCanvasMouseDown, handleCanvasMouseUp, handleCanvasObjectModified, handleCanvasObjectScaling, handleCanvasSelectionCreated, handlePathCreated, handleResize, initializeFabric, renderCanvas } from "../../lib/canvas";
import { ActiveElement, Attributes } from "../../types/type";
import { useMutation, useRedo, useStorage, useUndo } from "@liveblocks/react";
import { defaultNavElement } from "../../constants";
import { handleDelete, handleKeyDown } from "../../lib/key-events";
import { handleImageUpload } from "../../lib/shapes";

export default function Page() {

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const isDrawing = useRef<boolean>(false);
  const shapeRef = useRef<fabric.Object | null>(null);
  const selectedShapeRef = useRef<fabric.Object | null>(null);
  const activeObjectRef = useRef<fabric.Object | null>(null)
  const canvasObjects = useStorage((root) => root.canvasObject)
  const undo = useUndo();
  const redo = useRedo();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const isEditingRef = useRef<boolean>(false);
  const [elementAttributes, setElementAttributes] = useState<Attributes>({
    width: '',
    height: '',
    fontSize: '',
    fontFamily: '',
    fontWeight: '',
    fill: '#aabbcc',
    stroke: '#aabbcc',
  });

  const [activeElement, setActiveElement] = useState<ActiveElement>({
    name: '',
    value: '',
    icon: ''
  });


  const deleteAllShapes = useMutation(({ storage }) => {
    const canvasObject = storage.get("canvasObject");

    if (!canvasObject || canvasObject.size == 0) {
      return true
    }

    for (const [key, value] of canvasObject.entries()) {
      canvasObject.delete(key)
    }

    return canvasObject.size == 0;

  }, [])

  const deleteShapeFromStorage = useMutation(({ storage }, objectId) => {
    const canvasObjects = storage.get('canvasObject');
    canvasObjects.delete(objectId)
  }, [])

  const syncShapeInStorage = useMutation(({ storage }, object) => {
    if (!object) return;

    const { objectId } = object
    const shapeData = object.toJSON();
    shapeData.objectId = objectId;

    const canvasObject = storage.get('canvasObject') || {};
    canvasObject.set(objectId, shapeData);

  }, [])



  const handleActiveElement = (element: ActiveElement) => {
    setActiveElement(element)

    switch (element?.value) {
      case 'reset':
        deleteAllShapes()
        fabricRef.current.clear();
        setActiveElement(defaultNavElement)
        break;

      case 'delete':
        handleDelete(fabricRef.current as any, deleteShapeFromStorage)
        setActiveElement(defaultNavElement)
        break

      case 'image':
        imageInputRef.current.click();
        isDrawing.current = false;

        if (fabricRef.current) {
          fabricRef.current.isDrawingMode = false
        }

        break

      default:
        break;

    }

    selectedShapeRef.current = element?.value as string
  }

  useEffect(() => {
    const canvas = initializeFabric({ canvasRef, fabricRef });


    canvas.on('mouse:down', (options: any) => {
      handleCanvasMouseDown({
        options,
        canvas,
        isDrawing,
        shapeRef,
        selectedShapeRef
      });
    })


    canvas.on('mouse:move', (options: any) => {
      handleCanvaseMouseMove({
        options,
        canvas,
        isDrawing,
        shapeRef,
        selectedShapeRef,
        syncShapeInStorage
      });
    })

    canvas.on('mouse:up', () => {
      handleCanvasMouseUp({
        canvas,
        isDrawing,
        shapeRef,
        selectedShapeRef,
        syncShapeInStorage,
        setActiveElement,
        activeObjectRef
      });
    })

    canvas.on('object:modified', (options: any) => {
      handleCanvasObjectModified({
        options,
        syncShapeInStorage,
      })
    })

    canvas.on('selection:created', (options: any) => {
      handleCanvasSelectionCreated({
        options,
        isEditingRef,
        setElementAttributes
      })
    })

    canvas.on('object:scaling', (options: any) => {
      handleCanvasObjectScaling({
        options,
        setElementAttributes
      })
    })

    canvas.on('path:created', (options: any) => {
      handlePathCreated({
        options,
        syncShapeInStorage
      })
    })


    window.addEventListener('resize', () => {
      handleResize({ fabricRef });
    })

    window.addEventListener('keydown', (e: KeyboardEvent) => {
      handleKeyDown({
        e,
        canvas: fabricRef.current,
        undo,
        redo,
        syncShapeInStorage,
        deleteShapeFromStorage
      })
    })


    return () => {
      canvas.dispose();
    }

  }, [])

  useEffect(() => {
    renderCanvas({
      fabricRef,
      canvasObjects,
      activeObjectRef
    })
  }, [canvasObjects])

  return (
    <div className="h-screen overflow-hidden">
      <Navbar
        imageInputRef={imageInputRef}
        activeElement={activeElement}
        handleImageUpload={(e: any) => {
          e.stopPropagation()
          handleImageUpload({
            file: e.target.files[0],
            canvas: fabricRef as any,
            shapeRef,
            syncShapeInStorage
          })
        }}
        handleActiveElement={handleActiveElement} />
      <section className="flex h-full flex-row">
        <LeftSidebar
          allShapes={canvasObjects && Array.from(canvasObjects)} />
        <Live
          undo={undo}
          redo={redo}
          canvasRef={canvasRef} />
        <RightSidebar
          fabricRef={fabricRef}
          elementAttributes={elementAttributes}
          setElementAttributes={setElementAttributes}
          isEditingRef={isEditingRef}
          activeObjectRef={activeObjectRef}
          syncShapeInStorage={syncShapeInStorage}
        />
      </section>
    </div>
  );
}