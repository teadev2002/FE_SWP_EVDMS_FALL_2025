import React from 'react';
import { Card, Calendar } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
 
const UpcomingEventsCalendar = () => {
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
          <li key={item.content}>
            <ClockCircleOutlined /> {item.content}
          </li>
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
    <Card title="Upcoming Events Calendar" className="dashboard-calendar-card">
      <Calendar
        dateCellRender={dateCellRender}
        monthCellRender={monthCellRender}
        className="dashboard-calendar"
      />
    </Card>
  );
};

export default UpcomingEventsCalendar;