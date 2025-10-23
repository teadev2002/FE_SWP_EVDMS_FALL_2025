import React, { useState, useEffect } from 'react';
import { Table, Typography, Form, Button, Input, Select, DatePicker, Modal, Row, Col } from 'antd';
import ManageQuoteService from '../../../services/ManageQuotes/ManageQuoteService';
import ManageDealerService from '../../../services/ManageDealer/ManageDealerService';
import ManageCustomersService from '../../../services/ManageCustomers/ManageCustomersService';
import ManageVehicleService from '../../../services/ManageVehicleService/ManageVehicleService';
import { toast } from 'react-toastify';

const { Title, Text } = Typography;
const { Option } = Select;

const Quotation = () => {
  const [quotations, setQuotations] = useState([]);
  const [filteredQuotations, setFilteredQuotations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [dealers, setDealers] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [form] = Form.useForm();

  // Fetch quotations and related data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [quoteData, customerData, vehicleData, dealerData] = await Promise.all([
          ManageQuoteService.getAllQuotations(),
          ManageCustomersService.getAllCustomers(),
          ManageVehicleService.getAllVehicle(),
          ManageDealerService.getAllDealers(),
        ]);

        // Create lookup maps for quick access
        const customerMap = new Map(customerData.map(c => [c.customerId, c.fullName]));
        const vehicleMap = new Map(vehicleData.map(v => [v.vehicleId, v.modelName]));
        const dealerMap = new Map(dealerData.map(d => [d.dealerId, d.fullName]));

        // Format quotation data with resolved names
        const formattedData = quoteData.map(item => ({
          key: item.quoteId,
          customerName: customerMap.get(item.customerId) || 'N/A',
          vehicleName: vehicleMap.get(item.vehicleId) || 'N/A',
          dealerName: dealerMap.get(item.dealerId) || 'N/A',
          quoteDate: item.quoteDate,
          status: item.status,
        }));

        setQuotations(formattedData);
        setFilteredQuotations(formattedData);
        setCustomers(customerData.map(c => ({ value: c.customerId, label: c.fullName })));
        setVehicles(vehicleData.map(v => ({ value: v.vehicleId, label: v.modelName })));
        setDealers(dealerData.map(d => ({ value: d.dealerId, label: d.fullName })));
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
    const filtered = quotations.filter(
      (quote) =>
        quote.customerName.toLowerCase().includes(searchText.toLowerCase()) ||
        quote.vehicleName.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredQuotations(filtered);
    setCurrentPage(1); // Reset to first page on search
  }, [searchText, quotations]);

  // Handle form submission
  const handleAddQuote = async (values) => {
    try {
      setLoading(true);
      const quoteData = {
        customerId: values.customerId,
        vehicleId: values.vehicleId,
        dealerId: values.dealerId,
        quoteDate: values.quoteDate.format('DD/MM/YYYY'),
        status: values.status || 'Draft',
      };
      await ManageQuoteService.AddQuotation(quoteData);
      toast.success('Quote added successfully');

      // Refresh quotations
      const quoteDataUpdated = await ManageQuoteService.getAllQuotations();
      const [customerData, vehicleData, dealerData] = await Promise.all([
        ManageCustomersService.getAllCustomers(),
        ManageVehicleService.getAllVehicle(),
        ManageDealerService.getAllDealers(),
      ]);
      const customerMap = new Map(customerData.map(c => [c.customerId, c.fullName]));
      const vehicleMap = new Map(vehicleData.map(v => [v.vehicleId, v.modelName]));
      const dealerMap = new Map(dealerData.map(d => [d.dealerId, d.fullName]));
      const formattedData = quoteDataUpdated.map(item => ({
        key: item.quoteId,
        customerName: customerMap.get(item.customerId) || 'N/A',
        vehicleName: vehicleMap.get(item.vehicleId) || 'N/A',
        dealerName: dealerMap.get(item.dealerId) || 'N/A',
        quoteDate: item.quoteDate,
        status: item.status,
      }));
      setQuotations(formattedData);
      setFilteredQuotations(formattedData);
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('Failed to add quote:', error);
      toast.error('Failed to add quote');
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
  };

  const columns = [
    {
      title: 'Quote ID',
      dataIndex: 'key',
      key: 'key',
      sorter: (a, b) => a.key - b.key,
    },
    {
      title: 'Customer Name',
      dataIndex: 'customerName',
      key: 'customerName',
      sorter: (a, b) => a.customerName.localeCompare(b.customerName),
    },
    {
      title: 'Vehicle Model',
      dataIndex: 'vehicleName',
      key: 'vehicleName',
      sorter: (a, b) => a.vehicleName.localeCompare(b.vehicleName),
    },
    {
      title: 'Dealer Name',
      dataIndex: 'dealerName',
      key: 'dealerName',
      sorter: (a, b) => a.dealerName.localeCompare(b.dealerName),
    },
    {
      title: 'Quote Date',
      dataIndex: 'quoteDate',
      key: 'quoteDate',
      sorter: (a, b) => new Date(a.quoteDate) - new Date(b.quoteDate),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      sorter: (a, b) => a.status.localeCompare(b.status),
    },
  ];

  // Calculate pagination details
  const totalQuotations = filteredQuotations.length;
 
  return (
    <div>
      <Title level={2} style={{ color: '#1F1F1F', marginBottom: 24 }}>
        Quotation  
      </Title>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={20}>
          <Input
            placeholder="Search by Customer Name or Vehicle Model"
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
            Add Quote
          </Button>
        </Col>
      </Row>
      <Row align="middle" justify="space-between" style={{ marginTop: 16 }}>
   
        
          <Table
            columns={columns}
            dataSource={filteredQuotations}
            loading={loading}
            rowKey="key"
            pagination={{
              pageSize: pageSize,
              current: currentPage,
              total: totalQuotations,
              onChange: (page) => setCurrentPage(page),
              style: { margin: 0 },
                        showTotal: (total, range) => `Showing ${range[0]} to ${range[1]} of ${total} Store${total !== 1 ? 's' : ''}`,

            }}
            bordered
            style={{ width: '100%' }}
          />
        
      </Row>
      <Modal
        title="Add New Quote"
        open={isModalVisible}
        onOk={form.submit}
        onCancel={handleCancel}
        okText="Submit"
        cancelText="Cancel"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddQuote}
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
            />
          </Form.Item>
          <Form.Item
            name="vehicleId"
            label="Vehicle"
            rules={[{ required: true, message: 'Please select a vehicle' }]}
          >
            <Select
              showSearch
              placeholder="Select a vehicle"
              optionFilterProp="label"
              options={vehicles}
            />
          </Form.Item>
          <Form.Item
            name="dealerId"
            label="Dealer"
            rules={[{ required: true, message: 'Please select a dealer' }]}
          >
            <Select
              showSearch
              placeholder="Select a dealer"
              optionFilterProp="label"
              options={dealers}
            />
          </Form.Item>
          <Form.Item
            name="quoteDate"
            label="Quote Date"
            rules={[{ required: true, message: 'Please select a quote date' }]}
          >
            <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="status"
            label="Status"
            initialValue="Draft"
          >
            <Select
              placeholder="Select status"
              options={[
                { value: 'Draft', label: 'Draft' },
                { value: 'Sent', label: 'Sent' },
                { value: 'Accepted', label: 'Accepted' },
                { value: 'Rejected', label: 'Rejected' },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Quotation;