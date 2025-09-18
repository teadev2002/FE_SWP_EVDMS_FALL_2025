import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import ManageServiceVehicle from '../../../services/ManageServiceVehicle/ManageServiceVehicle'; // Adjust the import path based on your file structure

const ManageVehicle = () => {
  const [vehicles, setVehicles] = useState([]);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
  ];

  const fetchVehicles = async () => {
    try {
      const data = await ManageServiceVehicle.getAllVehicle();
      setVehicles(data);
    } catch (error) {
      console.error('Failed to fetch vehicles:', error);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  return (
    <div>
      <Table dataSource={vehicles} columns={columns} />
    </div>
  );
};

export default ManageVehicle;