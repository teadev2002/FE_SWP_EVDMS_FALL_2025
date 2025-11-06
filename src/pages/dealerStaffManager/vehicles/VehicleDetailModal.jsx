// import React, { useState } from 'react';
// import { Tabs, Carousel, List, Card, Image, Button, Row, Col, Typography, Tag } from 'antd';
// import '../../../styles/dealerStaffManager/ManageVehicle.scss';

// const { TabPane } = Tabs;
// const { Title, Text } = Typography;

// const VehicleDetailModal = ({ vehicle, onClose }) => {
//     const [activeTab, setActiveTab] = useState('overview');

//     if (!vehicle) {
//         return <div>Vehicle Not Found</div>;
//     }

//     // Helper to handle null/undefined values
//     const getValueOrNoData = (val) => val || 'No Data';

//     // Format specs similar to VehicleDetailPage
//     const overviewSpecs = {
//         'Vehicle Type': getValueOrNoData(vehicle.fullData.vehicleType),
//         'Range per Charge': getValueOrNoData(vehicle.fullData.rangePerCharge),
//         'Battery Capacity': getValueOrNoData(vehicle.fullData.batteryCapacity),
//         'Horsepower': `${getValueOrNoData(vehicle.fullData.horsepower)} HP`,
//         'Transmission': getValueOrNoData(vehicle.fullData.transmission),
//         'Seating Capacity': `${getValueOrNoData(vehicle.fullData.seatingCapacity)} Seats`,
//         'Airbags': `${getValueOrNoData(vehicle.fullData.airbags)}`,
//         'Warranty': getValueOrNoData(vehicle.fullData.warrantyPeriod),
//         'Daily Driving Limit': `${getValueOrNoData(vehicle.fullData.dailyDrivingLimit)} km`,
//         'Trunk Capacity': `${getValueOrNoData(vehicle.fullData.trunkCapacity)} L`,
//         'Version': getValueOrNoData(vehicle.fullData.version),
//         'Year': getValueOrNoData(vehicle.fullData.year),
//         'Color': getValueOrNoData(vehicle.fullData.color),
//     };

//     const interiorSpecs = {
//         'Screen': getValueOrNoData(vehicle.fullData.screen),
//         'Seat Material': getValueOrNoData(vehicle.fullData.seatMaterial),
//         'Interior Material': getValueOrNoData(vehicle.fullData.interiorMaterial),
//         'Air Conditioning': getValueOrNoData(vehicle.fullData.airConditioning),
//         'Speaker System': getValueOrNoData(vehicle.fullData.speakerSystem),
//         'In-Vehicle Cabinet': getValueOrNoData(vehicle.fullData.inVehicleCabinet),
//     };

//     const exteriorSpecs = {
//         'Dimensions': `${getValueOrNoData(vehicle.fullData.lengthMm)} x ${getValueOrNoData(vehicle.fullData.widthMm)} x ${getValueOrNoData(vehicle.fullData.heightMm)} mm`,
//         'Wheels': getValueOrNoData(vehicle.fullData.wheels),
//         'Headlights': getValueOrNoData(vehicle.fullData.headlights),
//         'Tail Lights': getValueOrNoData(vehicle.fullData.taillights),
//         'Frame/Chassis': getValueOrNoData(vehicle.fullData.frameChassis),
//         'Door Count': `${getValueOrNoData(vehicle.fullData.doorCount)} Doors`,
//         'Glass Windows': getValueOrNoData(vehicle.fullData.glassWindows),
//         'Mirrors': getValueOrNoData(vehicle.fullData.mirrors),
//         'Cameras': getValueOrNoData(vehicle.fullData.cameras),
//     };

//     // Stock status
//     const quantity = vehicle.fullData.quantityAvailable || 0;
//     const stockType = quantity > 1 ? 'available' : quantity === 1 ? 'limited' : 'out-of-stock';
//     const stockText = `${quantity} Available`;

//     // Images: Pad to at least 3 for carousel
//     const apiImages = vehicle.fullData.imageUrls || [];
//     const images = apiImages.length > 0 ? apiImages : ['https://via.placeholder.com/300'];
//     const paddedImages = [...images, ...images.slice(0, Math.max(3 - images.length, 0))];

//     // Title and description
//     const title = `${vehicle.make} ${vehicle.model} ${vehicle.version} (${vehicle.year})`;
//     const description = `The ${vehicle.model} ${vehicle.version} (${vehicle.year}) is a premium ${getValueOrNoData(vehicle.fullData.vehicleType)} with ${getValueOrNoData(vehicle.fullData.color)} finish.`;

//     // Render specs list
//     const renderSpecsList = (specs, isOverview = false) => (
//         <List
//             dataSource={Object.entries(specs)}
//             renderItem={([label, value]) => (
//                 <List.Item>
//                     <Text strong style={{ width: 200 }}>{label}:</Text>
//                     <Text>{value}</Text>
//                 </List.Item>
//             )}
//         >
//             {isOverview && (
//                 <>
//                     <List.Item>
//                         <Text strong style={{ width: 200 }}>Stock:</Text>
//                         <Tag color={stockType === 'available' ? 'green' : stockType === 'limited' ? 'orange' : 'red'}>
//                             {stockText}
//                         </Tag>
//                     </List.Item>
//                     <List.Item>
//                         <Text strong style={{ width: 200 }}>Brand:</Text>
//                         <Text>{vehicle.fullData.brand.name}</Text>
//                     </List.Item>
//                     <List.Item>
//                         <Text strong style={{ width: 200 }}>Country:</Text>
//                         <Text>{vehicle.fullData.brand.country}</Text>
//                     </List.Item>
//                     <List.Item>
//                         <Text strong style={{ width: 200 }}>Website:</Text>
//                         <Text>
//                             <a href={vehicle.fullData.brand.website} target="_blank" rel="noopener noreferrer">
//                                 {vehicle.fullData.brand.website}
//                             </a>
//                         </Text>
//                     </List.Item>
//                     <List.Item>
//                         <Text strong style={{ width: 200 }}>Founded:</Text>
//                         <Text>{vehicle.fullData.brand.founderYear}</Text>
//                     </List.Item>
//                 </>
//             )}
//         </List>
//     );

//     // Render tab content
//     const renderTabContent = (tabKey) => {
//         const specs = tabKey === 'overview' ? overviewSpecs : tabKey === 'interior' ? interiorSpecs : exteriorSpecs;
//         return (
//             <Card style={{ border: 'none' }}>
//                 <div style={{ marginBottom: 16 }}>
//                     <Text strong style={{ fontSize: 20 }}>{vehicle.price.toLocaleString()} VND</Text>
//                     <Tag style={{ marginLeft: 8 }}>
//                         {tabKey.charAt(0).toUpperCase() + tabKey.slice(1)}
//                     </Tag>
//                 </div>
//                 {renderSpecsList(specs, tabKey === 'overview')}
//             </Card>
//         );
//     };

//     return (
//         <div className="ev-dashboard">
//             <Row gutter={16}>
//                 <Col xs={24} md={12}>
//                     <Carousel autoplay style={{ background: '#f5f5f5', borderRadius: 8 }}>
//                         {paddedImages.map((img, index) => (
//                             <div key={index}>
//                                 <Image
//                                     src={img}
//                                     width="100%"
//                                     height={300}
//                                     style={{ objectFit: 'cover', borderRadius: 8 }}
//                                     preview={false}
//                                     alt={`${title} image ${index + 1}`}
//                                 />
//                             </div>
//                         ))}
//                     </Carousel>
//                 </Col>
//                 <Col xs={24} md={12}>
//                     <Title level={3}>{title}</Title>
//                     <Text>{description}</Text>
//                     <Tabs activeKey={activeTab} onChange={setActiveTab} centered>
//                         <TabPane tab="Overview" key="overview">
//                             {renderTabContent('overview')}
//                         </TabPane>
//                         <TabPane tab="Interior" key="interior">
//                             {renderTabContent('interior')}
//                         </TabPane>
//                         <TabPane tab="Exterior" key="exterior">
//                             {renderTabContent('exterior')}
//                         </TabPane>
//                     </Tabs>
//                     <div style={{ textAlign: 'right', marginTop: 16 }}>
//                         <Button type="primary" onClick={onClose}>
//                             Close
//                         </Button>
//                     </div>
//                 </Col>
//             </Row>
//         </div>
//     );
// };

// export default VehicleDetailModal;

//---------------------------------------------------------------------------------------------------------//

// import React, { useState } from 'react';
// import { Tabs, Carousel, List, Card, Image, Button, Row, Col, Typography, Tag, Divider } from 'antd';
// import '../../../styles/dealerStaffManager/ManageVehicle.scss';

// const { TabPane } = Tabs;
// const { Title, Text } = Typography;

// const VehicleDetailModal = ({ vehicle, brandsData, storagesData, onClose }) => {
//     const [activeTab, setActiveTab] = useState('overview');

//     if (!vehicle || !brandsData || !storagesData) {
//         return <div>Data Not Found</div>;
//     }

//     // Get brand and storage data
//     const brand = brandsData.find(b => b.brandId === vehicle.fullData.brandId) || {
//         brandName: 'Unknown',
//         country: 'No Data',
//         website: 'No Data',
//         founderYear: 'No Data',
//     };
//     const storage = storagesData.find(s => s.vehicleId === vehicle.id) || { quantityAvailable: 0 };

//     // Helper to handle null/undefined values
//     const getValueOrNoData = (val) => val || 'No Data';

//     // Format specs similar to VehicleDetailPage
//     const overviewSpecs = {
//         'Vehicle Type': getValueOrNoData(vehicle.fullData.vehicleType),
//         'Range per Charge': getValueOrNoData(vehicle.fullData.rangePerCharge),
//         'Battery Capacity': getValueOrNoData(vehicle.fullData.batteryCapacity),
//         'Horsepower': `${getValueOrNoData(vehicle.fullData.horsepower)} HP`,
//         'Transmission': getValueOrNoData(vehicle.fullData.transmission),
//         'Seating Capacity': `${getValueOrNoData(vehicle.fullData.seatingCapacity)} Seats`,
//         'Airbags': `${getValueOrNoData(vehicle.fullData.airbags)}`,
//         'Warranty': getValueOrNoData(vehicle.fullData.warrantyPeriod),
//         'Daily Driving Limit': `${getValueOrNoData(vehicle.fullData.dailyDrivingLimit)} km`,
//         'Trunk Capacity': `${getValueOrNoData(vehicle.fullData.trunkCapacity)} L`,
//         'Version': getValueOrNoData(vehicle.fullData.version),
//         'Year': getValueOrNoData(vehicle.fullData.year),
//         'Color': getValueOrNoData(vehicle.fullData.color),
//     };

//     const interiorSpecs = {
//         'Screen': getValueOrNoData(vehicle.fullData.screen),
//         'Seat Material': getValueOrNoData(vehicle.fullData.seatMaterial),
//         'Interior Material': getValueOrNoData(vehicle.fullData.interiorMaterial),
//         'Air Conditioning': getValueOrNoData(vehicle.fullData.airConditioning),
//         'Speaker System': getValueOrNoData(vehicle.fullData.speakerSystem),
//         'In-Vehicle Cabinet': getValueOrNoData(vehicle.fullData.inVehicleCabinet),
//     };

//     const exteriorSpecs = {
//         'Dimensions': `${getValueOrNoData(vehicle.fullData.lengthMm)} x ${getValueOrNoData(vehicle.fullData.widthMm)} x ${getValueOrNoData(vehicle.fullData.heightMm)} mm`,
//         'Wheels': getValueOrNoData(vehicle.fullData.wheels),
//         'Headlights': getValueOrNoData(vehicle.fullData.headlights),
//         'Tail Lights': getValueOrNoData(vehicle.fullData.taillights),
//         'Frame/Chassis': getValueOrNoData(vehicle.fullData.frameChassis),
//         'Door Count': `${getValueOrNoData(vehicle.fullData.doorCount)} Doors`,
//         'Glass Windows': getValueOrNoData(vehicle.fullData.glassWindows),
//         'Mirrors': getValueOrNoData(vehicle.fullData.mirrors),
//         'Cameras': getValueOrNoData(vehicle.fullData.cameras),
//     };

//     // Stock status
//     const quantity = storage.quantityAvailable || 0;
//     const stockType = quantity > 1 ? 'available' : quantity === 1 ? 'limited' : 'out-of-stock';
//     const stockText = `${quantity} Available`;

//     // Images: Pad to at least 3 for carousel
//     const apiImages = vehicle.fullData.imageUrls || [];
//     const images = apiImages.length > 0 ? apiImages : ['https://via.placeholder.com/300'];
//     const paddedImages = [...images, ...images.slice(0, Math.max(3 - images.length, 0))];

//     // Title and description
//     const title = `${brand.brandName} ${vehicle.model} ${vehicle.version} (${vehicle.year})`;
//     const description = `The ${vehicle.model} ${vehicle.version} (${vehicle.year}) is a premium ${getValueOrNoData(vehicle.fullData.vehicleType)} with ${getValueOrNoData(vehicle.fullData.color)} finish.`;

//     // Render specs list
//     const renderSpecsList = (specs) => (
//         <List
//             dataSource={Object.entries(specs)}
//             renderItem={([label, value]) => (
//                 <List.Item>
//                     <Text strong style={{ width: 200 }}>{label}:</Text>
//                     <Text>{value}</Text>
//                 </List.Item>
//             )}
//         />
//     );

//     // Render brand info
//     const renderBrandInfo = () => (
//         <>
//             <Divider orientation="left">Brand Information</Divider>
//             <List>
//                 <List.Item>
//                     <Text strong style={{ width: 200 }}>Brand:</Text>
//                     <Text>{brand.brandName}</Text>
//                 </List.Item>
//                 <List.Item>
//                     <Text strong style={{ width: 200 }}>Country:</Text>
//                     <Text>{brand.country}</Text>
//                 </List.Item>
//                 <List.Item>
//                     <Text strong style={{ width: 200 }}>Website:</Text>
//                     <Text>
//                         <a href={brand.website} target="_blank" rel="noopener noreferrer">
//                             {brand.website}
//                         </a>
//                     </Text>
//                 </List.Item>
//                 <List.Item>
//                     <Text strong style={{ width: 200 }}>Founded:</Text>
//                     <Text>{brand.founderYear}</Text>
//                 </List.Item>
//             </List>
//         </>
//     );

//     // Render tab content
//     const renderTabContent = (tabKey) => {
//         const specs = tabKey === 'overview' ? overviewSpecs : tabKey === 'interior' ? interiorSpecs : exteriorSpecs;
//         return (
//             <Card style={{ border: 'none' }}>
//                 <div style={{ marginBottom: 16 }}>
//                     <Text strong style={{ fontSize: 20 }}>{vehicle.price.toLocaleString()} VND</Text>
//                     <Tag style={{ marginLeft: 8 }}>
//                         {tabKey.charAt(0).toUpperCase() + tabKey.slice(1)}
//                     </Tag>
//                 </div>
//                 {tabKey === 'overview' ? (
//                     <>
//                         <Divider orientation="left">Vehicle Specifications</Divider>
//                         <List>
//                             <List.Item>
//                                 <Text strong style={{ width: 200 }}>Stock:</Text>
//                                 <Tag color={stockType === 'available' ? 'green' : stockType === 'limited' ? 'orange' : 'red'}>
//                                     {stockText}
//                                 </Tag>
//                             </List.Item>
//                             {renderSpecsList(specs)}
//                         </List>
//                         {renderBrandInfo()}
//                     </>
//                 ) : (
//                     renderSpecsList(specs)
//                 )}
//             </Card>
//         );
//     };

//     return (
//         <div className="ev-dashboard">
//             <Row gutter={16}>
//                 <Col xs={24} md={12}>
//                     <Carousel autoplay style={{ background: '#f5f5f5', borderRadius: 8 }}>
//                         {paddedImages.map((img, index) => (
//                             <div key={index}>
//                                 <Image
//                                     src={img}
//                                     width="100%"
//                                     height={300}
//                                     style={{ objectFit: 'cover', borderRadius: 8 }}
//                                     preview={false}
//                                     alt={`${title} image ${index + 1}`}
//                                 />
//                             </div>
//                         ))}
//                     </Carousel>
//                 </Col>
//                 <Col xs={24} md={12}>
//                     <Title level={3}>{title}</Title>
//                     <Text>{description}</Text>
//                     <Tabs activeKey={activeTab} onChange={setActiveTab} centered>
//                         <TabPane tab="Overview" key="overview">
//                             {renderTabContent('overview')}
//                         </TabPane>
//                         <TabPane tab="Interior" key="interior">
//                             {renderTabContent('interior')}
//                         </TabPane>
//                         <TabPane tab="Exterior" key="exterior">
//                             {renderTabContent('exterior')}
//                         </TabPane>
//                     </Tabs>
//                     <div style={{ textAlign: 'right', marginTop: 16 }}>
//                         <Button type="primary" onClick={onClose}>
//                             Close
//                         </Button>
//                     </div>
//                 </Col>
//             </Row>
//         </div>
//     );
// };

// export default VehicleDetailModal;

// fix ------------------------------------------------------------------------------------------------------------
import React, { useState } from 'react';
import { Tabs, Carousel, List, Card, Image, Button, Row, Col, Typography, Tag, Divider } from 'antd';
import '../../../styles/dealerStaffManager/ManageVehicle.scss';

const { TabPane } = Tabs;
const { Title, Text } = Typography;

const VehicleDetailModal = ({ vehicle, brandsData, onClose }) => {
    const [activeTab, setActiveTab] = useState('overview');

    if (!vehicle || !brandsData ) {
        return <div>Data Not Found</div>;
    }

    // Get brand and storage data
    const brand = brandsData.find(b => b.brandId === vehicle.fullData.brandId) || {
        brandName: 'Unknown',
        country: 'No Data',
        website: 'No Data',
        founderYear: 'No Data',
    };
     

    // Helper to handle null/undefined values
    const getValueOrNoData = (val) => val || 'No Data';

    // Format specs similar to VehicleDetailPage
    const overviewSpecs = {
        'Vehicle Type': getValueOrNoData(vehicle.fullData.vehicleType),
        'Range per Charge': getValueOrNoData(vehicle.fullData.rangePerCharge),
        'Battery Capacity': getValueOrNoData(vehicle.fullData.batteryCapacity),
        'Horsepower': `${getValueOrNoData(vehicle.fullData.horsepower)} HP`,
        'Transmission': getValueOrNoData(vehicle.fullData.transmission),
        'Seating Capacity': `${getValueOrNoData(vehicle.fullData.seatingCapacity)} Seats`,
        'Airbags': `${getValueOrNoData(vehicle.fullData.airbags)}`,
        'Warranty': getValueOrNoData(vehicle.fullData.warrantyPeriod),
        'Daily Driving Limit': `${getValueOrNoData(vehicle.fullData.dailyDrivingLimit)} km`,
        'Trunk Capacity': `${getValueOrNoData(vehicle.fullData.trunkCapacity)} L`,
        'Version': getValueOrNoData(vehicle.fullData.version),
        'Year': getValueOrNoData(vehicle.fullData.year),
        'Color': getValueOrNoData(vehicle.fullData.color),
    };

    const interiorSpecs = {
        'Screen': getValueOrNoData(vehicle.fullData.screen),
        'Seat Material': getValueOrNoData(vehicle.fullData.seatMaterial),
        'Interior Material': getValueOrNoData(vehicle.fullData.interiorMaterial),
        'Air Conditioning': getValueOrNoData(vehicle.fullData.airConditioning),
        'Speaker System': getValueOrNoData(vehicle.fullData.speakerSystem),
        'In-Vehicle Cabinet': getValueOrNoData(vehicle.fullData.inVehicleCabinet),
    };

    const exteriorSpecs = {
        'Dimensions': `${getValueOrNoData(vehicle.fullData.lengthMm)} x ${getValueOrNoData(vehicle.fullData.widthMm)} x ${getValueOrNoData(vehicle.fullData.heightMm)} mm`,
        'Wheels': getValueOrNoData(vehicle.fullData.wheels),
        'Headlights': getValueOrNoData(vehicle.fullData.headlights),
        'Tail Lights': getValueOrNoData(vehicle.fullData.taillights),
        'Frame/Chassis': getValueOrNoData(vehicle.fullData.frameChassis),
        'Door Count': `${getValueOrNoData(vehicle.fullData.doorCount)} Doors`,
        'Glass Windows': getValueOrNoData(vehicle.fullData.glassWindows),
        'Mirrors': getValueOrNoData(vehicle.fullData.mirrors),
        'Cameras': getValueOrNoData(vehicle.fullData.cameras),
    };

    // Stock status
 //   const quantity = storage.quantityAvailable || 0;
 //   const stockType = quantity > 1 ? 'available' : quantity === 1 ? 'limited' : 'out-of-stock';
  // const stockText = `${quantity} Available`;

    // Images: Pad to at least 3 for carousel
    const apiImages = vehicle.fullData.imageUrls || [];
    const images = apiImages.length > 0 ? apiImages : ['https://via.placeholder.com/300'];
    const paddedImages = [...images, ...images.slice(0, Math.max(3 - images.length, 0))];

    // Title and description
    const title = `${brand.brandName} ${vehicle.model} ${vehicle.version} (${vehicle.year})`;
    const description = `The ${vehicle.model} ${vehicle.version} (${vehicle.year}) is a premium ${getValueOrNoData(vehicle.fullData.vehicleType)} with ${getValueOrNoData(vehicle.fullData.color)} finish.`;

    // Render specs list
    const renderSpecsList = (specs) => (
        <List
            dataSource={Object.entries(specs)}
            renderItem={([label, value]) => (
                <List.Item>
                    <Text strong style={{ width: 200 }}>{label}:</Text>
                    <Text>{value}</Text>
                </List.Item>
            )}
        />
    );

    // Render brand info
    const renderBrandInfo = () => (
        <>
            <Divider orientation="left">Brand Information</Divider>
            <List>
                <List.Item>
                    <Text strong style={{ width: 200 }}>Brand:</Text>
                    <Text>{brand.brandName}</Text>
                </List.Item>
                <List.Item>
                    <Text strong style={{ width: 200 }}>Country:</Text>
                    <Text>{brand.country}</Text>
                </List.Item>
                <List.Item>
                    <Text strong style={{ width: 200 }}>Website:</Text>
                    <Text>
                        <a href={brand.website} target="_blank" rel="noopener noreferrer">
                            {brand.website}
                        </a>
                    </Text>
                </List.Item>
                <List.Item>
                    <Text strong style={{ width: 200 }}>Founded:</Text>
                    <Text>{brand.founderYear}</Text>
                </List.Item>
            </List>
        </>
    );

    // Render tab content
    const renderTabContent = (tabKey) => {
        const specs = tabKey === 'overview' ? overviewSpecs : tabKey === 'interior' ? interiorSpecs : exteriorSpecs;
        return (
            <Card style={{ border: 'none' }}>
                <div style={{ marginBottom: 16 }}>
                    <Text strong style={{ fontSize: 20 }}>{vehicle.price.toLocaleString()} VND</Text>
                    <Tag style={{ marginLeft: 8 }}>
                        {tabKey.charAt(0).toUpperCase() + tabKey.slice(1)}
                    </Tag>
                </div>
                {tabKey === 'overview' ? (
                    <>
                        <Divider orientation="left">Vehicle Specifications</Divider>
                        <List>
                            <List.Item>
                                <Text strong style={{ width: 200 }}>Stock:</Text>
                                {/* <Tag color={stockType === 'available' ? 'green' : stockType === 'limited' ? 'orange' : 'red'}>
                                    {stockText}
                                </Tag> */}
                            </List.Item>
                            {renderSpecsList(specs)}
                        </List>
                        {renderBrandInfo()}
                    </>
                ) : (
                    renderSpecsList(specs)
                )}
            </Card>
        );
    };

    return (
        <div className="ev-dashboard">
            <Row gutter={16}>
                <Col xs={24} md={12}>
                    <Carousel autoplay style={{ background: '#f5f5f5', borderRadius: 8 }}>
                        {paddedImages.map((img, index) => (
                            <div key={index}>
                                <Image
                                    src={img}
                                    width="100%"
                                    height={300}
                                    style={{ objectFit: 'cover', borderRadius: 8 }}
                                    preview={false}
                                    alt={`${title} image ${index + 1}`}
                                />
                            </div>
                        ))}
                    </Carousel>
                </Col>
                <Col xs={24} md={12}>
                    <Title level={3}>{title}</Title>
                    <Text>{description}</Text>
                    <Tabs activeKey={activeTab} onChange={setActiveTab} centered>
                        <TabPane tab="Overview" key="overview">
                            {renderTabContent('overview')}
                        </TabPane>
                        <TabPane tab="Interior" key="interior">
                            {renderTabContent('interior')}
                        </TabPane>
                        <TabPane tab="Exterior" key="exterior">
                            {renderTabContent('exterior')}
                        </TabPane>
                    </Tabs>
                    <div style={{ textAlign: 'right', marginTop: 16 }}>
                        <Button type="primary" onClick={onClose}>
                            Close
                        </Button>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default VehicleDetailModal;