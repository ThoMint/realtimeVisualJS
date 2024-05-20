var grid = GridStack.init({draggable: {handle: '.drag-target'}, maxRow: 2, float: false, cellHeight: "50%"});
var contentdivs = [];
var titledivs = [];
var charts = [];
var data = [];
var currentResizingIntervalHandle;
var currentResizingFunction;
var currentResizingElement;


for(i = 0; i<3; i++)
{
    data[i] = [];
    for (let x = 0; x < 100; x++)
    {
        data[i].push({x, y: Math.sin(x)});
    }
}

for(i = 0; i<3; i++)
{
    grid.addWidget('<div class="grid-stack-item"><div class="grid-stack-item-content"><div class="outer"><div class="header drag-target" id="titlediv' + i + '">Title</div><div class="content" id="contentdiv' + i + '"></div></div></div></div>', {w: 5, h: 1});
}

for(i = 0; i<3; i++)
{
    contentdivs.push(document.getElementById('contentdiv' + i));
    titledivs.push(document.getElementById('titlediv' + i));
}

for(i = 0; i<3; i++)
{
    charts.push(new TimeChart.core(contentdivs[i], {
        series: [{ data: data[i]}],
        plugins: {
        lineChart: TimeChart.plugins.lineChart,
        d3Axis: TimeChart.plugins.d3Axis,
    }
    }));
    charts[i].update();
}

grid.on('resizestart', function(event, el)
{
    currentResizingElement = el.querySelector('.content').id.match(/(\d+)/)[0];
    
    currentResizingFunction = function resizeTimer()
    {
        charts[currentResizingElement].onResize();
    }

    currentResizingIntervalHandle = setInterval(currentResizingFunction, 50);
});

grid.on('resizestop', function(event, el)
{
    clearInterval(currentResizingIntervalHandle);
    currentResizingFunction();
});




offset = 0.0;

function myTimer() {
    for(i = 0; i<3; i++)
    {
        for (let x = 0; x < 100; x++)
        {
            data[i].splice(0,1);
            data[i].push({x: x, y: Math.sin(x*0.1+offset)});
        }
        charts[i].update();
    }
    offset+=0.03;
}

setInterval(myTimer, 100);