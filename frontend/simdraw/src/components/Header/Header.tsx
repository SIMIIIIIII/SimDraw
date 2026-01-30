import './Header.css'

import { Link, useNavigate, type NavigateFunction } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Logo from '../../images/logo.png';
import React from 'react';
import { SearchForm } from './SearchForm/SearchForm';
import { UserStatus } from './UserStatus/UserStatus';

const Header: React.FC = () => {
  const { user } = useAuth();
  const navigate : NavigateFunction = useNavigate();

  const onHomeClick = (e: React.MouseEvent<HTMLAnchorElement>) : void => {
    e.preventDefault();

    if (window.location.pathname === '/') {
      navigate('/');
      window.location.reload();
    } else {
      navigate('/');
    }
  };

  return (
    <nav>
      <ul>
        <li className="logo-container">
          <Link onClick={onHomeClick} to="/" className="logo">
            <img
              className="img1"
              src={Logo}
              alt="SimDraw Logo"
              loading="lazy"
            />
            <h2 className="sitename">SimDraw</h2>
          </Link>
        </li>

        <li className="search-container">
          <SearchForm>Search</SearchForm>
        </li>

        <li className="username-container">
          <UserStatus user={user}/>
        </li>
      </ul>
    </nav>
  );
};

export default Header;
