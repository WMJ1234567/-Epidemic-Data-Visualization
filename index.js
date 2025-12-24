document.addEventListener('DOMContentLoaded', function () {
    const provincesData = [
        { province: '湖北省', infections: 68829 },
        { province: '上海市', infections: 64908 },
        { province: '广东省', infections: 52166 },
        { province: '吉林省', infections: 40482 },
        { province: '北京市', infections: 22884 },
        { province: '四川省', infections: 10983 },
        { province: '海南省', infections: 9731 },
        { province: '河南省', infections: 8494 },
        { province: '内蒙古自治区', infections: 8171 },
        { province: '重庆市', infections: 8113 },
        { province: '福建省', infections: 7048 },
        { province: '陕西省', infections: 5407 },
        { province: '黑龙江省', infections: 5319 },
        { province: '浙江省', infections: 15311 },
        { province: '山西省', infections: 4985 },
        { province: '云南省', infections: 4935 },
        { province: '山东省', infections: 4476 },
        { province: '江苏省', infections: 3734 },
        { province: '辽宁省', infections: 2929 },
        { province: '河北省', infections: 2831 },
        { province: '新疆维吾尔自治区', infections: 2632 },
        { province: '天津市', infections: 2617 },
        { province: '广西壮族自治区', infections: 2428 },
        { province: '湖南省', infections: 2411 },
        { province: '贵州省', infections: 1751 },
        { province: '安徽省', infections: 1689 },
        { province: '甘肃省', infections: 1560 },
        { province: '江西省', infections: 1545 },
        { province: '西藏自治区', infections: 1519 },
        { province: '青海省', infections: 510 },
        { province: '宁夏回族自治区', infections: 237 }
    ];

    const pieChart = new Chart(document.getElementById('pieChart'), {
        type: 'pie',
        data: {
            labels: provincesData.map(d => d.province),
            datasets: [{
                label: '感染人数',
                data: provincesData.map(d => d.infections),
                backgroundColor: provincesData.map(d => `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.8)`),
                borderColor: provincesData.map(d => 'white'),
                borderWidth: 3
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'top' },
                title: { display: true, text: '截止2022年12月省份感染人数分布' }
            }
        }
    });

    const barChart = new Chart(document.getElementById('barChart'), {
        type: 'bar',
        data: {
            labels: provincesData.map(d => d.province),
            datasets: [{
                label: '感染人数',
                data: provincesData.map(d => d.infections),
                backgroundColor: provincesData.map(d => `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 1)`),
                borderColor: provincesData.map(d => 'white'),
                borderWidth: 2
            }]
        },
        options: {
            scales: { y: { beginAtZero: 1} },
            plugins: {
                legend: { position: 'top' },
                title: { display: true, text: '截止2022年12月省份感染人数' }
            }
        }
    });

    // 交互逻辑：点击柱状图的柱子，高亮饼图中对应的部分
    barChart.options.onClick = function (event, elements) {
        if (elements.length > 0) {
            const index = elements[0].index;
            const selectedProvince = barChart.data.labels[index];
            highlightChart(pieChart, index);
        }
    };

    // 交互逻辑：点击饼图的扇区，高亮柱状图中对应的柱子
    pieChart.options.onClick = function (event, elements) {
        if (elements.length > 0) {
            const index = elements[0].index;
            const selectedProvince = pieChart.data.labels[index];
            highlightChart(barChart, index);
        }
    };

    function highlightChart(chart, index) {
        const backgroundColor = chart.data.datasets[0].backgroundColor;
        const newBackgroundColor = backgroundColor.map((color, i) => i === index ? 'rgba(1, 1, 1, 1)' : color);
        chart.data.datasets[0].backgroundColor = newBackgroundColor;
        chart.update();
    }
});