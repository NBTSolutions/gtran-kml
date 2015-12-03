var et = require('elementtree');

exports.addTo = function(kmlContent, geomType, symbol) {
    var kml = et.parse(kmlContent);

    // Add symbol style
    var style = et.SubElement(kml.find('Document'), 'Style');
    style.attrib.id = 'kml_symbol';

    switch (geomType) {
        case 'Point':
        case 'MultiPoint':
            var geomStyle = et.SubElement(style, 'IconStyle');
            addPointSymbol(geomStyle, symbol);
            break;
        case 'Polygon':
        case 'MultiPolygon':
            var geomStyle = et.SubElement(style, 'PolyStyle');
            addPolygonSymbol(geomStyle, symbol);
            break;
        case 'LineString':
        case 'MultiLineString':
            var geomStyle = et.SubElement(style, 'LineStyle');
            addLineStringSymbol(geomStyle, symbol);
            break;
        default:
            throw new Error('Geometry type unsupported.');
    }

    kml.findall('.//Placemark').forEach(function(place) {
        var placeStyle = et.SubElement(place, 'styleUrl')
        placeStyle.text = '#kml_symbol';
    });

    return kml.write();
};

function addPointSymbol(styleNode, symbol) {
    if(symbol.hasOwnProperty('color')) {
        var colorNode = et.SubElement(styleNode, 'color');
        colorNode.text = toKmlColor(symbol);
    }

    if(symbol.hasOwnProperty('scale')) {
        var scaleNode = et.SubElement(styleNode, 'scale');
        scaleNode.text = symbol.scale.toString();
    }

    if(symbol.hasOwnProperty('icon')) {
        var iconNode = et.SubElement(styleNode, 'Icon');
        var hrefNode = et.SubElement(iconNode, 'href');
        hrefNode.text = symbol.icon;
    }

    return styleNode;
}

function addPolygonSymbol(styleNode, symbol) {
    if(symbol.hasOwnProperty('color')) {
        var colorNode = et.SubElement(styleNode, 'color');
        colorNode.text = toKmlColor(symbol);
    }

    if(symbol.hasOwnProperty('fill')) {
        var fillNode = et.SubElement(styleNode, 'fill');
        fillNode.text = symbol.fill ? '1' : '0';
    }

    if(symbol.hasOwnProperty('outline')) {
        var outlineNode = et.SubElement(styleNode, 'outline');
        outlineNode.text = symbol.outline ? '1' : '0';
    }

    return styleNode;
}

function addLineStringSymbol(styleNode, symbol) {
    if(symbol.hasOwnProperty('color')) {
        var colorNode = et.SubElement(styleNode, 'color');
        colorNode.text = toKmlColor(symbol);
    }

    if(symbol.hasOwnProperty('width')) {
        var widthNode = et.SubElement(styleNode, 'width');
        widthNode.text = symbol.width.toString();
    }

    return styleNode;
}

function toKmlColor(symbol) {
    var color = symbol.color.substr(5, 2) +
                symbol.color.substr(3, 2) +
                symbol.color.substr(1, 2);

    color = 'alpha' in symbol ? symbol.alpha.toString(16) + color : 'ff' + color;

    return color;
}

function getFullHexagonValue(integer) {
  var str = integer.toString(16);
  return str.length < 2 ? '0' + str : str;
}
