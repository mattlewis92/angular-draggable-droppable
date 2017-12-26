# angular 5.0+ drag and drop
[![Build Status](https://travis-ci.org/mattlewis92/angular-draggable-droppable.svg?branch=master)](https://travis-ci.org/mattlewis92/angular-draggable-droppable)
[![codecov](https://codecov.io/gh/mattlewis92/angular-draggable-droppable/branch/master/graph/badge.svg)](https://codecov.io/gh/mattlewis92/angular-draggable-droppable)
[![npm version](https://badge.fury.io/js/angular-draggable-droppable.svg)](http://badge.fury.io/js/angular-draggable-droppable)
[![devDependency Status](https://david-dm.org/mattlewis92/angular-draggable-droppable/dev-status.svg)](https://david-dm.org/mattlewis92/angular-draggable-droppable#info=devDependencies)
[![GitHub issues](https://img.shields.io/github/issues/mattlewis92/angular-draggable-droppable.svg)](https://github.com/mattlewis92/angular-draggable-droppable/issues)
[![GitHub stars](https://img.shields.io/github/stars/mattlewis92/angular-draggable-droppable.svg)](https://github.com/mattlewis92/angular-draggable-droppable/stargazers)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/mattlewis92/angular-draggable-droppable/master/LICENSE)

## Demo
https://mattlewis92.github.io/angular-draggable-droppable/demo/

## Table of contents

- [About](#about)
- [Installation](#installation)
- [Documentation](#documentation)
- [Development](#development)
- [License](#licence)

## About

Observable powered drag and drop for angular 5.0+

## Installation

Install through npm:
```
npm install --save angular-draggable-droppable
```

Then use it in your app like so:

```typescript
import { Component, NgModule } from '@angular/core';
import { DragAndDropModule } from 'angular-draggable-droppable';

@NgModule({
  declarations: [DemoApp],
  imports: [DragAndDropModule.forRoot()],
  bootstrap: [DemoApp]
})
class DemoModule {}

@Component({
  selector: 'demo-app',
  template: `
    <div mwlDraggable (dragEnd)="dragEnd($event)">Drag me!</div>
    <div
      mwlDroppable
      (drop)="this.droppedData = $event.dropData">
      <span [hidden]="droppedData">Drop here</span>
      <span [hidden]="!droppedData">Item dropped here with data: "{{ droppedData }}"!</span>
    </div>
  `
})
class DemoApp {

  droppedData: string;

  dragEnd(event) {
    console.log('Element was dragged', event);
  }

}
```

You may also find it useful to view the [demo source](https://github.com/mattlewis92/angular-draggable-droppable/blob/master/demo/demo.component.ts).

## Documentation
All documentation is auto-generated from the source and can be viewed here:
https://mattlewis92.github.io/angular-draggable-droppable/docs/

## Development

### Prepare your environment
* Install [Node.js](http://nodejs.org/) and NPM (should come with)
* Install local dev dependencies: `npm install` while current directory is this repo

### Development server
Run `npm start` to start a development server on port 8000 with auto reload + tests.

### Testing
Run `npm test` to run tests once or `npm run test:watch` to continually run tests.

### Release
```bash
npm run release
```

## License

MIT
