// // Dashboard.jsx
// import React from 'react';
// import { Row, Col, Card, Statistic, Table, Calendar, List, Button, Typography } from 'antd';
// import { ClockCircleOutlined, NotificationOutlined } from '@ant-design/icons';
// import styles from '../../../styles/DashboardOverview.scss';

// const { Title } = Typography;

// // Fake demo data
// const summaryData = [
//   { title: 'Monthly Sales', value: 150000, prefix: '$' },
//   { title: 'Quarterly Sales', value: 450000, prefix: '$' },
//   { title: 'Yearly Sales', value: 1800000, prefix: '$' },
// ];

// const carStatsData = [
//   { key: 1, carModel: 'Tesla Model 3', status: 'Sold' },
//   { key: 2, carModel: 'Nissan Leaf', status: 'Pending Delivery' },
//   { key: 3, carModel: 'Chevrolet Bolt', status: 'Promotion' },
//   { key: 4, carModel: 'Ford Mustang Mach-E', status: 'Sold' },
//   { key: 5, carModel: 'Rivian R1T', status: 'Pending Delivery' },
//   { key: 6, carModel: 'Volkswagen ID.4', status: 'Promotion' },
// ];

//  const columns = [
//   {
//     title: 'Car Model',
//     dataIndex: 'carModel',
//     key: 'carModel',
//   },
//   {
//     title: 'Status',
//     dataIndex: 'status',
//     key: 'status',
//     render: (status) => (
//       <span className={`${styles['dashboard-status']} ${styles[`dashboard-status-${status.toLowerCase().replace(' ', '-')}`]}`}>
//         {status}
//       </span>
//     ),
//   },
// ];

// const appointmentsData = [
//   { title: 'John Doe - Test Drive for Tesla Model 3', description: '10:00 AM - Today', avatar: 'JD' },
//   { title: 'Jane Smith - Test Drive for Nissan Leaf', description: '2:30 PM - Tomorrow', avatar: 'JS' },
//   { title: 'Mike Johnson - Test Drive for Chevrolet Bolt', description: '11:00 AM - Friday', avatar: 'MJ' },
// ];

// const notificationsData = [
//   { content: 'New inventory arrived: 5 units of Tesla Model Y', datetime: '2 hours ago' },
//   { content: 'Customer inquiry for Rivian R1T - follow up required', datetime: '1 day ago' },
//   { content: 'Promotion ends soon for Volkswagen ID.4', datetime: '3 days ago' },
//   { content: 'Service reminder: Check battery stock levels', datetime: '1 week ago' },
// ];

// const DashboardOverview = () => {
//   const getListData = (value) => {
//     let listData;
//     switch (value.date()) {
//       case 8:
//         listData = [{ type: 'test-drive', content: 'Test drive appointment' }];
//         break;
//       case 10:
//         listData = [{ type: 'delivery', content: 'Pending delivery scheduled' }];
//         break;
//       default:
//     }
//     return listData || [];
//   };

//   const dateCellRender = (value) => {
//     const listData = getListData(value);
//     return (
//       <ul className={styles['dashboard-calendar-events']}>
//         {listData.map((item) => (
//           <li key={item.content}><ClockCircleOutlined /> {item.content}</li>
//         ))}
//       </ul>
//     );
//   };

//   const monthCellRender = (value) => {
//     const num = getMonthData(value.year(), value.month());
//     if (num > 0) {
//       return <div className={styles['dashboard-calendar-month-note']}>{num}</div>;
//     }
//   };

//   const getMonthData = (year, month) => {
//     if (year === 2023 && month === 9) {
//       return 150;
//     }
//     return 0;
//   };

//   return (
//     <div className={styles.dashboard}>
//       <Title level={2} className={styles['dashboard-title']}>EV Dealer Dashboard</Title>

//       {/* Top Area: Summary Cards */}
//       <Row gutter={[16, 16]} className={styles['dashboard-summary-row']}>
//         {summaryData.map((item, index) => (
//           <Col xs={24} sm={12} md={8} key={index}>
//             <Card className={styles['dashboard-summary-card']}>
//               <Statistic
//                 title={item.title}
//                 value={item.value}
//                 prefix={item.prefix}
//                 valueStyle={{ color: '#3f8600' }}
//               />
//             </Card>
//           </Col>
//         ))}
//       </Row>

//       {/* Middle Area: Side by Side Sections */}
//       <Row gutter={16} className={styles['dashboard-middle-row']}>
//         {/* Left: Car Statistics Table */}
//         <Col xs={24} lg={12}>
//           <Card title="Car Statistics" className={styles['dashboard-table-card']}>
//             <Table
//               columns={columns}
//               dataSource={carStatsData}
//               pagination={false}
//               size="middle"
//               className={styles['dashboard-table']}
//             />
//             <Button type="primary" className={styles['dashboard-view-more-btn']}>
//               View More Details
//             </Button>
//           </Card>
//         </Col>

//         {/* Right: Calendar + Appointments List */}
//         <Col xs={24} lg={12}>
//           <Row gutter={[0, 16]}>
//             <Col span={24}>
//               <Card title="Upcoming Events Calendar" className={styles['dashboard-calendar-card']}>
//                 <Calendar
//                   dateCellRender={dateCellRender}
//                   monthCellRender={monthCellRender}
//                   className={styles['dashboard-calendar']}
//                 />
//               </Card>
//             </Col>
//             <Col span={24}>
//               <Card
//                 title={
//                   <span>
//                     <ClockCircleOutlined /> Upcoming Test Drive Appointments
//                   </span>
//                 }
//                 className={styles['dashboard-appointments-card']}
//               >
//                 <List
//                   size="small"
//                   bordered={false}
//                   dataSource={appointmentsData}
//                   renderItem={(item) => (
//                     <List.Item>
//                       <List.Item.Meta
//                         avatar={<div className={styles['dashboard-avatar']}>{item.avatar}</div>}
//                         title={item.title}
//                         description={item.description}
//                       />
//                     </List.Item>
//                   )}
//                 />
//                 <Button type="link" className={styles['dashboard-view-all-btn']}>
//                   View All Appointments
//                 </Button>
//               </Card>
//             </Col>
//           </Row>
//         </Col>
//       </Row>

//       {/* Bottom Area: Notifications List */}
//       <Row>
//         <Col span={24}>
//           <Card
//             title={
//               <span>
//                 <NotificationOutlined /> Notifications & Reminders
//               </span>
//             }
//             className={styles['dashboard-notifications-card']}
//           >
//             <List
//               size="small"
//               bordered={false}
//               dataSource={notificationsData}
//               renderItem={(item) => (
//                 <List.Item className={styles['dashboard-notification-item']}>
//                   <div>{item.content}</div>
//                   <div className={styles['dashboard-notification-time']}>{item.datetime}</div>
//                 </List.Item>
//               )}
//             />
//             <Button type="link" className={styles['dashboard-clear-btn']}>
//               Clear All
//             </Button>
//           </Card>
//         </Col>
//       </Row>
//     </div>
//   );
// };

// export default DashboardOverview

import React from 'react';
import { Row, Col, Card, Statistic, Table, Calendar, List, Button, Typography } from 'antd';
import { ClockCircleOutlined, NotificationOutlined } from '@ant-design/icons';
import '../../../styles/DashboardOverview.scss'; // Updated import to side-effect import

const { Title } = Typography;

// Fake demo data
const summaryData = [
  { title: 'Monthly Sales', value: 150000, prefix: '$' },
  { title: 'Quarterly Sales', value: 450000, prefix: '$' },
  { title: 'Yearly Sales', value: 1800000, prefix: '$' },
];

const carStatsData = [
  { key: 1, carModel: 'Tesla Model 3', status: 'Sold' },
  { key: 2, carModel: 'Nissan Leaf', status: 'Pending Delivery' },
  { key: 3, carModel: 'Chevrolet Bolt', status: 'Promotion' },
  { key: 4, carModel: 'Ford Mustang Mach-E', status: 'Sold' },
  { key: 5, carModel: 'Rivian R1T', status: 'Pending Delivery' },
  { key: 6, carModel: 'Volkswagen ID.4', status: 'Promotion' },
];

const columns = [
  {
    title: 'Car Model',
    dataIndex: 'carModel',
    key: 'carModel',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (status) => (
      <span className={`dashboard-status dashboard-status-${status.toLowerCase().replace(' ', '-')}`}>
        {status}
      </span>
    ),
  },
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

const DashboardOverview = () => {
  const getListData = (value) => {
    let listData;
    switch (value.date()) {
      case 8:
        listData = [{ type: 'test-drive', content: 'Test drive appointment' }];
        break;
      case 10:
        listData = [{ type: 'delivery', content: 'Pending delivery scheduled' }];
        break;
      default:
    }
    return listData || [];
  };

  const dateCellRender = (value) => {
    const listData = getListData(value);
    return (
      <ul className="dashboard-calendar-events">
        {listData.map((item) => (
          <li key={item.content}><ClockCircleOutlined /> {item.content}</li>
        ))}
      </ul>
    );
  };

  const monthCellRender = (value) => {
    const num = getMonthData(value.year(), value.month());
    if (num > 0) {
      return <div className="dashboard-calendar-month-note">{num}</div>;
    }
  };

  const getMonthData = (year, month) => {
    if (year === 2023 && month === 9) {
      return 150;
    }
    return 0;
  };

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

      {/* Middle Area: Side by Side Sections */}
      <Row gutter={16} className="dashboard-middle-row">
        {/* Left: Car Statistics Table */}
        <Col xs={24} lg={12}>
          <Card title="Car Statistics" className="dashboard-table-card">
            <Table
              columns={columns}
              dataSource={carStatsData}
              pagination={false}
              size="middle"
              className="dashboard-table"
            />
            <Button type="primary" className="dashboard-view-more-btn">
              View More Details
            </Button>
          </Card>
        </Col>

        {/* Right: Calendar + Appointments List */}
        <Col xs={24} lg={12}>
          <Row gutter={[0, 16]}>
            <Col span={24}>
              <Card title="Upcoming Events Calendar" className="dashboard-calendar-card">
                <Calendar
                  dateCellRender={dateCellRender}
                  monthCellRender={monthCellRender}
                  className="dashboard-calendar"
                />
              </Card>
            </Col>
            <Col span={24}>
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
        </Col>
      </Row>

      {/* Bottom Area: Notifications List */}
      <Row>
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
    </div>
  );
};

export default DashboardOverview;