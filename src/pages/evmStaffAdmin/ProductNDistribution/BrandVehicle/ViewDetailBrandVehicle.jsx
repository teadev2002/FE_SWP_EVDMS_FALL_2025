import React, { useState, useEffect } from 'react';
import { Modal, Button, Descriptions, Image, Typography, Tabs, Carousel, Tag, Divider } from 'antd';
import ManageStoreService from '../../../../services/ManageStore/ManageStoreService.jsx';
import ManageVehicleService from '../../../../services/ManageVehicleService/ManageVehicleService.jsx';
import ManageStorageService from '../../../../services/ManageStorage/ManageStorageService.jsx';
import { toast } from 'react-toastify';
import '../../../../styles/dealerStaffManager/ManageVehicle.scss';

const { Text } = Typography;
const { TabPane } = Tabs;

const ViewDetailBrandVehicle = ({
  vehicleId,
  isDetailModalVisible,
  handleDetailCancel,
  vehicles, // Nhận danh sách vehicles để lấy brandId
}) => {
  const [vehicle, setVehicle] = useState(null);
  const [storeName, setStoreName] = useState('N/A');
  const [storageInfo, setStorageInfo] = useState({
    quantityAvailable: 'Loading...',
    lastUpdated: 'N/A',
  });
  const [loading, setLoading] = useState(false);
console.log(storeName);
  useEffect(() => {
    if (!vehicleId || !isDetailModalVisible) {
      setVehicle(null);
      setStoreName('N/A');
      setStorageInfo({ quantityAvailable: 'N/A', lastUpdated: 'N/A' });
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const vehicleData = await ManageVehicleService.GetVehicleById(vehicleId);
        const fullVehicle = { ...vehicleData, status: vehicleData.status || 'Active' };
        setVehicle(fullVehicle);

        const currentVehicle = vehicles.find(v => v.vehicleId === vehicleId);
        if (!currentVehicle?.brandId) {
          setStoreName('N/A');
          setStorageInfo({ quantityAvailable: 'N/A', lastUpdated: 'N/A' });
          return;
        }

        const data = await ManageStorageService.filterStorageByBrandIdAndVehicleId(
          currentVehicle.brandId,
          vehicleId
        );

        if (data && data.length > 0) {
          const info = data[0];
          setStorageInfo({
            quantityAvailable: info.quantityAvailable,
            lastUpdated: info.lastUpdated || 'N/A',
          });

          if (info.storeId) {
            try {
              const storeData = await ManageStoreService.getStoreById(info.storeId);
              setStoreName(storeData.storeName || 'N/A');
            } catch (err) {
              console.error('Failed to fetch store name:', err);
              setStoreName('N/A');
            }
          } else {
            setStoreName('N/A');
          }
        } else {
          setStorageInfo({ quantityAvailable: 'N/A', lastUpdated: 'N/A' });
          setStoreName('N/A');
        }
      } catch (error) {
        console.error('Failed to fetch details:', error);
        toast.error('Failed to load vehicle details');
        setVehicle(null);
        setStoreName('N/A');
        setStorageInfo({ quantityAvailable: 'Error', lastUpdated: 'N/A' });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [vehicleId, isDetailModalVisible, vehicles]);

  const getStockTagClass = (quantity) => {
    if (typeof quantity !== 'number') return 'out-of-stock';
    if (quantity > 1) return 'available';
    if (quantity === 1) return 'limited';
    return 'out-of-stock';
  };

  return (
    <Modal
      title="Vehicle Details"
      open={isDetailModalVisible}
      onCancel={handleDetailCancel}
      footer={[
        <Button key="close" type="primary" onClick={handleDetailCancel} disabled={loading}>
          Close
        </Button>,
      ]}
      width="80%"
      centered
      className="ev-dashboard"
    >
      {loading ? (
        <Text>Loading...</Text>
      ) : vehicle ? (
        <div>
          <Carousel autoplay>
            {vehicle.imageUrls && vehicle.imageUrls.length > 0 ? (
              vehicle.imageUrls.map((url, index) => (
                <div key={index}>
                  <Image src={url} width="100%" height={300} style={{ objectFit: 'cover', borderRadius: 8 }} />
                </div>
              ))
            ) : (
              <Text>No images available</Text>
            )}
          </Carousel>

          <Tabs defaultActiveKey="1">
            <TabPane tab="General Information" key="1">
              <Descriptions bordered column={2} style={{ marginTop: 16 }}>
                <Descriptions.Item label="Model">{vehicle.modelName || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Version">{vehicle.version || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Color">{vehicle.color || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Price">
                  {vehicle.price >= 1000000
                    ? `${(vehicle.price / 1000000).toFixed(2)}M`
                    : `$${vehicle.price?.toFixed(2) || 'N/A'}`}
                </Descriptions.Item>
                <Descriptions.Item label="Vehicle Type">{vehicle.vehicleType || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Status">
                  <Tag className={vehicle.status === 'Active' ? 'available' : 'out-of-stock'}>
                    {vehicle.status || 'N/A'}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Year">{vehicle.year || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Battery Capacity">{vehicle.batteryCapacity || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Range per Charge">{vehicle.rangePerCharge || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Warranty">{vehicle.warrantyPeriod || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Horsepower">{vehicle.horsepower || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Transmission">{vehicle.transmission || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Airbags">{vehicle.airbags || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Seating Capacity">{vehicle.seatingCapacity || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Trunk Capacity">{vehicle.trunkCapacity ? `${vehicle.trunkCapacity} L` : 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Daily Driving Limit">{vehicle.dailyDrivingLimit ? `${vehicle.dailyDrivingLimit} km` : 'N/A'}</Descriptions.Item>
              </Descriptions>
            </TabPane>
            <TabPane tab="Interior Specifications" key="2">
              <Descriptions bordered column={2} style={{ marginTop: 16 }}>
                <Descriptions.Item label="Screen">{vehicle.screen || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Seat Material">{vehicle.seatMaterial || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Interior Material">{vehicle.interiorMaterial || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Air Conditioning">{vehicle.airConditioning || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Speaker System">{vehicle.speakerSystem || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="In-Vehicle Cabinet">{vehicle.inVehicleCabinet || 'N/A'}</Descriptions.Item>
              </Descriptions>
            </TabPane>
            <TabPane tab="Exterior Specifications" key="3">
              <Descriptions bordered column={2} style={{ marginTop: 16 }}>
                <Descriptions.Item label="Length">{vehicle.lengthMm ? `${vehicle.lengthMm} mm` : 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Width">{vehicle.widthMm ? `${vehicle.widthMm} mm` : 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Height">{vehicle.heightMm ? `${vehicle.heightMm} mm` : 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Wheels">{vehicle.wheels || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Headlights">{vehicle.headlights || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Taillights">{vehicle.taillights || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Frame/Chassis">{vehicle.frameChassis || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Door Count">{vehicle.doorCount || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Glass Windows">{vehicle.glassWindows || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Mirrors">{vehicle.mirrors || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Cameras">{vehicle.cameras || 'N/A'}</Descriptions.Item>
              </Descriptions>
            </TabPane>
          </Tabs>

          <Divider orientation="left">Storage Information</Divider>
          <Descriptions bordered column={2}>
            {/* <Descriptions.Item label="Store Name">{storeName}</Descriptions.Item> */}
            <Descriptions.Item label="Quantity Available">
              <Tag className={getStockTagClass(storageInfo.quantityAvailable)}>
                {storageInfo.quantityAvailable} Available
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Last Updated">
              {storageInfo.lastUpdated}
            </Descriptions.Item>
          </Descriptions>
        </div>
      ) : (
        <Text>Failed to load vehicle details</Text>
      )}
    </Modal>
  );
};

export default ViewDetailBrandVehicle;