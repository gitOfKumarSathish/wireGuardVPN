import { useAtom } from 'jotai';
import React, { useEffect } from 'react';
import { Outlet } from 'react-router';
import { userAtom } from '../jotai/userAtom';
import { getAuthToken } from '../api/getAuthToken';
import { base_path } from '../api/api';
import { useQuery } from '@tanstack/react-query';

import WifiLoader from '../utils/Loader';

function AuthLayer() {
    const [user, setUser] = useAtom(userAtom);

    const { isLoading, data } = useQuery({
        queryKey: ['user'],
        queryFn: async () => {
            const authToken = getAuthToken();
            if (!authToken) throw new Error("No auth token found");
            const response = await fetch(`${base_path}/api/users/me`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw errorData.detail;
            }

            return response.json();
        },

    });
    console.log(user);
    useEffect(() => {
        if (data?.id && data?.username && data?.role?.role) {
            setUser({ id: data.id, username: data.username, role: data.role.role });
        }
    }, [data]);

    if (isLoading) {
        return <div>
            <WifiLoader
                background={"transparent"}
                desktopSize={"150px"}
                mobileSize={"150px"}
                text={"Wifi Loader"}
                backColor="#E8F2FC"
                frontColor="#4645F6"
            />
        </div>;
    }
    return (

        <Outlet />
    );
}

export default AuthLayer;