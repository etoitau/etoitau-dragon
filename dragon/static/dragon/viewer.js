// set up viewport that allows user to generate fractal from pattern
// and zoom and pan
function viewer(in_pattern) {
    console.log("viewer called with pattern:")
    console.log(JSON.stringify(in_pattern))
    // svg elements
    // points and lines will be arrays of arrays eg points[level][svgpoint]
    let points = [];
    points[0] = [];
    let lines = [];
    lines[0] = [];
    let svg = null;
    let outerG = null;
    let g = null;
    var zoom = null;
    var level = 0;
    var h_level = 0;

    // parameters
    let box_color = "black";
    let draw_color = "white";
    let highlight_color = "yellow";
    let draw_weight = 1;
    let gradations = 4;
    // set viewer box size
    let box_dim = window.innerWidth * 0.9;


    function render() {
        // create the selection area
        svg = d3.select('#explore_view')
                .attr('height', box_dim)
                .attr('width', box_dim);
        
        svg.append("rect")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("fill", box_color)
        
        outerG = svg.append("g");
        g = outerG.append("g");

        // thanks to https://bl.ocks.org/mbostock/4e3925cdc804db257a86fdef3a032a45
        zoom = d3.zoom();

        svg.call(zoom.on("zoom", zoomed));

        function zoomed() {
            g.attr("transform", d3.event.transform);
        }
        
        if (!in_pattern.length)
            return 0;

        // initialize pattern to fit:
        // convert pattern to unit chord length with chord angle = 0
        const norm_pattern = normalize(in_pattern);
        // scale to window
        const norm_max_min = getMaxMin(norm_pattern);
        var p = scale(norm_pattern, box_dim * 0.7 / norm_max_min["maxdim"]);
        // move to be centered in window
        const max_min = getMaxMin(p);
        // first move to be entirely in the viewer
        if (max_min["minx"] < 0) {
            p = translation(p, [Math.abs(max_min["minx"]), p[0][1]]);
        } 
        if (max_min["miny"] < 0) {
            p = translation(p, [p[0][0], Math.abs(max_min["miny"])]);
        } 
        // move to center
        const xspace = box_dim - max_min["xdim"];
        const yspace = box_dim - max_min["ydim"];
        p = translation(p, [p[0][0] + xspace/2, p[0][1] + yspace/2]);
        console.log("starting pattern in viewer:");
        console.log(JSON.stringify(p));
        // initialize with pattern
        var connect = false;
        for (let i = 0; i < p.length; i++) {
            draw_point(0, p[i][0], p[i][1], connect);
            if (!connect) {
                connect = true;
            } 
        }
        connect = false;


        document.querySelector('#deeper').onclick = () => {
            console.log("deeper called")
            if (h_level == level) {
                // initialize next level as array (of svg circles)
                points[level + 1] = [];
                lines[level + 1] = [];
                // apply pattern to current curve
                // same start point
                points[level + 1][0] = points[level][0];
                // initialize variable wich helps us alternate sides of line
                var out = true;
                // for each point at current level, starting at second, interpolate the pattern
                for (let i = 1; i < points[level].length; i++) {
                    // start and end coords of this part
                    let xstart = parseFloat(points[level][i - 1].attr("cx"));
                    let ystart = parseFloat(points[level][i - 1].attr("cy"));
                    let xend = parseFloat(points[level][i].attr("cx"));
                    let yend = parseFloat(points[level][i].attr("cy"));
                    let chord_length = chordLength([[xstart, ystart], [xend, yend]]);
                    let chord_angle = chordAngle([[xstart, ystart], [xend, yend]]);
                    let temp_p = JSON.parse(JSON.stringify(norm_pattern));
                    if (!out) {
                        temp_p = flip(temp_p);
                        out = true;
                    } else {
                        out = false;
                    }
                    temp_p = scale(temp_p, chord_length);
                    temp_p = rotate(temp_p, chord_angle);
                    temp_p = translation(temp_p, [xstart, ystart]);
                    // note starting point already created, start with second and connect
                    for (let j = 1; j < temp_p.length; j++) {
                        draw_point(level + 1, temp_p[j][0], temp_p[j][1], true)
                    }
                }
                level += 1;
            } 
            h_level++;
            grade(h_level);
        };
        document.querySelector('#up').onclick = () => {
            console.log("up called");
            h_level--;
            grade(h_level);
        };
    }

    function draw_point(level, x, y, connect) {
        const color = draw_color;
        const thickness = draw_weight;
        if (connect) {
            const last_point = points[level][points[level].length - 1];
            const line = g.append('line')
                            .attr('x1', last_point.attr('cx'))
                            .attr('y1', last_point.attr('cy'))
                            .attr('x2', x)
                            .attr('y2', y)
                            .attr('stroke-width', thickness)
                            .style('stroke', color);
            lines[level].push(line);
        }
        const point = g.append('circle')
                         .attr('cx', x)
                         .attr('cy', y)
                         .attr('r', thickness)
                         .style('fill', color);
        points[level].push(point);
    }

    function grade(current) {
        for (let i = 0; i < lines.length; i++) {
            if (Math.abs(current - i) < gradations) {
                for (let j = 0; j < lines[i].length; j++) {
                    lines[i][j].style("opacity", 1 - Math.abs(current - i) / gradations);
                }
                for (let j = 0; j < points[i].length; j++) {
                    points[i][j].style("opacity", 1 - Math.abs(current - i) / gradations);
                }
            }
            if (current - i == 0) {
                for (let j = 0; j < lines[i].length; j++) {
                    lines[i][j].style("stroke", highlight_color);
                }
                for (let j = 0; j < points[i].length; j++) {
                    points[i][j].style("fill", highlight_color);
                }
            } else if (Math.abs(current-i) == 1) {
                for (let j = 0; j < lines[i].length; j++) {
                    lines[i][j].style("stroke", draw_color);
                }
                for (let j = 0; j < points[i].length; j++) {
                    points[i][j].style("fill", draw_color);
                }
            }
        }
    }
    render();
}
