(function() {/*!
 * 4screens-util v0.1.1
 * (c) 2015 Nopattern sp. z o.o.
 * License: proprietary
 */

var Export = (function () {
    function Export() {
    }
    Export.factory = function (name, factory) {
        if (typeof exports === 'object' && typeof module !== 'undefined') {
            module.exports[name] = factory;
        }
        else if (typeof angular === 'object') {
            angular.module('4screens.util.' + name, []).constant(name, factory);
        }
        else {
            if (!window['4screens']) {
                window['4screens'] = {};
            }
            if (!window['4screens'].util) {
                window['4screens'].util = {};
            }
            window['4screens'].util[name] = factory;
        }
    };
    return Export;
})();

var Cloudinary;
(function (Cloudinary) {
    var config;
    /**
     * Changes the account configuration of the module.
     *
     * @param {Config.ApiConfig.cloudinary} options Account data for accessing the CLoudinary service.
     */
    function setConfig(options) {
        if (!options || [options.accountName, options.uploadFolder, options.domain].indexOf(undefined) > -1) {
            throw new Error('Missing properties in the Cloudinary API config.');
        }
        // This is a hack. Module has to have a reference to the ApiOptions.cloudinary object, since it is
        // overwritten by the config retrieved later.
        config = options;
    }
    Cloudinary.setConfig = setConfig;
    function prepareBackgroundImageUrl(filepath, width, height, blur, position) {
        if (!filepath) {
            return '';
        }
        var src = config.domain + '/' + config.accountName + '/image';
        if (filepath.indexOf('http') !== -1) {
            src += '/fetch';
        }
        else {
            src += '/upload';
        }
        var manipulation;
        var blured = blur ? blur * 100 : 0;
        manipulation = [];
        manipulation.push('w_' + width);
        manipulation.push('f_auto');
        manipulation.push('h_' + height);
        switch (position) {
            case 'fill':
                manipulation.push('c_fill');
                break;
            case 'fit':
                manipulation.push('c_fit');
                break;
            case 'centered':
                manipulation.push('c_limit');
                break;
            case 'tiled':
                manipulation.push('c_limit');
                break;
        }
        manipulation.push('dpr_1.0');
        manipulation.push('e_blur:' + blured);
        src += '/' + manipulation.join(',');
        if (filepath.indexOf('http') === -1) {
            src += '/' + config.uploadFolder;
        }
        return src + '/' + filepath;
    }
    Cloudinary.prepareBackgroundImageUrl = prepareBackgroundImageUrl;
    function prepareImageUrl(filepath, width, imageData) {
        if (!filepath) {
            return '';
        }
        var src = config.domain + '/' + config.accountName + '/image';
        if (filepath.indexOf('http') !== -1) {
            src += '/fetch';
        }
        else {
            src += '/upload';
        }
        var manipulation;
        // calculate image height (in percent)
        var height = Math.round(width * imageData.containerHeight);
        // calculate image size (in pixel)
        var imageWidth = Math.round(width * imageData.width / 100);
        var imageHeight = Math.round(width * imageData.height / 100);
        // calculate image shift (in pixel)
        var shiftLeft = Math.round(width * imageData.left / 100);
        var shiftTop = Math.round(height * imageData.top / 100);
        manipulation = [];
        manipulation.push('w_' + imageWidth);
        manipulation.push('f_auto');
        manipulation.push('q_82');
        manipulation.push('dpr_1.0');
        src += '/' + manipulation.join(',');
        // add image padding if exists
        manipulation = [];
        manipulation.push('w_' + padding(imageWidth, width, shiftLeft));
        manipulation.push('h_' + padding(imageHeight, height, shiftTop));
        manipulation.push('c_mpad');
        src += '/' + manipulation.join(',');
        // crop image to distributed size
        manipulation = [];
        manipulation.push('w_' + width);
        manipulation.push('h_' + height);
        manipulation.push('x_' + crop(imageWidth, width, shiftLeft));
        manipulation.push('y_' + crop(imageHeight, height, shiftTop));
        manipulation.push('c_crop');
        src += '/' + manipulation.join(',');
        if (filepath.indexOf('http') === -1) {
            src += '/' + config.uploadFolder;
        }
        return src + '/' + filepath;
    }
    Cloudinary.prepareImageUrl = prepareImageUrl;
    function preparePreviewImageUrl(filepath, width) {
        if (!filepath) {
            return '';
        }
        var src = config.domain + '/' + config.accountName + '/image';
        if (filepath.indexOf('http') !== -1) {
            src += '/fetch';
        }
        else {
            src += '/upload';
        }
        var manipulation;
        manipulation = [];
        manipulation.push('w_' + width);
        manipulation.push('f_auto');
        manipulation.push('q_82');
        manipulation.push('dpr_1.0');
        src += '/' + manipulation.join(',');
        if (filepath.indexOf('http') === -1) {
            src += '/' + config.uploadFolder;
        }
        return src + '/' + filepath;
    }
    Cloudinary.preparePreviewImageUrl = preparePreviewImageUrl;
    function padding(imageSize, outputSize, shift) {
        var shiftAfter = outputSize - shift - imageSize;
        if (shift <= 0 && shiftAfter <= 0) {
            return imageSize;
        }
        if (shift > shiftAfter) {
            return imageSize + 2 * shift;
        }
        else {
            return imageSize + 2 * shiftAfter;
        }
    }
    function crop(imageSize, outputSize, shift) {
        var shiftAfter = outputSize - shift - imageSize;
        // without padding
        if (0 > shift && 0 > shiftAfter) {
            return -shift;
        }
        // padding only before
        // padding both side (before bigger)
        if (shift >= shiftAfter) {
            return 0;
        }
        // padding only after
        // padding both side (after bigger)
        if (shiftAfter > shift) {
            return shiftAfter - shift;
        }
    }
})(Cloudinary || (Cloudinary = {}));
Export.factory('cloudinary', Cloudinary);

var Test = (function () {
    function Test() {
    }
    Test.message = function (data) {
        console.log(data);
    };
    return Test;
})();
Export.factory('test', Test);
})();
//# sourceMappingURL=util.js.map