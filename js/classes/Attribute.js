class Attribute{

    BarHeight = 0;



    constructor (x, y, width, height, name, minmax, index, att_tag){
        this.Index = index;
        this.X = x;
        this.Y = y;
        this.Width = width;
        this.Height = height;
        this.Name = name;
        this.AttMinMax = minmax;
        this.AttTag = att_tag;

        this.AttScale = d3.scaleLinear()
            .domain([this.AttMinMax[0], this.AttMinMax[1]])
            .range([0,this.Height])

        let axis_scale = d3.scaleLinear()
        .domain([this.AttMinMax[0], this.AttMinMax[1]])
        .range([this.Height,0])

        this.Axis = d3.axisLeft()
            .scale(axis_scale)
            .ticks(ticks[index])
            
        this.AxisClass = ".attAxis"+this.Name;
        this.ContainerClass = ".container_"+this.Name;
        this.LabelClass = ".label_"+this.Name;
        this.ValueClass = ".value_"+this.Name;
        this.BarClass = ".bar_"+this.Name;
    }

    constructAtt(canvas){
        this.Gradient = canvas.append("defs").append("linearGradient")
            .attr("id", "grad")
            .attr("x1", "0%")
            .attr("x2", "0%")
            .attr("y1", "0%")
            .attr("y2", "100%");
    
        this.Gradient.append("stop")
                .attr("offset", "0%")
                .style("stop-color", "#ff0000")//end in red
                .style("stop-opacity", 1)
    
        this.Gradient.append("stop")
                .attr("offset", "100%")
                .style("stop-color", "#00ff3c") //start in blue
                .style("stop-opacity", 1)


        canvas.append("g")
            .attr("class","attAxis"+this.Name)
            .call(this.Axis)
            .attr("transform", "translate(" + this.X + ", " + this.Y + ")")
        
        canvas.append("rect")
            .attr("class","container_"+this.Name)
            .attr("x", this.X)
            .attr("y", this.Y)
            .attr("width", this.Width)
            .attr("height", this.Height)
            .attr("fill","url(#grad)")
            .attr("stroke","Black")
            .attr("stroke-width",3)
        
        canvas.append("text")
            .attr("class","label_"+this.Name)
            .attr("x",this.X)
            .attr("y",this.Y-22)
            .attr("text-anchor","middel")
            .attr("font-size","15px")
            .style("text-decoration", "solid")
            .text(this.AttTag);
        
        canvas.append("text")
            .attr("class","value_"+this.Name)
            .attr("x",this.X)
            .attr("y",this.Y+this.Height+22)
            .attr("text-anchor","middel")
            .attr("font-size","22px")
            .style("text-decoration", "solid")
            .text("");
    }

    constructBar(canvas, drivers){
        for(let i = 0; i < drivers.length; i++){
            canvas.append("rect")
                .attr("class","bar_"+this.Name+drivers[i].Num)
                .attr("x",this.X)
                .attr("y",this.Y)
                .attr("width", this.Width)
                .attr("height", 4)
                .attr("fill",drivers[i].StrokeColor)
                .attr("stroke",drivers[i].Color)
                .attr("stroke-width",2)
        }
    }

    updateAtt(canvas, driver, index){
        let newHeight = this.AttScale(Object.values(driver.Dot[index])[2+this.Index])
        this.BarHeight = 500-newHeight;
        canvas.select(this.BarClass+driver.Num)
            .attr("y",500-newHeight)
            .attr("height",4);
    }

    updateValue(canvas, driver, index){
        canvas.select(this.ValueClass)
            .text(Object.values(driver.Dot[index])[2+this.Index])
    }
}