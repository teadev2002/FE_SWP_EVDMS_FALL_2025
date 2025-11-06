import React from 'react';
import { Tabs, Typography } from 'antd';
import SalesByRegion from './SalesByRegion/SalesByRegion';
import SalesByDealer from './SalesByDealer/SalesByDealer';

const { Title } = Typography;
const { TabPane } = Tabs;

const SalesOverview = () => {
  return (
    <div>
      <Title level={2}>Sales Overview</Title>

      <Tabs defaultActiveKey="1" type="card">
        <TabPane tab="Sales by Region" key="1">
          <SalesByRegion />
        </TabPane>
        <TabPane tab="Sales by Dealer" key="2">
          <SalesByDealer />
        </TabPane>
      </Tabs>

    </div>
  );
};

export default SalesOverview;