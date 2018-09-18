# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="4.0.2"></a>
## [4.0.2](https://github.com/mattlewis92/angular-draggable-droppable/compare/v4.0.1...v4.0.2) (2018-09-18)


### Bug Fixes

* include readme and licence in npm ([cfff617](https://github.com/mattlewis92/angular-draggable-droppable/commit/cfff617))



<a name="4.0.1"></a>
## [4.0.1](https://github.com/mattlewis92/angular-draggable-droppable/compare/v4.0.0...v4.0.1) (2018-09-01)


### Bug Fixes

* allow draggable elements insider other draggable elements to be dragged ([700fef1](https://github.com/mattlewis92/angular-draggable-droppable/commit/700fef1)), closes [#61](https://github.com/mattlewis92/angular-draggable-droppable/issues/61)



<a name="4.0.0"></a>
# [4.0.0](https://github.com/mattlewis92/angular-draggable-droppable/compare/v3.0.1...v4.0.0) (2018-08-29)


### Bug Fixes

* account for the window being scrolled whilst dragging ([566bf78](https://github.com/mattlewis92/angular-draggable-droppable/commit/566bf78))
* allow dragging the element inside a scrollable container ([6e0a1a3](https://github.com/mattlewis92/angular-draggable-droppable/commit/6e0a1a3)), closes [#25](https://github.com/mattlewis92/angular-draggable-droppable/issues/25)
* always remove global styles when clicking draggable elements ([c428eed](https://github.com/mattlewis92/angular-draggable-droppable/commit/c428eed)), closes [#44](https://github.com/mattlewis92/angular-draggable-droppable/issues/44)
* append the ghost element to the body ([4f23661](https://github.com/mattlewis92/angular-draggable-droppable/commit/4f23661))
* bump up z-index of element being dragged ([9d0f754](https://github.com/mattlewis92/angular-draggable-droppable/commit/9d0f754))
* don't fire drop events when the droppable element is scrolled out of the view ([4c9224b](https://github.com/mattlewis92/angular-draggable-droppable/commit/4c9224b))
* don't highlight text when dragging elements ([67d3a5e](https://github.com/mattlewis92/angular-draggable-droppable/commit/67d3a5e)), closes [#28](https://github.com/mattlewis92/angular-draggable-droppable/issues/28)
* maintain old ghost element behaviour by default ([cf1bc61](https://github.com/mattlewis92/angular-draggable-droppable/commit/cf1bc61))
* preserve original element styles after dragging ([f36ed2d](https://github.com/mattlewis92/angular-draggable-droppable/commit/f36ed2d))
* remove automatic pointer-events:none on dragged element ([bfe9bb4](https://github.com/mattlewis92/angular-draggable-droppable/commit/bfe9bb4))
* remove margin on the ghost element ([06396e6](https://github.com/mattlewis92/angular-draggable-droppable/commit/06396e6))
* remove the drag helper provider from the public api ([48d4fe6](https://github.com/mattlewis92/angular-draggable-droppable/commit/48d4fe6))
* round snap grids so dragging from each side is even ([fa8434b](https://github.com/mattlewis92/angular-draggable-droppable/commit/fa8434b))
* set dimensions and z-index on ghost element ([9b5a6b0](https://github.com/mattlewis92/angular-draggable-droppable/commit/9b5a6b0))
* **dragCursor:** don't default the drag cursor to `move` ([0a95ac7](https://github.com/mattlewis92/angular-draggable-droppable/commit/0a95ac7))
* **droppable:** correctly account for scroll events when dragging elements ([c5ef775](https://github.com/mattlewis92/angular-draggable-droppable/commit/c5ef775)), closes [#23](https://github.com/mattlewis92/angular-draggable-droppable/issues/23)
* **droppable:** dont throw when immediately destroying the directive ([dd3e89e](https://github.com/mattlewis92/angular-draggable-droppable/commit/dd3e89e))


### Features

* **dragActiveClass:** add class when dragging element ([ee1d06c](https://github.com/mattlewis92/angular-draggable-droppable/commit/ee1d06c))
* **dragCancel$:** allow the drag to be cancelled ([538f9b7](https://github.com/mattlewis92/angular-draggable-droppable/commit/538f9b7)), closes [#30](https://github.com/mattlewis92/angular-draggable-droppable/issues/30)
* **draggable:** add option to show the original element while dragging ([d010733](https://github.com/mattlewis92/angular-draggable-droppable/commit/d010733))
* **dragOverClass:** add a class when an element is dragged over it ([76852bc](https://github.com/mattlewis92/angular-draggable-droppable/commit/76852bc))
* **droppable:** add css class when any element is being dragged ([5995f81](https://github.com/mattlewis92/angular-draggable-droppable/commit/5995f81))
* add a way of setting the scroll container if not the window ([9831d36](https://github.com/mattlewis92/angular-draggable-droppable/commit/9831d36))
* **ghostElementAppendTo:** allow the ghost element parent to be customised ([f51214e](https://github.com/mattlewis92/angular-draggable-droppable/commit/f51214e))
* **ghostElementCreated:** emit new event after the ghost element is created ([22530b9](https://github.com/mattlewis92/angular-draggable-droppable/commit/22530b9))
* **ghostElementTemplate:** allow changing the ghost element contents ([ecc96ec](https://github.com/mattlewis92/angular-draggable-droppable/commit/ecc96ec))
* expose interfaces for all events ([c174023](https://github.com/mattlewis92/angular-draggable-droppable/commit/c174023))
* remove the DragAndDropModule.forRoot method ([5ae52a7](https://github.com/mattlewis92/angular-draggable-droppable/commit/5ae52a7))


### Performance Improvements

* deregister scroll listener once drag complete ([7e50d74](https://github.com/mattlewis92/angular-draggable-droppable/commit/7e50d74))
* only recalculate the bounding rectangle once after scrolling ([d72e16b](https://github.com/mattlewis92/angular-draggable-droppable/commit/d72e16b))
* only recompute draggable position on window scroll ([f6a5cde](https://github.com/mattlewis92/angular-draggable-droppable/commit/f6a5cde))


### BREAKING CHANGES

* The `DragAndDropModule.forRoot` method was removed. To migrate just import the
`DragAndDropModule` module directly
* the drag helper provider is now no longer exported as part of the public api, just
remove it from your code to migrate
* A cloned element is now created when the element is being dragged, and the dragged
element is set to be positioned fixed. This may break some apps in some edge cases.
* The `dragStart` `$event.x` and `$event.y` values were removed as these were always
`0`
* `pointer-events:none` is no longer automatically applied to elements while they are being dragged. To migrate use the `dragActiveClass` option and set this yourself with css
* **dragCursor:** The drag cursor will no longer be set to `move` by default, to restore the
behaviour set `dragCursor="move"` or use CSS on the draggable elements to change the cursor

<a name="3.0.1"></a>
## [3.0.1](https://github.com/mattlewis92/angular-draggable-droppable/compare/v3.0.0...v3.0.1) (2018-06-05)


### Bug Fixes

* **drag:** style assignment for dragged element on IE ([#33](https://github.com/mattlewis92/angular-draggable-droppable/issues/33)) ([d0372ec](https://github.com/mattlewis92/angular-draggable-droppable/commit/d0372ec)), closes [#29](https://github.com/mattlewis92/angular-draggable-droppable/issues/29)



<a name="3.0.0"></a>

# [3.0.0](https://github.com/mattlewis92/angular-draggable-droppable/compare/v2.0.0...v3.0.0) (2018-05-09)

### Features

* upgrade to angular 6 ([d96c26e](https://github.com/mattlewis92/angular-draggable-droppable/commit/d96c26e)), closes [#31](https://github.com/mattlewis92/angular-draggable-droppable/issues/31)

### BREAKING CHANGES

* angular 6 and rxjs 6 or higher are now required to use this package

<a name="2.0.0"></a>

# [2.0.0](https://github.com/mattlewis92/angular-draggable-droppable/compare/v1.1.1...v2.0.0) (2017-12-26)

### Bug Fixes

* only call drag start and end outputs when the element is actually dragged ([45c6b5f](https://github.com/mattlewis92/angular-draggable-droppable/commit/45c6b5f)), closes [#21](https://github.com/mattlewis92/angular-draggable-droppable/issues/21) [#20](https://github.com/mattlewis92/angular-draggable-droppable/issues/20)

### Features

* upgrade to angular 5 ([4159ce2](https://github.com/mattlewis92/angular-draggable-droppable/commit/4159ce2))
* use lettable rxjs operators ([9fca12a](https://github.com/mattlewis92/angular-draggable-droppable/commit/9fca12a))
* use ng-packagr for building the package ([57dd436](https://github.com/mattlewis92/angular-draggable-droppable/commit/57dd436))
* **dragPointerDown:** add a new output to repliate the old dragStart behaviour ([4a58c61](https://github.com/mattlewis92/angular-draggable-droppable/commit/4a58c61))

### BREAKING CHANGES

* The UMD module path has changed from
  `angular-draggable-droppable/dist/umd/angular-draggable-droppable.js` to
  `angular-draggable-droppable/bundles/angular-draggable-droppable.umd.js`. System.js users will need
  to update their config.
* rxjs operators will now no longer be added to the observable prototype. Also rxjs
  > = 5.5.x or higher is required
* Angular 5 or higher is now required to use this package
* drag start and end events are now only called when the element is actually dragged,
  use regular mousedown and mouseup events to get the old behaviour

<a name="1.1.1"></a>

## [1.1.1](https://github.com/mattlewis92/angular-draggable-droppable/compare/v1.1.0...v1.1.1) (2017-10-21)

### Bug Fixes

* allow angular 5 peer dependency ([1265bee](https://github.com/mattlewis92/angular-draggable-droppable/commit/1265bee))

<a name="1.1.0"></a>

# [1.1.0](https://github.com/mattlewis92/angular-draggable-droppable/compare/v1.0.2...v1.1.0) (2017-09-22)

### Features

* **draggable:** allow the draggable cursor to be customised ([897b3fe](https://github.com/mattlewis92/angular-draggable-droppable/commit/897b3fe))

<a name="1.0.2"></a>

## [1.0.2](https://github.com/mattlewis92/angular-draggable-droppable/compare/v1.0.1...v1.0.2) (2017-09-18)

### Bug Fixes

* **draggable:** fire dragEnd event when the event was not dragged ([73d65d7](https://github.com/mattlewis92/angular-draggable-droppable/commit/73d65d7)), closes [#17](https://github.com/mattlewis92/angular-draggable-droppable/issues/17)

<a name="1.0.1"></a>

## [1.0.1](https://github.com/mattlewis92/angular-draggable-droppable/compare/v1.0.0...v1.0.1) (2017-04-14)

### Bug Fixes

* **draggable:** prevent text from being highlighted in firefox ([7d859c1](https://github.com/mattlewis92/angular-draggable-droppable/commit/7d859c1))

<a name="1.0.0"></a>

# [1.0.0](https://github.com/mattlewis92/angular-draggable-droppable/compare/v0.6.0...v1.0.0) (2017-03-24)

### Features

* **ng4:** upgrade to angular 4 ([42631bc](https://github.com/mattlewis92/angular-draggable-droppable/commit/42631bc))

### BREAKING CHANGES

* **ng4:** angular 4.0 or higher is now required to use this library. The [upgrade](http://angularjs.blogspot.co.uk/2017/03/angular-400-now-available.html) should be seamless for most users

<a name="0.6.0"></a>

# [0.6.0](https://github.com/mattlewis92/angular-draggable-droppable/compare/v0.5.4...v0.6.0) (2017-03-23)

### Features

* **draggable:** make dragging work on touch devices ([dc0f863](https://github.com/mattlewis92/angular-draggable-droppable/commit/dc0f863))

<a name="0.5.4"></a>

## [0.5.4](https://github.com/mattlewis92/angular-draggable-droppable/compare/v0.5.3...v0.5.4) (2017-03-04)

### Performance Improvements

* **draggable:** lazily create all mouse event listeners ([3c99d40](https://github.com/mattlewis92/angular-draggable-droppable/commit/3c99d40))

<a name="0.5.3"></a>

## [0.5.3](https://github.com/mattlewis92/angular-draggable-droppable/compare/v0.5.2...v0.5.3) (2017-03-04)

### Bug Fixes

* move dependencies to dev ([17a2ccc](https://github.com/mattlewis92/angular-draggable-droppable/commit/17a2ccc))

<a name="0.5.2"></a>

## [0.5.2](https://github.com/mattlewis92/angular-draggable-droppable/compare/v0.5.1...v0.5.2) (2017-03-04)

### Bug Fixes

* loosen peer dependency to allow angular 4 ([bcc9080](https://github.com/mattlewis92/angular-draggable-droppable/commit/bcc9080))

### Performance Improvements

* **draggable:** lazily create the mouse move listener ([bebd925](https://github.com/mattlewis92/angular-draggable-droppable/commit/bebd925))
* run all event listeners outside of angulars zone ([d7c9256](https://github.com/mattlewis92/angular-draggable-droppable/commit/d7c9256))

<a name="0.5.1"></a>

## [0.5.1](https://github.com/mattlewis92/angular-draggable-droppable/compare/v0.5.0...v0.5.1) (2017-01-06)

### Bug Fixes

* **draggable:** allow draggable events to be clicked ([44ea67e](https://github.com/mattlewis92/angular-draggable-droppable/commit/44ea67e))

<a name="0.5.0"></a>

# [0.5.0](https://github.com/mattlewis92/angular-draggable-droppable/compare/v0.4.0...v0.5.0) (2016-12-21)

### Features

* **dragAndDropModule:** add forRoot method ([00f6989](https://github.com/mattlewis92/angular-draggable-droppable/commit/00f6989))

### BREAKING CHANGES

* dragAndDropModule: You must now import the DragAndDropModule with the forRoot method

<a name="0.4.0"></a>

# [0.4.0](https://github.com/mattlewis92/angular-draggable-droppable/compare/v0.3.1...v0.4.0) (2016-12-18)

### Features

* **draggable:** remove the dragContainer option ([5aca67d](https://github.com/mattlewis92/angular-draggable-droppable/commit/5aca67d))

### BREAKING CHANGES

* draggable: the dragContainer option has been removed as it didn't work in all cases and can be

implemented yourself with the validateDrag option

<a name="0.3.1"></a>

## [0.3.1](https://github.com/mattlewis92/angular-draggable-droppable/compare/v0.3.0...v0.3.1) (2016-12-18)

### Bug Fixes

* **draggable:** make the dragEnd output respect the validateDrag input ([26cfa7e](https://github.com/mattlewis92/angular-draggable-droppable/commit/26cfa7e))

<a name="0.3.0"></a>

# [0.3.0](https://github.com/mattlewis92/angular-draggable-droppable/compare/v0.2.3...v0.3.0) (2016-12-12)

### Features

* **draggable:** add dragContainer option ([fb75711](https://github.com/mattlewis92/angular-draggable-droppable/commit/fb75711)), closes [#10](https://github.com/mattlewis92/angular-draggable-droppable/issues/10)

<a name="0.2.3"></a>

## [0.2.3](https://github.com/mattlewis92/angular-draggable-droppable/compare/v0.2.2...v0.2.3) (2016-12-11)

### Bug Fixes

* **draggable:** allow events to be dragged back into their original positions ([7831903](https://github.com/mattlewis92/angular-draggable-droppable/commit/7831903))

<a name="0.2.2"></a>

## [0.2.2](https://github.com/mattlewis92/angular-draggable-droppable/compare/v0.2.1...v0.2.2) (2016-12-11)

### Bug Fixes

* **draggable:** only emit the dragEnd event once ([52e9a22](https://github.com/mattlewis92/angular-draggable-droppable/commit/52e9a22))

<a name="0.2.1"></a>

## [0.2.1](https://github.com/mattlewis92/angular-draggable-droppable/compare/v0.2.0...v0.2.1) (2016-12-10)

### Bug Fixes

* revert duplicate dragging fix as it caused worse errors ([7476301](https://github.com/mattlewis92/angular-draggable-droppable/commit/7476301))

<a name="0.2.0"></a>

# [0.2.0](https://github.com/mattlewis92/angular-draggable-droppable/compare/v0.1.1...v0.2.0) (2016-12-10)

### Bug Fixes

* completely remove applied styled after dragging ([3445337](https://github.com/mattlewis92/angular-draggable-droppable/commit/3445337))
* **draggable:** dont fire duplicate dragging events with the same coordinates ([222914b](https://github.com/mattlewis92/angular-draggable-droppable/commit/222914b)), closes [#6](https://github.com/mattlewis92/angular-draggable-droppable/issues/6)
* **draggable:** when dragging is disabled, no drag events should be emitted ([729f24e](https://github.com/mattlewis92/angular-draggable-droppable/commit/729f24e))
* **droppable:** only allow dropping of events when the cursor is inside ([652d632](https://github.com/mattlewis92/angular-draggable-droppable/commit/652d632)), closes [#5](https://github.com/mattlewis92/angular-draggable-droppable/issues/5)

### Features

* **draggable:** auto change the cursor to the move icon on hover ([50d1962](https://github.com/mattlewis92/angular-draggable-droppable/commit/50d1962)), closes [#9](https://github.com/mattlewis92/angular-draggable-droppable/issues/9)
* **snapGrid:** rename to dragSnapGrid ([a77d07a](https://github.com/mattlewis92/angular-draggable-droppable/commit/a77d07a)), closes [#7](https://github.com/mattlewis92/angular-draggable-droppable/issues/7)
* **validateDrag:** add the validate drag input ([9e5ac95](https://github.com/mattlewis92/angular-draggable-droppable/commit/9e5ac95)), closes [#8](https://github.com/mattlewis92/angular-draggable-droppable/issues/8)

### BREAKING CHANGES

* droppable: the drag enter, leave and drop events will not fire until cursor is inside the droppable element. This is to mimic how native drag and drop works
* snapGrid: The snapGrid input has been renamed to dragSnapGrid

<a name="0.1.1"></a>

## [0.1.1](https://github.com/mattlewis92/angular-draggable-droppable/compare/v0.1.0...v0.1.1) (2016-12-09)

### Bug Fixes

* **draggable:** disable pointer events on the element when dragging ([f29b424](https://github.com/mattlewis92/angular-draggable-droppable/commit/f29b424))

<a name="0.1.0"></a>

# 0.1.0 (2016-11-27)

### Bug Fixes

* **draggable:** dispose of observables when the component is destroyed ([710c7f7](https://github.com/mattlewis92/angular-draggable-droppable/commit/710c7f7))
* prevent the default move move interaction on dragging ([d2fdcde](https://github.com/mattlewis92/angular-draggable-droppable/commit/d2fdcde))

### Features

* **dragAxix:** allow the drag axis to be locked to just x and y ([38fd4b5](https://github.com/mattlewis92/angular-draggable-droppable/commit/38fd4b5)), closes [#2](https://github.com/mattlewis92/angular-draggable-droppable/issues/2)
* **draggable:** add mwlDraggable directive ([c6771eb](https://github.com/mattlewis92/angular-draggable-droppable/commit/c6771eb))
* **droppable:** add the mwlDroppable directive ([6016f12](https://github.com/mattlewis92/angular-draggable-droppable/commit/6016f12)), closes [#1](https://github.com/mattlewis92/angular-draggable-droppable/issues/1)
* **ghostDragEnabled:** add option to disable the ghost dragging effect ([709327c](https://github.com/mattlewis92/angular-draggable-droppable/commit/709327c)), closes [#3](https://github.com/mattlewis92/angular-draggable-droppable/issues/3)
* **snapGrid:** implement draggable snap grids ([16a3df8](https://github.com/mattlewis92/angular-draggable-droppable/commit/16a3df8)), closes [#4](https://github.com/mattlewis92/angular-draggable-droppable/issues/4)
