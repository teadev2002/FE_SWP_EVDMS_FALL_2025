import React from 'react';
import { Tabs, Card, Typography } from 'antd';
import WholesalePrice from './WholesalePrice';
import Discount from './Discount';
import Promotion from './Promotion';

const { Title } = Typography;
const { TabPane } = Tabs;

const PricePromotionManage = () => {
  return (
    <div>
      <Title level={2}>Price & Promotion Management</Title>
      <Card
        variant="borderless"
        style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}
      >
        <Tabs defaultActiveKey="1" type="card">
          <TabPane tab="Wholesale Price" key="1">
            <WholesalePrice />
          </TabPane>
          <TabPane tab="Discount" key="2">
            <Discount />
          </TabPane>
          <TabPane tab="Promotion" key="3">
            <Promotion />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default PricePromotionManage;