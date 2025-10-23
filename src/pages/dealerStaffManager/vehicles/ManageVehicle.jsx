// import React, { useState, useEffect, useMemo, useCallback } from 'react';
// import { Table, Card, Statistic, Button, Input, Select, Checkbox, Upload, Slider, Row, Col, Tag, Image, Modal, Typography } from 'antd';
// import { DownloadOutlined, UploadOutlined } from '@ant-design/icons';
// import '../../../styles/dealerStaffManager/ManageVehicle.scss';
// import ManageVehicleService from '../../../services/ManageVehicleService/ManageVehicleService';
// import ManageBrandService from '../../../services/ManageBrand/ManageBrandService';
// import { toast } from 'react-toastify';

// const { Search } = Input;
// const { Option } = Select;
// const { Text } = Typography;

// // Custom hook for debouncing
// function useDebounce(value, delay) {
//   const [debouncedValue, setDebouncedValue] = useState(value);
//   useEffect(() => {
//     const handler = setTimeout(() => {
//       setDebouncedValue(value);
//     }, delay);
//     return () => {
//       clearTimeout(handler);
//     };
//   }, [value, delay]);
//   return debouncedValue;
// }

// const ManageVehicle = () => {
//   // States
//   const [vehicles, setVehicles] = useState([]);
//   const [filteredVehicles, setFilteredVehicles] = useState([]);
//   const [selectedRowKeys, setSelectedRowKeys] = useState([]);
//   const [selectedVehicles, setSelectedVehicles] = useState([]);
//   const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
//   const [selectedVehicle, setSelectedVehicle] = useState(null);
//   const [isCompareModalVisible, setIsCompareModalVisible] = useState(false);
//   const [sortConfig, setSortConfig] = useState({ field: null, order: null });
//   const [searchText, setSearchText] = useState('');
//   const debouncedSearchText = useDebounce(searchText, 300);
//   const [brandFilter, setBrandFilter] = useState([]);
//   const [colorFilter, setColorFilter] = useState([]);
//   const [featureFilters, setFeatureFilters] = useState([]);
//   const [priceRange, setPriceRange] = useState([0, 2000000000]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize] = useState(10);
//   const [loading, setLoading] = useState(false);

//   // Fetch vehicles and brand names
//   useEffect(() => {
//     const fetchVehicles = async () => {
//       setLoading(true);
//       try {
//         // Fetch all vehicles
//         const vehicleData = await ManageVehicleService.getAllVehicle();

//         // Create a cache for brand names to avoid duplicate API calls
//         const brandCache = new Map();

//         // Fetch brand names for unique brandIds
//         const uniqueBrandIds = [...new Set(vehicleData.map(item => item.brandId))];
//         await Promise.all(uniqueBrandIds.map(async (brandId) => {
//           try {
//             const brandData = await ManageBrandService.GetBrandById(brandId);
//             brandCache.set(brandId, brandData.brandName || 'Unknown');
//           } catch (error) {
//             console.error(`Failed to fetch brand ${brandId}:`, error);
//             brandCache.set(brandId, 'Unknown');
//           }
//         }));

//         // Format vehicle data with brand names
//         const formattedData = vehicleData.map(item => ({
//           id: item.vehicleId,
//           make: brandCache.get(item.brandId) || 'Unknown',
//           model: item.modelName,
//           year: item.year,
//           range: item.rangePerCharge ? parseInt(item.rangePerCharge) : 0,
//           power: item.horsepower,
//           price: item.price,
//           features: [
//             item.batteryCapacity ? `Battery: ${item.batteryCapacity}` : null,
//             item.airConditioning ? `AC: ${item.airConditioning}` : null,
//             item.speakerSystem ? `Audio: ${item.speakerSystem}` : null,
//             item.headlights ? `Headlights: ${item.headlights}` : null,
//             item.cameras ? `Cameras: ${item.cameras}` : null,
//           ].filter(Boolean),
//           color: item.color,
//           version: item.version,
//           image: item.imageUrls && item.imageUrls.length > 0 ? item.imageUrls[0] : '',
//           onPromotion: false, // Not in API response; adjust if promotion data is available
//         }));

//         setVehicles(formattedData);
//         setFilteredVehicles(formattedData);
//       } catch (error) {
//         console.error('Failed to fetch vehicles:', error);
//         toast.error('Failed to fetch vehicles');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchVehicles();
//   }, []);

//   // Derived data
//   const allBrands = useMemo(() => [...new Set(vehicles.map(v => v.make))], [vehicles]);
//   const allColors = useMemo(() => [...new Set(vehicles.map(v => v.color))], [vehicles]);
//   const allFeatures = useMemo(() => [...new Set(vehicles.flatMap(v => v.features))], [vehicles]);

//   // Statistics
//   const totalModels = useMemo(() => new Set(vehicles.map(v => `${v.make} ${v.model}`)).size, [vehicles]);
//   const onPromotion = useMemo(() => vehicles.filter(v => v.onPromotion).length, [vehicles]);
//   const avgPrice = useMemo(() => {
//     if (vehicles.length === 0) return 0;
//     return Math.round(vehicles.reduce((sum, v) => sum + v.price, 0) / vehicles.length);
//   }, [vehicles]);

//   // Filtered and sorted data
//   const processedData = useMemo(() => {
//     let data = vehicles.filter(v => {
//       if (brandFilter.length > 0 && !brandFilter.includes(v.make)) return false;
//       if (debouncedSearchText && !v.model.toLowerCase().includes(debouncedSearchText.toLowerCase())) return false;
//       if (colorFilter.length > 0 && !colorFilter.includes(v.color)) return false;
//       if (featureFilters.length > 0 && !featureFilters.every(f => v.features.includes(f))) return false;
//       if (v.price < priceRange[0] || v.price > priceRange[1]) return false;
//       return true;
//     });

//     if (sortConfig.field) {
//       data = [...data].sort((a, b) => {
//         const aVal = a[sortConfig.field];
//         const bVal = b[sortConfig.field];
//         if (sortConfig.order === 'descend') {
//           return aVal > bVal ? -1 : 1;
//         }
//         return aVal < bVal ? -1 : 1;
//       });
//     }

//     setFilteredVehicles(data);
//     return data;
//   }, [vehicles, brandFilter, debouncedSearchText, colorFilter, featureFilters, priceRange, sortConfig]);

//   // Active filters for chips
//   const activeFilters = useMemo(() => {
//     const filters = [];
//     brandFilter.forEach(b => filters.push({ type: 'brand', value: b, label: `Brand: ${b}` }));
//     if (debouncedSearchText) filters.push({ type: 'model', value: debouncedSearchText, label: `Model: ${debouncedSearchText}` });
//     colorFilter.forEach(c => filters.push({ type: 'color', value: c, label: `Color: ${c}` }));
//     featureFilters.forEach(f => filters.push({ type: 'feature', value: f, label: `Feature: ${f}` }));
//     if (priceRange[0] > 0 || priceRange[1] < 2000000000) {
//       filters.push({ type: 'price', value: priceRange, label: `Price: ${priceRange[0].toLocaleString()}-${priceRange[1].toLocaleString()} VND` });
//     }
//     return filters;
//   }, [brandFilter, debouncedSearchText, colorFilter, featureFilters, priceRange]);

//   const removeFilter = useCallback((filter) => {
//     switch (filter.type) {
//       case 'brand':
//         setBrandFilter(prev => prev.filter(b => b !== filter.value));
//         break;
//       case 'model':
//         setSearchText('');
//         break;
//       case 'color':
//         setColorFilter(prev => prev.filter(c => c !== filter.value));
//         break;
//       case 'feature':
//         setFeatureFilters(prev => prev.filter(f => f !== filter.value));
//         break;
//       case 'price':
//         setPriceRange([0, 2000000000]);
//         break;
//       default:
//         break;
//     }
//   }, []);

//   // Table columns
//   const columns = [
//     {
//       title: 'Thumbnail',
//       dataIndex: 'image',
//       render: (img) => <Image width={50} height={50} src={img} preview={false} />,
//       width: 80,
//     },
//     { title: 'Brand', dataIndex: 'make', width: 100, sorter: true },
//     { title: 'Model', dataIndex: 'model', width: 120, sorter: true },
//     { title: 'Year', dataIndex: 'year', sorter: true, width: 80 },
//     { title: 'Range per Charge (km)', dataIndex: 'range', sorter: true, width: 100 },
//     { title: 'Power (hp)', dataIndex: 'power', sorter: true, width: 100 },
//     {
//       title: 'Price',
//       dataIndex: 'price',
//       render: (price) => `${price.toLocaleString()} VND`,
//       sorter: true,
//       width: 120,
//     },
//     {
//       title: 'Features',
//       dataIndex: 'features',
//       render: (features) => features.map(f => <Tag key={f}>{f}</Tag>),
//       width: 150,
//     },
//   ];

//   // Row selection for comparison (up to 3)
//   const rowSelection = {
//     selectedRowKeys,
//     onChange: (keys, rows) => {
//       setSelectedRowKeys(keys);
//       setSelectedVehicles(rows);
//     },
//     getCheckboxProps: (record) => ({
//       disabled: selectedRowKeys.length >= 3 && !selectedRowKeys.includes(record.id),
//     }),
//   };

//   // Row click for details
//   const onRow = useCallback((record) => ({
//     onClick: () => {
//       setSelectedVehicle(record);
//       setIsDetailModalVisible(true);
//     },
//     role: 'button',
//     tabIndex: 0,
//     onKeyDown: (e) => {
//       if (e.key === 'Enter' || e.key === ' ') {
//         setSelectedVehicle(record);
//         setIsDetailModalVisible(true);
//       }
//     },
//   }), []);

//   // Table change handler for sorting
//   const handleTableChange = useCallback((pagination, filters, sorter) => {
//     setSortConfig(sorter);
//     setCurrentPage(pagination.current);
//   }, []);

//   // Export CSV
//   const exportCSV = useCallback(() => {
//     const headers = ['Make', 'Model', 'Year', 'Range', 'Power', 'Price', 'Features'];
//     const csvContent = [
//       headers.join(','),
//       ...processedData.map(v => [
//         v.make,
//         v.model,
//         v.year,
//         v.range,
//         v.power,
//         v.price,
//         v.features.join(';'),
//       ].join(',')),
//     ].join('\n');
//     const blob = new Blob([csvContent], { type: 'text/csv' });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement('a');
//     link.href = url;
//     link.download = 'vehicles.csv';
//     link.click();
//     URL.revokeObjectURL(url);
//   }, [processedData]);

//   // Upload simulation
//   const uploadProps = {
//     beforeUpload: (file) => {
//       console.log('Simulating upload of new vehicle:', file.name);
//       return false;
//     },
//     accept: '.csv,.json',
//     showUploadList: true,
//   };

//   // Detail modal content
//   const detailContent = selectedVehicle ? (
//     <div role="region" aria-label="Vehicle details">
//       <Image src={selectedVehicle.image} width={300} preview={false} />
//       <h3>{selectedVehicle.make} {selectedVehicle.model}</h3>
//       <p><strong>Year:</strong> {selectedVehicle.year}</p>
//       <p><strong>Range:</strong> {selectedVehicle.range} km</p>
//       <p><strong>Power:</strong> {selectedVehicle.power} hp</p>
//       <p><strong>Price:</strong> {selectedVehicle.price.toLocaleString()} VND</p>
//       <p><strong>Color:</strong> {selectedVehicle.color}</p>
//       <p><strong>Version:</strong> {selectedVehicle.version}</p>
//       <p><strong>Features:</strong> {selectedVehicle.features.join(', ')}</p>
//     </div>
//   ) : null;

//   // Comparison modal content (side-by-side)
//   const compareContent = selectedVehicles.map((vehicle) => (
//     <Col key={vehicle.id} xs={24} md={8}>
//       <Card
//         title={`${vehicle.make} ${vehicle.model}`}
//         hoverable
//         style={{ height: '100%' }}
//       >
//         <Image src={vehicle.image} width="100%" height={150} preview={false} />
//         <p><strong>Year:</strong> {vehicle.year}</p>
//         <p><strong>Range:</strong> {vehicle.range} km</p>
//         <p><strong>Power:</strong> {vehicle.power} hp</p>
//         <p><strong>Price:</strong> {vehicle.price.toLocaleString()} VND</p>
//         <p><strong>Features:</strong> {vehicle.features.slice(0, 3).join(', ')}</p>
//       </Card>
//     </Col>
//   ));

//   // Calculate pagination details
//   const totalVehicles = filteredVehicles.length;
//   const startIndex = (currentPage - 1) * pageSize + 1;
//   const endIndex = Math.min(currentPage * pageSize, totalVehicles);

//   return (
//     <div className="ev-dashboard" role="main" aria-label="Vehicle Management Dashboard">
//       {/* Statistics at top */}
//       <Row gutter={16} className="stats-row">
//         <Col span={8}>
//           <Statistic title="Total Models" value={totalModels} />
//         </Col>
//         <Col span={8}>
//           <Statistic title="Vehicles on Promotion" value={onPromotion} />
//         </Col>
//         <Col span={8}>
//           <Statistic title="Average Price" value={avgPrice} prefix="VND " />
//         </Col>
//       </Row>

//       <Row gutter={16}>
//         <Col xs={24} lg={24}>
//           <Card title="Vehicle Catalog" className="main-card">
//             {/* Global Search */}
//             <Search
//               placeholder="Search by model name"
//               value={searchText}
//               onChange={(e) => setSearchText(e.target.value)}
//               enterButton
//               allowClear
//               aria-label="Search vehicles"
//               style={{ marginBottom: 16 }}
//             />

//             {/* Filters */}
//             <div className="filters" role="region" aria-label="Filters">
//               <Select
//                 mode="multiple"
//                 placeholder="Select brands"
//                 value={brandFilter}
//                 onChange={setBrandFilter}
//                 style={{ width: 200 }}
//                 aria-label="Brand filter"
//               >
//                 {allBrands.map(brand => <Option key={brand}>{brand}</Option>)}
//               </Select>
//               <Select
//                 mode="multiple"
//                 placeholder="Select colors"
//                 value={colorFilter}
//                 onChange={setColorFilter}
//                 style={{ width: 150 }}
//                 aria-label="Color filter"
//               >
//                 {allColors.map(color => <Option key={color}>{color}</Option>)}
//               </Select>
//               <Checkbox.Group
//                 options={allFeatures.map(f => ({ label: f, value: f }))}
//                 value={featureFilters}
//                 onChange={setFeatureFilters}
//                 aria-label="Feature filters"
//               />
//               <Slider
//                 range
//                 value={priceRange}
//                 min={0}
//                 max={2000000000}
//                 onChange={setPriceRange}
//                 tipFormatter={(v) => `${v.toLocaleString()} VND`}
//                 aria-label="Price range filter"
//                 style={{ width: 200 }}
//               />
//             </div>

//             {/* Active Filters Chips */}
//             <div className="filter-chips" role="region" aria-label="Active filters">
//               {activeFilters.map((filter, index) => (
//                 <Tag
//                   key={`${filter.type}-${filter.value}-${index}`}
//                   closable
//                   onClose={() => removeFilter(filter)}
//                   aria-label={`Remove filter ${filter.label}`}
//                 >
//                   {filter.label}
//                 </Tag>
//               ))}
//             </div>

//             {/* Pagination Summary and Table */}


//                <Col>
//                 <Text>
//                   Showing {startIndex} to {endIndex} of {totalVehicles} vehicles
//                 </Text>
//               </Col>
//                 <Table
//                   rowSelection={rowSelection}
//                   columns={columns}
//                   dataSource={processedData}
//                   onRow={onRow}
//                   onChange={handleTableChange}
//                   pagination={{
//                     pageSize: pageSize,
//                     current: currentPage,
//                     total: totalVehicles,
//                     showSizeChanger: false,
//                     style: { margin: 0 },
//                   }}
//                   rowKey="id"
//                   bordered
//                   loading={loading}
//                   aria-label="Vehicles table"
//                 />



//             {/* Actions */}
//             <div className="actions" role="toolbar" aria-label="Table actions">
//               <Button icon={<DownloadOutlined />} onClick={exportCSV} aria-label="Export visible list to CSV">
//                 Export CSV
//               </Button>
//               <Upload {...uploadProps}>
//                 <Button icon={<UploadOutlined />} aria-label="Upload new vehicle data">
//                   Upload New Vehicle
//                 </Button>
//               </Upload>
//               <Button
//                 type="primary"
//                 onClick={() => setIsCompareModalVisible(true)}
//                 disabled={selectedRowKeys.length === 0 || selectedRowKeys.length > 3}
//                 aria-label={`Compare ${selectedRowKeys.length} selected vehicles`}
//               >
//                 Compare ({selectedRowKeys.length}/3)
//               </Button>
//             </div>
//           </Card>
//         </Col>
//       </Row>

//       {/* Detail Modal */}
//       <Modal
//         title="Vehicle Details"
//         open={isDetailModalVisible}
//         onCancel={() => setIsDetailModalVisible(false)}
//         footer={[
//           <Button key="close" onClick={() => setIsDetailModalVisible(false)}>
//             Close
//           </Button>,
//         ]}
//         aria-label="Vehicle details modal"
//       >
//         {detailContent}
//       </Modal>

//       {/* Compare Modal */}
//       <Modal
//         title="Vehicle Comparison"
//         open={isCompareModalVisible}
//         onCancel={() => setIsCompareModalVisible(false)}
//         footer={[
//           <Button key="close" onClick={() => setIsCompareModalVisible(false)}>
//             Close
//           </Button>,
//         ]}
//         width="90%"
//         aria-label="Vehicle comparison modal"
//       >
//         <Row gutter={16}>
//           {compareContent}
//         </Row>
//       </Modal>
//     </div>
//   );
// };

// export default ManageVehicle;

//---------------------------------------------------------------------------------------------------------//

// import React, { useState, useEffect, useMemo, useCallback } from 'react';
// import { Table, Card, Statistic, Button, Input, Select, Checkbox, Upload, Slider, Row, Col, Tag, Image, Modal, Typography } from 'antd';
// import { DownloadOutlined, UploadOutlined } from '@ant-design/icons';
// import '../../../styles/dealerStaffManager/ManageVehicle.scss';
// import ManageVehicleService from '../../../services/ManageVehicleService/ManageVehicleService';
// import ManageBrandService from '../../../services/ManageBrand/ManageBrandService';
// import { toast } from 'react-toastify';
// import VehicleDetailModal from './VehicleDetailModal'; // Import new modal component

// const { Search } = Input;
// const { Option } = Select;
// const { Text } = Typography;

// // Custom hook for debouncing
// function useDebounce(value, delay) {
//   const [debouncedValue, setDebouncedValue] = useState(value);
//   useEffect(() => {
//     const handler = setTimeout(() => {
//       setDebouncedValue(value);
//     }, delay);
//     return () => {
//       clearTimeout(handler);
//     };
//   }, [value, delay]);
//   return debouncedValue;
// }

// const ManageVehicle = () => {
//   // States
//   const [vehicles, setVehicles] = useState([]);
//   const [filteredVehicles, setFilteredVehicles] = useState([]);
//   const [selectedRowKeys, setSelectedRowKeys] = useState([]);
//   const [selectedVehicles, setSelectedVehicles] = useState([]);
//   const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
//   const [selectedVehicle, setSelectedVehicle] = useState(null);
//   const [isCompareModalVisible, setIsCompareModalVisible] = useState(false);
//   const [sortConfig, setSortConfig] = useState({ field: null, order: null });
//   const [searchText, setSearchText] = useState('');
//   const debouncedSearchText = useDebounce(searchText, 300);
//   const [brandFilter, setBrandFilter] = useState([]);
//   const [colorFilter, setColorFilter] = useState([]);
//   const [featureFilters, setFeatureFilters] = useState([]);
//   const [priceRange, setPriceRange] = useState([0, 2000000000]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize] = useState(10);
//   const [loading, setLoading] = useState(false);

//   // Fetch vehicles and brand names
//   useEffect(() => {
//     const fetchVehicles = async () => {
//       setLoading(true);
//       try {
//         // Fetch all vehicles
//         const vehicleData = await ManageVehicleService.getAllVehicle();

//         // Create a cache for brand names to avoid duplicate API calls
//         const brandCache = new Map();

//         // Fetch brand names for unique brandIds
//         const uniqueBrandIds = [...new Set(vehicleData.map(item => item.brandId))];
//         await Promise.all(uniqueBrandIds.map(async (brandId) => {
//           try {
//             const brandData = await ManageBrandService.GetBrandById(brandId);
//             brandCache.set(brandId, brandData.brandName || 'Unknown');
//           } catch (error) {
//             console.error(`Failed to fetch brand ${brandId}:`, error);
//             brandCache.set(brandId, 'Unknown');
//           }
//         }));

//         // Format vehicle data with brand names
//         const formattedData = vehicleData.map(item => ({
//           id: item.vehicleId,
//           make: brandCache.get(item.brandId) || 'Unknown',
//           model: item.modelName,
//           year: item.year,
//           range: item.rangePerCharge ? parseInt(item.rangePerCharge) : 0,
//           power: item.horsepower,
//           price: item.price,
//           features: [
//             item.batteryCapacity ? `Battery: ${item.batteryCapacity}` : null,
//             item.airConditioning ? `AC: ${item.airConditioning}` : null,
//             item.speakerSystem ? `Audio: ${item.speakerSystem}` : null,
//             item.headlights ? `Headlights: ${item.headlights}` : null,
//             item.cameras ? `Cameras: ${item.cameras}` : null,
//           ].filter(Boolean),
//           color: item.color,
//           version: item.version,
//           image: item.imageUrls && item.imageUrls.length > 0 ? item.imageUrls[0] : 'https://via.placeholder.com/300',
//           onPromotion: false, // Not in API response; adjust if promotion data is available
//           fullData: {
//             ...item,
//             brand: {
//               name: brandCache.get(item.brandId) || 'Unknown',
//               country: 'No Data', // Adjust if brand data includes these fields
//               website: 'No Data',
//               founderYear: 'No Data',
//             },
//             quantityAvailable: 0, // Adjust if storage data is available
//           },
//         }));

//         setVehicles(formattedData);
//         setFilteredVehicles(formattedData);
//       } catch (error) {
//         console.error('Failed to fetch vehicles:', error);
//         toast.error('Failed to fetch vehicles');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchVehicles();
//   }, []);

//   // Derived data
//   const allBrands = useMemo(() => [...new Set(vehicles.map(v => v.make))], [vehicles]);
//   const allColors = useMemo(() => [...new Set(vehicles.map(v => v.color))], [vehicles]);
//   const allFeatures = useMemo(() => [...new Set(vehicles.flatMap(v => v.features))], [vehicles]);

//   // Statistics
//   const totalModels = useMemo(() => new Set(vehicles.map(v => `${v.make} ${v.model}`)).size, [vehicles]);
//   const onPromotion = useMemo(() => vehicles.filter(v => v.onPromotion).length, [vehicles]);
//   const avgPrice = useMemo(() => {
//     if (vehicles.length === 0) return 0;
//     return Math.round(vehicles.reduce((sum, v) => sum + v.price, 0) / vehicles.length);
//   }, [vehicles]);

//   // Filtered and sorted data
//   const processedData = useMemo(() => {
//     let data = vehicles.filter(v => {
//       if (brandFilter.length > 0 && !brandFilter.includes(v.make)) return false;
//       if (debouncedSearchText && !v.model.toLowerCase().includes(debouncedSearchText.toLowerCase())) return false;
//       if (colorFilter.length > 0 && !colorFilter.includes(v.color)) return false;
//       if (featureFilters.length > 0 && !featureFilters.every(f => v.features.includes(f))) return false;
//       if (v.price < priceRange[0] || v.price > priceRange[1]) return false;
//       return true;
//     });

//     if (sortConfig.field) {
//       data = [...data].sort((a, b) => {
//         const aVal = a[sortConfig.field];
//         const bVal = b[sortConfig.field];
//         if (sortConfig.order === 'descend') {
//           return aVal > bVal ? -1 : 1;
//         }
//         return aVal < bVal ? -1 : 1;
//       });
//     }

//     setFilteredVehicles(data);
//     return data;
//   }, [vehicles, brandFilter, debouncedSearchText, colorFilter, featureFilters, priceRange, sortConfig]);

//   // Active filters for chips
//   const activeFilters = useMemo(() => {
//     const filters = [];
//     brandFilter.forEach(b => filters.push({ type: 'brand', value: b, label: `Brand: ${b}` }));
//     if (debouncedSearchText) filters.push({ type: 'model', value: debouncedSearchText, label: `Model: ${debouncedSearchText}` });
//     colorFilter.forEach(c => filters.push({ type: 'color', value: c, label: `Color: ${c}` }));
//     featureFilters.forEach(f => filters.push({ type: 'feature', value: f, label: `Feature: ${f}` }));
//     if (priceRange[0] > 0 || priceRange[1] < 2000000000) {
//       filters.push({ type: 'price', value: priceRange, label: `Price: ${priceRange[0].toLocaleString()}-${priceRange[1].toLocaleString()} VND` });
//     }
//     return filters;
//   }, [brandFilter, debouncedSearchText, colorFilter, featureFilters, priceRange]);

//   const removeFilter = useCallback((filter) => {
//     switch (filter.type) {
//       case 'brand':
//         setBrandFilter(prev => prev.filter(b => b !== filter.value));
//         break;
//       case 'model':
//         setSearchText('');
//         break;
//       case 'color':
//         setColorFilter(prev => prev.filter(c => c !== filter.value));
//         break;
//       case 'feature':
//         setFeatureFilters(prev => prev.filter(f => f !== filter.value));
//         break;
//       case 'price':
//         setPriceRange([0, 2000000000]);
//         break;
//       default:
//         break;
//     }
//   }, []);

//   // Table columns
//   const columns = [
//     {
//       title: 'Thumbnail',
//       dataIndex: 'image',
//       render: (img) => <Image width={50} height={50} src={img} preview={false} />,
//       width: 80,
//     },
//     { title: 'Make', dataIndex: 'make', width: 100, sorter: true },
//     { title: 'Model', dataIndex: 'model', width: 120, sorter: true },
//     { title: 'Year', dataIndex: 'year', sorter: true, width: 80 },
//     { title: 'Range (km)', dataIndex: 'range', sorter: true, width: 100 },
//     { title: 'Power (hp)', dataIndex: 'power', sorter: true, width: 100 },
//     {
//       title: 'Price',
//       dataIndex: 'price',
//       render: (price) => `${price.toLocaleString()} VND`,
//       sorter: true,
//       width: 120,
//     },
//     {
//       title: 'Features',
//       dataIndex: 'features',
//       render: (features) => features.map(f => <Tag key={f}>{f}</Tag>),
//       width: 150,
//     },
//     {
//       title: 'Action',
//       key: 'action',
//       render: (_, record) => (
//         <Button
//           type="link"
//           onClick={() => {
//             setSelectedVehicle(record);
//             setIsDetailModalVisible(true);
//           }}
//           aria-label={`View details for ${record.make} ${record.model}`}
//         >
//           Detail
//         </Button>
//       ),
//       width: 100,
//     },
//   ];

//   // Row selection for comparison (up to 3)
//   const rowSelection = {
//     selectedRowKeys,
//     onChange: (keys, rows) => {
//       setSelectedRowKeys(keys);
//       setSelectedVehicles(rows);
//     },
//     getCheckboxProps: (record) => ({
//       disabled: selectedRowKeys.length >= 3 && !selectedRowKeys.includes(record.id),
//     }),
//   };

//   // Table change handler for sorting
//   const handleTableChange = useCallback((pagination, filters, sorter) => {
//     setSortConfig(sorter);
//     setCurrentPage(pagination.current);
//   }, []);

//   // Export CSV
//   const exportCSV = useCallback(() => {
//     const headers = ['Make', 'Model', 'Year', 'Range', 'Power', 'Price', 'Features'];
//     const csvContent = [
//       headers.join(','),
//       ...processedData.map(v => [
//         v.make,
//         v.model,
//         v.year,
//         v.range,
//         v.power,
//         v.price,
//         v.features.join(';'),
//       ].join(',')),
//     ].join('\n');
//     const blob = new Blob([csvContent], { type: 'text/csv' });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement('a');
//     link.href = url;
//     link.download = 'vehicles.csv';
//     link.click();
//     URL.revokeObjectURL(url);
//   }, [processedData]);

//   // Upload simulation
//   const uploadProps = {
//     beforeUpload: (file) => {
//       console.log('Simulating upload of new vehicle:', file.name);
//       return false;
//     },
//     accept: '.csv,.json',
//     showUploadList: true,
//   };

//   // Comparison modal content (side-by-side)
//   const compareContent = selectedVehicles.map((vehicle) => (
//     <Col key={vehicle.id} xs={24} md={8}>
//       <Card
//         title={`${vehicle.make} ${vehicle.model}`}
//         hoverable
//         style={{ height: '100%' }}
//       >
//         <Image src={vehicle.image} width="100%" height={150} preview={false} />
//         <p><strong>Year:</strong> {vehicle.year}</p>
//         <p><strong>Range:</strong> {vehicle.range} km</p>
//         <p><strong>Power:</strong> {vehicle.power} hp</p>
//         <p><strong>Price:</strong> {vehicle.price.toLocaleString()} VND</p>
//         <p><strong>Features:</strong> {vehicle.features.slice(0, 3).join(', ')}</p>
//       </Card>
//     </Col>
//   ));

//   // Calculate pagination details
//   const totalVehicles = filteredVehicles.length;
//   const startIndex = (currentPage - 1) * pageSize + 1;
//   const endIndex = Math.min(currentPage * pageSize, totalVehicles);

//   return (
//     <div className="ev-dashboard" role="main" aria-label="Vehicle Management Dashboard">
//       {/* Statistics at top */}
//       <Row gutter={16} className="stats-row">
//         <Col span={8}>
//           <Statistic title="Total Models" value={totalModels} />
//         </Col>
//         <Col span={8}>
//           <Statistic title="Vehicles on Promotion" value={onPromotion} />
//         </Col>
//         <Col span={8}>
//           <Statistic title="Average Price" value={avgPrice} prefix="VND " />
//         </Col>
//       </Row>

//       <Row gutter={16}>
//         <Col xs={24} lg={24}>
//           <Card title="Vehicle Catalog" className="main-card">
//             {/* Global Search */}
//             <Search
//               placeholder="Search by model name"
//               value={searchText}
//               onChange={(e) => setSearchText(e.target.value)}
//               enterButton
//               allowClear
//               aria-label="Search vehicles"
//               style={{ marginBottom: 16 }}
//             />

//             {/* Filters */}
//             <div className="filters" role="region" aria-label="Filters">
//               <Select
//                 mode="multiple"
//                 placeholder="Select brands"
//                 value={brandFilter}
//                 onChange={setBrandFilter}
//                 style={{ width: 200 }}
//                 aria-label="Brand filter"
//               >
//                 {allBrands.map(brand => <Option key={brand}>{brand}</Option>)}
//               </Select>
//               <Select
//                 mode="multiple"
//                 placeholder="Select colors"
//                 value={colorFilter}
//                 onChange={setColorFilter}
//                 style={{ width: 150 }}
//                 aria-label="Color filter"
//               >
//                 {allColors.map(color => <Option key={color}>{color}</Option>)}
//               </Select>
//               <Checkbox.Group
//                 options={allFeatures.map(f => ({ label: f, value: f }))}
//                 value={featureFilters}
//                 onChange={setFeatureFilters}
//                 aria-label="Feature filters"
//               />
//               <Slider
//                 range
//                 value={priceRange}
//                 min={0}
//                 max={2000000000}
//                 onChange={setPriceRange}
//                 tipFormatter={(v) => `${v.toLocaleString()} VND`}
//                 aria-label="Price range filter"
//                 style={{ width: 200 }}
//               />
//             </div>

//             {/* Active Filters Chips */}
//             <div className="filter-chips" role="region" aria-label="Active filters">
//               {activeFilters.map((filter, index) => (
//                 <Tag
//                   key={`${filter.type}-${filter.value}-${index}`}
//                   closable
//                   onClose={() => removeFilter(filter)}
//                   aria-label={`Remove filter ${filter.label}`}
//                 >
//                   {filter.label}
//                 </Tag>
//               ))}
//             </div>

//             {/* Pagination Summary and Table */}
//             <Row style={{ marginBottom: 16 }}>
//               <Col>
//                 <Text>
//                   Showing {startIndex} to {endIndex} of {totalVehicles} vehicles
//                 </Text>
//               </Col>
//             </Row>
//             <Table
//               rowSelection={rowSelection}
//               columns={columns}
//               dataSource={processedData}
//               onChange={handleTableChange}
//               pagination={{
//                 pageSize: pageSize,
//                 current: currentPage,
//                 total: totalVehicles,
//                 showSizeChanger: false,
//                 style: { margin: 0 },
//               }}
//               rowKey="id"
//               bordered
//               loading={loading}
//               aria-label="Vehicles table"
//             />

//             {/* Actions */}
//             <div className="actions" role="toolbar" aria-label="Table actions">
//               <Button icon={<DownloadOutlined />} onClick={exportCSV} aria-label="Export visible list to CSV">
//                 Export CSV
//               </Button>
//               <Upload {...uploadProps}>
//                 <Button icon={<UploadOutlined />} aria-label="Upload new vehicle data">
//                   Upload New Vehicle
//                 </Button>
//               </Upload>
//               <Button
//                 type="primary"
//                 onClick={() => setIsCompareModalVisible(true)}
//                 disabled={selectedRowKeys.length === 0 || selectedRowKeys.length > 3}
//                 aria-label={`Compare ${selectedRowKeys.length} selected vehicles`}
//               >
//                 Compare ({selectedRowKeys.length}/3)
//               </Button>
//             </div>
//           </Card>
//         </Col>
//       </Row>

//       {/* Detail Modal */}
//       <Modal
//         title="Vehicle Details"
//         open={isDetailModalVisible}
//         onCancel={() => setIsDetailModalVisible(false)}
//         footer={null}
//         width="80%"
//         centered
//         aria-label="Vehicle details modal"
//       >
//         {selectedVehicle && (
//           <VehicleDetailModal
//             vehicle={selectedVehicle}
//             onClose={() => setIsDetailModalVisible(false)}
//           />
//         )}
//       </Modal>

//       {/* Compare Modal */}
//       <Modal
//         title="Vehicle Comparison"
//         open={isCompareModalVisible}
//         onCancel={() => setIsCompareModalVisible(false)}
//         footer={[
//           <Button key="close" onClick={() => setIsCompareModalVisible(false)}>
//             Close
//           </Button>,
//         ]}
//         width="90%"
//         aria-label="Vehicle comparison modal"
//       >
//         <Row gutter={16}>
//           {compareContent}
//         </Row>
//       </Modal>
//     </div>
//   );
// };

// export default ManageVehicle;

//---------------------------------------------------------------------------------------------------------//

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Table, Card, Statistic, Button, Input, Select, Checkbox, Upload, Slider, Row, Col, Tag, Image, Modal, Typography } from 'antd';
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import '../../../styles/dealerStaffManager/ManageVehicle.scss';
import ManageVehicleService from '../../../services/ManageVehicleService/ManageVehicleService';
import { toast } from 'react-toastify';
import VehicleDetailModal from './VehicleDetailModal';

const { Search } = Input;
const { Option } = Select;
const { Text } = Typography;

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

const ManageVehicle = () => {
  // States
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedVehicles, setSelectedVehicles] = useState([]);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isCompareModalVisible, setIsCompareModalVisible] = useState(false);
  const [sortConfig, setSortConfig] = useState({ field: null, order: null });
  const [searchText, setSearchText] = useState('');
  const debouncedSearchText = useDebounce(searchText, 300);
  const [brandFilter, setBrandFilter] = useState([]);
  const [colorFilter, setColorFilter] = useState([]);
  const [featureFilters, setFeatureFilters] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 2000000000]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [brandsData, setBrandsData] = useState([]);
  const [storagesData, setStoragesData] = useState([]);

  // Fetch vehicles, brands, and storages
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [vehicleData, brands, storages] = await Promise.all([
          ManageVehicleService.getAllVehicle(),
          ManageVehicleService.getAllBrands(),
          ManageVehicleService.getAllStorages(),
        ]);

        setBrandsData(brands);
        setStoragesData(storages);

        // Format vehicle data
        const formattedData = vehicleData.map(item => {
          const brand = brands.find(b => b.brandId === item.brandId) || {};
          const storage = storages.find(s => s.vehicleId === item.vehicleId) || { quantityAvailable: 0 };

          return {
            id: item.vehicleId,
            make: brand.brandName || 'Unknown',
            model: item.modelName,
            year: item.year,
            range: item.rangePerCharge ? parseInt(item.rangePerCharge) : 0,
            power: item.horsepower,
            price: item.price,
            quantityAvailable: storage.quantityAvailable || 0,
            features: [
              item.batteryCapacity ? `Battery: ${item.batteryCapacity}` : null,
              item.airConditioning ? `AC: ${item.airConditioning}` : null,
              item.speakerSystem ? `Audio: ${item.speakerSystem}` : null,
              item.headlights ? `Headlights: ${item.headlights}` : null,
              item.cameras ? `Cameras: ${item.cameras}` : null,
            ].filter(Boolean),
            color: item.color,
            version: item.version,
            image: item.imageUrls && item.imageUrls.length > 0 ? item.imageUrls[0] : 'https://via.placeholder.com/300',
            onPromotion: false,
            fullData: {
              ...item,
              brandId: item.brandId,
            },
          };
        });

        setVehicles(formattedData);
        setFilteredVehicles(formattedData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        toast.error('Failed to fetch vehicles or related data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Derived data
  const allBrands = useMemo(() => [...new Set(vehicles.map(v => v.make))], [vehicles]);
  const allColors = useMemo(() => [...new Set(vehicles.map(v => v.color))], [vehicles]);
  const allFeatures = useMemo(() => [...new Set(vehicles.flatMap(v => v.features))], [vehicles]);

  // Statistics
  const totalModels = useMemo(() => new Set(vehicles.map(v => `${v.make} ${v.model}`)).size, [vehicles]);
  const onPromotion = useMemo(() => vehicles.filter(v => v.onPromotion).length, [vehicles]);
  const avgPrice = useMemo(() => {
    if (vehicles.length === 0) return 0;
    return Math.round(vehicles.reduce((sum, v) => sum + v.price, 0) / vehicles.length);
  }, [vehicles]);

  // Filtered and sorted data
  const processedData = useMemo(() => {
    let data = vehicles.filter(v => {
      if (brandFilter.length > 0 && !brandFilter.includes(v.make)) return false;
      if (debouncedSearchText && !v.model.toLowerCase().includes(debouncedSearchText.toLowerCase())) return false;
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

    setFilteredVehicles(data);
    return data;
  }, [vehicles, brandFilter, debouncedSearchText, colorFilter, featureFilters, priceRange, sortConfig]);

  // Active filters for chips
  const activeFilters = useMemo(() => {
    const filters = [];
    brandFilter.forEach(b => filters.push({ type: 'brand', value: b, label: `Brand: ${b}` }));
    if (debouncedSearchText) filters.push({ type: 'model', value: debouncedSearchText, label: `Model: ${debouncedSearchText}` });
    colorFilter.forEach(c => filters.push({ type: 'color', value: c, label: `Color: ${c}` }));
    featureFilters.forEach(f => filters.push({ type: 'feature', value: f, label: `Feature: ${f}` }));
    if (priceRange[0] > 0 || priceRange[1] < 2000000000) {
      filters.push({ type: 'price', value: priceRange, label: `Price: ${priceRange[0].toLocaleString()}-${priceRange[1].toLocaleString()} VND` });
    }
    return filters;
  }, [brandFilter, debouncedSearchText, colorFilter, featureFilters, priceRange]);

  const removeFilter = useCallback((filter) => {
    switch (filter.type) {
      case 'brand':
        setBrandFilter(prev => prev.filter(b => b !== filter.value));
        break;
      case 'model':
        setSearchText('');
        break;
      case 'color':
        setColorFilter(prev => prev.filter(c => c !== filter.value));
        break;
      case 'feature':
        setFeatureFilters(prev => prev.filter(f => f !== filter.value));
        break;
      case 'price':
        setPriceRange([0, 2000000000]);
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
        const stockType = quantity > 1 ? 'available' : quantity === 1 ? 'limited' : 'out-of-stock';
        return (
          <Tag color={stockType === 'available' ? 'green' : stockType === 'limited' ? 'orange' : 'red'}>
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
          type="link"
          onClick={() => {
            setSelectedVehicle(record);
            setIsDetailModalVisible(true);
          }}
          aria-label={`View details for ${record.make} ${record.model}`}
        >
          Detail
        </Button>
      ),
      width: 100,
    },
  ];

  // Row selection for comparison
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

  // Table change handler for sorting
  const handleTableChange = useCallback((pagination, filters, sorter) => {
    setSortConfig(sorter);
    setCurrentPage(pagination.current);
  }, []);

  // Export CSV
  const exportCSV = useCallback(() => {
    const headers = ['Brand', 'Model', 'Year', 'Range per Charge', 'Power', 'Price', 'Quantity', 'Features'];
    const csvContent = [
      headers.join(','),
      ...processedData.map(v => [
        v.make,
        v.model,
        v.year,
        v.range,
        v.power,
        v.price,
        v.quantityAvailable,
        v.features.join(';'),
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

  // Upload simulation
  const uploadProps = {
    beforeUpload: (file) => {
      console.log('Simulating upload of new vehicle:', file.name);
      return false;
    },
    accept: '.csv,.json',
    showUploadList: true,
  };

  // Comparison modal content
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
        <p><strong>Power:</strong> {vehicle.power} hp</p>
        <p><strong>Price:</strong> {vehicle.price.toLocaleString()} VND</p>
        <p><strong>Quantity:</strong> {vehicle.quantityAvailable} Available</p>
        <p><strong>Features:</strong> {vehicle.features.slice(0, 3).join(', ')}</p>
      </Card>
    </Col>
  ));

  // Calculate pagination details
  const totalVehicles = filteredVehicles.length;
  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, totalVehicles);

  return (
    <div className="ev-dashboard" role="main" aria-label="Vehicle Management Dashboard">
      {/* Statistics at top */}
      <Row gutter={16} className="stats-row">
        <Col span={8}>
          <Statistic title="Total Models" value={totalModels} />
        </Col>
        <Col span={8}>
          <Statistic title="Vehicles on Promotion" value={onPromotion} />
        </Col>
        <Col span={8}>
          <Statistic title="Average Price" value={avgPrice} prefix="VND " />
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} lg={24}>
          <Card title="Vehicle Catalog" className="main-card">
            {/* Global Search */}
            <Search
              placeholder="Search by model name"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
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
                max={2000000000}
                onChange={setPriceRange}
                tipFormatter={(v) => `${v.toLocaleString()} VND`}
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

            {/* Pagination Summary and Table */}
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
              pagination={{
                pageSize: pageSize,
                current: currentPage,
                total: totalVehicles,
                showSizeChanger: false,
                style: { margin: 0 },
              }}
              rowKey="id"
              bordered
              loading={loading}
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
      </Row>

      {/* Detail Modal */}
      <Modal
        title="Vehicle Details"
        open={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        footer={null}
        width="80%"
        centered
        aria-label="Vehicle details modal"
      >
        {selectedVehicle && (
          <VehicleDetailModal
            vehicle={selectedVehicle}
            brandsData={brandsData}
            storagesData={storagesData}
            onClose={() => setIsDetailModalVisible(false)}
          />
        )}
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
        <Row gutter={16}>{compareContent}</Row>
      </Modal>
    </div>
  );
};

export default ManageVehicle;