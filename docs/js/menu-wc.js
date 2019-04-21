'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`<nav>
    <ul class="list">
        <li class="title">
            <a href="index.html" data-type="index-link">angular-draggable-droppable documentation</a>
        </li>
        <li class="divider"></li>
        ${ isNormalMode ? `<div id="book-search-input" role="search">
    <input type="text" placeholder="Type to search">
</div>
` : '' }
        <li class="chapter">
            <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
            <ul class="links">
                    <li class="link">
                        <a href="overview.html" data-type="chapter-link">
                            <span class="icon ion-ios-keypad"></span>Overview
                        </a>
                    </li>
                    <li class="link">
                        <a href="index.html" data-type="chapter-link">
                            <span class="icon ion-ios-paper"></span>README
                        </a>
                    </li>
                    <li class="link">
                            <a href="changelog.html"
                        data-type="chapter-link">
                            <span class="icon ion-ios-paper"></span>CHANGELOG
                        </a>
                    </li>
                    <li class="link">
                            <a href="license.html"
                        data-type="chapter-link">
                            <span class="icon ion-ios-paper"></span>LICENSE
                        </a>
                    </li>
                    <li class="link">
                        <a href="dependencies.html"
                            data-type="chapter-link">
                            <span class="icon ion-ios-list"></span>Dependencies
                        </a>
                    </li>
            </ul>
        </li>
        <li class="chapter modules">
            <a data-type="chapter-link" href="modules.html">
                <div class="menu-toggler linked" data-toggle="collapse"
                    ${ isNormalMode ? 'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                    <span class="icon ion-ios-archive"></span>
                    <span class="link-name">Modules</span>
                    <span class="icon ion-ios-arrow-down"></span>
                </div>
            </a>
            <ul class="links collapse"
            ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                    <li class="link">
                        <a href="modules/DragAndDropModule.html" data-type="entity-link">DragAndDropModule</a>
                            <li class="chapter inner">
                                <div class="simple menu-toggler" data-toggle="collapse"
                                    ${ isNormalMode ? 'data-target="#directives-links-module-DragAndDropModule-2905988a537ded9832ee843486692992"' : 'data-target="#xs-directives-links-module-DragAndDropModule-2905988a537ded9832ee843486692992"' }>
                                    <span class="icon ion-md-code-working"></span>
                                    <span>Directives</span>
                                    <span class="icon ion-ios-arrow-down"></span>
                                </div>
                                <ul class="links collapse"
                                    ${ isNormalMode ? 'id="directives-links-module-DragAndDropModule-2905988a537ded9832ee843486692992"' : 'id="xs-directives-links-module-DragAndDropModule-2905988a537ded9832ee843486692992"' }>
                                        <li class="link">
                                            <a href="directives/DraggableDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">DraggableDirective</a>
                                        </li>
                                        <li class="link">
                                            <a href="directives/DroppableDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules">DroppableDirective</a>
                                        </li>
                                </ul>
                            </li>
                    </li>
            </ul>
        </li>
        <li class="chapter">
            <div class="simple menu-toggler" data-toggle="collapse"
                ${ isNormalMode ? 'data-target="#interfaces-links"' : 'data-target="#xs-interfaces-links"' }>
                <span class="icon ion-md-information-circle-outline"></span>
                <span>Interfaces</span>
                <span class="icon ion-ios-arrow-down"></span>
            </div>
            <ul class="links collapse"
            ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                    <li class="link">
                        <a href="interfaces/Coordinates.html" data-type="entity-link">Coordinates</a>
                    </li>
                    <li class="link">
                        <a href="interfaces/DragAxis.html" data-type="entity-link">DragAxis</a>
                    </li>
                    <li class="link">
                        <a href="interfaces/DragEndEvent.html" data-type="entity-link">DragEndEvent</a>
                    </li>
                    <li class="link">
                        <a href="interfaces/DragMoveEvent.html" data-type="entity-link">DragMoveEvent</a>
                    </li>
                    <li class="link">
                        <a href="interfaces/DragPointerDownEvent.html" data-type="entity-link">DragPointerDownEvent</a>
                    </li>
                    <li class="link">
                        <a href="interfaces/DragStartEvent.html" data-type="entity-link">DragStartEvent</a>
                    </li>
                    <li class="link">
                        <a href="interfaces/DropEvent.html" data-type="entity-link">DropEvent</a>
                    </li>
                    <li class="link">
                        <a href="interfaces/GhostElementCreatedEvent.html" data-type="entity-link">GhostElementCreatedEvent</a>
                    </li>
                    <li class="link">
                        <a href="interfaces/PointerEvent.html" data-type="entity-link">PointerEvent</a>
                    </li>
                    <li class="link">
                        <a href="interfaces/SnapGrid.html" data-type="entity-link">SnapGrid</a>
                    </li>
                    <li class="link">
                        <a href="interfaces/TimeLongPress.html" data-type="entity-link">TimeLongPress</a>
                    </li>
                    <li class="link">
                        <a href="interfaces/ValidateDragParams.html" data-type="entity-link">ValidateDragParams</a>
                    </li>
            </ul>
        </li>
        <li class="chapter">
            <div class="simple menu-toggler" data-toggle="collapse"
            ${ isNormalMode ? 'data-target="#miscellaneous-links"' : 'data-target="#xs-miscellaneous-links"' }>
                <span class="icon ion-ios-cube"></span>
                <span>Miscellaneous</span>
                <span class="icon ion-ios-arrow-down"></span>
            </div>
            <ul class="links collapse"
            ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                    <li class="link">
                      <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                    </li>
                    <li class="link">
                      <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                    </li>
            </ul>
        </li>
        <li class="divider"></li>
        <li class="copyright">
                Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.svg" class="img-responsive" data-type="compodoc-logo">
                </a>
        </li>
    </ul>
</nav>`);
        this.innerHTML = tp.strings;
    }
});
