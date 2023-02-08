var stringConverter = {
    convertByte: function (oneByte, bytesPerPixel, conversionType, endianness) {
        // console.log(oneByte);
        var stringByte = '???';

        if (conversionType == 'HEX0' || conversionType == 'HEX_SLASH') {
            stringByte = oneByte.toString(16).padStart(bytesPerPixel * 2, '0');
            if (endianness == 'be') {
                stringByte = this.changeEndianness(stringByte);
            }
            stringByte = ((conversionType == 'HEX0') ? '0x' : '\\x') + stringByte;
        } else if (conversionType == 'DEC') {
            stringByte = oneByte;
        } else if (conversionType == 'BIN') {
            stringByte = 'B' + oneByte.toString(2).padStart(bytesPerPixel * 8, '0');
        } else {
            console.error('Unknown conversion type');
        }

        return stringByte;
    },

    convert: function (dataLength, bytesPerPixel, conversionType, multiLine, endianness, colNumber, data) {
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
            stringByte = this.convertByte(combinedByte, bytesPerPixel, conversionType, endianness) + ', ';
            if (multiLine && ((i + 1) % colNumber == 0)) {
                stringByte += '\r\n  ';
            }

            resultString += stringByte;
        }
        resultString = resultString.substr(0, resultString.lastIndexOf(',')).trim();

        // add the array definition
        // resultString = '// array size is ' + dataLength + '\r\nconst uint8_t data[] = {\r\n  ' + resultString + '\r\n};';

        return resultString;
    },

    changeEndianness: function (val) {
        const result = [];
        let len = val.length - 2;
        while (len >= 0) {
          result.push(val.substr(len, 2));
          len -= 2;
        }
        return result.join('');
    }

}