// import { Result, Button } from 'antd';
// import { useEffect } from 'react';

// const PaymentSuccess = () => {

//   useEffect(() => {
//     const paymentId = localStorage.getItem('currentPaymentId');
//     if (paymentId) {
//       // Gọi API cập nhật trạng thái đơn hàng nếu cần
//       // await updateOrderStatus(orderId, 'Paid');
//       localStorage.removeItem('currentPaymentId');
//     }
//   }, []);
// const dealerInfo = JSON.parse(localStorage.getItem('dealerInfo') || '{}');
//     const storeSlug = dealerInfo.storeSlug || 'unknown';
//   return (
//     <Result
//       status="success"
//       title="Thanh toán thành công!"
//       subTitle="Cảm ơn bạn đã sử dụng dịch vụ."
//       extra={[
//         <Button type="primary" key="back" onClick={() => window.location.href = `${window.location.origin}/store/${storeSlug}/sales/payment-management`}>
//           Quay lại đơn hàng
//         </Button>,
//       ]}
//     />
//   );
// };

// export default PaymentSuccess;

//----------------------------------------------------------------------------------//

import { Result, Button } from 'antd';
import { useEffect } from 'react';

const PaymentSuccess = () => {

  useEffect(() => {
    const paymentId = localStorage.getItem('currentPaymentId');
    if (paymentId) {
      // Call API to update order status if needed
      // await updateOrderStatus(orderId, 'Paid');
      localStorage.removeItem('currentPaymentId');
    }
  }, []);
  const dealerInfo = JSON.parse(localStorage.getItem('dealerInfo') || '{}');
  const storeSlug = dealerInfo.storeSlug || 'unknown';
  return (
    <Result
      status="success"
      title="Payment Successful!"
      subTitle="Thank you for using our service."
      extra={[
        <Button type="primary" key="back" onClick={() => window.location.href = `${window.location.origin}/store/${storeSlug}/sales/payment-management`}>
          Back to Orders
        </Button>,
      ]}
    />
  );
};

export default PaymentSuccess;