var mode, position;

var d3 = require('d3');

function handleKeyDown(e) {
    if (!mode && e.keyCode === 17) {
        mode = true;
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('keyup', handleKeyUp);
    }
}

function handleKeyUp(e) {
    if (mode && e.keyCode === 17) {
        mode = false;
        window.removeEventListener('mousedown', handleMouseDown);
        window.removeEventListener('mouseup', handleMouseUp);
        window.removeEventListener('mousemove', handleMouseMove);
    }
}

function handleMouseDown(e) {
    position = {
        x: e.clientX,
        y: e.clientY
    }
    drawCircle(e.clientX, e.clientY, 6);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
}

function handleMouseUp(e) {
    position = undefined;
    var arc1 = d3.svg.arc()
    .innerRadius(20)
    .outerRadius(20);
    var sgv = d3.select('svg');

    sgv.transition()
    .duration(250)
    .selectAll('path.circle')
    .delay(function(data, index){
        return index * 100;
    })
    .attr("d", arc1)
    .style('opacity', 0);

    sgv.transition()
    .delay(200)
    .remove();
}

function handleMouseMove(e) {
    var deltaX = e.clientX - position.x;
    var deltaY = e.clientY - position.y;
    var rad = Math.atan2(deltaX, deltaY);
    var deg = rad * (180 / Math.PI);
    var absDeg = Math.abs(deg);
    if (absDeg > 135) {
        color = 'red';
    } else if (absDeg < 45) {
        color = 'blue';
    } else if (deg > 0) {
        color = 'green';
    } else {
        color = 'yellow';
    }
    drawLine(position, {
        x: e.clientX,
        y: e.clientY
    }, color);
}

function drawCircle(x, y, sliceCount) {
    var pie = d3.layout.pie().value(function () {
        return 1;
    });

    var slices = [];
    for (var i = 0; i < sliceCount; i++) {
        slices.push({
            color: randomColor()
        });
    }

    slices = pie(slices);

    var arc = d3.svg.arc()
    .innerRadius(20)
    .outerRadius(80);

    var arc1 = d3.svg.arc()
    .innerRadius(20)
    .outerRadius(20);

    var svg = d3.select('body').append('svg')
    .attr('width', window.innerWidth + 'px')
    .attr('height', window.innerHeight + 'px');

    svg.append("circle")
    .attr("cx", x)
    .attr("cy", y)
    .attr("r", 20);

    var g = svg.append('g')
    .attr('transform', 'translate(' + x + ', ' + y + ')');

    g.selectAll('path.circle')
    .data(slices)
    .enter()
    .append('path')
    .classed('circle', true)
    .attr("d", arc1)
    .style('opacity', 0)
    .attr('fill', function (d) {
        return d.data.color;
    })
    .transition()
    .duration(200)
    .delay(function(data, index){
        return index* 50;
    })
    .attr("d", arc)
    .style('opacity', 1);
}

function getAngle(startPosition, endPosition) {
    var deltaX = startPosition.x - endPosition.x;
    var deltaY = startPosition.y - endPosition.y;
    var rad = Math.atan2(deltaX, deltaY);
    return rad;
}

function toDegrees(radians) {
    var deg = radians * (180 / Math.PI);
    return deg;
}

function toRadians(degrees) {
    return degrees * (Math.PI / 180)
}

function getDistance(startPosition, endPosititon){
    return Math.sqrt( Math.pow(startPosition.x - endPosititon.x, 2) + Math.pow(startPosition.y - endPosititon.y, 2) );
}

function drawLine(startPosition, endPosititon, color) {

    var lineFn = d3.svg.line()
    .x(function (d) {
        return d.x;
    }).y(function (d) {
        return d.y;
    });
    var svg = d3.select("svg");
    var line = svg.select('path.line');
    centerDistance = getDistance(startPosition, endPosititon);
    if(centerDistance < 20){
        line.remove();
        return;
    }

    if (line.empty()) {
        line = svg.append("path").classed('line', true).attr("stroke-width", 10).attr('stroke-linecap', 'round');
    }

    var lineAngle = getAngle(startPosition, endPosititon);
    var lineDegrees = toDegrees(lineAngle);
    if (lineDegrees > 0) {
        lineDegrees = (1 - lineDegrees / 360) * 360;
    } else {
        lineDegrees = Math.abs(lineDegrees);
    }

    var data = svg.selectAll('path.circle').data();
    var i = data.length,
    datum, colorFound;
    while (!colorFound && i--) {
        datum = data[i];
        if (lineDegrees >= toDegrees(datum.startAngle) && lineDegrees < toDegrees(datum.endAngle)) {
            colorFound = datum.data.color;
        }
    }

    line.attr("d", lineFn([startPosition, endPosititon]))
    .attr("stroke", colorFound)

}

window.addEventListener.on('keydown', handleKeyDown);

function randomInteger(max, min) {
    min = min || 0;
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomColor(mix) {
    var red = randomInteger(255);
    var green = randomInteger(255);
    var blue = randomInteger(255);

    if (mix) {
        mix.red && (red = (red + mix.red) / 2);
        mix.green && (green = (green + mix.green) / 2);
        mix.blue && (blue = (blue + mix.blue) / 2);
    }

    return rgbToHex(red, green, blue);
}

function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}
