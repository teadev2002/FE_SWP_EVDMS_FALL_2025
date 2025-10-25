import React, { useState, useEffect } from 'react';
import {
  Table, Button, Modal, Form, Input, Space, Popconfirm, Typography, Row, Col, Select,
} from 'antd';
import {
  ShopOutlined, GlobalOutlined, LinkOutlined, CalendarOutlined,
  PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined,
} from '@ant-design/icons';
import { toast } from 'react-toastify';
import ManageBrandService from '../../../services/ManageBrand/ManageBrandService.jsx';

const { Title } = Typography;
const { Option } = Select;

const BrandManage = () => {
  const [brands, setBrands] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch brands using ManageBrandService
  useEffect(() => {
    const fetchBrands = async () => {
      setLoading(true);
      try {
        const data = await ManageBrandService.getAllBrands();
        const mappedData = data.map(brand => ({
          ...brand,
          id: brand.brandId,
          key: brand.brandId.toString(),
        }));
        setBrands(mappedData);
      } catch (error) {
        toast.error('Failed to load brands', error);
      }
      setLoading(false);
    };
    fetchBrands();
  }, []);

  // Handle search
  useEffect(() => {
    const fetchBrands = async () => {
      setLoading(true);
      try {
        const data = await ManageBrandService.getAllBrands();
        const filteredData = data.filter((brand) =>
          brand.brandName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          brand.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
          brand.website.toLowerCase().includes(searchTerm.toLowerCase())
        );
        const mappedData = filteredData.map(brand => ({
          ...brand,
          id: brand.brandId,
          key: brand.brandId.toString(),
        }));
        setBrands(mappedData);
      } catch (error) {
        toast.error('Failed to load brands', error);
      }
      setLoading(false);
    };
    fetchBrands();
  }, [searchTerm]);

  // Styles (same as StaffManagement)
  const buttonStyle = {
    borderRadius: 8,
    transition: 'all 0.3s ease',
  };

  const inputStyle = {
    borderRadius: 8,
  };

  // Handle create or update brand
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      const brandData = {
        brandName: values.brandName,
        country: values.country,
        website: values.website,
        founderYear: values.founderYear,
      };

      if (editingBrand) {
        // Update existing brand
        await ManageBrandService.UpdateBrand(editingBrand.brandId, brandData);
        const updatedBrand = {
          ...editingBrand,
          ...brandData,
          id: editingBrand.brandId,
          key: editingBrand.key,
        };
        setBrands(
          brands.map((brand) =>
            brand.brandId === editingBrand.brandId ? updatedBrand : brand
          )
        );
        toast.success('Brand updated successfully');
      } else {
        // Create new brand
        const response = await ManageBrandService.CreateBrand(brandData);
        const newBrand = {
          ...brandData,
          brandId: response.brandId,
          id: response.brandId,
          key: response.brandId.toString(),
        };
        setBrands([...brands, newBrand]);
        toast.success('Brand added successfully');
      }
      setIsModalVisible(false);
      setEditingBrand(null);
      form.resetFields();
    } catch (error) {
      toast.error(`Failed to ${editingBrand ? 'update' : 'create'} brand`, error);
    }
    setLoading(false);
  };

  // Handle edit
  const handleEdit = async (brand) => {
    if (!brand.brandId) {
      toast.error('Cannot edit brand: Invalid brand ID');
      return;
    }
    setLoading(true);
    try {
      const data = await ManageBrandService.GetBrandById(brand.brandId);
      setEditingBrand(data);
      form.setFieldsValue({
        brandName: data.brandName,
        country: data.country,
        website: data.website,
        founderYear: data.founderYear,
      });
      setIsModalVisible(true);
    } catch (error) {
      toast.error('Failed to load brand details', error);
    }
    setLoading(false);
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!id) {
      toast.error('Cannot delete brand: Invalid brand ID');
      return;
    }
    setLoading(true);
    try {
      await ManageBrandService.DeleteBrand(id);
      setBrands(brands.filter((brand) => brand.brandId !== id));
      toast.success('Brand deleted successfully');
    } catch (error) {
      toast.error('Failed to delete brand', error);
    }
    setLoading(false);
  };

  // Handle create new brand
  const handleCreate = () => {
    setEditingBrand(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  // Handle modal cancel
  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingBrand(null);
    form.resetFields();
  };

  // Table columns
  const columns = [
    {
      title: 'Brand Name',
      dataIndex: 'brandName',
      key: 'brandName',
      sorter: (a, b) => a.brandName.localeCompare(b.brandName),
    },
    {
      title: 'Country',
      dataIndex: 'country',
      key: 'country',
      sorter: (a, b) => a.country.localeCompare(b.country),
    },
    {
      title: 'Website',
      dataIndex: 'website',
      key: 'website',
      render: (text) => (
        <a href={`https://${text}`} target="_blank" rel="noopener noreferrer">
          {text}
        </a>
      ),
    },
    {
      title: 'Founder Year',
      dataIndex: 'founderYear',
      key: 'founderYear',
      sorter: (a, b) => a.founderYear - b.founderYear,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            style={{ ...buttonStyle, color: '#007BFF', borderColor: '#007BFF' }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this brand?"
            onConfirm={() => handleDelete(record.brandId)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ style: { ...buttonStyle, background: '#007BFF', borderColor: '#007BFF' } }}
            cancelButtonProps={{ style: buttonStyle }}
          >
            <Button
              icon={<DeleteOutlined />}
              style={{ ...buttonStyle, color: '#FF4D4F', borderColor: '#FF4D4F' }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Title level={2} style={{ color: '#1F1F1F', marginBottom: 24 }}>
        Brand Management
      </Title>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={20}>
          <Input
            prefix={<SearchOutlined style={{ color: '#007BFF' }} />}
            placeholder="Search by Name, Country, or Website"
            style={{ ...inputStyle }}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>
        <Col span={4}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreate}
            style={{ ...buttonStyle, background: '#007BFF', borderColor: '#007BFF' }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            Add Brand
          </Button>
        </Col>
      </Row>
      <Table
        columns={columns}
        dataSource={brands}
        rowKey="key"
        loading={loading}
        style={{ marginTop: 16 }}
        pagination={{
          pageSize: 10,
          showTotal: (total, range) => `Showing ${range[0]} to ${range[1]} of ${total} Brand${total !== 1 ? 's' : ''}`,
        }}
      />
      <Modal
        title={editingBrand ? 'Edit Brand' : 'Add Brand'}
        open={isModalVisible}
        onOk={handleSave}
        onCancel={handleCancel}
        okText="Save"
        cancelText="Cancel"
        okButtonProps={{ style: { ...buttonStyle, background: '#007BFF', borderColor: '#007BFF' }, loading: loading }}
        cancelButtonProps={{ style: buttonStyle }}
      >
        <Form
          form={form}
          layout="vertical"
          style={{ padding: '24px' }}
        >
          <Form.Item
            name="brandName"
            label="Brand Name"
            rules={[
              { required: true, message: 'Please enter the brand name' },
              { min: 2, message: 'Brand name must be at least 2 characters' },
            ]}
          >
            <Input
              prefix={<ShopOutlined style={{ color: '#007BFF' }} />}
              placeholder="Enter brand name"
              style={inputStyle}
            />
          </Form.Item>
          <Form.Item
            name="country"
            label="Country"
            rules={[{ required: true, message: 'Please select a country' }]}
          >
            <Select
              placeholder="Select country"
              style={inputStyle}
            >
              <Option value="VN">Vietnam</Option>
              <Option value="US">United States</Option>
              <Option value="KR">South Korea</Option>
              <Option value="JP">Japan</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="website"
            label="Website"
            rules={[
              { required: true, message: 'Please enter the website' },
              {
                pattern: /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/,
                message: 'Please enter a valid domain name (e.g., example.com)',
              },
            ]}
          >
            <Input
              prefix={<LinkOutlined style={{ color: '#007BFF' }} />}
              placeholder="Enter website (e.g., example.com)"
              style={inputStyle}
            />
          </Form.Item>
          <Form.Item
            name="founderYear"
            label="Founder Year"
            rules={[
              { required: true, message: 'Please enter the founder year' },
              {
                pattern: /^\d{4}$/,
                message: 'Please enter a valid 4-digit year',
              },
            ]}
          >
            <Input
              prefix={<CalendarOutlined style={{ color: '#007BFF' }} />}
              placeholder="Enter founder year (e.g., 2003)"
              style={inputStyle}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BrandManage;