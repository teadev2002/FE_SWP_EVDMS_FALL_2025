import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Dashboard from './components/dashboard';
import ManageCategory from './pages/dealerStaffManager/category/index';
import ManageVehicle from './pages/dealerStaffManager/vehicles/ManageVehicle.jsx';
import HomePage from './pages/user/HomePage/HomePage.jsx';
import ManageAgreements from './pages/dealerStaffManager/agreements/ManageAgreements.jsx';
import DashboardOverview from './pages/dealerStaffManager/overview/DashboardOverview.jsx';

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
      {
        path: "agreements",
        element: <ManageAgreements />,
      },
      {
        path: "overview",
        element: <DashboardOverview />,
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