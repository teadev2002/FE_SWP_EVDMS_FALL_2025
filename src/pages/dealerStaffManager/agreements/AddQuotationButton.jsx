import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Modal, Form, Select, DatePicker, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import ManageQuoteService from '../../../services/ManageQuotes/ManageQuoteService';
import ManageDealerService from '../../../services/ManageDealer/ManageDealerService';
import ManageCustomersService from '../../../services/ManageCustomers/ManageCustomersService';
import ManageStorageService from '../../../services/ManageStorage/ManageStorageService';

const { Text } = Typography;

const TAX_RATE_OPTIONS = Array.from({ length: 91 }, (_, i) => i + 10);

const AddQuotationButton = ({ customer, onSuccess }) => {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [dealers, setDealers] = useState([]);
  const [vehiclePriceMap, setVehiclePriceMap] = useState({});
  const [priceWithTaxDisplay, setPriceWithTaxDisplay] = useState('Choose vehicle and tax rate');
  const [form] = Form.useForm();

  const storeId = useMemo(() => {
    try {
      const dealerInfo = JSON.parse(localStorage.getItem('dealerInfo') || '{}');
      return dealerInfo.storeId ? Number(dealerInfo.storeId) : null;
    } catch {
      return null;
    }
  }, []);

  const resetForm = useCallback(() => {
    form.resetFields();
    form.setFieldsValue({
      customerId: customer?.customerId,
      quoteDate: dayjs(),
      status: 'Accepted',
    });
    setPriceWithTaxDisplay('Choose vehicle and tax rate');
  }, [customer?.customerId, form]);

  const fetchOptions = useCallback(async () => {
    if (!storeId) {
      toast.error('Store information not found. Please log in again.');
      return;
    }

    setLoadingOptions(true);
    try {
      const [vehiclesByStore, dealersAll] = await Promise.all([
        ManageStorageService.getStorageVehiclesByStoreId(storeId),
        ManageDealerService.getAllDealers(),
      ]);

      const dealersByStore = dealersAll.filter((dealer) => Number(dealer.storeId) === storeId);

      const priceMap = {};
      vehiclesByStore.forEach((vehicle) => {
        priceMap[vehicle.vehicleId] = vehicle.price || 0;
      });
      setVehiclePriceMap(priceMap);

      setVehicles(
        vehiclesByStore.map((vehicle) => ({
          value: vehicle.vehicleId,
          label: vehicle.modelName,
        }))
      );

      setDealers(
        dealersByStore.map((dealer) => ({
          value: dealer.dealerId,
          label: dealer.fullName,
        }))
      );
    } catch (error) {
      console.error('Failed to load data for quotation:', error);
      toast.error('Cannot load quotation data');
    } finally {
      setLoadingOptions(false);
    }
  }, [storeId]);

  const updatePriceWithTax = useCallback(() => {
    const values = form.getFieldsValue();
    const { vehicleId, taxRate } = values;

    let display = 'Choose vehicle and tax rate';
    if (vehicleId && taxRate !== undefined) {
      const basePrice = vehiclePriceMap[vehicleId] || 0;
      const priceWithTax = Math.round(basePrice * (1 + taxRate / 100));
      form.setFieldsValue({ priceWithTax });
      display = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0,
      }).format(priceWithTax);
    } else {
      form.setFieldsValue({ priceWithTax: undefined });
    }

    setPriceWithTaxDisplay(display);
  }, [form, vehiclePriceMap]);

  useEffect(() => {
    if (open) {
      resetForm();
      fetchOptions();
    }
  }, [open, resetForm, fetchOptions]);

  const handleUpdateCustomerStatus = useCallback(async (customerId) => {
    try {
      const currentCustomer = await ManageCustomersService.GetCustomerById(customerId);
      if (!currentCustomer) return;

      if (currentCustomer.status === 'Pending') {
        const updatePayload = {
          ...currentCustomer,
          customerId,
          status: 'Accept',
          storeId: currentCustomer.storeId,
        };
        await ManageCustomersService.editCustomer(customerId, updatePayload);
      }
    } catch (error) {
      console.error('Failed to update customer status after quotation:', error);
      toast.warn('Quotation created but customer status was not updated.');
    }
  }, []);

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      const payload = {
        customerId: values.customerId,
        vehicleId: values.vehicleId,
        dealerId: values.dealerId,
        taxRate: values.taxRate,
        quoteDate: values.quoteDate.format('DD/MM/YYYY'),
        status: values.status || 'Draft',
      };

      await ManageQuoteService.AddQuotation(payload);
      await handleUpdateCustomerStatus(values.customerId);

      toast.success('Quotation added successfully!');
      setOpen(false);
      onSuccess?.();
    } catch (error) {
      console.error('Failed to add quotation:', error);
      toast.error('Failed to add quotation');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpen(true)}>
        Add Quotation
      </Button>
      <Modal
        open={open}
        title={`Add Quotation - ${customer?.fullName || ''}`}
        onCancel={() => setOpen(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="customerId"
            label="Customer"
            rules={[{ required: true }]}
          >
            <Select
              disabled
              options={
                customer
                  ? [{ value: customer.customerId, label: customer.fullName }]
                  : []
              }
            />
          </Form.Item>

          <Form.Item
            name="vehicleId"
            label="Vehicle Model"
            rules={[{ required: true }]}
          >
            <Select
              showSearch
              placeholder="Select vehicle model"
              options={vehicles}
              loading={loadingOptions}
              onChange={updatePriceWithTax}
              onClear={updatePriceWithTax}
              allowClear
            />
          </Form.Item>

          <Form.Item
            name="dealerId"
            label="Employee"
            rules={[{ required: true }]}
          >
            <Select
              showSearch
              placeholder="Select employee"
              options={dealers}
              loading={loadingOptions}
            />
          </Form.Item>

          <Form.Item
            name="taxRate"
            label="Tax Rate (%)"
            rules={[{ required: true, message: 'Please select tax rate!' }]}
          >
            <Select placeholder="Select tax rate" onChange={updatePriceWithTax}>
              {TAX_RATE_OPTIONS.map((rate) => (
                <Select.Option key={rate} value={rate}>
                  {rate}%
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Price with Tax (VND)">
            <Text strong style={{ fontSize: 16, color: '#6dd40d' }}>
              {priceWithTaxDisplay}
            </Text>
          </Form.Item>

          <Form.Item name="quoteDate" label="Quote Date" rules={[{ required: true }]}>
            <DatePicker
              format="DD/MM/YYYY"
              style={{ width: '100%' }}
              disabled
            />
          </Form.Item>

          <Form.Item name="status" label="Status" initialValue="Accepted">
            <Select>
              <Select.Option value="Draft">Draft</Select.Option>
              <Select.Option value="Sent">Sent</Select.Option>
              <Select.Option value="Accepted">Accepted</Select.Option>
              <Select.Option value="Rejected">Rejected</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={submitting} style={{ marginRight: 8 }}>
              Add
            </Button>
            <Button onClick={() => setOpen(false)} disabled={submitting}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AddQuotationButton;

