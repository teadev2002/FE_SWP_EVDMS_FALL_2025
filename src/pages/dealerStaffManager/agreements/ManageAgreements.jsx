import React, { useState, useEffect } from 'react';
import { Table } from 'antd'; // Giả sử bạn sử dụng antd để render bảng
import ManageServiceAgreements from '../../../services/ManageAgreements/ManageServiceAgreements'; // Đường dẫn đến file chứa service
import Quotation from './Quotation';
import Orders from './Orders';
import { Tabs } from 'antd';
const { TabPane } = Tabs;

const ManageAgreements = () => {
  const [agreements, setAgreements] = useState([]);
  const [loading, setLoading] = useState(false); // State để xử lý trạng thái loading
const [activeTab, setActiveTab] = useState('agreements');
  // Sử dụng useEffect để gọi API khi component mount
  useEffect(() => {
    const fetchAgreements = async () => {
      setLoading(true); // Bắt đầu loading
      try {
        const data = await ManageServiceAgreements.getAllAgreements();
        // Chuyển đổi dữ liệu để khớp với key của columns
        const formattedData = data.map(item => ({
          key: item.agreementId, // Key cho bảng
          customerName: item.customerName,
          agreementDate: item.agreementDate,
          status: item.status || 'N/A', // Nếu status là null thì hiển thị 'N/A'
        }));
        setAgreements(formattedData);
      } catch (error) {
        console.error('Failed to fetch agreements:', error);
      } finally {
        setLoading(false); // Kết thúc loading
      }
    };

    fetchAgreements();
  }, []); // Dependency array rỗng để chỉ gọi API một lần khi component mount

  // Định nghĩa columns cho bảng
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
      <h2>Manage Agreements</h2>
     <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="Agreements" key="agreements">
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
    </div>
  );
};

export default ManageAgreements;