import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Layout from "./Layout/Layout";
import Home from "./Pages/Home";
import RecordingsPage from "./Pages/Recordings";
import LiveLocationPage from "./Pages/LiveLocationPage";
import PastLocationPage from "./Pages/PastLocationPage";


function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<Layout/>}>
        <Route index element={<Home/>}/>
        <Route path="recordings" element={<RecordingsPage/>}/>
        <Route path="live-location" element={<LiveLocationPage/>}/>
        <Route path="pass-location" element={<PastLocationPage/>}/>
      </Route>
    )
  );
  
  return <RouterProvider router={router} />;
}

export default App;