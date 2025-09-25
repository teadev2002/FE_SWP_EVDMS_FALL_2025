import React from 'react';
import { Row, Col, Card, Statistic, Calendar, List, Button, Typography } from 'antd';
import { ClockCircleOutlined, NotificationOutlined } from '@ant-design/icons';
import CarStatistics from './CarStatistics';
import UpcomingEventsCalendar from './UpcomingEventsCalendar';
import '../../../styles/dealerStaffManager/CustomerOverview.scss';

const { Title } = Typography;

// Fake demo data
const summaryData = [
  { title: 'Monthly Sales', value: 150000, prefix: '$' },
  { title: 'Quarterly Sales', value: 450000, prefix: '$' },
  { title: 'Yearly Sales', value: 1800000, prefix: '$' },
];

const appointmentsData = [
  { title: 'John Doe - Test Drive for Tesla Model 3', description: '10:00 AM - Today', avatar: 'JD' },
  { title: 'Jane Smith - Test Drive for Nissan Leaf', description: '2:30 PM - Tomorrow', avatar: 'JS' },
  { title: 'Mike Johnson - Test Drive for Chevrolet Bolt', description: '11:00 AM - Friday', avatar: 'MJ' },
];

const notificationsData = [
  { content: 'New inventory arrived: 5 units of Tesla Model Y', datetime: '2 hours ago' },
  { content: 'Customer inquiry for Rivian R1T - follow up required', datetime: '1 day ago' },
  { content: 'Promotion ends soon for Volkswagen ID.4', datetime: '3 days ago' },
  { content: 'Service reminder: Check battery stock levels', datetime: '1 week ago' },
];

const CustomerOverview = () => {
  return (
    <div className="dashboard">
      <Title level={2} className="dashboard-title">EV Dealer Dashboard</Title>
      
      {/* Top Area: Summary Cards */}
      <Row gutter={[16, 16]} className="dashboard-summary-row">
        {summaryData.map((item, index) => (
          <Col xs={24} sm={12} md={8} key={index}>
            <Card className="dashboard-summary-card">
              <Statistic
                title={item.title}
                value={item.value}
                prefix={item.prefix}
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
        ))}
      </Row>
      <Row  style={{ marginBottom: 20 }}>
        <Col span={24}>
          <Card
            title={
              <span>
                <NotificationOutlined /> Notifications & Reminders
              </span>
            }
            className="dashboard-notifications-card"
          >
            <List
              size="small"
              bordered={false}
              dataSource={notificationsData}
              renderItem={(item) => (
                <List.Item className="dashboard-notification-item">
                  <div>{item.content}</div>
                  <div className="dashboard-notification-time">{item.datetime}</div>
                </List.Item>
              )}
            />
            <Button type="link" className="dashboard-clear-btn">
              Clear All
            </Button>
          </Card>
        </Col>
      </Row>

      {/* Middle Area: Side by Side Sections */}
      <Row gutter={16} className="dashboard-middle-row">
        

        {/* Right: Calendar + Appointments List */}
        <Col xs={24} lg={12}>
          <Row gutter={[0, 16]}>
            <Col span={24}>
              <UpcomingEventsCalendar />
            </Col>
          </Row>
        </Col>
        {/* Left: Appointments List */}
       
        <Col xs={24} lg={12}>
         <Card
          title={
                  <span>
                    <ClockCircleOutlined /> Upcoming Test Drive Appointments
                  </span>
                }
                className="dashboard-appointments-card"
              >
                <List
                  size="small"
                  bordered={false}
                  dataSource={appointmentsData}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={<div className="dashboard-avatar">{item.avatar}</div>}
                        title={item.title}
                        description={item.description}
                      />
                    </List.Item>
                  )}
                />
                <Button type="link" className="dashboard-view-all-btn">
                  View All Appointments
                </Button>
              </Card>
        </Col>
      </Row>

      {/* Bottom Area: Notifications List */}
      
    </div>
  );
};

export default CustomerOverview;