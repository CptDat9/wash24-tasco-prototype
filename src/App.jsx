import React, { useState, useEffect } from 'react';
import { 
  Car, Key, MapPin, Clock, ShieldCheck, CheckCircle2, 
  ChevronRight, Camera, Bell, Star, LayoutDashboard, 
  User, Settings, Plus, Menu, ArrowLeft, MoreHorizontal,
  Navigation, Check, X, AlertCircle, TrendingUp, DollarSign,
  Package, Smartphone, HelpCircle, FileText, CameraIcon, Video,
  Send, MessageSquare
} from 'lucide-react';

// --- CÁC THÀNH PHẦN GIAO DIỆN DÙNG CHUNG ---

const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false }) => {
  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md active:scale-95',
    secondary: 'bg-white text-indigo-600 border border-indigo-100 hover:bg-indigo-50 active:scale-95',
    ghost: 'bg-transparent text-slate-600 hover:bg-slate-100',
    danger: 'bg-rose-500 text-white hover:bg-rose-600',
    outline: 'bg-transparent border-2 border-slate-200 text-slate-700 hover:border-indigo-200 active:scale-95'
  };

  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

const Card = ({ children, className = "", onClick }) => (
  <div 
    onClick={onClick}
    className={`bg-white rounded-2xl border border-slate-100 shadow-sm p-4 ${onClick ? 'cursor-pointer active:scale-[0.98] hover:border-indigo-200 transition-all' : ''} ${className}`}
  >
    {children}
  </div>
);

const Badge = ({ children, status = 'default' }) => {
  const styles = {
    default: 'bg-slate-100 text-slate-600',
    pending: 'bg-amber-50 text-amber-600 border border-amber-100',
    active: 'bg-indigo-50 text-indigo-600 border border-indigo-100',
    success: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    error: 'bg-rose-50 text-rose-600 border border-rose-100'
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tight ${styles[status]}`}>
      {children}
    </span>
  );
};

// --- ỨNG DỤNG CHÍNH ---

export default function App() {
  // Quản lý trạng thái hệ thống giả lập (Simulated Backend)
  const [role, setRole] = useState('user'); // user | owner | valet
  const [appStep, setAppStep] = useState('home'); // home | booking | tracking | task_detail
  const [activeOrder, setActiveOrder] = useState(null);
  const [notification, setNotification] = useState(null);

  // Dữ liệu mẫu cho đơn hàng
  const [systemOrders, setSystemOrders] = useState([
    {
      id: 'WB-9921',
      customer: 'Jonathan Wick',
      car: 'Tesla Model 3',
      plate: '52-A 888.88',
      status: 'pending', // pending | picking_up | washing | returning | completed
      service: 'Eco Wash',
      price: '$25.00',
      time: '09:00 AM',
      location: 'Building B, Basement 2',
      valet: null,
      photos: []
    }
  ]);

  // Hiển thị thông báo tạm thời
  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // Chuyển đổi vai trò
  const switchRole = (newRole) => {
    setRole(newRole);
    setAppStep('home');
  };

  // --- LUỒNG NGƯỜI DÙNG (CUSTOMER) ---
  const UserFlow = () => {
    const [bookingPhase, setBookingPhase] = useState(0);
    const myActiveOrder = systemOrders.find(o => o.status !== 'completed');

    if (appStep === 'booking') {
      return (
        <div className="animate-in fade-in duration-300 pb-20">
          <header className="p-4 flex items-center gap-4 sticky top-0 bg-slate-50 z-10">
            <button onClick={() => setAppStep('home')} className="p-2 rounded-full bg-white shadow-sm border"><ArrowLeft size={20} /></button>
            <h1 className="text-xl font-bold">Đặt dịch vụ mới</h1>
          </header>

          <div className="px-4 space-y-6">
            {/* Step Indicator */}
            <div className="flex gap-2">
              {[0, 1, 2].map(i => (
                <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${bookingPhase >= i ? 'bg-indigo-600' : 'bg-slate-200'}`} />
              ))}
            </div>

            {bookingPhase === 0 && (
              <div className="space-y-4">
                <h2 className="font-bold text-lg">Chọn gói rửa xe</h2>
                {[
                  { name: 'Eco Wash', price: '$25', desc: 'Rửa ngoài & hút bụi cơ bản', time: '45p' },
                  { name: 'Premium Detail', price: '$85', desc: 'Đánh bóng & vệ sinh nội thất sâu', time: '2h 30p' }
                ].map((s, idx) => (
                  <Card key={idx} onClick={() => setBookingPhase(1)} className="flex justify-between items-center group">
                    <div className="flex gap-4 items-center">
                      <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600"><Car /></div>
                      <div>
                        <p className="font-bold">{s.name}</p>
                        <p className="text-xs text-slate-400">{s.desc}</p>
                      </div>
                    </div>
                    <p className="font-black text-indigo-600">{s.price}</p>
                  </Card>
                ))}
              </div>
            )}

            {bookingPhase === 1 && (
              <div className="space-y-6">
                <h2 className="font-bold text-lg">Xác nhận phương tiện & Vị trí</h2>
                <Card className="space-y-4">
                  <div className="flex items-center gap-3 border-b pb-4">
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center"><Car size={20}/></div>
                    <div className="flex-1">
                      <p className="text-xs text-slate-400 font-bold uppercase">Xe của bạn</p>
                      <p className="font-bold">Tesla Model 3 • Trắng</p>
                    </div>
                    <Badge>52-A 888.88</Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center"><MapPin size={20}/></div>
                    <div className="flex-1">
                      <p className="text-xs text-slate-400 font-bold uppercase">Vị trí lấy xe</p>
                      <p className="font-bold">Tòa nhà B, Hầm B2</p>
                    </div>
                    <button className="text-xs font-bold text-indigo-600">Thay đổi</button>
                  </div>
                </Card>
                <Button className="w-full" onClick={() => setBookingPhase(2)}>Tiếp theo</Button>
              </div>
            )}

            {bookingPhase === 2 && (
              <div className="space-y-6">
                <Card className="bg-indigo-900 text-white p-6 space-y-4 border-none">
                   <div className="flex justify-between">
                     <p className="opacity-70 text-sm">Tổng cộng</p>
                     <h3 className="text-2xl font-black">$25.00</h3>
                   </div>
                   <div className="border-t border-indigo-800 pt-4 flex gap-3 items-center">
                     <ShieldCheck size={20} className="text-indigo-400"/>
                     <p className="text-xs opacity-80">Bảo hiểm xe & khóa lên tới $5,000</p>
                   </div>
                </Card>
                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3">
                  <AlertCircle className="text-amber-600 shrink-0" size={20}/>
                  <p className="text-xs text-amber-700 leading-relaxed">Bạn sẽ cần để lại chìa khóa tại <b>Tủ Box #42</b> sau khi xác nhận đơn hàng.</p>
                </div>
                <Button className="w-full" onClick={() => {
                  const newOrder = {
                    id: 'WB-' + Math.floor(Math.random() * 9000 + 1000),
                    customer: 'Jonathan Wick',
                    car: 'Tesla Model 3',
                    plate: '52-A 888.88',
                    status: 'pending',
                    service: 'Eco Wash',
                    price: '$25.00',
                    time: '09:00 AM',
                    location: 'Building B, Basement 2',
                    valet: null,
                    photos: []
                  };
                  setSystemOrders([...systemOrders, newOrder]);
                  setAppStep('home');
                  showToast("Đặt lịch thành công!");
                }}>Thanh toán & Gửi khóa</Button>
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="animate-in fade-in duration-300">
        <header className="p-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-indigo-900">Washbox24</h1>
            <p className="text-slate-500 text-sm">Chào Jonathan! 👋</p>
          </div>
          <button className="w-10 h-10 rounded-full bg-white shadow-sm border flex items-center justify-center relative">
            <Bell size={20}/>
            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
          </button>
        </header>

        <div className="px-4 space-y-6">
          {myActiveOrder ? (
            <Card className="border-t-4 border-t-indigo-600 space-y-6" onClick={() => showToast("Đang theo dõi đơn hàng...")}>
               <div className="flex justify-between items-start">
                  <div>
                    <Badge status="active">{myActiveOrder.status.replace('_', ' ')}</Badge>
                    <h3 className="text-lg font-bold mt-1">{myActiveOrder.service}</h3>
                    <p className="text-xs text-slate-400">Mã đơn: {myActiveOrder.id}</p>
                  </div>
                  <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center border text-indigo-600"><Car /></div>
               </div>
               
               {/* Progress Tracker */}
               <div className="flex justify-between relative px-2">
                  {[1, 2, 3, 4].map((s, i) => (
                    <div key={i} className={`w-8 h-8 rounded-full border-4 flex items-center justify-center z-10 transition-all duration-700
                      ${(i === 0 && myActiveOrder.status === 'pending') || (i === 1 && myActiveOrder.status === 'picking_up') || (i === 2 && myActiveOrder.status === 'washing') || (i === 3 && myActiveOrder.status === 'returning')
                        ? 'bg-indigo-600 border-indigo-100 text-white scale-110' 
                        : 'bg-white border-slate-100 text-slate-300'}`}>
                      {i === 0 ? <Key size={14}/> : i === 1 ? <Car size={14}/> : i === 2 ? <CheckCircle2 size={14}/> : <MapPin size={14}/>}
                    </div>
                  ))}
                  <div className="absolute top-4 left-6 right-6 h-1 bg-slate-100 -z-0">
                    <div className={`h-full bg-indigo-500 transition-all duration-1000 ${myActiveOrder.status === 'pending' ? 'w-0' : myActiveOrder.status === 'picking_up' ? 'w-[33%]' : myActiveOrder.status === 'washing' ? 'w-[66%]' : 'w-full'}`}></div>
                  </div>
               </div>

               <div className="flex gap-2 pt-2">
                  <Button variant="outline" className="flex-1 py-2 text-sm"><MessageSquare size={16}/> Nhắn tin</Button>
                  <Button className="flex-1 py-2 text-sm">Xem chi tiết</Button>
               </div>
            </Card>
          ) : (
            <Card className="bg-indigo-600 text-white p-6 relative overflow-hidden border-none" onClick={() => setAppStep('booking')}>
              <div className="relative z-10 space-y-4">
                <h2 className="text-xl font-bold leading-tight">Xe bẩn? Đã có<br/>chúng tôi lo!</h2>
                <p className="text-indigo-100 text-sm opacity-80">Lấy xe tận nơi • Rửa sạch chuyên nghiệp</p>
                <Button variant="secondary" className="px-6">Đặt lịch ngay</Button>
              </div>
              <Car size={140} className="absolute -right-10 -bottom-10 opacity-10 rotate-12" />
            </Card>
          )}

          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'Gara', icon: <Car/> },
              { label: 'Lịch sử', icon: <Clock/> },
              { label: 'Ví', icon: <DollarSign/> },
              { label: 'Hỗ trợ', icon: <HelpCircle/> }
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-indigo-600">{item.icon}</div>
                <span className="text-[10px] font-bold text-slate-500 uppercase">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // --- LUỒNG TÀI XẾ (VALET) ---
  const ValetFlow = () => {
    const availableTasks = systemOrders.filter(o => o.status === 'pending');
    const myCurrentTask = systemOrders.find(o => o.status === 'picking_up' || o.status === 'returning');

    const updateStatus = (id, newStatus) => {
      setSystemOrders(systemOrders.map(o => o.id === id ? { ...o, status: newStatus } : o));
      showToast(`Đã chuyển trạng thái: ${newStatus}`);
    };

    if (myCurrentTask) {
      return (
        <div className="animate-in slide-in-from-right duration-300 pb-20">
           <header className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <h1 className="font-bold">Đang thực hiện</h1>
              <Badge status="active">ACTIVE TASK</Badge>
           </header>
           
           <div className="p-4 space-y-6">
              <Card className="space-y-4">
                 <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs text-slate-400 font-bold uppercase">Khách hàng</p>
                      <h4 className="text-lg font-bold">{myCurrentTask.customer}</h4>
                    </div>
                    <div className="text-right">
                       <p className="text-xs text-slate-400 font-bold uppercase">Biển số</p>
                       <Badge>{myCurrentTask.plate}</Badge>
                    </div>
                 </div>
                 <div className="flex items-center gap-2 text-sm text-slate-500">
                    <MapPin size={14}/>
                    <span>{myCurrentTask.location}</span>
                 </div>
              </Card>

              <div className="space-y-3">
                 <h3 className="font-bold text-slate-800">Quy trình bàn giao</h3>
                 <div className="space-y-4">
                    <div className="flex gap-4">
                       <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0"><Check size={18}/></div>
                       <div className="flex-1 border-b pb-4">
                          <p className="font-bold text-sm">Lấy khóa tại Locker</p>
                          <p className="text-xs text-slate-400">Sử dụng mã OTP: 8217</p>
                       </div>
                    </div>
                    <div className="flex gap-4">
                       <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center shrink-0">2</div>
                       <div className="flex-1 border-b pb-4">
                          <p className="font-bold text-sm text-slate-400">Kiểm tra xe & Chụp ảnh (4 góc)</p>
                          <Button variant="outline" className="mt-2 py-1 h-8 text-xs" onClick={() => showToast("Mở Camera...")}><Camera size={14}/> Chụp ảnh</Button>
                       </div>
                    </div>
                 </div>
              </div>

              {myCurrentTask.status === 'picking_up' && (
                <Button className="w-full bg-indigo-600" onClick={() => updateStatus(myCurrentTask.id, 'washing')}>Đã bàn giao cho tiệm</Button>
              )}
              {myCurrentTask.status === 'returning' && (
                <Button className="w-full bg-emerald-600" onClick={() => updateStatus(myCurrentTask.id, 'completed')}>Hoàn tất trả xe</Button>
              )}
           </div>
        </div>
      );
    }

    return (
      <div className="animate-in fade-in duration-300 p-4 space-y-6">
        <header className="flex justify-between items-center mb-6">
           <div className="flex gap-3 items-center">
              <div className="w-12 h-12 bg-slate-200 rounded-full overflow-hidden border-2 border-indigo-100">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Michael" alt="Valet"/>
              </div>
              <div>
                 <p className="font-bold text-slate-800">Michael (Tài xế)</p>
                 <Badge status="success">ONLINE</Badge>
              </div>
           </div>
           <div className="text-right">
              <p className="text-[10px] font-bold text-slate-400">THU NHẬP HÔM NAY</p>
              <p className="text-xl font-black text-indigo-600">$142.0</p>
           </div>
        </header>

        <div className="space-y-4">
          <h2 className="font-bold text-lg">Đơn hàng khả dụng ({availableTasks.length})</h2>
          {availableTasks.length > 0 ? (
            availableTasks.map(task => (
              <Card key={task.id} className="space-y-4 border-l-4 border-l-amber-500">
                <div className="flex justify-between">
                   <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase">{task.id}</p>
                      <h4 className="font-bold">{task.car}</h4>
                   </div>
                   <p className="font-black text-indigo-600">{task.price}</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                   <MapPin size={14}/>
                   <span>{task.location}</span>
                </div>
                <Button className="w-full h-10 py-0" onClick={() => updateStatus(task.id, 'picking_up')}>Chấp nhận đơn</Button>
              </Card>
            ))
          ) : (
             <div className="p-12 text-center text-slate-300">
                <Car size={48} className="mx-auto mb-4 opacity-20"/>
                <p className="text-sm font-medium">Hiện không có đơn hàng nào...</p>
             </div>
          )}
        </div>
      </div>
    );
  };

  // --- LUỒNG CHỦ TIỆM (OWNER) ---
  const OwnerFlow = () => {
    const washingOrders = systemOrders.filter(o => o.status === 'washing');
    const updateStatus = (id, newStatus) => {
      setSystemOrders(systemOrders.map(o => o.id === id ? { ...o, status: newStatus } : o));
      showToast("Đã thông báo cho Tài xế trả xe");
    };

    return (
      <div className="animate-in fade-in duration-300 p-4 space-y-6">
        <header className="flex justify-between items-center mb-6">
           <div>
              <h1 className="text-xl font-black text-indigo-900 uppercase">Master Shine Shop</h1>
              <p className="text-xs text-slate-500">Sức chứa: 8/12 ô trống</p>
           </div>
           <button className="p-2 bg-slate-100 rounded-xl"><Settings size={20}/></button>
        </header>

        <div className="grid grid-cols-2 gap-4">
           <Card className="bg-indigo-600 text-white border-none">
              <p className="text-[10px] font-bold opacity-70">DOANH THU</p>
              <h3 className="text-2xl font-black">$2,105</h3>
              <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-indigo-200">
                 <TrendingUp size={12}/> +12% vs hôm qua
              </div>
           </Card>
           <Card>
              <p className="text-[10px] font-bold text-slate-400">ĐÁNH GIÁ</p>
              <h3 className="text-2xl font-black text-slate-800">4.9</h3>
              <div className="mt-2 flex gap-0.5">
                 {[1,2,3,4,5].map(i => <Star key={i} size={10} className="fill-amber-400 text-amber-400"/>)}
              </div>
           </Card>
        </div>

        <div className="space-y-4">
           <h3 className="font-bold">Đang rửa xe ({washingOrders.length})</h3>
           {washingOrders.map(o => (
             <Card key={o.id} className="space-y-4">
                <div className="flex justify-between">
                   <div className="flex gap-3 items-center">
                      <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-bold">W</div>
                      <div>
                         <p className="font-bold">{o.car}</p>
                         <p className="text-xs text-slate-400">{o.plate}</p>
                      </div>
                   </div>
                   <Badge status="active">WASHING</Badge>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                   <div className="w-2/3 h-full bg-indigo-500 animate-pulse"></div>
                </div>
                <Button variant="secondary" className="w-full h-10 py-0" onClick={() => updateStatus(o.id, 'returning')}>Rửa xong (Gọi Valet)</Button>
             </Card>
           ))}
           {washingOrders.length === 0 && <p className="text-center text-slate-400 py-8 text-sm">Chưa có xe nào đang rửa...</p>}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-200 p-0 sm:p-4 font-sans text-slate-900">
      
      {/* Role Switcher - Chỉ dùng cho Demo để bạn trải nghiệm 3 vai trò */}
      <div className="w-full max-w-md bg-white/80 backdrop-blur-md p-2 mb-4 rounded-3xl shadow-xl flex gap-2 border border-white sticky top-4 z-[100]">
        <button 
          onClick={() => switchRole('user')} 
          className={`flex-1 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${role === 'user' ? 'bg-indigo-600 text-white shadow-lg scale-105' : 'text-slate-400 hover:bg-slate-50'}`}
        >
          User
        </button>
        <button 
          onClick={() => switchRole('valet')} 
          className={`flex-1 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${role === 'valet' ? 'bg-indigo-600 text-white shadow-lg scale-105' : 'text-slate-400 hover:bg-slate-50'}`}
        >
          Valet
        </button>
        <button 
          onClick={() => switchRole('owner')} 
          className={`flex-1 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${role === 'owner' ? 'bg-indigo-600 text-white shadow-lg scale-105' : 'text-slate-400 hover:bg-slate-50'}`}
        >
          Owner
        </button>
      </div>

      {/* Main Mobile Screen */}
      <div className="relative w-full max-w-md h-[844px] bg-slate-50 rounded-[54px] border-[12px] border-slate-900 shadow-2xl overflow-hidden overflow-y-auto no-scrollbar scroll-smooth">
        {/* Notch / Status Bar */}
        <div className="sticky top-0 z-50 h-10 w-full bg-inherit/90 backdrop-blur flex items-center justify-between px-10 pointer-events-none">
          <div className="text-[11px] font-bold">9:41</div>
          <div className="w-24 h-6 bg-slate-900 rounded-b-3xl absolute left-1/2 -translate-x-1/2"></div>
          <div className="flex gap-1.5 items-center">
            <div className="w-4 h-2.5 bg-slate-900 rounded-full flex items-center justify-center opacity-10"></div>
            <div className="w-5 h-2.5 border border-slate-900 rounded-sm"></div>
          </div>
        </div>

        {/* Luồng nội dung */}
        <div className="relative">
          {role === 'user' && <UserFlow />}
          {role === 'valet' && <ValetFlow />}
          {role === 'owner' && <OwnerFlow />}
        </div>

        {/* Toast Notification */}
        {notification && (
          <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl z-[100] animate-in slide-in-from-bottom duration-300 text-sm font-medium flex items-center gap-3">
             <CheckCircle2 className="text-emerald-400" size={18}/>
             {notification}
          </div>
        )}

        {/* Thanh Điều hướng (Dưới) */}
        {appStep === 'home' && (
          <nav className="absolute bottom-0 inset-x-0 bg-white/90 backdrop-blur-md border-t px-8 py-4 flex justify-between items-center">
            <button className="text-indigo-600 flex flex-col items-center gap-1">
              <LayoutDashboard size={22}/>
              <span className="text-[10px] font-black uppercase tracking-tighter">Trang chủ</span>
            </button>
            <button className="text-slate-300 flex flex-col items-center gap-1">
              <Package size={22}/>
              <span className="text-[10px] font-black uppercase tracking-tighter">Đơn hàng</span>
            </button>
            <button className="text-slate-300 flex flex-col items-center gap-1">
              <User size={22}/>
              <span className="text-[10px] font-black uppercase tracking-tighter">Tài khoản</span>
            </button>
          </nav>
        )}
      </div>

      {/* Ghi chú Mockup */}
      <div className="mt-8 text-center space-y-2 opacity-50 px-6 max-w-sm">
        <p className="text-xs font-bold uppercase tracking-widest">Hệ thống mô phỏng đa vai trò</p>
        <p className="text-[11px] leading-relaxed">Hãy thử: Đặt xe ở vai trò <b>User</b>, sau đó đổi sang <b>Valet</b> để nhận đơn, rồi <b>Owner</b> để bắt đầu rửa xe.</p>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}