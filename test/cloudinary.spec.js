'use strict';

/**
 * Module dependencies.
 */
var expect = require('chai').expect;
var cloudinary = require('../').cloudinary;

describe('[Cloudinary]', function() {

  it('should expose as object', function() {
    expect(cloudinary).to.be.a('object');
  });

  describe('methods', function() {

    it('should have setConfig method', function () {
      expect(cloudinary.setConfig).to.be.a('function');
    });

    it('should have prepareImageUrl method', function () {
      expect(cloudinary.prepareImageUrl).to.be.a('function');
    });

  });

  describe('prepareImageUrl', function() {
    describe('test with uploaded image', function() {
      var imageUrl;

      cloudinary.setConfig({
        accountName: 'mockAccount',
        uploadFolder: 'mockUpload',
        domain: 'mockDomain'
      });

      it('should support for incomplete data (backward compatibility)', function() {
        imageUrl = cloudinary.prepareImageUrl('image.png', 700, {
          containerHeight: 300,
          width: 120,
          left: -5,
          top: -10
        });

        expect(imageUrl).to.eq('mockDomain/mockAccount/image/upload/' +
          'w_840,f_png,q_82,dpr_1.0/' +
          'w_840,h_431,c_mpad/' +
          'w_700,h_392,x_35,y_39,c_crop/' +
          'mockUpload/image.png');
      });

      it('should have padding on left side', function() {
        imageUrl = cloudinary.prepareImageUrl('image.png', 700, {
          containerRatio: 0.625,
          width: 90,
          height: 120,
          left: 30,
          top: -10
        });

        expect(imageUrl).to.eq('mockDomain/mockAccount/image/upload/' +
          'w_630,f_png,q_82,dpr_1.0/' +
          'w_1050,h_840,c_mpad/' +
          'w_700,h_438,x_0,y_44,c_crop/' +
          'mockUpload/image.png');
      });

      it('should not have padding', function() {
        imageUrl = cloudinary.prepareImageUrl('image.png', 700, {
          containerRatio: 0.625,
          width: 120,
          height: 160,
          left: -5,
          top: -10
        });

        expect(imageUrl).to.eq('mockDomain/mockAccount/image/upload/' +
          'w_840,f_png,q_82,dpr_1.0/' +
          'w_840,h_1120,c_mpad/' +
          'w_700,h_438,x_35,y_44,c_crop/' +
          'mockUpload/image.png');
      });

      it('should have padding on right side', function() {
        imageUrl = cloudinary.prepareImageUrl('image.png', 700, {
          containerRatio: 0.625,
          width: 120,
          height: 160,
          left: -30,
          top: -5
        });

        expect(imageUrl).to.eq('mockDomain/mockAccount/image/upload/' +
          'w_840,f_png,q_82,dpr_1.0/' +
          'w_980,h_1120,c_mpad/' +
          'w_700,h_438,x_280,y_22,c_crop/' +
          'mockUpload/image.png');
      });

      it('should have padding on both side (right bigger)', function() {
        imageUrl = cloudinary.prepareImageUrl('image.png', 700, {
          containerRatio: 0.625,
          width: 70,
          height: 160,
          left: 10,
          top: -10
        });

        expect(imageUrl).to.eq('mockDomain/mockAccount/image/upload/' +
          'w_490,f_png,q_82,dpr_1.0/' +
          'w_770,h_1120,c_mpad/' +
          'w_700,h_438,x_70,y_44,c_crop/' +
          'mockUpload/image.png');
      });

      it('should have padding on both side (left bigger)', function() {
        imageUrl = cloudinary.prepareImageUrl('image.png', 700, {
          containerRatio: 0.625,
          width: 70,
          height: 160,
          left: 20,
          top: -10
        });

        expect(imageUrl).to.eq('mockDomain/mockAccount/image/upload/' +
          'w_490,f_png,q_82,dpr_1.0/' +
          'w_770,h_1120,c_mpad/' +
          'w_700,h_438,x_0,y_44,c_crop/' +
          'mockUpload/image.png');
      });

      it('should have padding on top', function() {
        imageUrl = cloudinary.prepareImageUrl('image.png', 700, {
          containerRatio: 0.625,
          width: 120,
          height: 90,
          left: -10,
          top: 30
        });

        expect(imageUrl).to.eq('mockDomain/mockAccount/image/upload/' +
          'w_840,f_png,q_82,dpr_1.0/' +
          'w_840,h_892,c_mpad/' +
          'w_700,h_438,x_70,y_0,c_crop/' +
          'mockUpload/image.png');
      });

      it('should have padding on bottom', function() {
        imageUrl = cloudinary.prepareImageUrl('image.png', 700, {
          containerRatio: 0.625,
          width: 160,
          height: 70,
          left: -5,
          top: -30
        });

        expect(imageUrl).to.eq('mockDomain/mockAccount/image/upload/' +
          'w_1120,f_png,q_82,dpr_1.0/' +
          'w_1120,h_648,c_mpad/' +
          'w_700,h_438,x_35,y_210,c_crop/' +
          'mockUpload/image.png');
      });

      it('should have padding on both side (top bigger)', function() {
        imageUrl = cloudinary.prepareImageUrl('image.png', 700, {
          containerRatio: 0.625,
          width: 160,
          height: 20,
          left: -10,
          top: 40
        });

        expect(imageUrl).to.eq('mockDomain/mockAccount/image/upload/' +
          'w_1120,f_png,q_82,dpr_1.0/' +
          'w_1120,h_490,c_mpad/' +
          'w_700,h_438,x_70,y_0,c_crop/' +
          'mockUpload/image.png');
      });

      it('should have padding on both side (bottom bigger)', function() {
        imageUrl = cloudinary.prepareImageUrl('image.png', 700, {
          containerRatio: 0.625,
          width: 160,
          height: 20,
          left: -10,
          top: 10
        });

        expect(imageUrl).to.eq('mockDomain/mockAccount/image/upload/' +
          'w_1120,f_png,q_82,dpr_1.0/' +
          'w_1120,h_648,c_mpad/' +
          'w_700,h_438,x_70,y_210,c_crop/' +
          'mockUpload/image.png');
      });
    });

    describe('test with outsource image', function() {
      var imageUrl;

      cloudinary.setConfig({
        accountName: 'mockAccount',
        uploadFolder: 'mockUpload',
        domain: 'mockDomain'
      });

      it('should support for incomplete data (backward compatibility)', function() {
        imageUrl = cloudinary.prepareImageUrl('http://placehold.it/700x700', 700, {
          containerHeight: 300,
          width: 120,
          left: -5,
          top: -10
        });

        expect(imageUrl).to.eq('mockDomain/mockAccount/image/fetch/' +
          'w_840,f_png,q_82,dpr_1.0/' +
          'w_840,h_431,c_mpad/' +
          'w_700,h_392,x_35,y_39,c_crop/' +
          'http%3A%2F%2Fplacehold.it%2F700x700');
      });

      it('should have padding on left side', function() {
        imageUrl = cloudinary.prepareImageUrl('http://placehold.it/700x700', 700, {
          containerRatio: 0.625,
          width: 90,
          height: 120,
          left: 30,
          top: -10
        });

        expect(imageUrl).to.eq('mockDomain/mockAccount/image/fetch/' +
          'w_630,f_png,q_82,dpr_1.0/' +
          'w_1050,h_840,c_mpad/' +
          'w_700,h_438,x_0,y_44,c_crop/' +
          'http%3A%2F%2Fplacehold.it%2F700x700');
      });

      it('should not have padding', function() {
        imageUrl = cloudinary.prepareImageUrl('http://placehold.it/700x700', 700, {
          containerRatio: 0.625,
          width: 120,
          height: 160,
          left: -5,
          top: -10
        });

        expect(imageUrl).to.eq('mockDomain/mockAccount/image/fetch/' +
          'w_840,f_png,q_82,dpr_1.0/' +
          'w_840,h_1120,c_mpad/' +
          'w_700,h_438,x_35,y_44,c_crop/' +
          'http%3A%2F%2Fplacehold.it%2F700x700');
      });

      it('should have padding on right side', function() {
        imageUrl = cloudinary.prepareImageUrl('http://placehold.it/700x700', 700, {
          containerRatio: 0.625,
          width: 120,
          height: 160,
          left: -30,
          top: -5
        });

        expect(imageUrl).to.eq('mockDomain/mockAccount/image/fetch/' +
          'w_840,f_png,q_82,dpr_1.0/' +
          'w_980,h_1120,c_mpad/' +
          'w_700,h_438,x_280,y_22,c_crop/' +
          'http%3A%2F%2Fplacehold.it%2F700x700');
      });

      it('should have padding on both side (right bigger)', function() {
        imageUrl = cloudinary.prepareImageUrl('http://placehold.it/700x700', 700, {
          containerRatio: 0.625,
          width: 70,
          height: 160,
          left: 10,
          top: -10
        });

        expect(imageUrl).to.eq('mockDomain/mockAccount/image/fetch/' +
          'w_490,f_png,q_82,dpr_1.0/' +
          'w_770,h_1120,c_mpad/' +
          'w_700,h_438,x_70,y_44,c_crop/' +
          'http%3A%2F%2Fplacehold.it%2F700x700');
      });

      it('should have padding on both side (left bigger)', function() {
        imageUrl = cloudinary.prepareImageUrl('http://placehold.it/700x700', 700, {
          containerRatio: 0.625,
          width: 70,
          height: 160,
          left: 20,
          top: -10
        });

        expect(imageUrl).to.eq('mockDomain/mockAccount/image/fetch/' +
          'w_490,f_png,q_82,dpr_1.0/' +
          'w_770,h_1120,c_mpad/' +
          'w_700,h_438,x_0,y_44,c_crop/' +
          'http%3A%2F%2Fplacehold.it%2F700x700');
      });

      it('should have padding on top', function() {
        imageUrl = cloudinary.prepareImageUrl('http://placehold.it/700x700', 700, {
          containerRatio: 0.625,
          width: 120,
          height: 90,
          left: -10,
          top: 30
        });

        expect(imageUrl).to.eq('mockDomain/mockAccount/image/fetch/' +
          'w_840,f_png,q_82,dpr_1.0/' +
          'w_840,h_892,c_mpad/' +
          'w_700,h_438,x_70,y_0,c_crop/' +
          'http%3A%2F%2Fplacehold.it%2F700x700');
      });

      it('should have padding on bottom', function() {
        imageUrl = cloudinary.prepareImageUrl('http://placehold.it/700x700', 700, {
          containerRatio: 0.625,
          width: 160,
          height: 70,
          left: -5,
          top: -30
        });

        expect(imageUrl).to.eq('mockDomain/mockAccount/image/fetch/' +
          'w_1120,f_png,q_82,dpr_1.0/' +
          'w_1120,h_648,c_mpad/' +
          'w_700,h_438,x_35,y_210,c_crop/' +
          'http%3A%2F%2Fplacehold.it%2F700x700');
      });

      it('should have padding on both side (top bigger)', function() {
        imageUrl = cloudinary.prepareImageUrl('http://placehold.it/700x700', 700, {
          containerRatio: 0.625,
          width: 160,
          height: 20,
          left: -10,
          top: 40
        });

        expect(imageUrl).to.eq('mockDomain/mockAccount/image/fetch/' +
          'w_1120,f_png,q_82,dpr_1.0/' +
          'w_1120,h_490,c_mpad/' +
          'w_700,h_438,x_70,y_0,c_crop/' +
          'http%3A%2F%2Fplacehold.it%2F700x700');
      });

      it('should have padding on both side (bottom bigger)', function() {
        imageUrl = cloudinary.prepareImageUrl('http://placehold.it/700x700', 700, {
          containerRatio: 0.625,
          width: 160,
          height: 20,
          left: -10,
          top: 10
        });

        expect(imageUrl).to.eq('mockDomain/mockAccount/image/fetch/' +
          'w_1120,f_png,q_82,dpr_1.0/' +
          'w_1120,h_648,c_mpad/' +
          'w_700,h_438,x_70,y_210,c_crop/' +
          'http%3A%2F%2Fplacehold.it%2F700x700');
      });
    });
  });

});
