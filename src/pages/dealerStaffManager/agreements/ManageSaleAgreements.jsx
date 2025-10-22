import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Select, DatePicker, Input, Tabs, message } from 'antd';
import ManageServiceSaleAgreements from '../../../services/ManageAgreements/ManageServiceSaleAgreements';
import ManageCustomersService from '../../../services/ManageCustomers/ManageCustomersService';
import Quotation from './Quotation';
import Orders from './Orders';
import ManageOrdersService from '../../../services/ManageOrders/ManageOrdersService';
const { TabPane } = Tabs;

const ManageSaleAgreements = () => {
  const [agreements, setSaleAgreements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('agreements');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [orderOptions, setOrderOptions] = useState([]);
  const [customerOrdersMap, setCustomerOrdersMap] = useState(new Map());
  const [form] = Form.useForm();

  // Fetch agreements and related data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [agreementData, customerData, orderData] = await Promise.all([
          ManageServiceSaleAgreements.getAllSaleAgreements(),
          ManageCustomersService.getAllCustomers(),
          ManageOrdersService.getAllOrder(),
        ]);

        // Create customer orders map
        const map = new Map();
        orderData.forEach(o => {
          if (!map.has(o.customerId)) {
            map.set(o.customerId, []);
          }
          map.get(o.customerId).push({ value: o.orderId, label: `Order ${o.orderId}` });
        });
        setCustomerOrdersMap(map);

        // Filter customers who have orders
        const filteredCustomers = customerData.filter(c => map.has(c.customerId));
        setCustomers(filteredCustomers.map(c => ({ value: c.customerId, label: c.fullName })));

        // Format agreement data
        const formattedData = agreementData.map(item => ({
          key: item.agreementId,
          customerName: item.customerName,
          agreementDate: item.agreementDate,
          status: item.status || 'N/A',
        }));

        setSaleAgreements(formattedData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        message.error('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle customer selection change
  const handleCustomerChange = (value) => {
    const orders = customerOrdersMap.get(value) || [];
    setOrderOptions(orders);
    if (orders.length === 1) {
      form.setFieldsValue({ orderId: orders[0].value });
    } else {
      form.setFieldsValue({ orderId: undefined });
    }
  };

  // Handle form submission
  const handleAddAgreement = async (values) => {
    try {
      const agreementData = {
        customerId: values.customerId,
        orderId: values.orderId,
        agreementDate: values.agreementDate.format('DD/MM/YYYY'),
        termsAndConditions: values.termsAndConditions,
        status: values.status || 'Active',
        fileUrl: values.fileUrl || '',
      };
      await ManageServiceSaleAgreements.AddSaleAgreement(agreementData);
      message.success('Agreement added successfully');

      // Refresh agreements
      const agreementDataUpdated = await ManageServiceSaleAgreements.getAllSaleAgreements();
      const formattedData = agreementDataUpdated.map(item => ({
        key: item.agreementId,
        customerName: item.customerName,
        agreementDate: item.agreementDate,
        status: item.status || 'N/A',
      }));
      setSaleAgreements(formattedData);
      setIsModalVisible(false);
      form.resetFields();
      setOrderOptions([]);
    } catch (error) {
      console.error('Failed to add agreement:', error);
      message.error('Failed to add agreement');
    }
  };

  // Show modal
  const showModal = () => {
    setIsModalVisible(true);
  };

  // Handle modal cancel
  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setOrderOptions([]);
  };

  // Table columns
  const columns = [
    {
      title: 'Customer Name',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: 'Agreement Date',
      dataIndex: 'agreementDate',
      key: 'agreementDate',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
  ];

  return (
    <div>
      <h2>Manage Sale Agreements</h2>
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="Agreements" key="agreements">
          <Button type="primary" onClick={showModal} style={{ marginBottom: 16 }}>
            Add Agreement
          </Button>
          <Table
            columns={columns}
            dataSource={agreements}
            loading={loading}
            rowKey="key"
          />
        </TabPane>
        <TabPane tab="Quotations" key="quotations">
          <Quotation />
        </TabPane>
        <TabPane tab="Orders" key="orders">
          <Orders />
        </TabPane>
      </Tabs>
      <Modal
        title="Add New Agreement"
        visible={isModalVisible}
        onOk={form.submit}
        onCancel={handleCancel}
        okText="Submit"
        cancelText="Cancel"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddAgreement}
        >
          <Form.Item
            name="customerId"
            label="Customer"
            rules={[{ required: true, message: 'Please select a customer' }]}
          >
            <Select
              showSearch
              placeholder="Select a customer"
              optionFilterProp="label"
              options={customers}
              onChange={handleCustomerChange}
            />
          </Form.Item>
          <Form.Item
            name="orderId"
            label="Order"
            rules={[{ required: true, message: 'Please select an order' }]}
          >
            <Select
              showSearch
              placeholder="Select an order"
              optionFilterProp="label"
              options={orderOptions}
            />
          </Form.Item>
          <Form.Item
            name="agreementDate"
            label="Agreement Date"
            rules={[{ required: true, message: 'Please select an agreement date' }]}
          >
            <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="termsAndConditions"
            label="Terms and Conditions"
            rules={[{ required: true, message: 'Please enter terms and conditions' }]}
          >
            <Input.TextArea rows={4} placeholder="Enter terms and conditions" />
          </Form.Item>
          <Form.Item
            name="status"
            label="Status"
            initialValue="Active"
          >
            <Select
              placeholder="Select status"
              options={[
                { value: 'Active', label: 'Active' },
                { value: 'Inactive', label: 'Inactive' },
                { value: 'Pending', label: 'Pending' },
              ]}
            />
          </Form.Item>
          <Form.Item
            name="fileUrl"
            label="File URL"
          >
            <Input placeholder="Enter file URL (e.g., abc.doc)" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ManageSaleAgreements;