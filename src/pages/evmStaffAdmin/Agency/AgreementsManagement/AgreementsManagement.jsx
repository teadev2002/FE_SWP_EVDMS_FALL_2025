import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, Space, Typography, Card, message } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import ManageServiceSaleAgreements from '../../../../services/ManageAgreements/ManageServiceSaleAgreements';
import ManageStoreService from '../../../../services/ManageStore/ManageStoreService';
import { toast } from 'react-toastify';

const { Title } = Typography;
const { Option } = Select;
const { Search } = Input;

const AgreementsManagement = () => {
  const [agreementsData, setAgreementsData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingKey, setEditingKey] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [storeNames, setStoreNames] = useState({}); // { "1": "CuongStore", ... }
  const [form] = Form.useForm();

  // Hàm fetch tên cửa hàng theo danh sách storeId
  const fetchStoreNames = async (storeIds) => {
    try {
      const storePromises = storeIds.map(id => ManageStoreService.getStoreById(id));
      const stores = await Promise.all(storePromises);
      const nameMap = {};
      stores.forEach(store => {
        nameMap[store.storeId] = store.storeName || `Store ${store.storeId}`;
      });
      setStoreNames(prev => ({ ...prev, ...nameMap }));
    } catch (error) {
      console.error('Failed to fetch store names:', error);
      message.error('Failed to load store names');
    }
  };

  // Fetch agreements + store names
  useEffect(() => {
    const fetchAgreements = async () => {
      setLoading(true);
      try {
        const data = await ManageServiceSaleAgreements.getAllSaleAgreements();
        const formattedData = data.map((item) => ({
          key: item.agreementId.toString(),
          agreementId: item.agreementId.toString(),
          type: 'Customer Purchase',
          party: item.customerName,
          status: item.status,
          agreementDate: item.agreementDate,
          details: item.termsAndConditions,
          storeId: item.storeId,
        }));
        setAgreementsData(formattedData);
        setFilteredData(formattedData);

        // Lấy danh sách storeId duy nhất
        const uniqueStoreIds = [...new Set(data.map(item => item.storeId))];
        if (uniqueStoreIds.length > 0) {
          await fetchStoreNames(uniqueStoreIds);
        }
      } catch (error) {
        message.error('Failed to fetch agreements: ' + error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAgreements();
  }, []);

  // Handle search
  const handleSearch = (value) => {
    setSearchQuery(value);
    const lowerCaseQuery = value.toLowerCase();
    const filtered = agreementsData.filter(
      (item) =>
        item.party.toLowerCase().includes(lowerCaseQuery) ||
        item.details.toLowerCase().includes(lowerCaseQuery)
    );
    setFilteredData(filtered);
  };

  // Show modal for editing
  const showModal = (record) => {
    form.setFieldsValue({
      status: record.status,
      details: record.details,
    });
    setEditingKey(record.key);
    setIsModalVisible(true);
  };

  // Handle form submission
  const handleSubmit = async (values) => {
    const formattedValues = {
      status: values.status,
      termsAndConditions: values.details,
    };

    try {
      await ManageServiceSaleAgreements.editSaleAgreement(editingKey, formattedValues);
      const updatedData = agreementsData.map((item) =>
        item.key === editingKey
          ? { ...item, status: values.status, details: values.details }
          : item
      );
      setAgreementsData(updatedData);
      setFilteredData(
        updatedData.filter(
          (item) =>
            item.party.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.details.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      toast.success('Agreement updated successfully');
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      toast.error('Failed to update agreement: ' + (error.message || 'Unknown error'));
    }
  };

  // Handle delete
  const handleDelete = async (key) => {
    try {
      await ManageServiceSaleAgreements.deleteSaleAgreement(key);
      const updatedData = agreementsData.filter((item) => item.key !== key);
      setAgreementsData(updatedData);
      setFilteredData(
        updatedData.filter(
          (item) =>
            item.party.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.details.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      toast.success('Agreement deleted successfully');
    } catch (error) {
      toast.error('Failed to delete agreement: ' + (error.message || 'Unknown error'));
    }
  };

  // Table columns
  const columns = [
    // {
    //   title: 'Agreement ID',
    //   dataIndex: 'agreementId',
    //   key: 'agreementId',
    //   sorter: (a, b) => a.agreementId.localeCompare(b.agreementId),
    // },
    {
      title: 'Customer Name',
      dataIndex: 'party',
      key: 'party',
      sorter: (a, b) => a.party.localeCompare(b.party),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Active', value: 'Active' },
        { text: 'Pending', value: 'Pending' },
        { text: 'Expired', value: 'Expired' },
        { text: 'Terminated', value: 'Terminated' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Agreement Date',
      dataIndex: 'agreementDate',
      key: 'agreementDate',
      sorter: (a, b) => dayjs(a.agreementDate, 'DD/MM/YYYY').unix() - dayjs(b.agreementDate, 'DD/MM/YYYY').unix(),
    },
    {
      title: 'Details',
      dataIndex: 'details',
      key: 'details',
    },
    {
      title: 'Store',
      key: 'store',
      render: (_, record) => {
        const storeName = storeNames[record.storeId];
        if (storeName === undefined) {
          return <span style={{ color: '#999', fontStyle: 'italic' }}>Loading...</span>;
        }
        return storeName;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => showModal(record)}>
            Edit
          </Button>
          <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.key)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Title level={2}>Agreements Management</Title>

      <Card
        title="Agreements List"
        style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}
      >
        <Search
          placeholder="Search by Customer Name or Details"
          allowClear
          onChange={(e) => handleSearch(e.target.value)}
          style={{ marginBottom: 16 }}
        />
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="key"
          pagination={{
            pageSize: 10,
            showTotal: (total, range) => `Showing ${range[0]} to ${range[1]} of ${total} Agreement${total !== 1 ? 's' : ''}`,
          }}
          loading={loading}
        />
      </Card>

      <Modal
        title="Edit Agreement"
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} initialValues={{ status: 'Active' }}>
          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: 'Please select a status' }]}
          >
            <Select>
              <Option value="Active">Active</Option>
              <Option value="Pending">Pending</Option>
              <Option value="Expired">Expired</Option>
              <Option value="Terminated">Terminated</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Details"
            name="details"
            rules={[{ required: true, message: 'Please enter agreement details' }]}
          >
            <Input.TextArea rows={4} placeholder="e.g., Purchase agreement details" />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Update
              </Button>
              <Button onClick={() => setIsModalVisible(false)}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AgreementsManagement;