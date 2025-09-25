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

// src/pages/user/HomePage/HomePage.jsx (updated modal with vehicle images and improved styles)
import React, { useState } from 'react';
import { Container, Row, Col, Modal, Table, Card, Badge, Button } from 'react-bootstrap';
import '../../../styles/HomePage.scss';
import Sidebar from '../../../components/sidebar/Sidebar';
import SearchBar from './SearchBar';
import FilterBar from './FilterBar';
import VehicleCard from './VehicleCard';

const HomePage = () => {
  const [selectedVehicles, setSelectedVehicles] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  const vehicles = [
    {
      id: 1,
      slug: 'tesla-model-s',
      images: [
        'https://vinfastauto.us/themes/custom/vinfast_v2/images/v3/vf-9/exterior-color-red.webp',
        'https://www.tesla.com/sites/default/files/images/model-s/model-s-hero@2x.jpg',
        'https://www.tesla.com/sites/default/files/images/model-s/model-s-interior@2x.jpg'
      ],
      title: 'Tesla Model S',
      specs: {
        range: '405 miles',
        acceleration: '3.1s',
        category: 'Luxury Sedan',
        battery: '100 kWh',
        topSpeed: '200 mph',
        seating: '5 seats',
        price: '$89,900'
      },
      stock: '5 Available',
      stockType: 'available',
      description: 'The Tesla Model S is a premium electric sedan offering unparalleled performance and range.'
    },
    {
      id: 2,
      slug: 'bmw-ix',
      images: [
        'https://s1.cdn.autoevolution.com/images/gallery/vinfast-vf-9-2022-7300_1.jpg',
        'https://www.bmw.com/content/dam/bmw/market/MiddleEast/bmw-me/2023/ix/model-overview/bmw-ix-model-overview-desktop.jpg.asset.1674489562907.jpg',
        'https://www.bmw.com/content/dam/bmw/market/MiddleEast/bmw-me/2023/ix/interior/bmw-ix-interior-desktop.jpg.asset.1674489562907.jpg'
      ],
      title: 'BMW iX',
      specs: {
        range: '324 miles',
        acceleration: '4.6s',
        category: 'Luxury SUV',
        battery: '111 kWh',
        topSpeed: '124 mph',
        seating: '5 seats',
        price: '$83,200'
      },
      stock: '3 Available',
      stockType: 'available',
      description: 'The BMW iX combines luxury with sustainable electric power in an SUV form.'
    },
    {
      id: 3,
      slug: 'audi-e-tron-gt',
      images: [
        'https://tse3.mm.bing.net/th/id/OIP.8tjx039IiQN9y342QEvYHAHaE8?w=1200&h=800&rs=1&pid=ImgDetMain&o=7&rm=3',
        'https://www.audi.com/content/dam/audiusa2/models/e-tron-gt/e-tron-gt-2024/hero-desktop.jpg',
        'https://www.audi.com/content/dam/audiusa2/models/e-tron-gt/e-tron-gt-2024/interior-desktop.jpg'
      ],
      title: 'Audi e-tron GT',
      specs: {
        range: '238 miles',
        acceleration: '3.9s',
        category: 'Sports Car',
        battery: '93 kWh',
        topSpeed: '155 mph',
        seating: '4 seats',
        price: '$102,400'
      },
      stock: '1 Available',
      stockType: 'limited',
      description: 'The Audi e-tron GT delivers thrilling performance in a sleek electric sports car design.'
    }
  ];

  const handleToggleCompare = (vehicleId) => {
    setSelectedVehicles(prev => {
      const isSelected = prev.some(v => v.id === vehicleId);
      let updated;
      if (isSelected) {
        updated = prev.filter(v => v.id !== vehicleId);
        setShowCompareModal(false);
      } else if (prev.length < 2) {
        const vehicle = vehicles.find(v => v.id === vehicleId);
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

  const getWinner = (key) => {
    if (selectedVehicles.length < 2) return null;
    const values = selectedVehicles.map(v => v.specs[key]);
    const parsedValues = values.map(val => {
      if (key === 'price') return parseFloat(val.replace(/[$,]/g, ''));
      if (key.includes('miles') || key.includes('kWh') || key.includes('mph') || key.includes('seats')) return parseFloat(val.replace(/[^0-9.]/g, ''));
      if (key === 'acceleration') return parseFloat(val.replace('s', ''));
      return 0;
    });
    let bestIndex;
    if (key === 'price' || key === 'acceleration') {
      bestIndex = parsedValues.indexOf(Math.min(...parsedValues));
    } else {
      bestIndex = parsedValues.indexOf(Math.max(...parsedValues));
    }
    return bestIndex;
  };

  const specsKeys = ['range', 'acceleration', 'category', 'battery', 'topSpeed', 'seating', 'price'];

  return (
    <div className="min-h-screen eco-bg">
      <Container fluid className="eco-container">
        <Row className="g-0">
          {/* Sidebar */}
          <Col md={2} className="p-0">
            <Sidebar
              menuItems={[
                'Products',
                'Test Drives'
              ]}
              activeItem="Products"
            />
          </Col>

          {/* Main Content */}
          <Col md={10} className="p-4">
            <div className="main-content">
              <div className="page-header">
                <h1 className="eco-title">Electric Vehicle Rental Catalog</h1>
                <p className="eco-subtitle">
                  Browse and manage your eco-friendly EV rental inventory with detailed specifications and pricing
                </p>
              </div>
              <FilterBar />

              {/* Vehicle Grid - Fixed layout */}
              <Row className="vehicle-grid g-3">
                {vehicles.map((vehicle) => (
                  <Col xl={4} lg={4} md={6} sm={12} key={vehicle.id}>
                    <VehicleCard
                      vehicle={vehicle}
                      selectedVehicles={selectedVehicles}
                      selectedCount={selectedVehicles.length}
                      onToggleCompare={handleToggleCompare}
                    />
                  </Col>
                ))}
              </Row>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Compare Modal */}
      <Modal show={showCompareModal} onHide={clearSelection} size="xl" centered className="compare-modal">
        <Modal.Header closeButton className="eco-modal-header">
          <Modal.Title>Vehicle Comparison</Modal.Title>
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
                    <Badge bg={vehicle.stockType === 'available' ? "success" : "warning"} className="mb-2">
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
              {specsKeys.map((key) => {
                const winnerIndex = getWinner(key);
                return (
                  <tr key={key}>
                    <td><strong>{key.charAt(0).toUpperCase() + key.slice(1)}</strong></td>
                    {selectedVehicles.map((vehicle, index) => (
                      <td key={vehicle.id} className={`text-center ${winnerIndex === index ? 'winner-cell' : ''}`}>
                        {vehicle.specs[key]}
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
          <Button variant="eco-primary">
            Download Comparison
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default HomePage;