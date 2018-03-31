var imageConverter = {
    /**
     * Converts a pixel from 24bit (RGBA) to the specified format.
     * It also returns the modified pixels in 24bit format, so it can be displayed again
     */
    convertFromPixel: function (pixelData, mode) {
        // the converted pixel values
        var retData = new Array();
        var r = pixelData[0];
        var g = pixelData[1];
        var b = pixelData[2];
        var a = pixelData[3];
        var newR = 0;
        var newG = 0;
        var newB = 0;
        // the converted pixel in 24bit format (rgba)
        var newPixelData = new Array(4);
        switch (mode) {
            case '32':
                retData = [r, g, b, a];
                newPixelData = [r, g, b, a];
                break;
            case '24':
                retData = [r, g, b];
                newPixelData = [r, g, b, 255];
                break;
            case '16':
                // 1 2 3 4 5 6 7 8|1 2 3 4 5 6 7 8
                // R R R R R|G G G G G G|B B B B B
                // 1 2 3 4 5|1 2 3 4 5 6|1 2 3 4 5
                // 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 1
                // 0000100000100001
                // R, B = 32 values
                // G = 64 values
                newR = (r * 32 / 256) | 0; // Math.floor()
                newG = (g * 64 / 256) | 0;
                newB = (b * 32 / 256) | 0;
                var b16Pixel = newR * 2048 + newG * 32 + newB;
                retData = [b16Pixel >> 8, b16Pixel & 255]; // RRRRRGGG|GGGBBBBB
                newPixelData = [newR * 256 / 32, newG * 256 / 64, newB * 256 / 32, 255]; // scale the values back to the 0-255 range
                break;
            case '15':
                newR = (r * 32 / 256) | 0; // Math.floor()
                newG = (g * 32 / 256) | 0;
                newB = (b * 32 / 256) | 0;
                var newA = (a > 0) ? 1 : 0;
                var b15Pixel = newR * 2048 + newG * 64 + newB * 2 + newA;
                retData = [b15Pixel >> 8, b15Pixel & 255]; // RRRRRGGG|GGBBBBBA
                newPixelData = [newR * 256 / 32, newG * 256 / 32, newB * 256 / 32, (newA == 1) ? 255 : 0]; // scale the values back to the 0-255 range
                break;
            case '8':
                // 1 2 3 4 5 6 7 8
                // R R R|G G G|B B
                // 1 2 3|1 2 3|1 2
                // 0 0 1 0 0 1 0 1
                // R, G = 8 values
                // B = 4 values
                //retData = [Math.floor((r * 6 / 256) * 36 + (g * 6 / 256) * 6 + (b * 6 / 256))]; // http://stackoverflow.com/a/12808927
                //newR = (r * 6 / 256);
                //newG = (g * 6 / 256);
                //newB = (b * 6 / 256);
                //retData = [Math.floor(newR * 36 + newG * 6 + newB)];
                newR = (r * 8 / 256) | 0;
                newG = (g * 8 / 256) | 0;
                newB = (b * 4 / 256) | 0;
                retData = [newR * 32 + newG * 4 + newB]; // RRRGGGBB
                newPixelData = [newR * 256 / 8, newG * 256 / 8, newB * 256 / 4, 255]; // scale the values back to the 0-255 range
                break;
            case '8G':
                // http://www.ajaxblender.com/howto-convert-image-to-grayscale-using-javascript.html
                newR = ((r + g + b) / 3) | 0;
                retData = [newR];
                newPixelData = [newR, newR, newR, 255];
                break;
            case '1':
                var b1Pixel = ((r * 0.3 + g * 0.59 + b * 0.11) > 127) ? 1 : 0; // http://stackoverflow.com/a/18707438
                retData = [b1Pixel];
                newPixelData = [b1Pixel * 255, b1Pixel * 255, b1Pixel * 255, 255];
                break;
            default:
        }

        return { convertedPixel: retData, newPixel: newPixelData };
    },

    convert: function (imageWidth, imageHeight, bytePerPixel, paletteMod, origPixels) {
        // the downsampled pixels
        var moddedPixels = new Uint8Array(imageWidth * imageHeight * bytePerPixel); // typed arrays are way faster, than the genric Array
        // the downsampled pixels converted back to 24bit for displaying
        var newPixels = new Uint8ClampedArray(imageWidth * imageHeight * 4);
        // single pixel from the original set
        var pixelData = new Uint8Array(4);
        // loop through all the pixels, and modify them one by one
        for (var i = 0; i < (origPixels.byteLength/*image.height * image.width * 4*/); i += 4) {
            // the current pixel
            arrayUtils.subArray(origPixels, pixelData, i, i + 4);
            // modify the current pixel
            var moddedPixelData = this.convertFromPixel(pixelData, paletteMod);
            // store the new pixel
            arrayUtils.concatArray(moddedPixelData.newPixel, newPixels, i);
            // store the modified pixel
            if (paletteMod == '1') { // this one is tricky: every 8 pixels make up a byte
                var itemNo = Math.floor(i / 4 / 8);
                moddedPixels[itemNo] = (moddedPixels[itemNo] << 1) | moddedPixelData.convertedPixel[0];
            }
            else { // the convertFromPixel returns an array
                arrayUtils.concatArray(moddedPixelData.convertedPixel, moddedPixels, i * bytePerPixel);
            }
        }

        return { moddedPixels: moddedPixels, newPixels: newPixels };

    }
};
