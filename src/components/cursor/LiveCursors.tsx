import React from 'react'
import { LiveCursorProps } from '../../../types/type'
import { COLORS } from '../../../constants';
import Cursor from './cursor';

const LiveCursors = ({ others }: LiveCursorProps) => {
  return others.map(({ connectionId, presence }) => {
    if (!presence?.cursor) return null;
    console.log("other presence", presence.message)
    return (
      <Cursor
        key={connectionId}
        x={presence.cursor.x}
        y={presence.cursor.y}
        message={presence.message}
        color={COLORS[Number(connectionId) % COLORS.length]} />
    )
  })
}

export default LiveCursors