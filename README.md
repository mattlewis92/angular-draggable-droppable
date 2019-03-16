# angular 6.0+ drag and drop

[![Build Status](https://travis-ci.org/mattlewis92/angular-draggable-droppable.svg?branch=master)](https://travis-ci.org/mattlewis92/angular-draggable-droppable)
[![codecov](https://codecov.io/gh/mattlewis92/angular-draggable-droppable/branch/master/graph/badge.svg)](https://codecov.io/gh/mattlewis92/angular-draggable-droppable)
[![npm version](https://badge.fury.io/js/angular-draggable-droppable.svg)](http://badge.fury.io/js/angular-draggable-droppable)
[![Twitter Follow](https://img.shields.io/twitter/follow/mattlewis92_.svg)](https://twitter.com/mattlewis92_)

<a href="https://www.patreon.com/mattlewis92">
	<img src="https://c5.patreon.com/external/logo/become_a_patron_button@2x.png" width="160">
</a>

## Demo

https://mattlewis92.github.io/angular-draggable-droppable/

## Table of contents

- [About](#about)
- [Installation](#installation)
- [Documentation](#documentation)
- [Development](#development)
- [License](#licence)

## About

Observable powered drag and drop for angular 6.0+

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
  imports: [DragAndDropModule],
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

You may also find it useful to view the [demo source](https://github.com/mattlewis92/angular-draggable-droppable/tree/master/src/demo).

## Documentation

All documentation is auto-generated from the source and can be viewed here:
https://mattlewis92.github.io/angular-draggable-droppable/docs/

## Alternatives

I wrote this library because I needed drag and drop whilst snapping to a grid. If you don't need this feature then I recommend checking out one of these other awesome drag and drop libraries:

- [Angular CDK drag and drop](https://material.angular.io/cdk/drag-drop/overview)
- [angular-skyhook](https://github.com/cormacrelf/angular-skyhook)
- [ng-drag-drop](https://github.com/ObaidUrRehman/ng-drag-drop)

## Development

### Prepare your environment

- Install [Node.js](http://nodejs.org/) and NPM (should come with)
- Install local dev dependencies: `npm install` while current directory is this repo

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
