import React, { useCallback, useEffect, useState } from 'react';
import { FaBars, FaChevronDown, FaChevronRight, FaTachometerAlt, FaTh, FaUsers, FaBookOpen, FaLaptop, FaFileAlt   } from 'react-icons/fa';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import Header from './Header';
import Login from '../pages/Login';
import PropTypes from 'prop-types';
import axios from "axios";
import { useSessionStorage } from "context/SessionStorageContext";
import { useClearStorage } from 'utils/useClearStorage';

const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;
const LOGIN_ERR = process.env.REACT_APP_LOGIN_ERR;

const Sidebar = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeSubMenu, setActiveSubMenu] = useState(null);
  const [menuItem, setMenuItem] = useState();
  const location = useLocation();
  const { empno, token } = useSessionStorage();
  const navigate = useNavigate();
  const { clearStorage } = useClearStorage();

  const toggle = () => setIsOpen(!isOpen);
  const toggleSubMenu = (menuName) => setActiveSubMenu(activeSubMenu === menuName ? null : menuName);

  const iconMap = {
    "FaTachometerAlt": <FaTachometerAlt />,
    "FaTh": <FaTh />, 
    "FaUsers": <FaUsers />, 
    "FaBookOpen": <FaBookOpen />,
    "FaLaptop": <FaLaptop />,
    "FaFileAlt" : <FaFileAlt />
  };

  const getEmployee = useCallback(() => {
    axios.get(BASE_API_URL + 'employee-details/employee-menu/' + empno, { headers: { Authorization: `Bearer ${token}` } }).then((response) => {
      if (response?.data?.result === true) {
        setMenuItem(response?.data?.menus);
      } else if (response?.data?.result === false) {
        if (response.data.message === "Token Expired") {
          clearStorage();
          navigate('/');
          sessionStorage.setItem("loginErr", LOGIN_ERR);
        }
      }
    })
  }, [navigate, token, empno, clearStorage, setMenuItem])

  useEffect(() => {
    if (token) {
      getEmployee();
    }
  }, [getEmployee, token, empno]);

  const isMenuActive = (path) => {
    return location.pathname === path;
  };

  const renderMenu = (item) => {
    if (item.subMenu) {
      return renderSubMenu(item);
    } else {
      return (
        <NavLink to={item.path} key={item.path} className={`link ${isMenuActive(item.path) ? 'active' : ''}`} activeclassname='active'>
          <div className='icon'>{iconMap[item.icon]}</div>
          <div style={{ display: isOpen ? 'block' : 'none' }} className='link_text'>
            {item.name}
          </div>
        </NavLink>
      );
    }
  };

  const toggleOrClose = (item) => {
    if (item.name === 'Master' || item.name === 'Employees' || item.name === 'Static Page Content' || item.name === 'Website' || item.name === 'Seo') {
      toggleSubMenu(item.name);
    } else {
      setIsOpen(!isOpen);
    }
  };

  const renderSubItems = (item) => {
    return (
      <div className={`subitems ${activeSubMenu === item.name ? 'open' : ''}`}
        style={{
          padding: isOpen && activeSubMenu === item.name ? '10px 0px' : '0px',
          margin: isOpen && activeSubMenu === item.name ? '5px' : '0px',
          border: isOpen && activeSubMenu === item.name ? '1px solid rgba(234, 134, 59, 0.3)' : '0px',
        }}
      >
        {item?.subMenu?.map((subItem, subIndex) => (
          <NavLink to={subItem.path} key={subItem.path} className={`link submenu-link ${isMenuActive(subItem.path) ? 'active' : ''}`}
            activeclassname='active'
            style={{
              display: isOpen && activeSubMenu === item.name ? 'block' : 'none',
            }}
          >
            <div className='link_text icon'>{iconMap[subItem.icon]} {subItem.name}</div>
          </NavLink>
        ))}
      </div>
    );
  };

  const renderSubMenu = (item) => {
    return (
      <div key={item.name} className='submenu'>
        <div className='link' onClick={() => toggleOrClose(item)} onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === 'Space') {
            toggleOrClose(item);
          }
        }}
          tabIndex={0}
        >
          <div className='icon'>{iconMap[item.icon]}</div>
          <div style={{ display: isOpen && (item.name === 'Master' || item.name === 'Employees' || item.name === 'Static Page Content' || item.name === 'Website' || item.name === 'Seo') ? 'block' : 'none' }} className='link_text'>
            {item.name}
            {item.name === activeSubMenu ? (<FaChevronDown className='submenu-arrow' />) : (<FaChevronRight className='submenu-arrow' />)}
          </div>
        </div>
        {(item.name === 'Master' || item.name === 'Employees' || item.name === 'Static Page Content' || item.name === 'Website' || item.name === 'Seo') && renderSubItems(item)}
      </div>
    );
  };

  return (
    <>
      {location.pathname !== '/' && location.pathname !== '/signup' && (
        <div className='wrapper'>
          <div style={{ width: isOpen ? '320px' : '50px' }} className='sidebar'>
            <div className='top_section' style={{ padding: isOpen ? '20px 15px' : '20px 5px' }}>
              <div style={{ display: isOpen ? 'block' : 'none' }} >
                <img src={process.env.PUBLIC_URL + "/assets/img/logo.png"} className='logo' alt='accre health' onClick={toggle} />
              </div>
              <div style={{ display: isOpen ? 'none' : 'block', }} >
                <img src={`${process.env.PUBLIC_URL}/assets/img/favicon.png`} style={{ width: '32px', cursor: 'pointer' }} alt='accre health' onClick={toggle} />
              </div>
              <div style={{ display: isOpen ? 'block' : 'none', marginLeft: isOpen ? '40px' : '0px' }} className='bars'>
                <FaBars onClick={toggle} />
              </div>
            </div>
            {menuItem?.map((item, index) => renderMenu(item))}
          </div>
          <main className="content">
            <Header />
            {children}
          </main>
        </div>
      )}
      {location.pathname === '/' && (<div><Login /></div>)}
    </>
  );
};

Sidebar.propTypes = {
  children: PropTypes.any
}

export default Sidebar;