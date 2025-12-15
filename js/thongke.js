const thongKeData = {
    '2025-10': { tongNV: 247, nhanVienMoi: 8, nghiViec: 3, tongLuong: 2500000000, tangTruong: 12, tyLeNghi: 3.2, haiLong: 85 },
    '2025-09': { tongNV: 242, nhanVienMoi: 5, nghiViec: 2, tongLuong: 2400000000, tangTruong: 10, tyLeNghi: 2.8, haiLong: 84 },
    '2025-08': { tongNV: 239, nhanVienMoi: 6, nghiViec: 4, tongLuong: 2380000000, tangTruong: 11, tyLeNghi: 3.5, haiLong: 83 },
    '2025-07': { tongNV: 237, nhanVienMoi: 4, nghiViec: 2, tongLuong: 2350000000, tangTruong: 9, tyLeNghi: 2.5, haiLong: 82 },
    '2025-06': { tongNV: 235, nhanVienMoi: 3, nghiViec: 1, tongLuong: 2320000000, tangTruong: 8, tyLeNghi: 2.0, haiLong: 81 }
};

// Dữ liệu phân bổ phòng ban
const phongBanData = {
    'Kỹ thuật': 85,
    'Marketing': 42,
    'Kinh doanh': 55,
    'Nhân sự': 25,
    'Tài chính': 40
};

let nhanSuChart, luongChart, phongBanChart, tyLeChart;

function updateStatistics() {
    const monthInput = document.getElementById('selectMonth');
    const selectedMonth = monthInput.value;
    const data = thongKeData[selectedMonth];

    if (data) {
        document.getElementById('tongLuong').textContent = formatBillion(data.tongLuong) + ' tỷ';
        document.getElementById('tangTruong').textContent = data.tangTruong + '%';
        document.getElementById('tyLeNghi').textContent = data.tyLeNghi + '%';
        document.getElementById('haiLong').textContent = data.haiLong + '%';
    } else {
        // Default values if month not found
        document.getElementById('tongLuong').textContent = '0 tỷ';
        document.getElementById('tangTruong').textContent = '0%';
        document.getElementById('tyLeNghi').textContent = '0%';
        document.getElementById('haiLong').textContent = '0%';
    }

    renderTable();
    renderCharts();
}

function formatBillion(amount) {
    return (amount / 1000000000).toFixed(1);
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN').format(amount);
}

function renderTable() {
    const tbody = document.getElementById('thongkeTableBody');
    const months = Object.keys(thongKeData).sort().reverse(); // Sort descending
    
    tbody.innerHTML = months.map(month => {
        const data = thongKeData[month];
        const [year, monthNum] = month.split('-');
        return `
            <tr>
                <td>${monthNum}/${year}</td>
                <td>${data.tongNV}</td>
                <td>${data.nhanVienMoi}</td>
                <td>${data.nghiViec}</td>
                <td>${formatCurrency(data.tongLuong)} VNĐ</td>
            </tr>
        `;
    }).join('');
}

function renderCharts() {
    // Lấy dữ liệu để vẽ biểu đồ
    const months = Object.keys(thongKeData).sort();
    const labels = months.map(m => {
        const [year, month] = m.split('-');
        return month + '/' + year;
    });

    const tongNVData = months.map(m => thongKeData[m].tongNV);
    const nhanVienMoiData = months.map(m => thongKeData[m].nhanVienMoi);
    const nghiViecData = months.map(m => thongKeData[m].nghiViec);
    const luongData = months.map(m => thongKeData[m].tongLuong / 1000000000); // Convert to tỷ

    // Biểu đồ 1: Nhân sự theo tháng (Bar Chart)
    if (nhanSuChart) nhanSuChart.destroy();
    const nhanSuCtx = document.getElementById('nhanSuChart').getContext('2d');
    nhanSuChart = new Chart(nhanSuCtx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Tổng nhân viên',
                    data: tongNVData,
                    backgroundColor: 'rgba(102, 126, 234, 0.8)',
                    borderColor: 'rgba(102, 126, 234, 1)',
                    borderWidth: 2
                },
                {
                    label: 'Nhân viên mới',
                    data: nhanVienMoiData,
                    backgroundColor: 'rgba(40, 167, 69, 0.8)',
                    borderColor: 'rgba(40, 167, 69, 1)',
                    borderWidth: 2
                },
                {
                    label: 'Nghỉ việc',
                    data: nghiViecData,
                    backgroundColor: 'rgba(231, 76, 60, 0.8)',
                    borderColor: 'rgba(231, 76, 60, 1)',
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
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

    // Biểu đồ 2: Lương theo tháng (Line Chart)
    if (luongChart) luongChart.destroy();
    const luongCtx = document.getElementById('luongChart').getContext('2d');
    luongChart = new Chart(luongCtx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Tổng lương (tỷ VNĐ)',
                data: luongData,
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
                },
                title: {
                    display: false
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

    // Biểu đồ 3: Phân bổ phòng ban (Pie Chart)
    if (phongBanChart) phongBanChart.destroy();
    const phongBanCtx = document.getElementById('phongBanChart').getContext('2d');
    const phongBanLabels = Object.keys(phongBanData);
    const phongBanValues = Object.values(phongBanData);
    const colors = [
        'rgba(102, 126, 234, 0.8)',
        'rgba(40, 167, 69, 0.8)',
        'rgba(255, 193, 7, 0.8)',
        'rgba(231, 76, 60, 0.8)',
        'rgba(156, 39, 176, 0.8)'
    ];
    
    phongBanChart = new Chart(phongBanCtx, {
        type: 'doughnut',
        data: {
            labels: phongBanLabels,
            datasets: [{
                data: phongBanValues,
                backgroundColor: colors,
                borderColor: colors.map(c => c.replace('0.8', '1')),
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                },
                title: {
                    display: false
                }
            }
        }
    });

    // Biểu đồ 4: Tỷ lệ tăng trưởng và nghỉ việc (Line Chart)
    if (tyLeChart) tyLeChart.destroy();
    const tyLeCtx = document.getElementById('tyLeChart').getContext('2d');
    const tangTruongData = months.map(m => thongKeData[m].tangTruong);
    const tyLeNghiData = months.map(m => thongKeData[m].tyLeNghi);
    
    tyLeChart = new Chart(tyLeCtx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Tỷ lệ tăng trưởng (%)',
                    data: tangTruongData,
                    borderColor: 'rgba(40, 167, 69, 1)',
                    backgroundColor: 'rgba(40, 167, 69, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: 'rgba(40, 167, 69, 1)',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    yAxisID: 'y'
                },
                {
                    label: 'Tỷ lệ nghỉ việc (%)',
                    data: tyLeNghiData,
                    borderColor: 'rgba(231, 76, 60, 1)',
                    backgroundColor: 'rgba(231, 76, 60, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: 'rgba(231, 76, 60, 1)',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    yAxisID: 'y'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: false
                }
            },
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            }
        }
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    updateStatistics();
});
renderTable();
