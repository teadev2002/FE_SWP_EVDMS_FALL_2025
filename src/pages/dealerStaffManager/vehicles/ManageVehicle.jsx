import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Table, Card, Statistic, Button, Input, Row, Col, Tag, Image, Modal, Typography, Upload } from 'antd';
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import '../../../styles/dealerStaffManager/ManageVehicle.scss';
import ManageVehicleService from '../../../services/ManageVehicleService/ManageVehicleService';
import ManageStorageService from '../../../services/ManageStorage/ManageStorageService';
import { toast } from 'react-toastify';
import VehicleDetailModal from './VehicleDetailModal';

const { Search } = Input;
const { Text } = Typography;

// Custom hook for debouncing
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const ManageVehicle = () => {
  // States
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedVehicles, setSelectedVehicles] = useState([]);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null); // ← Full data from API
  const [isCompareModalVisible, setIsCompareModalVisible] = useState(false);
  const [sortConfig, setSortConfig] = useState({ field: null, order: null });
  const [searchText, setSearchText] = useState('');
  const debouncedSearchText = useDebounce(searchText, 300);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [brandsData, setBrandsData] = useState([]);
  const [quantityCache, setQuantityCache] = useState({});

  // Get storeId from localStorage
  const getStoreId = () => {
    try {
      const dealerInfo = localStorage.getItem('dealerInfo');
      if (dealerInfo) {
        const parsed = JSON.parse(dealerInfo);
        return parsed.storeId || null;
      }
    } catch (error) {
      console.error('Error parsing dealerInfo:', error);
    }
    return null;
  };

  const storeId = getStoreId();

  // Get quantity by storeId + vehicleId + brandId
  const fetchQuantityForVehicle = useCallback(async (vehicleId, brandId) => {
    const cacheKey = `${vehicleId}_${storeId}`;
    if (quantityCache[cacheKey] !== undefined) {
      return quantityCache[cacheKey];
    }

    try {
      const data = await ManageStorageService.filterStorageByBrandIdAndVehicleId(brandId, vehicleId);
      const record = Array.isArray(data) ? data.find(r => r.storeId === storeId) : null;
      const qty = record?.quantityAvailable ?? 0;

      setQuantityCache(prev => ({ ...prev, [cacheKey]: qty }));
      return qty;
    } catch (error) {
      console.error('Error fetching quantity:', error);
      setQuantityCache(prev => ({ ...prev, [cacheKey]: 0 }));
      return 0;
    }
  }, [storeId, quantityCache]);

  // Fetch vehicle list
  useEffect(() => {
    const fetchData = async () => {
      if (!storeId) {
        toast.error('Store information not found. Please log in again.');
        return;
      }

      setLoading(true);
      let vehicleData = [];
      let brands = [];

      try {
        try {
          const response = await ManageVehicleService.getAllVehicleByStoreId(storeId);
          vehicleData = Array.isArray(response) ? response : [];
        } catch (error) {
          console.error('Error loading vehicle list:', error);
          toast.error('Unable to load vehicle list. Please try again.');
          setLoading(false);
          return;
        }

        try {
          const brandResponse = await ManageVehicleService.getAllBrands();
          brands = Array.isArray(brandResponse) ? brandResponse : [];
        } catch (error) {
          console.warn('Error loading brand list:', error);
        }

        setBrandsData(brands);

        if (vehicleData.length === 0) {
          toast.info('Store has no vehicles yet.');
          setVehicles([]);
          setFilteredVehicles([]);
          setLoading(false);
          return;
        }

        const enrichedVehicles = await Promise.all(
          vehicleData.map(async (item) => {
            const qty = await fetchQuantityForVehicle(item.vehicleId, item.brandId);
            const brand = brands.find(b => b.brandId === item.brandId) || { brandName: 'Unknown' };

            return {
              id: item.vehicleId,
              make: brand.brandName,
              model: item.modelName,
              year: item.year,
              range: item.rangePerCharge ? parseInt(item.rangePerCharge) : 0,
              power: item.horsepower,
              price: item.price,
              quantityAvailable: qty,
              features: [
                item.batteryCapacity ? `Battery: ${item.batteryCapacity}` : null,
                item.airConditioning ? `AC: ${item.airConditioning}` : null,
                item.speakerSystem ? `Audio: ${item.speakerSystem}` : null,
                item.headlights ? `Headlights: ${item.headlights}` : null,
                item.cameras ? `Cameras: ${item.cameras}` : null,
              ].filter(Boolean),
              color: item.color,
              version: item.version,
              image: item.imageUrls?.[0] || 'https://via.placeholder.com/300',
              onPromotion: false,
              vehicleId: item.vehicleId, // ← Used to fetch details API
            };
          })
        );

        setVehicles(enrichedVehicles);
        setFilteredVehicles(enrichedVehicles);
        console.log(filteredVehicles)
      } catch (error) {
        console.error('Error aggregating data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [storeId, fetchQuantityForVehicle]);



  const openDetailModal = useCallback(async (vehicleId) => {
    try {
      setLoading(true);
      const rawData = await ManageVehicleService.GetVehicleById(vehicleId);

      //  const brand = brandsData.find(b => b.brandId === rawData.brandId) || { brandName: 'Unknown' };
      const qty = await fetchQuantityForVehicle(vehicleId, rawData.brandId);

      const vehicleForModal = {
        id: rawData.vehicleId,
        model: rawData.modelName,
        year: rawData.year,
        price: rawData.price,
        quantityAvailable: qty,
        fullData: {
          ...rawData,
          imageUrls: rawData.imageUrls || [],
        }
      };

      setSelectedVehicle(vehicleForModal);
      setIsDetailModalVisible(true);
    } catch (error) {
      console.error('Error fetching vehicle details:', error);
      toast.error('Unable to load vehicle details. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [brandsData, fetchQuantityForVehicle]);

  // Statistics
  const totalModels = useMemo(() => new Set(vehicles.map(v => `${v.make} ${v.model}`)).size, [vehicles]);
  const onPromotion = useMemo(() => vehicles.filter(v => v.onPromotion).length, [vehicles]);
  const avgPrice = useMemo(() => {
    if (vehicles.length === 0) return 0;
    return Math.round(vehicles.reduce((sum, v) => sum + v.price, 0) / vehicles.length);
  }, [vehicles]);

  // Filter + sort
  const processedData = useMemo(() => {
    let data = vehicles;

    if (debouncedSearchText) {
      data = data.filter(v =>
        v.model.toLowerCase().includes(debouncedSearchText.toLowerCase())
      );
    }

    if (sortConfig.field) {
      data = [...data].sort((a, b) => {
        const aVal = a[sortConfig.field];
        const bVal = b[sortConfig.field];
        return sortConfig.order === 'descend'
          ? (aVal > bVal ? -1 : 1)
          : (aVal < bVal ? -1 : 1);
      });
    }

    return data;
  }, [vehicles, debouncedSearchText, sortConfig]);

  useEffect(() => {
    setFilteredVehicles(processedData);
  }, [processedData]);

  // Columns
  const columns = [
    {
      title: 'Thumbnail',
      dataIndex: 'image',
      render: (img) => <Image width={50} height={50} src={img} preview={false} />,
      width: 80,
    },
    { title: 'Brand', dataIndex: 'make', width: 100, sorter: true },
    { title: 'Model', dataIndex: 'model', width: 120, sorter: true },
    { title: 'Year', dataIndex: 'year', sorter: true, width: 80 },
    { title: 'Range per Charge (km)', dataIndex: 'range', sorter: true, width: 100 },
    { title: 'Power (hp)', dataIndex: 'power', sorter: true, width: 100 },
    {
      title: 'Price',
      dataIndex: 'price',
      render: (price) => `${price.toLocaleString()} VND`,
      sorter: true,
      width: 120,
    },
    {
      title: 'Quantity',
      dataIndex: 'quantityAvailable',
      render: (quantity) => {
        const color = quantity > 1 ? 'green' : quantity === 1 ? 'orange' : 'red';
        return (
          <Tag color={color}>
            {quantity} Available
          </Tag>
        );
      },
      sorter: true,
      width: 100,
    },
    {
      title: 'Features',
      dataIndex: 'features',
      render: (features) => features.map(f => <Tag key={f}>{f}</Tag>),
      width: 150,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button
          onClick={() => openDetailModal(record.vehicleId)}
          loading={loading}
          style={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',  // Gradient xanh dương cho Detail
            border: 'none',
            borderRadius: '8px',
            fontSize: '0.875rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            color: 'white'  // Đổi chữ trắng để nổi
          }}
          onMouseEnter={(e) => e.target.style.transform = 'translateY(-1px)'}
          onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
        >
          Details
        </Button>
      ),
      width: 100,
    },
  ];

  // Row selection
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

  // Table change
  const handleTableChange = useCallback((pagination, filters, sorter) => {
    setSortConfig(sorter);
    setCurrentPage(pagination.current);
  }, []);

  // Export CSV
  const exportCSV = useCallback(() => {
    const headers = ['Brand', 'Model', 'Year', 'Range', 'Power', 'Price', 'Quantity', 'Features'];
    const csvContent = [
      headers.join(','),
      ...processedData.map(v => [
        v.make, v.model, v.year, v.range, v.power, v.price, v.quantityAvailable,
        v.features.join(';')
      ].join(',')),
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'vehicles.csv';
    link.click();
    URL.revokeObjectURL(url);
  }, [processedData]);

  // Upload
  const uploadProps = {
    beforeUpload: (file) => {
      console.log('Simulating upload:', file.name);
      return false;
    },
    accept: '.csv,.json',
    showUploadList: true,
  };

  // Compare modal
  const compareContent = selectedVehicles.map((vehicle) => (
    <Col key={vehicle.id} xs={24} md={8}>
      <Card title={`${vehicle.make} ${vehicle.model}`} hoverable style={{ height: '100%' }}>
        <Image src={vehicle.image} width="100%" height={150} preview={false} />
        <p><strong>Year:</strong> {vehicle.year}</p>
        <p><strong>Range:</strong> {vehicle.range} km</p>
        <p><strong>Power:</strong> {vehicle.power} hp</p>
        <p><strong>Price:</strong> {vehicle.price.toLocaleString()} VND</p>
        <p><strong>Quantity:</strong> {vehicle.quantityAvailable} Available</p>
        <p><strong>Features:</strong> {vehicle.features.slice(0, 3).join(', ')}</p>
      </Card>
    </Col>
  ));

  // Pagination
  const totalVehicles = processedData.length;
  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, totalVehicles);

  return (
    <div className="ev-dashboard" role="main">
      {/* Statistics */}
      <Row gutter={16} className="stats-row">
        <Col span={8}><Statistic title="Total Models" value={totalModels} /></Col>
        <Col span={8}><Statistic title="Vehicles on Promotion" value={onPromotion} /></Col>
        <Col span={8}><Statistic title="Average Price" value={avgPrice} prefix="VND " /></Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} lg={24}>
          <Card title="Vehicle Catalog" className="main-card">
            <Search
              placeholder="Search by model name"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              enterButton
              allowClear
              style={{ marginBottom: 16 }}
            />

            <Row style={{ marginBottom: 16 }}>
              <Col>
                <Text>
                  Showing {startIndex} to {endIndex} of {totalVehicles} vehicles
                </Text>
              </Col>
            </Row>

            <Table
              rowSelection={rowSelection}
              columns={columns}
              dataSource={processedData}
              onChange={handleTableChange}
              pagination={{ pageSize, current: currentPage, total: totalVehicles, showSizeChanger: false }}
              rowKey="id"
              bordered
              loading={loading}
            />

            <div className="actions" style={{ marginTop: 16 }}>
              <Button icon={<DownloadOutlined />} onClick={exportCSV}>Export CSV</Button>
              <Upload {...uploadProps}>
                <Button icon={<UploadOutlined />}>Upload New Vehicle</Button>
              </Upload>
              <Button
                type="primary"
                onClick={() => setIsCompareModalVisible(true)}
                disabled={selectedRowKeys.length === 0 || selectedRowKeys.length > 3}
              >
                Compare ({selectedRowKeys.length}/3)
              </Button>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Detail Modal */}
      <Modal
        title="Vehicle Details"
        open={isDetailModalVisible}
        onCancel={() => {
          setIsDetailModalVisible(false);
          setSelectedVehicle(null);
        }}
        footer={null}
        width="90%"
        centered
      >
        {selectedVehicle && (
          <VehicleDetailModal
            vehicle={selectedVehicle}
            brandsData={brandsData}
            onClose={() => {
              setIsDetailModalVisible(false);
              setSelectedVehicle(null);
            }}
          />
        )}
      </Modal>

      {/* Compare Modal */}
      <Modal
        title="Compare Vehicles"
        open={isCompareModalVisible}
        onCancel={() => setIsCompareModalVisible(false)}
        footer={[<Button key="close" onClick={() => setIsCompareModalVisible(false)}>Close</Button>]}
        width="90%"
      >
        <Row gutter={16}>{compareContent}</Row>
      </Modal>
    </div>
  );
};

export default ManageVehicle;