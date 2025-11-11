// them delete
import React, { useState, useEffect, useCallback } from 'react';
import {
  Table,
  Typography,
  Form,
  Button,
  Input,
  Select,
  DatePicker,
  Modal,
  Row,
  Col,
  Tag,
  Space,
  Popconfirm,
} from 'antd';
import ManageQuoteService from '../../../services/ManageQuotes/ManageQuoteService';
import ManageDealerService from '../../../services/ManageDealer/ManageDealerService';
import ManageCustomersService from '../../../services/ManageCustomers/ManageCustomersService';
import ManageStorageService from '../../../services/ManageStorage/ManageStorageService';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

// Helper: Format currency VND
const formatCurrency = (value) => {
  if (value === null || value === undefined) return 'N/A';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
  }).format(value);
};

const Quotation = () => {
  const [quotations, setQuotations] = useState([]);
  const [filteredQuotations, setFilteredQuotations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingQuote, setEditingQuote] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [dealers, setDealers] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();

  // Lưu giá xe theo vehicleId để tính priceWithTax
  const [vehiclePriceMap, setVehiclePriceMap] = useState({});

  // Force re-render khi priceWithTax thay đổi
  const [priceWithTaxDisplay, setPriceWithTaxDisplay] = useState('Choose vehicle and tax rate');

  // Get storeId from localStorage
  const getDealerStoreId = () => {
    try {
      const dealerInfo = JSON.parse(localStorage.getItem('dealerInfo') || '{}');
      return dealerInfo.storeId ? Number(dealerInfo.storeId) : null;
    } catch {
      return null;
    }
  };

  // === TÁI SỬ DỤNG HÀM FETCH ===
  const fetchData = useCallback(async () => {
    setLoading(true);
    const dealerStoreId = getDealerStoreId();

    if (!dealerStoreId) {
      toast.error('Store information not found. Please log in again.');
      setLoading(false);
      return;
    }

    try {
      const quoteData = await ManageQuoteService.getAllQuotations();

      const filteredByStore = [];
      for (const quote of quoteData) {
        try {
          const dealer = await ManageDealerService.GetDealerById(quote.dealerId);
          if (dealer?.storeId && Number(dealer.storeId) === dealerStoreId) {
            filteredByStore.push({ ...quote, dealer });
          }
        } catch (error) {
          console.warn(`Unable to get dealer ID ${quote.dealerId}:`, error);
        }
      }

      const [customersByStore, vehiclesByStore] = await Promise.all([
        ManageCustomersService.getCustomerByStoreId(dealerStoreId),
        ManageStorageService.getStorageVehiclesByStoreId(dealerStoreId),
      ]);

      const dealersByStore = (await ManageDealerService.getAllDealers())
        .filter(d => Number(d.storeId) === dealerStoreId);

      const customerMap = new Map(customersByStore.map(c => [c.customerId, c.fullName]));
      const vehicleMap = new Map(vehiclesByStore.map(v => [v.vehicleId, v.modelName]));
      const dealerMap = new Map(dealersByStore.map(d => [d.dealerId, d.fullName]));

      // Tạo map giá xe
      const priceMap = {};
      vehiclesByStore.forEach(v => {
        priceMap[v.vehicleId] = v.price || 0;
      });
      setVehiclePriceMap(priceMap);

      const formattedData = filteredByStore.map(item => ({
        key: item.quoteId,
        quoteId: item.quoteId,
        customerName: customerMap.get(item.customerId) || 'N/A',
        vehicleName: vehicleMap.get(item.vehicleId) || 'N/A',
        dealerName: dealerMap.get(item.dealerId) || 'N/A',
        quoteDate: item.quoteDate || 'N/A',
        status: item.status || 'N/A',
        vehiclePrice: item.vehiclePrice ?? priceMap[item.vehicleId] ?? null,
        priceWithTax: item.priceWithTax ?? null,
        taxRate: item.taxRate ?? null,
      }));

      setQuotations(formattedData);
      setFilteredQuotations(formattedData);
      setCustomers(customersByStore.map(c => ({ value: c.customerId, label: c.fullName })));
      setVehicles(vehiclesByStore.map(v => ({ value: v.vehicleId, label: v.modelName })));
      setDealers(dealersByStore.map(d => ({ value: d.dealerId, label: d.fullName })));

    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Unable to load quotation data');
    } finally {
      setLoading(false);
    }
  }, []);

  // === LOAD DATA ===
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // === SEARCH ===
  useEffect(() => {
    const filtered = quotations.filter(quote =>
      quote.customerName.toLowerCase().includes(searchText.toLowerCase()) ||
      quote.vehicleName.toLowerCase().includes(searchText.toLowerCase()) ||
      quote.quoteId.toString().includes(searchText)
    );
    setFilteredQuotations(filtered);
    setCurrentPage(1);
  }, [searchText, quotations]);

  // === TÍNH priceWithTax KHI THAY ĐỔI vehicleId HOẶC taxRate ===
  const updatePriceWithTax = () => {
    const values = addForm.getFieldsValue();
    const vehicleId = values.vehicleId;
    const taxRate = values.taxRate;

    let display = 'N/A';
    if (vehicleId && taxRate !== undefined) {
      const basePrice = vehiclePriceMap[vehicleId] || 0;
      const priceWithTax = Math.round(basePrice * (1 + taxRate / 100));
      addForm.setFieldsValue({ priceWithTax });
      display = formatCurrency(priceWithTax);
    } else {
      addForm.setFieldsValue({ priceWithTax: undefined });
    }

    setPriceWithTaxDisplay(display);
  };

  // === OPEN ADD MODAL ===
  const showAddModal = () => {
    addForm.setFieldsValue({
      quoteDate: dayjs(),
      status: 'Accepted',
      priceWithTax: undefined,
    });
    setPriceWithTaxDisplay('Choose vehicle and tax rate');
    setIsAddModalVisible(true);
  };

  const hideAddModal = () => {
    setIsAddModalVisible(false);
    addForm.resetFields();
    setPriceWithTaxDisplay('N/A');
  };

  // === OPEN EDIT MODAL ===
  const handleEdit = async (quoteId) => {
    try {
      setLoading(true);
      const quote = await ManageQuoteService.GetQuotationById(quoteId);
      setEditingQuote(quote);
      editForm.setFieldsValue({ status: quote.status });
      setIsEditModalVisible(true);
    } catch (error) {
      toast.error('Unable to load quotation information');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const hideEditModal = () => {
    setIsEditModalVisible(false);
    setEditingQuote(null);
    editForm.resetFields();
  };

  // === XÓA QUOTATION ===
  const handleDelete = async (quoteId) => {
    setLoading(true);
    try {
      await ManageQuoteService.DeleteQuotation(quoteId);
      toast.success('Quotation deleted successfully!');

      const updatedList = quotations.filter(q => q.quoteId !== quoteId);
      setQuotations(updatedList);
      setFilteredQuotations(updatedList);
    } catch (error) {
      toast.error('Failed to delete quotation');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // === ADD QUOTATION (KHÔNG RELOAD) ===
  const handleAddQuote = async (values) => {
    setLoading(true);
    try {
      const quoteData = {
        customerId: values.customerId,
        vehicleId: values.vehicleId,
        dealerId: values.dealerId,
        taxRate: values.taxRate,
        quoteDate: values.quoteDate.format('DD/MM/YYYY'),
        status: values.status || 'Draft',
      };

      const newQuote = await ManageQuoteService.AddQuotation(quoteData);

      toast.success('Quotation added successfully!');

      const basePrice = vehiclePriceMap[values.vehicleId] || 0;
      const priceWithTax = Math.round(basePrice * (1 + values.taxRate / 100));

      const customerName = customers.find(c => c.value === values.customerId)?.label || 'N/A';
      const vehicleName = vehicles.find(v => v.value === values.vehicleId)?.label || 'N/A';
      const dealerName = dealers.find(d => d.value === values.dealerId)?.label || 'N/A';

      const newQuoteFormatted = {
        key: newQuote.quoteId,
        quoteId: newQuote.quoteId,
        customerName,
        vehicleName,
        dealerName,
        quoteDate: values.quoteDate.format('DD/MM/YYYY'),
        status: values.status || 'Draft',
        vehiclePrice: basePrice,
        priceWithTax,
        taxRate: values.taxRate,
      };

      const updatedList = [newQuoteFormatted, ...quotations];
      setQuotations(updatedList);
      setFilteredQuotations(updatedList);

      hideAddModal();
    } catch (error) {
      toast.error('Failed to add quotation');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // === UPDATE STATUS ===
  const handleUpdateStatus = async (values) => {
    if (!editingQuote) return;

    setLoading(true);
    try {
      const updateData = {
        customerId: editingQuote.customerId,
        vehicleId: editingQuote.vehicleId,
        dealerId: editingQuote.dealerId,
        taxRate: editingQuote.taxRate,
        quoteDate: editingQuote.quoteDate,
        status: values.status,
      };

      await ManageQuoteService.EditQuotation(editingQuote.quoteId, updateData);
      toast.success('Status updated successfully!');

      const updatedList = quotations.map(q =>
        q.quoteId === editingQuote.quoteId
          ? { ...q, status: values.status }
          : q
      );
      setQuotations(updatedList);
      setFilteredQuotations(updatedList);

      hideEditModal();
    } catch (error) {
      toast.error('Update failed');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // === TABLE COLUMNS ===
  const columns = [
    { title: 'Quote ID', dataIndex: 'quoteId', key: 'quoteId', sorter: (a, b) => a.quoteId - b.quoteId },
    { title: 'Customer', dataIndex: 'customerName', key: 'customerName' },
    { title: 'Vehicle Model', dataIndex: 'vehicleName', key: 'vehicleName' },
    { title: 'Employee', dataIndex: 'dealerName', key: 'dealerName' },
    { title: 'Quote Date', dataIndex: 'quoteDate', key: 'quoteDate' },
    {
      title: 'Vehicle Price (VND)',
      dataIndex: 'vehiclePrice',
      key: 'vehiclePrice',
      render: formatCurrency,
      sorter: (a, b) => (a.vehiclePrice || 0) - (b.vehiclePrice || 0),
      align: 'right',
    },
    {
      title: 'Price with Tax (VND)',
      dataIndex: 'priceWithTax',
      key: 'priceWithTax',
      render: formatCurrency,
      sorter: (a, b) => (a.priceWithTax || 0) - (b.priceWithTax || 0),
      align: 'right',
      defaultSortOrder: 'descend',
    },
    {
      title: 'Tax Rate (%)',
      dataIndex: 'taxRate',
      key: 'taxRate',
      render: (rate) => rate !== null ? `${rate}%` : 'N/A',
      sorter: (a, b) => (a.taxRate || 0) - (b.taxRate || 0),
      align: 'center',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={
          status === 'Accepted' ? 'green' :
            status === 'Sent' ? 'blue' :
              status === 'Rejected' ? 'red' :
                status === 'Draft' ? 'orange' : 'default'
        }>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            onClick={() => handleEdit(record.quoteId)}
            style={{
              background: 'linear-gradient(135deg, #ec6e07ff 0%, #ceb24fff 100%)',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              fontSize: '0.875rem',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-1px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete this quotation?"
            description="This action cannot be undone."
            onConfirm={() => handleDelete(record.quoteId)}
            okText="Yes, Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
          >
            <Button
              danger
               style={{
              background: 'linear-gradient(135deg, #ff1f01ff 0%, #df9292ff 100%)',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              fontSize: '0.875rem',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const totalQuotations = filteredQuotations.length;

  return (
    <div>
      <Title level={2} style={{ color: '#1F1F1F', marginBottom: 24 }}>
        Quotation Management
      </Title>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={20}>
          <Input
            placeholder="Search by customer name or vehicle model"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
          />
        </Col>
        <Col span={4}>
          <Button type="primary" onClick={showAddModal} style={{ width: '100%' }}>
            Add Quotation
          </Button>
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={filteredQuotations}
        loading={loading}
        rowKey="key"
        pagination={{
          pageSize,
          current: currentPage,
          total: totalQuotations,
          onChange: (page) => setCurrentPage(page),
          showTotal: (total, range) => `Showing ${range[0]}-${range[1]} of ${total} quotations`,
        }}
        bordered
        style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)' }}
      />

      {/* ADD MODAL */}
      <Modal
        title="Add New Quotation"
        open={isAddModalVisible}
        onCancel={hideAddModal}
        footer={null}
        width={600}
      >
        <Form form={addForm} layout="vertical" onFinish={handleAddQuote}>
          <Form.Item name="customerId" label="Customer" rules={[{ required: true }]}>
            <Select showSearch placeholder="Select customer" options={customers} loading={loading} />
          </Form.Item>

          <Form.Item name="vehicleId" label="Vehicle Model" rules={[{ required: true }]}>
            <Select
              showSearch
              placeholder="Select vehicle model"
              options={vehicles}
              loading={loading}
              onChange={updatePriceWithTax}
            />
          </Form.Item>

          <Form.Item name="dealerId" label="Employee" rules={[{ required: true }]}>
            <Select showSearch placeholder="Select employee" options={dealers} loading={loading} />
          </Form.Item>

          <Form.Item name="taxRate" label="Tax Rate (%)" rules={[{ required: true, message: 'Please select tax rate!' }]}>
            <Select placeholder="Select tax rate" onChange={updatePriceWithTax}>
              {Array.from({ length: 91 }, (_, i) => i + 10).map(rate => (
                <Select.Option key={rate} value={rate}>{rate}%</Select.Option>
              ))}
            </Select>
          </Form.Item>

          {/* PRICE WITH TAX (DYNAMIC) */}
          <Form.Item label="Price with Tax (VND)">
            <Text strong style={{ fontSize: '16px', color: '#6dd40dff' }}>
              {priceWithTaxDisplay}
            </Text>
          </Form.Item>

          <Form.Item name="quoteDate" label="Quote Date" rules={[{ required: true }]}>
            <DatePicker
              format="DD/MM/YYYY"
              style={{ width: '100%' }}
              defaultValue={dayjs()}
              disabled
            />
          </Form.Item>

          <Form.Item name="status" label="Status" initialValue="Draft">
            <Select>
              <Select.Option value="Draft">Draft</Select.Option>
              <Select.Option value="Sent">Sent</Select.Option>
              <Select.Option value="Accepted">Accepted</Select.Option>
              <Select.Option value="Rejected">Rejected</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} style={{ marginRight: 8 }}>
              Add
            </Button>
            <Button onClick={hideAddModal}>Cancel</Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* EDIT STATUS MODAL */}
      <Modal
        title={`Update Status - Quote #${editingQuote?.quoteId}`}
        open={isEditModalVisible}
        onCancel={hideEditModal}
        footer={null}
        width={500}
      >
        <Form form={editForm} layout="vertical" onFinish={handleUpdateStatus}>
          <Form.Item name="status" label="Status" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="Draft">Draft</Select.Option>
              <Select.Option value="Sent">Sent</Select.Option>
              <Select.Option value="Accepted">Accepted</Select.Option>
              <Select.Option value="Rejected">Rejected</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} style={{ marginRight: 8 }}>
              Update
            </Button>
            <Button onClick={hideEditModal}>Cancel</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Quotation;