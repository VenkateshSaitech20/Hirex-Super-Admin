import { useNavigate } from 'react-router-dom';
import { useSessionStorage } from "context/SessionStorageContext"; 
import { useCallback  } from "react";

export const useClearStorage = () => {
    const { setUsername, setToken } = useSessionStorage();
    const navigate = useNavigate();

    const clearStorage = useCallback(() => {
        sessionStorage.removeItem('username');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('empno');
        localStorage.clear();
        setUsername(null);
        setToken(null);
        navigate('/');
    },[setUsername,setToken,navigate]);

    return { clearStorage };
};