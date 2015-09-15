class Test {
  static message(data: string): void {
    console.log(data);
  }
}

Export.factory('test', Test);
