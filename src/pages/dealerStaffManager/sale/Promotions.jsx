import React, { useCallback } from 'react';
import { Card, List, Button, Calendar } from 'antd';
import dayjs from 'dayjs';

// Mock promotions data
const mockPromotions = [
  {
    id: 1,
    title: 'Tesla Model 3 10% Discount',
    description: 'Special holiday offer',
    validFrom: '2023-10-01',
    validTo: '2023-12-31',
    cta: 'Apply Now',
  },
  {
    id: 2,
    title: 'Nissan Leaf Cashback',
    description: '$2000 off select models',
    validFrom: '2023-11-01',
    validTo: '2023-11-30',
    cta: 'Claim',
  },
];

const Promotions = () => {
  // Calendar date cell render for promotions
  const getListData = useCallback((value) => {
    const currentDate = dayjs(value.format('YYYY-MM-DD'));
    return mockPromotions
      .filter(p => {
        const from = dayjs(p.validFrom);
        const to = dayjs(p.validTo);
        return currentDate.isAfter(from) && currentDate.isBefore(to);
      })
      .map(p => ({ content: p.title }));
  }, []);

  const dateCellRender = useCallback((value) => {
    const listData = getListData(value);
    return (
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {listData.map((item, idx) => (
          <li key={idx} style={{ margin: '4px 0', color: '#1890ff' }}>{item.content}</li>
        ))}
      </ul>
    );
  }, [getListData]);

  return (
    <>
      <Card title="Promotions" className="sidebar-card" style={{ marginBottom: 16 }}>
        <List
          dataSource={mockPromotions}
          renderItem={promo => (
            <List.Item key={promo.id}>
              <List.Item.Meta
                title={promo.title}
                description={promo.description}
              />
              <div>
                <span>Valid: {promo.validFrom} - {promo.validTo}</span>
                <Button size="small" type="link">{promo.cta}</Button>
              </div>
            </List.Item>
          )}
          aria-label="Current promotions"
        />
      </Card>

      <Card title="Promotion Calendar" className="calendar-card">
        <Calendar
          fullscreen={false}
          dateCellRender={dateCellRender}
          aria-label="Promotion calendar"
        />
      </Card>
    </>
  );
};

export default Promotions;