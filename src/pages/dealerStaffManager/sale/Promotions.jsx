import { toast } from 'react-toastify';
import React, { useEffect, useState, useMemo } from 'react';
import { Table, Button, Modal, Form, Input, DatePicker, Typography, Row, Col } from 'antd';
import dayjs from 'dayjs';
import ManageServicePromotions from '../../../services/ManagePromotions/ManageServicePromotions.jsx';

const { Title } = Typography;
const { RangePicker } = DatePicker;

const Promotions = () => {
  const [promotions, setPromotions] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPromotions = async () => {
      setLoading(true);
      try {
        const data = await ManageServicePromotions.getAllPromotions();

        const mappedPromotions = data.map(promo => {
          const startDate = dayjs(promo.startDate, 'DD/MM/YYYY');
          const endDate = dayjs(promo.endDate, 'DD/MM/YYYY');

          return {
            id: promo.promotionId.toString(),
            title: promo.title,
            description: promo.description,
            validFrom: startDate.format('YYYY-MM-DD'), // ISO format
            validTo: endDate.format('YYYY-MM-DD'),     // ISO format
            cta: `Save ${promo.discountPercent}%`,
            hidden: false,
            _startDateObj: startDate, // for sorting
            _endDateObj: endDate,
          };
        });

        setPromotions(mappedPromotions);
      } catch (error) {
        console.error('Failed to fetch promotions:', error);
        toast.error('Failed to load promotions');
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  const showModal = (promo = null) => {
    setEditingPromo(promo);
    if (promo) {
      form.setFieldsValue({
        title: promo.title,
        description: promo.description,
        discountPercent: parseInt(promo.cta.match(/\d+/)[0], 10),
        dateRange: [
          dayjs(promo.validFrom), // already in YYYY-MM-DD
          dayjs(promo.validTo),
        ],
      });
    } else {
      form.resetFields();
    }
    setIsModalOpen(true);
  };

 const handleOk = async () => {
  try {
    const values = await form.validateFields();
    const [startDate, endDate] = values.dateRange;

    const dealerInfoStr = localStorage.getItem('dealerInfo');
    if (!dealerInfoStr) {
      toast.error('User info not found. Please log in again.');
      return;
    }
    const dealerInfo = JSON.parse(dealerInfoStr);
    const storeId = dealerInfo.storeId;

    // FIXED: Send DD/MM/YYYY to match API
    const promoData = {
      title: values.title,
      description: values.description,
      discountPercent: parseInt(values.discountPercent, 10),
      startDate: startDate.format('DD/MM/YYYY'),   // CHANGED
      endDate: endDate.format('DD/MM/YYYY'),       // CHANGED
      storeId,
    };

    if (editingPromo) {
      const response = await ManageServicePromotions.editPromotion(editingPromo.id, promoData);
      const startDate = dayjs(response.startDate, 'DD/MM/YYYY');
      const endDate = dayjs(response.endDate, 'DD/MM/YYYY');

      setPromotions(promotions.map(p =>
        p.id === editingPromo.id
          ? {
              id: response.promotionId?.toString() || p.id,
              title: response.title,
              description: response.description,
              validFrom: startDate.format('YYYY-MM-DD'),
              validTo: endDate.format('YYYY-MM-DD'),
              cta: `Save ${response.discountPercent}%`,
              hidden: p.hidden,
              _startDateObj: startDate,
              _endDateObj: endDate,
            }
          : p
      ));
      toast.success('Promotion updated successfully');
    } else {
      const response = await ManageServicePromotions.AddPromotion(promoData);
      const startDate = dayjs(response.startDate, 'DD/MM/YYYY');
      const endDate = dayjs(response.endDate, 'DD/MM/YYYY');

      setPromotions([
        ...promotions,
        {
          id: response.promotionId.toString(),
          title: response.title,
          description: response.description,
          validFrom: startDate.format('YYYY-MM-DD'),
          validTo: endDate.format('YYYY-MM-DD'),
          cta: `Save ${response.discountPercent}%`,
          hidden: false,
          _startDateObj: startDate,
          _endDateObj: endDate,
        },
      ]);
      toast.success('Promotion added successfully');
    }

    setIsModalOpen(false);
    form.resetFields();
  } catch (error) {
    console.error('Failed to save promotion:', error);
    toast.error('Failed to save promotion');
  }
};
  const deletePromotion = async (id) => {
    try {
      await ManageServicePromotions.deletePromotion(id);
      setPromotions(promotions.filter(p => p.id !== id));
      toast.success('Promotion deleted successfully');
    } catch (error) {
      console.error('Failed to delete promotion:', error);
      toast.error('Failed to delete promotion');
    }
  };

  const filteredPromotions = useMemo(() => {
    if (!searchText.trim()) return promotions;

    const lowerSearch = searchText.toLowerCase();
    return promotions.filter(promo =>
      ['title', 'description', 'validFrom', 'validTo', 'cta'].some(field =>
        promo[field]?.toString().toLowerCase().includes(lowerSearch)
      )
    );
  }, [promotions, searchText]);

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      sorter: (a, b) => (a.title || '').localeCompare(b.title || ''),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Valid From',
      dataIndex: 'validFrom',
      key: 'validFrom',
      render: (text) => dayjs(text).format('DD/MM/YYYY'), // UI only: show DD/MM/YYYY
      sorter: (a, b) => a._startDateObj - b._startDateObj,
    },
    {
      title: 'Valid To',
      dataIndex: 'validTo',
      key: 'validTo',
      render: (text) => dayjs(text).format('DD/MM/YYYY'), // UI only
      sorter: (a, b) => a._endDateObj - b._endDateObj,
    },
    {
      title: 'Discount',
      dataIndex: 'cta',
      key: 'cta',
      sorter: (a, b) => {
        const getPercent = (text) => {
          const match = text.match(/(\d+)%/);
          return match ? parseInt(match[1], 10) : 0;
        };
        return getPercent(a.cta) - getPercent(b.cta);
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <Button
            onClick={() => showModal(record)}
            style={{
              background: 'linear-gradient(135deg, #ec6e07ff 0%, #ceb24fff 100%)',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.875rem',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              color: 'white',
            }}
          >
            Edit
          </Button>
          <Button
            onClick={() => deletePromotion(record.id)}
            style={{
              background: 'linear-gradient(135deg, #b13d3dff 0%, #fb6161ff 100%)',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.875rem',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              color: 'white',
            }}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <Title level={2}>Sale Promotion</Title>

      <Row gutter={16} align="middle" style={{ marginBottom: 16 }}>
        <Col span={20}>
          <Input.Search
            placeholder="Search by title, description, dates, or discount..."
            allowClear
            enterButton="Search"
            size="large"
            onSearch={value => setSearchText(value)}
            onChange={e => setSearchText(e.target.value)}
            style={{ width: '100%' }}
          />
        </Col>
        <Col span={4}>
          <Button
            type="primary"
            onClick={() => showModal()}
            style={{ width: '100%' }}
            size="large"
          >
            Add Promotion
          </Button>
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={filteredPromotions.filter(p => !p.hidden)}
        rowKey="id"
        loading={loading}
        scroll={{ x: 'max-content' }}
      />

      <Modal
        title={editingPromo ? 'Edit Promotion' : 'Add Promotion'}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: 'Please enter promotion title' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter promotion description' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="discountPercent"
            label="Discount Percent"
            rules={[{ required: true, message: 'Please enter discount percent' }]}
          >
            <Input type="number" min={0} max={100} />
          </Form.Item>

          <Form.Item
            name="dateRange"
            label="Valid Period"
            rules={[
              { required: true, message: 'Please select date range' },
              {
                validator: (_, value) =>
                  value?.[0] && value?.[1]
                    ? Promise.resolve()
                    : Promise.reject(new Error('Please select both start and end dates')),
              },
            ]}
          >
            <RangePicker
              format="DD/MM/YYYY" // UI display only
              placeholder={['Start Date', 'End Date']}
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Promotions;