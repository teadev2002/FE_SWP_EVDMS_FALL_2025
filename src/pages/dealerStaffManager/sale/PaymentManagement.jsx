import React, { useState } from 'react';
import { Card, Radio, Button, Descriptions, Divider, Space, Typography, Select } from 'antd';
import { CreditCardOutlined, BankOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

const PaymentManagement = () => {
  // Updated order data for an electric vehicle
  const orderData = {
    orderId: 'EV-ORD789012',
    vehicleModel: 'EcoVolt X1 Electric SUV',
    vin: '5YJ3E1EA0MF123456',
    totalAmount: 45000.00,
    currency: 'USD',
  };

  // State for payment method and installment plan
  const [paymentMethod, setPaymentMethod] = useState('full');
  const [installmentMonths, setInstallmentMonths] = useState(12);
  const [monthlyPayment, setMonthlyPayment] = useState((orderData.totalAmount / 12).toFixed(2));

  // Handle payment method change
  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
    if (e.target.value === 'full') {
      setMonthlyPayment(null);
    } else {
      setMonthlyPayment((orderData.totalAmount / installmentMonths).toFixed(2));
    }
  };

  // Handle installment months change
  const handleInstallmentChange = (value) => {
    setInstallmentMonths(value);
    setMonthlyPayment((orderData.totalAmount / value).toFixed(2));
  };

  return (
    <div>
      <Title level={2}>Electric Vehicle Payment Management</Title>
      <Card
        title="Vehicle Order Summary"
        bordered={false}
        style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}
      >
        <Descriptions column={1} bordered>
          <Descriptions.Item label="Order ID">{orderData.orderId}</Descriptions.Item>
          <Descriptions.Item label="Vehicle Model">{orderData.vehicleModel}</Descriptions.Item>
          <Descriptions.Item label="VIN">{orderData.vin}</Descriptions.Item>
          <Descriptions.Item label="Total Amount">
            {orderData.currency} {orderData.totalAmount.toFixed(2)}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Divider />

      <Card
        title="Payment Options"
        bordered={false}
        style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', marginTop: 16 }}
      >
        <Radio.Group
          onChange={handlePaymentMethodChange}
          value={paymentMethod}
          style={{ marginBottom: 16 }}
        >
          <Space direction="vertical">
            <Radio value="full">
              <Space>
                <CreditCardOutlined />
                <Text strong>Pay in Full</Text>
              </Space>
            </Radio>
            <Radio value="installments">
              <Space>
                <BankOutlined />
                <Text strong>Pay in Installments</Text>
              </Space>
            </Radio>
          </Space>
        </Radio.Group>

        {paymentMethod === 'installments' && (
          <div style={{ marginTop: 16 }}>
            <Text strong>Select Installment Plan:</Text>
            <Select
              defaultValue={installmentMonths}
              onChange={handleInstallmentChange}
              style={{ width: 200, margin: '8px 0' }}
            >
              <Option value={12}>12 Months</Option>
              <Option value={24}>24 Months</Option>
              <Option value={36}>36 Months</Option>
            </Select>
            <div>
              <Text>
                Monthly Payment: {orderData.currency} {monthlyPayment} x {installmentMonths} months
              </Text>
            </div>
          </div>
        )}

        <Button
          type="primary"
          size="large"
          style={{ marginTop: 24, width: '100%' }}
          icon={<CreditCardOutlined />}
        >
          {paymentMethod === 'full' ? `Pay ${orderData.currency} ${orderData.totalAmount.toFixed(2)}` : 'Confirm Installment Plan'}
        </Button>
      </Card>
    </div>
  );
};

export default PaymentManagement;