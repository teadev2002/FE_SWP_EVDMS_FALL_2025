// src/components/dashboard/TopModelsChart.jsx
import React, { useMemo } from 'react';
import { Card, Empty } from 'antd';
import { 
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, Label 
} from 'recharts';

// 1. Custom Tooltip: Hiển thị Tên xe và Số lượng rõ ràng
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div style={{ 
        backgroundColor: '#fff', 
        padding: '10px 15px', 
        border: '1px solid #f0f0f0', 
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        borderRadius: '6px',
        fontSize: '13px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 5 }}>
          <span style={{ 
            display: 'inline-block', width: 8, height: 8, borderRadius: '50%', 
            backgroundColor: data.fill, marginRight: 8 
          }}></span>
          <span style={{ fontWeight: 'bold', color: '#333' }}>{data.name}</span>
        </div>
        <div style={{ paddingLeft: 16, color: '#666' }}>
          Quantity: <span style={{ fontWeight: 'bold', color: '#000', fontSize: 14 }}>{data.value}</span>
        </div>
      </div>
    );
  }
  return null;
};

const TopModelsChart = ({ data }) => {
  // Palette màu sắc nhẹ nhàng, chuyên nghiệp
  const COLORS = ['#5B8FF9', '#5AD8A6', '#5D7092', '#F6BD16', '#E8684A', '#6DC8EC'];

  // 2. Xử lý dữ liệu: Lấy Top 5 và gán màu
  const top5Data = useMemo(() => {
    return [...(data || [])]
      .sort((a, b) => b.value - a.value)
      .slice(0, 5)
      .map((item, index) => ({
        ...item,
        fill: COLORS[index % COLORS.length]
      }));
  }, [data]);

  // 3. Tính tổng số lượng (để hiển thị ở giữa Donut)
  const totalQuantity = useMemo(() => {
    return top5Data.reduce((acc, cur) => acc + cur.value, 0);
  }, [top5Data]);

  return (
    <Card title="Top 5 Models Inventory" style={{ height: '100%', borderRadius: 8 }}>
      {top5Data.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={top5Data}
              cx="50%"
              cy="50%"
              // innerRadius > 0 tạo hiệu ứng Donut
              innerRadius={80}
              outerRadius={100}
              paddingAngle={3} // Khoảng cách giữa các miếng
              dataKey="value"
            >
              {top5Data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} stroke="none" />
              ))}
              
              {/* 4. Label ở giữa Donut: Hiển thị tổng số */}
              <Label
                value={totalQuantity}
                position="center"
                dy={-10}
                style={{
                  fontSize: '28px',
                  fontWeight: 'bold',
                  fill: '#333',
                  fontFamily: 'Arial'
                }}
              />
              <Label
                value="Vehicles"
                position="center"
                dy={15}
                style={{
                  fontSize: '14px',
                  fill: '#999',
                }}
              />
            </Pie>
            
            <Tooltip content={<CustomTooltip />} />
            
            <Legend 
              verticalAlign="bottom" 
              height={36} 
              iconType="circle"
              iconSize={10}
              formatter={(value) => (
                <span style={{ color: '#595959', fontWeight: 500, marginLeft: 5 }}>{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <Empty description="No data" image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
    </Card>
  );
};

export default TopModelsChart;