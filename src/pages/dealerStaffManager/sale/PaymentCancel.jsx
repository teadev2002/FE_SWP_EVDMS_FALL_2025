import { Result, Button } from 'antd';
 
const PaymentCancel = () => {
  
const dealerInfo = JSON.parse(localStorage.getItem('dealerInfo') || '{}');
    const storeSlug = dealerInfo.storeSlug || 'unknown';
  return (
    <Result
      status="error"
      title="Thanh toán bị hủy"
      subTitle="Bạn đã hủy thanh toán. Vui lòng thử lại."
      extra={[
        <Button type="primary" key="retry" onClick={() =>  window.location.href = `${window.location.origin}/store/${storeSlug}/sales/payment-management`}>
          Thử lại
        </Button>,
      ]}
    />
  );
};

export default PaymentCancel;