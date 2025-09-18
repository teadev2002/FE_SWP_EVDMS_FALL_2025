import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Dashboard from './components/dashboard';
import ManageCategory from './pages/admin/category/index';
import ManageVehicle from './pages/admin/vehicles/ManageVehicle.jsx';

function App() {   
 
  const router = createBrowserRouter([
  {
    path: "/",
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
  
]);
    return (
       <RouterProvider router={router} />
    )
}
export default App