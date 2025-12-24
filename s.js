document.addEventListener('DOMContentLoaded', function () {
    let vaccineBarChart, vaccineLineChart; // 存放图表实例的变量

    const monthSelector = document.getElementById('monthSelector');
    const vaccineChartBarCanvas = document.getElementById('vaccineChartBar');
    const vaccineChartLineCanvas = document.getElementById('vaccineChartLine');

    function populateMonthSelector(months) {
        months.sort((a, b) => new Date(b + '01') - new Date(a + '01'));
        months.forEach(month => {
            const option = document.createElement('option');
            option.value = month;
            option.textContent = month;
            monthSelector.appendChild(option);
        });
        monthSelector.addEventListener('change', updateCharts);
    }

    function updateCharts() {
        const selectedMonth = monthSelector.value;
        const dataForMonth = vaccineData.filter(day => day.time.startsWith(selectedMonth));
        dataForMonth.sort((a, b) => new Date(b.time) - new Date(a.time));
        const labels = dataForMonth.map(day => day.time);
        const data = dataForMonth.map(day => day.number);

        if (vaccineBarChart) {
            vaccineBarChart.destroy();
        }
        vaccineBarChart = new Chart(vaccineChartBarCanvas.getContext('2d'), {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: '接种人数',
                    data: data,
                    backgroundColor: 'rgba(0, 125, 255, 0.6)',
                    borderColor: 'rgba(0, 1, 1, 1)',
                    borderWidth: 2
                }]
            },
            options: {
                scales: { y: { beginAtZero: true } },
                plugins: {
                    legend: { display: false },
                    title: { display: true, text: `新冠疫苗接种人数 - ${selectedMonth}` }
                }
            }
        });

        if (vaccineLineChart) {
            vaccineLineChart.destroy();
        }
        vaccineLineChart = new Chart(vaccineChartLineCanvas.getContext('2d'), {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: '接种人数',
                    data: data,
                    borderColor: 'rgba(0, 125, 255, 0.9)',
                    borderWidth: 3,
                    fill: false
                }]
            },
            options: {
                scales: { y: { beginAtZero: true } },
                plugins: {
                    legend: { display: false },
                    title: { display: true, text: `新冠疫苗接种人数 - ${selectedMonth}` }
                }
            }
        });
    }

    function fetchData() {
        fetch('ym2.csv')
            .then(response => response.text())
            .then(csv => {
                const results = Papa.parse(csv, { header: true });
                const data = results.data;
                const months = [...new Set(data.map(row => row.time.slice(0, 7)))];
                populateMonthSelector(months);
                window.vaccineData = data;
                updateCharts(); // Initial chart display
            })
            .catch(error => console.error('Error fetching CSV:', error));
    }

    fetchData();
});