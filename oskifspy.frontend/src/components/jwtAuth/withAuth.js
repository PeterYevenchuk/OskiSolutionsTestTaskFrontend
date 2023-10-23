import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import jwt from 'jwt-decode';

function useAuth() {
    const navigate = useNavigate();
    
    const refreshToken = localStorage.getItem('refreshToken');

    const decodeToken = (token) => {
        if (!token || typeof token !== 'string') {
            return null;
        }
        try {
            return jwt(token);
        } catch (error) {
            console.error('Error decoding the token:', error);
            return null;
        }
    };

    const initializeAccessToken = () => {
        const storedToken = localStorage.getItem('accessToken');
        const decoded = decodeToken(storedToken);
        
        if (!decoded) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            navigate('/login');
            return null;
        }
        
        return storedToken;
    };

    const [accessToken, setAccessToken] = useState(() => {
        return initializeAccessToken();
    });
    
    const checkAccessToken = (token) => {
        const decodedToken = decodeToken(token);
        if (!decodedToken) return true;
        const expirationTime = decodedToken.exp * 1000;
        return Date.now() >= expirationTime;
    };

    const isTokenExpiringSoon = (token) => {
        const decodedToken = decodeToken(token);
        if (!decodedToken) return false;
        const expirationTime = decodedToken.exp * 1000;
        const currentTime = Date.now();
        const timeToExpire = expirationTime - currentTime;
        return timeToExpire <= 60000;
    };

    useEffect(() => {
        const decodedToken = decodeToken(accessToken);
        if (!accessToken || !decodedToken || checkAccessToken(accessToken)) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            navigate('/');
        } else {
            const tokenRefreshInterval = setInterval(() => {
                if (isTokenExpiringSoon(accessToken)) {
                    const userId = decodedToken?.nameid;
                    if (userId) {
                        refreshAccessToken(refreshToken, userId, accessToken);
                    }
                }
            }, 60000);
    
            return () => {
                clearInterval(tokenRefreshInterval);
            };
        }
    }, [accessToken, refreshToken, navigate]);    

    return accessToken;
}

const refreshAccessToken = async (refreshToken, userId, accessToken) => {
    try {
        const response = await axios.post('/api/Auth/refresh-token', {
            refreshToken,
            accessToken,
            userId,
        });

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;

        localStorage.setItem('accessToken', newAccessToken);
        localStorage.setItem('refreshToken', newRefreshToken);
    } catch (error) {
        console.error('Error refreshing access token:', error);
    }
};

export default useAuth;
