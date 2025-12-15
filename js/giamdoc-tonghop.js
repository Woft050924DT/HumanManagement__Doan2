// Load dữ liệu báo cáo từ localStorage
let giamDocBaoCaoData = [];
let loaiBaoCaoChart, phongBanChart, nhanSuChart, luongChart;

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
    const tongBaoCao = giamDocBaoCaoData.length;
    const chuaDoc = giamDocBaoCaoData.filter(bc => !bc.daDoc).length;
    
    // Tính tổng nhân viên từ các báo cáo nhân sự
    let tongNhanVien = 0;
    let tongLuong = 0;
    
    giamDocBaoCaoData.forEach(bc => {
        if (bc.loai.includes('nhân sự') || bc.loai.includes('Nhân sự')) {
            if (bc.noiDung && bc.noiDung.tongNhanVien) {
                tongNhanVien = Math.max(tongNhanVien, bc.noiDung.tongNhanVien);
            }
        }
        if (bc.loai.includes('lương') || bc.loai.includes('Lương')) {
            if (bc.noiDung && bc.noiDung.tongLuong) {
                tongLuong += bc.noiDung.tongLuong || 0;
            }
        }
    });
    
    document.getElementById('tongBaoCao').textContent = tongBaoCao;
    document.getElementById('chuaDoc').textContent = chuaDoc;
    document.getElementById('tongNhanVien').textContent = tongNhanVien;
    document.getElementById('tongLuong').textContent = formatBillion(tongLuong) + ' tỷ';
}

// Cập nhật dropdown kỳ báo cáo
function updatePeriodDropdown() {
    const select = document.getElementById('selectPeriod');
    const periods = [...new Set(giamDocBaoCaoData.map(bc => bc.ky))].sort().reverse();
    
    // Xóa các option cũ (trừ "Tất cả")
    while (select.options.length > 1) {
        select.remove(1);
    }
    
    // Thêm các kỳ báo cáo
    periods.forEach(period => {
        const option = document.createElement('option');
        option.value = period;
        option.textContent = period;
        select.appendChild(option);
    });
}

// Render bảng tổng hợp
function renderTable() {
    const tbody = document.getElementById('tonghopTableBody');
    const selectedPeriod = document.getElementById('selectPeriod').value;
    
    let filteredData = giamDocBaoCaoData;
    if (selectedPeriod !== 'all') {
        filteredData = giamDocBaoCaoData.filter(bc => bc.ky === selectedPeriod);
    }
    
    // Sắp xếp theo ngày gửi giảm dần
    filteredData.sort((a, b) => new Date(b.ngayGui || b.ngayTao) - new Date(a.ngayGui || a.ngayTao));
    
    if (filteredData.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 40px; color: #999;">
                    <p style="font-size: 18px; margin-bottom: 10px;">📭</p>
                    <p>Chưa có báo cáo nào</p>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = filteredData.map(bc => {
        const statusBadge = bc.daDoc 
            ? '<span style="padding: 4px 12px; background: #e8f5e9; color: #388e3c; border-radius: 12px; font-size: 12px; font-weight: 500;">✓ Đã đọc</span>'
            : '<span style="padding: 4px 12px; background: #fff3e0; color: #f57c00; border-radius: 12px; font-size: 12px; font-weight: 500;">● Chưa đọc</span>';
        
        return `
            <tr>
                <td><strong>${bc.loai}</strong></td>
                <td>${bc.ky}</td>
                <td>${bc.nguoiGui || bc.nguoiTao}</td>
                <td>${formatDate(bc.ngayGui || bc.ngayTao)}</td>
                <td>${statusBadge}</td>
                <td>
                    <button class="action-btn btn-edit" onclick="window.location.href='giamdoc.html'">Xem chi tiết</button>
                </td>
            </tr>
        `;
    }).join('');
}

// Vẽ biểu đồ phân bổ báo cáo theo loại
function renderLoaiBaoCaoChart() {
    const ctx = document.getElementById('loaiBaoCaoChart');
    if (loaiBaoCaoChart) loaiBaoCaoChart.destroy();
    
    const loaiCount = {};
    giamDocBaoCaoData.forEach(bc => {
        let loai = 'Khác';
        if (bc.loai.includes('nhân sự') || bc.loai.includes('Nhân sự')) loai = 'Nhân sự';
        else if (bc.loai.includes('tuyển dụng') || bc.loai.includes('Tuyển dụng')) loai = 'Tuyển dụng';
        else if (bc.loai.includes('lương') || bc.loai.includes('Lương')) loai = 'Lương thưởng';
        else if (bc.loai.includes('đào tạo') || bc.loai.includes('Đào tạo')) loai = 'Đào tạo';
        
        loaiCount[loai] = (loaiCount[loai] || 0) + 1;
    });
    
    const labels = Object.keys(loaiCount);
    const data = Object.values(loaiCount);
    const colors = [
        'rgba(102, 126, 234, 0.8)',
        'rgba(40, 167, 69, 0.8)',
        'rgba(255, 193, 7, 0.8)',
        'rgba(231, 76, 60, 0.8)',
        'rgba(156, 39, 176, 0.8)'
    ];
    
    loaiBaoCaoChart = new Chart(ctx, {
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

// Vẽ biểu đồ phân bổ nhân sự theo phòng ban
function renderPhongBanChart() {
    const ctx = document.getElementById('phongBanChart');
    if (phongBanChart) phongBanChart.destroy();
    
    const phongBanData = {};
    
    // Lấy dữ liệu từ báo cáo nhân sự mới nhất
    const baoCaoNhanSu = giamDocBaoCaoData
        .filter(bc => bc.loai.includes('nhân sự') || bc.loai.includes('Nhân sự'))
        .sort((a, b) => new Date(b.ngayGui || b.ngayTao) - new Date(a.ngayGui || a.ngayTao))[0];
    
    if (baoCaoNhanSu && baoCaoNhanSu.noiDung && baoCaoNhanSu.noiDung.theoPhongBan) {
        baoCaoNhanSu.noiDung.theoPhongBan.forEach(pb => {
            phongBanData[pb.phongBan] = pb.soLuong;
        });
    }
    
    const labels = Object.keys(phongBanData);
    const data = Object.values(phongBanData);
    
    if (labels.length === 0) {
        ctx.parentElement.innerHTML = '<p style="text-align: center; color: #999; padding: 40px;">Chưa có dữ liệu phân bổ phòng ban</p>';
        return;
    }
    
    phongBanChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Số lượng nhân viên',
                data: data,
                backgroundColor: 'rgba(102, 126, 234, 0.8)',
                borderColor: 'rgba(102, 126, 234, 1)',
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
                    beginAtZero: true
                }
            }
        }
    });
}

// Vẽ biểu đồ xu hướng nhân sự
function renderNhanSuChart() {
    const ctx = document.getElementById('nhanSuChart');
    if (nhanSuChart) nhanSuChart.destroy();
    
    // Lấy dữ liệu từ các báo cáo nhân sự, sắp xếp theo ngày
    const baoCaoNhanSu = giamDocBaoCaoData
        .filter(bc => bc.loai.includes('nhân sự') || bc.loai.includes('Nhân sự'))
        .sort((a, b) => new Date(a.ngayGui || a.ngayTao) - new Date(b.ngayGui || b.ngayTao));
    
    const labels = baoCaoNhanSu.map(bc => bc.ky);
    const tongNV = baoCaoNhanSu.map(bc => bc.noiDung?.tongNhanVien || 0);
    const nhanVienMoi = baoCaoNhanSu.map(bc => bc.noiDung?.nhanVienMoi || 0);
    const nghiViec = baoCaoNhanSu.map(bc => bc.noiDung?.nghiViec || 0);
    
    if (labels.length === 0) {
        ctx.parentElement.innerHTML = '<p style="text-align: center; color: #999; padding: 40px;">Chưa có dữ liệu nhân sự</p>';
        return;
    }
    
    nhanSuChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Tổng nhân viên',
                    data: tongNV,
                    borderColor: 'rgba(102, 126, 234, 1)',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Nhân viên mới',
                    data: nhanVienMoi,
                    borderColor: 'rgba(40, 167, 69, 1)',
                    backgroundColor: 'rgba(40, 167, 69, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Nghỉ việc',
                    data: nghiViec,
                    borderColor: 'rgba(231, 76, 60, 1)',
                    backgroundColor: 'rgba(231, 76, 60, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }
            ]
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
                    beginAtZero: true
                }
            }
        }
    });
}

// Vẽ biểu đồ xu hướng lương
function renderLuongChart() {
    const ctx = document.getElementById('luongChart');
    if (luongChart) luongChart.destroy();
    
    // Lấy dữ liệu từ các báo cáo lương, sắp xếp theo ngày
    const baoCaoLuong = giamDocBaoCaoData
        .filter(bc => bc.loai.includes('lương') || bc.loai.includes('Lương'))
        .sort((a, b) => new Date(a.ngayGui || a.ngayTao) - new Date(b.ngayGui || b.ngayTao));
    
    const labels = baoCaoLuong.map(bc => bc.ky);
    const tongLuong = baoCaoLuong.map(bc => (bc.noiDung?.tongLuong || 0) / 1000000000); // Chuyển sang tỷ
    
    if (labels.length === 0) {
        ctx.parentElement.innerHTML = '<p style="text-align: center; color: #999; padding: 40px;">Chưa có dữ liệu lương</p>';
        return;
    }
    
    luongChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Tổng lương (tỷ VNĐ)',
                data: tongLuong,
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

// Cập nhật tất cả thống kê và biểu đồ
function updateStatistics() {
    loadGiamDocBaoCaoData();
    calculateStatistics();
    updatePeriodDropdown();
    renderTable();
    renderLoaiBaoCaoChart();
    renderPhongBanChart();
    renderNhanSuChart();
    renderLuongChart();
}

// Format functions
function formatBillion(amount) {
    return (amount / 1000000000).toFixed(1);
}

function formatDate(dateStr) {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    if (checkLogin()) {
        updateStatistics();
    }
});
