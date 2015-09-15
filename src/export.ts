declare var exports: any;
declare var module: any;
declare var angular: any;

class Export {
  static factory(name, factory) {
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports[name] = factory;
    } else if (typeof angular === 'function') {
      angular.module('4screens.util.' + name, []).const(name, factory);
    } else {
      if (!window['4screens']) {
        window['4screens'] = {};
      }

      if (!window['4screens'].util) {
        window['4screens'].util = {};
      }

      window['4screens'].util[name] = factory;
    }
  }
}
