// import React, { useCallback, useEffect, useMemo, useState } from 'react';
// import { Button, Modal, Form, Select, DatePicker, Typography } from 'antd';
// import { PlusOutlined } from '@ant-design/icons';
// import dayjs from 'dayjs';
// import { toast } from 'react-toastify';
// import ManageQuoteService from '../../../services/ManageQuotes/ManageQuoteService';
// import ManageDealerService from '../../../services/ManageDealer/ManageDealerService';
// import ManageCustomersService from '../../../services/ManageCustomers/ManageCustomersService';
// import ManageStorageService from '../../../services/ManageStorage/ManageStorageService';
// import ManageServicePromotions from '../../../services/ManagePromotions/ManageServicePromotions';

// const { Text } = Typography;

// const TAX_RATE_OPTIONS = Array.from({ length: 91 }, (_, i) => i + 10);

// const AddQuotationButton = ({ customer, onSuccess }) => {
//   const [open, setOpen] = useState(false);
//   const [submitting, setSubmitting] = useState(false);
//   const [loadingOptions, setLoadingOptions] = useState(false);
//   const [vehicles, setVehicles] = useState([]);
//   const [dealers, setDealers] = useState([]);
//   const [promotions, setPromotions] = useState([]);
//   const [vehiclePriceMap, setVehiclePriceMap] = useState({});
//   const [priceWithTaxDisplay, setPriceWithTaxDisplay] = useState('Choose vehicle and tax rate');
//   const [form] = Form.useForm();

//   const storeId = useMemo(() => {
//     try {
//       const dealerInfo = JSON.parse(localStorage.getItem('dealerInfo') || '{}');
//       return dealerInfo.storeId ? Number(dealerInfo.storeId) : null;
//     } catch {
//       return null;
//     }
//   }, []);

//   const resetForm = useCallback(() => {
//     form.resetFields();
//     form.setFieldsValue({
//       customerId: customer?.customerId,
//       quoteDate: dayjs(),
//       status: 'Accepted',
//     });
//     setPriceWithTaxDisplay('Choose vehicle and tax rate');
//   }, [customer?.customerId, form]);

//   const fetchOptions = useCallback(async () => {
//     if (!storeId) {
//       toast.error('Store information not found. Please log in again.');
//       return;
//     }

//     setLoadingOptions(true);
//     try {
//       const [vehiclesByStore, dealersAll, allPromotions] = await Promise.all([
//         ManageStorageService.getStorageVehiclesByStoreId(storeId),
//         ManageDealerService.getAllDealers(),
//         ManageServicePromotions.getAllPromotions(),
//       ]);

//       const dealersByStore = dealersAll.filter((dealer) => Number(dealer.storeId) === storeId);
//       const storePromotions = allPromotions.filter((p) => Number(p.storeId) === storeId);

//       const priceMap = {};
//       vehiclesByStore.forEach((vehicle) => {
//         priceMap[vehicle.vehicleId] = vehicle.price || 0;
//       });
//       setVehiclePriceMap(priceMap);

//       setVehicles(
//         vehiclesByStore.map((vehicle) => ({
//           value: vehicle.vehicleId,
//           label: vehicle.modelName,
//         }))
//       );

//       setDealers(
//         dealersByStore.map((dealer) => ({
//           value: dealer.dealerId,
//           label: dealer.fullName,
//         }))
//       );

//       setPromotions(
//         storePromotions.map((p) => ({
//           value: p.promotionId,
//           label: `${p.title} (${p.discountPercent}% off)`,
//         }))
//       );
//     } catch (error) {
//       console.error('Failed to load data for quotation:', error);
//       toast.error('Cannot load quotation data');
//     } finally {
//       setLoadingOptions(false);
//     }
//   }, [storeId]);

//   const updatePriceWithTax = useCallback(() => {
//     const values = form.getFieldsValue();
//     const { vehicleId, taxRate, promotionId } = values;

//     let display = 'Choose vehicle and tax rate';
//     if (vehicleId && taxRate !== undefined) {
//       const basePrice = vehiclePriceMap[vehicleId] || 0;
//       let finalPrice = basePrice;

//       // Áp dụng promotion discount nếu có
//       if (promotionId) {
//         const promo = promotions.find((p) => p.value === promotionId);
//         if (promo) {
//           const match = promo.label.match(/\((\d+)%/);
//           if (match && match[1]) {
//             const discount = parseInt(match[1], 10);
//             if (!isNaN(discount)) {
//               finalPrice = basePrice * (1 - discount / 100);
//             }
//           }
//         }
//       }

//       const priceWithTax = Math.round(finalPrice * (1 + taxRate / 100));
//       form.setFieldsValue({ priceWithTax });
//       display = new Intl.NumberFormat('vi-VN', {
//         style: 'currency',
//         currency: 'VND',
//         minimumFractionDigits: 0,
//       }).format(priceWithTax);
//     } else {
//       form.setFieldsValue({ priceWithTax: undefined });
//     }

//     setPriceWithTaxDisplay(display);
//   }, [form, vehiclePriceMap, promotions]);

//   useEffect(() => {
//     if (open) {
//       resetForm();
//       fetchOptions();
//     }
//   }, [open, resetForm, fetchOptions]);

//   const handleUpdateCustomerStatus = useCallback(async (customerId) => {
//     try {
//       const currentCustomer = await ManageCustomersService.GetCustomerById(customerId);
//       if (!currentCustomer) return;

//       if (currentCustomer.status === 'Pending') {
//         const updatePayload = {
//           ...currentCustomer,
//           customerId,
//           status: 'Accept',
//           storeId: currentCustomer.storeId,
//         };
//         await ManageCustomersService.editCustomer(customerId, updatePayload);
//       }
//     } catch (error) {
//       console.error('Failed to update customer status after quotation:', error);
//       toast.warn('Quotation created but customer status was not updated.');
//     }
//   }, []);

//   const handleSubmit = async (values) => {
//     setSubmitting(true);
//     try {
//       const payload = {
//         customerId: values.customerId,
//         vehicleId: values.vehicleId,
//         dealerId: values.dealerId,
//         promotionId: values.promotionId || null,
//         taxRate: values.taxRate,
//         quoteDate: values.quoteDate.format('DD/MM/YYYY'),
//         status: values.status || 'Draft',
//       };

//       await ManageQuoteService.AddQuotation(payload);
//       await handleUpdateCustomerStatus(values.customerId);

//       toast.success('Quotation added successfully!');
//       setOpen(false);
//       onSuccess?.(values.customerId);
//     } catch (error) {
//       console.error('Failed to add quotation:', error);
//       toast.error('Failed to add quotation');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <>
//       <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpen(true)}>
//         Add Quotation
//       </Button>
//       <Modal
//         open={open}
//         title={`Add Quotation - ${customer?.fullName || ''}`}
//         onCancel={() => setOpen(false)}
//         footer={null}
//         destroyOnClose
//       >
//         <Form form={form} layout="vertical" onFinish={handleSubmit}>
//           <Form.Item
//             name="customerId"
//             label="Customer"
//             rules={[{ required: true }]}
//           >
//             <Select
//               disabled
//               options={
//                 customer
//                   ? [{ value: customer.customerId, label: customer.fullName }]
//                   : []
//               }
//             />
//           </Form.Item>

//           <Form.Item
//             name="vehicleId"
//             label="Vehicle Model"
//             rules={[{ required: true }]}
//           >
//             <Select
//               showSearch
//               placeholder="Select vehicle model"
//               options={vehicles}
//               loading={loadingOptions}
//               onChange={updatePriceWithTax}
//               onClear={updatePriceWithTax}
//               allowClear
//             />
//           </Form.Item>

//           <Form.Item
//             name="dealerId"
//             label="Employee"
//             rules={[{ required: true }]}
//           >
//             <Select
//               showSearch
//               placeholder="Select employee"
//               options={dealers}
//               loading={loadingOptions}
//             />
//           </Form.Item>

//           <Form.Item
//             name="taxRate"
//             label="Tax Rate (%)"
//             rules={[{ required: true, message: 'Please select tax rate!' }]}
//           >
//             <Select placeholder="Select tax rate" onChange={updatePriceWithTax}>
//               {TAX_RATE_OPTIONS.map((rate) => (
//                 <Select.Option key={rate} value={rate}>
//                   {rate}%
//                 </Select.Option>
//               ))}
//             </Select>
//           </Form.Item>

//           <Form.Item name="promotionId" label="Promotion (Optional)">
//             <Select
//               allowClear
//               placeholder="Select promotion"
//               options={promotions}
//               loading={loadingOptions}
//               onChange={updatePriceWithTax}
//             />
//           </Form.Item>

//           <Form.Item label="Price with Tax (VND)">
//             <Text strong style={{ fontSize: 16, color: '#6dd40d' }}>
//               {priceWithTaxDisplay}
//             </Text>
//           </Form.Item>

//           <Form.Item name="quoteDate" label="Quote Date" rules={[{ required: true }]}>
//             <DatePicker
//               format="DD/MM/YYYY"
//               style={{ width: '100%' }}
//               disabled
//             />
//           </Form.Item>

//           <Form.Item name="status" label="Status" initialValue="Accepted">
//             <Select>
//               <Select.Option value="Draft">Draft</Select.Option>
//               <Select.Option value="Sent">Sent</Select.Option>
//               <Select.Option value="Accepted">Accepted</Select.Option>
//               <Select.Option value="Rejected">Rejected</Select.Option>
//             </Select>
//           </Form.Item>

//           <Form.Item>
//             <Button type="primary" htmlType="submit" loading={submitting} style={{ marginRight: 8 }}>
//               Add
//             </Button>
//             <Button onClick={() => setOpen(false)} disabled={submitting}>
//               Cancel
//             </Button>
//           </Form.Item>
//         </Form>
//       </Modal>
//     </>
//   );
// };

// export default AddQuotationButton;

// fix
 
 
// Import Services
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
  vehiclePriceMap,
  promotions
) => {
   
  if (!vehicleId || taxRate === undefined || taxRate === null) {
    return INITIAL_PRICE_DISPLAY;
  }

 
  const basePrice = vehiclePriceMap[vehicleId] || 0;
  
   
  if (basePrice === 0) return INITIAL_PRICE_DISPLAY;

  let finalPrice = basePrice;

  
  if (promotionId) {
    const promo = promotions.find(p => p.value === promotionId);
    if (promo) {
       
      const match = promo.label?.match(/\((\d+)%/);
      if (match) {
        const discount = parseInt(match[1], 10);
        finalPrice = basePrice * (1 - discount / 100);
      }
    }
  }
 
  const priceWithTax = Math.round(finalPrice * (1 + taxRate / 100));
  
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

   
  const vehicleId = Form.useWatch('vehicleId', form);
  const taxRate = Form.useWatch('taxRate', form);
  const promotionId = Form.useWatch('promotionId', form);
 
  const priceWithTaxDisplay = useMemo(() => {
    return calculatePriceWithTax(
      vehicleId,
      taxRate,
      promotionId,
      vehiclePriceMap,
      promotions
    );
  }, [vehicleId, taxRate, promotionId, vehiclePriceMap, promotions]);
  

  const resetForm = useCallback(() => {
    hasAutoFilledVehicle.current = false;
    form.resetFields();
    form.setFieldsValue({
      customerId: customer?.customerId,
      quoteDate: dayjs(),
      status: 'Accepted',
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