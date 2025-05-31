import Campaigns from "../pages/Campaigns";
import Home from "../pages/Home";

export const routes = [
  { name: "Home", path: "/", element: <Home /> },
  { name: "Campaigns", path: "/campaigns", element: <Campaigns /> },
];