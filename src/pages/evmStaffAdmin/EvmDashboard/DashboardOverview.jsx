import React, { useState, useEffect } from 'react';
import { Row, Col, Spin, Alert } from 'antd';
import KpiCards from './KpiCards';
import InventoryDistributionChart from './InventoryDistributionChart';
import TopModelsChart from './TopModelsChart'; // Import Donut Chart mới

import ManageVehicleService from '../../../services/ManageVehicleService/ManageVehicleService.jsx';
import ManageStorageService from '../../../services/ManageStorage/ManageStorageService.jsx';
import ManageStoreService from '../../../services/ManageStore/ManageStoreService.jsx';

const DashboardOverview = () => {
  const [loading, setLoading] = useState(true);
  
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalModels: 0,
      totalStock: 0, // <--- TRƯỜNG MỚI
      totalCentralStock: 0,
      totalStoreStock: 0,
      totalInventoryValue: 0,
      totalStores: 0,
    },
    distributionData: [],
    modelStats: [],
    allocation: { central: 0, stores: 0 }
  });

  const [quantityCache, setQuantityCache] = useState({});
  const brandId = JSON.parse(localStorage.getItem('staffInfo') || '{}').brandId;

  useEffect(() => {
    if (brandId) fetchAllData();
  }, [brandId]);

  const fetchQuantityForVehicle = async (vehicleId, storeId = null) => {
    const cacheKey = storeId === null ? `${vehicleId}_central` : `${vehicleId}_${storeId}`;
    if (quantityCache[cacheKey] !== undefined) return quantityCache[cacheKey];
    try {
      const data = await ManageStorageService.filterStorageByBrandIdAndVehicleId(brandId, vehicleId);
      const records = Array.isArray(data) ? data : [];
      const record = records.find(r => r.storeId === storeId);
      const qty = record?.quantityAvailable ?? 0;
      setQuantityCache(prev => ({ ...prev, [cacheKey]: qty }));
      return qty;
    } catch (error) { return error; }
  };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [vehiclesRes, storesRes] = await Promise.all([
        ManageVehicleService.getAllVehicleByBrandId(brandId),
        ManageStoreService.getAllStores(),
      ]);

      const vehicles = Array.isArray(vehiclesRes) ? vehiclesRes : vehiclesRes.data || [];
      const stores = Array.isArray(storesRes) ? storesRes : storesRes.data || [];

      const locationMap = { 'Central Warehouse': { total: 0, details: [] } };
      stores.forEach(s => locationMap[s.storeName] = { total: 0, details: [] });

      let totalCentral = 0;
      let totalInStores = 0;
      let totalValue = 0;
      const modelCountMap = {}; 

      for (const vehicle of vehicles) {
        const vehicleName = vehicle.name || vehicle.modelName || `Model ${vehicle.vehicleId}`;
        const price = vehicle.price || 0;
        let vehicleTotalQty = 0; 

        // 1. Central
        const centralQty = await fetchQuantityForVehicle(vehicle.vehicleId, null);
        if (centralQty > 0) {
          totalCentral += centralQty;
          vehicleTotalQty += centralQty;
          locationMap['Central Warehouse'].total += centralQty;
          locationMap['Central Warehouse'].details.push({ name: vehicleName, qty: centralQty });
        }

        // 2. Stores
        for (const store of stores) {
          const storeQty = await fetchQuantityForVehicle(vehicle.vehicleId, store.storeId);
          if (storeQty > 0) {
            totalInStores += storeQty;
            vehicleTotalQty += storeQty;
            locationMap[store.storeName].total += storeQty;
            locationMap[store.storeName].details.push({ name: vehicleName, qty: storeQty });
          }
        }

        totalValue += vehicleTotalQty * price;

        if (vehicleTotalQty > 0) {
          modelCountMap[vehicleName] = (modelCountMap[vehicleName] || 0) + vehicleTotalQty;
        }
      }

      // --- FORMAT DỮ LIỆU ---
      const distData = Object.keys(locationMap)
        .map(name => ({
          location: name,
          units: locationMap[name].total,
          details: locationMap[name].details
        }))
        .sort((a, b) => b.units - a.units);

      const modelData = Object.keys(modelCountMap).map(key => ({
        name: key,
        value: modelCountMap[key]
      }));

      // TÍNH TỔNG STOCK TOÀN BỘ
      const totalStock = totalCentral + totalInStores;

      setDashboardData({
        stats: {
          totalModels: vehicles.length,
          totalStock: totalStock, // <--- GÁN GIÁ TRỊ MỚI TẠI ĐÂY
          totalCentralStock: totalCentral,
          totalStoreStock: totalInStores,
          totalInventoryValue: totalValue,
          totalStores: stores.length,
        },
        distributionData: distData,
        modelStats: modelData,
        allocation: { central: totalCentral, stores: totalInStores }
      });

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!brandId) return <Alert message="Error" description="No Brand ID" type="error" />;
  
  if (loading) return (
    <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Spin size="large" tip="Loading dashboard..." />
    </div>
  );

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <h1 style={{ fontSize: 24, marginBottom: 24, fontWeight: '700', color: '#001529' }}>
        Dashboard Overview
      </h1>
      
      {/* KPI Cards (Hiển thị 6 cards) */}
      <KpiCards stats={dashboardData.stats} />

      {/* Hàng chứa 2 biểu đồ */}
      <Row gutter={[24, 24]}>
        {/* Chart Bên Trái: Phân bố kho (Chiếm 60-65%) */}
        <Col xs={24} lg={15} xl={16}>
          <InventoryDistributionChart 
            distributionData={dashboardData.distributionData} 
            loading={loading} 
          />
        </Col>

        {/* Chart Bên Phải: Top Models Donut (Chiếm phần còn lại) */}
        <Col xs={24} lg={9} xl={8}>
           <TopModelsChart data={dashboardData.modelStats} />
        </Col>
      </Row>
    </div>
  );
};

export default DashboardOverview;