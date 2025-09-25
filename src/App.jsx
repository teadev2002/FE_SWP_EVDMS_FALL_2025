import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Dashboard from './components/dashboard';
import ManageCategory from './pages/dealerStaffManager/category/index';
import ManageVehicle from './pages/dealerStaffManager/vehicles/ManageVehicle.jsx';
import HomePage from './pages/user/HomePage/HomePage.jsx';
import ManageAgreements from './pages/dealerStaffManager/agreements/ManageAgreements.jsx';
import CustomerOverview from './pages/dealerStaffManager/customer/CustomerOverview.jsx';
import ManageSale from './pages/dealerStaffManager/sale/ManageSale.jsx';
import Promotions from './pages/dealerStaffManager/sale/Promotions.jsx';
import VehicleDetailPage from './pages/user/HomePage/VehicleDetailPage.jsx';
import TestDriveHistoryPage from './pages/user/HomePage/TestDriveHistoryPage.jsx'; // New for history
import TestDriveRegisterPage from './pages/user/HomePage/TestDriveRegisterPage.jsx'; // New for form
import FactoryOrder from './pages/dealerStaffManager/sale/FactoryOrder.jsx';
import DeliveryTracking from './pages/dealerStaffManager/sale/DeliveryTracking.jsx';
import PaymentManagement from './pages/dealerStaffManager/sale/PaymentManagement.jsx';
import CustomerProfile from './pages/dealerStaffManager/customer/CustomerProfile.jsx';

function App() {

  const router = createBrowserRouter([
    {
      path: "/dashboard",
      element: <Dashboard />,
      children: [

        {
          path: "vehicle",
          element: <ManageVehicle />,
        },
        {
          path: "sales",
          element: <Promotions />,
        },
        {
          path: "sales/promotions",
          element: <Promotions />,
        },

        {
          path: "sales/agreements",
          element: <ManageAgreements />,
        },
        {
          path: "sales/factory-order",
          element: <FactoryOrder />,
        },
        {
          path: "sales/delivery-tracking",
          element: <DeliveryTracking />,
        },
        {
          path: "sales/payment-management",
          element: <PaymentManagement />,
        },


        {
          path: "customer",
          element: <CustomerOverview />,
        },
        {
          path: "customer-overview",
          element: <CustomerOverview />,
        },
        {
          path: "customer-profile",
          element: <CustomerProfile />,
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
    {
      path: "/vehicles/:id",
      element: <VehicleDetailPage />, // New dynamic route for details
    },
    {
      path: "/test-drives",
      element: <TestDriveHistoryPage />, // Now history page
    },
    {
      path: "/test-drive-register",
      element: <TestDriveRegisterPage />, // Separate route for form
    },

  ]);
  return (
    <RouterProvider router={router} />
  )
}
export default App