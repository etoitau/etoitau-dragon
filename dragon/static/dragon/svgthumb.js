document.addEventListener('DOMContentLoaded', () => {
    thumbs = document.querySelectorAll(".thumbnail").forEach(function(self) {
        // svg elements
        // points and lines will be arrays of arrays eg points[level][svgpoint]
        let points = [];
        points[0] = [];
        let lines = [];
        lines[0] = [];
        let svg = null;
        
        in_pattern = JSON.parse(self.dataset.coords);
        console.log("got coord data:");
        console.log(JSON.stringify(in_pattern));

        // parameters
        let box_color = "black";
        let draw_color = "white";
        let draw_weight = 1;
        // set viewer box size
        let box_dim = 100;

        function render() {
            // create the selection area
            svg = d3.select(self)
                    .attr('height', box_dim)
                    .attr('width', box_dim);
            
            svg.append("rect")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("fill", box_color)
            
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
        }

        function draw_point(level, x, y, connect) {

            const color = draw_color;
            const thickness = draw_weight;

            if (connect) {
                const last_point = points[level][points[level].length - 1];
                const line = svg.append('line')
                                .attr('x1', last_point.attr('cx'))
                                .attr('y1', last_point.attr('cy'))
                                .attr('x2', x)
                                .attr('y2', y)
                                .attr('stroke-width', thickness)
                                .style('stroke', color);
                lines[level].push(line);
            }

            const point = svg.append('circle')
                            .attr('cx', x)
                            .attr('cy', y)
                            .attr('r', thickness)
                            .style('fill', color);
            points[level].push(point);
        }
        render();
    });
});