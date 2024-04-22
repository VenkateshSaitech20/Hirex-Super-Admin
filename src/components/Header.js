import React, { useCallback, useEffect } from 'react';
import { Container, Dropdown, Nav, Navbar } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useSessionStorage } from "context/SessionStorageContext";
import { useClearStorage } from 'utils/useClearStorage';
import axios from 'axios';
const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;
const LOGIN_ERR = process.env.REACT_APP_LOGIN_ERR;

const Header = ({ isOpen }) => {
    const { username, setUsername, token, setToken, empno, setEmpno } = useSessionStorage();
    const navigate = useNavigate();
    const location = useLocation();
    const { clearStorage } = useClearStorage();

    useEffect(() => {
        if (!username || !token || !empno) {
            let empNo = localStorage.getItem("empno");
            if (empNo) {
                axios.post(BASE_API_URL + 'login/' + empNo).then((response) => {
                    if (response?.data?.result === true) {
                        setUsername(response.data.username);
                        setEmpno(response.data.empno);
                        setToken(response.data.token);
                        navigate(location.pathname);
                    } else {
                        navigate("/");
                    }
                })
            } else {
                navigate("/");
            }
        }
    }, [navigate, username, token, empno, setUsername, setToken, setEmpno, location]);

    const handleLogout = () => {
        clearStorage();
        navigate("/");
    }

    const isPathMatching = (path, targetPath) => {
        return path === targetPath;
    };

    const isSubPathMatching = (subMenu, targetPath) => {
        return subMenu?.some(subItem => subItem.path === targetPath);
    };

    const getEmployee = useCallback(() => {
        axios.get(BASE_API_URL + 'employee-details/employee-menu/' + empno, { headers: { Authorization: `Bearer ${token}` } }).then((response) => {
            if (response?.data?.result === true) {
                const menus = response?.data?.menus;
                const currentPath = '/' + location.pathname.split('/')[1];
                let matchFound = menus?.some(menuItem => {
                    return isPathMatching(menuItem.path, currentPath) || isSubPathMatching(menuItem.subMenu, currentPath);
                });
                if (!matchFound) {
                    navigate('/dashboard');
                }
            } else if (response?.data?.result === false) {
                if (response.data.message === "Token Expired") {
                    clearStorage();
                    navigate('/');
                    sessionStorage.setItem("loginErr", LOGIN_ERR);
                }
            }
        })
    }, [navigate, token, empno, clearStorage, location]);

    useEffect(() => {
        if (token && empno) {
            getEmployee();
        }
    }, [getEmployee, token, empno]);

    return (
        <div className='header'>
            <Navbar>
                <Container>
                    <Navbar className='px-4 py-1 ms-auto'>
                        <Nav>
                            <Dropdown className='user-dropdown'>
                                <Dropdown.Toggle as={'div'} id="dropdown-basic">
                                    <img src={`${process.env.PUBLIC_URL}/assets/img/avatar/avatar.png`} alt="avatar" className='user-img' />
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    <Dropdown.Item href="#/action-1">
                                        <h6 className="mb-2">Admin</h6>
                                        <span>{username}</span>
                                    </Dropdown.Item>
                                    <Dropdown.Divider />
                                    <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Nav>
                    </Navbar>
                </Container>
            </Navbar>
        </div>
    )
}

Header.propTypes = {
    isOpen: PropTypes.any
}

export default Header