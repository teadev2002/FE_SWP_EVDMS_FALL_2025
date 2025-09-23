// import React, { useEffect, useState } from 'react';
// import { Table } from 'antd';
// import ManageServiceVehicle from '../../../services/ManageServiceVehicle/ManageServiceVehicle'; // Adjust the import path based on your file structure
 
// export default ManageVehicle;
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Table, Card, Statistic, Button, Calendar, List, Modal, Input, Select, Checkbox, Upload, Slider, Row, Col, Tag, Image } from 'antd';
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import '../../../styles/dealerStaffManager/ManageVehicle.scss';
import dayjs from 'dayjs';

const { Search } = Input;
const { Option } = Select;

// Custom hook for debouncing
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

// Mock data for vehicles (realistic EVs)
const mockVehicles = [
  {
    id: 1,
    image: 'https://carwow-uk-wp-2.imgix.net/2019-Tesla-Model-3-Performance-lead.png?auto=format&cs=tinysrgb&fit=crop&h=&ixlib=rb-1.1.0&q=60&w=1600',
    make: 'Tesla',
    model: 'Model 3',
    year: 2023,
    range: 500,
    power: 300,
    price: 45000,
    features: ['Autopilot', 'Fast Charging', 'Premium Audio'],
    color: 'Red',
    version: 'Standard Range',
    onPromotion: true,
  },
  {
    id: 2,
    image: 'https://th.bing.com/th/id/R.62fd970baf05cbf465945d2946f4eacc?rik=Wy7JujWWlp6Gug&pid=ImgRaw&r=0',
    make: 'Tesla',
    model: 'Model Y',
    year: 2023,
    range: 530,
    power: 350,
    price: 55000,
    features: ['Autopilot', 'Panoramic Roof', 'Fast Charging'],
    color: 'White',
    version: 'Long Range',
    onPromotion: false,
  },
  {
    id: 3,
    image: 'https://tse1.mm.bing.net/th/id/OIP.Mx-1GGrbqKuVqftJaJtrvQHaE7?rs=1&pid=ImgDetMain&o=7&rm=3',
    make: 'Nissan',
    model: 'Leaf',
    year: 2022,
    range: 364,
    power: 160,
    price: 32000,
    features: ['ProPilot Assist', 'e-Pedal'],
    color: 'Blue',
    version: 'SV Plus',
    onPromotion: true,
  },
  {
    id: 4,
    image: 'https://tse1.mm.bing.net/th/id/OIP.UuT9Dsg9n2wqzLeuSc9mXAHaEK?rs=1&pid=ImgDetMain&o=7&rm=3',
    make: 'Chevrolet',
    model: 'Bolt EV',
    year: 2023,
    range: 416,
    power: 200,
    price: 31000,
    features: ['Super Cruise', 'Wireless Charging'],
    color: 'Black',
    version: 'LT',
    onPromotion: false,
  },
  {
    id: 5,
    image: 'https://www.automaistv.com.br/wp-content/uploads/2022/09/ford_mustang_mach-e_gt_performance_edition_47_edited.jpg',
    make: 'Ford',
    model: 'Mustang Mach-E',
    year: 2023,
    range: 490,
    power: 346,
    price: 43000,
    features: ['BlueCruise', 'B&O Sound'],
    color: 'Gray',
    version: 'Premium',
    onPromotion: true,
  },
];

// Mock promotions
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

const ManageVehicle = () => {
  // States
  const [vehicles] = useState(mockVehicles);
  const [filteredVehicles, setFilteredVehicles] = useState(vehicles);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedVehicles, setSelectedVehicles] = useState([]);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isCompareModalVisible, setIsCompareModalVisible] = useState(false);
  const [sortConfig, setSortConfig] = useState({ field: null, order: null });
  const [promotions] = useState(mockPromotions);

  // Filter states
  const [brandFilter, setBrandFilter] = useState([]);
  const [modelSearch, setModelSearch] = useState('');
  const debouncedModelSearch = useDebounce(modelSearch, 300);
  const [colorFilter, setColorFilter] = useState([]);
  const [featureFilters, setFeatureFilters] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 100000]);

  // Derived data
  const allBrands = useMemo(() => [...new Set(vehicles.map(v => v.make))], [vehicles]);
  const allColors = useMemo(() => [...new Set(vehicles.map(v => v.color))], [vehicles]);
  const allFeatures = useMemo(() => [...new Set(vehicles.flatMap(v => v.features))], [vehicles]);

  // Statistics
  const totalModels = useMemo(() => new Set(vehicles.map(v => `${v.make} ${v.model}`)).size, [vehicles]);
  const onPromotion = useMemo(() => vehicles.filter(v => v.onPromotion).length, [vehicles]);
  const avgPrice = useMemo(() => Math.round(vehicles.reduce((sum, v) => sum + v.price, 0) / vehicles.length), [vehicles]);

  // Filtered and sorted data
  const processedData = useMemo(() => {
    let data = vehicles.filter(v => {
      if (brandFilter.length > 0 && !brandFilter.includes(v.make)) return false;
      if (debouncedModelSearch && !v.model.toLowerCase().includes(debouncedModelSearch.toLowerCase())) return false;
      if (colorFilter.length > 0 && !colorFilter.includes(v.color)) return false;
      if (featureFilters.length > 0 && !featureFilters.every(f => v.features.includes(f))) return false;
      if (v.price < priceRange[0] || v.price > priceRange[1]) return false;
      return true;
    });

    if (sortConfig.field) {
      data = [...data].sort((a, b) => {
        const aVal = a[sortConfig.field];
        const bVal = b[sortConfig.field];
        if (sortConfig.order === 'descend') {
          return aVal > bVal ? -1 : 1;
        }
        return aVal < bVal ? -1 : 1;
      });
    }
console.log( filteredVehicles);
    setFilteredVehicles(data);
    return data;
  }, [vehicles, brandFilter, debouncedModelSearch, colorFilter, featureFilters, priceRange, sortConfig]);

  // Active filters for chips
  const activeFilters = useMemo(() => {
    const filters = [];
    brandFilter.forEach(b => filters.push({ type: 'brand', value: b, label: `Brand: ${b}` }));
    if (debouncedModelSearch) filters.push({ type: 'model', value: debouncedModelSearch, label: `Model: ${debouncedModelSearch}` });
    colorFilter.forEach(c => filters.push({ type: 'color', value: c, label: `Color: ${c}` }));
    featureFilters.forEach(f => filters.push({ type: 'feature', value: f, label: `Feature: ${f}` }));
    if (priceRange[0] > 0 || priceRange[1] < 100000) {
      filters.push({ type: 'price', value: priceRange, label: `Price: $${priceRange[0]}-$${priceRange[1]}` });
    }
    return filters;
  }, [brandFilter, debouncedModelSearch, colorFilter, featureFilters, priceRange]);

  const removeFilter = useCallback((filter) => {
    switch (filter.type) {
      case 'brand':
        setBrandFilter(prev => prev.filter(b => b !== filter.value));
        break;
      case 'model':
        setModelSearch('');
        break;
      case 'color':
        setColorFilter(prev => prev.filter(c => c !== filter.value));
        break;
      case 'feature':
        setFeatureFilters(prev => prev.filter(f => f !== filter.value));
        break;
      case 'price':
        setPriceRange([0, 100000]);
        break;
      default:
        break;
    }
  }, []);

  // Table columns
  const columns = [
    {
      title: 'Thumbnail',
      dataIndex: 'image',
      render: (img) => <Image width={50} height={50} src={img} preview={false} />,
      width: 80,
    },
    { title: 'Make', dataIndex: 'make', width: 100 },
    { title: 'Model', dataIndex: 'model', width: 120 },
    { title: 'Year', dataIndex: 'year', sorter: true, width: 80 },
    { title: 'Range (km)', dataIndex: 'range', sorter: true, width: 100 },
    { title: 'Power (kW)', dataIndex: 'power', sorter: true, width: 100 },
    {
      title: 'Price',
      dataIndex: 'price',
      render: (price) => `$${price.toLocaleString()}`,
      sorter: true,
      width: 120,
    },
    {
      title: 'Features',
      dataIndex: 'features',
      render: (features) => features.map(f => <Tag key={f}>{f}</Tag>),
      width: 150,
    },
  ];

  // Row selection for comparison (up to 3)
  const rowSelection = {
    selectedRowKeys,
    onChange: (keys, rows) => {
      setSelectedRowKeys(keys);
      setSelectedVehicles(rows);
    },
    getCheckboxProps: (record) => ({
      disabled: selectedRowKeys.length >= 3 && !selectedRowKeys.includes(record.id),
    }),
  };

  // Row click for details
  const onRow = useCallback((record) => ({
    onClick: () => {
      setSelectedVehicle(record);
      setIsDetailModalVisible(true);
    },
    role: 'button',
    tabIndex: 0,
    onKeyDown: (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        setSelectedVehicle(record);
        setIsDetailModalVisible(true);
      }
    },
  }), []);

  // Table change handler for sorting
  const handleTableChange = useCallback((pagination, filters, sorter) => {
    setSortConfig(sorter);
  }, []);

  // Export CSV
  const exportCSV = useCallback(() => {
    const headers = ['Make', 'Model', 'Year', 'Range', 'Power', 'Price', 'Features'];
    const csvContent = [
      headers.join(','),
      ...processedData.map(v => [
        v.make,
        v.model,
        v.year,
        v.range,
        v.power,
        v.price,
        v.features.join(';'),
      ].join(',')),
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ev-vehicles.csv';
    link.click();
    URL.revokeObjectURL(url);
  }, [processedData]);

  // Upload simulation
  const uploadProps = {
    beforeUpload: (file) => {
      console.log('Simulating upload of new vehicle:', file.name);
      return false;
    },
    accept: '.csv,.json',
    showUploadList: true,
  };

  // Calendar date cell render for promotions
  const getListData = useCallback((value) => {
    const currentDate = dayjs(value.format('YYYY-MM-DD'));
    return promotions
      .filter(p => {
        const from = dayjs(p.validFrom);
        const to = dayjs(p.validTo);
        return currentDate.isAfter(from) && currentDate.isBefore(to);
      })
      .map(p => ({ content: p.title }));
  }, [promotions]);

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

  // Detail modal content
  const detailContent = selectedVehicle ? (
    <div role="region" aria-label="Vehicle details">
      <Image src={selectedVehicle.image} width={300} preview={false} />
      <h3>{selectedVehicle.make} {selectedVehicle.model}</h3>
      <p><strong>Year:</strong> {selectedVehicle.year}</p>
      <p><strong>Range:</strong> {selectedVehicle.range} km</p>
      <p><strong>Power:</strong> {selectedVehicle.power} kW</p>
      <p><strong>Price:</strong> ${selectedVehicle.price.toLocaleString()}</p>
      <p><strong>Color:</strong> {selectedVehicle.color}</p>
      <p><strong>Version:</strong> {selectedVehicle.version}</p>
      <p><strong>Features:</strong> {selectedVehicle.features.join(', ')}</p>
    </div>
  ) : null;

  // Comparison modal content (side-by-side)
  const compareContent = selectedVehicles.map((vehicle) => (
    <Col key={vehicle.id} xs={24} md={8}>
      <Card
        title={`${vehicle.make} ${vehicle.model}`}
        hoverable
        style={{ height: '100%' }}
      >
        <Image src={vehicle.image} width="100%" height={150} preview={false} />
        <p><strong>Year:</strong> {vehicle.year}</p>
        <p><strong>Range:</strong> {vehicle.range} km</p>
        <p><strong>Power:</strong> {vehicle.power} kW</p>
        <p><strong>Price:</strong> ${vehicle.price.toLocaleString()}</p>
        <p><strong>Features:</strong> {vehicle.features.slice(0, 3).join(', ')}</p>
      </Card>
    </Col>
  ));

  return (
    <div className="ev-dashboard" role="main" aria-label="EV Products Dashboard">
      {/* Statistics at top */}
      <Row gutter={16} className="stats-row">
        <Col span={8}>
          <Statistic title="Total Models" value={totalModels} />
        </Col>
        <Col span={8}>
          <Statistic title="Vehicles on Promotion" value={onPromotion} />
        </Col>
        <Col span={8}>
          <Statistic title="Average Price" value={avgPrice} prefix="$" />
        </Col>
      </Row>

      <Row gutter={16}>
        {/* Main content: Filters, Search, Table */}
        <Col xs={24} lg={16}>
          <Card title="Vehicle Catalog" className="main-card">
            {/* Global Search */}
            <Search
              placeholder="Search by model or name (debounced)"
              onSearch={setModelSearch}
              enterButton
              allowClear
              aria-label="Search vehicles"
              style={{ marginBottom: 16 }}
            />

            {/* Filters */}
            <div className="filters" role="region" aria-label="Filters">
              <Select
                mode="multiple"
                placeholder="Select brands"
                value={brandFilter}
                onChange={setBrandFilter}
                style={{ width: 200 }}
                aria-label="Brand filter"
              >
                {allBrands.map(brand => <Option key={brand}>{brand}</Option>)}
              </Select>
              <Select
                mode="multiple"
                placeholder="Select colors"
                value={colorFilter}
                onChange={setColorFilter}
                style={{ width: 150 }}
                aria-label="Color filter"
              >
                {allColors.map(color => <Option key={color}>{color}</Option>)}
              </Select>
              <Checkbox.Group
                options={allFeatures.map(f => ({ label: f, value: f }))}
                value={featureFilters}
                onChange={setFeatureFilters}
                aria-label="Feature filters"
              />
              <Slider
                range
                value={priceRange}
                min={0}
                max={100000}
                onChange={setPriceRange}
                tipFormatter={(v) => `$${v}`}
                aria-label="Price range filter"
                style={{ width: 200 }}
              />
            </div>

            {/* Active Filters Chips */}
            <div className="filter-chips" role="region" aria-label="Active filters">
              {activeFilters.map((filter, index) => (
                <Tag
                  key={`${filter.type}-${filter.value}-${index}`}
                  closable
                  onClose={() => removeFilter(filter)}
                  aria-label={`Remove filter ${filter.label}`}
                >
                  {filter.label}
                </Tag>
              ))}
            </div>

            {/* Table */}
            <Table
              rowSelection={rowSelection}
              columns={columns}
              dataSource={processedData}
              onRow={onRow}
              onChange={handleTableChange}
              pagination={{ pageSize: 10, showSizeChanger: false }}
              rowKey="id"
              bordered
              aria-label="Vehicles table"
            />

            {/* Actions */}
            <div className="actions" role="toolbar" aria-label="Table actions">
              <Button icon={<DownloadOutlined />} onClick={exportCSV} aria-label="Export visible list to CSV">
                Export CSV
              </Button>
              <Upload {...uploadProps}>
                <Button icon={<UploadOutlined />} aria-label="Upload new vehicle data">
                  Upload New Vehicle
                </Button>
              </Upload>
              <Button
                type="primary"
                onClick={() => setIsCompareModalVisible(true)}
                disabled={selectedRowKeys.length === 0 || selectedRowKeys.length > 3}
                aria-label={`Compare ${selectedRowKeys.length} selected vehicles`}
              >
                Compare ({selectedRowKeys.length}/3)
              </Button>
            </div>
          </Card>
        </Col>

        {/* Sidebar: Promotions and Calendar */}
        <Col xs={24} lg={8}>
          <Card title="Promotions" className="sidebar-card" style={{ marginBottom: 16 }}>
            <List
              dataSource={promotions}
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
        </Col>
      </Row>

      {/* Detail Modal */}
      <Modal
        title="Vehicle Details"
        open={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsDetailModalVisible(false)}>
            Close
          </Button>,
        ]}
        aria-label="Vehicle details modal"
      >
        {detailContent}
      </Modal>

      {/* Compare Modal */}
      <Modal
        title="Vehicle Comparison"
        open={isCompareModalVisible}
        onCancel={() => setIsCompareModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsCompareModalVisible(false)}>
            Close
          </Button>,
        ]}
        width="90%"
        aria-label="Vehicle comparison modal"
      >
        <Row gutter={16}>
          {compareContent}
        </Row>
      </Modal>
    </div>
  );
};

export default ManageVehicle;