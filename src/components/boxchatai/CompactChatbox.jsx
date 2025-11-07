/// nạp data backend
// import React, { useState, useEffect, useRef } from 'react';
// import { GoogleGenerativeAI } from '@google/generative-ai';
// import { MessageOutlined, CloseOutlined, SendOutlined } from '@ant-design/icons';
// import { Button, Input, Spin } from 'antd';
// import dayjs from 'dayjs';

// // Import your services
// import ManageStorageService from '../../services/ManageStorage/ManageStorageService';
// import ManageVehicleService from '../../services/ManageVehicleService/ManageVehicleService';
// import ManageStoreService from '../../services/ManageStore/ManageStoreService';
// import ManageBrandService from '../../services/ManageBrand/ManageBrandService';

// const API_KEY = import.meta.env.VITE_GOOGLE_AI_API_KEY?.trim();
// const STORAGE_KEY = 'hta_chat_history_compact';

// const CompactChatbox = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const messagesEndRef = useRef(null);
//   const inputRef = useRef(null);

//   const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;
//   const model = genAI ? genAI.getGenerativeModel({ model: 'gemini-2.0-flash' }) : null;

//   // Load chat history
//   useEffect(() => {
//     const saved = localStorage.getItem(STORAGE_KEY);
//     if (saved) {
//       try {
//         const parsed = JSON.parse(saved);
//         if (Array.isArray(parsed.messages)) setMessages(parsed.messages);
//       } catch (e) {
//         console.warn('Failed to load chat history',e);
//       }
//     }
//   }, []);

//   // Auto scroll
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   // Save session
//   const saveSession = (updated) => {
//     try {
//       localStorage.setItem(STORAGE_KEY, JSON.stringify({ messages: updated }));
//     } catch (e) {
//         console.warn('Failed to save chat history',e);
    
//     }
//   };

//   // === INTELLIGENT CONTEXT FETCHING ===
//   const fetchContext = async (userInput) => {
//     const lower = userInput.toLowerCase();
//     let context = '';

//     try {
//       // 1. Hỏi về xe (vehicle)
//       if (lower.includes('xe') || lower.includes('mustang') || lower.includes('model') || lower.includes('phiên bản')) {
//         const vehicles = await ManageVehicleService.getAllVehicle();
//         if (vehicles?.length > 0) {
//           const list = vehicles.map(v => 
//             `- ${v.modelName} (${v.version}, ${v.year}): ${v.price.toLocaleString()}₫, màu ${v.color}, còn ${v.quantityAvailable || 'N/A'} chiếc`
//           ).join('\n');
//           context += `Danh sách xe:\n${list}\n\n`;
//         }
//       }

//       // 2. Hỏi về kho (storage)
//       if (lower.includes('kho') || lower.includes('tồn') || lower.includes('sẵn') || lower.includes('còn')) {
//         const storages = await ManageStorageService.getAllStorages();
//         if (storages?.length > 0) {
//           const list = storages.map(s => 
//             `- Cửa hàng ID ${s.storeId}: ${s.quantityAvailable} xe (cập nhật: ${s.lastUpdated})`
//           ).join('\n');
//           context += `Tồn kho:\n${list}\n\n`;
//         }
//       }

//       // 3. Hỏi về cửa hàng (store)
//       if (lower.includes('cửa hàng') || lower.includes('store') || lower.includes('địa chỉ')) {
//         const stores = await ManageStoreService.getAllStores();
//         if (stores?.length > 0) {
//           const list = stores.map(s => 
//             `- ${s.storeName}: ${s.address} (${s.email})`
//           ).join('\n');
//           context += `Cửa hàng:\n${list}\n\n`;
//         }
//       }

//       // 4. Hỏi về thương hiệu (brand)
//       if (lower.includes('thương hiệu') || lower.includes('brand') || lower.includes('ford') || lower.includes('hãng')) {
//         const brands = await ManageBrandService.getAllBrands();
//         if (brands?.length > 0) {
//           const list = brands.map(b => 
//             `- ${b.brandName} (${b.country}, thành lập ${b.founderYear})`
//           ).join('\n');
//           context += `Thương hiệu:\n${list}\n\n`;
//         }
//       }

//       // 5. Hỏi chi tiết xe theo ID
//       const vehicleIdMatch = userInput.match(/xe\s*(\d+)/i);
//       if (vehicleIdMatch) {
//         const id = parseInt(vehicleIdMatch[1]);
//         const vehicle = await ManageVehicleService.GetVehicleById(id);
//         if (vehicle) {
//           context += `Chi tiết xe ID ${id}:\n` +
//             `- Tên: ${vehicle.modelName} ${vehicle.version}\n` +
//             `- Giá: ${vehicle.price.toLocaleString()}₫\n` +
//             `- Pin: ${vehicle.batteryCapacity}, phạm vi: ${vehicle.rangePerCharge}\n` +
//             `- Màu: ${vehicle.color}, ghế: ${vehicle.seatingCapacity}\n`;
//         }
//       }

//     } catch (error) {
//       console.error('Error fetching context:', error);
//       context += 'Không thể lấy dữ liệu từ hệ thống.\n';
//     }

//     return context.trim();
//   };

//   // === SEND MESSAGE WITH CONTEXT ===
//   const sendMessage = async () => {
//     if (!input.trim() || isLoading) return;

//     const userMsg = { role: 'user', content: input.trim(), time: dayjs().format('HH:mm') };
//     const newMessages = [...messages, userMsg];
//     setMessages(newMessages);
//     setInput('');
//     setIsLoading(true);
//     saveSession(newMessages);

//     if (!API_KEY || !model) {
//       const err = { role: 'assistant', content: 'API key chưa được cấu hình!', time: dayjs().format('HH:mm') };
//       setMessages([...newMessages, err]);
//       saveSession([...newMessages, err]);
//       setIsLoading(false);
//       return;
//     }

//     try {
//       // Bước 1: Lấy dữ liệu thật từ backend
//       const context = await fetchContext(input.trim());

//       // Bước 2: Tạo prompt thông minh
//       const prompt = context
//         ? `${input.trim()}\n\nDữ liệu hệ thống:\n${context}\n\nDựa trên dữ liệu trên, trả lời ngắn gọn, chính xác bằng tiếng Việt.`
//         : input.trim();

//       // Bước 3: Gửi cho Gemini
//       const chat = model.startChat({
//         history: newMessages.slice(0, -1).map(m => ({
//           role: m.role === 'user' ? 'user' : 'model',
//           parts: [{ text: m.content }],
//         })),
//       });

//       const result = await chat.sendMessage(prompt);
//       const response = await result.response;
//       const text = response.text();

//       const aiMsg = { role: 'assistant', content: text, time: dayjs().format('HH:mm') };
//       const final = [...newMessages, aiMsg];
//       setMessages(final);
//       saveSession(final);
//     } catch (error) {
//       console.error('AI Error:', error);
//       const errMsg = error.message?.includes('quota')
//         ? 'Đã hết quota miễn phí.'
//         : 'Lỗi kết nối. Vui lòng thử lại.';

//       const err = { role: 'assistant', content: errMsg, time: dayjs().format('HH:mm') };
//       const final = [...newMessages, err];
//       setMessages(final);
//       saveSession(final);
//     } finally {
//       setIsLoading(false);
//       inputRef.current?.focus();
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       sendMessage();
//     }
//   };

//   // === UI (giữ nguyên đẹp) ===
//   if (!isOpen) {
//     return (
//       <Button
//         type="primary"
//         shape="circle"
//         size="large"
//         icon={<MessageOutlined />}
//         onClick={() => setIsOpen(true)}
//         style={{
//           position: 'fixed',
//           bottom: 24,
//           right: 24,
//           zIndex: 1000,
//           width: 56,
//           height: 56,
//           fontSize: 24,
//           boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
//         }}
//       />
//     );
//   }

//   return (
//     <div
//       style={{
//         position: 'fixed',
//         bottom: 24,
//         right: 24,
//         width: 380,
//         height: 520,
//         background: '#fff',
//         borderRadius: 16,
//         boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
//         display: 'flex',
//         flexDirection: 'column',
//         zIndex: 1000,
//         fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
//         overflow: 'hidden',
//       }}
//     >
//       {/* Header */}
//       <div
//         style={{
//           padding: '12px 16px',
//           background: '#1890ff',
//           color: 'white',
//           fontWeight: 600,
//           display: 'flex',
//           justifyContent: 'space-between',
//           alignItems: 'center',
//         }}
//       >
//         <span>HTA Assistant</span>
//         <Button
//           type="text"
//           icon={<CloseOutlined />}
//           onClick={() => setIsOpen(false)}
//           style={{ color: 'white' }}
//           size="small"
//         />
//       </div>

//       {/* Messages */}
//       <div
//         style={{
//           flex: 1,
//           padding: '12px 16px',
//           overflowY: 'auto',
//           background: '#f9f9fb',
//         }}
//       >
//         {messages.length === 0 ? (
//           <div style={{ textAlign: 'center', color: '#999', marginTop: 60 }}>
//             <MessageOutlined style={{ fontSize: 32, marginBottom: 8 }} />
//             <p>Hỏi về xe, kho, cửa hàng, ...</p>
//           </div>
//         ) : (
//           messages.map((msg, i) => (
//             <div
//               key={i}
//               style={{
//                 marginBottom: 12,
//                 display: 'flex',
//                 justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
//               }}
//             >
//               <div
//                 style={{
//                   maxWidth: '75%',
//                   background: msg.role === 'user' ? '#1890ff' : '#fff',
//                   color: msg.role === 'user' ? 'white' : '#000',
//                   padding: '8px 12px',
//                   borderRadius: 12,
//                   border: msg.role === 'assistant' ? '1px solid #eee' : 'none',
//                   boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
//                 }}
//               >
//                 <div style={{ fontSize: 14, lineHeight: 1.4, whiteSpace: 'pre-wrap' }}>{msg.content}</div>
//                 <div
//                   style={{
//                     fontSize: 10,
//                     opacity: 0.7,
//                     marginTop: 4,
//                     textAlign: msg.role === 'user' ? 'right' : 'left',
//                   }}
//                 >
//                   {msg.time}
//                 </div>
//               </div>
//             </div>
//           ))
//         )}
//         {isLoading && (
//           <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
//             <div
//               style={{
//                 background: '#fff',
//                 padding: '8px 12px',
//                 borderRadius: 12,
//                 border: '1px solid #eee',
//               }}
//             >
//               <Spin size="small" /> HTA đang suy nghĩ...
//             </div>
//           </div>
//         )}
//         <div ref={messagesEndRef} />
//       </div>

//       {/* Input */}
//       <div style={{ padding: '8px 12px', borderTop: '1px solid #eee', background: '#fff' }}>
//         <Input
//           ref={inputRef}
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyPress={handleKeyPress}
//           placeholder="Hỏi về xe, kho, cửa hàng..."
//           disabled={isLoading}
//           suffix={
//             <Button
//               type="text"
//               icon={<SendOutlined />}
//               onClick={sendMessage}
//               disabled={isLoading || !input.trim()}
//               style={{ color: '#1890ff' }}
//             />
//           }
//           style={{ borderRadius: 20 }}
//         />
//       </div>
//     </div>
//   );
// };

// export default CompactChatbox;

// nâng cấp AI
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { MessageOutlined, CloseOutlined, SendOutlined } from '@ant-design/icons';
import { Button, Input, Spin } from 'antd';
import dayjs from 'dayjs';

// Import services
import ManageStorageService from '../../services/ManageStorage/ManageStorageService';
import ManageVehicleService from '../../services/ManageVehicleService/ManageVehicleService';
import ManageStoreService from '../../services/ManageStore/ManageStoreService';
import ManageBrandService from '../../services/ManageBrand/ManageBrandService';

const API_KEY = import.meta.env.VITE_GOOGLE_AI_API_KEY?.trim();
const STORAGE_KEY = 'hta_chat_history_compact';

const CompactChatbox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;
  const model = genAI ? genAI.getGenerativeModel({ model: 'gemini-2.0-flash' }) : null;

  // Lấy brandId từ localStorage (giống VehicleAllocationManage)
  const staffInfo = JSON.parse(localStorage.getItem('staffInfo') || '{}');
  const brandId = staffInfo.brandId;

  // Cache quantity để tránh gọi API nhiều lần
  const [quantityCache, setQuantityCache] = useState({});

  // Load chat history
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.messages)) setMessages(parsed.messages);
      } catch (e) {
        console.warn('Failed to load chat history', e);
      }
    }
  }, []);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Save session
  const saveSession = (updated) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ messages: updated }));
    } catch (e) {
      console.warn('Failed to save chat history', e);
    }
  };

  // === LẤY SỐ LƯỢNG XE TRONG CỬA HÀNG (giống VehicleAllocationManage) ===
  const fetchQuantityForVehicleInStore = async (vehicleId, storeId) => {
    if (!brandId) return 0;
    const cacheKey = `${vehicleId}_${storeId}`;
    if (quantityCache[cacheKey] !== undefined) return quantityCache[cacheKey];

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
  };

  // === XÂY DỰNG CONTEXT THÔNG MINH ===
  const fetchContext = async (userInput) => {
    const lower = userInput.toLowerCase();
    let context = '';

    try {
      // 1. Hỏi về xe (danh sách)
      if (lower.includes('xe') || lower.includes('model') || lower.includes('phiên bản')) {
        const vehicles = await ManageVehicleService.getAllVehicle();
        if (vehicles?.length > 0) {
          const list = vehicles
            .filter(v => v.brandId === brandId)
            .map(v => `- ${v.modelName} ${v.version || ''} (${v.year}): ${v.price?.toLocaleString() || 'N/A'}₫, màu ${v.color}`)
            .join('\n');
          context += `Danh sách xe:\n${list || 'Không có xe'}\n\n`;
        }
      }

      // 2. Hỏi về số lượng xe trong cửa hàng
      if ((lower.includes('còn') || lower.includes('sẵn') || lower.includes('kho')) && 
          (lower.includes('cửa hàng') || lower.includes('store') || lower.includes('đại lý'))) {
        
        const stores = await ManageStoreService.getAllStores();
        const vehicles = await ManageVehicleService.getAllVehicleByBrandId(brandId);

        if (stores?.length > 0 && vehicles?.length > 0) {
          const results = await Promise.all(
            stores.map(async (store) => {
              const vehicleQuantities = await Promise.all(
                vehicles.map(async (v) => {
                  const qty = await fetchQuantityForVehicleInStore(v.vehicleId, store.storeId);
                  return qty > 0 ? `${v.modelName}: ${qty}` : null;
                })
              );
              const available = vehicleQuantities.filter(Boolean);
              return available.length > 0
                ? `- Cửa hàng **${store.storeName}** (${store.address}): ${available.join(', ')}`
                : null;
            })
          );
          const filtered = results.filter(Boolean);
          context += `Tồn kho theo cửa hàng:\n${filtered.join('\n') || 'Không có xe nào'}\n\n`;
        }
      }

      // 3. Hỏi cụ thể: "Mustang còn bao nhiêu ở Store2TA?"
      const modelMatch = userInput.match(/(.+?)\s+(còn|sẵn|tồn)\s+(ở|tại)\s+(.+)/i);
      if (modelMatch) {
        const modelName = modelMatch[1].trim();
        const storeName = modelMatch[4].trim();

        const store = (await ManageStoreService.getAllStores()).find(s => 
          s.storeName.toLowerCase().includes(storeName.toLowerCase())
        );
        const vehicle = (await ManageVehicleService.getAllVehicle()).find(v => 
          v.modelName.toLowerCase().includes(modelName.toLowerCase()) && v.brandId === brandId
        );

        if (store && vehicle) {
          const qty = await fetchQuantityForVehicleInStore(vehicle.vehicleId, store.storeId);
          context += `Xe **${vehicle.modelName}** tại **${store.storeName}**: **${qty}** chiếc\n`;
        } else {
          context += `Không tìm thấy xe **${modelName}** tại **${storeName}**\n`;
        }
      }

      // 4. Hỏi về cửa hàng
      if (lower.includes('cửa hàng') || lower.includes('store') || lower.includes('địa chỉ')) {
        const stores = await ManageStoreService.getAllStores();
        if (stores?.length > 0) {
          const list = stores.map(s => `- **${s.storeName}**: ${s.address}, email: ${s.email}`);
          context += `Cửa hàng:\n${list.join('\n')}\n\n`;
        }
      }

      // 5. Hỏi về thương hiệu
      if (lower.includes('hãng') || lower.includes('thương hiệu') || lower.includes('brand')) {
        const brands = await ManageBrandService.getAllBrands();
        if (brands?.length > 0) {
          const brand = brands.find(b => b.brandId === brandId);
          if (brand) {
            context += `Hãng của bạn: **${brand.brandName}** (${brand.country}), thành lập ${brand.founderYear}\n`;
          }
        }
      }

    } catch (error) {
      console.error('Error fetching context:', error);
      context += 'Không thể lấy dữ liệu từ hệ thống.\n';
    }

    return context.trim();
  };

  // === SEND MESSAGE ===
  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = { role: 'user', content: input.trim(), time: dayjs().format('HH:mm') };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);
    saveSession(newMessages);

    if (!API_KEY || !model) {
      const err = { role: 'assistant', content: 'API key chưa được cấu hình!', time: dayjs().format('HH:mm') };
      setMessages([...newMessages, err]);
      saveSession([...newMessages, err]);
      setIsLoading(false);
      return;
    }

    try {
      const context = await fetchContext(input.trim());
      const prompt = context
        ? `${input.trim()}\n\nDữ liệu hệ thống:\n${context}\n\nTrả lời ngắn gọn, tự nhiên, bằng tiếng Việt. Không dùng ID, chỉ dùng tên.`
        : input.trim();

      const chat = model.startChat({
        history: newMessages.slice(0, -1).map(m => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.content }],
        })),
      });

      const result = await chat.sendMessage(prompt);
      const response = await result.response;
      const text = response.text();

      const aiMsg = { role: 'assistant', content: text, time: dayjs().format('HH:mm') };
      const final = [...newMessages, aiMsg];
      setMessages(final);
      saveSession(final);
    } catch (error) {
      console.error('AI Error:', error);
      const errMsg = error.message?.includes('quota')
        ? 'Đã hết quota miễn phí.'
        : 'Chờ một chút. Vui lòng thử lại.';

      const err = { role: 'assistant', content: errMsg, time: dayjs().format('HH:mm') };
      const final = [...newMessages, err];
      setMessages(final);
      saveSession(final);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // === UI ===
  if (!isOpen) {
    return (
      <Button
        type="primary"
        shape="circle"
        size="large"
        icon={<MessageOutlined />}
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000,
          width: 56,
          height: 56,
          fontSize: 24,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        }}
      />
    );
  }

  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, width: 380, height: 520,
      background: '#fff', borderRadius: 16, boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
      display: 'flex', flexDirection: 'column', zIndex: 1000,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      overflow: 'hidden',
    }}>
      <div style={{
        padding: '12px 16px', background: '#1890ff', color: 'white', fontWeight: 600,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <span>HTA Assistant</span>
        <Button type="text" icon={<CloseOutlined />} onClick={() => setIsOpen(false)} style={{ color: 'white' }} size="small" />
      </div>

      <div style={{ flex: 1, padding: '12px 16px', overflowY: 'auto', background: '#f9f9fb' }}>
        {messages.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#999', marginTop: 60 }}>
            <MessageOutlined style={{ fontSize: 32, marginBottom: 8 }} />
            <p>Ask me</p>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div key={i} style={{
              marginBottom: 12, display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
            }}>
              <div style={{
                maxWidth: '75%', background: msg.role === 'user' ? '#1890ff' : '#fff',
                color: msg.role === 'user' ? 'white' : '#000', padding: '8px 12px',
                borderRadius: 12, border: msg.role === 'assistant' ? '1px solid #eee' : 'none',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
              }}>
                <div style={{ fontSize: 14, lineHeight: 1.4, whiteSpace: 'pre-wrap' }}>{msg.content}</div>
                <div style={{ fontSize: 10, opacity: 0.7, marginTop: 4, textAlign: msg.role === 'user' ? 'right' : 'left' }}>
                  {msg.time}
                </div>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{ background: '#fff', padding: '8px 12px', borderRadius: 12, border: '1px solid #eee' }}>
              <Spin size="small" /> HTA đang kiểm tra kho...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div style={{ padding: '8px 12px', borderTop: '1px solid #eee', background: '#fff' }}>
        <Input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder=""
          disabled={isLoading}
          suffix={
            <Button
              type="text"
              icon={<SendOutlined />}
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              style={{ color: '#1890ff' }}
            />
          }
          style={{ borderRadius: 20 }}
        />
      </div>
    </div>
  );
};

export default CompactChatbox;