class Legend {

    Attributes = [];
    Metrics = {
        X: 600,
        Y: 100,
        Width: 200/attrs.length,
        Height: 400,
        Margin: 10
    }

    constructor(driver, drivers){
        this.Driver = driver
        this.Drivers = drivers;
    }

    constructLegend(canvas){

        for(let a = 0; a < attrs.length; a++){
                let x = this.Metrics.X+this.Metrics.Margin+((this.Metrics.Width+60)*a+1);
                let y = this.Metrics.Y;
                let width = this.Metrics.Width;
                let height = this.Metrics.Height;
                let attName = attrs[a];
    
                let att_minmax = Object.values(this.Driver.MinMax)[a];
                let att_tag = attrsTags[a];
                let attribute = new Attribute(x,y,width,height,attName, att_minmax, a, att_tag);
                attribute.constructAtt(canvas);
                this.Attributes.push(attribute);
        }

       for(let a = 0; a < this.Attributes.length; a++){
           let att = this.Attributes[a];
           att.constructBar(canvas, this.Drivers)
        }
        for(let i = 0; i < this.Drivers.length; i++){
            canvas.append("path")
            .attr("class","pcoords"+this.Drivers[i].Num)
            .attr("stroke",this.Drivers[i].Color)
            .attr("fill","none")
            .attr("stroke-width",4)
        }

        

        this.PcoordsLine = d3.line()
            .x(d => d.X)
            .y(d => d.Y);
        


    }

    updateLegend(canvas, index, currentLap){
        for(let d = 0; d < this.Drivers.length; d++){
            
            this.Pcoords = []
            for(let a = 0; a < this.Attributes.length; a++){
                let att = this.Attributes[a];
                if(d==0){
                    att.updateValue(canvas, this.Drivers[d], index)
                }
                att.updateAtt(canvas, this.Drivers[d], index);
                this.Pcoords.push({
                    X: att.X + this.Metrics.Width/2,
                    Y: att.BarHeight
                });
            }
       
            canvas.select(".pcoords"+this.Drivers[d].Num)
                .attr("d", this.PcoordsLine(this.Pcoords))
        }


    }


}