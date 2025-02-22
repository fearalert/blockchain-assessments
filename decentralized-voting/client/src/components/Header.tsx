/** @format */

import { Link, NavLink } from 'react-router-dom';
import useWeb3 from '../hooks/useWeb3';

const Header = () => {
  const { walletAddress, connectWallet } = useWeb3();

  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <Link
        to="/"
        className="flex items-center gap-2">
        <span className="text-xl font-bold">Decentralized Voting DApp</span>
      </Link>
      <nav className="flex items-center gap-4">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? 'text-blue-500 font-semibold' : 'text-gray-600'
          }>
          Home
        </NavLink>
        <NavLink
          to="/results"
          className={({ isActive }) =>
            isActive ? 'text-blue-500 font-semibold' : 'text-gray-600'
          }>
          Results
        </NavLink>
        <NavLink
          to="/about"
          className={({ isActive }) =>
            isActive ? 'text-blue-500 font-semibold' : 'text-gray-600'
          }>
          About
        </NavLink>
        {walletAddress ? (
          <span className="text-gray-600">
            {walletAddress.substring(0, 6)}...{walletAddress.slice(-4)}
          </span>
        ) : (
          <button
            onClick={connectWallet}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
            Connect Wallet
          </button>
        )}
      </nav>
    </header>
  );
};

export default Header;
