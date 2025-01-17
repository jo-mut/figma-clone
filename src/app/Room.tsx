"use client";

import { ReactNode } from "react";
import {
    LiveblocksProvider,
    RoomProvider,
    ClientSideSuspense,
} from "@liveblocks/react/suspense";

const api_key = process.env.NEXT_PUBLIC_LIVEBLOCK_API_KEY!

export function Room({ children }: { children: ReactNode }) {
    return (
        <LiveblocksProvider publicApiKey={api_key}>
            <RoomProvider id="my-room">
                <ClientSideSuspense fallback={<div>Loading…</div>}>
                    {children}
                </ClientSideSuspense>
            </RoomProvider>
        </LiveblocksProvider>
    );
}