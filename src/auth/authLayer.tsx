import { useAtom } from 'jotai';
import React, { useEffect } from 'react';
import { Outlet } from 'react-router';
import { userAtom } from '../jotai/userAtom';
import { getAuthToken } from '../api/getAuthToken';
import { base_path } from '../api/api';
import { useQuery } from '@tanstack/react-query';

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

    useEffect(() => {
        if (data) {
            setUser({ id: data.id, username: data.username });
        }
    }, [data]);
    if (isLoading) {
        return <div>Loading...</div>;
    }
    return (

        <Outlet />
    );
}

export default AuthLayer;