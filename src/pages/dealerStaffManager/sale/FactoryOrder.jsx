import React, { useState } from 'react';
import { Form, Input, Select, DatePicker, Button, Card, message } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import '../../../styles/dealerStaffManager/FactoryOrder.scss';

const { Option } = Select;
const { TextArea } = Input;

const FactoryOrder = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = (values) => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      console.log('Order submitted:', values);
      message.success('Order placed successfully!');
      setLoading(false);
      form.resetFields();
    }, 1000);
  };

  return (
    <div className="factory-order-container">
      <Card title="Place Vehicle Order" className="order-card">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            vehicleType: 'sedan',
            quantity: 1,
          }}
        >
          <Form.Item
            label="Vehicle Type"
            name="vehicleType"
            rules={[{ required: true, message: 'Please select a vehicle type' }]}
          >
            <Select placeholder="Select vehicle type">
              <Option value="sedan">Sedan</Option>
              <Option value="suv">SUV</Option>
              <Option value="truck">Truck</Option>
              <Option value="van">Van</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Quantity"
            name="quantity"
            rules={[
              { required: true, message: 'Please enter quantity' },
              { type: 'number', min: 1, message: 'Quantity must be at least 1' },
            ]}
          >
            <Input type="number" min={1} />
          </Form.Item>

          <Form.Item
            label="Delivery Date"
            name="deliveryDate"
            rules={[{ required: true, message: 'Please select a delivery date' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="Additional Notes"
            name="notes"
          >
            <TextArea rows={4} placeholder="Enter any additional requirements" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SendOutlined />}
              loading={loading}
              block
            >
              Submit Order
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default FactoryOrder;