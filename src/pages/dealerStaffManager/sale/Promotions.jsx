import {   toast } from 'react-toastify';
import React, { useCallback, useEffect, useState } from 'react';
import { Card, List, Button, Calendar, Modal, Form, Input, DatePicker } from 'antd';
import dayjs from 'dayjs';
import { Typography } from 'antd';
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
        // Edit promotion
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
        // Add new promotion
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

  const getListData = useCallback((value) => {
    const currentDate = dayjs(value.format('DD-MM-YYYY'), 'DD-MM-YYYY');
    return promotions
      .filter(p => !p.hidden)
      .filter(p => {
        const from = dayjs(p.validFrom, 'DD-MM-YYYY');
        const to = dayjs(p.validTo, 'DD-MM-YYYY');
        return currentDate.isSame(from) || currentDate.isSame(to) || (currentDate.isAfter(from) && currentDate.isBefore(to));
      })
      .map(p => ({ content: p.title }));
  }, [promotions]);

  const dateCellRender = useCallback((value) => {
    const listData = getListData(value);
    return (
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {listData.map((item, idx) => (
          <li key={idx} style={{ margin: '4px 0', color: '#1890ff' }}>{item.content}</li>
        ))}
      </ul>
    );
  }, [getListData]);

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
      <Card className="sidebar-card" style={{ marginBottom: 16 }}>
        <List
          loading={loading}
          dataSource={promotions.filter(p => !p.hidden)}
          renderItem={promo => (
            <List.Item
              key={promo.id}
              actions={[
                <Button type="link" onClick={() => showModal(promo)}>Edit</Button>,
                <Button type="link" onClick={() => deletePromotion(promo.id)}>Delete</Button>,
              ]}
            >
              <List.Item.Meta
                title={promo.title}
                description={promo.description}
              />
              <div>
                <span>Valid: {promo.validFrom} - {promo.validTo}</span>
                <Button size="small" type="link">{promo.cta}</Button>
              </div>
            </List.Item>
          )}
          aria-label="Current promotions"
        />
      </Card>

      <Card title="Promotion Calendar" className="calendar-card">
        <Calendar
          fullscreen={false}
          dateCellRender={dateCellRender}
          aria-label="Promotion calendar"
        />
      </Card>

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
            rules={[{ required: true, toast: 'Please enter promotion title' }]}
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
        </Form>
      </Modal>
    </>
  );
};

export default Promotions;