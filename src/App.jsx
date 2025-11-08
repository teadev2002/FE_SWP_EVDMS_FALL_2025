// import { ToastContainer } from 'react-toastify';
// import { createBrowserRouter, RouterProvider } from 'react-router-dom';
// import { AuthProvider } from './context/AuthContext';
// import Store from './components/dashboard/store.jsx';
// import UserLayout from './components/UserLayout';
// import ManageVehicle from './pages/dealerStaffManager/vehicles/ManageVehicle.jsx';
// import HomePage from './pages/user/HomePage/HomePage.jsx';
// import ManageSaleAgreements from './pages/dealerStaffManager/agreements/ManageSaleAgreements.jsx';
// import CustomerOverview from './pages/dealerStaffManager/customer/CustomerOverview.jsx';
// import Promotions from './pages/dealerStaffManager/sale/Promotions.jsx';
// import VehicleDetailPage from './pages/user/HomePage/VehicleDetailPage.jsx';
// import TestDriveHistoryPage from './pages/user/HomePage/TestDriveHistoryPage.jsx'; // New for history
// import TestDriveRegisterPage from './pages/user/HomePage/TestDriveRegisterPage.jsx'; // New for form
// import FactoryOrder from './pages/dealerStaffManager/sale/FactoryOrder.jsx';
// import DeliveryTracking from './pages/dealerStaffManager/sale/DeliveryTracking.jsx';
// import PaymentManagement from './pages/dealerStaffManager/sale/PaymentManagement.jsx';
// import CustomerProfile from './pages/dealerStaffManager/customer/CustomerProfile.jsx';
// import StaffSalesReport from './pages/dealerStaffManager/Report/StaffSalesReport.jsx';
// import DebtReports from './pages/dealerStaffManager/Report/DebtReports.jsx';
// import Brands from './components/dashboard/brands.jsx';
// import InventoryManage from './pages/evmStaffAdmin/ProductNDistribution/InventoryNAllocation/InventoryManagement/InventoryManage.jsx';
// import VehicleAllocationManage from './pages/evmStaffAdmin/ProductNDistribution/InventoryNAllocation/VehicleAllocation/VehicleAllocationManage.jsx';
// import PricePromotionManage from './pages/evmStaffAdmin/ProductNDistribution/PricePromotionManage/PricePromotionManage.jsx';
// import AgreementsManagement from './pages/evmStaffAdmin/Agency/AgreementsManagement/AgreementsManagement.jsx';
// import SalesManagement from './pages/evmStaffAdmin/Agency/SalesManagement/SalesManagement.jsx';
// import DebtManagement from './pages/evmStaffAdmin/Agency/DebtManagement/DebtManagement.jsx';
// import AccountManagement from './pages/evmStaffAdmin/Agency/AccountManagement/AccountManagement.jsx';
// import SalesOverview from './pages/evmStaffAdmin/ReportNAnalysis/SalesReport/SalesOverview.jsx';
// import InventoryAndConsumtionReport from './pages/evmStaffAdmin/ReportNAnalysis/InventoryNConsumtionReport/InventoryAndConsumtionReport.jsx';
// import Login from './pages/Login.jsx';
// import Admin from './components/dashboard/admin.jsx';
// import StoreManage from './pages/evmStaffAdmin/StoreManage/StoreManage.jsx';
// import TestAppointment from './pages/dealerStaffManager/TestAppointment/TestAppointment.jsx';
// import BrandManage from './pages/evmStaffAdmin/BrandManage/BrandManage.jsx';
// import BrandVehicleManage from './pages/evmStaffAdmin/ProductNDistribution/BrandVehicle/BrandVehicleManage.jsx';
// function App() {

//   const router = createBrowserRouter([
//     {
//       path: "/store/:storeId", // Thêm param :storeId
//       element: <Store />,
//       children: [
//         {
//           path: "vehicle",
//           element: <ManageVehicle />,
//         },
//         {
//           path: "testappointment",
//           element: <TestAppointment />,
//         },
//         {
//           path: "sales",
//           element: <Promotions />,
//         },
//         {
//           path: "sales/promotions",
//           element: <Promotions />,
//         },
//         {
//           path: "sales/agreements",
//           element: <ManageSaleAgreements />,
//         },
//         {
//           path: "sales/factory-order",
//           element: <FactoryOrder />,
//         },
//         {
//           path: "sales/delivery-tracking",
//           element: <DeliveryTracking />,
//         },
//         {
//           path: "sales/payment-management",
//           element: <PaymentManagement />,
//         },
//         {
//           path: "customer",
//           element: <CustomerOverview />,
//         },
//         {
//           path: "customer-overview",
//           element: <CustomerOverview />,
//         },
//         {
//           path: "customer-profile",
//           element: <CustomerProfile />,
//         },
//         {
//           path: "report",
//           element: <StaffSalesReport />,
//         },
//         {
//           path: "report/staff-sales-report",
//           element: <StaffSalesReport />,
//         },
//         {
//           path: "report/customer-debt-report",
//           element: <DebtReports />,
//         },
//       ],
//     },
//     {
//       path: "/brands/:brandId", // Thêm param :brandId
//       element: <Brands />,
//       children: [
//         {
//           path: "brand-vehicles",
//           element: <BrandVehicleManage />,
//         },
//         {
//           path: "inventory-allocation",
//           element: <InventoryManage />,
//         },
//         {
//           path: "inventory-allocation/inventory",
//           element: <InventoryManage />,
//         },
//         {
//           path: "inventory-allocation/vehicle-allocation",
//           element: <VehicleAllocationManage />,
//         },
//         {
//           path: "price-promotion-manage",
//           element: <PricePromotionManage />,
//         },
//         {
//           path: "agency-management",
//           element: <AgreementsManagement />,
//         },
//         {
//           path: "agency-management/agreements-management",
//          element: <AgreementsManagement />,
//         },
//         {
//           path: "agency-management/sales-management",
//           element: <SalesManagement />,
//         },
//         {
//           path: "agency-management/debt-management",
//           element: <DebtManagement />,
//         },
//         {
//           path: "reports-analysis",
//           element: <SalesOverview />,
//         },
//         {
//           path: "inventory-&-consumtion-report",
//           element: <InventoryAndConsumtionReport />,
//         },
//         {
//           path: "store-management",
//           element: <StoreManage />,
//         },
//       ],
//     },
//     {
//       path: "/admin",
//       element: <Admin />,
//       children: [
//      {
//           path: "account-management",
//           element: <AccountManagement />,
//         },
//         {
//           path: "reports-analysis",
//           element: <SalesOverview />,
//         },
//         {
//           path: "inventory-&-consumtion-report",
//           element: <InventoryAndConsumtionReport />,
//         },
//         {
//           path: "brands-management",
//           element: <BrandManage />,
//         },
//       ]
//     },
    
//     {
//       path: "/",
//       element: <UserLayout />,
//       children: [
//         {
//           index: true,
//           element: <HomePage />,
//         },
//         {
//           path: "vehicles/:id",
//           element: <VehicleDetailPage />,
//         },
//         {
//           path: "test-drives",
//           element: <TestDriveHistoryPage />,
//         },
//         {
//           path: "test-drive-register",
//           element: <TestDriveRegisterPage />,
//         },
//       ],
//     },
//     {
//       path: "/login",
//       element: <Login />,
//     },
//   ]);
//   return (
//     <AuthProvider>
//       <RouterProvider router={router} />
//       <ToastContainer />
//     </AuthProvider>
//   )
// }
// export default App;

//update url
import { ToastContainer } from 'react-toastify';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Store from './components/dashboard/store.jsx';
import UserLayout from './components/UserLayout';
import ManageVehicle from './pages/dealerStaffManager/vehicles/ManageVehicle.jsx';
import HomePage from './pages/user/HomePage/HomePage.jsx';
import ManageSaleAgreements from './pages/dealerStaffManager/agreements/ManageSaleAgreements.jsx';
import CustomerOverview from './pages/dealerStaffManager/customer/CustomerOverview.jsx';
import Promotions from './pages/dealerStaffManager/sale/Promotions.jsx';
import VehicleDetailPage from './pages/user/HomePage/VehicleDetailPage.jsx';
import TestDriveHistoryPage from './pages/user/HomePage/TestDriveHistoryPage.jsx'; // New for history
import TestDriveRegisterPage from './pages/user/HomePage/TestDriveRegisterPage.jsx'; // New for form
import QuoteRegisterPage from './pages/user/HomePage/QuoteRegisterPage.jsx'; // New for quote
import FactoryOrder from './pages/dealerStaffManager/sale/FactoryOrder.jsx';
import DeliveryTracking from './pages/dealerStaffManager/sale/DeliveryTracking.jsx';
import PaymentManagement from './pages/dealerStaffManager/sale/PaymentManagement.jsx';
import CustomerProfile from './pages/dealerStaffManager/customer/CustomerProfile.jsx';
import StaffSalesReport from './pages/dealerStaffManager/Report/StaffSalesReport.jsx';
import DebtReports from './pages/dealerStaffManager/Report/DebtReports.jsx';
import Brands from './components/dashboard/brands.jsx';
import InventoryManage from './pages/evmStaffAdmin/ProductNDistribution/InventoryNAllocation/InventoryManagement/InventoryManage.jsx';
import VehicleAllocationManage from './pages/evmStaffAdmin/ProductNDistribution/InventoryNAllocation/VehicleAllocation/VehicleAllocationManage.jsx';
import PricePromotionManage from './pages/evmStaffAdmin/ProductNDistribution/PricePromotionManage/PricePromotionManage.jsx';
import AgreementsManagement from './pages/evmStaffAdmin/Agency/AgreementsManagement/AgreementsManagement.jsx';
import SalesManagement from './pages/evmStaffAdmin/Agency/SalesManagement/SalesManagement.jsx';
import DebtManagement from './pages/evmStaffAdmin/Agency/DebtManagement/DebtManagement.jsx';
import AccountManagement from './pages/evmStaffAdmin/Agency/AccountManagement/AccountManagement.jsx';
import SalesOverview from './pages/evmStaffAdmin/ReportNAnalysis/SalesReport/SalesOverview.jsx';
import InventoryAndConsumtionReport from './pages/evmStaffAdmin/ReportNAnalysis/InventoryNConsumtionReport/InventoryAndConsumtionReport.jsx';
import Login from './pages/Login.jsx';
import Admin from './components/dashboard/admin.jsx';
import StoreManage from './pages/evmStaffAdmin/StoreManage/StoreManage.jsx';
import TestAppointment from './pages/dealerStaffManager/TestAppointment/TestAppointment.jsx';
import DealerDashboard from './pages/dealerStaffManager/DealerDashboard/DealerDashboard.jsx';
import BrandManage from './pages/evmStaffAdmin/BrandManage/BrandManage.jsx';
import BrandVehicleManage from './pages/evmStaffAdmin/ProductNDistribution/BrandVehicle/BrandVehicleManage.jsx';
import PaymentSuccess from './pages/dealerStaffManager/sale/PaymentSuccess.jsx';
import PaymentCancel from './pages/dealerStaffManager/sale/PaymentCancel.jsx';
function App() {

  const router = createBrowserRouter([
    {
      path: "/store/:storeId", // Thêm param :storeId
      element: <Store />,
      children: [
        {
          path: "vehicle",
          element: <ManageVehicle />,
        },
        {
          path: "testappointment",
          element: <TestAppointment />,
        },
        {
          path: "dealer_dashboard",
          element: <DealerDashboard />,
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
          element: <ManageSaleAgreements />,
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
          path: "report",
          element: <StaffSalesReport />,
        },
        {
          path: "report/staff-sales-report",
          element: <StaffSalesReport />,
        },
        {
          path: "report/customer-debt-report",
          element: <DebtReports />,
        },
        {
          path: "payment-success",
          element: <PaymentSuccess />,
        },
        {
          path: "payment-cancel",
          element: <PaymentCancel />,
        }
      ],
    },
    {
      path: "/brands/:brandId", // Thêm param :brandId
      element: <Brands />,
      children: [
        {
          path: "brand-vehicles",
          element: <BrandVehicleManage />,
        },
        {
          path: "inventory-allocation",
          element: <InventoryManage />,
        },
        {
          path: "inventory-allocation/inventory",
          element: <InventoryManage />,
        },
        {
          path: "inventory-allocation/vehicle-allocation",
          element: <VehicleAllocationManage />,
        },
        {
          path: "price-promotion-manage",
          element: <PricePromotionManage />,
        },
        {
          path: "agency-management",
          element: <AgreementsManagement />,
        },
        {
          path: "agency-management/agreements-management",
         element: <AgreementsManagement />,
        },
        {
          path: "agency-management/sales-management",
          element: <SalesManagement />,
        },
        {
          path: "agency-management/debt-management",
          element: <DebtManagement />,
        },
        {
          path: "reports-analysis",
          element: <SalesOverview />,
        },
        {
          path: "inventory-&-consumtion-report",
          element: <InventoryAndConsumtionReport />,
        },
        {
          path: "store-management",
          element: <StoreManage />,
        },
      ],
    },
    {
      path: "/admin",
      element: <Admin />,
      children: [
     {
          path: "account-management",
          element: <AccountManagement />,
        },
        {
          path: "reports-analysis",
          element: <SalesOverview />,
        },
        {
          path: "inventory-&-consumtion-report",
          element: <InventoryAndConsumtionReport />,
        },
        {
          path: "brands-management",
          element: <BrandManage />,
        },
        {
          path: "store-management",
          element: <StoreManage />,
        },
      ]
    },
    
    {
      path: "/",
      element: <UserLayout />,
      children: [
        {
          index: true,
          element: <HomePage />,
        },
        {
          path: "vehicles/:id",
          element: <VehicleDetailPage />,
        },
        {
          path: "test-drives",
          element: <TestDriveHistoryPage />,
        },
        {
          path: "test-drive-register",
          element: <TestDriveRegisterPage />,
        },
        {
          path: "quote-register",
          element: <QuoteRegisterPage />,
        },
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
  ]);
  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <ToastContainer />
    </AuthProvider>
  )
}
export default App;