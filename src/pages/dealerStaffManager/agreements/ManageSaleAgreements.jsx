// them core features for sale agreement management
import React, { useState, useEffect } from 'react';
import { Table, Typography, Form, Button, Input, Select, DatePicker, Modal, Tabs, Row, Col } from 'antd';
import ManageServiceSaleAgreements from '../../../services/ManageAgreements/ManageServiceSaleAgreements';
import ManageCustomersService from '../../../services/ManageCustomers/ManageCustomersService';
import ManageOrdersService from '../../../services/ManageOrders/ManageOrdersService';
import Quotation from './Quotation';
import Orders from './Orders';
import { toast } from 'react-toastify';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const ManageSaleAgreements = () => {
  const [agreements, setSaleAgreements] = useState([]);
  const [filteredAgreements, setFilteredAgreements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('agreements');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [orderOptions, setOrderOptions] = useState([]);
  const [customerOrdersMap, setCustomerOrdersMap] = useState(new Map());
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
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
          customerName: item.customerName || 'N/A',
          agreementDate: item.agreementDate || 'N/A',
          status: item.status || 'N/A',
        }));

        setSaleAgreements(formattedData);
        setFilteredAgreements(formattedData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        toast.error('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle search
  useEffect(() => {
    const filtered = agreements.filter(
      (agreement) =>
        agreement.customerName.toLowerCase().includes(searchText.toLowerCase()) ||
        agreement.agreementDate.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredAgreements(filtered);
    setCurrentPage(1); // Reset to first page on search
  }, [searchText, agreements]);

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
      setLoading(true);
      const agreementData = {
        customerId: values.customerId,
        orderId: values.orderId,
        agreementDate: values.agreementDate.format('DD/MM/YYYY'),
        termsAndConditions: values.termsAndConditions,
        status: values.status || 'Active',
        fileUrl: values.fileUrl || '',
      };
      await ManageServiceSaleAgreements.AddSaleAgreement(agreementData);
      toast.success('Agreement added successfully');

      // Refresh agreements
      const agreementDataUpdated = await ManageServiceSaleAgreements.getAllSaleAgreements();
      const formattedData = agreementDataUpdated.map(item => ({
        key: item.agreementId,
        customerName: item.customerName || 'N/A',
        agreementDate: item.agreementDate || 'N/A',
        status: item.status || 'N/A',
      }));
      setSaleAgreements(formattedData);
      setFilteredAgreements(formattedData);
      setIsModalVisible(false);
      form.resetFields();
      setOrderOptions([]);
    } catch (error) {
      console.error('Failed to add agreement:', error);
      toast.error('Failed to add agreement');
    } finally {
      setLoading(false);
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
      sorter: (a, b) => a.customerName.localeCompare(b.customerName),
    },
    {
      title: 'Agreement Date',
      dataIndex: 'agreementDate',
      key: 'agreementDate',
      sorter: (a, b) => new Date(a.agreementDate) - new Date(b.agreementDate),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      sorter: (a, b) => a.status.localeCompare(b.status),
    },
  ];

  // Calculate pagination details
  const totalAgreements = filteredAgreements.length;
  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, totalAgreements);

  return (
    <div>
      <Title level={2} style={{ color: '#1F1F1F', marginBottom: 24 }}>
        Sale Management
      </Title>
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="Agreements" key="agreements">
                <Title level={2} style={{ color: '#1F1F1F', marginBottom: 24 }}>
         Agreements  
      </Title>
          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col span={20}>
              <Input
                placeholder="Search by Customer Name or Agreement Date"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
              />
            </Col>
            <Col span={4}>
              <Button
                type="primary"
                onClick={showModal}
                style={{ width: '100%' }}
              >
                Add Agreement
              </Button>
            </Col>
          </Row>
               <Col>
              <Text>
                Showing {startIndex} to {endIndex} of {totalAgreements} agreements
              </Text>
            </Col>
          <Row align="middle" justify="space-between" style={{ marginTop: 16 }}>
       
           
              <Table
                columns={columns}
                dataSource={filteredAgreements}
                loading={loading}
                rowKey="key"
                pagination={{
                  pageSize: pageSize,
                  current: currentPage,
                  total: totalAgreements,
                  onChange: (page) => setCurrentPage(page),
                  style: { margin: 0 },
                }}
                bordered
                style={{ width: '100%' }}
              />
            
          </Row>
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
        open={isModalVisible}
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