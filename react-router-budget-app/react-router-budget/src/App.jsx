import * as React from "react";
import * as ReactDOM from "react-dom";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Dashborad from "./page/dashborad";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashborad />
  },
])

function App() {
      return <div className='App'>
      <RouterProvider router={router}/>
      </div>;
}

export default App;
