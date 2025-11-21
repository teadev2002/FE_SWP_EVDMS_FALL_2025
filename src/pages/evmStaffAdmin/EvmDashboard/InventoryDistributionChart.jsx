import React from 'react';
import { Card, Empty, Spin } from 'antd';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList
} from 'recharts';

// --- COMPONENT TOOLTIP TÙY CHỈNH (Hiển thị chi tiết model) ---
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload; // Lấy dữ liệu của dòng hiện tại
    const details = data.details || []; // Lấy danh sách model

    // Sắp xếp: Xe nào nhiều nhất đưa lên đầu
    const sortedDetails = [...details].sort((a, b) => b.qty - a.qty);

    return (
      <div style={{
        backgroundColor: '#fff',
        padding: '12px',
        border: '1px solid #f0f0f0',
        borderRadius: '6px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        minWidth: 220,
        zIndex: 1000
      }}>
        <h4 style={{ margin: '0 0 8px 0', borderBottom: '1px solid #eee', paddingBottom: 5, fontSize: 14 }}>
          {data.location}
        </h4>
        
        <div style={{ maxHeight: 250, overflowY: 'auto', paddingRight: 5 }}>
          {sortedDetails.length > 0 ? (
            sortedDetails.map((item, index) => (
              <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 13 }}>
                <span style={{ color: '#595959', marginRight: 15 }}>{item.name}:</span>
                <span style={{ fontWeight: 600, color: '#000' }}>{item.qty}</span>
              </div>
            ))
          ) : (
            <span style={{ color: '#999', fontStyle: 'italic' }}>No detailed models</span>
          )}
        </div>

        <div style={{ 
          borderTop: '1px solid #eee', 
          marginTop: 8, 
          paddingTop: 8, 
          display: 'flex', 
          justifyContent: 'space-between', 
          fontWeight: 'bold', 
          color: '#1890ff' 
        }}>
          <span>Total Vehicles:</span>
          <span>{data.units}</span>
        </div>
      </div>
    );
  }
  return null;
};

const InventoryDistributionChart = ({ distributionData, loading }) => {
  // 1. Loading State
  if (loading) {
    return (
      <Card title="Inventory Distribution by Location" style={{ borderRadius: 8 }}>
        <div style={{ height: 450, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Spin size="large" tip="Loading chart..." />
        </div>
      </Card>
    );
  }

  // 2. No Data State
  if (!distributionData || distributionData.length === 0) {
    return (
      <Card title="Inventory Distribution by Location" style={{ borderRadius: 8 }}>
        <Empty description="No inventory data available" style={{ margin: '100px 0' }} />
      </Card>
    );
  }

  // 3. Xử lý dữ liệu đầu vào
  const cleanData = distributionData
    .map(item => ({
      location: item.location || 'Unknown',
      units: Number(item.units) || 0,
      details: item.details || [] // Giữ lại mảng chi tiết xe
    }))
    .filter(item => item.units > 0); // Chỉ hiển thị kho có hàng

  // Đưa Central Warehouse lên đầu
  const central = cleanData.find(d => d.location === 'Central Warehouse');
  const others = cleanData
    .filter(d => d.location !== 'Central Warehouse')
    .sort((a, b) => b.units - a.units);

  const sortedData = central ? [central, ...others] : others;

  // Tính toán độ dài trục X cho đẹp
  const values = sortedData.map(d => d.units);
  const maxValue = Math.max(...values, 0);
  const domainMax = Math.ceil((maxValue || 10) * 1.2); 

  if (sortedData.length === 0) {
    return (
      <Card title="Inventory Distribution by Location" style={{ borderRadius: 8 }}>
        <Empty description="No vehicles in any location" style={{ margin: '100px 0' }} />
      </Card>
    );
  }

  // Chiều cao chart động: Càng nhiều kho thì chart càng dài
  const chartHeight = Math.max(450, sortedData.length * 70);

  return (
    <Card title="Inventory Distribution by Location" style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
      <ResponsiveContainer width="100%" height={chartHeight}>
        <BarChart
          data={sortedData}
          layout="vertical" // QUAN TRỌNG: Vẽ biểu đồ ngang
          margin={{ top: 20, right: 60, left: 60, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />

          {/* Trục X: Số lượng (Number) */}
          <XAxis 
            type="number"
            domain={[0, domainMax]}
            tick={{ fontSize: 12, fill: '#8c8c8c' }}
            allowDecimals={false}
            axisLine={{ stroke: '#d9d9d9' }}
          />

          {/* Trục Y: Tên kho (Category) */}
          <YAxis
            dataKey="location"
            type="category"
            width={160}
            tick={{ fontSize: 13, fontWeight: '600', fill: '#262626' }}
            interval={0} // Hiển thị hết tên kho
            axisLine={false}
            tickLine={false}
          />

          {/* Tooltip tùy chỉnh */}
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(24, 144, 255, 0.1)' }} />

          <Bar dataKey="units" barSize={32} radius={[0, 4, 4, 0]}>
            {sortedData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.location === 'Central Warehouse' ? '#1890ff' : '#13c2c2'} // Màu xanh dương cho kho tổng, xanh ngọc cho kho lẻ
              />
            ))}
            <LabelList
              dataKey="units"
              position="right"
              style={{ fill: '#000', fontWeight: 'bold', fontSize: 14 }}
              offset={10}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div style={{ textAlign: 'center', marginTop: 16, color: '#8c8c8c', fontSize: 12 }}>
        <span style={{ display: 'inline-block', width: 10, height: 10, backgroundColor: '#1890ff', marginRight: 5, borderRadius: 2 }}></span> Central Warehouse
        <span style={{ display: 'inline-block', width: 10, height: 10, backgroundColor: '#13c2c2', marginLeft: 15, marginRight: 5, borderRadius: 2 }}></span> Store Branches
      </div>
    </Card>
  );
};

export default InventoryDistributionChart;