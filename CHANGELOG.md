# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

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
