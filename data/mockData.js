// ============================================
// FILE DỮ LIỆU MẪU (MOCK DATA)
// Tập trung tất cả dữ liệu mẫu vào đây để dễ quản lý
// ============================================

// 1. THÔNG TIN ĐĂNG NHẬP
var validCredentials = {
    admin: {
        username: 'admin',
        password: 'admin123',
        role: 'admin'
    },
    giamdoc: {
        username: 'giamdoc',
        password: 'giamdoc123',
        role: 'giamdoc'
    }
};

// 2. DỮ LIỆU NHÂN VIÊN (dùng cho nhanvien.js)
var nhanVienData = [
    { ma: 'NV001', hoTen: 'Nguyễn Văn A', ngaySinh: '1990-05-15', phongBan: 'Kỹ thuật', chucVu: 'Trưởng phòng', email: 'nva@company.com', soDienThoai: '0912345678', diaChi: '123 Đường ABC', trangThai: 'Đang làm việc' },
    { ma: 'NV002', hoTen: 'Trần Thị B', ngaySinh: '1992-08-20', phongBan: 'Nhân sự', chucVu: 'Nhân viên', email: 'ttb@company.com', soDienThoai: '0912345679', diaChi: '456 Đường XYZ', trangThai: 'Đang làm việc' },
    { ma: 'NV003', hoTen: 'Lê Văn C', ngaySinh: '1988-03-10', phongBan: 'Kinh doanh', chucVu: 'Giám đốc', email: 'lvc@company.com', soDienThoai: '0912345680', diaChi: '789 Đường DEF', trangThai: 'Đang làm việc' }
    
];

// 3. HỒ SƠ NHÂN SỰ (dùng cho nhansu.js)
var hoSoData = [
    {
        ma: 'NV001',
        hoTen: 'Nguyễn Văn A',
        cmnd: '001234567890',
        ngaySinh: '1990-05-15',
        gioiTinh: 'Nam',
        diaChi: '123 Đường ABC, Quận 1, TP.HCM',
        soDienThoai: '0912345678',
        email: 'nva@company.com',
        trinhDo: 'Đại học',
        chuyenNganh: 'Công nghệ thông tin',
        truong: 'Đại học Bách Khoa',
        namTotNghiep: '2012',
        kinhNghiem: '5 năm',
        tinhTrangHonNhan: 'Đã kết hôn',
        ngayVaoLam: '2020-01-01',
        phongBan: 'Kỹ thuật',
        chucVu: 'Trưởng phòng',
        luong: 25000000
    },
    {
        ma: 'NV002',
        hoTen: 'Trần Thị B',
        cmnd: '001234567891',
        ngaySinh: '1992-08-20',
        gioiTinh: 'Nữ',
        diaChi: '456 Đường XYZ, Quận 2, TP.HCM',
        soDienThoai: '0912345679',
        email: 'ttb@company.com',
        trinhDo: 'Thạc sĩ',
        chuyenNganh: 'Quản trị nhân sự',
        truong: 'Đại học Kinh tế',
        namTotNghiep: '2016',
        kinhNghiem: '3 năm',
        tinhTrangHonNhan: 'Độc thân',
        ngayVaoLam: '2021-03-15',
        phongBan: 'Nhân sự',
        chucVu: 'Nhân viên',
        luong: 15000000
    },
    {
        ma: 'NV003',
        hoTen: 'Lê Văn C',
        cmnd: '001234567892',
        ngaySinh: '1988-03-10',
        gioiTinh: 'Nam',
        diaChi: '789 Đường DEF, Quận 3, TP.HCM',
        soDienThoai: '0912345680',
        email: 'lvc@company.com',
        trinhDo: 'Tiến sĩ',
        chuyenNganh: 'Quản trị kinh doanh',
        truong: 'Đại học Quốc gia',
        namTotNghiep: '2015',
        kinhNghiem: '10 năm',
        tinhTrangHonNhan: 'Đã kết hôn',
        ngayVaoLam: '2018-06-01',
        phongBan: 'Kinh doanh',
        chucVu: 'Giám đốc',
        luong: 50000000
    }
];

// 4. DỮ LIỆU NHÂN VIÊN CHO TÌM KIẾM VÀ CHAT (dùng cho timkiem.js và chat.js)
var employeeData = [
    { 
        ma: 'NV001', 
        hoTen: 'Nguyễn Văn A', 
        ngaySinh: '1990-05-15', 
        phongBan: 'Kỹ thuật', 
        chucVu: 'Trưởng phòng', 
        email: 'nva@company.com', 
        soDienThoai: '0912345678', 
        diaChi: '123 Đường ABC, Quận 1, TP.HCM',
        trangThai: 'Đang làm việc',
        luong: 25000000
    },
    { 
        ma: 'NV002', 
        hoTen: 'Trần Thị B', 
        ngaySinh: '1992-08-20', 
        phongBan: 'Nhân sự', 
        chucVu: 'Nhân viên', 
        email: 'ttb@company.com', 
        soDienThoai: '0912345679', 
        diaChi: '456 Đường XYZ, Quận 2, TP.HCM',
        trangThai: 'Đang làm việc',
        luong: 15000000
    },
    { 
        ma: 'NV003', 
        hoTen: 'Lê Văn C', 
        ngaySinh: '1988-03-10', 
        phongBan: 'Kinh doanh', 
        chucVu: 'Giám đốc', 
        email: 'lvc@company.com', 
        soDienThoai: '0912345680', 
        diaChi: '789 Đường DEF, Quận 3, TP.HCM',
        trangThai: 'Đang làm việc',
        luong: 50000000
    }
];

// 5. DỮ LIỆU PHÒNG BAN
var phongBanData = [
    { ma: 'PB001', ten: 'Phòng Kỹ thuật', truongPhong: 'Nguyễn Văn A', soNV: 25 },
    { ma: 'PB002', ten: 'Phòng Nhân sự', truongPhong: 'Trần Thị B', soNV: 10 },
    { ma: 'PB003', ten: 'Phòng Kinh doanh', truongPhong: 'Lê Văn C', soNV: 15 }
];

// 6. DỮ LIỆU TUYỂN DỤNG
var tuyenDungData = [
    { ma: 'TD001', viTri: 'Lập trình viên Java', phongBan: 'Kỹ thuật', soLuong: 3, ngayDang: '2025-10-01', moTa: '', yeuCau: '', trangThai: 'active' },
    { ma: 'TD002', viTri: 'Nhân viên Marketing', phongBan: 'Marketing', soLuong: 2, ngayDang: '2025-10-05', moTa: '', yeuCau: '', trangThai: 'active' }
];

// 7. DỮ LIỆU CHẤM CÔNG
var chamCongData = [
    { maNV: 'NV001', hoTen: 'Nguyễn Văn A', thang: '2025-10', soNgayCong: 20, soGioLam: 160, diMuon: 0, veSom: 1, nghiPhep: 2 },
    { maNV: 'NV002', hoTen: 'Trần Thị B', thang: '2025-10', soNgayCong: 22, soGioLam: 176, diMuon: 2, veSom: 0, nghiPhep: 0 },
    { maNV: 'NV003', hoTen: 'Lê Văn C', thang: '2025-10', soNgayCong: 21, soGioLam: 168, diMuon: 1, veSom: 1, nghiPhep: 1 }
];

// 8. DỮ LIỆU HỢP ĐỒNG
var hopDongData = [
    { ma: 'HD001', nhanVien: 'Nguyễn Văn A', loai: 'khongthoi', thoiHan: null, ngayBatDau: '2020-01-01', ngayKetThuc: null, luong: 15000000, ghiChu: '', trangThai: 'active' },
    { ma: 'HD002', nhanVien: 'Trần Thị B', loai: 'cothoi', thoiHan: 2, ngayBatDau: '2023-03-01', ngayKetThuc: '2025-03-01', luong: 12000000, ghiChu: '', trangThai: 'warning' }
];

// 9. DỮ LIỆU KHEN THƯỞNG
var khenThuongData = [
    { ma: 'KT001', nhanVien: 'Nguyễn Văn A', loai: 'Khen thưởng', lyDo: 'Hoàn thành xuất sắc dự án', giaTri: 5000000, ngay: '2025-09-15' },
    { ma: 'KT002', nhanVien: 'Trần Thị B', loai: 'Khen thưởng', lyDo: 'Nhân viên xuất sắc tháng', giaTri: 3000000, ngay: '2025-10-01' }
];

// 10. DỮ LIỆU LƯƠNG
var luongData = [
    { maNV: 'NV001', hoTen: 'Nguyễn Văn A', luongCoBan: 15000000, phuCap: 2000000, thuong: 3000000, khauTru: 1500000, thucNhan: 18500000, thang: '2025-10' },
    { maNV: 'NV002', hoTen: 'Trần Thị B', luongCoBan: 10000000, phuCap: 1500000, thuong: 1000000, khauTru: 1000000, thucNhan: 11500000, thang: '2025-10' },
    { maNV: 'NV003', hoTen: 'Lê Văn C', luongCoBan: 25000000, phuCap: 3000000, thuong: 5000000, khauTru: 2500000, thucNhan: 30500000, thang: '2025-10' }
];

// 11. DỮ LIỆU ĐÀO TẠO
var daoTAoData = [
    { ma: 'DT001', ten: 'Kỹ năng lãnh đạo', giangVien: 'Nguyễn Văn X', ngayBatDau: '2025-10-15', ngayKetThuc: '2025-10-20', soHocVien: 20, moTa: '', trangThai: 'ongoing' },
    { ma: 'DT002', ten: 'Quản lý dự án', giangVien: 'Trần Thị Y', ngayBatDau: '2025-11-01', ngayKetThuc: '2025-11-05', soHocVien: 15, moTa: '', trangThai: 'upcoming' },
    { ma: 'DT003', ten: 'Kỹ năng giao tiếp', giangVien: 'Lê Văn Z', ngayBatDau: '2025-09-20', ngayKetThuc: '2025-09-25', soHocVien: 25, moTa: '', trangThai: 'completed' }
];

// 12. DỮ LIỆU BÁO CÁO
var baoCaoData = [
    {
        ma: 'BC001',
        loai: 'Báo cáo nhân sự tháng',
        ky: 'Tháng 10/2025',
        nguoiTao: 'Trần Thị B',
        ngayTao: '2025-10-05',
        noiDung: {
            tongNhanVien: 247,
            nhanVienMoi: 8,
            nghiViec: 3,
            theoPhongBan: [
                { phongBan: 'Kỹ thuật', soLuong: 85 },
                { phongBan: 'Marketing', soLuong: 42 },
                { phongBan: 'Kinh doanh', soLuong: 55 },
                { phongBan: 'Nhân sự', soLuong: 25 },
                { phongBan: 'Tài chính', soLuong: 40 }
            ]
        }
    },
    {
        ma: 'BC002',
        loai: 'Báo cáo tuyển dụng',
        ky: 'Quý 3/2025',
        nguoiTao: 'Nguyễn Văn A',
        ngayTao: '2025-10-01',
        noiDung: {
            tongViTri: 15,
            dangTuyen: 8,
            daDong: 7,
            daTuyenDuoc: 12,
            chiTiet: [
                { viTri: 'Lập trình viên Java', soLuong: 3, daTuyen: 3 },
                { viTri: 'Nhân viên Marketing', soLuong: 2, daTuyen: 2 },
                { viTri: 'Chuyên viên Tài chính', soLuong: 1, daTuyen: 1 }
            ]
        }
    },
    {
        ma: 'BC003',
        loai: 'Báo cáo lương thưởng',
        ky: 'Tháng 09/2025',
        nguoiTao: 'Lê Văn C',
        ngayTao: '2025-09-30',
        noiDung: {
            tongLuong: 2400000000,
            tongThuong: 150000000,
            tongKhauTru: 80000000,
            thucChi: 2470000000,
            chiTiet: [
                { phongBan: 'Kỹ thuật', luong: 850000000, thuong: 50000000 },
                { phongBan: 'Marketing', luong: 420000000, thuong: 30000000 },
                { phongBan: 'Kinh doanh', luong: 550000000, thuong: 40000000 }
            ]
        }
    },
    {
        ma: 'BC004',
        loai: 'Báo cáo đào tạo',
        ky: 'Quý 3/2025',
        nguoiTao: 'Trần Thị B',
        ngayTao: '2025-09-28',
        noiDung: {
            tongKhoaHoc: 8,
            hoanThanh: 6,
            dangDienRa: 1,
            sapDienRa: 1,
            tongHocVien: 145,
            chiTiet: [
                { khoaHoc: 'Kỹ năng lãnh đạo', hocVien: 20, hoanThanh: 20 },
                { khoaHoc: 'Quản lý dự án', hocVien: 15, hoanThanh: 15 },
                { khoaHoc: 'Kỹ năng giao tiếp', hocVien: 25, hoanThanh: 25 }
            ]
        }
    }
];
