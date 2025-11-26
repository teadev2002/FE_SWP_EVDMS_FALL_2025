import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Button,
  Modal,
  Form,
  Select,
  DatePicker,
  Typography,
  message,
  InputNumber,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';

import ManageQuoteService from '../../../services/ManageQuotes/ManageQuoteService';
import ManageDealerService from '../../../services/ManageDealer/ManageDealerService';
import ManageCustomersService from '../../../services/ManageCustomers/ManageCustomersService';
import ManageStorageService from '../../../services/ManageStorage/ManageStorageService';
import ManageServicePromotions from '../../../services/ManagePromotions/ManageServicePromotions';
import ManageVehicleService from '../../../services/ManageVehicleService/ManageVehicleService';

const { Text } = Typography;
 
const TAX_RATE_OPTIONS_ANTD = Array.from({ length: 91 }, (_, i) => ({
  value: i + 10,
  label: `${i + 10}%`,
}));
const INITIAL_PRICE_DISPLAY = 'Choose vehicle and tax rate';
 
const calculatePriceWithTax = (
  vehicleId,
  taxRate,
  promotionId,
  quantity,
  vehiclePriceMap,
  promotions
) => {
   
  if (!vehicleId || taxRate === undefined || taxRate === null) {
    return INITIAL_PRICE_DISPLAY;
  }

  const basePrice = vehiclePriceMap[vehicleId] || 0;
  if (basePrice === 0) return INITIAL_PRICE_DISPLAY;

  const qty = quantity || 1;
  
  // Tính tổng giá theo số lượng
  let totalPriceBeforeDiscount = basePrice * qty;
  let discountAmount = 0;

  // Áp dụng promotion discount nếu có
  if (promotionId) {
    const promo = promotions.find(p => p.value === promotionId);
    if (promo) {
      const match = promo.label?.match(/\((\d+)%/);
      if (match) {
        const discount = parseInt(match[1], 10);
        discountAmount = totalPriceBeforeDiscount * (discount / 100);
      }
    }
  }

  // Giá sau khi giảm giá
  const priceAfterDiscount = totalPriceBeforeDiscount - discountAmount;
  
  // Cộng thuế vào giá sau giảm
  const priceWithTax = Math.round(priceAfterDiscount * (1 + taxRate / 100));
  
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
  }).format(priceWithTax);
};

 
const findBestMatchingVehicle = async (description, allVehicles) => {
  if (!description || !description.toLowerCase().includes('get quote')) return null;

  try {
    let text = description.replace(/^get quote\s*-?\s*/i, '').trim();
    const yearMatch = text.match(/\((\d{4})\)$/);
    const year = yearMatch ? parseInt(yearMatch[1], 10) : null;
    if (year) text = text.replace(/\s*\(\d{4}\)$/, '').trim();

    let bestId = null;
    let bestScore = 0;
    const lowerText = text.toLowerCase();

    allVehicles.forEach(v => {
      let score = 0;
      const model = (v.modelName || '').toLowerCase();
      const version = (v.version || '').toLowerCase();

      if (lowerText.includes(model)) score += 25;
      if (version && lowerText.includes(version)) score += 15;
      if (year && v.year === year) score += 20;

      if (score > bestScore) {
        bestScore = score;
        bestId = v.vehicleId;
      }
    });

    return bestId;
  } catch (err) {
    console.error('Auto-match vehicle error:', err);
    return null;
  }
};

 
const getStoreId = () => {
  try {
    const info = JSON.parse(localStorage.getItem('dealerInfo') || '{}');
    return info.storeId ? Number(info.storeId) : null;
  } catch {
    return null;
  }
};

const AddQuotationButton = ({ customer, onSuccess }) => {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loadingOptions, setLoadingOptions] = useState(false);

  const [vehicles, setVehicles] = useState([]);
  const [dealers, setDealers] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [vehiclePriceMap, setVehiclePriceMap] = useState({});

  const [form] = Form.useForm();
  const hasAutoFilledVehicle = useRef(false);

  const storeId = useMemo(getStoreId, []);

  // Watch form fields để tự động tính giá
  const vehicleId = Form.useWatch('vehicleId', form);
  const taxRate = Form.useWatch('taxRate', form);
  const promotionId = Form.useWatch('promotionId', form);
  const quantity = Form.useWatch('quantity', form);
 
  const priceWithTaxDisplay = useMemo(() => {
    return calculatePriceWithTax(
      vehicleId,
      taxRate,
      promotionId,
      quantity,
      vehiclePriceMap,
      promotions
    );
  }, [vehicleId, taxRate, promotionId, quantity, vehiclePriceMap, promotions]);
  

  const resetForm = useCallback(() => {
    hasAutoFilledVehicle.current = false;
    form.resetFields();
    form.setFieldsValue({
      customerId: customer?.customerId,
      quoteDate: dayjs(),
      status: 'Accepted',
      quantity: 1,
    });
  }, [customer?.customerId, form]);

  const loadOptionsAndAutoSelect = useCallback(async () => {
    if (!storeId) {
      toast.error('Store information not found');
      return;
    }

    setLoadingOptions(true);
    try {
      const [stockVehicles, allDealers, allPromotions, allVehicleModels] = await Promise.all([
        ManageStorageService.getStorageVehiclesByStoreId(storeId),
        ManageDealerService.getAllDealers(),
        ManageServicePromotions.getAllPromotions(),
        ManageVehicleService.getAllVehicle(),
      ]);

      
      const priceMap = {};
      stockVehicles.forEach(v => {
        priceMap[v.vehicleId] = v.price || 0;
      });
      setVehiclePriceMap(priceMap);
 
      setVehicles(stockVehicles.map(v => ({
        value: v.vehicleId,
        label: `${v.modelName} ${v.version || ''} (${v.year})`.trim(),
      })));

      const storeDealers = allDealers.filter(d => Number(d.storeId) === storeId);
      const storePromotions = allPromotions.filter(p => Number(p.storeId) === storeId);

      setDealers(storeDealers.map(d => ({ value: d.dealerId, label: d.fullName })));
      setPromotions(storePromotions.map(p => ({
        value: p.promotionId,
        label: `${p.title} (${p.discountPercent}% off)`,
      })));
 
      if (customer?.description && !hasAutoFilledVehicle.current) {
        const matchedId = await findBestMatchingVehicle(customer.description, allVehicleModels);
        
        if (matchedId && stockVehicles.some(v => v.vehicleId === matchedId)) {
          hasAutoFilledVehicle.current = true;
      
          requestAnimationFrame(() => {
            form.setFieldsValue({ vehicleId: matchedId });
            message.success('Vehicle auto-selected based on customer request');
          });
        }
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load quotation data');
    } finally {
      setLoadingOptions(false);
    }
  }, [storeId, customer?.description, form]);

  useEffect(() => {
    if (open) {
      resetForm();
      loadOptionsAndAutoSelect();
    }
  }, [open, resetForm, loadOptionsAndAutoSelect]);

  const updateCustomerStatus = useCallback(async (customerId) => {
    try {
      const cust = await ManageCustomersService.GetCustomerById(customerId);
      if (cust?.status === 'Pending') {
        await ManageCustomersService.editCustomer(customerId, {
          status: 'Accept',
        });
      }
    } catch (err) {
    
      console.warn('Update status failed', err);
    }
  }, []);
 
  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
       
      if (!values.vehicleId || values.taxRate === undefined) {
          toast.error('Please select vehicle and tax rate');
          setSubmitting(false); 
          return;
      }

   
      const payload = {
        customerId: values.customerId,  
        vehicleId: values.vehicleId,
        dealerId: values.dealerId,
        taxRate: values.taxRate,
        promotionId: values.promotionId || null,
        quantity: values.quantity,
        quoteDate: values.quoteDate.format('DD/MM/YYYY'),
        status: values.status || 'Accepted',
      };

   

      console.log('Payload sending:', payload);  

      await ManageQuoteService.AddQuotation(payload);
     
      await updateCustomerStatus(values.customerId);

      toast.success('Quotation created successfully');
      setTimeout(() => {
      window.location.reload();
      }, 300);
    
      setOpen(false);
      onSuccess?.(values.customerId);
    } catch (err) {
      console.error(err);
    
      const serverMessage = err.response?.data?.Detailed || err.response?.data?.Message || 'Failed to create quotation';
      toast.error(serverMessage);
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
        title={`Add Quotation - ${customer?.fullName || ''}`}
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        width={620}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="customerId" label="Customer" rules={[{ required: true }]}>
            <Select
              disabled
              options={customer ? [{ value: customer.customerId, label: customer.fullName }] : []}
            />
          </Form.Item>

          <Form.Item name="vehicleId" label="Vehicle Model" rules={[{ required: true, message: 'Please select a vehicle' }]}>
            <Select
              showSearch
              optionFilterProp="label"
              placeholder="Search or select vehicle"
              loading={loadingOptions}
              options={vehicles}
              allowClear
            />
          </Form.Item>

          <Form.Item name="dealerId" label="Employee" rules={[{ required: true, message: 'Please select an employee' }]}>
            <Select showSearch placeholder="Select employee" options={dealers} loading={loadingOptions} />
          </Form.Item>

          <Form.Item name="taxRate" label="Tax Rate (%)" rules={[{ required: true, message: 'Please select tax rate' }]}>
            <Select placeholder="Select tax rate" options={TAX_RATE_OPTIONS_ANTD} />
          </Form.Item>

          <Form.Item name="promotionId" label="Promotion (Optional)">
            <Select
              allowClear
              placeholder="Select promotion"
              options={promotions}
            />
          </Form.Item>

          <Form.Item
            name="quantity"
            label="Quantity"
            rules={[
              { required: true, message: 'Please enter quantity!' },
              { type: 'number', min: 1, message: 'Quantity must be at least 1!' }
            ]}
            initialValue={1}
          >
            <InputNumber
              placeholder="Enter quantity"
              style={{ width: '100%' }}
              min={1}
            />
          </Form.Item>

          <Form.Item label="Price with Tax (VND)">
            <Text strong style={{ fontSize: 18, color: '#52c41a' }}>
              {priceWithTaxDisplay}
            </Text>
          </Form.Item>

          <Form.Item name="quoteDate" label="Quote Date" rules={[{ required: true }]}>
            <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} disabled />
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
              Create
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