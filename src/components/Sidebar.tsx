import { NavLink } from 'react-router-dom';
import { useBalance, useWallet } from '@fuels/react';

import { isLocal } from '../lib';
import { routes } from '../routes/routes';
import { useBaseAssetId } from '../hooks/useBaseAssetId';
import LocalFaucet from './LocalFaucet';
import { ButtonDisconnect } from './buttons/ButtonDisconnect';
import { H1, H3, Mono, Muted } from './ui/my-typography';
import { toEth } from '../utils/currency-utils';

const Sidebar = () => {
  const { wallet } = useWallet();
  const { baseAssetId } = useBaseAssetId();

  const address = wallet?.address.toB256();
  const { balance, refetch } = useBalance({ address, assetId: baseAssetId });

  return (
    <aside className="w-72 h-screen bg-stone-900 flex flex-col justify-between">
      <div>
        <div className="border-b border-stone-700">
          <H1 className="text-center py-6">
            dFundr
          </H1>
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
        <div className="p-4 py-3 bg-stone-800 border-stone-400 rounded-md m-4">
          <H3 className="mb-2">Connected Wallet</H3>
          <div className="mb-2">
            <Mono className="text-stone-300">Address:</Mono>
            <Mono className="truncate">{address}</Mono>
          </div>
          <div className="mb-4">
            <Mono className="text-stone-300">Balance:</Mono>
            <Mono className="truncate">{balance ? `${toEth(balance)} ETH` : ""}</Mono>
          </div>
          {isLocal && <LocalFaucet refetch={refetch} />}
          <ButtonDisconnect className="mt-2" />
        </div>

        <div className="px-6 py-3 border-t border-stone-700">
          <Muted>v1.0.0</Muted>
          <Muted className="mt-1">Made with ❤️</Muted>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
