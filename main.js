let sample1;
let data = [];
let scaleX;
let scaleY;
let colorCountry;
let radiusCountry;

let leftTopInterval;
let leftBottomInterval;
let rightTopInterval;
let rightBottomInterval;
let centerInterval;
let explodeInterval;


let xStart = 40;
let xEnd = 60;
let yStart = 5;
let yEnd = 7;


let dim = {
    'width': 1400, 
   'height':1000, 
   'margin':50   
};


  
let svg = d3.select("#chart1").append("svg")  
     .attrs(dim);

     
     
let g = svg.append("g");      
     
     


let div = d3.select('body')
             .append("div")
             .attr("class", "tooltip")
             .style("opacity", 0);


function processSheets() {

     Promise.all([
          fetch("./country_group.csv")
               .then(function(resp){
               return resp.text();
               })            
               .then(function(data){
               sample1 = $.csv.toArrays(data).slice(1);
               
               }),        
     ]).then((resp) =>{

          sample1.forEach(element => {
               data.push({
                    country: element[0],
                    group: element[1],                
               })               
          });    

     }).then((resp)=>{
          console.log(data)
          drawAxis(data);
          centerInterval = setInterval(() => {
                         draw(data, false);
               }, 100);
     })

}    


processSheets();



document.getElementById("topleft").addEventListener('click', function(){
    clearInterval(centerInterval);
    clearInterval(leftTopInterval);
    clearInterval(rightTopInterval);
    clearInterval(leftBottomInterval);
    clearInterval(rightBottomInterval);
    clearInterval(explodeInterval);

         leftTopInterval =  setInterval(() => {

              draw(data, true, 'topleft'); 
         }, 100);


});

document.getElementById("topright").addEventListener('click', function(){
    clearInterval(centerInterval);
    clearInterval(leftTopInterval);
    clearInterval(rightTopInterval);
    clearInterval(leftBottomInterval);
    clearInterval(rightBottomInterval);
    clearInterval(explodeInterval);

    rightTopInterval =  setInterval(() => {
         draw(data, true, 'topright'); 
    }, 100);

});

document.getElementById("bottomleft").addEventListener('click', function(){
    clearInterval(centerInterval);
    clearInterval(leftTopInterval);
    clearInterval(rightTopInterval);
    clearInterval(leftBottomInterval);
    clearInterval(rightBottomInterval);
    clearInterval(explodeInterval);

    leftBottomInterval =  setInterval(() => {
         draw(data, true, 'bottomleft'); 
    }, 100);

});

document.getElementById("bottomright").addEventListener('click', function(){
    clearInterval(centerInterval);
    clearInterval(leftTopInterval);
    clearInterval(rightTopInterval);
    clearInterval(leftBottomInterval);
    clearInterval(rightBottomInterval);
    clearInterval(explodeInterval);

    rightBottomInterval =  setInterval(() => {
         draw(data, true, 'bottomright'); 
    }, 100);

});

document.getElementById("centre").addEventListener('click', function(){
         clearInterval(centerInterval);
         clearInterval(leftTopInterval);
         clearInterval(rightTopInterval);
         clearInterval(leftBottomInterval);
         clearInterval(rightBottomInterval);
         clearInterval(explodeInterval);

         rightBottomInterval =  setInterval(() => {
         draw(data, false);
    }, 100);

});

document.getElementById("explode").addEventListener('click', function(){

    clearInterval(centerInterval);
    clearInterval(leftTopInterval);
    clearInterval(rightTopInterval);
    clearInterval(leftBottomInterval);
    clearInterval(rightBottomInterval);
    clearInterval(explodeInterval);

    rightBottomInterval =  setInterval(() => {
         draw(data, true, 'explode'); 
    }, 100);

});

document.getElementById("stop").addEventListener('click', function(){

    clearInterval(centerInterval);
    clearInterval(leftTopInterval);
    clearInterval(rightTopInterval);
    clearInterval(leftBottomInterval);
    clearInterval(rightBottomInterval);
    clearInterval(explodeInterval);
 
  


});




function drawAxis(data) {



    scaleX = d3.scaleLinear()
                   .domain([0, 100])
                   .nice()
                   .range([dim.margin, dim.width-dim.margin]);
         
    let axisX = d3.axisBottom(scaleX);
    
    svg.append('g')
         .attr('transform', `translate(0, ${dim.height-dim.margin})`)
         .attr('opacity', 0) 
         .call(axisX);   
    
    scaleY = d3.scaleLinear()
         .domain([0, 12])
         .nice()
         .range([dim.height-dim.margin, dim.margin]);
    
    
    let axisY = d3.axisLeft(scaleY);
    
    
    
    svg.append('g')
         .attr('transform', `translate(${dim.margin}, 0)`)
         .attr('opacity', 0) 
         .call(axisY);  
         
    
    colorCountry = d3.scaleOrdinal()
                        .domain(data, d => d.country)             
                        .range(d3.schemeSet3);
    
    radiusCountry = d3.scaleLinear()
                       .domain([50000, 1500000000])
                       .range([7,40])                    
    
    }
    
    
    
function draw(data, ungroup, group, colour) {  
    
    if(ungroup == false) {
        xStart = 30;
        xEnd = 70;
        yStart = 3;
        yEnd = 10;
   }else if (ungroup == true && group == 'topleft') {
        xStart = 0;
        xEnd = 30;
        yStart = 8;
        yEnd = 12;
   }else if (ungroup == true && group == 'topright') {
        xStart = 80;
        xEnd = 100;
        yStart = 8;
        yEnd = 12;
   }else if (ungroup == true && group == 'bottomleft') {
        xStart = 0;
        xEnd = 30;
        yStart = 0;
        yEnd = 5;
   }else if (ungroup == true && group == 'bottomright') {
        xStart = 70;
        xEnd = 100;
        yStart = 0;
        yEnd = 5;
   }else if (ungroup == true && group == 'explode') {
        xStart = [];
   }

    
    
    function update(data) {
              g.selectAll('circle')
              .data(data, d=> d.country)
              .join(enter =>
                 enter.append('circle')
                 .attr('cx', (d) =>{
                      return  scaleX(0)
                  })           
                  .attr('cy', function(d){
                      return  scaleY(0)    
                  }) 
                  .attr('r', (d)=>{
                        return 10;
                  })
                  .attr('fill', function(d){
                       if(d.group =='A'){
                             return 'purple'
                       }else if(d.group =='B'){
                             return 'green'
                       }else if(d.group == 'C'){
                             return 'blue'
                       }else {
                             return 'red';
                       }
                  }),
                  update => update
                        .call(circle => circle.transition().ease(d3.easeLinear,1).duration(700)            
                        .attr('cx', (d) =>{
                             if(Array.isArray(xStart)){
                                  if(d.group =='A'){
                                       return  scaleX(randomIntFromInterval(0, 30)); 
                                 }else if(d.group =='B'){
                                       return  scaleX(randomIntFromInterval(0, 30)); 
                                 }else if(d.group == 'C'){
                                       return  scaleX(randomIntFromInterval(70, 100)); 
                                 }else {
                                       return  scaleX(randomIntFromInterval(70, 100)); 
                                 }
                             }else {
                                  return  scaleX(randomIntFromInterval(xStart, xEnd));                          
                             }
                             
                        })           
                        .attr('cy', function(d){
                             if(Array.isArray(xStart)){
                                  if(d.group =='A'){
                                       return  scaleY(randomIntFromInterval(0, 4)); 
                                 }else if(d.group =='B'){
                                       return  scaleY(randomIntFromInterval(8, 12)); 
                                 }else if(d.group == 'C'){
                                       return  scaleY(randomIntFromInterval(0, 4)); 
                                 }else {
                                       return  scaleY(randomIntFromInterval(8, 12)); 
                                 } 
                             }else {
                                  return  scaleY(randomIntFromInterval(yStart, yEnd));
                             }      
                        })),
                  exit => exit
                     
               )
               .call(circle => circle.transition().ease(d3.easeLinear,1).duration(700)            
                   .attr('cx', (d) =>{
                        if(Array.isArray(xStart)){
                             if(d.group =='A'){
                                  return  scaleX(randomIntFromInterval(0, 30)); 
                            }else if(d.group =='B'){
                                  return  scaleX(randomIntFromInterval(0, 30)); 
                            }else if(d.group == 'C'){
                                  return  scaleX(randomIntFromInterval(70, 100)); 
                            }else {
                                  return  scaleX(randomIntFromInterval(70, 100)); 
                            }
                        }else {
                             return  scaleX(randomIntFromInterval(xStart, xEnd));                          
                        }
                        
                   })           
                   .attr('cy', function(d){
    
                        if(Array.isArray(xStart)){
                             if(d.group =='A'){
                                  return  scaleY(randomIntFromInterval(0, 4)); 
                            }else if(d.group =='B'){
                                  return  scaleY(randomIntFromInterval(8, 12)); 
                            }else if(d.group == 'C'){
                                  return  scaleY(randomIntFromInterval(0, 4)); 
                            }else {
                                  return  scaleY(randomIntFromInterval(8, 12)); 
                            } 
                        }else {
                             return  scaleY(randomIntFromInterval(yStart, yEnd));
                        }
                           
                   }));
         }
    
    
         update(data);
    
    }
    
function randomIntFromInterval(min,max){
    return Math.random() * (max-min+1) + min;
}

