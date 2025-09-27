import React from 'react';
import { Tabs, Card, Typography } from 'antd';
import InventoryReport from './InventoryReport/InventoryReport';
import ConsumptionSpeedReport from './ConsumptionSpeedReport/ConsumptionSpeedReport';

const { Title } = Typography;
const { TabPane } = Tabs;

const InventoryAndConsumtionReport = () => {
  return (
    <div>
      <Title level={2}>Inventory And Consumtion Speed Report</Title>
      <Card
       variant='borderless'
        style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}
      >
        <Tabs defaultActiveKey="1" type="card">
          <TabPane tab="Inventory Report" key="1">
            <InventoryReport />
          </TabPane>
          <TabPane tab="Consumption Speed Report" key="2">
            <ConsumptionSpeedReport />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default InventoryAndConsumtionReport;