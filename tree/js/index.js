var margin = {
    top: 20,
    right: 120,
    bottom: 20,
    left: 120
},
width = 960 - margin.right - margin.left,
height = 800 - margin.top - margin.bottom;

var root = {
    "name": "Директор",
        "children": [{
        "name": "Розробка",
            "children": [{
            "name": "Денис",
                "children": [{
                "name": "Иван",
                    "size": 3938
            }]
        }, {
            "name": "Ксения",
        }]
    }, {
        "name": "B2C",
            "children": [{
            "name": "Человек",
                "size": 17010
        }, {
            "name": "Человек",
                "size": 5842
        }, {
            "name": "Человек",
                "children": [{
                "name": "Человек",
                    "size": 1983
            }, {
                "name": "Человек",
                    "size": 2047
            }, {
                "name": "Человек",
                    "size": 1375
            }, {
                "name": "Человек",
                    "size": 8746
            }, {
                "name": "Человек",
                    "size": 2202
            }, {
                "name": "Человек",
                    "size": 1382
            }, {
                "name": "Человек",
                    "size": 1629
            }, {
                "name": "Человек",
                    "size": 1675
            }, {
                "name": "Человек",
                    "size": 2042
            }]
        }, {
            "name": "Человек",
                "size": 1041
        }, {
            "name": "Человек",
                "size": 5176
        }, {
            "name": "Человек",
                "size": 449
        }, {
            "name": "Человек",
                "size": 5593
        }, {
            "name": "Человек",
                "size": 5534
        }, {
            "name": "Человек",
                "size": 9201
        }, {
            "name": "Человек",
                "size": 19975
        }, {
            "name": "Человек",
                "size": 1116
        }, {
            "name": "Человек",
                "size": 6006
        }]
    }, {
        "name": "B2B",
            "children": [{
            "name": "Человек",
                "children": [{
                "name": "Человек",
                    "size": 721
            }, {
                "name": "Человек",
                    "size": 4294
            }, {
                "name": "Человек",
                    "size": 9800
            }, {
                "name": "Человек",
                    "size": 1314
            }, {
                "name": "Человек",
                    "size": 2220
            }]
        }, {
            "name": "Человек",
                "size": 1759
        }, {
            "name": "Человек",
                "size": 2165
        }, {
            "name": "Человек",
                "size": 586
        }, {
            "name": "Человек",
                "size": 3331
        }, {
            "name": "Человек",
                "size": 772
        }, {
            "name": "Человек",
                "size": 3322
        }]
    }, {
        "name": "Маркетинг",
            "children": [{
            "name": "SEO",
                "size": 8833,
                "children": [{
                "name": "Юра",
                    "size": 721,
                     "children": [{
                     "name": "Влад",
                    "size": 1983
                    
                     }]
            }]
        }, {
            "name": "SMM",
                 "children": [{
            "name": "Лена",

                 }]
        }, {
            "name": "Алина",
                "size": 3623
        }, {
            "name": "Таня",
                "size": 10066
     }, {
            "name": "Виталик",
                "size": 10066
                }, {
            "name": "Игорь",
                "size": 10066
        }]
    }, {
        "name": "HR",
            "children": [{
            "name": "Анна",
                "size": 4116
        }]
    }, {
        "name": "Call-Center",
            "children": [{
            "name": "Душенин",
                "size": 1082
        }, {
            "name": "Человек",
                "size": 1336
        }, {
            "name": "Человек",
                "size": 319
        }, {
            "name": "Человек",
                "size": 10498
        }, {
            "name": "Человек",
                "size": 2822
        }, {
            "name": "Человек",
                "size": 9983
        }, {
            "name": "Человек",
                "size": 2213
        }, {
            "name": "Человек",
                "size": 1681
        }]
    }]
};

var i = 0,
    duration = 750,
    rectW = 60,
    rectH = 30;
    

var tree = d3.layout.tree().nodeSize([70, 40]);
var diagonal = d3.svg.diagonal()
    .projection(function (d) {
    return [d.x + rectW / 2, d.y + rectH / 2];
});

var svg = d3.select("#body").append("svg").attr("width", 4000).attr("height", 4000)
    .call(zm = d3.behavior.zoom().scaleExtent([1,3]).on("zoom", redraw)).append("g")
    .attr("transform", "translate(" + 350 + "," + 20 + ")");

//necessary so that zoom knows where to zoom and unzoom from
zm.translate([350, 20]);

root.x0 = 0;
root.y0 = height / 2;

function collapse(d) {
    if (d.children) {
        d._children = d.children;
        d._children.forEach(collapse);
        d.children = null;
    }
}

root.children.forEach(collapse);
update(root);

d3.select("#body").style("height", "800px");

function update(source) {

    // Compute the new tree layout.
    var nodes = tree.nodes(root).reverse(),
        links = tree.links(nodes);

    // Normalize for fixed-depth.
    nodes.forEach(function (d) {
        d.y = d.depth * 180;
    });

    // Update the nodes…
    var node = svg.selectAll("g.node")
        .data(nodes, function (d) {
        return d.id || (d.id = ++i);
    });

    // Enter any new nodes at the parent's previous position.
    var nodeEnter = node.enter().append("g")
        .attr("class", "node")
        .attr("transform", function (d) {
        return "translate(" + source.x0 + "," + source.y0 + ")";
    })
        .on("click", click);

    nodeEnter.append("rect")
        .attr("width", rectW)
        .attr("height", rectH)
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .style("fill", function (d) {
        return d._children ? "lightsteelblue" : "#fff";
    });

    nodeEnter.append("text")
        .attr("x", rectW / 2)
        .attr("y", rectH / 2)
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        .text(function (d) {
        return d.name;
    });

    // Transition nodes to their new position.
    var nodeUpdate = node.transition()
        .duration(duration)
        .attr("transform", function (d) {
        return "translate(" + d.x + "," + d.y + ")";
    });

    nodeUpdate.select("rect")
        .attr("width", rectW)
        .attr("height", rectH)
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .style("fill", function (d) {
        return d._children ? "lightsteelblue" : "#fff";
    });

    nodeUpdate.select("text")
        .style("fill-opacity", 1);

    // Transition exiting nodes to the parent's new position.
    var nodeExit = node.exit().transition()
        .duration(duration)
        .attr("transform", function (d) {
        return "translate(" + source.x + "," + source.y + ")";
    })
        .remove();

    nodeExit.select("rect")
        .attr("width", rectW)
        .attr("height", rectH)
    //.attr("width", bbox.getBBox().width)""
    //.attr("height", bbox.getBBox().height)
    .attr("stroke", "black")
        .attr("stroke-width", 1);

    nodeExit.select("text");

    // Update the links…
    var link = svg.selectAll("path.link")
        .data(links, function (d) {
        return d.target.id;
    });

    // Enter any new links at the parent's previous position.
    link.enter().insert("path", "g")
        .attr("class", "link")
        .attr("x", rectW / 2)
        .attr("y", rectH / 2)
        .attr("d", function (d) {
        var o = {
            x: source.x0,
            y: source.y0
        };
        return diagonal({
            source: o,
            target: o
        });
    });

    // Transition links to their new position.
    link.transition()
        .duration(duration)
        .attr("d", diagonal);

    // Transition exiting nodes to the parent's new position.
    link.exit().transition()
        .duration(duration)
        .attr("d", function (d) {
        var o = {
            x: source.x,
            y: source.y
        };
        return diagonal({
            source: o,
            target: o
        });
    })
        .remove();

    // Stash the old positions for transition.
    nodes.forEach(function (d) {
        d.x0 = d.x;
        d.y0 = d.y;
    });
}

// Toggle children on click.
function click(d) {
    if (d.children) {
        d._children = d.children;
        d.children = null;
    } else {
        d.children = d._children;
        d._children = null;
    }
    update(d);
}

//Redraw for zoom
function redraw() {
  //console.log("here", d3.event.translate, d3.event.scale);
  svg.attr("transform",
      "translate(" + d3.event.translate + ")"
      + " scale(" + d3.event.scale + ")");
}
