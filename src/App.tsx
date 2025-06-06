import { Routes, Route } from 'react-router-dom';
import { useIsConnected, useNetwork } from '@fuels/react';

import Sidebar from "./components/Sidebar.tsx";
import { routes } from "./routes/routes.tsx";
import ConnectionCard from './components/ConnectionCard.tsx';
import { providerUrl } from './lib.tsx';

function App() {
  const { isConnected } = useIsConnected();
  const { network } = useNetwork();
  const isConnectedToCorrectNetwork = network?.url === providerUrl;
  return (
    <>
      {!isConnected || !isConnectedToCorrectNetwork ?
        <ConnectionCard />
        :
        <div className="flex text-white">
          <Sidebar />
          <main className="flex-1 p-6 bg-stone-800 overflow-y-auto h-screen">
            <Routes>
              {routes.map(r => (
                <Route key={r.path} path={r.path} element={r.element} />
              ))}
            </Routes>
          </main>
        </div>
      }
    </>
  );
}

export default App;
