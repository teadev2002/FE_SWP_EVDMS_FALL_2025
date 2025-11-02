import React, { useState, useEffect } from 'react';
import {
  Table,
  Typography,
  Form,
  Button,
  Input,
  Select,
  DatePicker,
  Modal,
  Tabs,
  Row,
  Col,
  Tag,
} from 'antd';
import ManageServiceSaleAgreements from '../../../services/ManageAgreements/ManageServiceSaleAgreements';
import ManageCustomersService from '../../../services/ManageCustomers/ManageCustomersService';
import ManageOrdersService from '../../../services/ManageOrders/ManageOrdersService';
import Quotation from './Quotation';
import Orders from './Orders';
import { toast } from 'react-toastify';

const { Title } = Typography;
const { TabPane } = Tabs;

const ManageSaleAgreements = () => {
  const [agreements, setSaleAgreements] = useState([]);
  const [filteredAgreements, setFilteredAgreements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('agreements');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [customers, setCustomers] = useState([]); // Chỉ khách có order
  const [orderOptions, setOrderOptions] = useState([]);
  const [customerOrdersMap, setCustomerOrdersMap] = useState(new Map());
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [form] = Form.useForm();

  // Lấy storeId từ localStorage
  const getDealerStoreId = () => {
    try {
      const dealerInfo = JSON.parse(localStorage.getItem('dealerInfo') || '{}');
      return dealerInfo.storeId ? Number(dealerInfo.storeId) : null;
    } catch {
      return null;
    }
  };

  // === TẢI DỮ LIỆU ===
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const dealerStoreId = getDealerStoreId();

      if (!dealerStoreId) {
        toast.error('Không tìm thấy thông tin cửa hàng. Vui lòng đăng nhập lại.');
        setLoading(false);
        return;
      }

      try {
        // 1. LẤY TẤT CẢ HỢP ĐỒNG + LỌC THEO STORE
        const agreementData = await ManageServiceSaleAgreements.getAllSaleAgreements();
        const agreementsInStore = agreementData.filter(a => Number(a.storeId) === dealerStoreId);

        const formattedAgreements = agreementsInStore.map(item => ({
          key: item.agreementId,
          customerName: item.customerName || 'N/A',
          agreementDate: item.agreementDate || 'N/A',
          termsAndConditions: item.termsAndConditions || 'N/A',
          status: item.status || 'N/A',
        }));

        setSaleAgreements(formattedAgreements);
        setFilteredAgreements(formattedAgreements);

        // 2. LẤY KHÁCH HÀNG THEO STORE
        let customerData = [];
        try {
          customerData = await ManageCustomersService.getCustomerByStoreId(dealerStoreId);
        } catch (error) {
          console.error('Lỗi tải khách hàng:', error);
          toast.warn('Không tải được danh sách khách hàng.');
        }

        // 3. LẤY TẤT CẢ ĐƠN HÀNG + LỌC THEO STORE
        let orderData = [];
        try {
          orderData = await ManageOrdersService.getAllOrder();
        } catch (error) {
          console.error('Lỗi tải đơn hàng:', error);
          toast.warn('Không tải được danh sách đơn hàng.');
        }

        const ordersInStore = orderData.filter(order =>
          order.dealer?.storeId != null && Number(order.dealer.storeId) === dealerStoreId
        );

        // 4. XÂY DỰNG MAP: customerId → danh sách order
        const map = new Map();
        const customerIdsInStore = new Set(customerData.map(c => c.customerId));

        ordersInStore.forEach(order => {
          if (customerIdsInStore.has(order.customerId)) {
            if (!map.has(order.customerId)) {
              map.set(order.customerId, []);
            }
            map.get(order.customerId).push({
              value: order.orderId,
              label: `Order #${order.orderId} - ${order.totalPrice?.toLocaleString('vi-VN') || 0}₫`
            });
          }
        });

        setCustomerOrdersMap(map);

        // 5. CHỈ LẤY KHÁCH HÀNG CÓ ĐƠN HÀNG
        const customersWithOrders = customerData
          .filter(c => map.has(c.customerId))
          .map(c => ({
            value: c.customerId,
            label: c.fullName
          }));

        setCustomers(customersWithOrders);

      } catch (error) {
        console.error('Lỗi tải dữ liệu:', error);
        toast.error('Không thể tải dữ liệu. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // === TÌM KIẾM ===
  useEffect(() => {
    const filtered = agreements.filter(
      (agreement) =>
        agreement.customerName.toLowerCase().includes(searchText.toLowerCase()) ||
        agreement.agreementDate.includes(searchText)
    );
    setFilteredAgreements(filtered);
    setCurrentPage(1);
  }, [searchText, agreements]);

  // === KHI CHỌN KHÁCH HÀNG → HIỆN DANH SÁCH ĐƠN HÀNG ===
  const handleCustomerChange = (value) => {
    const orders = customerOrdersMap.get(value) || [];
    setOrderOptions(orders);

    if (orders.length === 1) {
      form.setFieldsValue({ orderId: orders[0].value });
    } else {
      form.setFieldsValue({ orderId: undefined });
    }
  };

  // === THÊM HỢP ĐỒNG ===
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
        storeId: dealerStoreId,
      };

      await ManageServiceSaleAgreements.AddSaleAgreement(agreementData);
      toast.success('Thêm hợp đồng thành công!');

      // REFRESH
      const agreementDataUpdated = await ManageServiceSaleAgreements.getAllSaleAgreements();
      const agreementsInStore = agreementDataUpdated.filter(a => Number(a.storeId) === dealerStoreId);

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
      console.error('Lỗi thêm hợp đồng:', error);
      toast.error('Thêm hợp đồng thất bại.');
    } finally {
      setLoading(false);
    }
  };

  // === MODAL ===
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

  // === CỘT BẢNG ===
  const columns = [
    {
      title: 'Khách hàng',
      dataIndex: 'customerName',
      key: 'customerName',
      sorter: (a, b) => a.customerName.localeCompare(b.customerName),
    },
    {
      title: 'Ngày hợp đồng',
      dataIndex: 'agreementDate',
      key: 'agreementDate',
      sorter: (a, b) => {
        const parse = d => {
          if (!d || d === 'N/A') return 0;
          const [day, month, year] = d.split('/').map(Number);
          return new Date(year, month - 1, day).getTime();
        };
        return parse(a.agreementDate) - parse(b.agreementDate);
      },
    },
    {
      title: 'Điều khoản',
      dataIndex: 'termsAndConditions',
      key: 'termsAndConditions',
      ellipsis: true,
      sorter: (a, b) => a.termsAndConditions.localeCompare(b.termsAndConditions),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'Active' ? 'green' : status === 'Pending' ? 'orange' : 'red'}>
          {status}
        </Tag>
      ),
      sorter: (a, b) => a.status.localeCompare(b.status),
    },
  ];

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
          <Title level={3} style={{ color: '#1F1F1F', marginBottom: 24 }}>
            Quản lý hợp đồng bán hàng
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
                Thêm hợp đồng
              </Button>
            </Col>
          </Row>

          <div style={{ marginBottom: 16, fontSize: 14, color: '#666' }}>
            Hiển thị {startIndex} đến {endIndex} của {totalAgreements} hợp đồng
          </div>

          <Table
            columns={columns}
            dataSource={filteredAgreements}
            loading={loading}
            rowKey="key"
            pagination={{
              pageSize,
              current: currentPage,
              total: totalAgreements,
              onChange: (page) => setCurrentPage(page),
              showTotal: (total, range) => `Hiển thị ${range[0]}-${range[1]} của ${total} hợp đồng`,
            }}
            bordered
          />
        </TabPane>

        <TabPane tab="Quotations" key="quotations">
          <Quotation />
        </TabPane>

        <TabPane tab="Orders" key="orders">
          <Orders />
        </TabPane>
      </Tabs>

      {/* MODAL THÊM HỢP ĐỒNG */}
      <Modal
        title="Thêm Hợp Đồng Bán Hàng Mới"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={700}
      >
        <Form form={form} layout="vertical" onFinish={handleAddAgreement}>
          {/* KHÁCH HÀNG - CHỈ CÓ ORDER TRONG STORE */}
          <Form.Item
            name="customerId"
            label="Khách hàng"
            rules={[{ required: true, message: 'Vui lòng chọn khách hàng!' }]}
          >
            <Select
              showSearch
              placeholder="Chọn khách hàng (phải có đơn hàng)"
              optionFilterProp="label"
              options={customers}
              onChange={handleCustomerChange}
              notFoundContent="Không có khách hàng nào có đơn hàng"
            />
          </Form.Item>

          {/* ĐƠN HÀNG - TỰ ĐỘNG HIỆN KHI CHỌN KHÁCH */}
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
              notFoundContent="Chọn khách hàng trước"
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
            <Select>
              <Select.Option value="Active">Active</Select.Option>
              <Select.Option value="Inactive">Inactive</Select.Option>
              <Select.Option value="Pending">Pending</Select.Option>
            </Select>
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