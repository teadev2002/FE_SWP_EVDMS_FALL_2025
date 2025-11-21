// import React, { useState, useEffect, useRef } from 'react';
// import { GoogleGenerativeAI } from '@google/generative-ai';
// import { MessageOutlined, CloseOutlined, SendOutlined } from '@ant-design/icons';
// import { Button, Input, Spin } from 'antd';
// import dayjs from 'dayjs';

// // Import services
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

//   // Lấy brandId từ localStorage (giống VehicleAllocationManage)
//   const staffInfo = JSON.parse(localStorage.getItem('staffInfo') || '{}');
//   const brandId = staffInfo.brandId;

//   // Cache quantity để tránh gọi API nhiều lần
//   const [quantityCache, setQuantityCache] = useState({});

//   // Load chat history
//   useEffect(() => {
//     const saved = localStorage.getItem(STORAGE_KEY);
//     if (saved) {
//       try {
//         const parsed = JSON.parse(saved);
//         if (Array.isArray(parsed.messages)) setMessages(parsed.messages);
//       } catch (e) {
//         console.warn('Failed to load chat history', e);
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
//       console.warn('Failed to save chat history', e);
//     }
//   };

//   // === LẤY SỐ LƯỢNG XE TRONG CỬA HÀNG (giống VehicleAllocationManage) ===
//   const fetchQuantityForVehicleInStore = async (vehicleId, storeId) => {
//     if (!brandId) return 0;
//     const cacheKey = `${vehicleId}_${storeId}`;
//     if (quantityCache[cacheKey] !== undefined) return quantityCache[cacheKey];

//     try {
//       const data = await ManageStorageService.filterStorageByBrandIdAndVehicleId(brandId, vehicleId);
//       const record = Array.isArray(data) ? data.find(r => r.storeId === storeId) : null;
//       const qty = record?.quantityAvailable ?? 0;

//       setQuantityCache(prev => ({ ...prev, [cacheKey]: qty }));
//       return qty;
//     } catch (error) {
//       console.error('Error fetching quantity:', error);
//       setQuantityCache(prev => ({ ...prev, [cacheKey]: 0 }));
//       return 0;
//     }
//   };

//   // === XÂY DỰNG CONTEXT THÔNG MINH ===
//   const fetchContext = async (userInput) => {
//     const lower = userInput.toLowerCase();
//     let context = '';

//     try {
//       // 1. Hỏi về xe (danh sách)
//       if (lower.includes('xe') || lower.includes('model') || lower.includes('phiên bản')) {
//         const vehicles = await ManageVehicleService.getAllVehicle();
//         if (vehicles?.length > 0) {
//           const list = vehicles
//             .filter(v => v.brandId === brandId)
//             .map(v => `- ${v.modelName} ${v.version || ''} (${v.year}): ${v.price?.toLocaleString() || 'N/A'}₫, màu ${v.color}`)
//             .join('\n');
//           context += `Danh sách xe:\n${list || 'Không có xe'}\n\n`;
//         }
//       }

//       // 2. Hỏi về số lượng xe trong cửa hàng
//       if ((lower.includes('còn') || lower.includes('sẵn') || lower.includes('kho')) && 
//           (lower.includes('cửa hàng') || lower.includes('store') || lower.includes('đại lý'))) {
        
//         const stores = await ManageStoreService.getAllStores();
//         const vehicles = await ManageVehicleService.getAllVehicleByBrandId(brandId);

//         if (stores?.length > 0 && vehicles?.length > 0) {
//           const results = await Promise.all(
//             stores.map(async (store) => {
//               const vehicleQuantities = await Promise.all(
//                 vehicles.map(async (v) => {
//                   const qty = await fetchQuantityForVehicleInStore(v.vehicleId, store.storeId);
//                   return qty > 0 ? `${v.modelName}: ${qty}` : null;
//                 })
//               );
//               const available = vehicleQuantities.filter(Boolean);
//               return available.length > 0
//                 ? `- Cửa hàng **${store.storeName}** (${store.address}): ${available.join(', ')}`
//                 : null;
//             })
//           );
//           const filtered = results.filter(Boolean);
//           context += `Tồn kho theo cửa hàng:\n${filtered.join('\n') || 'Không có xe nào'}\n\n`;
//         }
//       }

//       // 3. Hỏi cụ thể: "Mustang còn bao nhiêu ở Store2TA?"
//       const modelMatch = userInput.match(/(.+?)\s+(còn|sẵn|tồn)\s+(ở|tại)\s+(.+)/i);
//       if (modelMatch) {
//         const modelName = modelMatch[1].trim();
//         const storeName = modelMatch[4].trim();

//         const store = (await ManageStoreService.getAllStores()).find(s => 
//           s.storeName.toLowerCase().includes(storeName.toLowerCase())
//         );
//         const vehicle = (await ManageVehicleService.getAllVehicle()).find(v => 
//           v.modelName.toLowerCase().includes(modelName.toLowerCase()) && v.brandId === brandId
//         );

//         if (store && vehicle) {
//           const qty = await fetchQuantityForVehicleInStore(vehicle.vehicleId, store.storeId);
//           context += `Xe **${vehicle.modelName}** tại **${store.storeName}**: **${qty}** chiếc\n`;
//         } else {
//           context += `Không tìm thấy xe **${modelName}** tại **${storeName}**\n`;
//         }
//       }

//       // 4. Hỏi về cửa hàng
//       if (lower.includes('cửa hàng') || lower.includes('store') || lower.includes('địa chỉ')) {
//         const stores = await ManageStoreService.getAllStores();
//         if (stores?.length > 0) {
//           const list = stores.map(s => `- **${s.storeName}**: ${s.address}, email: ${s.email}`);
//           context += `Cửa hàng:\n${list.join('\n')}\n\n`;
//         }
//       }

//       // 5. Hỏi về thương hiệu
//       if (lower.includes('hãng') || lower.includes('thương hiệu') || lower.includes('brand')) {
//         const brands = await ManageBrandService.getAllBrands();
//         if (brands?.length > 0) {
//           const brand = brands.find(b => b.brandId === brandId);
//           if (brand) {
//             context += `Hãng của bạn: **${brand.brandName}** (${brand.country}), thành lập ${brand.founderYear}\n`;
//           }
//         }
//       }

//     } catch (error) {
//       console.error('Error fetching context:', error);
//       context += 'Không thể lấy dữ liệu từ hệ thống.\n';
//     }

//     return context.trim();
//   };

//   // === SEND MESSAGE ===
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
//       const context = await fetchContext(input.trim());
//       const prompt = context
//         ? `${input.trim()}\n\nDữ liệu hệ thống:\n${context}\n\nTrả lời ngắn gọn, tự nhiên, bằng tiếng Việt. Không dùng ID, chỉ dùng tên.`
//         : input.trim();

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
//         : 'Chờ một chút. Vui lòng thử lại.';

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

//   // === UI ===
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
//     <div style={{
//       position: 'fixed', bottom: 24, right: 24, width: 380, height: 520,
//       background: '#fff', borderRadius: 16, boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
//       display: 'flex', flexDirection: 'column', zIndex: 1000,
//       fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
//       overflow: 'hidden',
//     }}>
//       <div style={{
//         padding: '12px 16px', background: '#1890ff', color: 'white', fontWeight: 600,
//         display: 'flex', justifyContent: 'space-between', alignItems: 'center',
//       }}>
//         <span>HTA Assistant</span>
//         <Button type="text" icon={<CloseOutlined />} onClick={() => setIsOpen(false)} style={{ color: 'white' }} size="small" />
//       </div>

//       <div style={{ flex: 1, padding: '12px 16px', overflowY: 'auto', background: '#f9f9fb' }}>
//         {messages.length === 0 ? (
//           <div style={{ textAlign: 'center', color: '#999', marginTop: 60 }}>
//             <MessageOutlined style={{ fontSize: 32, marginBottom: 8 }} />
//             <p>Ask me</p>
//           </div>
//         ) : (
//           messages.map((msg, i) => (
//             <div key={i} style={{
//               marginBottom: 12, display: 'flex',
//               justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
//             }}>
//               <div style={{
//                 maxWidth: '75%', background: msg.role === 'user' ? '#1890ff' : '#fff',
//                 color: msg.role === 'user' ? 'white' : '#000', padding: '8px 12px',
//                 borderRadius: 12, border: msg.role === 'assistant' ? '1px solid #eee' : 'none',
//                 boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
//               }}>
//                 <div style={{ fontSize: 14, lineHeight: 1.4, whiteSpace: 'pre-wrap' }}>{msg.content}</div>
//                 <div style={{ fontSize: 10, opacity: 0.7, marginTop: 4, textAlign: msg.role === 'user' ? 'right' : 'left' }}>
//                   {msg.time}
//                 </div>
//               </div>
//             </div>
//           ))
//         )}
//         {isLoading && (
//           <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
//             <div style={{ background: '#fff', padding: '8px 12px', borderRadius: 12, border: '1px solid #eee' }}>
//               <Spin size="small" /> HTA đang kiểm tra kho...
//             </div>
//           </div>
//         )}
//         <div ref={messagesEndRef} />
//       </div>

//       <div style={{ padding: '8px 12px', borderTop: '1px solid #eee', background: '#fff' }}>
//         <Input
//           ref={inputRef}
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyPress={handleKeyPress}
//           placeholder=""
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

// thêm button xóa chat history
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { MessageOutlined, CloseOutlined, SendOutlined, ClearOutlined } from '@ant-design/icons';
import { Button, Input, Spin, Tooltip, Modal } from 'antd'; 
import dayjs from 'dayjs';

// Import services
import ManageStorageService from '../../services/ManageStorage/ManageStorageService';
import ManageVehicleService from '../../services/ManageVehicleService/ManageVehicleService';
import ManageStoreService from '../../services/ManageStore/ManageStoreService';
import ManageBrandService from '../../services/ManageBrand/ManageBrandService';

// Đảm bảo API Key được cấu hình
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
const [showConfirm, setShowConfirm] = useState(false);
    // Lấy brandId từ localStorage
    const staffInfo = JSON.parse(localStorage.getItem('staffInfo') || '{}');
    const brandId = staffInfo.brandId;

    // Cache quantity để tránh gọi API nhiều lần
    const [quantityCache, setQuantityCache] = useState({});

     
    // Auto scroll khi có tin nhắn mới
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Focus input VÀ auto scroll KHI MỞ chatbox (ĐÃ CẬP NHẬT KIỂM TRA LẠI DỮ LIỆU)
 // Focus input VÀ auto scroll KHI MỞ chatbox
useEffect(() => {
    if (isOpen) {
        inputRef.current?.focus();
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
}, [isOpen]);

useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            // Chỉ load nếu thực sự có tin nhắn
            if (Array.isArray(parsed.messages) && parsed.messages.length > 0) {
                setMessages(parsed.messages);
            }
            // Nếu parsed.messages là mảng rỗng → giữ nguyên [] → chat trống
        } catch (e) {
            console.warn('Lỗi parse chat history', e);
            localStorage.removeItem(STORAGE_KEY); // Xóa dữ liệu hỏng
        }
    }
}, []);
    // Save session
// 3. SỬA saveSession – luôn lưu đúng format
const saveSession = (updated) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ 
            messages: updated || []   // ← luôn lưu đúng format
        }));
    } catch (e) {
        console.warn('Lỗi lưu chat', e);
    }
};
// Thêm hàm này vào cuối phần khai báo hàm (trước return)
 
 // 4. SỬA clearChatHistory – chỉ cần reset + lưu mảng rỗng
const clearChatHistory = () => {
   setShowConfirm(true);
};
// Hàm xử lý khi nhấn XÓA
const confirmDelete = () => {
    setMessages([]);
    setQuantityCache({});
    saveSession([]);
    setShowConfirm(false);
    
    // Thông báo thành công (dùng alert cũng được, hoặc toast đơn giản)
    Modal.success({
        content: 'Đã xóa lịch sử trò chuyện thành công!',
        centered: true,
    });
};
    // === CÁC HÀM XỬ LÝ DỮ LIỆU TỒN KHO ===
    
    // Hàm chung để lấy số lượng xe tại một storeId cụ thể (null là kho trung tâm)
    const fetchQuantityByStoreId = async (vehicleId, storeId = null) => {
        if (!brandId) return 0;
        const cacheKey = storeId === null ? `${vehicleId}_central` : `${vehicleId}_${storeId}`;
        
        if (quantityCache[cacheKey] !== undefined) return quantityCache[cacheKey];

        try {
            const data = await ManageStorageService.filterStorageByBrandIdAndVehicleId(brandId, vehicleId);
            const records = Array.isArray(data) ? data : [];
            const record = records.find(r => r.storeId === storeId); 
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

            // 2. TỒN KHO TRUNG TÂM (Central Warehouse)
            if (
                (lower.includes('còn') || lower.includes('sẵn') || lower.includes('tồn')) &&
                (lower.includes('kho trung tâm') || lower.includes('kho tổng') || (lower.includes('chi tiết') && lower.includes('kho')) || (lower.includes('từng model') && lower.includes('kho')))
            ) {
                const vehicles = await ManageVehicleService.getAllVehicleByBrandId(brandId);
                
                if (vehicles?.length > 0) {
                    const results = await Promise.all(
                        vehicles.map(async (v) => {
                            const qty = await fetchQuantityByStoreId(v.vehicleId, null); 
                            return qty > 0 ? { name: v.modelName, qty: qty } : null;
                        })
                    );
                    
                    const available = results.filter(Boolean);
                    const totalAvailable = available.reduce((sum, item) => sum + item.qty, 0);

                    if (available.length > 0) {
                        const details = available.map(item => `- **${item.name}**: ${item.qty} chiếc`).join('\n');
                        context += `Tồn kho TỔNG (Central Warehouse) có **${totalAvailable}** xe:\n${details}\n\n`;
                    } else {
                        context += `Tồn kho TỔNG (Central Warehouse): Hiện không có xe nào sẵn.\n\n`;
                    }
                }
            }
            
            // 3. TỒN KHO THEO CỬA HÀNG (In Stores)
            if ((lower.includes('còn') || lower.includes('sẵn') || lower.includes('tồn')) && 
                (lower.includes('cửa hàng') || lower.includes('store') || lower.includes('đại lý'))) {
                
                const stores = await ManageStoreService.getAllStores();
                const vehicles = await ManageVehicleService.getAllVehicleByBrandId(brandId);

                if (stores?.length > 0 && vehicles?.length > 0) {
                    const results = await Promise.all(
                        stores.map(async (store) => {
                            const vehicleQuantities = await Promise.all(
                                vehicles.map(async (v) => {
                                    const qty = await fetchQuantityByStoreId(v.vehicleId, store.storeId);
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

            // 4. Hỏi cụ thể: "Mustang còn bao nhiêu ở Store2TA?"
            const modelMatch = userInput.match(/(.+?)\s+(còn|sẵn|tồn)\s+(ở|tại)\s+(.+)/i);
            if (modelMatch) {
                const modelName = modelMatch[1].trim();
                const storeName = modelMatch[4].trim();

                const allStores = await ManageStoreService.getAllStores();
                const allVehicles = await ManageVehicleService.getAllVehicle();

                const store = allStores.find(s => 
                    s.storeName.toLowerCase().includes(storeName.toLowerCase())
                );
                const vehicle = allVehicles.find(v => 
                    v.modelName.toLowerCase().includes(modelName.toLowerCase()) && v.brandId === brandId
                );

                if (store && vehicle) {
                    const qty = await fetchQuantityByStoreId(vehicle.vehicleId, store.storeId);
                    context += `Xe **${vehicle.modelName}** tại **${store.storeName}**: **${qty}** chiếc\n`;
                } else {
                    context += `Không tìm thấy thông tin cụ thể (có thể tên xe/cửa hàng không chính xác).\n`;
                }
            }

            // 5. Hỏi về cửa hàng
            if (lower.includes('cửa hàng') || lower.includes('store') || lower.includes('địa chỉ')) {
                const stores = await ManageStoreService.getAllStores();
                if (stores?.length > 0) {
                    const list = stores.map(s => `- **${s.storeName}**: ${s.address}, email: ${s.email}`);
                    context += `Cửa hàng:\n${list.join('\n')}\n\n`;
                }
            }

            // 6. Hỏi về thương hiệu
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
            context += 'Không thể lấy dữ liệu từ hệ thống. Vui lòng kiểm tra kết nối API.\n';
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
            
            const systemInstruction = `Bạn là HTA Assistant, một trợ lý phân tích dữ liệu kho bãi và bán hàng. 
            Sử dụng DỮ LIỆU HỆ THỐNG được cung cấp để trả lời các câu hỏi về tồn kho, model xe, hoặc cửa hàng một cách chính xác, ngắn gọn và tự nhiên bằng tiếng Việt. 
            Luôn ưu tiên dữ liệu tồn kho so với các dữ liệu khác. Không dùng ID, chỉ dùng tên.`;

            const prompt = context
                ? `${input.trim()}\n\nDữ liệu hệ thống:\n${context}`
                : input.trim();

            const validHistory = newMessages.slice(0, -1)
                .filter(m => m.content && typeof m.content === 'string' && m.content.trim() !== '') 
                .map(m => ({
                    role: m.role === 'user' ? 'user' : 'model',
                    parts: [{ text: m.content }],
                }));
                
            const chat = model.startChat({
                history: validHistory, 
                config: {
                    systemInstruction: systemInstruction,
                }
            });

            const result = await chat.sendMessage(prompt);

            const response = result?.response;
            // Đã sửa lỗi: Dùng response.text()
            let text = response?.text() || ''; 
            
            // LOGIC KHẮC PHỤC LỖI NỘI DUNG RỖNG
            if (!text.trim()) {
                text = "Xin lỗi, HTA Assistant hiện không thể trả lời câu hỏi này. Vui lòng thử lại hoặc thay đổi nội dung câu hỏi.";
            }
            // KẾT THÚC LOGIC KHẮC PHỤC

            const aiMsg = { role: 'assistant', content: text, time: dayjs().format('HH:mm') };
            const final = [...newMessages, aiMsg];
            setMessages(final);
            saveSession(final);
        } catch (error) {
            console.error('AI Error:', error);
            const errMsg = error.message?.includes('quota')
                ? 'Đã hết quota miễn phí. Vui lòng liên hệ quản trị viên.'
                : 'Đã xảy ra lỗi trong quá trình xử lý AI. Vui lòng thử lại sau.';

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
                    position: 'fixed', bottom: 24, right: 24, zIndex: 1000,
                    width: 56, height: 56, fontSize: 24, boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
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
                <div style={{ display: 'flex', gap: 8 }}>
                    {/* NÚT XÓA LỊCH SỬ MỚI */}
                    <Tooltip title="Xóa lịch sử trò chuyện">
                        <Button 
                            type="text" 
                            icon={<ClearOutlined />} 
                            onClick={clearChatHistory} 
                            style={{ color: 'white' }} 
                            size="small" 
                        />
                    </Tooltip>
                    {/* NÚT ĐÓNG */}
                    <Button type="text" icon={<CloseOutlined />} onClick={() => setIsOpen(false)} style={{ color: 'white' }} size="small" />
                </div>
            </div>
{showConfirm && (
    <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0,0,0,0.5)', zIndex: 9999,
        display: 'flex', alignItems: 'center', justifyContent: 'center'
    }} onClick={() => setShowConfirm(false)}>
        <div style={{
            background: 'white', padding: 24, borderRadius: 12, width: 320, textAlign: 'center',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
        }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 16px 0' }}>Confirm Delete Chat History</h3>
            <p style={{ margin: '0 0 24px 0', color: '#666' }}>
             
Are you sure you want to delete this entire chat history? 

            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                <Button 
                    type="default" 
                    onClick={() => setShowConfirm(false)}
                >
                    Cancel
                </Button>
                <Button 
                    type="primary" 
                    danger
                    onClick={confirmDelete}
                >
                    Delete
                </Button>
            </div>
        </div>
    </div>
)}
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
                    placeholder="Hỏi về tồn kho, model xe..."
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