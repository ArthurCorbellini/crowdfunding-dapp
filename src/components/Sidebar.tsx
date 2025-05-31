import { NavLink } from 'react-router-dom';
import { useBalance, useDisconnect, useWallet } from '@fuels/react';

import { isLocal, renderFormattedBalance } from '../lib';
import { routes } from '../routes/routes';
import { useBaseAssetId } from '../hooks/useBaseAssetId';
import Button from './Button';
import LocalFaucet from './LocalFaucet';

const Sidebar = () => {
  const { wallet } = useWallet();
  const { baseAssetId } = useBaseAssetId();
  const { disconnect } = useDisconnect();

  const address = wallet?.address.toB256();
  const { balance, refetch } = useBalance({ address, assetId: baseAssetId });

  return (
    <aside className="w-64 h-screen bg-stone-900 flex flex-col justify-between">
      <div>
        <div className="text-2xl font-bold text-center py-6 border-b border-stone-700">
          CrowdCoins
        </div>
        <ul className="mt-4">
          {routes.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `block px-6 py-3 hover:bg-stone-800 transition ${isActive
                  ? 'bg-stone-800 font-semibold border-l-4 border-stone-400'
                  : ''
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </ul>
      </div>

      <div>
        <div className="p-4 py-3 bg-stone-800 border-stone-400 border-l-4 text-xs">
          <div className="mb-2">
            <p className="font-medium text-stone-300">Wallet address:</p>
            <p className="truncate font-mono">{address}</p>
          </div>
          <div className="mb-4">
            <p className="font-medium text-stone-300">Balance:</p>
            <p className="truncate font-mono">{balance ? `${renderFormattedBalance(balance)} ETH` : ""}</p>
          </div>
          {isLocal && <LocalFaucet refetch={refetch} />}
          <Button onClick={() => disconnect()} color="secondary" className="mt-2">
            Disconnect
          </Button>
        </div>

        <div className="px-6 py-3 border-t border-stone-700 text-sm text-stone-400">
          <p>v0.1.0</p>
          <p className="mt-1">Made with ❤️</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
