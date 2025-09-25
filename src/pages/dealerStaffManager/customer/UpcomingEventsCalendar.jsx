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

  const getMonthData = (year, month) => {
    if (year === 2023 && month === 9) {
      return 150;
    }
    return 0;
  };

  // Sử dụng cellRender thay cho dateCellRender và monthCellRender
  const cellRender = (current, info) => {
    if (info.type === 'date') {
      const listData = getListData(current);
      return (
        <ul className="dashboard-calendar-events">
          {listData.map((item) => (
            <li key={item.content}>
              <ClockCircleOutlined /> {item.content}
            </li>
          ))}
        </ul>
      );
    }
    if (info.type === 'month') {
      const num = getMonthData(current.year(), current.month());
      if (num > 0) {
        return <div className="dashboard-calendar-month-note">{num}</div>;
      }
    }
    return null;
  };

  return (
    <Card title="Upcoming Events Calendar" className="dashboard-calendar-card">
      <Calendar
        cellRender={cellRender}
        className="dashboard-calendar"
      />
    </Card>
  );
};

export default UpcomingEventsCalendar;