var arrayUtils = {
    /**
     * Puts a part of the source array into the destination array.
     * This is a much faster replacement for Array.slice and UIntXArray.subArray
     * Note: no parameter or error checking!
     * It does not return anything, because in javascript every object is passed by reference. So the modifications made in the function are visible on the outside.
     */
    subArray : function (sourceArray, destinationArray, startPos, endPos) {
        for (var i = startPos; i < endPos; i++) {
            destinationArray[i - startPos] = sourceArray[i];
        }
    },

    /**
     * Puts the source array at the end of the destination array.
     * This is a much faster replacement for Array.concat and UIntXArray.set
     * Note: no parameter or error checking!
     * It does not return anything, because in javascript every object is passed by reference. So the modifications made in the function are visible on the outside.
     */
    concatArray : function (sourceArray, destinationArray, startPos) {
        for (var i = 0; i < (sourceArray.length || sourceArray.byteLength); i++) {
            destinationArray[startPos + i] = sourceArray[i];
        }
    },

    /**
     * Returns true if the object passed in as the parameter is an array
     * @param {*} data The object to test
     */
    isArray : function (data) {
        return (Object.prototype.toString.call(data).indexOf('Array') != -1);
    }
    
};
