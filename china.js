document.addEventListener('DOMContentLoaded', function() {
    const map = L.map('map').setView([35.86166, 104.195397], 4);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    fetch('china.json')
        .then(response => response.json())
        .then(chinaData => {
            const geoJsonLayer = L.geoJSON(chinaData, {
                style: function(feature) {
                    return { color: '#ff7800', fillColor: '#ffeb3b', fillOpacity: 0.3 };
                },
                onEachFeature: function(feature, layer) {
                    layer.bindTooltip(feature.properties.name, { permanent: true, direction: 'center' });
                }
            }).addTo(map);

            fetch('all.csv')
                .then(response => response.text())
                .then(csvData => {
                    const rows = csvData.split('\n').slice(1);
                    const infectionData = rows.map(row => {
                        const [province, infections] = row.split(',');
                        return { province: province.trim(), infections: parseInt(infections, 10) };
                    });

                    // 假设 geoJsonLayer 已经加载了 china.json 数据
                    geoJsonLayer.eachLayer(function(layer) {
                        const provinceName = layer.feature.properties.name;
                        const infections = infectionData.find(data => data.province === provinceName)?.infections;
                        if (infections) {
                            // 在这里，我们使用 L.marker 来在省份中心点上添加感染人数的标记
                            const center = layer.feature.properties.center;
                            L.marker(center).addTo(map)
                                .bindPopup(infections.toString())
                                .openPopup();
                        }
                    });
                })
                .catch(error => console.error('Error loading the CSV file:', error));
        })
        .catch(error => console.error('Error loading the JSON file:', error));

    function getFillColor(infections) {
        const maxInfections = 999999; // 假设这是最大感染人数
        return d3.interpolateRdPu(infections / maxInfections);
    }
});