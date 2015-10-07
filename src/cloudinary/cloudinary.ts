interface CloudinaryConfig {
  accountName: string;
  uploadFolder: string;
  domain: string;
}

module Cloudinary {
  let config: CloudinaryConfig;

  /**
   * Changes the account configuration of the module.
   *
   * @param {Config.ApiConfig.cloudinary} options Account data for accessing the CLoudinary service.
   */
  export function setConfig(options: CloudinaryConfig) {
    if (!options || [options.accountName, options.uploadFolder, options.domain].indexOf(undefined) > -1) {
      throw new Error('Missing properties in the Cloudinary API config.');
    }

    // This is a hack. Module has to have a reference to the ApiOptions.cloudinary object, since it is
    // overwritten by the config retrieved later.
    config = options;
  }

  export function prepareBackgroundImageUrl(filepath: string, width: number, height: number, blur: number, position: string) {
    if (!filepath) {
      return '';
    }

    var src = config.domain + '/' + config.accountName + '/image';

    if (filepath.indexOf('http') !== -1) {
      src += '/fetch';
    } else {
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

    return src + '/' + encodeURIComponent(filepath);
  }

  export function prepareImageUrl(filepath: string, width: number, imageData) {
    if (!filepath) {
      return '';
    }

    var src = config.domain + '/' + config.accountName + '/image';

    if (filepath.indexOf('http') !== -1) {
      src += '/fetch';
    } else {
      src += '/upload';
    }

    var manipulation;
    // calculate image height (in percent)
    if (!imageData.containerRatio) {
      var containerWidth = 540;
      if (width === imageData.containerHeight) {
        containerWidth = 300;
      }
      imageData.containerRatio = Math.round(imageData.containerHeight / containerWidth * 100) / 100;
    }
    var height = Math.round(width * imageData.containerRatio);
    // calculate image shift (in pixel)
    var shiftLeft = Math.round(width * imageData.left / 100);
    var shiftTop = Math.round(height * imageData.top / 100);
    // calculate image size (in pixel)
    var imageWidth = Math.round(width * imageData.width / 100);
    var imageHeight = Math.round(width * imageData.height  / 100);
    if (imageHeight !== imageHeight) { //imageHeight === NaN
      imageHeight = height - shiftTop;
    }

    manipulation = [];
    manipulation.push('w_' + imageWidth);
    manipulation.push('f_png');
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

    return src + '/' + encodeURIComponent(filepath);
  }

  export function preparePreviewImageUrl(filepath: string, width: number) {
    if (!filepath) {
        return '';
    }

    var src = config.domain + '/' + config.accountName + '/image';

    if (filepath.indexOf('http') !== -1) {
        src += '/fetch';
    } else {
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

    return src + '/' + encodeURIComponent(filepath);
  }

  function padding(imageSize: number, outputSize: number, shift: number) {
    var shiftAfter = outputSize - shift - imageSize;

    if (shift <= 0 && shiftAfter <= 0) {
      return imageSize;
    }

    if (shift > shiftAfter) {
      return imageSize + 2 * shift;
    } else {
      return imageSize + 2 * shiftAfter;
    }
  }

  function crop(imageSize: number, outputSize: number, shift: number) {
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
}

Export.factory('cloudinary', Cloudinary);
