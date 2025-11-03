// import React, { useState, useEffect } from 'react';
// import {
//   Table,
//   Card,
//   Button,
//   Typography,
//   Space,
//   Tag,
//   Modal,
//   Form,
//   Input,
//   Select,
//   Divider,
// } from 'antd';
// import {
//   CreditCardOutlined,
//   ClockCircleOutlined,
//   CheckCircleOutlined,
// } from '@ant-design/icons';
// import ManageOrdersService from '../../../services/ManageOrders/ManageOrdersService';
// import ManagePaymentService from '../../../services/Payment/PaymentService';
// import { toast } from 'react-toastify';

// const { Title, Text } = Typography;
// const { Option } = Select;

// const PaymentManagement = () => {
//   const [orders, setOrders] = useState([]);
//   const [filteredOrders, setFilteredOrders] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
//   const [paymentForm] = Form.useForm();
//   const [searchText, setSearchText] = useState('');

//   // Lấy storeId từ localStorage
//   const getDealerStoreId = () => {
//     try {
//       const dealerInfo = JSON.parse(localStorage.getItem('dealerInfo') || '{}');
//       return dealerInfo.storeId ? Number(dealerInfo.storeId) : null;
//     } catch {
//       return null;
//     }
//   };

//   // === TẢI DANH SÁCH ORDER PENDING ===
//  useEffect(() => {
//   const fetchPendingOrders = async () => {
//     setLoading(true);
//     const dealerStoreId = getDealerStoreId();

//     if (!dealerStoreId) {
//       toast.error('Không tìm thấy thông tin cửa hàng. Vui lòng đăng nhập lại.');
//       setLoading(false);
//       return;
//     }

//     try {
//       const orderData = await ManageOrdersService.getAllOrder();
//       const ordersInStore = orderData.filter(
//         (order) =>
//           order.dealer?.storeId != null &&
//           Number(order.dealer.storeId) === dealerStoreId &&
//           order.status === 'Pending'
//       );

//       const formattedOrders = ordersInStore.map((order) => {
//         // ƯU TIÊN LẤY XE TỪ QUOTE "Accepted"
//         let vehicleModel = 'Chưa chọn xe';
//         const acceptedQuote = order.quotes?.find(q => q.status === 'Accepted');
//         const targetQuote = acceptedQuote || order.quotes?.[0];

//         if (targetQuote?.vehicle?.modelName) {
//           vehicleModel = targetQuote.vehicle.modelName;
//         }

//         return {
//           key: order.orderId,
//           orderId: order.orderId,
//           customerId: order.customerId,
//           customerName: order.customer?.fullName || 'N/A',
//           vehicleModel,
//           totalAmount: Number(order.totalPrice) || 0,
//           currency: 'VND',
//           status: order.status,
//         };
//       });

//       setOrders(formattedOrders);
//       setFilteredOrders(formattedOrders);
//     } catch (error) {
//       console.error('Lỗi tải đơn hàng:', error);
//       toast.error('Không thể tải danh sách đơn hàng');
//     } finally {
//       setLoading(false);
//     }
//   };

//   fetchPendingOrders();
// }, []);
//   // === TÌM KIẾM ===
//  useEffect(() => {
//   const filtered = orders.filter((order) => {
//     const search = searchText.toLowerCase();
//     const orderIdStr = String(order.orderId).toLowerCase();

//     return (
//       orderIdStr.includes(search) ||
//       (order.customerName || '').toLowerCase().includes(search) ||
//       (order.vehicleModel || '').toLowerCase().includes(search)
//     );
//   });
//   setFilteredOrders(filtered);
// }, [searchText, orders]);
//   // === MỞ MODAL THANH TOÁN ===
// const handlePay = (order) => {
//   setSelectedOrder(order);
//   paymentForm.setFieldsValue({
//     orderId: order.orderId,
//     customerId: order.customerId, // ĐẢM BẢO
//     amount: order.totalAmount,
//   });
//   setIsPaymentModalVisible(true);
// };
//   const hidePaymentModal = () => {
//     setIsPaymentModalVisible(false);
//     setSelectedOrder(null);
//     paymentForm.resetFields();
//   };

//   // === TẠO THANH TOÁN PAYOS ===
//  const handleCreatePayment = async () => {
//   if (!selectedOrder) return;

//   setLoading(true);
//   try {
//     const dealerInfo = JSON.parse(localStorage.getItem('dealerInfo') || '{}');
//     const storeSlug = dealerInfo.storeSlug || 'unknown';

//     // TẠO ORDERCODE DUY NHẤT
//     const uniqueOrderCode = Number(`${selectedOrder.orderId}${Date.now().toString().slice(-6)}`);

//     const paymentData = {
//       customerId: selectedOrder.customerId,
//       orderId: selectedOrder.orderId,
//       amount: Math.round(selectedOrder.totalAmount * 1),
//       description: `Thanh toán đơn hàng #${selectedOrder.orderId}`,
//       returnUrl: `${window.location.origin}/store/${storeSlug}/payment-success`,
//       cancelUrl: `${window.location.origin}/store/${storeSlug}/payment-cancel`,
//       orderCode: uniqueOrderCode, // GỬI THÊM TRƯỜNG NÀY
//     };

//     console.log('Gửi paymentData:', paymentData); // DEBUG

//     const result = await ManagePaymentService.createPayment(paymentData);

//     if (result.checkoutUrl) {
//       toast.success('Đang chuyển đến cổng thanh toán PayOS...');
//       localStorage.setItem('currentPaymentId', result.paymentId);
//       localStorage.setItem('pendingOrderId', selectedOrder.orderId);
//       window.location.href = result.checkoutUrl;
//     }
//   } catch (error) {
//     console.error('Lỗi chi tiết:', error.response?.data || error);
//     toast.error(
//       error.response?.data?.message || 
//       'Tạo link thanh toán thất bại. Vui lòng thử lại.'
//     );
//   } finally {
//     setLoading(false);
//     hidePaymentModal();
//   }
// };
//   // === CỘT BẢNG ===
//   const columns = [
//     {
//        title: 'Mã đơn',
//       dataIndex: 'orderId',
//       key: 'orderId',
//       sorter: (a, b) => a.orderId - b.orderId, // số thì trừ được
//       render: (text) => <Text strong>#{text}</Text>, // hiển thị đẹp
//     },
//     {
//       title: 'Khách hàng',
//       dataIndex: 'customerName',
//       key: 'customerName',
//     },
//     {
//       title: 'Mẫu xe',
//       dataIndex: 'vehicleModel',
//       key: 'vehicleModel',
//       render: (text) => text || <Text type="secondary">Chưa chọn xe</Text>,
//     },
//     {
//       title: 'Tổng tiền',
//       dataIndex: 'totalAmount',
//       key: 'totalAmount',
//       render: (amount) => (
//         <Text strong>{amount.toLocaleString()} VND</Text>
//       ),
//       sorter: (a, b) => a.totalAmount - b.totalAmount,
//     },
//     {
//       title: 'Trạng thái',
//       dataIndex: 'status',
//       key: 'status',
//       render: () => (
//         <Tag icon={<ClockCircleOutlined />} color="orange">
//           Pending
//         </Tag>
//       ),
//     },
//     {
//       title: 'Hành động',
//       key: 'action',
//       render: (_, record) => (
//         <Button
//           type="primary"
//           icon={<CreditCardOutlined />}
//           onClick={() => handlePay(record)}
//         >
//           Thanh toán
//         </Button>
//       ),
//     },
//   ];

//   return (
//     <div>
//       <Title level={2} style={{ color: '#1F1F1F', marginBottom: 24 }}>
//         Quản lý thanh toán
//       </Title>

//       <Card>
//         <Space direction="vertical" size="middle" style={{ width: '100%' }}>
//           <Input
//             placeholder="Tìm theo mã đơn, khách hàng, mẫu xe..."
//             value={searchText}
//             onChange={(e) => setSearchText(e.target.value)}
//             allowClear
//             style={{ width: 300 }}
//           />

//           <Text type="secondary">
//             <CheckCircleOutlined /> Chỉ hiển thị đơn hàng <Tag color="orange">Pending</Tag> của cửa hàng bạn.
//           </Text>

//           <Table
//             columns={columns}
//             dataSource={filteredOrders}
//             loading={loading}
//             rowKey="key"
//             pagination={{
//               pageSize: 10,
//               showTotal: (total, range) =>
//                 `Hiển thị ${range[0]}-${range[1]} của ${total} đơn hàng`,
//             }}
//             bordered
//           />
//         </Space>
//       </Card>

//       {/* MODAL XÁC NHẬN THANH TOÁN */}
//       <Modal
//         title="Xác nhận thanh toán"
//         open={isPaymentModalVisible}
//         onCancel={hidePaymentModal}
//         footer={null}
//         width={500}
//       >
//         {selectedOrder && (
//           <Form form={paymentForm} layout="vertical" onFinish={handleCreatePayment}>
//             <Divider>Thông tin đơn hàng</Divider>

//             <Form.Item label="Mã đơn hàng">
//               <Input value={selectedOrder.orderId} disabled />
//             </Form.Item>

//             <Form.Item label="Khách hàng">
//               <Input value={selectedOrder.customerName} disabled />
//             </Form.Item>

//             <Form.Item label="Mẫu xe">
//               <Input value={selectedOrder.vehicleModel} disabled />
//             </Form.Item>

//             <Form.Item label="Số tiền cần thanh toán">
//               <Input
//                 value={`${selectedOrder.totalAmount.toLocaleString()} VND`}
//                 disabled
//                 style={{ color: '#d4380d', fontWeight: 'bold' }}
//               />
//             </Form.Item>

//             <Divider>Hướng dẫn</Divider>
//             <Text type="secondary">
//               Sau khi bấm <strong>"Tạo link thanh toán"</strong>, bạn sẽ được chuyển đến cổng PayOS.
//               <br />
//               <br />
//               Sau khi thanh toán thành công, vui lòng vào <strong>Trang Tracking Delivery</strong> để xác nhận và chuyển trạng thái đơn hàng sang <Tag color="processing">Processing</Tag>.
//             </Text>

//             <Form.Item style={{ marginTop: 24, marginBottom: 0 }}>
//               <Space>
//                 <Button type="primary" htmlType="submit" loading={loading} icon={<CreditCardOutlined />}>
//                   Tạo link thanh toán
//                 </Button>
//                 <Button onClick={hidePaymentModal}>Hủy</Button>
//               </Space>
//             </Form.Item>
//           </Form>
//         )}
//       </Modal>
//     </div>
//   );
// };

// export default PaymentManagement;

// tu dong processing khi tao link thanh toan thanh cong
import React, { useState, useEffect } from 'react';
import {
  Table,
  Card,
  Button,
  Typography,
  Space,
  Tag,
  Modal,
  Form,
  Input,
  Select,
  Divider,
} from 'antd';
import {
  CreditCardOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import ManageOrdersService from '../../../services/ManageOrders/ManageOrdersService';
import ManagePaymentService from '../../../services/Payment/PaymentService';
import { toast } from 'react-toastify';

const { Title, Text } = Typography;
const { Option } = Select;

const PaymentManagement = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
  const [paymentForm] = Form.useForm();
  const [searchText, setSearchText] = useState('');

  // Lấy storeId từ localStorage
  const getDealerStoreId = () => {
    try {
      const dealerInfo = JSON.parse(localStorage.getItem('dealerInfo') || '{}');
      return dealerInfo.storeId ? Number(dealerInfo.storeId) : null;
    } catch {
      return null;
    }
  };

  // === TẢI DANH SÁCH ORDER PENDING ===
 useEffect(() => {
  const fetchPendingOrders = async () => {
    setLoading(true);
    const dealerStoreId = getDealerStoreId();

    if (!dealerStoreId) {
      toast.error('Không tìm thấy thông tin cửa hàng. Vui lòng đăng nhập lại.');
      setLoading(false);
      return;
    }

    try {
      const orderData = await ManageOrdersService.getAllOrder();
      const ordersInStore = orderData.filter(
        (order) =>
          order.dealer?.storeId != null &&
          Number(order.dealer.storeId) === dealerStoreId &&
          order.status === 'Pending'
      );

      const formattedOrders = ordersInStore.map((order) => {
        // ƯU TIÊN LẤY XE TỪ QUOTE "Accepted"
        let vehicleModel = 'Chưa chọn xe';
        const acceptedQuote = order.quotes?.find(q => q.status === 'Accepted');
        const targetQuote = acceptedQuote || order.quotes?.[0];

        if (targetQuote?.vehicle?.modelName) {
          vehicleModel = targetQuote.vehicle.modelName;
        }

        return {
          key: order.orderId,
          orderId: order.orderId,
          customerId: order.customerId,
          customerName: order.customer?.fullName || 'N/A',
          vehicleModel,
          totalAmount: Number(order.totalPrice) || 0,
          currency: 'VND',
          status: order.status,
        };
      });

      setOrders(formattedOrders);
      setFilteredOrders(formattedOrders);
    } catch (error) {
      console.error('Lỗi tải đơn hàng:', error);
      toast.error('Không thể tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  fetchPendingOrders();
}, []);
  // === TÌM KIẾM ===
 useEffect(() => {
  const filtered = orders.filter((order) => {
    const search = searchText.toLowerCase();
    const orderIdStr = String(order.orderId).toLowerCase();

    return (
      orderIdStr.includes(search) ||
      (order.customerName || '').toLowerCase().includes(search) ||
      (order.vehicleModel || '').toLowerCase().includes(search)
    );
  });
  setFilteredOrders(filtered);
}, [searchText, orders]);
  // === MỞ MODAL THANH TOÁN ===
const handlePay = (order) => {
  setSelectedOrder(order);
  paymentForm.setFieldsValue({
    orderId: order.orderId,
    customerId: order.customerId, // ĐẢM BẢO
    amount: order.totalAmount,
  });
  setIsPaymentModalVisible(true);
};
  const hidePaymentModal = () => {
    setIsPaymentModalVisible(false);
    setSelectedOrder(null);
    paymentForm.resetFields();
  };

  // === TẠO THANH TOÁN PAYOS ===
 const handleCreatePayment = async () => {
  if (!selectedOrder) return;

  setLoading(true);
  try {
    const dealerInfo = JSON.parse(localStorage.getItem('dealerInfo') || '{}');
    const storeSlug = dealerInfo.storeSlug || 'unknown';

    // TẠO ORDERCODE DUY NHẤT
    const uniqueOrderCode = Number(`${selectedOrder.orderId}${Date.now().toString().slice(-6)}`);

    const paymentData = {
      customerId: selectedOrder.customerId,
      orderId: selectedOrder.orderId,
      amount: Math.round(selectedOrder.totalAmount * 1),
      description: `Thanh toán đơn hàng #${selectedOrder.orderId}`,
      returnUrl: `${window.location.origin}/store/${storeSlug}/payment-success`,
      cancelUrl: `${window.location.origin}/store/${storeSlug}/payment-cancel`,
      orderCode: uniqueOrderCode, // GỬI THÊM TRƯỜNG NÀY
    };

    console.log('Gửi paymentData:', paymentData); // DEBUG

    const result = await ManagePaymentService.createPayment(paymentData);

    if (result.checkoutUrl) {
      // TỰ ĐỘNG CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG SANG "Processing"
      try {
        const dealerId = dealerInfo.dealerId; // Giả sử dealerInfo có dealerId
        if (!dealerId) {
          throw new Error('Không tìm thấy dealerId');
        }

        // Lấy chi tiết order từ API
        const orderDetails = await ManageOrdersService.getOrderById(selectedOrder.orderId);

        // Xây dựng request body: sao chép từ orderDetails, cập nhật status và điền các field theo yêu cầu
        const updateBody = {
          ...orderDetails,
          customerId: orderDetails.customerId || selectedOrder.customerId,
          dealerId: dealerId,
          orderDate: new Date().toLocaleDateString('en-GB'), // "03/11/2025" theo định dạng dd/MM/yyyy
          totalPrice: orderDetails.totalPrice || selectedOrder.totalAmount,
          status: "Processing",
          note: "swagg 0944", // Theo yêu cầu
        };

        // Gọi API updateOrder
        await ManageOrdersService.updateOrder(selectedOrder.orderId, updateBody);

        toast.success('Đơn hàng đã được cập nhật trạng thái Processing');
      } catch (updateError) {
        console.error('Lỗi cập nhật trạng thái đơn hàng:', updateError);
        toast.warning('Tạo link thanh toán thành công nhưng cập nhật trạng thái thất bại. Vui lòng kiểm tra thủ công.');
      }

      toast.success('Đang chuyển đến cổng thanh toán PayOS...');
      localStorage.setItem('currentPaymentId', result.paymentId);
      localStorage.setItem('pendingOrderId', selectedOrder.orderId);
      window.location.href = result.checkoutUrl;
    }
  } catch (error) {
    console.error('Lỗi chi tiết:', error.response?.data || error);
    toast.error(
      error.response?.data?.message || 
      'Tạo link thanh toán thất bại. Vui lòng thử lại.'
    );
  } finally {
    setLoading(false);
    hidePaymentModal();
  }
};
  // === CỘT BẢNG ===
  const columns = [
    {
       title: 'Mã đơn',
      dataIndex: 'orderId',
      key: 'orderId',
      sorter: (a, b) => a.orderId - b.orderId, // số thì trừ được
      render: (text) => <Text strong>#{text}</Text>, // hiển thị đẹp
    },
    {
      title: 'Khách hàng',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: 'Mẫu xe',
      dataIndex: 'vehicleModel',
      key: 'vehicleModel',
      render: (text) => text || <Text type="secondary">Chưa chọn xe</Text>,
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount) => (
        <Text strong>{amount.toLocaleString()} VND</Text>
      ),
      sorter: (a, b) => a.totalAmount - b.totalAmount,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: () => (
        <Tag icon={<ClockCircleOutlined />} color="orange">
          Pending
        </Tag>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Button
          type="primary"
          icon={<CreditCardOutlined />}
          onClick={() => handlePay(record)}
        >
          Thanh toán
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Title level={2} style={{ color: '#1F1F1F', marginBottom: 24 }}>
        Quản lý thanh toán
      </Title>

      <Card>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Input
            placeholder="Tìm theo mã đơn, khách hàng, mẫu xe..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
            style={{ width: 300 }}
          />

          <Text type="secondary">
            <CheckCircleOutlined /> Chỉ hiển thị đơn hàng <Tag color="orange">Pending</Tag> của cửa hàng bạn.
          </Text>

          <Table
            columns={columns}
            dataSource={filteredOrders}
            loading={loading}
            rowKey="key"
            pagination={{
              pageSize: 10,
              showTotal: (total, range) =>
                `Hiển thị ${range[0]}-${range[1]} của ${total} đơn hàng`,
            }}
            bordered
          />
        </Space>
      </Card>

      {/* MODAL XÁC NHẬN THANH TOÁN */}
      <Modal
        title="Xác nhận thanh toán"
        open={isPaymentModalVisible}
        onCancel={hidePaymentModal}
        footer={null}
        width={500}
      >
        {selectedOrder && (
          <Form form={paymentForm} layout="vertical" onFinish={handleCreatePayment}>
            <Divider>Thông tin đơn hàng</Divider>

            <Form.Item label="Mã đơn hàng">
              <Input value={selectedOrder.orderId} disabled />
            </Form.Item>

            <Form.Item label="Khách hàng">
              <Input value={selectedOrder.customerName} disabled />
            </Form.Item>

            <Form.Item label="Mẫu xe">
              <Input value={selectedOrder.vehicleModel} disabled />
            </Form.Item>

            <Form.Item label="Số tiền cần thanh toán">
              <Input
                value={`${selectedOrder.totalAmount.toLocaleString()} VND`}
                disabled
                style={{ color: '#d4380d', fontWeight: 'bold' }}
              />
            </Form.Item>

            <Divider>Hướng dẫn</Divider>
            <Text type="secondary">
              Sau khi bấm <strong>"Tạo link thanh toán"</strong>, bạn sẽ được chuyển đến cổng PayOS.
              <br />
              <br />
              Sau khi thanh toán thành công, vui lòng vào <strong>Trang Tracking Delivery</strong> để xác nhận và chuyển trạng thái đơn hàng sang <Tag color="processing">Processing</Tag>.
            </Text>

            <Form.Item style={{ marginTop: 24, marginBottom: 0 }}>
              <Space>
                <Button type="primary" htmlType="submit" loading={loading} icon={<CreditCardOutlined />}>
                  Tạo link thanh toán
                </Button>
                <Button onClick={hidePaymentModal}>Hủy</Button>
              </Space>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default PaymentManagement;