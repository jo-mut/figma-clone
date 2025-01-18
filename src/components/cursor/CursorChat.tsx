import React, { useEffect } from 'react'
import { CursorChatProps, CursorMode } from '../../../types/type'
import CursorSVG from '../../../public/assets/CursorSVG'

const CursorChat = ({ cursor, cursorState, setCursorState, updateMyPresence }: CursorChatProps) => {

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateMyPresence({ message: event.target.value });
    setCursorState({
      mode: CursorMode.Chat,
      previousMessage: null,
      message: event.target.value,
    })
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    setCursorState({
      mode: CursorMode.Chat,
      previousMessage: cursorState.message,
      message: ''
    })
  }

  return (
    <div className='absolute top-0 left-0'
      style={{ transform: `translateX(${cursor.x}px) translateY(${cursor.y}px)` }}>
      {cursorState.mode === CursorMode.Chat && (
        <>
          <CursorSVG color='#000' />
          <div className='absolute top-5 left-2 bg-blue-500 px-4 text-sm 
         leading-relaxed text-white rounded-[20px]'
            onKeyUp={ (e) => e.stopPropagation() }>
            {cursorState.previousMessage && (
              <div>{cursorState.previousMessage}</div>
            )}
            <input
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder={cursorState.previousMessage ? ' ' : 'Type a message'}
              value={cursorState.message}
              maxLength={50}
              className="z-10 w-60 border-none bg-transparent text-white placeholde-blue-300 outline-none"
              autoFocus={true} />
          </div>
        </>
      )}
    </div>
  )
}

export default CursorChat