pattern = [];

document.addEventListener('DOMContentLoaded', () => {

    // get elements
    mouse_coord_span = document.getElementById("mouse_coords");

    // svg elements
    let points = [];
    let lines = [];
    let svg = null;

    // parameters
    let box_dim = 200;
    let box_color = "black";
    let draw_color = "white";
    let draw_weight = 1;


    function render() {

        // create the selection area
        svg = d3.select('#draw')
                .attr('height', box_dim)
                .attr('width', box_dim);

        svg.append("rect")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("fill", box_color);

        svg.on('click', function() {
            console.log("clicked at coords")
            const coords = d3.mouse(this);
            console.log(coords)
            if (points.length) {
                connect = true;
            } else {
                connect = false;
            }
            draw_point(coords[0], coords[1], connect);
            pattern.push([coords[0], coords[1]]);
            console.log("pattern:")
            console.log(pattern)
        });

        svg.on('mousemove', function() {
            const coords = d3.mouse(this);
            mouse_coord_span.innerHTML = coords[0].toFixed(0) + ", " + coords[1].toFixed(0)
        });

        document.querySelector('#erase').onclick = () => {
            clean_up_draw();
        }

        // if logged in, save button exists
        if (document.querySelector('#pattern_save')) {
            console.log("found save form")
            document.querySelector('#pattern_save').addEventListener("submit", function(e) {
                console.log("clicked save");
                console.log("pattern as string");
                console.log(JSON.stringify(pattern));
                // normalize before saving to server
                if (!pattern.length) {
                    e.preventDefault();
                    document.getElementById("save_msg").innerHTML = "No pattern to save";
                    return 0;
                }
                let json_p = JSON.stringify(normalize(pattern));
                let p_name = document.getElementById("pattern_name").value;
                if (!p_name.length) {
                    e.preventDefault();
                    document.getElementById("save_msg").innerHTML = "Enter name to save";
                    return 0;
                }
                document.getElementById("pattern_data").value = json_p;    
            });
        }
        
    }

    function clean_up_draw() {
        for (let i = 0; i < points.length; i++)
            points[i].remove();
        for (let i = 0; i < lines.length; i++)
            lines[i].remove();
        points = [];
        lines = [];
        pattern = [];
    }

    function draw_point(x, y, connect) {

        const color = draw_color;
        const thickness = draw_weight;

        if (connect) {
            const last_point = points[points.length - 1];
            const line = svg.append('line')
                            .attr('x1', last_point.attr('cx'))
                            .attr('y1', last_point.attr('cy'))
                            .attr('x2', x)
                            .attr('y2', y)
                            .attr('stroke-width', thickness)
                            .style('stroke', color);
            lines.push(line);
        }

        const point = svg.append('circle')
                         .attr('cx', x)
                         .attr('cy', y)
                         .attr('r', thickness)
                         .style('fill', color);
        points.push(point);
    }

    render();
    // send pattern to viewer to expore
    document.querySelector('#explore').onclick = () => {
        console.log("explore clicked")
        viewer(pattern);
    };
    // initialize viewier with blank pattern
    viewer(pattern, box_dim);
});


