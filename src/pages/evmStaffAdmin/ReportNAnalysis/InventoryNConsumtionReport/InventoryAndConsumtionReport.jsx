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

      <Tabs defaultActiveKey="1" type="card">
        <TabPane tab="Inventory Report" key="1">
          <InventoryReport />
        </TabPane>
        <TabPane tab="Consumption Speed Report" key="2">
          <ConsumptionSpeedReport />
        </TabPane>
      </Tabs>

    </div>
  );
};

export default InventoryAndConsumtionReport;