/** @format */

import useWeb3 from '../hooks/useWeb3';

const Header = () => {
  const { walletAddress, connectWallet } = useWeb3();

  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Decentralized Voting DApp</h1>
      <div>
        {walletAddress ? (
          <span className="text-gray-600">
            Connected: {walletAddress.substring(0, 6)}...
            {walletAddress.slice(-4)}
          </span>
        ) : (
          <button
            onClick={connectWallet}
            className="bg-blue-500 text-white px-4 py-2 rounded">
            Connect Wallet
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
