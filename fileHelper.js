//RGB to HSL
function rgbToHsl(r, g, b) {
    r /= 255, g /= 255, b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if(max === min){
        h = s = 0;
    }
    else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return {"h" : h, "s": s, "l": l};
}

//HSL to RGB
function hslToRgb(h, s, l){
    var r, g, b;

    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        var hue2rgb = function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

//RGB to HEX
function componentToHex(c) {
    const hex = c.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
}
function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

//HEX to RGB
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : null;
}

//HEX to HSL
function hexToHsl(hex) {
    const rgb = hexToRgb(hex)
    return rgbToHsl(rgb[0], rgb[1], rgb[2])
}

//HSL to HEX
function hslToHex(h, s, l) {
    console.log(h, s, l)

    const rgb = hslToRgb(h, s, l)
    console.log(rgb)
    return rgbToHex(rgb[0], rgb[1], rgb[2])
}

//Company logo upload reader
function readFile() {
    if (!this.files || !this.files[0]) return;
    const fr1 = new FileReader();
    fr1.addEventListener("load", function(evt) {
        logoB64 = evt.target.result
        const image = new Image();
        const previewImage = $("#preview-logo")[0]
        image.src = logoB64;
        previewImage.src = logoB64;
        image.onload = function() {
            imageHeight = image.height
            imageWidth = image.width
            aspectRatio = imageWidth/imageHeight

            if (aspectRatio < 0.5) {
                imageHeight = 12 / aspectRatio
                imageWidth = 12
                imageYOffset = 8
            }
            else if (aspectRatio < 1.05) {
                imageHeight = 22 / aspectRatio
                imageWidth = 22
                imageYOffset = 5
            }
            else if (aspectRatio < 1.5) {
                imageHeight = 19
                imageWidth = 19 * aspectRatio
                imageYOffset = 2
            }
            else {
                imageHeight = 12
                imageWidth = 12 * aspectRatio
                imageYOffset = 0
            }
        }
    });
    fr1.readAsDataURL(this.files[0]);
}

//Background SVG upload reader
function readBGFile() {
    if (!this.files || !this.files[0]) return;
    const fr3 = new FileReader();
    fr3.addEventListener("load", function(evt) {
        bgB64 = evt.target.result
        const image = new Image();
        image.src = bgB64;
        let style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = '.cssClass { background-image: url(' + bgB64 + '); background-size: cover; resize: both;}';
        console.log(style)
        document.getElementsByTagName('head')[0].appendChild(style);
        $("#preview-wrapper").addClass("cssclass")
        image.onload = function() {
            bgAspectRatio = image.width / image.height
        }
    });
    fr3.readAsDataURL(this.files[0]);
}

//Accent colour and light/dark mode detection
document.getElementById('inp').onchange = function (evt) {
    var tgt = evt.target,
        files = tgt.files;

    // FileReader support
    if (FileReader && files && files.length) {
        var fr2 = new FileReader();
        fr2.onload = function () {
            var img = document.getElementById('outImage');

            img.src = fr2.result;
            var context = document.getElementById('canvas').getContext('2d');

            img.addEventListener('load', function() {
                canvas.width = 400;
                canvas.height = canvas.width * img.height / img.width;
                context.drawImage(img, 0, 0, canvas.width, canvas.height);

                var pixels = [];

                for (var x = 0; x < canvas.width; x++) {
                    for (var y = 0; y < canvas.height; y++) {
                        var pixel = context.getImageData(x, y, 1, 1).data;
                        pixels.push( pixel );
                    }
                }

                function getMostVaried(bucket, splitBy) {
                    var red = [256,0];
                    var green = [256,0];
                    var blue = [256,0];

                    $.each(bucket, function(i, pixel) {
                        if ( pixel[0] < red[0] ) { red[0] = pixel[0]; }
                        if ( pixel[0] > red[1] ) { red[1] = pixel[0]; }
                        if ( pixel[1] < green[0] ) { green[0] = pixel[1]; }
                        if ( pixel[1] > green[1] ) { green[1] = pixel[1]; }
                        if ( pixel[2] < blue[0] ) { blue[0] = pixel[2]; }
                        if ( pixel[2] > blue[1] ) { blue[1] = pixel[2]; }
                    });


                    if (typeof splitBy !== "undefined") {
                        return splitBy;
                    }

                    var max = red;
                    var orderBy = 0;

                    if ( blue[1] - blue[0] > max[1] - max[0] ) {
                        max = blue;
                        orderBy = 1;
                    }

                    if ( green[1] - green[0] > max[1] - max[0] ) {
                        max = green;
                        orderBy = 2;
                    }

                    return orderBy;
                }

                function sortBucket(bucket, splitBy) {
                    const axis = getMostVaried(bucket, splitBy);
                    return bucket.sort(function(a, b) {
                        if (a[axis] < b[axis]) { return -1 }
                        if (a[axis] > b[axis]) { return 1 }
                        return 0;
                    });
                }

                function getAveragePixel(pixels) {
                    let average = [0,0,0];

                    $.each(pixels, function(i, pixel) {
                        average[0] += pixel[0];
                        average[1] += pixel[1];
                        average[2] += pixel[2];
                    });

                    average[0] /= pixels.length;
                    average[1] /= pixels.length;
                    average[2] /= pixels.length;

                    return [Math.round(average[0]), Math.round(average[1]), Math.round(average[2])];
                }

                function split(buckets, splitBy) {
                    if ( iterations > 0 ) {
                        var newBuckets = [];
                        $.each(buckets, function(i, bucket) {
                            var mid = Math.round(bucket.length / 2);
                            bucket = sortBucket(bucket, splitBy);
                            newBuckets.push( bucket.slice(0,mid) );
                            newBuckets.push( bucket.slice(mid) );
                        });
                        iterations--;
                        return split(newBuckets, splitBy);
                    } else {
                        return buckets;
                    }
                }

                let iterations = 6;
                let bucket = [pixels].slice(0);
                iterations = 4;
                bucket = split( bucket );
                outputSwatches(getSwatches(bucket));

                function getSwatches( buckets ) {
                    var swatches = [];
                    $.each(buckets, function(i, bucket) {
                        swatches.push(getAveragePixel(bucket))
                    });
                    return swatches;
                }

                function outputSwatches(swatches) {
                    console.log(swatches)
                    const isSingleColour = [...new Set(swatches.flat(1))].length > 3

                    const lightOnly = swatches.map(element => rgbToHsl(element[0], element[1], element[2]).l)
                    const avgLight = (lightOnly.reduce((a, b) => a + b, 0) / lightOnly.length) || 0;
                    $("#darkMode").prop("checked", isSingleColour ? avgLight < 0.5 : avgLight > 0.5)
                    updateDarkMode()
                    let accentColour = swatches.sort((a,b) => rgbToHsl(b[0], b[1], b[2]).s - rgbToHsl(a[0], a[1], a[2]).s)[0]
                    $("#accent").val(rgbToHex(accentColour[0], accentColour[1], accentColour[2]))
                    updateAccent()
                }
            });
        }
        fr2.readAsDataURL(files[0]);
    }
}

$("#inp").on("change", readFile);
$("#bgUpload").on("change", readBGFile);