d3.csv("city.csv").then(data => {
    // 将累计确诊人数转换为以万人为单位
    data.forEach(d => {
        d.累计确诊人数 = +d.累计确诊人数 / 1;
    });

    // 准备省份数据
    const provinces = [...new Set(data.map(d => d.省份))];
    const provinceSelect = document.getElementById('provinceSelect');
    provinces.forEach(province => {
        const option = document.createElement('option');
        option.value = province;
        option.textContent = province;
        provinceSelect.appendChild(option);
    });

    // 选择省份后更新图表
    provinceSelect.addEventListener('change', function() {
        const selectedProvince = this.value;
        const provinceData = data.filter(d => d.省份 === selectedProvince);

        // 清除之前的图表和消息框
        d3.select("#chart").selectAll("*").remove();
        d3.select("#messages").selectAll("*").remove();

        // 设置SVG尺寸和边距
        const margin = { top: 120, right: 20, bottom: 30, left: 60 },
            width = 1400 - margin.left - margin.right,
            height = 300 - margin.top - margin.bottom;

        // 创建SVG画布
        const svg = d3.select("#chart")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // 添加标题
        svg.append("text")
            .attr("x", margin.left + width / 2)
            .attr("y", -60)
            .attr("text-anchor", "middle")
            .style("font-size", "50px")
            .style("font-weight", "bold")
            .text(`2022年初${selectedProvince}各城市累计疫情感染人数`);

        // 创建X轴的比例尺
        const x = d3.scaleBand()
            .range([0, width])
            .domain(provinceData.filter(d => d.累计确诊人数 > 0).map(d => d.城市))
            .padding(0.1);

        // 创建Y轴的比例尺
        const y = d3.scaleLinear()
            .range([height, 0])
            .domain([0, d3.max(provinceData, d => d.累计确诊人数)]);

        // 添加X轴
        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x));

        // 添加Y轴
        svg.append("g")
            .call(d3.axisLeft(y).ticks(10).tickFormat(d => `${d}人`));

        // 绘制柱状图
        const bars = svg.selectAll(".bar")
            .data(provinceData.filter(d => d.累计确诊人数 > 0))
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", d => x(d.城市))
            .attr("y", d => y(d.累计确诊人数))
            .attr("width", x.bandwidth())
            .attr("height", d => height - y(d.累计确诊人数));

        // 创建消息框
        const messages = d3.select("#messages");
        provinceData.filter(d => d.累计确诊人数 === 0).forEach(cityData => {
            messages.append("p")
                .style("font-size", "15px")
                .style("color", "red")
                .text(`${cityData.城市}感染人数为0`);
        });

        // 添加tooltip
        const tooltip = d3.select("#chart").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0)
            .style("position", "absolute")
            .style("text-align", "center")
            .style("padding", "8px")
            .style("font", "12px sans-serif")
            .style("background", "lightsteelblue")
            .style("border", "0px")
            .style("border-radius", "8px")
            .style("pointer-events", "none");

        bars.on("mouseover", function(event, d) {
            tooltip.style("opacity", 1)
                .html(`城市: ${d.城市}<br>感染人数: ${d.累计确诊人数}人`);
            d3.select(this).style("fill", "orange");
        })
            .on("mousemove", function(event) {
                tooltip.style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 10) + "px");
            })
            .on("mouseout", function() {
                tooltip.style("opacity", 0);
                d3.select(this).style("fill", null);
            });
    });
});