class Timeline {

    Metrics = {
        width: 1100,
        height: 400,
        x: 50,
        y: 610
    };
    Clicked = false;

    constructor (drivers){
        this.TimeClass = ".timerect";
        this.IndClass = ".indline";
        this.TextClass = ".timetext";
        this.ClickClass = ".clickrect"
        this.Drivers = drivers;
        this.Metrics.height = drivers.length*50
    }

    toTime(lapsDataset, currentLap, index){
        return new DateTime(lapsDataset[currentLap-1][index].Time);
    }

    setupScales(tel, laps, canvas){
        this.TimeScale = d3.scaleLinear()
            .domain([this.Metrics.x,this.Metrics.width+this.Metrics.x])
            .range([0, tel.length]);
        this.LapScale = d3.scaleLinear()
            .range([this.Metrics.x,this.Metrics.width+this.Metrics.x])
            .domain([1, laps.length])
            .nice();
        this.LapAxis = d3.axisTop()
            .scale(this.LapScale)
            .ticks(laps.length);
        canvas.append("g")
            .call(this.LapAxis)
            .attr("transform", "translate(" + 0 + ", " + this.Metrics.y + ")")
            
    }

    setup(canvas){
        canvas.append("rect")
            .attr("class","timerect")
            .attr('x', this.Metrics.x)
            .attr('y', this.Metrics.y)
            .attr('width', this.Metrics.width)
            .attr('height', this.Metrics.height)
            .attr('stroke', 'black')
            .attr('fill', '#69a3b2');

        canvas.append("text")
            .attr("class","timetext")
            .attr("x", this.Metrics.x)
            .attr("y", this.Metrics.y+this.Metrics.height+12)
            .attr("text-anchor", "middle")  
            .style("font-size", "12px") 
            .style("text-decoration", "solid") 
            .text("")
        
        canvas.append("line")
            .attr("class","indline")
            .attr("y1", this.Metrics.y)
            .attr("y2", this.Metrics.y + this.Metrics.height)
            .attr("x1", this.Metrics.x)
            .attr("x2", this.Metrics.x)
            .attr("stroke", "Red")
            .attr('stroke-width',1)
            .attr("fill","none") 


    }
       

    drawTimeline(canvas, x, timeStr){
        if(canvas.select(this.TimeClass).size()==0){
            this.setup(canvas);
        }
        canvas.select(this.IndClass)
            .attr("x1", x)
            .attr("x2", x)
            .attr("stroke", "Red");
    
        canvas.select(this.TextClass)
            .attr("x", x)
            .text(timeStr)
    }


    constructTimeLineGraph(canvas){
        let laptimes = [];
        let stepX = this.Metrics.width/this.Drivers[0].Laps.length;
        let stepY = this.Metrics.height/this.Drivers.length;
        let driverPaths = new Map()
        let map = new Map();
        for(let j = 0; j < this.Drivers[0].Laps.length; j++){
            let lap = [];
            for(let i = 0; i < this.Drivers.length; i++){
                if(j >= this.Drivers[i].Laps.length) continue;
                let driver = this.Drivers[i];
                let laptime = driver.Laps[j].LapStartTime;
                let ls3 = driver.Laps[j].Sector3SessionTime
                let dnum = driver.Num;

                map.set(laptime+":"+ls3+":"+dnum, driver);
                driverPaths.set(dnum,[])
                lap.push(laptime+":"+ls3+":"+dnum);
            }
            laptimes.push(lap.sort())
        }

        for(let i = 0; i < laptimes.length; i++){
            for(let j = 0; j < laptimes[i].length; j++){
                let d = map.get(laptimes[i][j]);
                let x = this.Metrics.x+stepX*(i);
                let y = (this.Metrics.y+stepY*j)+(this.Metrics.height/this.Drivers.length)/2
                driverPaths.get(d.Num).push({X:x, Y:y})
                canvas.append("circle")
                    .attr("cx", x)
                    .attr("cy", y)
                    .attr("r",4)
                    .attr("fill",d.Color)
                    .attr("stroke",d.StrokeColor)
            
                if (i==1) {
                    canvas.append("text")
                        .attr("x", this.Metrics.x-25)
                        .attr("y", (this.Metrics.y+stepY*j)+(this.Metrics.height/this.Drivers.length)/2)
                        .text(d.Num)
                } else if(i==laptimes[i].length-1){
                    canvas.append("text")
                        .attr("x", this.Metrics.x+this.Metrics.width+25)
                        .attr("y", (this.Metrics.y+stepY*j)+(this.Metrics.height/this.Drivers.length)/2)
                        .text(this.Drivers[j].Num)
                }
            }

        }
        let pline = d3.line()
            .x(d => d.X)
            .y(d => d.Y)

        for(let [key, value] of driverPaths){
            canvas.append("path")
                .attr("class", "t_"+key)
                .attr("d", pline(value))
                .attr("fill","none")
                .attr("stroke",this.getDriver(key).Color)
                .attr("stroke-width",2)
        }

        canvas.append("rect")
            .attr("class","clickrect")
            .attr('x', this.Metrics.x)
            .attr('y', this.Metrics.y)
            .attr('width', this.Metrics.width)
            .attr('height', this.Metrics.height)
            .attr('stroke', '#00000000')
            .attr('fill', '#00000000');
        }

    getDriver(num){
        for(let i = 0; i < this.Drivers.length; i++){
            if(this.Drivers[i].Num==num){
                return this.Drivers[i]
            }
        }
        return null;
    }

    

}