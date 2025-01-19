"use client";

import { ReactNode } from "react";
import {
    LiveblocksProvider,
    RoomProvider,
    ClientSideSuspense,
} from "@liveblocks/react/suspense";
import { LiveMap } from "@liveblocks/client";

const api_key = process.env.NEXT_PUBLIC_LIVEBLOCK_API_KEY!

export function Room({ children }: { children: ReactNode }) {
    return (
        <LiveblocksProvider publicApiKey={api_key}>
            <RoomProvider
                id="my-room"
                initialPresence={{
                    cursor: null, cursorColor: null, editingText: null
                }}
                initialStorage={{
                    canvasObject: new LiveMap()
                }}>
                <ClientSideSuspense fallback={<div>Loading…</div>}>
                    {children}
                </ClientSideSuspense>
            </RoomProvider>
        </LiveblocksProvider >
    );
}