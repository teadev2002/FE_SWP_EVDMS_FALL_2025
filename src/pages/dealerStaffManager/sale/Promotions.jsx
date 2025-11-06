import { toast } from 'react-toastify';
import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, DatePicker, Typography } from 'antd';
import dayjs from 'dayjs';
import ManageServicePromotions from '../../../services/ManagePromotions/ManageServicePromotions.jsx';
const { Title } = Typography;

const Promotions = () => {
  const [promotions, setPromotions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPromotions = async () => {
      setLoading(true);
      try {
        const data = await ManageServicePromotions.getAllPromotions();
        const mappedPromotions = data.map(promo => ({
          id: promo.promotionId.toString(),
          title: promo.title,
          description: promo.description,
          validFrom: dayjs(promo.startDate).format('DD-MM-YYYY'),
          validTo: dayjs(promo.endDate).format('DD-MM-YYYY'),
          cta: `Save ${promo.discountPercent}%`,
          hidden: false,
        }));
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
        validFrom: dayjs(promo.validFrom, 'DD-MM-YYYY'),
        validTo: dayjs(promo.validTo, 'DD-MM-YYYY'),
        discountPercent: parseInt(promo.cta.match(/\d+/)[0], 10),
      });
    } else {
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const promoData = {
        title: values.title,
        description: values.description,
        discountPercent: parseInt(values.discountPercent, 10),
        startDate: values.validFrom.format('YYYY-MM-DD'),
        endDate: values.validTo.format('YYYY-MM-DD'),
      };

      if (editingPromo) {
        const response = await ManageServicePromotions.editPromotion(editingPromo.id, promoData);
        setPromotions(promotions.map(p =>
          p.id === editingPromo.id
            ? {
              id: response.promotionId ? response.promotionId.toString() : p.id,
              title: response.title,
              description: response.description,
              validFrom: dayjs(response.startDate).format('DD-MM-YYYY'),
              validTo: dayjs(response.endDate).format('DD-MM-YYYY'),
              cta: `Save ${response.discountPercent}%`,
              hidden: p.hidden,
            }
            : p
        ));
        toast.success('Promotion updated successfully');
      } else {
        const response = await ManageServicePromotions.AddPromotion(promoData);
        setPromotions([
          ...promotions,
          {
            id: response.promotionId.toString(),
            title: response.title,
            description: response.description,
            validFrom: dayjs(response.startDate).format('DD-MM-YYYY'),
            validTo: dayjs(response.endDate).format('DD-MM-YYYY'),
            cta: `Save ${response.discountPercent}%`,
            hidden: false,
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

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
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
    },
    {
      title: 'Valid To',
      dataIndex: 'validTo',
      key: 'validTo',
    },
    {
      title: 'Discount',
      dataIndex: 'cta',
      key: 'cta',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button
              onClick={() => showModal(record)}
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.875rem',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                color: 'white'  // ← Thêm/confirm màu chữ trắng
              }}
            // ... onMouseEnter/onMouseLeave
            >
              Edit
            </Button>
            <Button
              onClick={() => deletePromotion(record.id)}
              style={{
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.875rem',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                color: 'white'  // ← Thêm/confirm màu chữ trắng
              }}
            // ... onMouseEnter/onMouseLeave
            >
              Delete
            </Button>
          </div>
        </>
      ),
    },
  ];

  return (
    <>
      <Title level={2}>Sale Promotion</Title>
      <Button
        type="primary"
        style={{ marginBottom: 16 }}
        onClick={() => showModal()}
      >
        Add Promotion
      </Button>
      <Table
        columns={columns}
        dataSource={promotions.filter(p => !p.hidden)}
        rowKey="id"
        loading={loading}
        aria-label="Current promotions"
      />
      <Modal
        title={editingPromo ? 'Edit Promotion' : 'Add Promotion'}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
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
          >
            <Input type="number" min={0} step={1} />
          </Form.Item>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Form.Item
              name="validFrom"
              label="Valid From"
              rules={[{ required: true, message: 'Please select start date' }]}
            >
              <DatePicker format="DD-MM-YYYY" />
            </Form.Item>
            <Form.Item
              name="validTo"
              label="Valid To"
              rules={[
                { required: true, message: 'Please select end date' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('validFrom') <= value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('End date must be after start date'));
                  },
                }),
              ]}
            >
              <DatePicker format="DD-MM-YYYY" />
            </Form.Item>
          </div>

        </Form>
      </Modal>
    </>
  );
};

export default Promotions;