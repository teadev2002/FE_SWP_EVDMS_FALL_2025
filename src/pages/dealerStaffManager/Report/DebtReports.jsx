import React, { useState } from 'react';
import { Tabs } from 'antd';
 
 
import CustomerDebtReport from './customerDebtReport';
import FactoryDebtReport from './FactoryDebtReport';

const { TabPane } = Tabs;

const DebtReports = () => {
  const [activeTab, setActiveTab] = useState('customer');

  return (
    <div className="debt-reports-container">
      <h2>Debt Reports</h2>
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="Customer Debt Report" key="customer">
          <CustomerDebtReport />
        </TabPane>
        <TabPane tab="Factory Debt Report" key="factory">
          <FactoryDebtReport />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default DebtReports;