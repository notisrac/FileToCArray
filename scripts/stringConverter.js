var stringConverter = {
    convertByte: function (oneByte, bytesPerPixel, conversionType) {
        // console.log(oneByte);
        var stringByte = '???';
        switch (conversionType) {
            case 'HEX0':
                stringByte = '0x' + oneByte.toString(16).padStart(bytesPerPixel * 2, '0');
                break;
            case 'HEX_SLASH':
                stringByte = '\\x' + oneByte.toString(16).padStart(bytesPerPixel * 2, '0');
                break;
            case 'DEC':
                stringByte = oneByte;
                break;
            case 'BIN':
                stringByte = 'B' + oneByte.toString(2).padStart(bytesPerPixel * 8, '0');
                break;
            default:
        }

        return stringByte;
    },

    convert: function (dataLength, bytesPerPixel, conversionType, multiLine, colNumber, data) {
        var resultString = '';
        for (var i = 0; i < dataLength; i++) {
            var stringByte = '';
            // need to use bigint, so we can use 32bit integers (4byte per pixel)
            let combinedByte = BigInt("0b00000000000000000000000000000000");
            for (let j = 0; j < bytesPerPixel; j++) {
                let pixelByte = BigInt(data[(i * bytesPerPixel) + j]);
                if (j != 0) {
                    combinedByte = combinedByte << BigInt(8);
                }
                combinedByte = combinedByte | pixelByte;
            }
            stringByte = this.convertByte(combinedByte, bytesPerPixel, conversionType) + ', ';
            if (multiLine && ((i + 1) % colNumber == 0)) {
                stringByte += '\r\n  ';
            }

            resultString += stringByte;
        }
        resultString = resultString.substr(0, resultString.lastIndexOf(',')).trim();

        // add the array definition
        // resultString = '// array size is ' + dataLength + '\r\nconst uint8_t data[] = {\r\n  ' + resultString + '\r\n};';

        return resultString;
    }

}