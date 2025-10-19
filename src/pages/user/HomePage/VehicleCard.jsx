// // src/pages/user/HomePage/VehicleCard.jsx (updated - remove onShowDetail)
// import React from 'react';
// import { Card } from 'react-bootstrap';
// import ActionButtons from './ActionButtons';
// import '../../../styles/VehicleCard.scss';

// const VehicleCard = ({ vehicle, selectedVehicles, selectedCount, onToggleCompare }) => {
//     const imageSrc = vehicle.images ? vehicle.images[0] : vehicle.image || 'https://via.placeholder.com/300x220?text=No+Image';

//     return (
//         <Card className="vehicle-card eco-card">
//             <div className="card-image-wrapper">
//                 <Card.Img
//                     variant="top"
//                     src={imageSrc}
//                     alt={vehicle.title}
//                     className="eco-card-img"
//                     onError={(e) => {
//                         e.target.src = 'https://via.placeholder.com/300x220?text=No+Image';
//                     }}
//                 />
//                 <div className={`stock-badge eco-badge ${vehicle.stockType}`}>
//                     {vehicle.stock}
//                 </div>
//             </div>
//             <Card.Body className="eco-card-body">
//                 <Card.Title className="eco-card-title">{vehicle.title}</Card.Title>
//                 <Card.Text className="eco-card-text">
//                     <div>Brand: {vehicle.specs.brand}</div>
//                     <div>Version: {vehicle.specs.version}</div>
//                     <div>Color: {vehicle.specs.color}</div>
//                     <div>Battery: {vehicle.specs.battery}</div>

//                 </Card.Text>
//                 <Card.Text className="eco-price">{vehicle.specs.price}</Card.Text>
//                 <ActionButtons
//                     vehicle={vehicle}
//                     vehicleId={vehicle.id}
//                     selectedVehicles={selectedVehicles}
//                     selectedCount={selectedCount}
//                     onToggleCompare={onToggleCompare}
//                 />
//             </Card.Body>
//         </Card>
//     );
// };

// export default VehicleCard;

// src/pages/user/HomePage/VehicleCard.jsx (updated: use first API image, handle no image)
import React from 'react';
import { Card } from 'react-bootstrap';
import ActionButtons from './ActionButtons';
import '../../../styles/VehicleCard.scss';

const VehicleCard = ({ vehicle, selectedVehicles, selectedCount, onToggleCompare }) => {
    // Use first image from API imageUrls, fallback to placeholder
    const imageSrc = vehicle.images && vehicle.images.length > 0 ? vehicle.images[0] : 'https://via.placeholder.com/300x220?text=No+Image';

    return (
        <Card className="vehicle-card eco-card">
            <div className="card-image-wrapper">
                <Card.Img
                    variant="top"
                    src={imageSrc}
                    alt={vehicle.title}
                    className="eco-card-img"
                    onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x220?text=No+Image';
                    }}
                />
                <div className={`stock-badge eco-badge ${vehicle.stockType}`}>
                    {vehicle.stock}
                </div>
            </div>
            <Card.Body className="eco-card-body">
                <Card.Title className="eco-card-title">{vehicle.title}</Card.Title>
                <Card.Text className="eco-card-text">
                    <div>Brand: {vehicle.specs.brand}</div>
                    <div>Version: {vehicle.specs.version}</div>
                    <div>Color: {vehicle.specs.color}</div>
                    <div>Battery: {vehicle.specs.battery}</div>
                </Card.Text>
                <Card.Text className="eco-price">{vehicle.specs.price}</Card.Text>
                <ActionButtons
                    vehicle={vehicle}
                    vehicleId={vehicle.id}
                    selectedVehicles={selectedVehicles}
                    selectedCount={selectedCount}
                    onToggleCompare={onToggleCompare}
                />
            </Card.Body>
        </Card>
    );
};

export default VehicleCard;