import React, { useState, useEffect } from 'react';
import { Table } from 'antd';
import ManageServiceAgreements from '../../../services/ManageAgreements/ManageServiceSaleAgreements';

const Quotation = () => {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchQuotations = async () => {
      setLoading(true);
      try {
        const data = await ManageServiceAgreements.getAllQuotations(); // Assuming this service method exists
        const formattedData = data.map(item => ({
          key: item.quotationId,
          customerName: item.customerName,
          quotationDate: item.quotationDate,
          totalAmount: item.totalAmount || 'N/A',
          status: item.status || 'N/A',
        }));
        setQuotations(formattedData);
      } catch (error) {
        console.error('Failed to fetch quotations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuotations();
  }, []);

  const columns = [
    {
      title: 'Customer Name',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: 'Quotation Date',
      dataIndex: 'quotationDate',
      key: 'quotationDate',
    },
    {
      title: 'Total Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
  ];

  return (
    <div>
      <h3>Quotations</h3>
      <Table
        columns={columns}
        dataSource={quotations}
        loading={loading}
        rowKey="key"
      />
    </div>
  );
};

export default Quotation;