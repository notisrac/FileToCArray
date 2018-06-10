var stringConverter = {
    convertByte: function (oneByte, conversionType) {
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
    },

    convert: function (dataLength, conversionType, multiLine, colNumber, data) {
        var resultString = '';
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
            stringByte = this.convertByte(data[i], conversionType) + ', ';
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