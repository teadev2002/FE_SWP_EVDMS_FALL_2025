// filter theo storeId
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
  const [customers, setCustomers] = useState([]); // Options: { value, label }
  const [orderOptions, setOrderOptions] = useState([]);
  const [customerOrdersMap, setCustomerOrdersMap] = useState(new Map());
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [form] = Form.useForm();

  // Lấy storeId từ localStorage
  const getDealerStoreId = () => {
    const dealerInfo = JSON.parse(localStorage.getItem('dealerInfo') || '{}');
    return dealerInfo.storeId;
  };

  // Fetch data with storeId filter
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const dealerStoreId = getDealerStoreId();

        if (!dealerStoreId) {
          toast.error('Không tìm thấy thông tin cửa hàng. Vui lòng đăng nhập lại.');
          setLoading(false);
          return;
        }

        // === 1. Fetch Agreements + Filter by storeId ===
        const agreementData = await ManageServiceSaleAgreements.getAllSaleAgreements();
        const agreementsInStore = agreementData.filter(a => a.storeId === dealerStoreId);

        const formattedAgreements = agreementsInStore.map(item => ({
          key: item.agreementId,
          customerName: item.customerName || 'N/A',
          agreementDate: item.agreementDate || 'N/A',
          termsAndConditions: item.termsAndConditions || 'N/A',
          status: item.status || 'N/A',
        }));

        setSaleAgreements(formattedAgreements);
        setFilteredAgreements(formattedAgreements);

        // === 2. Fetch Customers by storeId ===
        let customerData = [];
        try {
          customerData = await ManageCustomersService.getCustomerByStoreId(dealerStoreId);
        } catch (error) {
          console.error('Error fetching customers by store:', error);
          toast.warn('Không tải được danh sách khách hàng.');
        }

        // === 3. Fetch Orders + Filter by storeId ===
        const orderData = await ManageOrdersService.getAllOrder();
        const ordersInStore = orderData.filter(o => o.storeId === dealerStoreId);

        // Build customer → orders map (only for customers in current store)
        const map = new Map();
        const customerIdsInStore = new Set(customerData.map(c => c.customerId));

        ordersInStore.forEach(o => {
          if (customerIdsInStore.has(o.customerId)) {
            if (!map.has(o.customerId)) {
              map.set(o.customerId, []);
            }
            map.get(o.customerId).push({
              value: o.orderId,
              label: `Order ${o.orderId} - ${o.totalPrice?.toLocaleString()}₫`
            });
          }
        });
        setCustomerOrdersMap(map);

        // Set customer options (only those with orders in store)
        const customersWithOrders = customerData
          .filter(c => map.has(c.customerId))
          .map(c => ({
            value: c.customerId,
            label: c.fullName
          }));
        setCustomers(customersWithOrders);

      } catch (error) {
        console.error('Failed to fetch data:', error);
        toast.error('Không thể tải dữ liệu. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Search handler
  useEffect(() => {
    const filtered = agreements.filter(
      (agreement) =>
        agreement.customerName.toLowerCase().includes(searchText.toLowerCase()) ||
        agreement.agreementDate.includes(searchText)
    );
    setFilteredAgreements(filtered);
    setCurrentPage(1);
  }, [searchText, agreements]);

  // Handle customer change → update order options
  const handleCustomerChange = (value) => {
    const orders = customerOrdersMap.get(value) || [];
    setOrderOptions(orders);
    if (orders.length === 1) {
      form.setFieldsValue({ orderId: orders[0].value });
    } else {
      form.setFieldsValue({ orderId: undefined });
    }
  };

  // Handle add agreement
  const handleAddAgreement = async (values) => {
    setLoading(true);
    try {
      const dealerStoreId = getDealerStoreId();
      if (!dealerStoreId) {
        toast.error('Không xác định được cửa hàng.');
        return;
      }

      const agreementData = {
        customerId: values.customerId,
        orderId: values.orderId,
        agreementDate: values.agreementDate.format('DD/MM/YYYY'),
        termsAndConditions: values.termsAndConditions,
        status: values.status || 'Active',
        fileUrl: values.fileUrl || '',
        storeId: dealerStoreId, // BẮT BUỘC: Gán storeId
      };

      await ManageServiceSaleAgreements.AddSaleAgreement(agreementData);
      toast.success('Thêm hợp đồng thành công!');

      // Refresh agreements
      const agreementDataUpdated = await ManageServiceSaleAgreements.getAllSaleAgreements();
      const agreementsInStore = agreementDataUpdated.filter(a => a.storeId === dealerStoreId);

      const formattedData = agreementsInStore.map(item => ({
        key: item.agreementId,
        customerName: item.customerName || 'N/A',
        agreementDate: item.agreementDate || 'N/A',
        termsAndConditions: item.termsAndConditions || 'N/A',
        status: item.status || 'N/A',
      }));

      setSaleAgreements(formattedData);
      setFilteredAgreements(formattedData);
      setIsModalVisible(false);
      form.resetFields();
      setOrderOptions([]);
    } catch (error) {
      console.error('Failed to add agreement:', error);
      toast.error('Thêm hợp đồng thất bại.');
    } finally {
      setLoading(false);
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
    form.resetFields();
    setOrderOptions([]);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setOrderOptions([]);
  };

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
      sorter: (a, b) => new Date(a.agreementDate.split('/').reverse().join('-')) - new Date(b.agreementDate.split('/').reverse().join('-')),
    },
    {
      title: 'Terms and Conditions',
      dataIndex: 'termsAndConditions',
      key: 'termsAndConditions',
      sorter: (a, b) => a.termsAndConditions.localeCompare(b.termsAndConditions),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      sorter: (a, b) => a.status.localeCompare(b.status),
    },
  ];

  const totalAgreements = filteredAgreements.length;

  return (
    <div>
      <Title level={2} style={{ color: '#1F1F1F', marginBottom: 24 }}>
        Sale Management
      </Title>

      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="Agreements" key="agreements">
          <Title level={4} style={{ marginBottom: 16 }}>
            Agreements
          </Title>

          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col span={20}>
              <Input
                placeholder="Tìm theo tên khách hàng hoặc ngày hợp đồng"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
              />
            </Col>
            <Col span={4}>
              <Button type="primary" onClick={showModal} style={{ width: '100%' }}>
                Add Agreement
              </Button>
            </Col>
          </Row>

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
              showTotal: (total, range) => `Hiển thị ${range[0]} đến ${range[1]} của ${total} hợp đồng`,
            }}
            bordered
            style={{ width: '100%' }}
          />
        </TabPane>

        <TabPane tab="Quotations" key="quotations">
          <Quotation />
        </TabPane>

        <TabPane tab="Orders" key="orders">
          <Orders />
        </TabPane>
      </Tabs>

      {/* Add Agreement Modal */}
      <Modal
        title="Thêm Hợp Đồng Bán Hàng Mới"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleAddAgreement}>
          <Form.Item
            name="customerId"
            label="Khách hàng"
            rules={[{ required: true, message: 'Vui lòng chọn khách hàng!' }]}
          >
            <Select
              showSearch
              placeholder="Chọn khách hàng"
              optionFilterProp="label"
              options={customers}
              onChange={handleCustomerChange}
            />
          </Form.Item>

          <Form.Item
            name="orderId"
            label="Đơn hàng"
            rules={[{ required: true, message: 'Vui lòng chọn đơn hàng!' }]}
          >
            <Select
              showSearch
              placeholder="Chọn đơn hàng"
              optionFilterProp="label"
              options={orderOptions}
              disabled={orderOptions.length === 0}
            />
          </Form.Item>

          <Form.Item
            name="agreementDate"
            label="Ngày hợp đồng"
            rules={[{ required: true, message: 'Vui lòng chọn ngày!' }]}
          >
            <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="termsAndConditions"
            label="Điều khoản"
            rules={[{ required: true, message: 'Vui lòng nhập điều khoản!' }]}
          >
            <Input.TextArea rows={4} placeholder="Nhập điều khoản hợp đồng..." />
          </Form.Item>

          <Form.Item name="status" label="Trạng thái" initialValue="Active">
            <Select
              options={[
                { value: 'Active', label: 'Active' },
                { value: 'Inactive', label: 'Inactive' },
                { value: 'Pending', label: 'Pending' },
              ]}
            />
          </Form.Item>

          <Form.Item name="fileUrl" label="File URL (tùy chọn)">
            <Input placeholder="Ví dụ: contract_001.pdf" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} style={{ marginRight: 8 }}>
              Thêm Hợp Đồng
            </Button>
            <Button onClick={handleCancel}>Hủy</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ManageSaleAgreements;