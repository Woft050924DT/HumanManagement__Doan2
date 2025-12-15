// Load dữ liệu báo cáo từ localStorage
let giamDocBaoCaoData = [];
let phongBanChart, doanhSoChart, nhanSuChart, doanhSoTrendChart;

// Dữ liệu doanh số mẫu (trong thực tế sẽ lấy từ báo cáo)
const doanhSoData = {
    'Kỹ thuật': { thang10: 15.5, thang9: 14.2, thang8: 13.8 },
    'Marketing': { thang10: 8.3, thang9: 7.9, thang8: 7.5 },
    'Kinh doanh': { thang10: 25.8, thang9: 24.5, thang8: 23.2 },
    'Nhân sự': { thang10: 0, thang9: 0, thang8: 0 },
    'Tài chính': { thang10: 12.5, thang9: 11.8, thang8: 11.2 }
};

function loadGiamDocBaoCaoData() {
    const stored = localStorage.getItem('giamDocBaoCaoData');
    if (stored) {
        giamDocBaoCaoData = JSON.parse(stored);
    }
}

// Hàm đăng xuất
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// Kiểm tra đăng nhập
function checkLogin() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        window.location.href = 'index.html';
        return false;
    }
    
    const user = JSON.parse(currentUser);
    if (user.role !== 'giamdoc') {
        window.location.href = 'index.html';
        return false;
    }
    
    if (document.getElementById('userWelcome')) {
        document.getElementById('userWelcome').textContent = `Xin chào, ${user.username}`;
    }
    
    return true;
}

// Tính toán thống kê tổng quan
function calculateStatistics() {
    // Lấy dữ liệu từ báo cáo nhân sự mới nhất
    const baoCaoNhanSu = giamDocBaoCaoData
        .filter(bc => bc.loai.includes('nhân sự') || bc.loai.includes('Nhân sự'))
        .sort((a, b) => new Date(b.ngayGui || b.ngayTao) - new Date(a.ngayGui || a.ngayTao))[0];
    
    // Lấy dữ liệu từ báo cáo tuyển dụng mới nhất
    const baoCaoTuyenDung = giamDocBaoCaoData
        .filter(bc => bc.loai.includes('tuyển dụng') || bc.loai.includes('Tuyển dụng'))
        .sort((a, b) => new Date(b.ngayGui || b.ngayTao) - new Date(a.ngayGui || a.ngayTao))[0];
    
    // Lấy dữ liệu từ báo cáo lương mới nhất
    const baoCaoLuong = giamDocBaoCaoData
        .filter(bc => bc.loai.includes('lương') || bc.loai.includes('Lương'))
        .sort((a, b) => new Date(b.ngayGui || b.ngayTao) - new Date(a.ngayGui || a.ngayTao))[0];
    
    // Tính tổng nhân viên
    const tongNhanVien = baoCaoNhanSu?.noiDung?.tongNhanVien || 0;
    const nhanVienMoi = baoCaoNhanSu?.noiDung?.nhanVienMoi || 0;
    const nghiViec = baoCaoNhanSu?.noiDung?.nghiViec || 0;
    const tyLeNghiViec = tongNhanVien > 0 ? ((nghiViec / tongNhanVien) * 100).toFixed(1) : 0;
    
    // Tính tổng phòng ban
    const tongPhongBan = baoCaoNhanSu?.noiDung?.theoPhongBan?.length || 0;
    
    // Tính đang tuyển dụng
    const dangTuyenDung = baoCaoTuyenDung?.noiDung?.dangTuyen || 0;
    const daTuyenDuoc = baoCaoTuyenDung?.noiDung?.daTuyenDuoc || 0;
    const tongViTri = baoCaoTuyenDung?.noiDung?.tongViTri || 0;
    const hieuQuaTuyenDung = tongViTri > 0 ? ((daTuyenDuoc / tongViTri) * 100).toFixed(1) : 0;
    
    // Tính tổng chi phí lương
    const tongChiPhiLuong = baoCaoLuong?.noiDung?.tongLuong || 0;
    
    // Tính tổng doanh số
    let tongDoanhSo = 0;
    Object.values(doanhSoData).forEach(pb => {
        tongDoanhSo += pb.thang10 || 0;
    });
    
    // Cập nhật UI
    document.getElementById('tongNhanVien').textContent = tongNhanVien;
    document.getElementById('tongPhongBan').textContent = tongPhongBan;
    document.getElementById('dangTuyenDung').textContent = dangTuyenDung;
    document.getElementById('doanhSo').textContent = formatBillion(tongDoanhSo * 1000000000) + ' tỷ';
    document.getElementById('tongChiPhiLuong').textContent = formatBillion(tongChiPhiLuong) + ' tỷ';
    document.getElementById('nhanVienMoi').textContent = nhanVienMoi;
    document.getElementById('tyLeNghiViec').textContent = tyLeNghiViec + '%';
    document.getElementById('hieuQuaTuyenDung').textContent = hieuQuaTuyenDung + '%';
}

// Vẽ biểu đồ phân bổ nhân sự theo phòng ban
function renderPhongBanChart() {
    const ctx = document.getElementById('phongBanChart');
    if (phongBanChart) phongBanChart.destroy();
    
    const baoCaoNhanSu = giamDocBaoCaoData
        .filter(bc => bc.loai.includes('nhân sự') || bc.loai.includes('Nhân sự'))
        .sort((a, b) => new Date(b.ngayGui || b.ngayTao) - new Date(a.ngayGui || a.ngayTao))[0];
    
    if (!baoCaoNhanSu || !baoCaoNhanSu.noiDung || !baoCaoNhanSu.noiDung.theoPhongBan) {
        ctx.parentElement.innerHTML = '<p style="text-align: center; color: #999; padding: 40px;">Chưa có dữ liệu phân bổ phòng ban</p>';
        return;
    }
    
    const labels = baoCaoNhanSu.noiDung.theoPhongBan.map(pb => pb.phongBan);
    const data = baoCaoNhanSu.noiDung.theoPhongBan.map(pb => pb.soLuong);
    const colors = [
        'rgba(102, 126, 234, 0.8)',
        'rgba(40, 167, 69, 0.8)',
        'rgba(255, 193, 7, 0.8)',
        'rgba(231, 76, 60, 0.8)',
        'rgba(156, 39, 176, 0.8)'
    ];
    
    phongBanChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors.slice(0, labels.length),
                borderColor: colors.slice(0, labels.length).map(c => c.replace('0.8', '1')),
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                }
            }
        }
    });
}

// Vẽ biểu đồ doanh số theo phòng ban
function renderDoanhSoChart() {
    const ctx = document.getElementById('doanhSoChart');
    if (doanhSoChart) doanhSoChart.destroy();
    
    const labels = Object.keys(doanhSoData);
    const data = labels.map(pb => doanhSoData[pb].thang10 || 0);
    
    doanhSoChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Doanh số (tỷ VNĐ)',
                data: data,
                backgroundColor: 'rgba(40, 167, 69, 0.8)',
                borderColor: 'rgba(40, 167, 69, 1)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return value + ' tỷ';
                        }
                    }
                }
            }
        }
    });
}

// Vẽ biểu đồ xu hướng nhân sự
function renderNhanSuChart() {
    const ctx = document.getElementById('nhanSuChart');
    if (nhanSuChart) nhanSuChart.destroy();
    
    const baoCaoNhanSu = giamDocBaoCaoData
        .filter(bc => bc.loai.includes('nhân sự') || bc.loai.includes('Nhân sự'))
        .sort((a, b) => new Date(a.ngayGui || a.ngayTao) - new Date(b.ngayGui || b.ngayTao));
    
    const labels = baoCaoNhanSu.map(bc => bc.ky);
    const tongNV = baoCaoNhanSu.map(bc => bc.noiDung?.tongNhanVien || 0);
    
    if (labels.length === 0) {
        ctx.parentElement.innerHTML = '<p style="text-align: center; color: #999; padding: 40px;">Chưa có dữ liệu nhân sự</p>';
        return;
    }
    
    nhanSuChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Tổng nhân viên',
                data: tongNV,
                borderColor: 'rgba(102, 126, 234, 1)',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: 'rgba(102, 126, 234, 1)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'top',
                }
            },
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });
}

// Vẽ biểu đồ xu hướng doanh số
function renderDoanhSoTrendChart() {
    const ctx = document.getElementById('doanhSoTrendChart');
    if (doanhSoTrendChart) doanhSoTrendChart.destroy();
    
    const labels = ['Tháng 8/2025', 'Tháng 9/2025', 'Tháng 10/2025'];
    const tongDoanhSo = [
        Object.values(doanhSoData).reduce((sum, pb) => sum + (pb.thang8 || 0), 0),
        Object.values(doanhSoData).reduce((sum, pb) => sum + (pb.thang9 || 0), 0),
        Object.values(doanhSoData).reduce((sum, pb) => sum + (pb.thang10 || 0), 0)
    ];
    
    doanhSoTrendChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Tổng doanh số (tỷ VNĐ)',
                data: tongDoanhSo,
                borderColor: 'rgba(40, 167, 69, 1)',
                backgroundColor: 'rgba(40, 167, 69, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: 'rgba(40, 167, 69, 1)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'top',
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    ticks: {
                        callback: function(value) {
                            return value + ' tỷ';
                        }
                    }
                }
            }
        }
    });
}

// Render bảng chi tiết phòng ban
function renderPhongBanTable() {
    const tbody = document.getElementById('phongBanTableBody');
    
    // Lấy dữ liệu từ báo cáo nhân sự mới nhất
    const baoCaoNhanSu = giamDocBaoCaoData
        .filter(bc => bc.loai.includes('nhân sự') || bc.loai.includes('Nhân sự'))
        .sort((a, b) => new Date(b.ngayGui || b.ngayTao) - new Date(a.ngayGui || a.ngayTao))[0];
    
    // Lấy dữ liệu từ báo cáo lương mới nhất
    const baoCaoLuong = giamDocBaoCaoData
        .filter(bc => bc.loai.includes('lương') || bc.loai.includes('Lương'))
        .sort((a, b) => new Date(b.ngayGui || b.ngayTao) - new Date(a.ngayGui || a.ngayTao))[0];
    
    if (!baoCaoNhanSu || !baoCaoNhanSu.noiDung || !baoCaoNhanSu.noiDung.theoPhongBan) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 40px; color: #999;">
                    <p>Chưa có dữ liệu phòng ban</p>
                </td>
            </tr>
        `;
        return;
    }
    
    const phongBanLuong = {};
    if (baoCaoLuong && baoCaoLuong.noiDung && baoCaoLuong.noiDung.chiTiet) {
        baoCaoLuong.noiDung.chiTiet.forEach(ct => {
            phongBanLuong[ct.phongBan] = ct.luong || 0;
        });
    }
    
    tbody.innerHTML = baoCaoNhanSu.noiDung.theoPhongBan.map(pb => {
        const luong = phongBanLuong[pb.phongBan] || 0;
        const doanhSo = (doanhSoData[pb.phongBan]?.thang10 || 0) * 1000000000; // Chuyển sang VNĐ
        const tyLe = pb.soLuong > 0 ? (doanhSo / pb.soLuong / 1000000).toFixed(2) : 0; // Triệu VNĐ/NV
        
        return `
            <tr>
                <td><strong>${pb.phongBan}</strong></td>
                <td>${pb.soLuong}</td>
                <td>${formatCurrency(luong)}</td>
                <td>${formatCurrency(doanhSo)}</td>
                <td>${formatCurrency(tyLe * 1000000)}/NV</td>
            </tr>
        `;
    }).join('');
}

// Cập nhật tất cả thống kê và biểu đồ
function updateStatistics() {
    loadGiamDocBaoCaoData();
    calculateStatistics();
    renderPhongBanChart();
    renderDoanhSoChart();
    renderNhanSuChart();
    renderDoanhSoTrendChart();
    renderPhongBanTable();
}

// Format functions
function formatBillion(amount) {
    return (amount / 1000000000).toFixed(1);
}

function formatCurrency(amount) {
    if (amount >= 1000000000) {
        return formatBillion(amount) + ' tỷ';
    } else if (amount >= 1000000) {
        return (amount / 1000000).toFixed(1) + ' triệu';
    }
    return new Intl.NumberFormat('vi-VN').format(amount) + ' VNĐ';
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    if (checkLogin()) {
        updateStatistics();
    }
});
