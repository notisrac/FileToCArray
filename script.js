        /// <reference path="https://code.jquery.com/jquery-2.1.4.js" />
        var imgImageHolder = new Image();
        var binBinaryFileHolder;

        /**
         * Handles when a file is selected by the user.
         * Displays the file info.
         */
        function handleFileSelected(e) {
            init();
            //console.log(e.target.files);
            var singleFile = e.target.files[0];
            var url = URL.createObjectURL(singleFile);

            imgImageHolder = null;
            binBinaryFileHolder = null;

            // display the file info
            $('#fiName').text(singleFile.name);
            $('#fiSize').text(singleFile.size + ' byte(s)');
            $('#fiType').text(singleFile.type || (singleFile.name.substr(singleFile.name.lastIndexOf('.'))));
            $('#fiLastModifiedDate').text(singleFile.lastModifiedDate);
            // show the conversion options fieldset
            $('#fsConversionOptions').show();
            $('#btnConvert').show();

            if (isImage(singleFile.type)) {
                console.log('file is an image');
                // if this is an image, show the apropriate stuff
                $('.fileIsImage').show();
                // along with the preview image
                imgImageHolder = new Image();
                imgImageHolder.src = url;
                imgImageHolder.onload = function () {
                    //URL.revokeObjectURL(this.src);
                    var imgPreview = imgImageHolder.cloneNode(true);
                    imgPreview.id = 'imgPreview';
                    imgPreview.alt = 'Preview of ' + singleFile.name;
                    $('#imgPreview').remove();
                    $('#divPreview').append(imgPreview);
                    $('#fiSize').text($('#fiSize').text() + ' (' + imgImageHolder.width + 'x' + imgImageHolder.height + 'px)');
                }
            }
            else {
                console.log('file is binary');
            }
            // load the file as binary too
            var reader = new FileReader();
            reader.onload = function (e) {
                binBinaryFileHolder = e.target.result;
            }
            reader.readAsArrayBuffer(singleFile);
        }

        /**
         * Decides based on the mime type whether the current file is an image or not
         */
        function isImage(mimeType) {
            var imageType = /^image\//;
            return imageType.test(mimeType);
        }

        function convert() {
            $('#divResult').empty();
            $('#fsResult').show();
            $('#txtResult').val('');
            var forceBinary = $('#cbForceBinary').is(':checked');

            // TODO display a loading icon

            var colNum = 16;
            var byteArray = new Array();
            if (imgImageHolder && !forceBinary) {
                // TODO put the prepareImage into a worker thread https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers
                var preparedImageData = prepareImage(imgImageHolder);
                byteArray = preparedImageData.moddedPixels;
                // display the converted image
                // create the canvas for it
                var canvas = $('<canvas />')[0];
                canvas.width = imgImageHolder.width;
                canvas.height = imgImageHolder.height;
                // get the context from the canvas
                var context = canvas.getContext('2d');
                //console.log('' + imgImageHolder.width + 'x' + imgImageHolder.height);
                // create a new imagedata and put it on the context
                var imgData = new ImageData(preparedImageData.newPixels, imgImageHolder.width, imgImageHolder.height);
                context.putImageData(imgData, 0, 0);
                // create a new image tag
                var newImage = new Image();
                newImage.src = canvas.toDataURL();
                // add it to the result div
                $('#divResult').append(newImage);
                colNum = imgImageHolder.width;
            }
            else if (binBinaryFileHolder) {
                byteArray = prepareBinary(binBinaryFileHolder);
            }
            var stringData = convertToString(byteArray, colNum);
            console.log('Result: ' + stringData);
            // display the string array
            $('#txtResult').val(stringData);
            $('#txtResult').prop('scrollTop', 0);
            // TODO remove the loading icon
        }

        /**
         * Converts a pixel from 24bit (RGBA) to the specified format.
         * It also returns the modified pixels in 24bit format, so it can be displayed again
         */
        function convertFromPixel(pixelData, mode) {
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
        }

        /**
         * Puts a part of the source array into the destination array.
         * This is a much faster replacement for Array.slice and UIntXArray.subArray
         * Note: no parameter or error checking!
         * It does not return anything, because in javascript every object is passed by reference. So the modifications made in the function are visible on the outside.
         */
        function subArray(sourceArray, destinationArray, startPos, endPos) {
            for (var i = startPos; i < endPos; i++) {
                destinationArray[i - startPos] = sourceArray[i];
            }
        }

        /**
         * Puts the source array at the end of the destination array.
         * This is a much faster replacement for Array.concat and UIntXArray.set
         * Note: no parameter or error checking!
         * It does not return anything, because in javascript every object is passed by reference. So the modifications made in the function are visible on the outside.
         */
        function concatArray(sourceArray, destinationArray, startPos) {
            for (var i = 0; i < (sourceArray.length || sourceArray.byteLength) ; i++) {
                destinationArray[startPos + i] = sourceArray[i];
            }
        }

        /**
         * Converts the image to the specified format, and returns the modified pixels in the new format along with them in 24bit format
         */
        function prepareImage(image) {
            var dtStart = new Date();

            console.log('image size: ' + image.width + 'x' + image.height);
            var paletteMod = $('#cbPaletteMod').val();
            var bytePerPixel = Math.ceil(parseInt(paletteMod) / 8);
            console.log('paletteMod: ' + paletteMod + ' (' + bytePerPixel + 'bytes/pixel)');
            // the downsampled pixels
            var moddedPixels = new Uint8Array(image.width * image.height * bytePerPixel); // typed arrays are way faster, than the genric Array
            // the downsampled pixels converted back to 24bit for displaying
            var newPixels = new Uint8ClampedArray(image.width * image.height * 4);

            // create a canvas for the image
            var canvas = $('<canvas />')[0];
            canvas.width = image.width;
            canvas.height = image.height;
            var context = canvas.getContext('2d');
            // load the image into the context
            context.drawImage(image, 0, 0, image.width, image.height);
            // get the pixels
            var origPixels = context.getImageData(0, 0, image.width, image.height).data; // Uint8ClampedArray

            //var isSingleArray = $('[type="radio"][name="cbArrayType"]:checked').val() == 'SINGLE';

            // single pixel from the original set
            var pixelData = new Uint8Array(4);
            // loop through all the pixels, and modify them one by one
            for (var i = 0; i < (origPixels.byteLength/*image.height * image.width * 4*/) ; i += 4) {
                // the current pixel
                subArray(origPixels, pixelData, i, i + 4);
                // modify the current pixel
                var moddedPixelData = convertFromPixel(pixelData, paletteMod);
                // store the new pixel
                concatArray(moddedPixelData.newPixel, newPixels, i);
                // store the modified pixel
                if (paletteMod == '1') { // this one is tricky: every 8 pixels make up a byte
                    var itemNo = Math.floor(i / 4 / 8);
                    moddedPixels[itemNo] = (moddedPixels[itemNo] << 1) | moddedPixelData.convertedPixel[0];
                }
                else { // the convertFromPixel returns an array
                    concatArray(moddedPixelData.convertedPixel, moddedPixels, i * bytePerPixel);
                }
            }

            console.log('duration: ' + ((new Date()) - dtStart) + 'ms');
            console.log('moddedPixels size: ' + moddedPixels.byteLength + 'bytes')
            console.log('newPixels size: ' + newPixels.byteLength + 'bytes')
            return { moddedPixels: moddedPixels, newPixels: newPixels };
        }

        function prepareBinary(data) {
            var ia = new Uint8Array(data);

            return ia;
        }

        function convertByte(oneByte, conversionType) {
            var stringByte = '???';
            switch (conversionType) {
                case 'HEX0':
                    stringByte = '0x' + ('00' + oneByte.toString(16)).slice(-2);
                    break;
                case 'HEX_SLASH':
                    stringByte = '\\x' + ('00' + oneByte.toString(16)).slice(-2);
                    break;
                case 'DEC':
                    stringByte = oneByte;
                    break;
                case 'BIN':
                    stringByte = 'B' + ('00000000' + (oneByte >>> 0).toString(2)).slice(-8)
                    break;
                default:
            }

            return stringByte;
        }

        function isArray(data) {
            return (Object.prototype.toString.call(data).indexOf('Array') != -1);
        }

        function convertToString(data, colNum) {
            console.log('Converting data to string');
            var resultString = '';
            var conversionType = $('#selFormat').val();
            var paletteMod = $('#cbPaletteMod').val();
            var dataLength = (paletteMod == '1') ? Math.ceil(data.byteLength / 8) : data.byteLength;
            console.log('data.byteLength: ' + data.byteLength);
            console.log('dataLength: ' + dataLength);
            var colNumber = (paletteMod == '1') ? Math.ceil(colNum / 8) : colNum;
            console.log('colNum: ' + colNum);
            console.log('colNumber: ' + colNumber);
            var multiLine = $('#cbMultiLine').is(':checked');
            for (var i = 0; i < dataLength; i++) {
                var stringByte = '';
                //if (isArray(data[i])) {
                //    for (var j = 0; j < data[i].length; j++) {
                //        stringByte += convertByte(data[i][j], conversionType) + ', ';
                //    }
                //    if (multiLine) {
                //        stringByte += '\r\n';
                //    }
                //}
                //else {
                //    stringByte = convertByte(data[i], conversionType) + ', ';
                //}
                stringByte = convertByte(data[i], conversionType) + ', ';
                if (multiLine && ((i + 1) % colNumber == 0)) {
                    stringByte += '\r\n';
                }


                resultString += stringByte;
            }

            return resultString.substr(0, resultString.lastIndexOf(',')).trim();
        }

        function copyToClipboard() {
            var txtResult = document.querySelector('#txtResult');
            txtResult.select();

            try {
                var execResult = document.execCommand('copy');
                var msg = execResult ? 'successful' : 'unsuccessful';
                console.log('Copying text command was ' + msg);
            } catch (err) {
                console.log('Oops, unable to copy');
            }
        }

        function saveImage() {
            // TODO do save image
        }

        function init() {
            $('.fileIsImage').hide();
            $('#fsConversionOptions').hide();
            $('#btnConvert').hide();
            $('#fsResult').hide();
            $('#imgPreview').remove();
            $('#fiName').text('');
            $('#fiSize').text('');
            $('#fiType').text('');
            $('#fiLastModifiedDate').text('');
            imgImageHolder = new Image();
            binBinaryFileHolder = null;
        }

        $('document').ready(function () {
            // init
            $('#inFileInput').on('change', handleFileSelected);
            $('#cbForceBinary').on('change', function (e) {
                $('.imageConversionOption').each(function () {
                    $(this).prop('disabled', $('#cbForceBinary').is(':checked'));
                })
                //$('#divForceBinary').prop('disabled', false);
            });
            $('#btnConvert').on('click', convert);
            $('#btnCopyToClipboard').on('click', copyToClipboard);
            $('#btnSaveImage').on('click', saveImage);
            init();
        });
