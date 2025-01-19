import React from 'react'
import Dimensions from './settings/Dimensions'
import Export from './settings/Export'
import Color from './settings/Color'
import Text from './settings/Text'
import { RightSidebarProps } from '../../types/type'
import { modifyShape } from '../../lib/shapes'

function RightSidebar({
    elementAttributes,
    setElementAttributes,
    activeObjectRef,
    syncShapeInStorage,
    fabricRef,
    isEditingRef
}: RightSidebarProps) {

    const handleInputChange = (property: string, value: string) => {
        if (!isEditingRef.current) isEditingRef.current = true;

        setElementAttributes((prev) => ({
            ...prev, [property]: value
        }))

        modifyShape({
            canvas: fabricRef.current as fabric.Canvas,
            property,
            value,
            activeObjectRef,
            syncShapeInStorage
        })
    }

    return (
        <div className='flex flex-col border-t border-primary-grey-200 bg-primary-black 
        text-primary-grey-300 min-2-[227px] sticky right-0 h-full max-sm:hidden select-none '>
            <h3 className='px-5 pt-4 tex-xs uppercase'>
                Design
            </h3>
            <span className='text-xs text-primary-grey-300 mt-3
             px-5 border-b border-primary pb-4'>
                Make changes to canvas
            </span>
            <Dimensions
                width={elementAttributes.width}
                height={elementAttributes.height}
                isEditingRef={isEditingRef}
                handleInputChange={handleInputChange} />
            <Text />
            <Color />
            <Color />
            <Export />
        </div>
    )
}

export default RightSidebar