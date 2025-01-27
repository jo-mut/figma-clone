import { useBroadcastEvent, useEventListener, useMyPresence, useOthers } from '@liveblocks/react'
import React, { useCallback, useEffect, useState } from 'react'
import LiveCursors from './cursor/LiveCursors';
import CursorChat from './cursor/CursorChat';
import { CursorMode, CursorState, Reaction, ReactionEvent } from '../../types/type';
import ReactionSelector from './reaction/ReactionButton';
import { stat } from 'fs';
import FlyingReaction from './reaction/FlyingReaction';
import useInterval from '../../hooks/useInterval';
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { shortcuts } from '../../constants';


type LiveProps = {
    undo: () => void
    redo: () => void
    canvasRef: React.RefObject<HTMLCanvasElement | null>
}

const Live = ({ canvasRef, undo, redo }: LiveProps) => {
    const others = useOthers();
    const [{ cursor }, updateMyPresence] = useMyPresence() as any;
    const [cursorState, setCursorState] = useState<CursorState>({
        mode: CursorMode.Hidden,
    })

    const [reactions, setReactions] = useState<Reaction[]>([]);
    const broadcast = useBroadcastEvent();


    useInterval(() => {
        setReactions((reactions) => reactions.filter((reaction) => {
            return Date.now() - reaction.timestamp < 5000
        }))
    }, 1000)

    useInterval(() => {
        if (cursorState.mode === CursorMode.Reaction &&
            cursorState.isPressed && cursor) {
            setReactions((reactions) => reactions.concat([
                {
                    point: { x: cursor.x, y: cursor.y },
                    value: cursorState.reaction,
                    timestamp: Date.now()
                }
            ]))

            broadcast({
                x: cursor?.x,
                y: cursor?.y,
                value: cursorState.reaction,
            })
        }
    }, 100)

    useEventListener((eventData) => {
        const event = eventData.event as ReactionEvent;
        setReactions((reactions) => reactions.concat([
            {
                point: { x: event.x, y: event.y },
                value: event.value,
                timestamp: Date.now()
            }
        ]))
    })

    const handlePointerMove = useCallback((event: React.PointerEvent) => {
        event.preventDefault();

        if (cursor == null || cursorState.mode !== CursorMode.ReactionSelector) {
            const x = event.clientX - event.currentTarget.getBoundingClientRect().x
            const y = event.clientY - event.currentTarget.getBoundingClientRect().y
            updateMyPresence({ cursor: { x, y } })
        }
    }, [])

    const handlePointerLeave = useCallback((event: React.PointerEvent) => {
        setCursorState({ mode: CursorMode.Hidden })
        updateMyPresence({ cursor: null, message: null })
    }, [])

    const handlePointerUp = useCallback((event: React.PointerEvent) => {
        setCursorState((state: CursorState) =>
            cursorState.mode === CursorMode.Reaction ? { ...state, isPressed: true } : state
        )
    }, [cursorState.mode, setCursorState])

    const handlePointerDown = useCallback((event: React.PointerEvent) => {

        const x = event.clientX - event.currentTarget.getBoundingClientRect().x
        const y = event.clientY - event.currentTarget.getBoundingClientRect().y
        updateMyPresence({ cursor: { x, y } })

        setCursorState((state: CursorState) =>
            cursorState.mode === CursorMode.Reaction ? { ...state, isPressed: true } : state
        )

    }, [cursorState.mode, setCursorState])

    const handleSetReactions = useCallback((reaction: string) => {
        setCursorState({ mode: CursorMode.Reaction, reaction, isPressed: false })
    }, [])


    const handleContextMenuClick = useCallback((key: string) => {
        switch (key) {
            case 'Chat':
                setCursorState({
                    mode: CursorMode.Chat,
                    previousMessage: null,
                    message: ''
                })
                break;
            case 'Reactions':
                setCursorState({
                    mode: CursorMode.ReactionSelector
                })
                break;
            case "Undo":
                undo()
                break
            case "Redo":
                redo()
                break;
        }
    }, [])

    useEffect(() => {
        const onKeyUp = (event: KeyboardEvent) => {
            if (event.key === "/") {
                setCursorState({
                    mode: CursorMode.Chat,
                    previousMessage: null,
                    message: ''
                })
            } else if (event.key === "Escape") {
                updateMyPresence({ message: '' })
                setCursorState({
                    mode: CursorMode.Hidden
                })
            } else if (event.key === "e") {
                setCursorState({
                    mode: CursorMode.ReactionSelector,
                })
            }
        }

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === '/') {
                event.preventDefault
            }
        }

        window.addEventListener('keyup', onKeyUp);
        window.addEventListener('keydown', onKeyDown);

        return () => {
            window.removeEventListener('keyup', onKeyUp);
            window.removeEventListener('keydown', onKeyDown);
        }
    }, [updateMyPresence])

    return (
        <ContextMenu>
            <ContextMenuTrigger
                id="canvas"
                onPointerMove={handlePointerMove}
                onPointerDown={handlePointerDown}
                onPointerLeave={handlePointerLeave}
                onPointerUp={handlePointerUp}
                className='relative h-full w-full flex flex-1 justify-cente'>

                <canvas ref={canvasRef} />

                {reactions.map((r: any) => (
                    <FlyingReaction
                        key={r.timestamp.toString()}
                        x={r.point.x}
                        y={r.point.y}
                        timestamp={r.timestamp}
                        value={r.value} />
                ))}

                {cursor &&
                    <CursorChat
                        cursor={cursor}
                        setCursorState={setCursorState}
                        updateMyPresence={updateMyPresence}
                        cursorState={cursorState} />}

                {cursorState.mode === CursorMode.ReactionSelector && (
                    <ReactionSelector
                        setReaction={handleSetReactions} />
                )}

                <LiveCursors others={others} />
            </ContextMenuTrigger>
            <ContextMenuContent>
                {shortcuts.map((item: any) => (
                    <ContextMenuItem
                        className='right-menu-item'
                        key={item.key}
                        onClick={() => handleContextMenuClick(item?.name)}>
                        <p className='text-primary-grey-300 text-xs'>{item.name}</p>
                    </ContextMenuItem>
                ))}
            </ContextMenuContent>
        </ContextMenu>
    )
}

export default Live