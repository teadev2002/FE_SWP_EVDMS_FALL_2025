import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Dashboard from './components/dashboard';
import ManageCategory from './pages/admin/category/index';
import ManageVehicle from './pages/admin/vehicles/ManageVehicle.jsx';
import HomePage from './pages/user/HomePage/HomePage.jsx';

function App() {   
 
  const router = createBrowserRouter([
  {
    path: "/dashboard",
    element:  <Dashboard />,
    children: [
      
      {
        path: "vehicle",
        element: <ManageVehicle />,
      },
      {
        path: "category",
        element: <ManageCategory />,
      },
    ],
  },
  {
    path: "/",
    element: <HomePage />,
  },
  
]);
    return (
       <RouterProvider router={router} />
    )
}
export default App