// import React from 'react';
// import { Container, Row, Col } from 'react-bootstrap'
// import '../../../styles/HomePage.scss';
// import Sidebar from '../../../components/sidebar/Sidebar';
// import SearchBar from './SearchBar';
// import FilterBar from './FilterBar';
// import VehicleCard from './VehicleCard';

// const HomePage = () => {
//   const vehicles = [
//     {
//       id: 1,
//       image: 'https://vinfastauto.us/themes/custom/vinfast_v2/images/v3/vf-9/exterior-color-red.webp',
//       title: 'Tesla Model S',
//       specs: {
//         range: '405 miles',
//         acceleration: '3.1s',
//         category: 'Luxury Sedan'
//       },
//       price: '$89,900',
//       stock: '5 Available',
//       stockType: 'available'
//     },
//     {
//       id: 2,
//       image: 'https://s1.cdn.autoevolution.com/images/gallery/vinfast-vf-9-2022-7300_1.jpg',
//       title: 'BMW iX',
//       specs: {
//         range: '324 miles',
//         acceleration: '4.6s',
//         category: 'Luxury SUV'
//       },
//       price: '$83,200',
//       stock: '3 Available',
//       stockType: 'available'
//     },
//     {
//       id: 3,
//       image: 'https://tse3.mm.bing.net/th/id/OIP.8tjx039IiQN9y342QEvYHAHaE8?w=1200&h=800&rs=1&pid=ImgDetMain&o=7&rm=3',
//       title: 'Audi e-tron GT',
//       specs: {
//         range: '238 miles',
//         acceleration: '3.9s',
//         category: 'Sports Car'
//       },
//       price: '$102,400',
//       stock: '1 Available',
//       stockType: 'limited'
//     }
//   ];

//   return (
//     <div className="min-h-screen eco-bg">
//       <Container fluid className="eco-container">
//         <Row className="g-0">
//           {/* Sidebar */}
//           <Col md={2} className="p-0">
//             <Sidebar
//               menuItems={[
//                 'Vehicle Catalog',
//                 'Customers',
//                 'Sales & Quotes',
//                 'Products',
//                 'Orders & Delivery',
//                 'Test Drives',
//                 'Reports',
//                 'Settings'
//               ]}
//               activeItem="Products"
//             />
//           </Col>

//           {/* Main Content */}
//           <Col md={10} className="p-4">
//             <div className="main-content">
//               <SearchBar placeholder="Search vehicles, customers, or orders..." />
//               <div className="page-header">
//                 <h1 className="eco-title">Electric Vehicle Rental Catalog</h1>
//                 <p className="eco-subtitle">
//                   Browse and manage your eco-friendly EV rental inventory with detailed specifications and pricing
//                 </p>
//               </div>
//               <FilterBar />

//               {/* Vehicle Grid - Fixed layout */}
//               <Row className="vehicle-grid g-3">
//                 {vehicles.map((vehicle) => (
//                   <Col xl={4} lg={4} md={6} sm={12} key={vehicle.id}>
//                     <VehicleCard vehicle={vehicle} />
//                   </Col>
//                 ))}
//               </Row>
//             </div>
//           </Col>
//         </Row>
//       </Container>
//     </div>
//   );
// };

// export default HomePage;

// src/pages/user/HomePage/HomePage.jsx (updated - remove detail modal and onShowDetail)
// import React, { useState, useEffect } from 'react';
// import { Container, Row, Col, Modal, Table, Card, Badge, Button } from 'react-bootstrap';
// import '../../../styles/HomePage.scss';
// import SearchBar from './SearchBar';
// import FilterBar from './FilterBar';
// import VehicleCard from './VehicleCard';
// import ManageHomePageService from '../../../services/ManageHomePageService/ManageHomePageService'; // Service cho HomePage

// const HomePage = () => {
//   const [selectedVehicles, setSelectedVehicles] = useState([]);
//   const [showCompareModal, setShowCompareModal] = useState(false);
//   const [vehicles, setVehicles] = useState([]); // State cho vehicles từ API
//   const [loading, setLoading] = useState(false); // Loading state

//   // Fetch data khi component mount
//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         // Fetch all vehicles, brands, storages parallel từ service duy nhất
//         const [vehiclesData, brandsData, storagesData] = await Promise.all([
//           ManageHomePageService.getAllVehicles(),
//           ManageHomePageService.getAllBrands(),
//           ManageHomePageService.getAllStorages()
//         ]);

//         // Map vehicles với brand và storage info
//         const formattedVehicles = vehiclesData.map(vehicle => {
//           const brand = brandsData.find(b => b.brandId === vehicle.brandId) || {};
//           const storage = storagesData.find(s => s.vehicleId === vehicle.vehicleId) || { quantityAvailable: 0 };

//           const quantity = storage.quantityAvailable || 0;
//           let stockType = 'out-of-stock';
//           let stockText = `${quantity} Available`;
//           if (quantity > 1) {
//             stockType = 'available';
//           } else if (quantity === 1) {
//             stockType = 'limited';
//           }

//           const brandName = brand.brandName || 'Unknown';
//           const title = vehicle.modelName.startsWith(brandName) ? vehicle.modelName : `${brandName} ${vehicle.modelName}`;

//           // Format specs cho VehicleCard (thay đổi labels và fields)
//           const specs = {
//             range: `${vehicle.rangePerCharge}`, // e.g., "650 km"
//             version: vehicle.version, // Thay thế acceleration
//             brand: brandName,
//             color: vehicle.color,
//             battery: vehicle.batteryCapacity,
//             topSpeed: 'N/A',
//             seating: 'N/A',
//             price: `$${vehicle.price.toLocaleString()}`
//           };

//           // Title và description
//           const description = `The ${vehicle.modelName} ${vehicle.version} offers premium electric performance with a ${vehicle.color} finish.`;

//           // Slug generate đơn giản
//           const slug = `${brandName?.toLowerCase().replace(/\s+/g, '-') || 'unknown'}-${vehicle.modelName.toLowerCase().replace(/\s+/g, '-')}`;

//           // Images: Hardcode sample, có thể thay bằng API nếu có
//           const images = [
//             'https://vinfastauto.us/themes/custom/vinfast_v2/images/v3/vf-9/exterior-color-red.webp',
//             'https://www.tesla.com/sites/default/files/images/model-s/model-s-hero@2x.jpg',
//             'https://www.tesla.com/sites/default/files/images/model-s/model-s-interior@2x.jpg'
//           ];

//           return {
//             id: vehicle.vehicleId,
//             slug,
//             images,
//             title,
//             specs,
//             stock: stockText,
//             stockType,
//             description,
//             // Extra data cho detail page (nếu cần)
//             fullData: {
//               ...vehicle,
//               brand: {
//                 name: brandName,
//                 country: brand.country,
//                 website: brand.website,
//                 founderYear: brand.founderYear
//               },
//               quantityAvailable: quantity
//             }
//           };
//         });

//         setVehicles(formattedVehicles);
//       } catch (error) {
//         console.error('Failed to fetch data:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   const handleToggleCompare = (vehicleId) => {
//     setSelectedVehicles(prev => {
//       const isSelected = prev.some(v => v.id === vehicleId);
//       let updated;
//       if (isSelected) {
//         updated = prev.filter(v => v.id !== vehicleId);
//         setShowCompareModal(false);
//       } else if (prev.length < 2) {
//         const vehicle = vehicles.find(v => v.id === vehicleId);
//         updated = [...prev, vehicle];
//         if (updated.length === 2) {
//           setShowCompareModal(true);
//         }
//       } else {
//         return prev;
//       }
//       return updated;
//     });
//   };

//   const clearSelection = () => {
//     setSelectedVehicles([]);
//     setShowCompareModal(false);
//   };

//   const getWinner = (key) => {
//     if (selectedVehicles.length < 2) return null;
//     const values = selectedVehicles.map(v => v.specs[key]);
//     const parsedValues = values.map(val => {
//       let num = NaN;
//       if (key === 'price') {
//         num = parseFloat(val.replace(/[$,]/g, ''));
//       } else if (['range', 'battery'].includes(key)) {
//         num = parseFloat(val.replace(/[^0-9.]/g, ''));
//       } else if (key === 'seating') {
//         num = parseInt(val.replace(/[^0-9]/g, ''));
//       }
//       // For strings like version, brand, color: NaN -> null
//       return isNaN(num) ? null : num;
//     });

//     const validValues = parsedValues.filter(v => v !== null);
//     if (validValues.length < 2) return null; // Can't compare if not enough numeric values

//     let bestIndex;
//     if (key === 'price') {
//       const min = Math.min(...validValues);
//       bestIndex = parsedValues.indexOf(min);
//     } else {
//       const max = Math.max(...validValues);
//       bestIndex = parsedValues.indexOf(max);
//     }
//     return bestIndex;
//   };

//   const specsKeys = ['brand', 'version', 'color', 'battery', 'range', 'topSpeed', 'seating', 'price'];

//   return (
//     <div className="min-h-screen eco-bg">
//       <Container fluid className="eco-container">
//         <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '2rem 3rem' }}>
//           <div className="main-content">
//             <div className="page-header">
//               <h1 className="eco-title">Electric Vehicle Catalog</h1>
//               <p className="eco-subtitle">
//                 Browse and manage your eco-friendly EV inventory with detailed specifications and pricing
//               </p>
//             </div>
//             <FilterBar />

//             {/* Vehicle Grid - Fixed layout */}
//             <Row className="vehicle-grid g-3">
//               {loading ? (
//                 <Col xs={12} className="text-center">
//                   <p>Loading vehicles...</p>
//                 </Col>
//               ) : (
//                 vehicles.map((vehicle) => (
//                   <Col xl={4} lg={4} md={6} sm={12} key={vehicle.id}>
//                     <VehicleCard
//                       vehicle={vehicle}
//                       selectedVehicles={selectedVehicles}
//                       selectedCount={selectedVehicles.length}
//                       onToggleCompare={handleToggleCompare}
//                     />
//                   </Col>
//                 ))
//               )}
//             </Row>
//           </div>
//         </div>
//       </Container>

//       {/* Compare Modal */}
//       <Modal show={showCompareModal} onHide={clearSelection} size="xl" centered className="compare-modal">
//         <Modal.Header closeButton className="eco-modal-header">
//           <Modal.Title>Vehicle Comparison</Modal.Title>
//         </Modal.Header>
//         <Modal.Body className="p-0">
//           <Row className="g-3 mb-3">
//             {selectedVehicles.map((vehicle, index) => (
//               <Col md={6} key={vehicle.id}>
//                 <Card className={`compare-card eco-card ${index === 0 ? 'left' : 'right'}`}>
//                   <Card.Img variant="top" src={vehicle.images[0]} className="compare-card-img" />
//                   <Card.Body>
//                     <Card.Title className="eco-card-title">{vehicle.title}</Card.Title>
//                     <Card.Text className="eco-price">{vehicle.specs.price}</Card.Text>
//                     <Badge className={`mb-2 stock-badge ${vehicle.stockType}`}>
//                       {vehicle.stock}
//                     </Badge>
//                   </Card.Body>
//                 </Card>
//               </Col>
//             ))}
//           </Row>
//           <Table responsive className="compare-table">
//             <thead>
//               <tr>
//                 <th>Specification</th>
//                 {selectedVehicles.map((vehicle) => (
//                   <th key={vehicle.id} className="text-center">
//                     {vehicle.title}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {specsKeys.map((key) => {
//                 const winnerIndex = getWinner(key);
//                 return (
//                   <tr key={key}>
//                     <td><strong>{key.charAt(0).toUpperCase() + key.slice(1)}</strong></td>
//                     {selectedVehicles.map((vehicle, index) => (
//                       <td key={vehicle.id} className={`text-center ${winnerIndex === index ? 'winner-cell' : ''}`}>
//                         {vehicle.specs[key]}
//                       </td>
//                     ))}
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </Table>
//         </Modal.Body>
//         <Modal.Footer className="eco-modal-footer">
//           <Button variant="outline-eco" onClick={clearSelection}>
//             Clear Selection
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// };

// export default HomePage;

//--------------------------------------------------------------------------//

// src/pages/user/HomePage/HomePage.jsx (updated: VND currency, first API image, connected search and filters, enhanced compare with Overview specs)
// import React, { useState, useEffect } from 'react';
// import { Container, Row, Col, Modal, Table, Card, Badge, Button } from 'react-bootstrap';
// import '../../../styles/HomePage.scss';
// import FilterBar from './FilterBar';
// import VehicleCard from './VehicleCard';
// import ManageHomePageService from '../../../services/ManageHomePageService/ManageHomePageService'; // Service cho HomePage

// const HomePage = () => {
//   const [selectedVehicles, setSelectedVehicles] = useState([]);
//   const [showCompareModal, setShowCompareModal] = useState(false);
//   const [allVehicles, setAllVehicles] = useState([]); // All raw data from API
//   const [vehicles, setVehicles] = useState([]); // Filtered vehicles
//   const [loading, setLoading] = useState(false); // Loading state
//   const [searchTerm, setSearchTerm] = useState(''); // Search state
//   const [carTypeFilter, setCarTypeFilter] = useState('All'); // Car Type filter
//   const [brandFilter, setBrandFilter] = useState('All'); // Brand filter

//   // Fetch data khi component mount
//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         // Fetch all vehicles, brands, storages parallel từ service duy nhất
//         const [vehiclesData, brandsData, storagesData] = await Promise.all([
//           ManageHomePageService.getAllVehicles(),
//           ManageHomePageService.getAllBrands(),
//           ManageHomePageService.getAllStorages()
//         ]);

//         // Map vehicles với brand và storage info
//         const formattedVehicles = vehiclesData.map(vehicle => {
//           const brand = brandsData.find(b => b.brandId === vehicle.brandId) || {};
//           const storage = storagesData.find(s => s.vehicleId === vehicle.vehicleId) || { quantityAvailable: 0 };

//           const quantity = storage.quantityAvailable || 0;
//           let stockType = 'out-of-stock';
//           let stockText = `${quantity} Available`;
//           if (quantity > 1) {
//             stockType = 'available';
//           } else if (quantity === 1) {
//             stockType = 'limited';
//           }

//           const brandName = brand.brandName || 'Unknown';
//           const title = vehicle.modelName.startsWith(brandName) ? vehicle.modelName : `${brandName} ${vehicle.modelName}`;

//           // Format specs cho VehicleCard (thay đổi labels và fields)
//           const specs = {
//             range: `${vehicle.rangePerCharge}`, // e.g., "650 km"
//             version: vehicle.version, // Thay thế acceleration
//             brand: brandName,
//             color: vehicle.color,
//             battery: vehicle.batteryCapacity,
//             topSpeed: 'N/A',
//             seating: 'N/A',
//             price: `${vehicle.price.toLocaleString()} VND` // Changed to VND
//           };

//           // Title và description
//           const description = `The ${vehicle.modelName} ${vehicle.version} offers premium electric performance with a ${vehicle.color} finish.`;

//           // Slug generate đơn giản
//           const slug = `${brandName?.toLowerCase().replace(/\s+/g, '-') || 'unknown'}-${vehicle.modelName.toLowerCase().replace(/\s+/g, '-')}`;

//           // Images: Use first from API imageUrls
//           const imageUrls = vehicle.imageUrls || [];
//           const images = imageUrls.length > 0 ? imageUrls : [
//             'https://vinfast-vn.vn/wp-content/uploads/2023/10/vinfast-vf8-1-1.png'
//           ];

//           // Overview specs like in DetailPage
//           const getValueOrNoData = (val) => val || 'No Data';
//           const overviewSpecs = {
//             'Vehicle Type': getValueOrNoData(vehicle.vehicleType),
//             'Range per Charge': getValueOrNoData(vehicle.rangePerCharge),
//             'Battery Capacity': getValueOrNoData(vehicle.batteryCapacity),
//             'Horsepower': `${getValueOrNoData(vehicle.horsepower)} HP`,
//             'Transmission': getValueOrNoData(vehicle.transmission),
//             'Seating Capacity': `${getValueOrNoData(vehicle.seatingCapacity)} Seats`,
//             'Airbags': `${getValueOrNoData(vehicle.airbags)}`,
//             'Warranty': getValueOrNoData(vehicle.warrantyPeriod),
//             'Daily Driving Limit': `${getValueOrNoData(vehicle.dailyDrivingLimit)} km`,
//             'Trunk Capacity': `${getValueOrNoData(vehicle.trunkCapacity)} L`,
//             'Version': getValueOrNoData(vehicle.version),
//             'Year': getValueOrNoData(vehicle.year),
//             'Color': getValueOrNoData(vehicle.color)
//           };

//           return {
//             id: vehicle.vehicleId,
//             slug,
//             images,
//             title,
//             specs,
//             overviewSpecs, // For compare
//             stock: stockText,
//             stockType,
//             description,
//             vehicleType: vehicle.vehicleType || 'Unknown', // For Car Type filter
//             brandName, // For Brand filter
//             // Extra data cho detail page (nếu cần)
//             fullData: {
//               ...vehicle,
//               brand: {
//                 name: brandName,
//                 country: brand.country,
//                 website: brand.website,
//                 founderYear: brand.founderYear
//               },
//               quantityAvailable: quantity
//             }
//           };
//         });

//         setAllVehicles(formattedVehicles);
//         setVehicles(formattedVehicles); // Initial set
//       } catch (error) {
//         console.error('Failed to fetch data:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   // Filter vehicles based on search, car type, and brand
//   useEffect(() => {
//     let filtered = [...allVehicles];

//     // Search filter: case-insensitive match on title or modelName
//     if (searchTerm.trim()) {
//       const lowerSearch = searchTerm.toLowerCase().trim();
//       filtered = filtered.filter(vehicle =>
//         vehicle.title.toLowerCase().includes(lowerSearch) ||
//         vehicle.fullData.modelName.toLowerCase().includes(lowerSearch)
//       );
//     }

//     // Car Type filter
//     if (carTypeFilter !== 'All') {
//       filtered = filtered.filter(vehicle => vehicle.vehicleType === carTypeFilter);
//     }

//     // Brand filter
//     if (brandFilter !== 'All') {
//       filtered = filtered.filter(vehicle => vehicle.brandName === brandFilter);
//     }

//     setVehicles(filtered);
//   }, [searchTerm, carTypeFilter, brandFilter, allVehicles]);

//   const handleSearch = (term) => {
//     setSearchTerm(term);
//   };

//   const handleCarTypeChange = (type) => {
//     setCarTypeFilter(type);
//   };

//   const handleBrandChange = (brand) => {
//     setBrandFilter(brand);
//   };

//   const handleToggleCompare = (vehicleId) => {
//     setSelectedVehicles(prev => {
//       const isSelected = prev.some(v => v.id === vehicleId);
//       let updated;
//       if (isSelected) {
//         updated = prev.filter(v => v.id !== vehicleId);
//         setShowCompareModal(false);
//       } else if (prev.length < 2) {
//         const vehicle = allVehicles.find(v => v.id === vehicleId); // Use allVehicles to ensure full data
//         updated = [...prev, vehicle];
//         if (updated.length === 2) {
//           setShowCompareModal(true);
//         }
//       } else {
//         return prev;
//       }
//       return updated;
//     });
//   };

//   const clearSelection = () => {
//     setSelectedVehicles([]);
//     setShowCompareModal(false);
//   };

//   // Enhanced getWinner for Overview specs
//   const getWinner = (key) => {
//     if (selectedVehicles.length !== 2) return null; // Only compare when exactly 2 vehicles are selected

//     const values = selectedVehicles.map(v => v.overviewSpecs[key]);

//     // Skip comparison for subjective or non-comparable fields
//     const nonComparableFields = ['Vehicle Type', 'Version', 'Color'];
//     if (nonComparableFields.includes(key)) return null;

//     // Handle Warranty separately (e.g., parse "3 years" to 3)
//     if (key === 'Warranty') {
//       const parsedValues = values.map(val => {
//         if (typeof val !== 'string' || val === 'No Data') return null;
//         const match = val.match(/(\d+)/); // Extract number of years
//         return match ? parseInt(match[1], 10) : null;
//       });

//       const validValues = parsedValues.filter(v => v !== null);
//       if (validValues.length < 2) return null;

//       const [val1, val2] = validValues;
//       if (val1 === val2) return null; // Tie
//       return val1 > val2 ? 0 : 1; // Higher warranty duration wins
//     }

//     // Handle Transmission (e.g., prefer 'Automatic' over 'Manual')
//     if (key === 'Transmission') {
//       const validValues = values.filter(v => typeof v === 'string' && v !== 'No Data');
//       if (validValues.length < 2) return null;
//       const [val1, val2] = validValues;
//       if (val1 === val2) return null; // Tie
//       // Arbitrary preference: Automatic > Manual
//       const preference = { 'Automatic': 2, 'Manual': 1 };
//       const score1 = preference[val1] || 0;
//       const score2 = preference[val2] || 0;
//       if (score1 === score2) return null;
//       return score1 > score2 ? 0 : 1;
//     }

//     // Handle numeric fields
//     const numericFields = [
//       'Range per Charge',
//       'Battery Capacity',
//       'Horsepower',
//       'Seating Capacity',
//       'Airbags',
//       'Daily Driving Limit',
//       'Trunk Capacity',
//       'Year',
//       'Price'
//     ];

//     if (numericFields.includes(key)) {
//       const parsedValues = values.map(val => {
//         if (typeof val !== 'string' || val === 'No Data') return null;
//         let cleanVal = val;
//         if (key === 'Price') {
//           cleanVal = val.replace(/[$, VND]/g, ''); // Remove currency symbols
//         } else {
//           cleanVal = val.replace(/[^0-9.]/g, ''); // Remove non-numeric chars (e.g., 'km', 'HP')
//         }
//         const num = parseFloat(cleanVal);
//         return isNaN(num) ? null : num;
//       });

//       const validValues = parsedValues.filter(v => v !== null);
//       if (validValues.length < 2) return null;

//       const [val1, val2] = validValues;
//       if (val1 === val2) return null; // Tie

//       // Lower is better for Price, higher for others
//       if (key === 'Price') {
//         return val1 < val2 ? 0 : 1;
//       }
//       return val1 > val2 ? 0 : 1;
//     }

//     return null; // Default for unhandled fields
//   };

//   // Overview specs keys for compare table
//   const overviewKeys = Object.keys(allVehicles[0]?.overviewSpecs || {});

//   return (
//     <div className="min-h-screen eco-bg">
//       <Container fluid className="eco-container">
//         <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '2rem 3rem' }}>
//           <div className="main-content">
//             <div className="page-header">
//               <h1 className="eco-title">Electric Vehicle Catalog</h1>
//               <p className="eco-subtitle">
//                 Browse and manage your eco-friendly EV inventory with detailed specifications and pricing
//               </p>
//             </div>

//             {/* FilterBar with props for search and filters */}
//             <FilterBar
//               onSearch={handleSearch}
//               onCarTypeChange={handleCarTypeChange}
//               onBrandChange={handleBrandChange}
//               carTypes={['All', ...new Set(allVehicles.map(v => v.vehicleType).filter(Boolean))]}
//               brands={['All', ...new Set(allVehicles.map(v => v.brandName).filter(Boolean))]}
//               selectedCarType={carTypeFilter}
//               selectedBrand={brandFilter}
//             />

//             {/* Vehicle Grid - Fixed layout */}
//             <Row className="vehicle-grid g-3">
//               {loading ? (
//                 <Col xs={12} className="text-center">
//                   <p>Loading vehicles...</p>
//                 </Col>
//               ) : vehicles.length === 0 ? (
//                 <Col xs={12} className="text-center">
//                   <p>No vehicles found matching your criteria.</p>
//                 </Col>
//               ) : (
//                 vehicles.map((vehicle) => (
//                   <Col xl={4} lg={4} md={6} sm={12} key={vehicle.id}>
//                     <VehicleCard
//                       vehicle={vehicle}
//                       selectedVehicles={selectedVehicles}
//                       selectedCount={selectedVehicles.length}
//                       onToggleCompare={handleToggleCompare}
//                     />
//                   </Col>
//                 ))
//               )}
//             </Row>
//           </div>
//         </div>
//       </Container>

//       {/* Compare Modal with Overview specs */}
//       <Modal show={showCompareModal} onHide={clearSelection} size="xl" centered className="compare-modal">
//         <Modal.Header closeButton className="eco-modal-header">
//           <Modal.Title>Vehicle Comparison - Overview Specs</Modal.Title>
//         </Modal.Header>
//         <Modal.Body className="p-0">
//           <Row className="g-3 mb-3">
//             {selectedVehicles.map((vehicle, index) => (
//               <Col md={6} key={vehicle.id}>
//                 <Card className={`compare-card eco-card ${index === 0 ? 'left' : 'right'}`}>
//                   <Card.Img variant="top" src={vehicle.images[0]} className="compare-card-img" />
//                   <Card.Body>
//                     <Card.Title className="eco-card-title">{vehicle.title}</Card.Title>
//                     <Card.Text className="eco-price">{vehicle.specs.price}</Card.Text>
//                     <Badge className={`mb-2 stock-badge ${vehicle.stockType}`}>
//                       {vehicle.stock}
//                     </Badge>
//                   </Card.Body>
//                 </Card>
//               </Col>
//             ))}
//           </Row>
//           <Table responsive className="compare-table">
//             <thead>
//               <tr>
//                 <th>Specification</th>
//                 {selectedVehicles.map((vehicle) => (
//                   <th key={vehicle.id} className="text-center">
//                     {vehicle.title}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {overviewKeys.map((key) => {
//                 const winnerIndex = getWinner(key);
//                 return (
//                   <tr key={key}>
//                     <td><strong>{key}</strong></td>
//                     {selectedVehicles.map((vehicle, index) => (
//                       <td key={vehicle.id} className={`text-center ${winnerIndex === index ? 'winner-cell' : ''}`}>
//                         {vehicle.overviewSpecs[key]}
//                       </td>
//                     ))}
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </Table>
//         </Modal.Body>
//         <Modal.Footer className="eco-modal-footer">
//           <Button variant="outline-eco" onClick={clearSelection}>
//             Clear Selection
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// };

// export default HomePage;

//--------------------------------------------------------------------------//

// import React, { useState, useEffect } from 'react';
// import { Container, Row, Col, Modal, Table, Card, Badge, Button, Form } from 'react-bootstrap';
// import '../../../styles/HomePage.scss';
// import FilterBar from './FilterBar';
// import VehicleCard from './VehicleCard';
// import ManageHomePageService from '../../../services/ManageHomePageService/ManageHomePageService';
// import ManageStoreService from '../../../services/ManageStore/ManageStoreService';
// import ManageVehicleService from '../../../services/ManageVehicleService/ManageVehicleService';

// const HomePage = () => {
//   const [selectedVehicles, setSelectedVehicles] = useState([]);
//   const [showCompareModal, setShowCompareModal] = useState(false);
//   const [allVehicles, setAllVehicles] = useState([]); // All raw data from API for current store
//   const [vehicles, setVehicles] = useState([]); // Filtered vehicles
//   const [loading, setLoading] = useState(false); // Loading state
//   const [searchTerm, setSearchTerm] = useState(''); // Search state
//   const [carTypeFilter, setCarTypeFilter] = useState('All'); // Car Type filter
//   const [brandFilter, setBrandFilter] = useState('All'); // Brand filter
//   const [stores, setStores] = useState([]);
//   const [selectedStoreId, setSelectedStoreId] = useState(1); // Default to store ID 1
//   const [allBrands, setAllBrands] = useState([]);
//   const [allStorages, setAllStorages] = useState([]);

//   // Fetch initial data: brands and storages (once)
//   useEffect(() => {
//     const fetchInitialData = async () => {
//       try {
//         const [brandsData, storagesData] = await Promise.all([
//           ManageHomePageService.getAllBrands(),
//           ManageHomePageService.getAllStorages()
//         ]);
//         setAllBrands(brandsData);
//         setAllStorages(storagesData);
//       } catch (error) {
//         console.error('Failed to fetch initial data:', error);
//       }
//     };
//     fetchInitialData();
//   }, []);

//   // Fetch stores
//   useEffect(() => {
//     const fetchStores = async () => {
//       try {
//         const storesData = await ManageStoreService.getAllStores();
//         setStores(storesData);
//       } catch (error) {
//         console.error('Failed to fetch stores:', error);
//       }
//     };
//     fetchStores();
//   }, []);

//   // Fetch vehicles when store changes
//   useEffect(() => {
//     if (!selectedStoreId) return;
//     const fetchVehiclesForStore = async () => {
//       setLoading(true);
//       try {
//         const vehiclesData = await ManageVehicleService.getAllVehicleByStoreId(selectedStoreId);

//         // Map vehicles with brand and storage info for this store
//         const formattedVehicles = vehiclesData.map(vehicle => {
//           const brand = allBrands.find(b => b.brandId === vehicle.brandId) || {};
//           const storage = allStorages.find(s => s.vehicleId === vehicle.vehicleId && s.storeId === selectedStoreId) || { quantityAvailable: 0 };

//           const quantity = storage.quantityAvailable || 0;
//           let stockType = 'out-of-stock';
//           let stockText = `${quantity} Available`;
//           if (quantity > 1) {
//             stockType = 'available';
//           } else if (quantity === 1) {
//             stockType = 'limited';
//           }

//           const brandName = brand.brandName || 'Unknown';
//           const title = vehicle.modelName.startsWith(brandName) ? vehicle.modelName : `${brandName} ${vehicle.modelName}`;

//           // Format specs cho VehicleCard (thay đổi labels và fields)
//           const specs = {
//             range: `${vehicle.rangePerCharge}`, // e.g., "650 km"
//             version: vehicle.version, // Thay thế acceleration
//             brand: brandName,
//             color: vehicle.color,
//             battery: vehicle.batteryCapacity,
//             topSpeed: 'N/A',
//             seating: 'N/A',
//             price: `${vehicle.price.toLocaleString()} VND` // Changed to VND
//           };

//           // Title và description
//           const description = `The ${vehicle.modelName} ${vehicle.version} offers premium electric performance with a ${vehicle.color} finish.`;

//           // Slug generate đơn giản
//           const slug = `${brandName?.toLowerCase().replace(/\s+/g, '-') || 'unknown'}-${vehicle.modelName.toLowerCase().replace(/\s+/g, '-')}`;

//           // Images: Use first from API imageUrls
//           const imageUrls = vehicle.imageUrls || [];
//           const images = imageUrls.length > 0 ? imageUrls : [
//             'https://vinfast-vn.vn/wp-content/uploads/2023/10/vinfast-vf8-1-1.png'
//           ];

//           // Overview specs like in DetailPage
//           const getValueOrNoData = (val) => val || 'No Data';
//           const overviewSpecs = {
//             'Vehicle Type': getValueOrNoData(vehicle.vehicleType),
//             'Range per Charge': getValueOrNoData(vehicle.rangePerCharge),
//             'Battery Capacity': getValueOrNoData(vehicle.batteryCapacity),
//             'Horsepower': `${getValueOrNoData(vehicle.horsepower)} HP`,
//             'Transmission': getValueOrNoData(vehicle.transmission),
//             'Seating Capacity': `${getValueOrNoData(vehicle.seatingCapacity)} Seats`,
//             'Airbags': `${getValueOrNoData(vehicle.airbags)}`,
//             'Warranty': getValueOrNoData(vehicle.warrantyPeriod),
//             'Daily Driving Limit': `${getValueOrNoData(vehicle.dailyDrivingLimit)} km`,
//             'Trunk Capacity': `${getValueOrNoData(vehicle.trunkCapacity)} L`,
//             'Version': getValueOrNoData(vehicle.version),
//             'Year': getValueOrNoData(vehicle.year),
//             'Color': getValueOrNoData(vehicle.color)
//           };

//           return {
//             id: vehicle.vehicleId,
//             slug,
//             images,
//             title,
//             specs,
//             overviewSpecs, // For compare
//             stock: stockText,
//             stockType,
//             description,
//             vehicleType: vehicle.vehicleType || 'Unknown', // For Car Type filter
//             brandName, // For Brand filter
//             // Extra data cho detail page (nếu cần)
//             fullData: {
//               ...vehicle,
//               brand: {
//                 name: brandName,
//                 country: brand.country,
//                 website: brand.website,
//                 founderYear: brand.founderYear
//               },
//               quantityAvailable: quantity
//             }
//           };
//         });

//         setAllVehicles(formattedVehicles);
//         setVehicles(formattedVehicles); // Initial set
//       } catch (error) {
//         console.error('Failed to fetch vehicles for store:', error);
//         setAllVehicles([]);
//         setVehicles([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchVehiclesForStore();
//   }, [selectedStoreId, allBrands, allStorages]);

//   // Filter vehicles based on search, car type, and brand
//   useEffect(() => {
//     let filtered = [...allVehicles];

//     // Search filter: case-insensitive match on title or modelName
//     if (searchTerm.trim()) {
//       const lowerSearch = searchTerm.toLowerCase().trim();
//       filtered = filtered.filter(vehicle =>
//         vehicle.title.toLowerCase().includes(lowerSearch) ||
//         vehicle.fullData.modelName.toLowerCase().includes(lowerSearch)
//       );
//     }

//     // Car Type filter
//     if (carTypeFilter !== 'All') {
//       filtered = filtered.filter(vehicle => vehicle.vehicleType === carTypeFilter);
//     }

//     // Brand filter
//     if (brandFilter !== 'All') {
//       filtered = filtered.filter(vehicle => vehicle.brandName === brandFilter);
//     }

//     setVehicles(filtered);
//   }, [searchTerm, carTypeFilter, brandFilter, allVehicles]);

//   const handleSearch = (term) => {
//     setSearchTerm(term);
//   };

//   const handleCarTypeChange = (type) => {
//     setCarTypeFilter(type);
//   };

//   const handleBrandChange = (brand) => {
//     setBrandFilter(brand);
//   };

//   const handleStoreChange = (storeId) => {
//     setSelectedStoreId(storeId);
//   };

//   const handleToggleCompare = (vehicleId) => {
//     setSelectedVehicles(prev => {
//       const isSelected = prev.some(v => v.id === vehicleId);
//       let updated;
//       if (isSelected) {
//         updated = prev.filter(v => v.id !== vehicleId);
//         setShowCompareModal(false);
//       } else if (prev.length < 2) {
//         const vehicle = allVehicles.find(v => v.id === vehicleId); // Use allVehicles to ensure full data
//         updated = [...prev, vehicle];
//         if (updated.length === 2) {
//           setShowCompareModal(true);
//         }
//       } else {
//         return prev;
//       }
//       return updated;
//     });
//   };

//   const clearSelection = () => {
//     setSelectedVehicles([]);
//     setShowCompareModal(false);
//   };

//   // Enhanced getWinner for Overview specs
//   const getWinner = (key) => {
//     if (selectedVehicles.length !== 2) return null; // Only compare when exactly 2 vehicles are selected

//     const values = selectedVehicles.map(v => v.overviewSpecs[key]);

//     // Skip comparison for subjective or non-comparable fields
//     const nonComparableFields = ['Vehicle Type', 'Version', 'Color'];
//     if (nonComparableFields.includes(key)) return null;

//     // Handle Warranty separately (e.g., parse "3 years" to 3)
//     if (key === 'Warranty') {
//       const parsedValues = values.map(val => {
//         if (typeof val !== 'string' || val === 'No Data') return null;
//         const match = val.match(/(\d+)/); // Extract number of years
//         return match ? parseInt(match[1], 10) : null;
//       });

//       const validValues = parsedValues.filter(v => v !== null);
//       if (validValues.length < 2) return null;

//       const [val1, val2] = validValues;
//       if (val1 === val2) return null; // Tie
//       return val1 > val2 ? 0 : 1; // Higher warranty duration wins
//     }

//     // Handle Transmission (e.g., prefer 'Automatic' over 'Manual')
//     if (key === 'Transmission') {
//       const validValues = values.filter(v => typeof v === 'string' && v !== 'No Data');
//       if (validValues.length < 2) return null;
//       const [val1, val2] = validValues;
//       if (val1 === val2) return null; // Tie
//       // Arbitrary preference: Automatic > Manual
//       const preference = { 'Automatic': 2, 'Manual': 1 };
//       const score1 = preference[val1] || 0;
//       const score2 = preference[val2] || 0;
//       if (score1 === score2) return null;
//       return score1 > score2 ? 0 : 1;
//     }

//     // Handle numeric fields
//     const numericFields = [
//       'Range per Charge',
//       'Battery Capacity',
//       'Horsepower',
//       'Seating Capacity',
//       'Airbags',
//       'Daily Driving Limit',
//       'Trunk Capacity',
//       'Year',
//       'Price'
//     ];

//     if (numericFields.includes(key)) {
//       const parsedValues = values.map(val => {
//         if (typeof val !== 'string' || val === 'No Data') return null;
//         let cleanVal = val;
//         if (key === 'Price') {
//           cleanVal = val.replace(/[$, VND]/g, ''); // Remove currency symbols
//         } else {
//           cleanVal = val.replace(/[^0-9.]/g, ''); // Remove non-numeric chars (e.g., 'km', 'HP')
//         }
//         const num = parseFloat(cleanVal);
//         return isNaN(num) ? null : num;
//       });

//       const validValues = parsedValues.filter(v => v !== null);
//       if (validValues.length < 2) return null;

//       const [val1, val2] = validValues;
//       if (val1 === val2) return null; // Tie

//       // Lower is better for Price, higher for others
//       if (key === 'Price') {
//         return val1 < val2 ? 0 : 1;
//       }
//       return val1 > val2 ? 0 : 1;
//     }

//     return null; // Default for unhandled fields
//   };

//   // Overview specs keys for compare table
//   const overviewKeys = Object.keys(allVehicles[0]?.overviewSpecs || {});

//   const selectedStore = stores.find(s => s.storeId === selectedStoreId);

//   return (
//     <div className="min-h-screen eco-bg">
//       <Container fluid className="eco-container">
//         <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '2rem 3rem' }}>
//           <div className="main-content">
//             <div className="page-header">
//               <h1 className="eco-title">Electric Vehicle Catalog</h1>
//               <p className="eco-subtitle">
//                 Browse and manage your eco-friendly EV inventory with detailed specifications and pricing
//               </p>
//             </div>

//             {/* Store Selector - Prominent filter */}
//             <Card className="mb-4 store-selector-card">
//               <Card.Body className="d-flex align-items-center justify-content-between">
//                 <div>
//                   <strong>Available at: </strong>
//                   <span
//                     className="fw-bold"
//                     style={{
//                       background: 'linear-gradient(to right, #03b154ff, #5564b7ff)',  // Xanh nhạt → Xanh đậm
//                       WebkitBackgroundClip: 'text',  // Cho Safari/Chrome
//                       WebkitTextFillColor: 'transparent',  // Làm nền chữ trong suốt
//                       backgroundClip: 'text'  // Cho Firefox/Edge
//                     }}
//                   >
//                     {selectedStore ? `${selectedStore.storeName} - ${selectedStore.address}` : 'Loading...'}
//                   </span>
//                 </div>
//                 <Form.Group controlId="storeSelect" className="mb-0">
//                   <Form.Label className="me-2 mb-0">Select Store:</Form.Label>
//                   <Form.Select
//                     value={selectedStoreId}
//                     onChange={(e) => handleStoreChange(parseInt(e.target.value))}
//                     className="me-2"
//                     style={{ minWidth: '250px' }}
//                   >
//                     {stores.map(store => (
//                       <option key={store.storeId} value={store.storeId}>
//                         {store.storeName} - {store.address}
//                       </option>
//                     ))}
//                   </Form.Select>
//                 </Form.Group>
//               </Card.Body>
//             </Card>

//             {/* FilterBar with props for search and filters */}
//             <FilterBar
//               onSearch={handleSearch}
//               onCarTypeChange={handleCarTypeChange}
//               onBrandChange={handleBrandChange}
//               carTypes={['All', ...new Set(allVehicles.map(v => v.vehicleType).filter(Boolean))]}
//               brands={['All', ...new Set(allVehicles.map(v => v.brandName).filter(Boolean))]}
//               selectedCarType={carTypeFilter}
//               selectedBrand={brandFilter}
//             />

//             {/* Vehicle Grid - Fixed layout */}
//             <Row className="vehicle-grid g-3">
//               {loading ? (
//                 <Col xs={12} className="text-center">
//                   <p>Loading vehicles...</p>
//                 </Col>
//               ) : vehicles.length === 0 ? (
//                 <Col xs={12} className="text-center">
//                   <p>No vehicles found matching your criteria.</p>
//                 </Col>
//               ) : (
//                 vehicles.map((vehicle) => (
//                   <Col xl={4} lg={4} md={6} sm={12} key={vehicle.id}>
//                     <VehicleCard
//                       vehicle={vehicle}
//                       selectedVehicles={selectedVehicles}
//                       selectedCount={selectedVehicles.length}
//                       onToggleCompare={handleToggleCompare}
//                     />
//                   </Col>
//                 ))
//               )}
//             </Row>
//           </div>
//         </div>
//       </Container>

//       {/* Compare Modal with Overview specs */}
//       <Modal show={showCompareModal} onHide={clearSelection} size="xl" centered className="compare-modal">
//         <Modal.Header closeButton className="eco-modal-header">
//           <Modal.Title>Vehicle Comparison - Overview Specs</Modal.Title>
//         </Modal.Header>
//         <Modal.Body className="p-0">
//           <Row className="g-3 mb-3">
//             {selectedVehicles.map((vehicle, index) => (
//               <Col md={6} key={vehicle.id}>
//                 <Card className={`compare-card eco-card ${index === 0 ? 'left' : 'right'}`}>
//                   <Card.Img variant="top" src={vehicle.images[0]} className="compare-card-img" />
//                   <Card.Body>
//                     <Card.Title className="eco-card-title">{vehicle.title}</Card.Title>
//                     <Card.Text className="eco-price">{vehicle.specs.price}</Card.Text>
//                     <Badge className={`mb-2 stock-badge ${vehicle.stockType}`}>
//                       {vehicle.stock}
//                     </Badge>
//                   </Card.Body>
//                 </Card>
//               </Col>
//             ))}
//           </Row>
//           <Table responsive className="compare-table">
//             <thead>
//               <tr>
//                 <th>Specification</th>
//                 {selectedVehicles.map((vehicle) => (
//                   <th key={vehicle.id} className="text-center">
//                     {vehicle.title}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {overviewKeys.map((key) => {
//                 const winnerIndex = getWinner(key);
//                 return (
//                   <tr key={key}>
//                     <td><strong>{key}</strong></td>
//                     {selectedVehicles.map((vehicle, index) => (
//                       <td key={vehicle.id} className={`text-center ${winnerIndex === index ? 'winner-cell' : ''}`}>
//                         {vehicle.overviewSpecs[key]}
//                       </td>
//                     ))}
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </Table>
//         </Modal.Body>
//         <Modal.Footer className="eco-modal-footer">
//           <Button variant="outline-eco" onClick={clearSelection}>
//             Clear Selection
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// };

// export default HomePage;

//--------------------------------------------------------------------------//

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Modal, Table, Card, Badge, Button, Form } from 'react-bootstrap';
import '../../../styles/HomePage.scss';
import FilterBar from './FilterBar';
import VehicleCard from './VehicleCard';
import ManageHomePageService from '../../../services/ManageHomePageService/ManageHomePageService';
import ManageStoreService from '../../../services/ManageStore/ManageStoreService';
import ManageVehicleService from '../../../services/ManageVehicleService/ManageVehicleService';

const HomePage = () => {
  const [selectedVehicles, setSelectedVehicles] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [allVehicles, setAllVehicles] = useState([]); // All raw data from API for current store
  const [vehicles, setVehicles] = useState([]); // Filtered vehicles
  const [loading, setLoading] = useState(false); // Loading state
  const [searchTerm, setSearchTerm] = useState(''); // Search state
  const [carTypeFilter, setCarTypeFilter] = useState('All'); // Car Type filter
  const [brandFilter, setBrandFilter] = useState('All'); // Brand filter
  const [stores, setStores] = useState([]);
  const [selectedStoreId, setSelectedStoreId] = useState(0); // Default to All stores (0)
  const [allBrands, setAllBrands] = useState([]);
  const [allStorages, setAllStorages] = useState([]);

  // Fetch initial data: brands and storages (once)
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [brandsData, storagesData] = await Promise.all([
          ManageHomePageService.getAllBrands(),
          ManageHomePageService.getAllStorages()
        ]);
        setAllBrands(brandsData);
        setAllStorages(storagesData);
      } catch (error) {
        console.error('Failed to fetch initial data:', error);
      }
    };
    fetchInitialData();
  }, []);

  // Fetch stores
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const storesData = await ManageStoreService.getAllStores();
        setStores(storesData);
      } catch (error) {
        console.error('Failed to fetch stores:', error);
      }
    };
    fetchStores();
  }, []);

  // Helper to get quantity for a vehicle in a specific store (deduped, latest only, non-null storeId)
  const getQuantityForStore = (vehicleId, storeId, storages) => {
    // Filter only for this specific non-null storeId, sort by storageId descending to get latest
    const relevantStorages = storages
      .filter(s => s.vehicleId === vehicleId && s.storeId === storeId)
      .sort((a, b) => b.storageId - a.storageId); // Latest first
    return relevantStorages.length > 0 ? relevantStorages[0].quantityAvailable || 0 : 0;
  };

  // Helper to get total quantity across all stores for a vehicle (deduped per store, excluding HQ null)
  const getTotalQuantityAcrossStores = (vehicleId, storages) => {
    // Filter only allocated (non-null storeId), then group by storeId, take latest quantity per store
    const allocatedStorages = storages.filter(s => s.vehicleId === vehicleId && s.storeId !== null);
    const storeMap = new Map();
    allocatedStorages
      .sort((a, b) => b.storageId - a.storageId) // Latest first
      .forEach(s => {
        const key = s.storeId;
        if (!storeMap.has(key)) { // Only take the first (latest) per store
          storeMap.set(key, s.quantityAvailable || 0);
        }
      });
    return Array.from(storeMap.values()).reduce((sum, q) => sum + q, 0);
  };

  // Fetch vehicles when store changes
  useEffect(() => {
    const fetchVehiclesForStore = async () => {
      setLoading(true);
      try {
        let vehiclesData;
        if (selectedStoreId === 0) {
          vehiclesData = await ManageHomePageService.getAllVehicles();
        } else {
          vehiclesData = await ManageVehicleService.getAllVehicleByStoreId(selectedStoreId);
        }

        // Map vehicles with brand and storage info
        const formattedVehicles = vehiclesData.map(vehicle => {
          const brand = allBrands.find(b => b.brandId === vehicle.brandId) || {};
          let quantity;
          let stockText;

          if (selectedStoreId === 0) {
            // For All Stores: sum deduped allocated quantities across all stores (exclude HQ null)
            quantity = getTotalQuantityAcrossStores(vehicle.vehicleId, allStorages);
            stockText = quantity > 0 ? `${quantity} Available across all locations` : 'Not Available';
          } else {
            // For specific store: get deduped quantity for that store only (non-null)
            quantity = getQuantityForStore(vehicle.vehicleId, selectedStoreId, allStorages);
            stockText = quantity > 0 ? `${quantity} Available` : 'Not Available';
          }

          let stockType = 'out-of-stock';
          if (quantity > 1) {
            stockType = 'available';
          } else if (quantity === 1) {
            stockType = 'limited';
          } else {
            stockType = 'out-of-stock';
          }

          const brandName = brand.brandName || 'Unknown';
          const title = vehicle.modelName.startsWith(brandName) ? vehicle.modelName : `${brandName} ${vehicle.modelName}`;

          // Format specs cho VehicleCard (thay đổi labels và fields)
          const specs = {
            range: `${vehicle.rangePerCharge}`, // e.g., "650 km"
            version: vehicle.version, // Thay thế acceleration
            brand: brandName,
            color: vehicle.color,
            battery: vehicle.batteryCapacity,
            topSpeed: 'N/A',
            seating: 'N/A',
            price: `${vehicle.price.toLocaleString()} VND` // Changed to VND
          };

          // Title và description
          const description = `The ${vehicle.modelName} ${vehicle.version} offers premium electric performance with a ${vehicle.color} finish.`;

          // Slug generate đơn giản
          const slug = `${brandName?.toLowerCase().replace(/\s+/g, '-') || 'unknown'}-${vehicle.modelName.toLowerCase().replace(/\s+/g, '-')}`;

          // Images: Use first from API imageUrls
          const imageUrls = vehicle.imageUrls || [];
          const images = imageUrls.length > 0 ? imageUrls : [
            'https://vinfast-vn.vn/wp-content/uploads/2023/10/vinfast-vf8-1-1.png'
          ];

          // Overview specs like in DetailPage
          const getValueOrNoData = (val) => val || 'No Data';
          const overviewSpecs = {
            'Vehicle Type': getValueOrNoData(vehicle.vehicleType),
            'Range per Charge': getValueOrNoData(vehicle.rangePerCharge),
            'Battery Capacity': getValueOrNoData(vehicle.batteryCapacity),
            'Horsepower': `${getValueOrNoData(vehicle.horsepower)} HP`,
            'Transmission': getValueOrNoData(vehicle.transmission),
            'Seating Capacity': `${getValueOrNoData(vehicle.seatingCapacity)} Seats`,
            'Airbags': `${getValueOrNoData(vehicle.airbags)}`,
            'Warranty': getValueOrNoData(vehicle.warrantyPeriod),
            'Daily Driving Limit': `${getValueOrNoData(vehicle.dailyDrivingLimit)} km`,
            'Trunk Capacity': `${getValueOrNoData(vehicle.trunkCapacity)} L`,
            'Version': getValueOrNoData(vehicle.version),
            'Year': getValueOrNoData(vehicle.year),
            'Color': getValueOrNoData(vehicle.color)
          };

          return {
            id: vehicle.vehicleId,
            slug,
            images,
            title,
            specs,
            overviewSpecs, // For compare
            stock: stockText,
            stockType,
            description,
            vehicleType: vehicle.vehicleType || 'Unknown', // For Car Type filter
            brandName, // For Brand filter
            // Extra data cho detail page (nếu cần)
            fullData: {
              ...vehicle,
              brand: {
                name: brandName,
                country: brand.country,
                website: brand.website,
                founderYear: brand.founderYear
              },
              quantityAvailable: quantity
            }
          };
        });

        setAllVehicles(formattedVehicles);
        setVehicles(formattedVehicles); // Initial set
      } catch (error) {
        console.error('Failed to fetch vehicles for store:', error);
        setAllVehicles([]);
        setVehicles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVehiclesForStore();
  }, [selectedStoreId, allBrands, allStorages]);

  // Filter vehicles based on search, car type, and brand
  useEffect(() => {
    let filtered = [...allVehicles];

    // Search filter: case-insensitive match on title or modelName
    if (searchTerm.trim()) {
      const lowerSearch = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(vehicle =>
        vehicle.title.toLowerCase().includes(lowerSearch) ||
        vehicle.fullData.modelName.toLowerCase().includes(lowerSearch)
      );
    }

    // Car Type filter
    if (carTypeFilter !== 'All') {
      filtered = filtered.filter(vehicle => vehicle.vehicleType === carTypeFilter);
    }

    // Brand filter
    if (brandFilter !== 'All') {
      filtered = filtered.filter(vehicle => vehicle.brandName === brandFilter);
    }

    setVehicles(filtered);
  }, [searchTerm, carTypeFilter, brandFilter, allVehicles]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleCarTypeChange = (type) => {
    setCarTypeFilter(type);
  };

  const handleBrandChange = (brand) => {
    setBrandFilter(brand);
  };

  const handleStoreChange = (storeId) => {
    setSelectedStoreId(storeId);
  };

  const handleToggleCompare = (vehicleId) => {
    setSelectedVehicles(prev => {
      const isSelected = prev.some(v => v.id === vehicleId);
      let updated;
      if (isSelected) {
        updated = prev.filter(v => v.id !== vehicleId);
        setShowCompareModal(false);
      } else if (prev.length < 2) {
        const vehicle = allVehicles.find(v => v.id === vehicleId); // Use allVehicles to ensure full data
        updated = [...prev, vehicle];
        if (updated.length === 2) {
          setShowCompareModal(true);
        }
      } else {
        return prev;
      }
      return updated;
    });
  };

  const clearSelection = () => {
    setSelectedVehicles([]);
    setShowCompareModal(false);
  };

  // Enhanced getWinner for Overview specs
  const getWinner = (key) => {
    if (selectedVehicles.length !== 2) return null; // Only compare when exactly 2 vehicles are selected

    const values = selectedVehicles.map(v => v.overviewSpecs[key]);

    // Skip comparison for subjective or non-comparable fields
    const nonComparableFields = ['Vehicle Type', 'Version', 'Color'];
    if (nonComparableFields.includes(key)) return null;

    // Handle Warranty separately (e.g., parse "3 years" to 3)
    if (key === 'Warranty') {
      const parsedValues = values.map(val => {
        if (typeof val !== 'string' || val === 'No Data') return null;
        const match = val.match(/(\d+)/); // Extract number of years
        return match ? parseInt(match[1], 10) : null;
      });

      const validValues = parsedValues.filter(v => v !== null);
      if (validValues.length < 2) return null;

      const [val1, val2] = validValues;
      if (val1 === val2) return null; // Tie
      return val1 > val2 ? 0 : 1; // Higher warranty duration wins
    }

    // Handle Transmission (e.g., prefer 'Automatic' over 'Manual')
    if (key === 'Transmission') {
      const validValues = values.filter(v => typeof v === 'string' && v !== 'No Data');
      if (validValues.length < 2) return null;
      const [val1, val2] = validValues;
      if (val1 === val2) return null; // Tie
      // Arbitrary preference: Automatic > Manual
      const preference = { 'Automatic': 2, 'Manual': 1 };
      const score1 = preference[val1] || 0;
      const score2 = preference[val2] || 0;
      if (score1 === score2) return null;
      return score1 > score2 ? 0 : 1;
    }

    // Handle numeric fields
    const numericFields = [
      'Range per Charge',
      'Battery Capacity',
      'Horsepower',
      'Seating Capacity',
      'Airbags',
      'Daily Driving Limit',
      'Trunk Capacity',
      'Year',
      'Price'
    ];

    if (numericFields.includes(key)) {
      const parsedValues = values.map(val => {
        if (typeof val !== 'string' || val === 'No Data') return null;
        let cleanVal = val;
        if (key === 'Price') {
          cleanVal = val.replace(/[$, VND]/g, ''); // Remove currency symbols
        } else {
          cleanVal = val.replace(/[^0-9.]/g, ''); // Remove non-numeric chars (e.g., 'km', 'HP')
        }
        const num = parseFloat(cleanVal);
        return isNaN(num) ? null : num;
      });

      const validValues = parsedValues.filter(v => v !== null);
      if (validValues.length < 2) return null;

      const [val1, val2] = validValues;
      if (val1 === val2) return null; // Tie

      // Lower is better for Price, higher for others
      if (key === 'Price') {
        return val1 < val2 ? 0 : 1;
      }
      return val1 > val2 ? 0 : 1;
    }

    return null; // Default for unhandled fields
  };

  // Overview specs keys for compare table
  const overviewKeys = Object.keys(allVehicles[0]?.overviewSpecs || {});

  const selectedStore = stores.find(s => s.storeId === selectedStoreId);

  return (
    <div className="min-h-screen eco-bg">
      <Container fluid className="eco-container">
        <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '2rem 3rem' }}>
          <div className="main-content">
            <div className="page-header">
              <h1 className="eco-title">Electric Vehicle Catalog</h1>
              <p className="eco-subtitle">
                Browse and manage your eco-friendly EV inventory with detailed specifications and pricing
              </p>
            </div>

            {/* Store Selector - Prominent filter */}
            <Card className="mb-4 store-selector-card">
              <Card.Body className="d-flex align-items-center justify-content-between">
                <div>
                  <strong>Available at: </strong>
                  <span
                    className="fw-bold"
                    style={{
                      background: 'linear-gradient(to right, #03b154ff, #5564b7ff)',  // Xanh nhạt → Xanh đậm
                      WebkitBackgroundClip: 'text',  // Cho Safari/Chrome
                      WebkitTextFillColor: 'transparent',  // Làm nền chữ trong suốt
                      backgroundClip: 'text'  // Cho Firefox/Edge
                    }}
                  >
                    {selectedStoreId === 0 ? 'All Stores' : (selectedStore ? `${selectedStore.storeName} - ${selectedStore.address}` : 'Loading...')}
                  </span>
                </div>
                <Form.Group controlId="storeSelect" className="mb-0">
                  <Form.Label className="me-2 mb-0">Select Store:</Form.Label>
                  <Form.Select
                    value={selectedStoreId}
                    onChange={(e) => handleStoreChange(parseInt(e.target.value))}
                    className="me-2"
                    style={{ minWidth: '250px' }}
                  >
                    <option value="0">All Stores</option>
                    {stores.map(store => (
                      <option key={store.storeId} value={store.storeId}>
                        {store.storeName} - {store.address}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Card.Body>
            </Card>

            {/* FilterBar with props for search and filters */}
            <FilterBar
              onSearch={handleSearch}
              onCarTypeChange={handleCarTypeChange}
              onBrandChange={handleBrandChange}
              carTypes={['All', ...new Set(allVehicles.map(v => v.vehicleType).filter(Boolean))]}
              brands={['All', ...new Set(allVehicles.map(v => v.brandName).filter(Boolean))]}
              selectedCarType={carTypeFilter}
              selectedBrand={brandFilter}
            />

            {/* Vehicle Grid - Fixed layout */}
            <Row className="vehicle-grid g-3">
              {loading ? (
                <Col xs={12} className="text-center">
                  <p>Loading vehicles...</p>
                </Col>
              ) : vehicles.length === 0 ? (
                <Col xs={12} className="text-center">
                  <p>No vehicles found matching your criteria.</p>
                </Col>
              ) : (
                vehicles.map((vehicle) => (
                  <Col xl={4} lg={4} md={6} sm={12} key={vehicle.id}>
                    <VehicleCard
                      vehicle={vehicle}
                      selectedVehicles={selectedVehicles}
                      selectedCount={selectedVehicles.length}
                      onToggleCompare={handleToggleCompare}
                    />
                  </Col>
                ))
              )}
            </Row>
          </div>
        </div>
      </Container>

      {/* Compare Modal with Overview specs */}
      <Modal show={showCompareModal} onHide={clearSelection} size="xl" centered className="compare-modal">
        <Modal.Header closeButton className="eco-modal-header">
          <Modal.Title>Vehicle Comparison - Overview Specs</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          <Row className="g-3 mb-3">
            {selectedVehicles.map((vehicle, index) => (
              <Col md={6} key={vehicle.id}>
                <Card className={`compare-card eco-card ${index === 0 ? 'left' : 'right'}`}>
                  <Card.Img variant="top" src={vehicle.images[0]} className="compare-card-img" />
                  <Card.Body>
                    <Card.Title className="eco-card-title">{vehicle.title}</Card.Title>
                    <Card.Text className="eco-price">{vehicle.specs.price}</Card.Text>
                    <Badge className={`mb-2 stock-badge ${vehicle.stockType}`}>
                      {vehicle.stock}
                    </Badge>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
          <Table responsive className="compare-table">
            <thead>
              <tr>
                <th>Specification</th>
                {selectedVehicles.map((vehicle) => (
                  <th key={vehicle.id} className="text-center">
                    {vehicle.title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {overviewKeys.map((key) => {
                const winnerIndex = getWinner(key);
                return (
                  <tr key={key}>
                    <td><strong>{key}</strong></td>
                    {selectedVehicles.map((vehicle, index) => (
                      <td key={vehicle.id} className={`text-center ${winnerIndex === index ? 'winner-cell' : ''}`}>
                        {vehicle.overviewSpecs[key]}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer className="eco-modal-footer">
          <Button variant="outline-eco" onClick={clearSelection}>
            Clear Selection
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default HomePage;