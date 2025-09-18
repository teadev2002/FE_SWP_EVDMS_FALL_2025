import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Dashboard from './components/dashboard';
import ManageCategory from './pages/admin/category/index';
import ManageVehicle from './pages/admin/vehicles/manageVehicle';

function App() {   
 
  const router = createBrowserRouter([
  {
    path: "/",
    element:  <Dashboard />,
    children: [
      
      {
        path: "bike",
        element: <ManageVehicle />,
      },
      {
        path: "category",
        element: <ManageCategory />,
      },
    ],
  },
  
]);
    return (
       <RouterProvider router={router} />
    )
}
export default App