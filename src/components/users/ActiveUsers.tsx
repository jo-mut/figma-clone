import { useOthers, useSelf } from '@liveblocks/react';
import React, { memo, useMemo } from 'react'
import { Avatar } from './Avatar';
import styles from './index.module.css';
import { generateRandomName } from '../../../lib/utils';

const ActiveUsers = () => {
    const users = useOthers();
    const currentUser = useSelf();
    const hasMoreUsers = users.length > 3;

    const memoizedUsers = useMemo(() => {
        return (
            <div className="flex items-center justify-center gap-1 py-3">
                <div className="flex fixed pl-3">
                    {currentUser && (
                        <Avatar name="You" otherStyles='border-[3px] border-primary-green' />
                    )}

                    {users.slice(0, 3).map(({ connectionId, info }) => {
                        return (
                            <Avatar key={connectionId} otherStyles="-ml-3" name={generateRandomName()} />
                        );
                    })}

                    {hasMoreUsers && <div className={styles.more}>+{users.length - 3}</div>}

                </div>
            </div>
        )
    }, [users.length])


    return memoizedUsers
}


export default ActiveUsers;