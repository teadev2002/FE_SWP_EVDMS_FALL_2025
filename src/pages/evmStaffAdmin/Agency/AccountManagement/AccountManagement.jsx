import React from 'react';
import { Card, Tabs, Typography } from 'antd';
import StaffManagement from './StaffManagement';
 import DealerManage from '../../../dealerStaffManager/DealerManagement/DealerManage';
 const { Title } = Typography;
const { TabPane } = Tabs;

const AccountManagement = () => {
  return (
    <div>
       <Title level={2}>Account Management</Title>
      <Tabs defaultActiveKey="1" type="card" >
        <TabPane tab="Staff Management" key="1">
          <StaffManagement />
        </TabPane>
        <TabPane tab="Dealer Management" key="2">
          <DealerManage />
        </TabPane>
      </Tabs>
      
    </div>
  );
};

export default AccountManagement;