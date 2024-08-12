/*! For license information please see global.js.LICENSE.txt */
(() => {
    "use strict";
    class e {
        constructor(e) {
            this.container = e, this.isSwippable = null != e.dataset.isSwippable, this.stepGroups = e.querySelectorAll("[data-linked-steps]"), this.currentStep = 0, this.totalSteps = this.stepGroups[0].children.length, this.controls = {
                prev: e.querySelector("[data-linked-group-prev]"),
                next: e.querySelector("[data-linked-group-next]")
            }, this.setEventListeners(), this.isSwippable && (this.touchController = new class {
                constructor(e) {
                    this.linkedGroup = e, this.container = this.linkedGroup.container, this.swipe = {
                        start: 0,
                        progress: 0
                    }, this.thumbnails = {
                        prev: null,
                        current: null,
                        next: null
                    }, this.texts = {
                        prev: null,
                        current: null,
                        next: null
                    }, this.container.addEventListener("touchstart", (e => {
                        this.container.classList.add("swipe-mode"), this.swipe.start = e.touches[0].clientX, this.setElementsToBeSwiped(), this.setProgress(0)
                    })), this.container.addEventListener("touchmove", (e => {
                        this.swipe.progress = (e.touches[0].clientX - this.swipe.start) / window.innerWidth, this.setProgress(this.swipe.progress)
                    })), this.container.addEventListener("touchend", (e => {
                        if (Math.abs(this.swipe.progress) > .25) {
                            const e = Math.sign(this.swipe.progress) > 0 && null != this.thumbnails.prev,
                                t = Math.sign(this.swipe.progress) < 0 && null != this.thumbnails.next;
                            e && this.linkedGroup.goToPrev(), t && this.linkedGroup.goToNext()
                        }
                        this.swipe = {
                            start: 0,
                            progress: 0
                        }, this.setProgress(0), this.container.classList.remove("swipe-mode"), this.resetElementsToBeSwiped()
                    }))
                }
                setElementsToBeSwiped() {
                    const e = this.container.querySelector(".thumbnails-collection .current"),
                        t = this.container.querySelector(".article-text-collection .current");
                    this.thumbnails.current = e, this.texts.current = t, e.previousElementSibling && (this.thumbnails.prev = e.previousElementSibling, this.thumbnails.prev.classList.add("prev"), this.texts.prev = t.previousElementSibling, this.texts.prev.classList.add("prev")), e.nextElementSibling && (this.thumbnails.next = e.nextElementSibling, this.thumbnails.next.classList.add("next"), this.texts.next = t.nextElementSibling, this.texts.next.classList.add("next"))
                }
                resetElementsToBeSwiped() {
                    this.thumbnails.prev && (this.thumbnails.prev.classList.remove("prev"), this.texts.prev.classList.remove("prev")), this.thumbnails.next && (this.thumbnails.next.classList.remove("next"), this.texts.next.classList.remove("next"))
                }
                setProgress(e) {
                    this.container.style.setProperty("--progress", this.swipe.progress)
                }
            }(this))
        }
        setEventListeners() {
            this.stepGroups.forEach((e => {
                Array.from(e.children).forEach(((e, t) => {
                    e.addEventListener("click", (() => {
                        this.goToIndex(t)
                    }))
                }))
            })), null !== this.controls.prev && this.controls.prev.addEventListener("click", (() => {
                this.goToPrev()
            })), null !== this.controls.next && this.controls.next.addEventListener("click", (() => {
                this.goToNext()
            }))
        }
        goToPrev() {
            this.currentStep - 1 >= 0 ? this.goToIndex(this.currentStep - 1) : this.goToIndex(this.totalSteps - 1)
        }
        goToNext() {
            this.currentStep + 1 < this.totalSteps ? this.goToIndex(this.currentStep + 1) : this.goToIndex(0)
        }
        goToIndex(e) {
            this.currentStep = e, this.stepGroups.forEach((t => {
                Array.from(t.children).forEach(((t, i) => {
                    e === i ? t.classList.add("current") : t.classList.remove("current")
                }))
            }))
        }
    }
    const t = /(youtu.*be.*)\/(watch\?v=|embed\/|v|shorts|)(.*?((?=[&#?])|$))/,
        i = /(youtu.*be.*)\/(watch\?v=|embed\/|v|shorts|)(.*?((?=[&#?])|$))/;
    class s {
        constructor(e) {
            this.marquee = e, this.originalContent = Array.from(this.marquee.children).map((e => e.cloneNode(!0))), this.speed = this.marquee.getAttribute("data-speed"), this.speed = null === this.speed ? .05 : parseFloat(this.speed), this.direction = this.marquee.getAttribute("data-direction"), this.direction = null === this.direction ? 1 : parseInt(this.direction), this.init()
        }
        init() {
            if (this.initialWidth = this.marquee.scrollWidth, this.marquee.scrollWidth > 0) {
                const e = Math.ceil(window.innerWidth / this.marquee.scrollWidth),
                    t = [];
                for (let i = 0; i < e; i++) this.originalContent.forEach((e => {
                    t.push(e.cloneNode(!0))
                }));
                this.marquee.append(...t)
            }
            const e = parseInt(getComputedStyle(this.marquee).gridColumnGap);
            this.widthToScroll = this.initialWidth + e;
            const t = this.widthToScroll / this.speed;
            this.keyframes = [], this.direction > 0 ? this.keyframes = [{
                transform: `translate3d(-${this.widthToScroll}px, 0, 0)`
            }, {
                transform: "translate3d(0, 0, 0)"
            }] : this.keyframes = [{
                transform: "translate3d(0, 0, 0)"
            }, {
                transform: `translate3d(-${this.widthToScroll}px, 0, 0)`
            }], this.animation = this.marquee.animate(this.keyframes, {
                duration: t,
                iterations: 1 / 0,
                easing: "linear",
                fill: "forwards"
            })
        }
    }
    class r {
        constructor(e) {
            this.element = e, this.marquee = new s(e.querySelector(".marquee-tagline")), this.observer = new IntersectionObserver((e => {
                this.onIntersection(e)
            })), this.observer.observe(e), this.lastScrollPosition = 0, this.transformation = 0, this.maxSkew = 8, this.maxSpeed = 4, this.recoverySpeed = 1e3
        }
        onIntersection(e) {
            e[0].isIntersecting ? this.shouldUpdate = !0 : this.shouldUpdate = !1
        }
        onScroll(e) {
            this.transformation += e / 10, this.transformation = Math.sign(this.transformation) * Math.min(Math.abs(this.transformation), 1)
        }
        onDraw(e) {
            if (this.shouldUpdate) {
                this.element.style.transform = `skewX(${this.transformation*this.maxSkew}deg)`, this.marquee.animation.playbackRate = 1 + this.transformation * this.maxSpeed;
                const t = Math.sign(this.transformation);
                let i = Math.abs(this.transformation) - e / this.recoverySpeed * 1;
                i < 0 && (i = 0), this.transformation = t * i
            }
        }
    }
    class n {
        constructor(e) {
            e.addEventListener("mouseenter", (() => {
                const t = e.querySelector(".additionnal-content").getBoundingClientRect().height;
                e.style.setProperty("--hover-offset", -t + "px")
            })), e.addEventListener("touchstart", (() => {
                const t = e.querySelector(".additionnal-content").getBoundingClientRect().height;
                e.style.setProperty("--hover-offset", -t + "px")
            }))
        }
    }

    function a(e) {
        return null !== e && "object" == typeof e && "constructor" in e && e.constructor === Object
    }

    function o(e = {}, t = {}) {
        Object.keys(t).forEach((i => {
            void 0 === e[i] ? e[i] = t[i] : a(t[i]) && a(e[i]) && Object.keys(t[i]).length > 0 && o(e[i], t[i])
        }))
    }
    const l = {
        body: {},
        addEventListener() {},
        removeEventListener() {},
        activeElement: {
            blur() {},
            nodeName: ""
        },
        querySelector: () => null,
        querySelectorAll: () => [],
        getElementById: () => null,
        createEvent: () => ({
            initEvent() {}
        }),
        createElement: () => ({
            children: [],
            childNodes: [],
            style: {},
            setAttribute() {},
            getElementsByTagName: () => []
        }),
        createElementNS: () => ({}),
        importNode: () => null,
        location: {
            hash: "",
            host: "",
            hostname: "",
            href: "",
            origin: "",
            pathname: "",
            protocol: "",
            search: ""
        }
    };

    function d() {
        const e = "undefined" != typeof document ? document : {};
        return o(e, l), e
    }
    const c = {
        document: l,
        navigator: {
            userAgent: ""
        },
        location: {
            hash: "",
            host: "",
            hostname: "",
            href: "",
            origin: "",
            pathname: "",
            protocol: "",
            search: ""
        },
        history: {
            replaceState() {},
            pushState() {},
            go() {},
            back() {}
        },
        CustomEvent: function() {
            return this
        },
        addEventListener() {},
        removeEventListener() {},
        getComputedStyle: () => ({
            getPropertyValue: () => ""
        }),
        Image() {},
        Date() {},
        screen: {},
        setTimeout() {},
        clearTimeout() {},
        matchMedia: () => ({}),
        requestAnimationFrame: e => "undefined" == typeof setTimeout ? (e(), null) : setTimeout(e, 0),
        cancelAnimationFrame(e) {
            "undefined" != typeof setTimeout && clearTimeout(e)
        }
    };

    function u() {
        const e = "undefined" != typeof window ? window : {};
        return o(e, c), e
    }

    function p(e, t = 0) {
        return setTimeout(e, t)
    }

    function h() {
        return Date.now()
    }

    function f(e) {
        return "object" == typeof e && null !== e && e.constructor && "Object" === Object.prototype.toString.call(e).slice(8, -1)
    }

    function m(...e) {
        const t = Object(e[0]),
            i = ["__proto__", "constructor", "prototype"];
        for (let r = 1; r < e.length; r += 1) {
            const n = e[r];
            if (null != n && (s = n, !("undefined" != typeof window && void 0 !== window.HTMLElement ? s instanceof HTMLElement : s && (1 === s.nodeType || 11 === s.nodeType)))) {
                const e = Object.keys(Object(n)).filter((e => i.indexOf(e) < 0));
                for (let i = 0, s = e.length; i < s; i += 1) {
                    const s = e[i],
                        r = Object.getOwnPropertyDescriptor(n, s);
                    void 0 !== r && r.enumerable && (f(t[s]) && f(n[s]) ? n[s].__swiper__ ? t[s] = n[s] : m(t[s], n[s]) : !f(t[s]) && f(n[s]) ? (t[s] = {}, n[s].__swiper__ ? t[s] = n[s] : m(t[s], n[s])) : t[s] = n[s])
                }
            }
        }
        var s;
        return t
    }

    function g(e, t, i) {
        e.style.setProperty(t, i)
    }

    function v({
        swiper: e,
        targetPosition: t,
        side: i
    }) {
        const s = u(),
            r = -e.translate;
        let n, a = null;
        const o = e.params.speed;
        e.wrapperEl.style.scrollSnapType = "none", s.cancelAnimationFrame(e.cssModeFrameID);
        const l = t > r ? "next" : "prev",
            d = (e, t) => "next" === l && e >= t || "prev" === l && e <= t,
            c = () => {
                n = (new Date).getTime(), null === a && (a = n);
                const l = Math.max(Math.min((n - a) / o, 1), 0),
                    u = .5 - Math.cos(l * Math.PI) / 2;
                let p = r + u * (t - r);
                if (d(p, t) && (p = t), e.wrapperEl.scrollTo({
                        [i]: p
                    }), d(p, t)) return e.wrapperEl.style.overflow = "hidden", e.wrapperEl.style.scrollSnapType = "", setTimeout((() => {
                    e.wrapperEl.style.overflow = "", e.wrapperEl.scrollTo({
                        [i]: p
                    })
                })), void s.cancelAnimationFrame(e.cssModeFrameID);
                e.cssModeFrameID = s.requestAnimationFrame(c)
            };
        c()
    }

    function y(e, t = "") {
        return [...e.children].filter((e => e.matches(t)))
    }

    function _(e, t = []) {
        const i = document.createElement(e);
        return i.classList.add(...Array.isArray(t) ? t : [t]), i
    }

    function w(e, t) {
        return u().getComputedStyle(e, null).getPropertyValue(t)
    }

    function b(e) {
        let t, i = e;
        if (i) {
            for (t = 0; null !== (i = i.previousSibling);) 1 === i.nodeType && (t += 1);
            return t
        }
    }

    function S(e, t) {
        const i = [];
        let s = e.parentElement;
        for (; s;) t ? s.matches(t) && i.push(s) : i.push(s), s = s.parentElement;
        return i
    }

    function x(e, t, i) {
        const s = u();
        return i ? e["width" === t ? "offsetWidth" : "offsetHeight"] + parseFloat(s.getComputedStyle(e, null).getPropertyValue("width" === t ? "margin-right" : "margin-top")) + parseFloat(s.getComputedStyle(e, null).getPropertyValue("width" === t ? "margin-left" : "margin-bottom")) : e.offsetWidth
    }
    let T, E, A;

    function C() {
        return T || (T = function() {
            const e = u(),
                t = d();
            return {
                smoothScroll: t.documentElement && t.documentElement.style && "scrollBehavior" in t.documentElement.style,
                touch: !!("ontouchstart" in e || e.DocumentTouch && t instanceof e.DocumentTouch)
            }
        }()), T
    }
    const L = {
            on(e, t, i) {
                const s = this;
                if (!s.eventsListeners || s.destroyed) return s;
                if ("function" != typeof t) return s;
                const r = i ? "unshift" : "push";
                return e.split(" ").forEach((e => {
                    s.eventsListeners[e] || (s.eventsListeners[e] = []), s.eventsListeners[e][r](t)
                })), s
            },
            once(e, t, i) {
                const s = this;
                if (!s.eventsListeners || s.destroyed) return s;
                if ("function" != typeof t) return s;

                function r(...i) {
                    s.off(e, r), r.__emitterProxy && delete r.__emitterProxy, t.apply(s, i)
                }
                return r.__emitterProxy = t, s.on(e, r, i)
            },
            onAny(e, t) {
                const i = this;
                if (!i.eventsListeners || i.destroyed) return i;
                if ("function" != typeof e) return i;
                const s = t ? "unshift" : "push";
                return i.eventsAnyListeners.indexOf(e) < 0 && i.eventsAnyListeners[s](e), i
            },
            offAny(e) {
                const t = this;
                if (!t.eventsListeners || t.destroyed) return t;
                if (!t.eventsAnyListeners) return t;
                const i = t.eventsAnyListeners.indexOf(e);
                return i >= 0 && t.eventsAnyListeners.splice(i, 1), t
            },
            off(e, t) {
                const i = this;
                return !i.eventsListeners || i.destroyed ? i : i.eventsListeners ? (e.split(" ").forEach((e => {
                    void 0 === t ? i.eventsListeners[e] = [] : i.eventsListeners[e] && i.eventsListeners[e].forEach(((s, r) => {
                        (s === t || s.__emitterProxy && s.__emitterProxy === t) && i.eventsListeners[e].splice(r, 1)
                    }))
                })), i) : i
            },
            emit(...e) {
                const t = this;
                if (!t.eventsListeners || t.destroyed) return t;
                if (!t.eventsListeners) return t;
                let i, s, r;
                return "string" == typeof e[0] || Array.isArray(e[0]) ? (i = e[0], s = e.slice(1, e.length), r = t) : (i = e[0].events, s = e[0].data, r = e[0].context || t), s.unshift(r), (Array.isArray(i) ? i : i.split(" ")).forEach((e => {
                    t.eventsAnyListeners && t.eventsAnyListeners.length && t.eventsAnyListeners.forEach((t => {
                        t.apply(r, [e, ...s])
                    })), t.eventsListeners && t.eventsListeners[e] && t.eventsListeners[e].forEach((e => {
                        e.apply(r, s)
                    }))
                })), t
            }
        },
        M = (e, t) => {
            if (!e || e.destroyed || !e.params) return;
            const i = t.closest(e.isElement ? "swiper-slide" : `.${e.params.slideClass}`);
            if (i) {
                const t = i.querySelector(`.${e.params.lazyPreloaderClass}`);
                t && t.remove()
            }
        },
        k = (e, t) => {
            if (!e.slides[t]) return;
            const i = e.slides[t].querySelector('[loading="lazy"]');
            i && i.removeAttribute("loading")
        },
        P = e => {
            if (!e || e.destroyed || !e.params) return;
            let t = e.params.lazyPreloadPrevNext;
            const i = e.slides.length;
            if (!i || !t || t < 0) return;
            t = Math.min(t, i);
            const s = "auto" === e.params.slidesPerView ? e.slidesPerViewDynamic() : Math.ceil(e.params.slidesPerView),
                r = e.activeIndex;
            if (e.params.grid && e.params.grid.rows > 1) {
                const i = r,
                    n = [i - t];
                return n.push(...Array.from({
                    length: t
                }).map(((e, t) => i + s + t))), void e.slides.forEach(((t, i) => {
                    n.includes(t.column) && k(e, i)
                }))
            }
            const n = r + s - 1;
            if (e.params.rewind || e.params.loop)
                for (let s = r - t; s <= n + t; s += 1) {
                    const t = (s % i + i) % i;
                    (t < r || t > n) && k(e, t)
                } else
                    for (let s = Math.max(r - t, 0); s <= Math.min(n + t, i - 1); s += 1) s !== r && (s > n || s < r) && k(e, s)
        };

    function O({
        swiper: e,
        runCallbacks: t,
        direction: i,
        step: s
    }) {
        const {
            activeIndex: r,
            previousIndex: n
        } = e;
        let a = i;
        if (a || (a = r > n ? "next" : r < n ? "prev" : "reset"), e.emit(`transition${s}`), t && r !== n) {
            if ("reset" === a) return void e.emit(`slideResetTransition${s}`);
            e.emit(`slideChangeTransition${s}`), "next" === a ? e.emit(`slideNextTransition${s}`) : e.emit(`slidePrevTransition${s}`)
        }
    }

    function D(e) {
        const t = this,
            i = d(),
            s = u(),
            r = t.touchEventsData;
        r.evCache.push(e);
        const {
            params: n,
            touches: a,
            enabled: o
        } = t;
        if (!o) return;
        if (!n.simulateTouch && "mouse" === e.pointerType) return;
        if (t.animating && n.preventInteractionOnTransition) return;
        !t.animating && n.cssMode && n.loop && t.loopFix();
        let l = e;
        l.originalEvent && (l = l.originalEvent);
        let c = l.target;
        if ("wrapper" === n.touchEventsTarget && !t.wrapperEl.contains(c)) return;
        if ("which" in l && 3 === l.which) return;
        if ("button" in l && l.button > 0) return;
        if (r.isTouched && r.isMoved) return;
        const p = !!n.noSwipingClass && "" !== n.noSwipingClass,
            f = e.composedPath ? e.composedPath() : e.path;
        p && l.target && l.target.shadowRoot && f && (c = f[0]);
        const m = n.noSwipingSelector ? n.noSwipingSelector : `.${n.noSwipingClass}`,
            g = !(!l.target || !l.target.shadowRoot);
        if (n.noSwiping && (g ? function(e, t = this) {
                return function t(i) {
                    if (!i || i === d() || i === u()) return null;
                    i.assignedSlot && (i = i.assignedSlot);
                    const s = i.closest(e);
                    return s || i.getRootNode ? s || t(i.getRootNode().host) : null
                }(t)
            }(m, c) : c.closest(m))) return void(t.allowClick = !0);
        if (n.swipeHandler && !c.closest(n.swipeHandler)) return;
        a.currentX = l.pageX, a.currentY = l.pageY;
        const v = a.currentX,
            y = a.currentY,
            _ = n.edgeSwipeDetection || n.iOSEdgeSwipeDetection,
            w = n.edgeSwipeThreshold || n.iOSEdgeSwipeThreshold;
        if (_ && (v <= w || v >= s.innerWidth - w)) {
            if ("prevent" !== _) return;
            e.preventDefault()
        }
        Object.assign(r, {
            isTouched: !0,
            isMoved: !1,
            allowTouchCallbacks: !0,
            isScrolling: void 0,
            startMoving: void 0
        }), a.startX = v, a.startY = y, r.touchStartTime = h(), t.allowClick = !0, t.updateSize(), t.swipeDirection = void 0, n.threshold > 0 && (r.allowThresholdMove = !1);
        let b = !0;
        c.matches(r.focusableElements) && (b = !1, "SELECT" === c.nodeName && (r.isTouched = !1)), i.activeElement && i.activeElement.matches(r.focusableElements) && i.activeElement !== c && i.activeElement.blur();
        const S = b && t.allowTouchMove && n.touchStartPreventDefault;
        !n.touchStartForcePreventDefault && !S || c.isContentEditable || l.preventDefault(), n.freeMode && n.freeMode.enabled && t.freeMode && t.animating && !n.cssMode && t.freeMode.onTouchStart(), t.emit("touchStart", l)
    }

    function I(e) {
        const t = d(),
            i = this,
            s = i.touchEventsData,
            {
                params: r,
                touches: n,
                rtlTranslate: a,
                enabled: o
            } = i;
        if (!o) return;
        if (!r.simulateTouch && "mouse" === e.pointerType) return;
        let l = e;
        if (l.originalEvent && (l = l.originalEvent), !s.isTouched) return void(s.startMoving && s.isScrolling && i.emit("touchMoveOpposite", l));
        const c = s.evCache.findIndex((e => e.pointerId === l.pointerId));
        c >= 0 && (s.evCache[c] = l);
        const u = s.evCache.length > 1 ? s.evCache[0] : l,
            p = u.pageX,
            f = u.pageY;
        if (l.preventedByNestedSwiper) return n.startX = p, void(n.startY = f);
        if (!i.allowTouchMove) return l.target.matches(s.focusableElements) || (i.allowClick = !1), void(s.isTouched && (Object.assign(n, {
            startX: p,
            startY: f,
            prevX: i.touches.currentX,
            prevY: i.touches.currentY,
            currentX: p,
            currentY: f
        }), s.touchStartTime = h()));
        if (r.touchReleaseOnEdges && !r.loop)
            if (i.isVertical()) {
                if (f < n.startY && i.translate <= i.maxTranslate() || f > n.startY && i.translate >= i.minTranslate()) return s.isTouched = !1, void(s.isMoved = !1)
            } else if (p < n.startX && i.translate <= i.maxTranslate() || p > n.startX && i.translate >= i.minTranslate()) return;
        if (t.activeElement && l.target === t.activeElement && l.target.matches(s.focusableElements)) return s.isMoved = !0, void(i.allowClick = !1);
        if (s.allowTouchCallbacks && i.emit("touchMove", l), l.targetTouches && l.targetTouches.length > 1) return;
        n.currentX = p, n.currentY = f;
        const m = n.currentX - n.startX,
            g = n.currentY - n.startY;
        if (i.params.threshold && Math.sqrt(m ** 2 + g ** 2) < i.params.threshold) return;
        if (void 0 === s.isScrolling) {
            let e;
            i.isHorizontal() && n.currentY === n.startY || i.isVertical() && n.currentX === n.startX ? s.isScrolling = !1 : m * m + g * g >= 25 && (e = 180 * Math.atan2(Math.abs(g), Math.abs(m)) / Math.PI, s.isScrolling = i.isHorizontal() ? e > r.touchAngle : 90 - e > r.touchAngle)
        }
        if (s.isScrolling && i.emit("touchMoveOpposite", l), void 0 === s.startMoving && (n.currentX === n.startX && n.currentY === n.startY || (s.startMoving = !0)), s.isScrolling || i.zoom && i.params.zoom && i.params.zoom.enabled && s.evCache.length > 1) return void(s.isTouched = !1);
        if (!s.startMoving) return;
        i.allowClick = !1, !r.cssMode && l.cancelable && l.preventDefault(), r.touchMoveStopPropagation && !r.nested && l.stopPropagation();
        let v = i.isHorizontal() ? m : g,
            y = i.isHorizontal() ? n.currentX - n.previousX : n.currentY - n.previousY;
        r.oneWayMovement && (v = Math.abs(v) * (a ? 1 : -1), y = Math.abs(y) * (a ? 1 : -1)), n.diff = v, v *= r.touchRatio, a && (v = -v, y = -y);
        const _ = i.touchesDirection;
        i.swipeDirection = v > 0 ? "prev" : "next", i.touchesDirection = y > 0 ? "prev" : "next";
        const w = i.params.loop && !r.cssMode;
        if (!s.isMoved) {
            if (w && i.loopFix({
                    direction: i.swipeDirection
                }), s.startTranslate = i.getTranslate(), i.setTransition(0), i.animating) {
                const e = new window.CustomEvent("transitionend", {
                    bubbles: !0,
                    cancelable: !0
                });
                i.wrapperEl.dispatchEvent(e)
            }
            s.allowMomentumBounce = !1, !r.grabCursor || !0 !== i.allowSlideNext && !0 !== i.allowSlidePrev || i.setGrabCursor(!0), i.emit("sliderFirstMove", l)
        }
        let b;
        s.isMoved && _ !== i.touchesDirection && w && Math.abs(v) >= 1 && (i.loopFix({
            direction: i.swipeDirection,
            setTranslate: !0
        }), b = !0), i.emit("sliderMove", l), s.isMoved = !0, s.currentTranslate = v + s.startTranslate;
        let S = !0,
            x = r.resistanceRatio;
        if (r.touchReleaseOnEdges && (x = 0), v > 0 ? (w && !b && s.currentTranslate > (r.centeredSlides ? i.minTranslate() - i.size / 2 : i.minTranslate()) && i.loopFix({
                direction: "prev",
                setTranslate: !0,
                activeSlideIndex: 0
            }), s.currentTranslate > i.minTranslate() && (S = !1, r.resistance && (s.currentTranslate = i.minTranslate() - 1 + (-i.minTranslate() + s.startTranslate + v) ** x))) : v < 0 && (w && !b && s.currentTranslate < (r.centeredSlides ? i.maxTranslate() + i.size / 2 : i.maxTranslate()) && i.loopFix({
                direction: "next",
                setTranslate: !0,
                activeSlideIndex: i.slides.length - ("auto" === r.slidesPerView ? i.slidesPerViewDynamic() : Math.ceil(parseFloat(r.slidesPerView, 10)))
            }), s.currentTranslate < i.maxTranslate() && (S = !1, r.resistance && (s.currentTranslate = i.maxTranslate() + 1 - (i.maxTranslate() - s.startTranslate - v) ** x))), S && (l.preventedByNestedSwiper = !0), !i.allowSlideNext && "next" === i.swipeDirection && s.currentTranslate < s.startTranslate && (s.currentTranslate = s.startTranslate), !i.allowSlidePrev && "prev" === i.swipeDirection && s.currentTranslate > s.startTranslate && (s.currentTranslate = s.startTranslate), i.allowSlidePrev || i.allowSlideNext || (s.currentTranslate = s.startTranslate), r.threshold > 0) {
            if (!(Math.abs(v) > r.threshold || s.allowThresholdMove)) return void(s.currentTranslate = s.startTranslate);
            if (!s.allowThresholdMove) return s.allowThresholdMove = !0, n.startX = n.currentX, n.startY = n.currentY, s.currentTranslate = s.startTranslate, void(n.diff = i.isHorizontal() ? n.currentX - n.startX : n.currentY - n.startY)
        }
        r.followFinger && !r.cssMode && ((r.freeMode && r.freeMode.enabled && i.freeMode || r.watchSlidesProgress) && (i.updateActiveIndex(), i.updateSlidesClasses()), r.freeMode && r.freeMode.enabled && i.freeMode && i.freeMode.onTouchMove(), i.updateProgress(s.currentTranslate), i.setTranslate(s.currentTranslate))
    }

    function z(e) {
        const t = this,
            i = t.touchEventsData,
            s = i.evCache.findIndex((t => t.pointerId === e.pointerId));
        if (s >= 0 && i.evCache.splice(s, 1), ["pointercancel", "pointerout", "pointerleave"].includes(e.type) && ("pointercancel" !== e.type || !t.browser.isSafari && !t.browser.isWebView)) return;
        const {
            params: r,
            touches: n,
            rtlTranslate: a,
            slidesGrid: o,
            enabled: l
        } = t;
        if (!l) return;
        if (!r.simulateTouch && "mouse" === e.pointerType) return;
        let d = e;
        if (d.originalEvent && (d = d.originalEvent), i.allowTouchCallbacks && t.emit("touchEnd", d), i.allowTouchCallbacks = !1, !i.isTouched) return i.isMoved && r.grabCursor && t.setGrabCursor(!1), i.isMoved = !1, void(i.startMoving = !1);
        r.grabCursor && i.isMoved && i.isTouched && (!0 === t.allowSlideNext || !0 === t.allowSlidePrev) && t.setGrabCursor(!1);
        const c = h(),
            u = c - i.touchStartTime;
        if (t.allowClick) {
            const e = d.path || d.composedPath && d.composedPath();
            t.updateClickedSlide(e && e[0] || d.target), t.emit("tap click", d), u < 300 && c - i.lastClickTime < 300 && t.emit("doubleTap doubleClick", d)
        }
        if (i.lastClickTime = h(), p((() => {
                t.destroyed || (t.allowClick = !0)
            })), !i.isTouched || !i.isMoved || !t.swipeDirection || 0 === n.diff || i.currentTranslate === i.startTranslate) return i.isTouched = !1, i.isMoved = !1, void(i.startMoving = !1);
        let f;
        if (i.isTouched = !1, i.isMoved = !1, i.startMoving = !1, f = r.followFinger ? a ? t.translate : -t.translate : -i.currentTranslate, r.cssMode) return;
        if (r.freeMode && r.freeMode.enabled) return void t.freeMode.onTouchEnd({
            currentPos: f
        });
        let m = 0,
            g = t.slidesSizesGrid[0];
        for (let e = 0; e < o.length; e += e < r.slidesPerGroupSkip ? 1 : r.slidesPerGroup) {
            const t = e < r.slidesPerGroupSkip - 1 ? 1 : r.slidesPerGroup;
            void 0 !== o[e + t] ? f >= o[e] && f < o[e + t] && (m = e, g = o[e + t] - o[e]) : f >= o[e] && (m = e, g = o[o.length - 1] - o[o.length - 2])
        }
        let v = null,
            y = null;
        r.rewind && (t.isBeginning ? y = r.virtual && r.virtual.enabled && t.virtual ? t.virtual.slides.length - 1 : t.slides.length - 1 : t.isEnd && (v = 0));
        const _ = (f - o[m]) / g,
            w = m < r.slidesPerGroupSkip - 1 ? 1 : r.slidesPerGroup;
        if (u > r.longSwipesMs) {
            if (!r.longSwipes) return void t.slideTo(t.activeIndex);
            "next" === t.swipeDirection && (_ >= r.longSwipesRatio ? t.slideTo(r.rewind && t.isEnd ? v : m + w) : t.slideTo(m)), "prev" === t.swipeDirection && (_ > 1 - r.longSwipesRatio ? t.slideTo(m + w) : null !== y && _ < 0 && Math.abs(_) > r.longSwipesRatio ? t.slideTo(y) : t.slideTo(m))
        } else {
            if (!r.shortSwipes) return void t.slideTo(t.activeIndex);
            !t.navigation || d.target !== t.navigation.nextEl && d.target !== t.navigation.prevEl ? ("next" === t.swipeDirection && t.slideTo(null !== v ? v : m + w), "prev" === t.swipeDirection && t.slideTo(null !== y ? y : m)) : d.target === t.navigation.nextEl ? t.slideTo(m + w) : t.slideTo(m)
        }
    }

    function q() {
        const e = this,
            {
                params: t,
                el: i
            } = e;
        if (i && 0 === i.offsetWidth) return;
        t.breakpoints && e.setBreakpoint();
        const {
            allowSlideNext: s,
            allowSlidePrev: r,
            snapGrid: n
        } = e, a = e.virtual && e.params.virtual.enabled;
        e.allowSlideNext = !0, e.allowSlidePrev = !0, e.updateSize(), e.updateSlides(), e.updateSlidesClasses();
        const o = a && t.loop;
        !("auto" === t.slidesPerView || t.slidesPerView > 1) || !e.isEnd || e.isBeginning || e.params.centeredSlides || o ? e.params.loop && !a ? e.slideToLoop(e.realIndex, 0, !1, !0) : e.slideTo(e.activeIndex, 0, !1, !0) : e.slideTo(e.slides.length - 1, 0, !1, !0), e.autoplay && e.autoplay.running && e.autoplay.paused && (clearTimeout(e.autoplay.resizeTimeout), e.autoplay.resizeTimeout = setTimeout((() => {
            e.autoplay && e.autoplay.running && e.autoplay.paused && e.autoplay.resume()
        }), 500)), e.allowSlidePrev = r, e.allowSlideNext = s, e.params.watchOverflow && n !== e.snapGrid && e.checkOverflow()
    }

    function B(e) {
        const t = this;
        t.enabled && (t.allowClick || (t.params.preventClicks && e.preventDefault(), t.params.preventClicksPropagation && t.animating && (e.stopPropagation(), e.stopImmediatePropagation())))
    }

    function R() {
        const e = this,
            {
                wrapperEl: t,
                rtlTranslate: i,
                enabled: s
            } = e;
        if (!s) return;
        let r;
        e.previousTranslate = e.translate, e.isHorizontal() ? e.translate = -t.scrollLeft : e.translate = -t.scrollTop, 0 === e.translate && (e.translate = 0), e.updateActiveIndex(), e.updateSlidesClasses();
        const n = e.maxTranslate() - e.minTranslate();
        r = 0 === n ? 0 : (e.translate - e.minTranslate()) / n, r !== e.progress && e.updateProgress(i ? -e.translate : e.translate), e.emit("setTranslate", e.translate, !1)
    }

    function F(e) {
        const t = this;
        M(t, e.target), t.params.cssMode || "auto" !== t.params.slidesPerView && !t.params.autoHeight || t.update()
    }
    let G = !1;

    function $() {}
    const N = (e, t) => {
            const i = d(),
                {
                    params: s,
                    el: r,
                    wrapperEl: n,
                    device: a
                } = e,
                o = !!s.nested,
                l = "on" === t ? "addEventListener" : "removeEventListener",
                c = t;
            r[l]("pointerdown", e.onTouchStart, {
                passive: !1
            }), i[l]("pointermove", e.onTouchMove, {
                passive: !1,
                capture: o
            }), i[l]("pointerup", e.onTouchEnd, {
                passive: !0
            }), i[l]("pointercancel", e.onTouchEnd, {
                passive: !0
            }), i[l]("pointerout", e.onTouchEnd, {
                passive: !0
            }), i[l]("pointerleave", e.onTouchEnd, {
                passive: !0
            }), (s.preventClicks || s.preventClicksPropagation) && r[l]("click", e.onClick, !0), s.cssMode && n[l]("scroll", e.onScroll), s.updateOnWindowResize ? e[c](a.ios || a.android ? "resize orientationchange observerUpdate" : "resize observerUpdate", q, !0) : e[c]("observerUpdate", q, !0), r[l]("load", e.onLoad, {
                capture: !0
            })
        },
        V = (e, t) => e.grid && t.grid && t.grid.rows > 1,
        H = {
            init: !0,
            direction: "horizontal",
            oneWayMovement: !1,
            touchEventsTarget: "wrapper",
            initialSlide: 0,
            speed: 300,
            cssMode: !1,
            updateOnWindowResize: !0,
            resizeObserver: !0,
            nested: !1,
            createElements: !1,
            enabled: !0,
            focusableElements: "input, select, option, textarea, button, video, label",
            width: null,
            height: null,
            preventInteractionOnTransition: !1,
            userAgent: null,
            url: null,
            edgeSwipeDetection: !1,
            edgeSwipeThreshold: 20,
            autoHeight: !1,
            setWrapperSize: !1,
            virtualTranslate: !1,
            effect: "slide",
            breakpoints: void 0,
            breakpointsBase: "window",
            spaceBetween: 0,
            slidesPerView: 1,
            slidesPerGroup: 1,
            slidesPerGroupSkip: 0,
            slidesPerGroupAuto: !1,
            centeredSlides: !1,
            centeredSlidesBounds: !1,
            slidesOffsetBefore: 0,
            slidesOffsetAfter: 0,
            normalizeSlideIndex: !0,
            centerInsufficientSlides: !1,
            watchOverflow: !0,
            roundLengths: !1,
            touchRatio: 1,
            touchAngle: 45,
            simulateTouch: !0,
            shortSwipes: !0,
            longSwipes: !0,
            longSwipesRatio: .5,
            longSwipesMs: 300,
            followFinger: !0,
            allowTouchMove: !0,
            threshold: 5,
            touchMoveStopPropagation: !1,
            touchStartPreventDefault: !0,
            touchStartForcePreventDefault: !1,
            touchReleaseOnEdges: !1,
            uniqueNavElements: !0,
            resistance: !0,
            resistanceRatio: .85,
            watchSlidesProgress: !1,
            grabCursor: !1,
            preventClicks: !0,
            preventClicksPropagation: !0,
            slideToClickedSlide: !1,
            loop: !1,
            loopedSlides: null,
            loopPreventsSliding: !0,
            rewind: !1,
            allowSlidePrev: !0,
            allowSlideNext: !0,
            swipeHandler: null,
            noSwiping: !0,
            noSwipingClass: "swiper-no-swiping",
            noSwipingSelector: null,
            passiveListeners: !0,
            maxBackfaceHiddenSlides: 10,
            containerModifierClass: "swiper-",
            slideClass: "swiper-slide",
            slideActiveClass: "swiper-slide-active",
            slideVisibleClass: "swiper-slide-visible",
            slideNextClass: "swiper-slide-next",
            slidePrevClass: "swiper-slide-prev",
            wrapperClass: "swiper-wrapper",
            lazyPreloaderClass: "swiper-lazy-preloader",
            lazyPreloadPrevNext: 0,
            runCallbacksOnInit: !0,
            _emitClasses: !1
        };

    function W(e, t) {
        return function(i = {}) {
            const s = Object.keys(i)[0],
                r = i[s];
            "object" == typeof r && null !== r ? (["navigation", "pagination", "scrollbar"].indexOf(s) >= 0 && !0 === e[s] && (e[s] = {
                auto: !0
            }), s in e && "enabled" in r ? (!0 === e[s] && (e[s] = {
                enabled: !0
            }), "object" != typeof e[s] || "enabled" in e[s] || (e[s].enabled = !0), e[s] || (e[s] = {
                enabled: !1
            }), m(t, i)) : m(t, i)) : m(t, i)
        }
    }
    const j = {
            eventsEmitter: L,
            update: {
                updateSize: function() {
                    const e = this;
                    let t, i;
                    const s = e.el;
                    t = void 0 !== e.params.width && null !== e.params.width ? e.params.width : s.clientWidth, i = void 0 !== e.params.height && null !== e.params.height ? e.params.height : s.clientHeight, 0 === t && e.isHorizontal() || 0 === i && e.isVertical() || (t = t - parseInt(w(s, "padding-left") || 0, 10) - parseInt(w(s, "padding-right") || 0, 10), i = i - parseInt(w(s, "padding-top") || 0, 10) - parseInt(w(s, "padding-bottom") || 0, 10), Number.isNaN(t) && (t = 0), Number.isNaN(i) && (i = 0), Object.assign(e, {
                        width: t,
                        height: i,
                        size: e.isHorizontal() ? t : i
                    }))
                },
                updateSlides: function() {
                    const e = this;

                    function t(t) {
                        return e.isHorizontal() ? t : {
                            width: "height",
                            "margin-top": "margin-left",
                            "margin-bottom ": "margin-right",
                            "margin-left": "margin-top",
                            "margin-right": "margin-bottom",
                            "padding-left": "padding-top",
                            "padding-right": "padding-bottom",
                            marginRight: "marginBottom"
                        }[t]
                    }

                    function i(e, i) {
                        return parseFloat(e.getPropertyValue(t(i)) || 0)
                    }
                    const s = e.params,
                        {
                            wrapperEl: r,
                            slidesEl: n,
                            size: a,
                            rtlTranslate: o,
                            wrongRTL: l
                        } = e,
                        d = e.virtual && s.virtual.enabled,
                        c = d ? e.virtual.slides.length : e.slides.length,
                        u = y(n, `.${e.params.slideClass}, swiper-slide`),
                        p = d ? e.virtual.slides.length : u.length;
                    let h = [];
                    const f = [],
                        m = [];
                    let v = s.slidesOffsetBefore;
                    "function" == typeof v && (v = s.slidesOffsetBefore.call(e));
                    let _ = s.slidesOffsetAfter;
                    "function" == typeof _ && (_ = s.slidesOffsetAfter.call(e));
                    const b = e.snapGrid.length,
                        S = e.slidesGrid.length;
                    let T = s.spaceBetween,
                        E = -v,
                        A = 0,
                        C = 0;
                    if (void 0 === a) return;
                    "string" == typeof T && T.indexOf("%") >= 0 ? T = parseFloat(T.replace("%", "")) / 100 * a : "string" == typeof T && (T = parseFloat(T)), e.virtualSize = -T, u.forEach((e => {
                        o ? e.style.marginLeft = "" : e.style.marginRight = "", e.style.marginBottom = "", e.style.marginTop = ""
                    })), s.centeredSlides && s.cssMode && (g(r, "--swiper-centered-offset-before", ""), g(r, "--swiper-centered-offset-after", ""));
                    const L = s.grid && s.grid.rows > 1 && e.grid;
                    let M;
                    L && e.grid.initSlides(p);
                    const k = "auto" === s.slidesPerView && s.breakpoints && Object.keys(s.breakpoints).filter((e => void 0 !== s.breakpoints[e].slidesPerView)).length > 0;
                    for (let r = 0; r < p; r += 1) {
                        let n;
                        if (M = 0, u[r] && (n = u[r]), L && e.grid.updateSlide(r, n, p, t), !u[r] || "none" !== w(n, "display")) {
                            if ("auto" === s.slidesPerView) {
                                k && (u[r].style[t("width")] = "");
                                const a = getComputedStyle(n),
                                    o = n.style.transform,
                                    l = n.style.webkitTransform;
                                if (o && (n.style.transform = "none"), l && (n.style.webkitTransform = "none"), s.roundLengths) M = e.isHorizontal() ? x(n, "width", !0) : x(n, "height", !0);
                                else {
                                    const e = i(a, "width"),
                                        t = i(a, "padding-left"),
                                        s = i(a, "padding-right"),
                                        r = i(a, "margin-left"),
                                        o = i(a, "margin-right"),
                                        l = a.getPropertyValue("box-sizing");
                                    if (l && "border-box" === l) M = e + r + o;
                                    else {
                                        const {
                                            clientWidth: i,
                                            offsetWidth: a
                                        } = n;
                                        M = e + t + s + r + o + (a - i)
                                    }
                                }
                                o && (n.style.transform = o), l && (n.style.webkitTransform = l), s.roundLengths && (M = Math.floor(M))
                            } else M = (a - (s.slidesPerView - 1) * T) / s.slidesPerView, s.roundLengths && (M = Math.floor(M)), u[r] && (u[r].style[t("width")] = `${M}px`);
                            u[r] && (u[r].swiperSlideSize = M), m.push(M), s.centeredSlides ? (E = E + M / 2 + A / 2 + T, 0 === A && 0 !== r && (E = E - a / 2 - T), 0 === r && (E = E - a / 2 - T), Math.abs(E) < .001 && (E = 0), s.roundLengths && (E = Math.floor(E)), C % s.slidesPerGroup == 0 && h.push(E), f.push(E)) : (s.roundLengths && (E = Math.floor(E)), (C - Math.min(e.params.slidesPerGroupSkip, C)) % e.params.slidesPerGroup == 0 && h.push(E), f.push(E), E = E + M + T), e.virtualSize += M + T, A = M, C += 1
                        }
                    }
                    if (e.virtualSize = Math.max(e.virtualSize, a) + _, o && l && ("slide" === s.effect || "coverflow" === s.effect) && (r.style.width = `${e.virtualSize+T}px`), s.setWrapperSize && (r.style[t("width")] = `${e.virtualSize+T}px`), L && e.grid.updateWrapperSize(M, h, t), !s.centeredSlides) {
                        const t = [];
                        for (let i = 0; i < h.length; i += 1) {
                            let r = h[i];
                            s.roundLengths && (r = Math.floor(r)), h[i] <= e.virtualSize - a && t.push(r)
                        }
                        h = t, Math.floor(e.virtualSize - a) - Math.floor(h[h.length - 1]) > 1 && h.push(e.virtualSize - a)
                    }
                    if (d && s.loop) {
                        const t = m[0] + T;
                        if (s.slidesPerGroup > 1) {
                            const i = Math.ceil((e.virtual.slidesBefore + e.virtual.slidesAfter) / s.slidesPerGroup),
                                r = t * s.slidesPerGroup;
                            for (let e = 0; e < i; e += 1) h.push(h[h.length - 1] + r)
                        }
                        for (let i = 0; i < e.virtual.slidesBefore + e.virtual.slidesAfter; i += 1) 1 === s.slidesPerGroup && h.push(h[h.length - 1] + t), f.push(f[f.length - 1] + t), e.virtualSize += t
                    }
                    if (0 === h.length && (h = [0]), 0 !== T) {
                        const i = e.isHorizontal() && o ? "marginLeft" : t("marginRight");
                        u.filter(((e, t) => !(s.cssMode && !s.loop) || t !== u.length - 1)).forEach((e => {
                            e.style[i] = `${T}px`
                        }))
                    }
                    if (s.centeredSlides && s.centeredSlidesBounds) {
                        let e = 0;
                        m.forEach((t => {
                            e += t + (T || 0)
                        })), e -= T;
                        const t = e - a;
                        h = h.map((e => e <= 0 ? -v : e > t ? t + _ : e))
                    }
                    if (s.centerInsufficientSlides) {
                        let e = 0;
                        if (m.forEach((t => {
                                e += t + (T || 0)
                            })), e -= T, e < a) {
                            const t = (a - e) / 2;
                            h.forEach(((e, i) => {
                                h[i] = e - t
                            })), f.forEach(((e, i) => {
                                f[i] = e + t
                            }))
                        }
                    }
                    if (Object.assign(e, {
                            slides: u,
                            snapGrid: h,
                            slidesGrid: f,
                            slidesSizesGrid: m
                        }), s.centeredSlides && s.cssMode && !s.centeredSlidesBounds) {
                        g(r, "--swiper-centered-offset-before", -h[0] + "px"), g(r, "--swiper-centered-offset-after", e.size / 2 - m[m.length - 1] / 2 + "px");
                        const t = -e.snapGrid[0],
                            i = -e.slidesGrid[0];
                        e.snapGrid = e.snapGrid.map((e => e + t)), e.slidesGrid = e.slidesGrid.map((e => e + i))
                    }
                    if (p !== c && e.emit("slidesLengthChange"), h.length !== b && (e.params.watchOverflow && e.checkOverflow(), e.emit("snapGridLengthChange")), f.length !== S && e.emit("slidesGridLengthChange"), s.watchSlidesProgress && e.updateSlidesOffset(), !(d || s.cssMode || "slide" !== s.effect && "fade" !== s.effect)) {
                        const t = `${s.containerModifierClass}backface-hidden`,
                            i = e.el.classList.contains(t);
                        p <= s.maxBackfaceHiddenSlides ? i || e.el.classList.add(t) : i && e.el.classList.remove(t)
                    }
                },
                updateAutoHeight: function(e) {
                    const t = this,
                        i = [],
                        s = t.virtual && t.params.virtual.enabled;
                    let r, n = 0;
                    "number" == typeof e ? t.setTransition(e) : !0 === e && t.setTransition(t.params.speed);
                    const a = e => s ? t.slides[t.getSlideIndexByData(e)] : t.slides[e];
                    if ("auto" !== t.params.slidesPerView && t.params.slidesPerView > 1)
                        if (t.params.centeredSlides)(t.visibleSlides || []).forEach((e => {
                            i.push(e)
                        }));
                        else
                            for (r = 0; r < Math.ceil(t.params.slidesPerView); r += 1) {
                                const e = t.activeIndex + r;
                                if (e > t.slides.length && !s) break;
                                i.push(a(e))
                            } else i.push(a(t.activeIndex));
                    for (r = 0; r < i.length; r += 1)
                        if (void 0 !== i[r]) {
                            const e = i[r].offsetHeight;
                            n = e > n ? e : n
                        }(n || 0 === n) && (t.wrapperEl.style.height = `${n}px`)
                },
                updateSlidesOffset: function() {
                    const e = this,
                        t = e.slides,
                        i = e.isElement ? e.isHorizontal() ? e.wrapperEl.offsetLeft : e.wrapperEl.offsetTop : 0;
                    for (let s = 0; s < t.length; s += 1) t[s].swiperSlideOffset = (e.isHorizontal() ? t[s].offsetLeft : t[s].offsetTop) - i - e.cssOverflowAdjustment()
                },
                updateSlidesProgress: function(e = this && this.translate || 0) {
                    const t = this,
                        i = t.params,
                        {
                            slides: s,
                            rtlTranslate: r,
                            snapGrid: n
                        } = t;
                    if (0 === s.length) return;
                    void 0 === s[0].swiperSlideOffset && t.updateSlidesOffset();
                    let a = -e;
                    r && (a = e), s.forEach((e => {
                        e.classList.remove(i.slideVisibleClass)
                    })), t.visibleSlidesIndexes = [], t.visibleSlides = [];
                    let o = i.spaceBetween;
                    "string" == typeof o && o.indexOf("%") >= 0 ? o = parseFloat(o.replace("%", "")) / 100 * t.size : "string" == typeof o && (o = parseFloat(o));
                    for (let e = 0; e < s.length; e += 1) {
                        const l = s[e];
                        let d = l.swiperSlideOffset;
                        i.cssMode && i.centeredSlides && (d -= s[0].swiperSlideOffset);
                        const c = (a + (i.centeredSlides ? t.minTranslate() : 0) - d) / (l.swiperSlideSize + o),
                            u = (a - n[0] + (i.centeredSlides ? t.minTranslate() : 0) - d) / (l.swiperSlideSize + o),
                            p = -(a - d),
                            h = p + t.slidesSizesGrid[e];
                        (p >= 0 && p < t.size - 1 || h > 1 && h <= t.size || p <= 0 && h >= t.size) && (t.visibleSlides.push(l), t.visibleSlidesIndexes.push(e), s[e].classList.add(i.slideVisibleClass)), l.progress = r ? -c : c, l.originalProgress = r ? -u : u
                    }
                },
                updateProgress: function(e) {
                    const t = this;
                    if (void 0 === e) {
                        const i = t.rtlTranslate ? -1 : 1;
                        e = t && t.translate && t.translate * i || 0
                    }
                    const i = t.params,
                        s = t.maxTranslate() - t.minTranslate();
                    let {
                        progress: r,
                        isBeginning: n,
                        isEnd: a,
                        progressLoop: o
                    } = t;
                    const l = n,
                        d = a;
                    if (0 === s) r = 0, n = !0, a = !0;
                    else {
                        r = (e - t.minTranslate()) / s;
                        const i = Math.abs(e - t.minTranslate()) < 1,
                            o = Math.abs(e - t.maxTranslate()) < 1;
                        n = i || r <= 0, a = o || r >= 1, i && (r = 0), o && (r = 1)
                    }
                    if (i.loop) {
                        const i = t.getSlideIndexByData(0),
                            s = t.getSlideIndexByData(t.slides.length - 1),
                            r = t.slidesGrid[i],
                            n = t.slidesGrid[s],
                            a = t.slidesGrid[t.slidesGrid.length - 1],
                            l = Math.abs(e);
                        o = l >= r ? (l - r) / a : (l + a - n) / a, o > 1 && (o -= 1)
                    }
                    Object.assign(t, {
                        progress: r,
                        progressLoop: o,
                        isBeginning: n,
                        isEnd: a
                    }), (i.watchSlidesProgress || i.centeredSlides && i.autoHeight) && t.updateSlidesProgress(e), n && !l && t.emit("reachBeginning toEdge"), a && !d && t.emit("reachEnd toEdge"), (l && !n || d && !a) && t.emit("fromEdge"), t.emit("progress", r)
                },
                updateSlidesClasses: function() {
                    const e = this,
                        {
                            slides: t,
                            params: i,
                            slidesEl: s,
                            activeIndex: r
                        } = e,
                        n = e.virtual && i.virtual.enabled,
                        a = e => y(s, `.${i.slideClass}${e}, swiper-slide${e}`)[0];
                    let o;
                    if (t.forEach((e => {
                            e.classList.remove(i.slideActiveClass, i.slideNextClass, i.slidePrevClass)
                        })), n)
                        if (i.loop) {
                            let t = r - e.virtual.slidesBefore;
                            t < 0 && (t = e.virtual.slides.length + t), t >= e.virtual.slides.length && (t -= e.virtual.slides.length), o = a(`[data-swiper-slide-index="${t}"]`)
                        } else o = a(`[data-swiper-slide-index="${r}"]`);
                    else o = t[r];
                    if (o) {
                        o.classList.add(i.slideActiveClass);
                        let e = function(e, t) {
                            const i = [];
                            for (; e.nextElementSibling;) {
                                const s = e.nextElementSibling;
                                t ? s.matches(t) && i.push(s) : i.push(s), e = s
                            }
                            return i
                        }(o, `.${i.slideClass}, swiper-slide`)[0];
                        i.loop && !e && (e = t[0]), e && e.classList.add(i.slideNextClass);
                        let s = function(e, t) {
                            const i = [];
                            for (; e.previousElementSibling;) {
                                const s = e.previousElementSibling;
                                t ? s.matches(t) && i.push(s) : i.push(s), e = s
                            }
                            return i
                        }(o, `.${i.slideClass}, swiper-slide`)[0];
                        i.loop && 0 === !s && (s = t[t.length - 1]), s && s.classList.add(i.slidePrevClass)
                    }
                    e.emitSlidesClasses()
                },
                updateActiveIndex: function(e) {
                    const t = this,
                        i = t.rtlTranslate ? t.translate : -t.translate,
                        {
                            snapGrid: s,
                            params: r,
                            activeIndex: n,
                            realIndex: a,
                            snapIndex: o
                        } = t;
                    let l, d = e;
                    const c = e => {
                        let i = e - t.virtual.slidesBefore;
                        return i < 0 && (i = t.virtual.slides.length + i), i >= t.virtual.slides.length && (i -= t.virtual.slides.length), i
                    };
                    if (void 0 === d && (d = function(e) {
                            const {
                                slidesGrid: t,
                                params: i
                            } = e, s = e.rtlTranslate ? e.translate : -e.translate;
                            let r;
                            for (let e = 0; e < t.length; e += 1) void 0 !== t[e + 1] ? s >= t[e] && s < t[e + 1] - (t[e + 1] - t[e]) / 2 ? r = e : s >= t[e] && s < t[e + 1] && (r = e + 1) : s >= t[e] && (r = e);
                            return i.normalizeSlideIndex && (r < 0 || void 0 === r) && (r = 0), r
                        }(t)), s.indexOf(i) >= 0) l = s.indexOf(i);
                    else {
                        const e = Math.min(r.slidesPerGroupSkip, d);
                        l = e + Math.floor((d - e) / r.slidesPerGroup)
                    }
                    if (l >= s.length && (l = s.length - 1), d === n) return l !== o && (t.snapIndex = l, t.emit("snapIndexChange")), void(t.params.loop && t.virtual && t.params.virtual.enabled && (t.realIndex = c(d)));
                    let u;
                    u = t.virtual && r.virtual.enabled && r.loop ? c(d) : t.slides[d] ? parseInt(t.slides[d].getAttribute("data-swiper-slide-index") || d, 10) : d, Object.assign(t, {
                        previousSnapIndex: o,
                        snapIndex: l,
                        previousRealIndex: a,
                        realIndex: u,
                        previousIndex: n,
                        activeIndex: d
                    }), t.initialized && P(t), t.emit("activeIndexChange"), t.emit("snapIndexChange"), a !== u && t.emit("realIndexChange"), (t.initialized || t.params.runCallbacksOnInit) && t.emit("slideChange")
                },
                updateClickedSlide: function(e) {
                    const t = this,
                        i = t.params,
                        s = e.closest(`.${i.slideClass}, swiper-slide`);
                    let r, n = !1;
                    if (s)
                        for (let e = 0; e < t.slides.length; e += 1)
                            if (t.slides[e] === s) {
                                n = !0, r = e;
                                break
                            }
                    if (!s || !n) return t.clickedSlide = void 0, void(t.clickedIndex = void 0);
                    t.clickedSlide = s, t.virtual && t.params.virtual.enabled ? t.clickedIndex = parseInt(s.getAttribute("data-swiper-slide-index"), 10) : t.clickedIndex = r, i.slideToClickedSlide && void 0 !== t.clickedIndex && t.clickedIndex !== t.activeIndex && t.slideToClickedSlide()
                }
            },
            translate: {
                getTranslate: function(e = (this.isHorizontal() ? "x" : "y")) {
                    const {
                        params: t,
                        rtlTranslate: i,
                        translate: s,
                        wrapperEl: r
                    } = this;
                    if (t.virtualTranslate) return i ? -s : s;
                    if (t.cssMode) return s;
                    let n = function(e, t = "x") {
                        const i = u();
                        let s, r, n;
                        const a = function(e) {
                            const t = u();
                            let i;
                            return t.getComputedStyle && (i = t.getComputedStyle(e, null)), !i && e.currentStyle && (i = e.currentStyle), i || (i = e.style), i
                        }(e);
                        return i.WebKitCSSMatrix ? (r = a.transform || a.webkitTransform, r.split(",").length > 6 && (r = r.split(", ").map((e => e.replace(",", "."))).join(", ")), n = new i.WebKitCSSMatrix("none" === r ? "" : r)) : (n = a.MozTransform || a.OTransform || a.MsTransform || a.msTransform || a.transform || a.getPropertyValue("transform").replace("translate(", "matrix(1, 0, 0, 1,"), s = n.toString().split(",")), "x" === t && (r = i.WebKitCSSMatrix ? n.m41 : 16 === s.length ? parseFloat(s[12]) : parseFloat(s[4])), "y" === t && (r = i.WebKitCSSMatrix ? n.m42 : 16 === s.length ? parseFloat(s[13]) : parseFloat(s[5])), r || 0
                    }(r, e);
                    return n += this.cssOverflowAdjustment(), i && (n = -n), n || 0
                },
                setTranslate: function(e, t) {
                    const i = this,
                        {
                            rtlTranslate: s,
                            params: r,
                            wrapperEl: n,
                            progress: a
                        } = i;
                    let o, l = 0,
                        d = 0;
                    i.isHorizontal() ? l = s ? -e : e : d = e, r.roundLengths && (l = Math.floor(l), d = Math.floor(d)), i.previousTranslate = i.translate, i.translate = i.isHorizontal() ? l : d, r.cssMode ? n[i.isHorizontal() ? "scrollLeft" : "scrollTop"] = i.isHorizontal() ? -l : -d : r.virtualTranslate || (i.isHorizontal() ? l -= i.cssOverflowAdjustment() : d -= i.cssOverflowAdjustment(), n.style.transform = `translate3d(${l}px, ${d}px, 0px)`);
                    const c = i.maxTranslate() - i.minTranslate();
                    o = 0 === c ? 0 : (e - i.minTranslate()) / c, o !== a && i.updateProgress(e), i.emit("setTranslate", i.translate, t)
                },
                minTranslate: function() {
                    return -this.snapGrid[0]
                },
                maxTranslate: function() {
                    return -this.snapGrid[this.snapGrid.length - 1]
                },
                translateTo: function(e = 0, t = this.params.speed, i = !0, s = !0, r) {
                    const n = this,
                        {
                            params: a,
                            wrapperEl: o
                        } = n;
                    if (n.animating && a.preventInteractionOnTransition) return !1;
                    const l = n.minTranslate(),
                        d = n.maxTranslate();
                    let c;
                    if (c = s && e > l ? l : s && e < d ? d : e, n.updateProgress(c), a.cssMode) {
                        const e = n.isHorizontal();
                        if (0 === t) o[e ? "scrollLeft" : "scrollTop"] = -c;
                        else {
                            if (!n.support.smoothScroll) return v({
                                swiper: n,
                                targetPosition: -c,
                                side: e ? "left" : "top"
                            }), !0;
                            o.scrollTo({
                                [e ? "left" : "top"]: -c,
                                behavior: "smooth"
                            })
                        }
                        return !0
                    }
                    return 0 === t ? (n.setTransition(0), n.setTranslate(c), i && (n.emit("beforeTransitionStart", t, r), n.emit("transitionEnd"))) : (n.setTransition(t), n.setTranslate(c), i && (n.emit("beforeTransitionStart", t, r), n.emit("transitionStart")), n.animating || (n.animating = !0, n.onTranslateToWrapperTransitionEnd || (n.onTranslateToWrapperTransitionEnd = function(e) {
                        n && !n.destroyed && e.target === this && (n.wrapperEl.removeEventListener("transitionend", n.onTranslateToWrapperTransitionEnd), n.onTranslateToWrapperTransitionEnd = null, delete n.onTranslateToWrapperTransitionEnd, i && n.emit("transitionEnd"))
                    }), n.wrapperEl.addEventListener("transitionend", n.onTranslateToWrapperTransitionEnd))), !0
                }
            },
            transition: {
                setTransition: function(e, t) {
                    const i = this;
                    i.params.cssMode || (i.wrapperEl.style.transitionDuration = `${e}ms`), i.emit("setTransition", e, t)
                },
                transitionStart: function(e = !0, t) {
                    const i = this,
                        {
                            params: s
                        } = i;
                    s.cssMode || (s.autoHeight && i.updateAutoHeight(), O({
                        swiper: i,
                        runCallbacks: e,
                        direction: t,
                        step: "Start"
                    }))
                },
                transitionEnd: function(e = !0, t) {
                    const i = this,
                        {
                            params: s
                        } = i;
                    i.animating = !1, s.cssMode || (i.setTransition(0), O({
                        swiper: i,
                        runCallbacks: e,
                        direction: t,
                        step: "End"
                    }))
                }
            },
            slide: {
                slideTo: function(e = 0, t = this.params.speed, i = !0, s, r) {
                    "string" == typeof e && (e = parseInt(e, 10));
                    const n = this;
                    let a = e;
                    a < 0 && (a = 0);
                    const {
                        params: o,
                        snapGrid: l,
                        slidesGrid: d,
                        previousIndex: c,
                        activeIndex: u,
                        rtlTranslate: p,
                        wrapperEl: h,
                        enabled: f
                    } = n;
                    if (n.animating && o.preventInteractionOnTransition || !f && !s && !r) return !1;
                    const m = Math.min(n.params.slidesPerGroupSkip, a);
                    let g = m + Math.floor((a - m) / n.params.slidesPerGroup);
                    g >= l.length && (g = l.length - 1);
                    const y = -l[g];
                    if (o.normalizeSlideIndex)
                        for (let e = 0; e < d.length; e += 1) {
                            const t = -Math.floor(100 * y),
                                i = Math.floor(100 * d[e]),
                                s = Math.floor(100 * d[e + 1]);
                            void 0 !== d[e + 1] ? t >= i && t < s - (s - i) / 2 ? a = e : t >= i && t < s && (a = e + 1) : t >= i && (a = e)
                        }
                    if (n.initialized && a !== u) {
                        if (!n.allowSlideNext && (p ? y > n.translate && y > n.minTranslate() : y < n.translate && y < n.minTranslate())) return !1;
                        if (!n.allowSlidePrev && y > n.translate && y > n.maxTranslate() && (u || 0) !== a) return !1
                    }
                    let _;
                    if (a !== (c || 0) && i && n.emit("beforeSlideChangeStart"), n.updateProgress(y), _ = a > u ? "next" : a < u ? "prev" : "reset", p && -y === n.translate || !p && y === n.translate) return n.updateActiveIndex(a), o.autoHeight && n.updateAutoHeight(), n.updateSlidesClasses(), "slide" !== o.effect && n.setTranslate(y), "reset" !== _ && (n.transitionStart(i, _), n.transitionEnd(i, _)), !1;
                    if (o.cssMode) {
                        const e = n.isHorizontal(),
                            i = p ? y : -y;
                        if (0 === t) {
                            const t = n.virtual && n.params.virtual.enabled;
                            t && (n.wrapperEl.style.scrollSnapType = "none", n._immediateVirtual = !0), t && !n._cssModeVirtualInitialSet && n.params.initialSlide > 0 ? (n._cssModeVirtualInitialSet = !0, requestAnimationFrame((() => {
                                h[e ? "scrollLeft" : "scrollTop"] = i
                            }))) : h[e ? "scrollLeft" : "scrollTop"] = i, t && requestAnimationFrame((() => {
                                n.wrapperEl.style.scrollSnapType = "", n._immediateVirtual = !1
                            }))
                        } else {
                            if (!n.support.smoothScroll) return v({
                                swiper: n,
                                targetPosition: i,
                                side: e ? "left" : "top"
                            }), !0;
                            h.scrollTo({
                                [e ? "left" : "top"]: i,
                                behavior: "smooth"
                            })
                        }
                        return !0
                    }
                    return n.setTransition(t), n.setTranslate(y), n.updateActiveIndex(a), n.updateSlidesClasses(), n.emit("beforeTransitionStart", t, s), n.transitionStart(i, _), 0 === t ? n.transitionEnd(i, _) : n.animating || (n.animating = !0, n.onSlideToWrapperTransitionEnd || (n.onSlideToWrapperTransitionEnd = function(e) {
                        n && !n.destroyed && e.target === this && (n.wrapperEl.removeEventListener("transitionend", n.onSlideToWrapperTransitionEnd), n.onSlideToWrapperTransitionEnd = null, delete n.onSlideToWrapperTransitionEnd, n.transitionEnd(i, _))
                    }), n.wrapperEl.addEventListener("transitionend", n.onSlideToWrapperTransitionEnd)), !0
                },
                slideToLoop: function(e = 0, t = this.params.speed, i = !0, s) {
                    "string" == typeof e && (e = parseInt(e, 10));
                    const r = this;
                    let n = e;
                    return r.params.loop && (r.virtual && r.params.virtual.enabled ? n += r.virtual.slidesBefore : n = r.getSlideIndexByData(n)), r.slideTo(n, t, i, s)
                },
                slideNext: function(e = this.params.speed, t = !0, i) {
                    const s = this,
                        {
                            enabled: r,
                            params: n,
                            animating: a
                        } = s;
                    if (!r) return s;
                    let o = n.slidesPerGroup;
                    "auto" === n.slidesPerView && 1 === n.slidesPerGroup && n.slidesPerGroupAuto && (o = Math.max(s.slidesPerViewDynamic("current", !0), 1));
                    const l = s.activeIndex < n.slidesPerGroupSkip ? 1 : o,
                        d = s.virtual && n.virtual.enabled;
                    if (n.loop) {
                        if (a && !d && n.loopPreventsSliding) return !1;
                        s.loopFix({
                            direction: "next"
                        }), s._clientLeft = s.wrapperEl.clientLeft
                    }
                    return n.rewind && s.isEnd ? s.slideTo(0, e, t, i) : s.slideTo(s.activeIndex + l, e, t, i)
                },
                slidePrev: function(e = this.params.speed, t = !0, i) {
                    const s = this,
                        {
                            params: r,
                            snapGrid: n,
                            slidesGrid: a,
                            rtlTranslate: o,
                            enabled: l,
                            animating: d
                        } = s;
                    if (!l) return s;
                    const c = s.virtual && r.virtual.enabled;
                    if (r.loop) {
                        if (d && !c && r.loopPreventsSliding) return !1;
                        s.loopFix({
                            direction: "prev"
                        }), s._clientLeft = s.wrapperEl.clientLeft
                    }

                    function u(e) {
                        return e < 0 ? -Math.floor(Math.abs(e)) : Math.floor(e)
                    }
                    const p = u(o ? s.translate : -s.translate),
                        h = n.map((e => u(e)));
                    let f = n[h.indexOf(p) - 1];
                    if (void 0 === f && r.cssMode) {
                        let e;
                        n.forEach(((t, i) => {
                            p >= t && (e = i)
                        })), void 0 !== e && (f = n[e > 0 ? e - 1 : e])
                    }
                    let m = 0;
                    if (void 0 !== f && (m = a.indexOf(f), m < 0 && (m = s.activeIndex - 1), "auto" === r.slidesPerView && 1 === r.slidesPerGroup && r.slidesPerGroupAuto && (m = m - s.slidesPerViewDynamic("previous", !0) + 1, m = Math.max(m, 0))), r.rewind && s.isBeginning) {
                        const r = s.params.virtual && s.params.virtual.enabled && s.virtual ? s.virtual.slides.length - 1 : s.slides.length - 1;
                        return s.slideTo(r, e, t, i)
                    }
                    return s.slideTo(m, e, t, i)
                },
                slideReset: function(e = this.params.speed, t = !0, i) {
                    return this.slideTo(this.activeIndex, e, t, i)
                },
                slideToClosest: function(e = this.params.speed, t = !0, i, s = .5) {
                    const r = this;
                    let n = r.activeIndex;
                    const a = Math.min(r.params.slidesPerGroupSkip, n),
                        o = a + Math.floor((n - a) / r.params.slidesPerGroup),
                        l = r.rtlTranslate ? r.translate : -r.translate;
                    if (l >= r.snapGrid[o]) {
                        const e = r.snapGrid[o];
                        l - e > (r.snapGrid[o + 1] - e) * s && (n += r.params.slidesPerGroup)
                    } else {
                        const e = r.snapGrid[o - 1];
                        l - e <= (r.snapGrid[o] - e) * s && (n -= r.params.slidesPerGroup)
                    }
                    return n = Math.max(n, 0), n = Math.min(n, r.slidesGrid.length - 1), r.slideTo(n, e, t, i)
                },
                slideToClickedSlide: function() {
                    const e = this,
                        {
                            params: t,
                            slidesEl: i
                        } = e,
                        s = "auto" === t.slidesPerView ? e.slidesPerViewDynamic() : t.slidesPerView;
                    let r, n = e.clickedIndex;
                    const a = e.isElement ? "swiper-slide" : `.${t.slideClass}`;
                    if (t.loop) {
                        if (e.animating) return;
                        r = parseInt(e.clickedSlide.getAttribute("data-swiper-slide-index"), 10), t.centeredSlides ? n < e.loopedSlides - s / 2 || n > e.slides.length - e.loopedSlides + s / 2 ? (e.loopFix(), n = e.getSlideIndex(y(i, `${a}[data-swiper-slide-index="${r}"]`)[0]), p((() => {
                            e.slideTo(n)
                        }))) : e.slideTo(n) : n > e.slides.length - s ? (e.loopFix(), n = e.getSlideIndex(y(i, `${a}[data-swiper-slide-index="${r}"]`)[0]), p((() => {
                            e.slideTo(n)
                        }))) : e.slideTo(n)
                    } else e.slideTo(n)
                }
            },
            loop: {
                loopCreate: function(e) {
                    const t = this,
                        {
                            params: i,
                            slidesEl: s
                        } = t;
                    !i.loop || t.virtual && t.params.virtual.enabled || (y(s, `.${i.slideClass}, swiper-slide`).forEach(((e, t) => {
                        e.setAttribute("data-swiper-slide-index", t)
                    })), t.loopFix({
                        slideRealIndex: e,
                        direction: i.centeredSlides ? void 0 : "next"
                    }))
                },
                loopFix: function({
                    slideRealIndex: e,
                    slideTo: t = !0,
                    direction: i,
                    setTranslate: s,
                    activeSlideIndex: r,
                    byController: n,
                    byMousewheel: a
                } = {}) {
                    const o = this;
                    if (!o.params.loop) return;
                    o.emit("beforeLoopFix");
                    const {
                        slides: l,
                        allowSlidePrev: d,
                        allowSlideNext: c,
                        slidesEl: u,
                        params: p
                    } = o;
                    if (o.allowSlidePrev = !0, o.allowSlideNext = !0, o.virtual && p.virtual.enabled) return t && (p.centeredSlides || 0 !== o.snapIndex ? p.centeredSlides && o.snapIndex < p.slidesPerView ? o.slideTo(o.virtual.slides.length + o.snapIndex, 0, !1, !0) : o.snapIndex === o.snapGrid.length - 1 && o.slideTo(o.virtual.slidesBefore, 0, !1, !0) : o.slideTo(o.virtual.slides.length, 0, !1, !0)), o.allowSlidePrev = d, o.allowSlideNext = c, void o.emit("loopFix");
                    const h = "auto" === p.slidesPerView ? o.slidesPerViewDynamic() : Math.ceil(parseFloat(p.slidesPerView, 10));
                    let f = p.loopedSlides || h;
                    f % p.slidesPerGroup != 0 && (f += p.slidesPerGroup - f % p.slidesPerGroup), o.loopedSlides = f;
                    const m = [],
                        g = [];
                    let v = o.activeIndex;
                    void 0 === r ? r = o.getSlideIndex(o.slides.filter((e => e.classList.contains(p.slideActiveClass)))[0]) : v = r;
                    const y = "next" === i || !i,
                        _ = "prev" === i || !i;
                    let w = 0,
                        b = 0;
                    if (r < f) {
                        w = Math.max(f - r, p.slidesPerGroup);
                        for (let e = 0; e < f - r; e += 1) {
                            const t = e - Math.floor(e / l.length) * l.length;
                            m.push(l.length - t - 1)
                        }
                    } else if (r > o.slides.length - 2 * f) {
                        b = Math.max(r - (o.slides.length - 2 * f), p.slidesPerGroup);
                        for (let e = 0; e < b; e += 1) {
                            const t = e - Math.floor(e / l.length) * l.length;
                            g.push(t)
                        }
                    }
                    if (_ && m.forEach((e => {
                            o.slides[e].swiperLoopMoveDOM = !0, u.prepend(o.slides[e]), o.slides[e].swiperLoopMoveDOM = !1
                        })), y && g.forEach((e => {
                            o.slides[e].swiperLoopMoveDOM = !0, u.append(o.slides[e]), o.slides[e].swiperLoopMoveDOM = !1
                        })), o.recalcSlides(), "auto" === p.slidesPerView && o.updateSlides(), p.watchSlidesProgress && o.updateSlidesOffset(), t)
                        if (m.length > 0 && _)
                            if (void 0 === e) {
                                const e = o.slidesGrid[v],
                                    t = o.slidesGrid[v + w] - e;
                                a ? o.setTranslate(o.translate - t) : (o.slideTo(v + w, 0, !1, !0), s && (o.touches[o.isHorizontal() ? "startX" : "startY"] += t))
                            } else s && o.slideToLoop(e, 0, !1, !0);
                    else if (g.length > 0 && y)
                        if (void 0 === e) {
                            const e = o.slidesGrid[v],
                                t = o.slidesGrid[v - b] - e;
                            a ? o.setTranslate(o.translate - t) : (o.slideTo(v - b, 0, !1, !0), s && (o.touches[o.isHorizontal() ? "startX" : "startY"] += t))
                        } else o.slideToLoop(e, 0, !1, !0);
                    if (o.allowSlidePrev = d, o.allowSlideNext = c, o.controller && o.controller.control && !n) {
                        const t = {
                            slideRealIndex: e,
                            slideTo: !1,
                            direction: i,
                            setTranslate: s,
                            activeSlideIndex: r,
                            byController: !0
                        };
                        Array.isArray(o.controller.control) ? o.controller.control.forEach((e => {
                            !e.destroyed && e.params.loop && e.loopFix(t)
                        })) : o.controller.control instanceof o.constructor && o.controller.control.params.loop && o.controller.control.loopFix(t)
                    }
                    o.emit("loopFix")
                },
                loopDestroy: function() {
                    const e = this,
                        {
                            params: t,
                            slidesEl: i
                        } = e;
                    if (!t.loop || e.virtual && e.params.virtual.enabled) return;
                    e.recalcSlides();
                    const s = [];
                    e.slides.forEach((e => {
                        const t = void 0 === e.swiperSlideIndex ? 1 * e.getAttribute("data-swiper-slide-index") : e.swiperSlideIndex;
                        s[t] = e
                    })), e.slides.forEach((e => {
                        e.removeAttribute("data-swiper-slide-index")
                    })), s.forEach((e => {
                        i.append(e)
                    })), e.recalcSlides(), e.slideTo(e.realIndex, 0)
                }
            },
            grabCursor: {
                setGrabCursor: function(e) {
                    const t = this;
                    if (!t.params.simulateTouch || t.params.watchOverflow && t.isLocked || t.params.cssMode) return;
                    const i = "container" === t.params.touchEventsTarget ? t.el : t.wrapperEl;
                    t.isElement && (t.__preventObserver__ = !0), i.style.cursor = "move", i.style.cursor = e ? "grabbing" : "grab", t.isElement && requestAnimationFrame((() => {
                        t.__preventObserver__ = !1
                    }))
                },
                unsetGrabCursor: function() {
                    const e = this;
                    e.params.watchOverflow && e.isLocked || e.params.cssMode || (e.isElement && (e.__preventObserver__ = !0), e["container" === e.params.touchEventsTarget ? "el" : "wrapperEl"].style.cursor = "", e.isElement && requestAnimationFrame((() => {
                        e.__preventObserver__ = !1
                    })))
                }
            },
            events: {
                attachEvents: function() {
                    const e = this,
                        t = d(),
                        {
                            params: i
                        } = e;
                    e.onTouchStart = D.bind(e), e.onTouchMove = I.bind(e), e.onTouchEnd = z.bind(e), i.cssMode && (e.onScroll = R.bind(e)), e.onClick = B.bind(e), e.onLoad = F.bind(e), G || (t.addEventListener("touchstart", $), G = !0), N(e, "on")
                },
                detachEvents: function() {
                    N(this, "off")
                }
            },
            breakpoints: {
                setBreakpoint: function() {
                    const e = this,
                        {
                            realIndex: t,
                            initialized: i,
                            params: s,
                            el: r
                        } = e,
                        n = s.breakpoints;
                    if (!n || n && 0 === Object.keys(n).length) return;
                    const a = e.getBreakpoint(n, e.params.breakpointsBase, e.el);
                    if (!a || e.currentBreakpoint === a) return;
                    const o = (a in n ? n[a] : void 0) || e.originalParams,
                        l = V(e, s),
                        d = V(e, o),
                        c = s.enabled;
                    l && !d ? (r.classList.remove(`${s.containerModifierClass}grid`, `${s.containerModifierClass}grid-column`), e.emitContainerClasses()) : !l && d && (r.classList.add(`${s.containerModifierClass}grid`), (o.grid.fill && "column" === o.grid.fill || !o.grid.fill && "column" === s.grid.fill) && r.classList.add(`${s.containerModifierClass}grid-column`), e.emitContainerClasses()), ["navigation", "pagination", "scrollbar"].forEach((t => {
                        if (void 0 === o[t]) return;
                        const i = s[t] && s[t].enabled,
                            r = o[t] && o[t].enabled;
                        i && !r && e[t].disable(), !i && r && e[t].enable()
                    }));
                    const u = o.direction && o.direction !== s.direction,
                        p = s.loop && (o.slidesPerView !== s.slidesPerView || u);
                    u && i && e.changeDirection(), m(e.params, o);
                    const h = e.params.enabled;
                    Object.assign(e, {
                        allowTouchMove: e.params.allowTouchMove,
                        allowSlideNext: e.params.allowSlideNext,
                        allowSlidePrev: e.params.allowSlidePrev
                    }), c && !h ? e.disable() : !c && h && e.enable(), e.currentBreakpoint = a, e.emit("_beforeBreakpoint", o), p && i && (e.loopDestroy(), e.loopCreate(t), e.updateSlides()), e.emit("breakpoint", o)
                },
                getBreakpoint: function(e, t = "window", i) {
                    if (!e || "container" === t && !i) return;
                    let s = !1;
                    const r = u(),
                        n = "window" === t ? r.innerHeight : i.clientHeight,
                        a = Object.keys(e).map((e => {
                            if ("string" == typeof e && 0 === e.indexOf("@")) {
                                const t = parseFloat(e.substr(1));
                                return {
                                    value: n * t,
                                    point: e
                                }
                            }
                            return {
                                value: e,
                                point: e
                            }
                        }));
                    a.sort(((e, t) => parseInt(e.value, 10) - parseInt(t.value, 10)));
                    for (let e = 0; e < a.length; e += 1) {
                        const {
                            point: n,
                            value: o
                        } = a[e];
                        "window" === t ? r.matchMedia(`(min-width: ${o}px)`).matches && (s = n) : o <= i.clientWidth && (s = n)
                    }
                    return s || "max"
                }
            },
            checkOverflow: {
                checkOverflow: function() {
                    const e = this,
                        {
                            isLocked: t,
                            params: i
                        } = e,
                        {
                            slidesOffsetBefore: s
                        } = i;
                    if (s) {
                        const t = e.slides.length - 1,
                            i = e.slidesGrid[t] + e.slidesSizesGrid[t] + 2 * s;
                        e.isLocked = e.size > i
                    } else e.isLocked = 1 === e.snapGrid.length;
                    !0 === i.allowSlideNext && (e.allowSlideNext = !e.isLocked), !0 === i.allowSlidePrev && (e.allowSlidePrev = !e.isLocked), t && t !== e.isLocked && (e.isEnd = !1), t !== e.isLocked && e.emit(e.isLocked ? "lock" : "unlock")
                }
            },
            classes: {
                addClasses: function() {
                    const e = this,
                        {
                            classNames: t,
                            params: i,
                            rtl: s,
                            el: r,
                            device: n
                        } = e,
                        a = function(e, t) {
                            const i = [];
                            return e.forEach((e => {
                                "object" == typeof e ? Object.keys(e).forEach((s => {
                                    e[s] && i.push(t + s)
                                })) : "string" == typeof e && i.push(t + e)
                            })), i
                        }(["initialized", i.direction, {
                            "free-mode": e.params.freeMode && i.freeMode.enabled
                        }, {
                            autoheight: i.autoHeight
                        }, {
                            rtl: s
                        }, {
                            grid: i.grid && i.grid.rows > 1
                        }, {
                            "grid-column": i.grid && i.grid.rows > 1 && "column" === i.grid.fill
                        }, {
                            android: n.android
                        }, {
                            ios: n.ios
                        }, {
                            "css-mode": i.cssMode
                        }, {
                            centered: i.cssMode && i.centeredSlides
                        }, {
                            "watch-progress": i.watchSlidesProgress
                        }], i.containerModifierClass);
                    t.push(...a), r.classList.add(...t), e.emitContainerClasses()
                },
                removeClasses: function() {
                    const {
                        el: e,
                        classNames: t
                    } = this;
                    e.classList.remove(...t), this.emitContainerClasses()
                }
            }
        },
        Y = {};
    class X {
        constructor(...e) {
            let t, i;
            1 === e.length && e[0].constructor && "Object" === Object.prototype.toString.call(e[0]).slice(8, -1) ? i = e[0] : [t, i] = e, i || (i = {}), i = m({}, i), t && !i.el && (i.el = t);
            const s = d();
            if (i.el && "string" == typeof i.el && s.querySelectorAll(i.el).length > 1) {
                const e = [];
                return s.querySelectorAll(i.el).forEach((t => {
                    const s = m({}, i, {
                        el: t
                    });
                    e.push(new X(s))
                })), e
            }
            const r = this;
            r.__swiper__ = !0, r.support = C(), r.device = function(e = {}) {
                return E || (E = function({
                    userAgent: e
                } = {}) {
                    const t = C(),
                        i = u(),
                        s = i.navigator.platform,
                        r = e || i.navigator.userAgent,
                        n = {
                            ios: !1,
                            android: !1
                        },
                        a = i.screen.width,
                        o = i.screen.height,
                        l = r.match(/(Android);?[\s\/]+([\d.]+)?/);
                    let d = r.match(/(iPad).*OS\s([\d_]+)/);
                    const c = r.match(/(iPod)(.*OS\s([\d_]+))?/),
                        p = !d && r.match(/(iPhone\sOS|iOS)\s([\d_]+)/),
                        h = "Win32" === s;
                    let f = "MacIntel" === s;
                    return !d && f && t.touch && ["1024x1366", "1366x1024", "834x1194", "1194x834", "834x1112", "1112x834", "768x1024", "1024x768", "820x1180", "1180x820", "810x1080", "1080x810"].indexOf(`${a}x${o}`) >= 0 && (d = r.match(/(Version)\/([\d.]+)/), d || (d = [0, 1, "13_0_0"]), f = !1), l && !h && (n.os = "android", n.android = !0), (d || p || c) && (n.os = "ios", n.ios = !0), n
                }(e)), E
            }({
                userAgent: i.userAgent
            }), r.browser = (A || (A = function() {
                const e = u();
                let t = !1;

                function i() {
                    const t = e.navigator.userAgent.toLowerCase();
                    return t.indexOf("safari") >= 0 && t.indexOf("chrome") < 0 && t.indexOf("android") < 0
                }
                if (i()) {
                    const i = String(e.navigator.userAgent);
                    if (i.includes("Version/")) {
                        const [e, s] = i.split("Version/")[1].split(" ")[0].split(".").map((e => Number(e)));
                        t = e < 16 || 16 === e && s < 2
                    }
                }
                return {
                    isSafari: t || i(),
                    needPerspectiveFix: t,
                    isWebView: /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(e.navigator.userAgent)
                }
            }()), A), r.eventsListeners = {}, r.eventsAnyListeners = [], r.modules = [...r.__modules__], i.modules && Array.isArray(i.modules) && r.modules.push(...i.modules);
            const n = {};
            r.modules.forEach((e => {
                e({
                    params: i,
                    swiper: r,
                    extendParams: W(i, n),
                    on: r.on.bind(r),
                    once: r.once.bind(r),
                    off: r.off.bind(r),
                    emit: r.emit.bind(r)
                })
            }));
            const a = m({}, H, n);
            return r.params = m({}, a, Y, i), r.originalParams = m({}, r.params), r.passedParams = m({}, i), r.params && r.params.on && Object.keys(r.params.on).forEach((e => {
                r.on(e, r.params.on[e])
            })), r.params && r.params.onAny && r.onAny(r.params.onAny), Object.assign(r, {
                enabled: r.params.enabled,
                el: t,
                classNames: [],
                slides: [],
                slidesGrid: [],
                snapGrid: [],
                slidesSizesGrid: [],
                isHorizontal: () => "horizontal" === r.params.direction,
                isVertical: () => "vertical" === r.params.direction,
                activeIndex: 0,
                realIndex: 0,
                isBeginning: !0,
                isEnd: !1,
                translate: 0,
                previousTranslate: 0,
                progress: 0,
                velocity: 0,
                animating: !1,
                cssOverflowAdjustment() {
                    return Math.trunc(this.translate / 2 ** 23) * 2 ** 23
                },
                allowSlideNext: r.params.allowSlideNext,
                allowSlidePrev: r.params.allowSlidePrev,
                touchEventsData: {
                    isTouched: void 0,
                    isMoved: void 0,
                    allowTouchCallbacks: void 0,
                    touchStartTime: void 0,
                    isScrolling: void 0,
                    currentTranslate: void 0,
                    startTranslate: void 0,
                    allowThresholdMove: void 0,
                    focusableElements: r.params.focusableElements,
                    lastClickTime: 0,
                    clickTimeout: void 0,
                    velocities: [],
                    allowMomentumBounce: void 0,
                    startMoving: void 0,
                    evCache: []
                },
                allowClick: !0,
                allowTouchMove: r.params.allowTouchMove,
                touches: {
                    startX: 0,
                    startY: 0,
                    currentX: 0,
                    currentY: 0,
                    diff: 0
                },
                imagesToLoad: [],
                imagesLoaded: 0
            }), r.emit("_swiper"), r.params.init && r.init(), r
        }
        getSlideIndex(e) {
            const {
                slidesEl: t,
                params: i
            } = this, s = b(y(t, `.${i.slideClass}, swiper-slide`)[0]);
            return b(e) - s
        }
        getSlideIndexByData(e) {
            return this.getSlideIndex(this.slides.filter((t => 1 * t.getAttribute("data-swiper-slide-index") === e))[0])
        }
        recalcSlides() {
            const {
                slidesEl: e,
                params: t
            } = this;
            this.slides = y(e, `.${t.slideClass}, swiper-slide`)
        }
        enable() {
            const e = this;
            e.enabled || (e.enabled = !0, e.params.grabCursor && e.setGrabCursor(), e.emit("enable"))
        }
        disable() {
            const e = this;
            e.enabled && (e.enabled = !1, e.params.grabCursor && e.unsetGrabCursor(), e.emit("disable"))
        }
        setProgress(e, t) {
            const i = this;
            e = Math.min(Math.max(e, 0), 1);
            const s = i.minTranslate(),
                r = (i.maxTranslate() - s) * e + s;
            i.translateTo(r, void 0 === t ? 0 : t), i.updateActiveIndex(), i.updateSlidesClasses()
        }
        emitContainerClasses() {
            const e = this;
            if (!e.params._emitClasses || !e.el) return;
            const t = e.el.className.split(" ").filter((t => 0 === t.indexOf("swiper") || 0 === t.indexOf(e.params.containerModifierClass)));
            e.emit("_containerClasses", t.join(" "))
        }
        getSlideClasses(e) {
            const t = this;
            return t.destroyed ? "" : e.className.split(" ").filter((e => 0 === e.indexOf("swiper-slide") || 0 === e.indexOf(t.params.slideClass))).join(" ")
        }
        emitSlidesClasses() {
            const e = this;
            if (!e.params._emitClasses || !e.el) return;
            const t = [];
            e.slides.forEach((i => {
                const s = e.getSlideClasses(i);
                t.push({
                    slideEl: i,
                    classNames: s
                }), e.emit("_slideClass", i, s)
            })), e.emit("_slideClasses", t)
        }
        slidesPerViewDynamic(e = "current", t = !1) {
            const {
                params: i,
                slides: s,
                slidesGrid: r,
                slidesSizesGrid: n,
                size: a,
                activeIndex: o
            } = this;
            let l = 1;
            if (i.centeredSlides) {
                let e, t = s[o] ? s[o].swiperSlideSize : 0;
                for (let i = o + 1; i < s.length; i += 1) s[i] && !e && (t += s[i].swiperSlideSize, l += 1, t > a && (e = !0));
                for (let i = o - 1; i >= 0; i -= 1) s[i] && !e && (t += s[i].swiperSlideSize, l += 1, t > a && (e = !0))
            } else if ("current" === e)
                for (let e = o + 1; e < s.length; e += 1)(t ? r[e] + n[e] - r[o] < a : r[e] - r[o] < a) && (l += 1);
            else
                for (let e = o - 1; e >= 0; e -= 1) r[o] - r[e] < a && (l += 1);
            return l
        }
        update() {
            const e = this;
            if (!e || e.destroyed) return;
            const {
                snapGrid: t,
                params: i
            } = e;

            function s() {
                const t = e.rtlTranslate ? -1 * e.translate : e.translate,
                    i = Math.min(Math.max(t, e.maxTranslate()), e.minTranslate());
                e.setTranslate(i), e.updateActiveIndex(), e.updateSlidesClasses()
            }
            let r;
            if (i.breakpoints && e.setBreakpoint(), [...e.el.querySelectorAll('[loading="lazy"]')].forEach((t => {
                    t.complete && M(e, t)
                })), e.updateSize(), e.updateSlides(), e.updateProgress(), e.updateSlidesClasses(), i.freeMode && i.freeMode.enabled && !i.cssMode) s(), i.autoHeight && e.updateAutoHeight();
            else {
                if (("auto" === i.slidesPerView || i.slidesPerView > 1) && e.isEnd && !i.centeredSlides) {
                    const t = e.virtual && i.virtual.enabled ? e.virtual.slides : e.slides;
                    r = e.slideTo(t.length - 1, 0, !1, !0)
                } else r = e.slideTo(e.activeIndex, 0, !1, !0);
                r || s()
            }
            i.watchOverflow && t !== e.snapGrid && e.checkOverflow(), e.emit("update")
        }
        changeDirection(e, t = !0) {
            const i = this,
                s = i.params.direction;
            return e || (e = "horizontal" === s ? "vertical" : "horizontal"), e === s || "horizontal" !== e && "vertical" !== e || (i.el.classList.remove(`${i.params.containerModifierClass}${s}`), i.el.classList.add(`${i.params.containerModifierClass}${e}`), i.emitContainerClasses(), i.params.direction = e, i.slides.forEach((t => {
                "vertical" === e ? t.style.width = "" : t.style.height = ""
            })), i.emit("changeDirection"), t && i.update()), i
        }
        changeLanguageDirection(e) {
            const t = this;
            t.rtl && "rtl" === e || !t.rtl && "ltr" === e || (t.rtl = "rtl" === e, t.rtlTranslate = "horizontal" === t.params.direction && t.rtl, t.rtl ? (t.el.classList.add(`${t.params.containerModifierClass}rtl`), t.el.dir = "rtl") : (t.el.classList.remove(`${t.params.containerModifierClass}rtl`), t.el.dir = "ltr"), t.update())
        }
        mount(e) {
            const t = this;
            if (t.mounted) return !0;
            let i = e || t.params.el;
            if ("string" == typeof i && (i = document.querySelector(i)), !i) return !1;
            i.swiper = t, i.shadowEl && (t.isElement = !0);
            const s = () => `.${(t.params.wrapperClass||"").trim().split(" ").join(".")}`;
            let r = i && i.shadowRoot && i.shadowRoot.querySelector ? i.shadowRoot.querySelector(s()) : y(i, s())[0];
            return !r && t.params.createElements && (r = _("div", t.params.wrapperClass), i.append(r), y(i, `.${t.params.slideClass}`).forEach((e => {
                r.append(e)
            }))), Object.assign(t, {
                el: i,
                wrapperEl: r,
                slidesEl: t.isElement ? i : r,
                mounted: !0,
                rtl: "rtl" === i.dir.toLowerCase() || "rtl" === w(i, "direction"),
                rtlTranslate: "horizontal" === t.params.direction && ("rtl" === i.dir.toLowerCase() || "rtl" === w(i, "direction")),
                wrongRTL: "-webkit-box" === w(r, "display")
            }), !0
        }
        init(e) {
            const t = this;
            return t.initialized || !1 === t.mount(e) || (t.emit("beforeInit"), t.params.breakpoints && t.setBreakpoint(), t.addClasses(), t.updateSize(), t.updateSlides(), t.params.watchOverflow && t.checkOverflow(), t.params.grabCursor && t.enabled && t.setGrabCursor(), t.params.loop && t.virtual && t.params.virtual.enabled ? t.slideTo(t.params.initialSlide + t.virtual.slidesBefore, 0, t.params.runCallbacksOnInit, !1, !0) : t.slideTo(t.params.initialSlide, 0, t.params.runCallbacksOnInit, !1, !0), t.params.loop && t.loopCreate(), t.attachEvents(), [...t.el.querySelectorAll('[loading="lazy"]')].forEach((e => {
                e.complete ? M(t, e) : e.addEventListener("load", (e => {
                    M(t, e.target)
                }))
            })), P(t), t.initialized = !0, P(t), t.emit("init"), t.emit("afterInit")), t
        }
        destroy(e = !0, t = !0) {
            const i = this,
                {
                    params: s,
                    el: r,
                    wrapperEl: n,
                    slides: a
                } = i;
            return void 0 === i.params || i.destroyed || (i.emit("beforeDestroy"), i.initialized = !1, i.detachEvents(), s.loop && i.loopDestroy(), t && (i.removeClasses(), r.removeAttribute("style"), n.removeAttribute("style"), a && a.length && a.forEach((e => {
                e.classList.remove(s.slideVisibleClass, s.slideActiveClass, s.slideNextClass, s.slidePrevClass), e.removeAttribute("style"), e.removeAttribute("data-swiper-slide-index")
            }))), i.emit("destroy"), Object.keys(i.eventsListeners).forEach((e => {
                i.off(e)
            })), !1 !== e && (i.el.swiper = null, function(e) {
                const t = e;
                Object.keys(t).forEach((e => {
                    try {
                        t[e] = null
                    } catch (e) {}
                    try {
                        delete t[e]
                    } catch (e) {}
                }))
            }(i)), i.destroyed = !0), null
        }
        static extendDefaults(e) {
            m(Y, e)
        }
        static get extendedDefaults() {
            return Y
        }
        static get defaults() {
            return H
        }
        static installModule(e) {
            X.prototype.__modules__ || (X.prototype.__modules__ = []);
            const t = X.prototype.__modules__;
            "function" == typeof e && t.indexOf(e) < 0 && t.push(e)
        }
        static use(e) {
            return Array.isArray(e) ? (e.forEach((e => X.installModule(e))), X) : (X.installModule(e), X)
        }
    }
    Object.keys(j).forEach((e => {
        Object.keys(j[e]).forEach((t => {
            X.prototype[t] = j[e][t]
        }))
    })), X.use([function({
        swiper: e,
        on: t,
        emit: i
    }) {
        const s = u();
        let r = null,
            n = null;
        const a = () => {
                e && !e.destroyed && e.initialized && (i("beforeResize"), i("resize"))
            },
            o = () => {
                e && !e.destroyed && e.initialized && i("orientationchange")
            };
        t("init", (() => {
            e.params.resizeObserver && void 0 !== s.ResizeObserver ? e && !e.destroyed && e.initialized && (r = new ResizeObserver((t => {
                n = s.requestAnimationFrame((() => {
                    const {
                        width: i,
                        height: s
                    } = e;
                    let r = i,
                        n = s;
                    t.forEach((({
                        contentBoxSize: t,
                        contentRect: i,
                        target: s
                    }) => {
                        s && s !== e.el || (r = i ? i.width : (t[0] || t).inlineSize, n = i ? i.height : (t[0] || t).blockSize)
                    })), r === i && n === s || a()
                }))
            })), r.observe(e.el)) : (s.addEventListener("resize", a), s.addEventListener("orientationchange", o))
        })), t("destroy", (() => {
            n && s.cancelAnimationFrame(n), r && r.unobserve && e.el && (r.unobserve(e.el), r = null), s.removeEventListener("resize", a), s.removeEventListener("orientationchange", o)
        }))
    }, function({
        swiper: e,
        extendParams: t,
        on: i,
        emit: s
    }) {
        const r = [],
            n = u(),
            a = (t, i = {}) => {
                const a = new(n.MutationObserver || n.WebkitMutationObserver)((t => {
                    if (e.__preventObserver__) return;
                    if (1 === t.length) return void s("observerUpdate", t[0]);
                    const i = function() {
                        s("observerUpdate", t[0])
                    };
                    n.requestAnimationFrame ? n.requestAnimationFrame(i) : n.setTimeout(i, 0)
                }));
                a.observe(t, {
                    attributes: void 0 === i.attributes || i.attributes,
                    childList: void 0 === i.childList || i.childList,
                    characterData: void 0 === i.characterData || i.characterData
                }), r.push(a)
            };
        t({
            observer: !1,
            observeParents: !1,
            observeSlideChildren: !1
        }), i("init", (() => {
            if (e.params.observer) {
                if (e.params.observeParents) {
                    const t = S(e.el);
                    for (let e = 0; e < t.length; e += 1) a(t[e])
                }
                a(e.el, {
                    childList: e.params.observeSlideChildren
                }), a(e.wrapperEl, {
                    attributes: !1
                })
            }
        })), i("destroy", (() => {
            r.forEach((e => {
                e.disconnect()
            })), r.splice(0, r.length)
        }))
    }]);
    const U = X;

    function Q(e, t, i, s) {
        return e.params.createElements && Object.keys(s).forEach((r => {
            if (!i[r] && !0 === i.auto) {
                let n = y(e.el, `.${s[r]}`)[0];
                n || (n = _("div", s[r]), n.className = s[r], e.el.append(n)), i[r] = n, t[r] = n
            }
        })), i
    }

    function J({
        swiper: e,
        extendParams: t,
        on: i,
        emit: s
    }) {
        t({
            navigation: {
                nextEl: null,
                prevEl: null,
                hideOnClick: !1,
                disabledClass: "swiper-button-disabled",
                hiddenClass: "swiper-button-hidden",
                lockClass: "swiper-button-lock",
                navigationDisabledClass: "swiper-navigation-disabled"
            }
        }), e.navigation = {
            nextEl: null,
            prevEl: null
        };
        const r = e => (Array.isArray(e) || (e = [e].filter((e => !!e))), e);

        function n(t) {
            let i;
            return t && "string" == typeof t && e.isElement && (i = e.el.shadowRoot.querySelector(t), i) ? i : (t && ("string" == typeof t && (i = [...document.querySelectorAll(t)]), e.params.uniqueNavElements && "string" == typeof t && i.length > 1 && 1 === e.el.querySelectorAll(t).length && (i = e.el.querySelector(t))), t && !i ? t : i)
        }

        function a(t, i) {
            const s = e.params.navigation;
            (t = r(t)).forEach((t => {
                t && (t.classList[i ? "add" : "remove"](...s.disabledClass.split(" ")), "BUTTON" === t.tagName && (t.disabled = i), e.params.watchOverflow && e.enabled && t.classList[e.isLocked ? "add" : "remove"](s.lockClass))
            }))
        }

        function o() {
            const {
                nextEl: t,
                prevEl: i
            } = e.navigation;
            if (e.params.loop) return a(i, !1), void a(t, !1);
            a(i, e.isBeginning && !e.params.rewind), a(t, e.isEnd && !e.params.rewind)
        }

        function l(t) {
            t.preventDefault(), (!e.isBeginning || e.params.loop || e.params.rewind) && (e.slidePrev(), s("navigationPrev"))
        }

        function d(t) {
            t.preventDefault(), (!e.isEnd || e.params.loop || e.params.rewind) && (e.slideNext(), s("navigationNext"))
        }

        function c() {
            const t = e.params.navigation;
            if (e.params.navigation = Q(e, e.originalParams.navigation, e.params.navigation, {
                    nextEl: "swiper-button-next",
                    prevEl: "swiper-button-prev"
                }), !t.nextEl && !t.prevEl) return;
            let i = n(t.nextEl),
                s = n(t.prevEl);
            Object.assign(e.navigation, {
                nextEl: i,
                prevEl: s
            }), i = r(i), s = r(s);
            const a = (i, s) => {
                i && i.addEventListener("click", "next" === s ? d : l), !e.enabled && i && i.classList.add(...t.lockClass.split(" "))
            };
            i.forEach((e => a(e, "next"))), s.forEach((e => a(e, "prev")))
        }

        function u() {
            let {
                nextEl: t,
                prevEl: i
            } = e.navigation;
            t = r(t), i = r(i);
            const s = (t, i) => {
                t.removeEventListener("click", "next" === i ? d : l), t.classList.remove(...e.params.navigation.disabledClass.split(" "))
            };
            t.forEach((e => s(e, "next"))), i.forEach((e => s(e, "prev")))
        }
        i("init", (() => {
            !1 === e.params.navigation.enabled ? p() : (c(), o())
        })), i("toEdge fromEdge lock unlock", (() => {
            o()
        })), i("destroy", (() => {
            u()
        })), i("enable disable", (() => {
            let {
                nextEl: t,
                prevEl: i
            } = e.navigation;
            t = r(t), i = r(i), [...t, ...i].filter((e => !!e)).forEach((t => t.classList[e.enabled ? "remove" : "add"](e.params.navigation.lockClass)))
        })), i("click", ((t, i) => {
            let {
                nextEl: n,
                prevEl: a
            } = e.navigation;
            n = r(n), a = r(a);
            const o = i.target;
            if (e.params.navigation.hideOnClick && !a.includes(o) && !n.includes(o)) {
                if (e.pagination && e.params.pagination && e.params.pagination.clickable && (e.pagination.el === o || e.pagination.el.contains(o))) return;
                let t;
                n.length ? t = n[0].classList.contains(e.params.navigation.hiddenClass) : a.length && (t = a[0].classList.contains(e.params.navigation.hiddenClass)), s(!0 === t ? "navigationShow" : "navigationHide"), [...n, ...a].filter((e => !!e)).forEach((t => t.classList.toggle(e.params.navigation.hiddenClass)))
            }
        }));
        const p = () => {
            e.el.classList.add(...e.params.navigation.navigationDisabledClass.split(" ")), u()
        };
        Object.assign(e.navigation, {
            enable: () => {
                e.el.classList.remove(...e.params.navigation.navigationDisabledClass.split(" ")), c(), o()
            },
            disable: p,
            update: o,
            init: c,
            destroy: u
        })
    }

    function K(e = "") {
        return `.${e.trim().replace(/([\.:!+\/])/g,"\\$1").replace(/ /g,".")}`
    }

    function Z({
        swiper: e,
        extendParams: t,
        on: i,
        emit: s
    }) {
        const r = "swiper-pagination";
        let n;
        t({
            pagination: {
                el: null,
                bulletElement: "span",
                clickable: !1,
                hideOnClick: !1,
                renderBullet: null,
                renderProgressbar: null,
                renderFraction: null,
                renderCustom: null,
                progressbarOpposite: !1,
                type: "bullets",
                dynamicBullets: !1,
                dynamicMainBullets: 1,
                formatFractionCurrent: e => e,
                formatFractionTotal: e => e,
                bulletClass: `${r}-bullet`,
                bulletActiveClass: `${r}-bullet-active`,
                modifierClass: `${r}-`,
                currentClass: `${r}-current`,
                totalClass: `${r}-total`,
                hiddenClass: `${r}-hidden`,
                progressbarFillClass: `${r}-progressbar-fill`,
                progressbarOppositeClass: `${r}-progressbar-opposite`,
                clickableClass: `${r}-clickable`,
                lockClass: `${r}-lock`,
                horizontalClass: `${r}-horizontal`,
                verticalClass: `${r}-vertical`,
                paginationDisabledClass: `${r}-disabled`
            }
        }), e.pagination = {
            el: null,
            bullets: []
        };
        let a = 0;
        const o = e => (Array.isArray(e) || (e = [e].filter((e => !!e))), e);

        function l() {
            return !e.params.pagination.el || !e.pagination.el || Array.isArray(e.pagination.el) && 0 === e.pagination.el.length
        }

        function d(t, i) {
            const {
                bulletActiveClass: s
            } = e.params.pagination;
            t && (t = t[("prev" === i ? "previous" : "next") + "ElementSibling"]) && (t.classList.add(`${s}-${i}`), (t = t[("prev" === i ? "previous" : "next") + "ElementSibling"]) && t.classList.add(`${s}-${i}-${i}`))
        }

        function c(t) {
            const i = t.target.closest(K(e.params.pagination.bulletClass));
            if (!i) return;
            t.preventDefault();
            const s = b(i) * e.params.slidesPerGroup;
            if (e.params.loop) {
                if (e.realIndex === s) return;
                const t = e.getSlideIndexByData(s),
                    i = e.getSlideIndexByData(e.realIndex);
                t > e.slides.length - e.loopedSlides && e.loopFix({
                    direction: t > i ? "next" : "prev",
                    activeSlideIndex: t,
                    slideTo: !1
                }), e.slideToLoop(s)
            } else e.slideTo(s)
        }

        function u() {
            const t = e.rtl,
                i = e.params.pagination;
            if (l()) return;
            let r, c, u = e.pagination.el;
            u = o(u);
            const p = e.virtual && e.params.virtual.enabled ? e.virtual.slides.length : e.slides.length,
                h = e.params.loop ? Math.ceil(p / e.params.slidesPerGroup) : e.snapGrid.length;
            if (e.params.loop ? (c = e.previousRealIndex || 0, r = e.params.slidesPerGroup > 1 ? Math.floor(e.realIndex / e.params.slidesPerGroup) : e.realIndex) : void 0 !== e.snapIndex ? (r = e.snapIndex, c = e.previousSnapIndex) : (c = e.previousIndex || 0, r = e.activeIndex || 0), "bullets" === i.type && e.pagination.bullets && e.pagination.bullets.length > 0) {
                const s = e.pagination.bullets;
                let o, l, p;
                if (i.dynamicBullets && (n = x(s[0], e.isHorizontal() ? "width" : "height", !0), u.forEach((t => {
                        t.style[e.isHorizontal() ? "width" : "height"] = n * (i.dynamicMainBullets + 4) + "px"
                    })), i.dynamicMainBullets > 1 && void 0 !== c && (a += r - (c || 0), a > i.dynamicMainBullets - 1 ? a = i.dynamicMainBullets - 1 : a < 0 && (a = 0)), o = Math.max(r - a, 0), l = o + (Math.min(s.length, i.dynamicMainBullets) - 1), p = (l + o) / 2), s.forEach((e => {
                        const t = [...["", "-next", "-next-next", "-prev", "-prev-prev", "-main"].map((e => `${i.bulletActiveClass}${e}`))].map((e => "string" == typeof e && e.includes(" ") ? e.split(" ") : e)).flat();
                        e.classList.remove(...t)
                    })), u.length > 1) s.forEach((t => {
                    const s = b(t);
                    s === r ? t.classList.add(...i.bulletActiveClass.split(" ")) : e.isElement && t.setAttribute("part", "bullet"), i.dynamicBullets && (s >= o && s <= l && t.classList.add(...`${i.bulletActiveClass}-main`.split(" ")), s === o && d(t, "prev"), s === l && d(t, "next"))
                }));
                else {
                    const t = s[r];
                    if (t && t.classList.add(...i.bulletActiveClass.split(" ")), e.isElement && s.forEach(((e, t) => {
                            e.setAttribute("part", t === r ? "bullet-active" : "bullet")
                        })), i.dynamicBullets) {
                        const e = s[o],
                            t = s[l];
                        for (let e = o; e <= l; e += 1) s[e] && s[e].classList.add(...`${i.bulletActiveClass}-main`.split(" "));
                        d(e, "prev"), d(t, "next")
                    }
                }
                if (i.dynamicBullets) {
                    const r = Math.min(s.length, i.dynamicMainBullets + 4),
                        a = (n * r - n) / 2 - p * n,
                        o = t ? "right" : "left";
                    s.forEach((t => {
                        t.style[e.isHorizontal() ? o : "top"] = `${a}px`
                    }))
                }
            }
            u.forEach(((t, n) => {
                if ("fraction" === i.type && (t.querySelectorAll(K(i.currentClass)).forEach((e => {
                        e.textContent = i.formatFractionCurrent(r + 1)
                    })), t.querySelectorAll(K(i.totalClass)).forEach((e => {
                        e.textContent = i.formatFractionTotal(h)
                    }))), "progressbar" === i.type) {
                    let s;
                    s = i.progressbarOpposite ? e.isHorizontal() ? "vertical" : "horizontal" : e.isHorizontal() ? "horizontal" : "vertical";
                    const n = (r + 1) / h;
                    let a = 1,
                        o = 1;
                    "horizontal" === s ? a = n : o = n, t.querySelectorAll(K(i.progressbarFillClass)).forEach((t => {
                        t.style.transform = `translate3d(0,0,0) scaleX(${a}) scaleY(${o})`, t.style.transitionDuration = `${e.params.speed}ms`
                    }))
                }
                "custom" === i.type && i.renderCustom ? (t.innerHTML = i.renderCustom(e, r + 1, h), 0 === n && s("paginationRender", t)) : (0 === n && s("paginationRender", t), s("paginationUpdate", t)), e.params.watchOverflow && e.enabled && t.classList[e.isLocked ? "add" : "remove"](i.lockClass)
            }))
        }

        function p() {
            const t = e.params.pagination;
            if (l()) return;
            const i = e.virtual && e.params.virtual.enabled ? e.virtual.slides.length : e.slides.length;
            let r = e.pagination.el;
            r = o(r);
            let n = "";
            if ("bullets" === t.type) {
                let s = e.params.loop ? Math.ceil(i / e.params.slidesPerGroup) : e.snapGrid.length;
                e.params.freeMode && e.params.freeMode.enabled && s > i && (s = i);
                for (let i = 0; i < s; i += 1) t.renderBullet ? n += t.renderBullet.call(e, i, t.bulletClass) : n += `<${t.bulletElement} ${e.isElement?'part="bullet"':""} class="${t.bulletClass}"></${t.bulletElement}>`
            }
            "fraction" === t.type && (n = t.renderFraction ? t.renderFraction.call(e, t.currentClass, t.totalClass) : `<span class="${t.currentClass}"></span> / <span class="${t.totalClass}"></span>`), "progressbar" === t.type && (n = t.renderProgressbar ? t.renderProgressbar.call(e, t.progressbarFillClass) : `<span class="${t.progressbarFillClass}"></span>`), e.pagination.bullets = [], r.forEach((i => {
                "custom" !== t.type && (i.innerHTML = n || ""), "bullets" === t.type && e.pagination.bullets.push(...i.querySelectorAll(K(t.bulletClass)))
            })), "custom" !== t.type && s("paginationRender", r[0])
        }

        function h() {
            e.params.pagination = Q(e, e.originalParams.pagination, e.params.pagination, {
                el: "swiper-pagination"
            });
            const t = e.params.pagination;
            if (!t.el) return;
            let i;
            "string" == typeof t.el && e.isElement && (i = e.el.shadowRoot.querySelector(t.el)), i || "string" != typeof t.el || (i = [...document.querySelectorAll(t.el)]), i || (i = t.el), i && 0 !== i.length && (e.params.uniqueNavElements && "string" == typeof t.el && Array.isArray(i) && i.length > 1 && (i = [...e.el.querySelectorAll(t.el)], i.length > 1 && (i = i.filter((t => S(t, ".swiper")[0] === e.el))[0])), Array.isArray(i) && 1 === i.length && (i = i[0]), Object.assign(e.pagination, {
                el: i
            }), i = o(i), i.forEach((i => {
                "bullets" === t.type && t.clickable && i.classList.add(t.clickableClass), i.classList.add(t.modifierClass + t.type), i.classList.add(e.isHorizontal() ? t.horizontalClass : t.verticalClass), "bullets" === t.type && t.dynamicBullets && (i.classList.add(`${t.modifierClass}${t.type}-dynamic`), a = 0, t.dynamicMainBullets < 1 && (t.dynamicMainBullets = 1)), "progressbar" === t.type && t.progressbarOpposite && i.classList.add(t.progressbarOppositeClass), t.clickable && i.addEventListener("click", c), e.enabled || i.classList.add(t.lockClass)
            })))
        }

        function f() {
            const t = e.params.pagination;
            if (l()) return;
            let i = e.pagination.el;
            i && (i = o(i), i.forEach((i => {
                i.classList.remove(t.hiddenClass), i.classList.remove(t.modifierClass + t.type), i.classList.remove(e.isHorizontal() ? t.horizontalClass : t.verticalClass), t.clickable && i.removeEventListener("click", c)
            }))), e.pagination.bullets && e.pagination.bullets.forEach((e => e.classList.remove(...t.bulletActiveClass.split(" "))))
        }
        i("changeDirection", (() => {
            if (!e.pagination || !e.pagination.el) return;
            const t = e.params.pagination;
            let {
                el: i
            } = e.pagination;
            i = o(i), i.forEach((i => {
                i.classList.remove(t.horizontalClass, t.verticalClass), i.classList.add(e.isHorizontal() ? t.horizontalClass : t.verticalClass)
            }))
        })), i("init", (() => {
            !1 === e.params.pagination.enabled ? m() : (h(), p(), u())
        })), i("activeIndexChange", (() => {
            void 0 === e.snapIndex && u()
        })), i("snapIndexChange", (() => {
            u()
        })), i("snapGridLengthChange", (() => {
            p(), u()
        })), i("destroy", (() => {
            f()
        })), i("enable disable", (() => {
            let {
                el: t
            } = e.pagination;
            t && (t = o(t), t.forEach((t => t.classList[e.enabled ? "remove" : "add"](e.params.pagination.lockClass))))
        })), i("lock unlock", (() => {
            u()
        })), i("click", ((t, i) => {
            const r = i.target;
            let {
                el: n
            } = e.pagination;
            if (Array.isArray(n) || (n = [n].filter((e => !!e))), e.params.pagination.el && e.params.pagination.hideOnClick && n && n.length > 0 && !r.classList.contains(e.params.pagination.bulletClass)) {
                if (e.navigation && (e.navigation.nextEl && r === e.navigation.nextEl || e.navigation.prevEl && r === e.navigation.prevEl)) return;
                const t = n[0].classList.contains(e.params.pagination.hiddenClass);
                s(!0 === t ? "paginationShow" : "paginationHide"), n.forEach((t => t.classList.toggle(e.params.pagination.hiddenClass)))
            }
        }));
        const m = () => {
            e.el.classList.add(e.params.pagination.paginationDisabledClass);
            let {
                el: t
            } = e.pagination;
            t && (t = o(t), t.forEach((t => t.classList.add(e.params.pagination.paginationDisabledClass)))), f()
        };
        Object.assign(e.pagination, {
            enable: () => {
                e.el.classList.remove(e.params.pagination.paginationDisabledClass);
                let {
                    el: t
                } = e.pagination;
                t && (t = o(t), t.forEach((t => t.classList.remove(e.params.pagination.paginationDisabledClass)))), h(), p(), u()
            },
            disable: m,
            render: p,
            update: u,
            init: h,
            destroy: f
        })
    }

    function ee({
        swiper: e,
        extendParams: t,
        on: i,
        emit: s,
        params: r
    }) {
        let n, a;
        e.autoplay = {
            running: !1,
            paused: !1,
            timeLeft: 0
        }, t({
            autoplay: {
                enabled: !1,
                delay: 3e3,
                waitForTransition: !0,
                disableOnInteraction: !0,
                stopOnLastSlide: !1,
                reverseDirection: !1,
                pauseOnMouseEnter: !1
            }
        });
        let o, l, c, u, p, h, f, m = r && r.autoplay ? r.autoplay.delay : 3e3,
            g = r && r.autoplay ? r.autoplay.delay : 3e3,
            v = (new Date).getTime;

        function y(t) {
            e && !e.destroyed && e.wrapperEl && t.target === e.wrapperEl && (e.wrapperEl.removeEventListener("transitionend", y), T())
        }
        const _ = () => {
                if (e.destroyed || !e.autoplay.running) return;
                e.autoplay.paused ? l = !0 : l && (g = o, l = !1);
                const t = e.autoplay.paused ? o : v + g - (new Date).getTime();
                e.autoplay.timeLeft = t, s("autoplayTimeLeft", t, t / m), a = requestAnimationFrame((() => {
                    _()
                }))
            },
            w = t => {
                if (e.destroyed || !e.autoplay.running) return;
                cancelAnimationFrame(a), _();
                let i = void 0 === t ? e.params.autoplay.delay : t;
                m = e.params.autoplay.delay, g = e.params.autoplay.delay;
                const r = (() => {
                    let t;
                    if (t = e.virtual && e.params.virtual.enabled ? e.slides.filter((e => e.classList.contains("swiper-slide-active")))[0] : e.slides[e.activeIndex], t) return parseInt(t.getAttribute("data-swiper-autoplay"), 10)
                })();
                !Number.isNaN(r) && r > 0 && void 0 === t && (i = r, m = r, g = r), o = i;
                const l = e.params.speed,
                    d = () => {
                        e && !e.destroyed && (e.params.autoplay.reverseDirection ? !e.isBeginning || e.params.loop || e.params.rewind ? (e.slidePrev(l, !0, !0), s("autoplay")) : e.params.autoplay.stopOnLastSlide || (e.slideTo(e.slides.length - 1, l, !0, !0), s("autoplay")) : !e.isEnd || e.params.loop || e.params.rewind ? (e.slideNext(l, !0, !0), s("autoplay")) : e.params.autoplay.stopOnLastSlide || (e.slideTo(0, l, !0, !0), s("autoplay")), e.params.cssMode && (v = (new Date).getTime(), requestAnimationFrame((() => {
                            w()
                        }))))
                    };
                return i > 0 ? (clearTimeout(n), n = setTimeout((() => {
                    d()
                }), i)) : requestAnimationFrame((() => {
                    d()
                })), i
            },
            b = () => {
                e.autoplay.running = !0, w(), s("autoplayStart")
            },
            S = () => {
                e.autoplay.running = !1, clearTimeout(n), cancelAnimationFrame(a), s("autoplayStop")
            },
            x = (t, i) => {
                if (e.destroyed || !e.autoplay.running) return;
                clearTimeout(n), t || (f = !0);
                const r = () => {
                    s("autoplayPause"), e.params.autoplay.waitForTransition ? e.wrapperEl.addEventListener("transitionend", y) : T()
                };
                if (e.autoplay.paused = !0, i) return h && (o = e.params.autoplay.delay), h = !1, void r();
                const a = o || e.params.autoplay.delay;
                o = a - ((new Date).getTime() - v), e.isEnd && o < 0 && !e.params.loop || (o < 0 && (o = 0), r())
            },
            T = () => {
                e.isEnd && o < 0 && !e.params.loop || e.destroyed || !e.autoplay.running || (v = (new Date).getTime(), f ? (f = !1, w(o)) : w(), e.autoplay.paused = !1, s("autoplayResume"))
            },
            E = () => {
                if (e.destroyed || !e.autoplay.running) return;
                const t = d();
                "hidden" === t.visibilityState && (f = !0, x(!0)), "visible" === t.visibilityState && T()
            },
            A = e => {
                "mouse" === e.pointerType && (f = !0, x(!0))
            },
            C = t => {
                "mouse" === t.pointerType && e.autoplay.paused && T()
            };
        i("init", (() => {
            e.params.autoplay.enabled && (e.params.autoplay.pauseOnMouseEnter && (e.el.addEventListener("pointerenter", A), e.el.addEventListener("pointerleave", C)), d().addEventListener("visibilitychange", E), v = (new Date).getTime(), b())
        })), i("destroy", (() => {
            e.el.removeEventListener("pointerenter", A), e.el.removeEventListener("pointerleave", C), d().removeEventListener("visibilitychange", E), e.autoplay.running && S()
        })), i("beforeTransitionStart", ((t, i, s) => {
            !e.destroyed && e.autoplay.running && (s || !e.params.autoplay.disableOnInteraction ? x(!0, !0) : S())
        })), i("sliderFirstMove", (() => {
            !e.destroyed && e.autoplay.running && (e.params.autoplay.disableOnInteraction ? S() : (c = !0, u = !1, f = !1, p = setTimeout((() => {
                f = !0, u = !0, x(!0)
            }), 200)))
        })), i("touchEnd", (() => {
            if (!e.destroyed && e.autoplay.running && c) {
                if (clearTimeout(p), clearTimeout(n), e.params.autoplay.disableOnInteraction) return u = !1, void(c = !1);
                u && e.params.cssMode && T(), u = !1, c = !1
            }
        })), i("slideChange", (() => {
            !e.destroyed && e.autoplay.running && (h = !0)
        })), Object.assign(e.autoplay, {
            start: b,
            stop: S,
            pause: x,
            resume: T
        })
    }

    function te(e) {
        if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return e
    }

    function ie(e, t) {
        e.prototype = Object.create(t.prototype), e.prototype.constructor = e, e.__proto__ = t
    }
    var se, re, ne, ae, oe, le, de, ce, ue, pe, he, fe, me, ge, ve, ye = {
            autoSleep: 120,
            force3D: "auto",
            nullTargetWarn: 1,
            units: {
                lineHeight: ""
            }
        },
        _e = {
            duration: .5,
            overwrite: !1,
            delay: 0
        },
        we = 1e8,
        be = 1e-8,
        Se = 2 * Math.PI,
        xe = Se / 4,
        Te = 0,
        Ee = Math.sqrt,
        Ae = Math.cos,
        Ce = Math.sin,
        Le = function(e) {
            return "string" == typeof e
        },
        Me = function(e) {
            return "function" == typeof e
        },
        ke = function(e) {
            return "number" == typeof e
        },
        Pe = function(e) {
            return void 0 === e
        },
        Oe = function(e) {
            return "object" == typeof e
        },
        De = function(e) {
            return !1 !== e
        },
        Ie = function() {
            return "undefined" != typeof window
        },
        ze = function(e) {
            return Me(e) || Le(e)
        },
        qe = "function" == typeof ArrayBuffer && ArrayBuffer.isView || function() {},
        Be = Array.isArray,
        Re = /(?:-?\.?\d|\.)+/gi,
        Fe = /[-+=.]*\d+[.e\-+]*\d*[e\-+]*\d*/g,
        Ge = /[-+=.]*\d+[.e-]*\d*[a-z%]*/g,
        $e = /[-+=.]*\d+\.?\d*(?:e-|e\+)?\d*/gi,
        Ne = /[+-]=-?[.\d]+/,
        Ve = /[^,'"\[\]\s]+/gi,
        He = /^[+\-=e\s\d]*\d+[.\d]*([a-z]*|%)\s*$/i,
        We = {},
        je = {},
        Ye = function(e) {
            return (je = St(e, We)) && Ss
        },
        Xe = function(e, t) {
            return console.warn("Invalid property", e, "set to", t, "Missing plugin? gsap.registerPlugin()")
        },
        Ue = function(e, t) {
            return !t && console.warn(e)
        },
        Qe = function(e, t) {
            return e && (We[e] = t) && je && (je[e] = t) || We
        },
        Je = function() {
            return 0
        },
        Ke = {
            suppressEvents: !0,
            isStart: !0,
            kill: !1
        },
        Ze = {
            suppressEvents: !0,
            kill: !1
        },
        et = {
            suppressEvents: !0
        },
        tt = {},
        it = [],
        st = {},
        rt = {},
        nt = {},
        at = 30,
        ot = [],
        lt = "",
        dt = function(e) {
            var t, i, s = e[0];
            if (Oe(s) || Me(s) || (e = [e]), !(t = (s._gsap || {}).harness)) {
                for (i = ot.length; i-- && !ot[i].targetTest(s););
                t = ot[i]
            }
            for (i = e.length; i--;) e[i] && (e[i]._gsap || (e[i]._gsap = new Bi(e[i], t))) || e.splice(i, 1);
            return e
        },
        ct = function(e) {
            return e._gsap || dt(ei(e))[0]._gsap
        },
        ut = function(e, t, i) {
            return (i = e[t]) && Me(i) ? e[t]() : Pe(i) && e.getAttribute && e.getAttribute(t) || i
        },
        pt = function(e, t) {
            return (e = e.split(",")).forEach(t) || e
        },
        ht = function(e) {
            return Math.round(1e5 * e) / 1e5 || 0
        },
        ft = function(e) {
            return Math.round(1e7 * e) / 1e7 || 0
        },
        mt = function(e, t) {
            var i = t.charAt(0),
                s = parseFloat(t.substr(2));
            return e = parseFloat(e), "+" === i ? e + s : "-" === i ? e - s : "*" === i ? e * s : e / s
        },
        gt = function(e, t) {
            for (var i = t.length, s = 0; e.indexOf(t[s]) < 0 && ++s < i;);
            return s < i
        },
        vt = function() {
            var e, t, i = it.length,
                s = it.slice(0);
            for (st = {}, it.length = 0, e = 0; e < i; e++)(t = s[e]) && t._lazy && (t.render(t._lazy[0], t._lazy[1], !0)._lazy = 0)
        },
        yt = function(e, t, i, s) {
            it.length && !re && vt(), e.render(t, i, s || re && t < 0 && (e._initted || e._startAt)), it.length && !re && vt()
        },
        _t = function(e) {
            var t = parseFloat(e);
            return (t || 0 === t) && (e + "").match(Ve).length < 2 ? t : Le(e) ? e.trim() : e
        },
        wt = function(e) {
            return e
        },
        bt = function(e, t) {
            for (var i in t) i in e || (e[i] = t[i]);
            return e
        },
        St = function(e, t) {
            for (var i in t) e[i] = t[i];
            return e
        },
        xt = function e(t, i) {
            for (var s in i) "__proto__" !== s && "constructor" !== s && "prototype" !== s && (t[s] = Oe(i[s]) ? e(t[s] || (t[s] = {}), i[s]) : i[s]);
            return t
        },
        Tt = function(e, t) {
            var i, s = {};
            for (i in e) i in t || (s[i] = e[i]);
            return s
        },
        Et = function(e) {
            var t, i = e.parent || ae,
                s = e.keyframes ? (t = Be(e.keyframes), function(e, i) {
                    for (var s in i) s in e || "duration" === s && t || "ease" === s || (e[s] = i[s])
                }) : bt;
            if (De(e.inherit))
                for (; i;) s(e, i.vars.defaults), i = i.parent || i._dp;
            return e
        },
        At = function(e, t, i, s, r) {
            void 0 === i && (i = "_first"), void 0 === s && (s = "_last");
            var n, a = e[s];
            if (r)
                for (n = t[r]; a && a[r] > n;) a = a._prev;
            return a ? (t._next = a._next, a._next = t) : (t._next = e[i], e[i] = t), t._next ? t._next._prev = t : e[s] = t, t._prev = a, t.parent = t._dp = e, t
        },
        Ct = function(e, t, i, s) {
            void 0 === i && (i = "_first"), void 0 === s && (s = "_last");
            var r = t._prev,
                n = t._next;
            r ? r._next = n : e[i] === t && (e[i] = n), n ? n._prev = r : e[s] === t && (e[s] = r), t._next = t._prev = t.parent = null
        },
        Lt = function(e, t) {
            e.parent && (!t || e.parent.autoRemoveChildren) && e.parent.remove(e), e._act = 0
        },
        Mt = function(e, t) {
            if (e && (!t || t._end > e._dur || t._start < 0))
                for (var i = e; i;) i._dirty = 1, i = i.parent;
            return e
        },
        kt = function(e) {
            for (var t = e.parent; t && t.parent;) t._dirty = 1, t.totalDuration(), t = t.parent;
            return e
        },
        Pt = function(e, t, i, s) {
            return e._startAt && (re ? e._startAt.revert(Ze) : e.vars.immediateRender && !e.vars.autoRevert || e._startAt.render(t, !0, s))
        },
        Ot = function e(t) {
            return !t || t._ts && e(t.parent)
        },
        Dt = function(e) {
            return e._repeat ? It(e._tTime, e = e.duration() + e._rDelay) * e : 0
        },
        It = function(e, t) {
            var i = Math.floor(e /= t);
            return e && i === e ? i - 1 : i
        },
        zt = function(e, t) {
            return (e - t._start) * t._ts + (t._ts >= 0 ? 0 : t._dirty ? t.totalDuration() : t._tDur)
        },
        qt = function(e) {
            return e._end = ft(e._start + (e._tDur / Math.abs(e._ts || e._rts || be) || 0))
        },
        Bt = function(e, t) {
            var i = e._dp;
            return i && i.smoothChildTiming && e._ts && (e._start = ft(i._time - (e._ts > 0 ? t / e._ts : ((e._dirty ? e.totalDuration() : e._tDur) - t) / -e._ts)), qt(e), i._dirty || Mt(i, e)), e
        },
        Rt = function(e, t) {
            var i;
            if ((t._time || t._initted && !t._dur) && (i = zt(e.rawTime(), t), (!t._dur || Qt(0, t.totalDuration(), i) - t._tTime > be) && t.render(i, !0)), Mt(e, t)._dp && e._initted && e._time >= e._dur && e._ts) {
                if (e._dur < e.duration())
                    for (i = e; i._dp;) i.rawTime() >= 0 && i.totalTime(i._tTime), i = i._dp;
                e._zTime = -1e-8
            }
        },
        Ft = function(e, t, i, s) {
            return t.parent && Lt(t), t._start = ft((ke(i) ? i : i || e !== ae ? Yt(e, i, t) : e._time) + t._delay), t._end = ft(t._start + (t.totalDuration() / Math.abs(t.timeScale()) || 0)), At(e, t, "_first", "_last", e._sort ? "_start" : 0), Vt(t) || (e._recent = t), s || Rt(e, t), e._ts < 0 && Bt(e, e._tTime), e
        },
        Gt = function(e, t) {
            return (We.ScrollTrigger || Xe("scrollTrigger", t)) && We.ScrollTrigger.create(t, e)
        },
        $t = function(e, t, i, s, r) {
            return Wi(e, t, r), e._initted ? !i && e._pt && !re && (e._dur && !1 !== e.vars.lazy || !e._dur && e.vars.lazy) && ue !== Ti.frame ? (it.push(e), e._lazy = [r, s], 1) : void 0 : 1
        },
        Nt = function e(t) {
            var i = t.parent;
            return i && i._ts && i._initted && !i._lock && (i.rawTime() < 0 || e(i))
        },
        Vt = function(e) {
            var t = e.data;
            return "isFromStart" === t || "isStart" === t
        },
        Ht = function(e, t, i, s) {
            var r = e._repeat,
                n = ft(t) || 0,
                a = e._tTime / e._tDur;
            return a && !s && (e._time *= n / e._dur), e._dur = n, e._tDur = r ? r < 0 ? 1e10 : ft(n * (r + 1) + e._rDelay * r) : n, a > 0 && !s && Bt(e, e._tTime = e._tDur * a), e.parent && qt(e), i || Mt(e.parent, e), e
        },
        Wt = function(e) {
            return e instanceof Fi ? Mt(e) : Ht(e, e._dur)
        },
        jt = {
            _start: 0,
            endTime: Je,
            totalDuration: Je
        },
        Yt = function e(t, i, s) {
            var r, n, a, o = t.labels,
                l = t._recent || jt,
                d = t.duration() >= we ? l.endTime(!1) : t._dur;
            return Le(i) && (isNaN(i) || i in o) ? (n = i.charAt(0), a = "%" === i.substr(-1), r = i.indexOf("="), "<" === n || ">" === n ? (r >= 0 && (i = i.replace(/=/, "")), ("<" === n ? l._start : l.endTime(l._repeat >= 0)) + (parseFloat(i.substr(1)) || 0) * (a ? (r < 0 ? l : s).totalDuration() / 100 : 1)) : r < 0 ? (i in o || (o[i] = d), o[i]) : (n = parseFloat(i.charAt(r - 1) + i.substr(r + 1)), a && s && (n = n / 100 * (Be(s) ? s[0] : s).totalDuration()), r > 1 ? e(t, i.substr(0, r - 1), s) + n : d + n)) : null == i ? d : +i
        },
        Xt = function(e, t, i) {
            var s, r, n = ke(t[1]),
                a = (n ? 2 : 1) + (e < 2 ? 0 : 1),
                o = t[a];
            if (n && (o.duration = t[1]), o.parent = i, e) {
                for (s = o, r = i; r && !("immediateRender" in s);) s = r.vars.defaults || {}, r = De(r.vars.inherit) && r.parent;
                o.immediateRender = De(s.immediateRender), e < 2 ? o.runBackwards = 1 : o.startAt = t[a - 1]
            }
            return new Qi(t[0], o, t[a + 1])
        },
        Ut = function(e, t) {
            return e || 0 === e ? t(e) : t
        },
        Qt = function(e, t, i) {
            return i < e ? e : i > t ? t : i
        },
        Jt = function(e, t) {
            return Le(e) && (t = He.exec(e)) ? t[1] : ""
        },
        Kt = [].slice,
        Zt = function(e, t) {
            return e && Oe(e) && "length" in e && (!t && !e.length || e.length - 1 in e && Oe(e[0])) && !e.nodeType && e !== oe
        },
        ei = function(e, t, i) {
            return ne && !t && ne.selector ? ne.selector(e) : !Le(e) || i || !le && Ei() ? Be(e) ? function(e, t, i) {
                return void 0 === i && (i = []), e.forEach((function(e) {
                    var s;
                    return Le(e) && !t || Zt(e, 1) ? (s = i).push.apply(s, ei(e)) : i.push(e)
                })) || i
            }(e, i) : Zt(e) ? Kt.call(e, 0) : e ? [e] : [] : Kt.call((t || de).querySelectorAll(e), 0)
        },
        ti = function(e) {
            return e = ei(e)[0] || Ue("Invalid scope") || {},
                function(t) {
                    var i = e.current || e.nativeElement || e;
                    return ei(t, i.querySelectorAll ? i : i === e ? Ue("Invalid scope") || de.createElement("div") : e)
                }
        },
        ii = function(e) {
            return e.sort((function() {
                return .5 - Math.random()
            }))
        },
        si = function(e) {
            if (Me(e)) return e;
            var t = Oe(e) ? e : {
                    each: e
                },
                i = Oi(t.ease),
                s = t.from || 0,
                r = parseFloat(t.base) || 0,
                n = {},
                a = s > 0 && s < 1,
                o = isNaN(s) || a,
                l = t.axis,
                d = s,
                c = s;
            return Le(s) ? d = c = {
                    center: .5,
                    edges: .5,
                    end: 1
                }[s] || 0 : !a && o && (d = s[0], c = s[1]),
                function(e, a, u) {
                    var p, h, f, m, g, v, y, _, w, b = (u || t).length,
                        S = n[b];
                    if (!S) {
                        if (!(w = "auto" === t.grid ? 0 : (t.grid || [1, we])[1])) {
                            for (y = -we; y < (y = u[w++].getBoundingClientRect().left) && w < b;);
                            w--
                        }
                        for (S = n[b] = [], p = o ? Math.min(w, b) * d - .5 : s % w, h = w === we ? 0 : o ? b * c / w - .5 : s / w | 0, y = 0, _ = we, v = 0; v < b; v++) f = v % w - p, m = h - (v / w | 0), S[v] = g = l ? Math.abs("y" === l ? m : f) : Ee(f * f + m * m), g > y && (y = g), g < _ && (_ = g);
                        "random" === s && ii(S), S.max = y - _, S.min = _, S.v = b = (parseFloat(t.amount) || parseFloat(t.each) * (w > b ? b - 1 : l ? "y" === l ? b / w : w : Math.max(w, b / w)) || 0) * ("edges" === s ? -1 : 1), S.b = b < 0 ? r - b : r, S.u = Jt(t.amount || t.each) || 0, i = i && b < 0 ? ki(i) : i
                    }
                    return b = (S[e] - S.min) / S.max || 0, ft(S.b + (i ? i(b) : b) * S.v) + S.u
                }
        },
        ri = function(e) {
            var t = Math.pow(10, ((e + "").split(".")[1] || "").length);
            return function(i) {
                var s = ft(Math.round(parseFloat(i) / e) * e * t);
                return (s - s % 1) / t + (ke(i) ? 0 : Jt(i))
            }
        },
        ni = function(e, t) {
            var i, s, r = Be(e);
            return !r && Oe(e) && (i = r = e.radius || we, e.values ? (e = ei(e.values), (s = !ke(e[0])) && (i *= i)) : e = ri(e.increment)), Ut(t, r ? Me(e) ? function(t) {
                return s = e(t), Math.abs(s - t) <= i ? s : t
            } : function(t) {
                for (var r, n, a = parseFloat(s ? t.x : t), o = parseFloat(s ? t.y : 0), l = we, d = 0, c = e.length; c--;)(r = s ? (r = e[c].x - a) * r + (n = e[c].y - o) * n : Math.abs(e[c] - a)) < l && (l = r, d = c);
                return d = !i || l <= i ? e[d] : t, s || d === t || ke(t) ? d : d + Jt(t)
            } : ri(e))
        },
        ai = function(e, t, i, s) {
            return Ut(Be(e) ? !t : !0 === i ? !!(i = 0) : !s, (function() {
                return Be(e) ? e[~~(Math.random() * e.length)] : (i = i || 1e-5) && (s = i < 1 ? Math.pow(10, (i + "").length - 2) : 1) && Math.floor(Math.round((e - i / 2 + Math.random() * (t - e + .99 * i)) / i) * i * s) / s
            }))
        },
        oi = function(e, t, i) {
            return Ut(i, (function(i) {
                return e[~~t(i)]
            }))
        },
        li = function(e) {
            for (var t, i, s, r, n = 0, a = ""; ~(t = e.indexOf("random(", n));) s = e.indexOf(")", t), r = "[" === e.charAt(t + 7), i = e.substr(t + 7, s - t - 7).match(r ? Ve : Re), a += e.substr(n, t - n) + ai(r ? i : +i[0], r ? 0 : +i[1], +i[2] || 1e-5), n = s + 1;
            return a + e.substr(n, e.length - n)
        },
        di = function(e, t, i, s, r) {
            var n = t - e,
                a = s - i;
            return Ut(r, (function(t) {
                return i + ((t - e) / n * a || 0)
            }))
        },
        ci = function(e, t, i) {
            var s, r, n, a = e.labels,
                o = we;
            for (s in a)(r = a[s] - t) < 0 == !!i && r && o > (r = Math.abs(r)) && (n = s, o = r);
            return n
        },
        ui = function(e, t, i) {
            var s, r, n, a = e.vars,
                o = a[t],
                l = ne,
                d = e._ctx;
            if (o) return s = a[t + "Params"], r = a.callbackScope || e, i && it.length && vt(), d && (ne = d), n = s ? o.apply(r, s) : o.call(r), ne = l, n
        },
        pi = function(e) {
            return Lt(e), e.scrollTrigger && e.scrollTrigger.kill(!!re), e.progress() < 1 && ui(e, "onInterrupt"), e
        },
        hi = [],
        fi = function(e) {
            if (Ie()) {
                var t = (e = !e.name && e.default || e).name,
                    i = Me(e),
                    s = t && !i && e.init ? function() {
                        this._props = []
                    } : e,
                    r = {
                        init: Je,
                        render: ns,
                        add: Vi,
                        kill: os,
                        modifier: as,
                        rawVars: 0
                    },
                    n = {
                        targetTest: 0,
                        get: 0,
                        getSetter: ts,
                        aliases: {},
                        register: 0
                    };
                if (Ei(), e !== s) {
                    if (rt[t]) return;
                    bt(s, bt(Tt(e, r), n)), St(s.prototype, St(r, Tt(e, n))), rt[s.prop = t] = s, e.targetTest && (ot.push(s), tt[t] = 1), t = ("css" === t ? "CSS" : t.charAt(0).toUpperCase() + t.substr(1)) + "Plugin"
                }
                Qe(t, s), e.register && e.register(Ss, s, cs)
            } else hi.push(e)
        },
        mi = 255,
        gi = {
            aqua: [0, mi, mi],
            lime: [0, mi, 0],
            silver: [192, 192, 192],
            black: [0, 0, 0],
            maroon: [128, 0, 0],
            teal: [0, 128, 128],
            blue: [0, 0, mi],
            navy: [0, 0, 128],
            white: [mi, mi, mi],
            olive: [128, 128, 0],
            yellow: [mi, mi, 0],
            orange: [mi, 165, 0],
            gray: [128, 128, 128],
            purple: [128, 0, 128],
            green: [0, 128, 0],
            red: [mi, 0, 0],
            pink: [mi, 192, 203],
            cyan: [0, mi, mi],
            transparent: [mi, mi, mi, 0]
        },
        vi = function(e, t, i) {
            return (6 * (e += e < 0 ? 1 : e > 1 ? -1 : 0) < 1 ? t + (i - t) * e * 6 : e < .5 ? i : 3 * e < 2 ? t + (i - t) * (2 / 3 - e) * 6 : t) * mi + .5 | 0
        },
        yi = function(e, t, i) {
            var s, r, n, a, o, l, d, c, u, p, h = e ? ke(e) ? [e >> 16, e >> 8 & mi, e & mi] : 0 : gi.black;
            if (!h) {
                if ("," === e.substr(-1) && (e = e.substr(0, e.length - 1)), gi[e]) h = gi[e];
                else if ("#" === e.charAt(0)) {
                    if (e.length < 6 && (s = e.charAt(1), r = e.charAt(2), n = e.charAt(3), e = "#" + s + s + r + r + n + n + (5 === e.length ? e.charAt(4) + e.charAt(4) : "")), 9 === e.length) return [(h = parseInt(e.substr(1, 6), 16)) >> 16, h >> 8 & mi, h & mi, parseInt(e.substr(7), 16) / 255];
                    h = [(e = parseInt(e.substr(1), 16)) >> 16, e >> 8 & mi, e & mi]
                } else if ("hsl" === e.substr(0, 3))
                    if (h = p = e.match(Re), t) {
                        if (~e.indexOf("=")) return h = e.match(Fe), i && h.length < 4 && (h[3] = 1), h
                    } else a = +h[0] % 360 / 360, o = +h[1] / 100, s = 2 * (l = +h[2] / 100) - (r = l <= .5 ? l * (o + 1) : l + o - l * o), h.length > 3 && (h[3] *= 1), h[0] = vi(a + 1 / 3, s, r), h[1] = vi(a, s, r), h[2] = vi(a - 1 / 3, s, r);
                else h = e.match(Re) || gi.transparent;
                h = h.map(Number)
            }
            return t && !p && (s = h[0] / mi, r = h[1] / mi, n = h[2] / mi, l = ((d = Math.max(s, r, n)) + (c = Math.min(s, r, n))) / 2, d === c ? a = o = 0 : (u = d - c, o = l > .5 ? u / (2 - d - c) : u / (d + c), a = d === s ? (r - n) / u + (r < n ? 6 : 0) : d === r ? (n - s) / u + 2 : (s - r) / u + 4, a *= 60), h[0] = ~~(a + .5), h[1] = ~~(100 * o + .5), h[2] = ~~(100 * l + .5)), i && h.length < 4 && (h[3] = 1), h
        },
        _i = function(e) {
            var t = [],
                i = [],
                s = -1;
            return e.split(bi).forEach((function(e) {
                var r = e.match(Ge) || [];
                t.push.apply(t, r), i.push(s += r.length + 1)
            })), t.c = i, t
        },
        wi = function(e, t, i) {
            var s, r, n, a, o = "",
                l = (e + o).match(bi),
                d = t ? "hsla(" : "rgba(",
                c = 0;
            if (!l) return e;
            if (l = l.map((function(e) {
                    return (e = yi(e, t, 1)) && d + (t ? e[0] + "," + e[1] + "%," + e[2] + "%," + e[3] : e.join(",")) + ")"
                })), i && (n = _i(e), (s = i.c).join(o) !== n.c.join(o)))
                for (a = (r = e.replace(bi, "1").split(Ge)).length - 1; c < a; c++) o += r[c] + (~s.indexOf(c) ? l.shift() || d + "0,0,0,0)" : (n.length ? n : l.length ? l : i).shift());
            if (!r)
                for (a = (r = e.split(bi)).length - 1; c < a; c++) o += r[c] + l[c];
            return o + r[a]
        },
        bi = function() {
            var e, t = "(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3,4}){1,2}\\b";
            for (e in gi) t += "|" + e + "\\b";
            return new RegExp(t + ")", "gi")
        }(),
        Si = /hsl[a]?\(/,
        xi = function(e) {
            var t, i = e.join(" ");
            if (bi.lastIndex = 0, bi.test(i)) return t = Si.test(i), e[1] = wi(e[1], t), e[0] = wi(e[0], t, _i(e[1])), !0
        },
        Ti = function() {
            var e, t, i, s, r, n, a = Date.now,
                o = 500,
                l = 33,
                d = a(),
                c = d,
                u = 1e3 / 240,
                p = u,
                h = [],
                f = function i(f) {
                    var m, g, v, y, _ = a() - c,
                        w = !0 === f;
                    if (_ > o && (d += _ - l), ((m = (v = (c += _) - d) - p) > 0 || w) && (y = ++s.frame, r = v - 1e3 * s.time, s.time = v /= 1e3, p += m + (m >= u ? 4 : u - m), g = 1), w || (e = t(i)), g)
                        for (n = 0; n < h.length; n++) h[n](v, r, y, f)
                };
            return s = {
                time: 0,
                frame: 0,
                tick: function() {
                    f(!0)
                },
                deltaRatio: function(e) {
                    return r / (1e3 / (e || 60))
                },
                wake: function() {
                    ce && (!le && Ie() && (oe = le = window, de = oe.document || {}, We.gsap = Ss, (oe.gsapVersions || (oe.gsapVersions = [])).push(Ss.version), Ye(je || oe.GreenSockGlobals || !oe.gsap && oe || {}), i = oe.requestAnimationFrame, hi.forEach(fi)), e && s.sleep(), t = i || function(e) {
                        return setTimeout(e, p - 1e3 * s.time + 1 | 0)
                    }, he = 1, f(2))
                },
                sleep: function() {
                    (i ? oe.cancelAnimationFrame : clearTimeout)(e), he = 0, t = Je
                },
                lagSmoothing: function(e, t) {
                    o = e || 1 / 0, l = Math.min(t || 33, o)
                },
                fps: function(e) {
                    u = 1e3 / (e || 240), p = 1e3 * s.time + u
                },
                add: function(e, t, i) {
                    var r = t ? function(t, i, n, a) {
                        e(t, i, n, a), s.remove(r)
                    } : e;
                    return s.remove(e), h[i ? "unshift" : "push"](r), Ei(), r
                },
                remove: function(e, t) {
                    ~(t = h.indexOf(e)) && h.splice(t, 1) && n >= t && n--
                },
                _listeners: h
            }
        }(),
        Ei = function() {
            return !he && Ti.wake()
        },
        Ai = {},
        Ci = /^[\d.\-M][\d.\-,\s]/,
        Li = /["']/g,
        Mi = function(e) {
            for (var t, i, s, r = {}, n = e.substr(1, e.length - 3).split(":"), a = n[0], o = 1, l = n.length; o < l; o++) i = n[o], t = o !== l - 1 ? i.lastIndexOf(",") : i.length, s = i.substr(0, t), r[a] = isNaN(s) ? s.replace(Li, "").trim() : +s, a = i.substr(t + 1).trim();
            return r
        },
        ki = function(e) {
            return function(t) {
                return 1 - e(1 - t)
            }
        },
        Pi = function e(t, i) {
            for (var s, r = t._first; r;) r instanceof Fi ? e(r, i) : !r.vars.yoyoEase || r._yoyo && r._repeat || r._yoyo === i || (r.timeline ? e(r.timeline, i) : (s = r._ease, r._ease = r._yEase, r._yEase = s, r._yoyo = i)), r = r._next
        },
        Oi = function(e, t) {
            return e && (Me(e) ? e : Ai[e] || function(e) {
                var t, i, s, r, n = (e + "").split("("),
                    a = Ai[n[0]];
                return a && n.length > 1 && a.config ? a.config.apply(null, ~e.indexOf("{") ? [Mi(n[1])] : (t = e, i = t.indexOf("(") + 1, s = t.indexOf(")"), r = t.indexOf("(", i), t.substring(i, ~r && r < s ? t.indexOf(")", s + 1) : s)).split(",").map(_t)) : Ai._CE && Ci.test(e) ? Ai._CE("", e) : a
            }(e)) || t
        },
        Di = function(e, t, i, s) {
            void 0 === i && (i = function(e) {
                return 1 - t(1 - e)
            }), void 0 === s && (s = function(e) {
                return e < .5 ? t(2 * e) / 2 : 1 - t(2 * (1 - e)) / 2
            });
            var r, n = {
                easeIn: t,
                easeOut: i,
                easeInOut: s
            };
            return pt(e, (function(e) {
                for (var t in Ai[e] = We[e] = n, Ai[r = e.toLowerCase()] = i, n) Ai[r + ("easeIn" === t ? ".in" : "easeOut" === t ? ".out" : ".inOut")] = Ai[e + "." + t] = n[t]
            })), n
        },
        Ii = function(e) {
            return function(t) {
                return t < .5 ? (1 - e(1 - 2 * t)) / 2 : .5 + e(2 * (t - .5)) / 2
            }
        },
        zi = function e(t, i, s) {
            var r = i >= 1 ? i : 1,
                n = (s || (t ? .3 : .45)) / (i < 1 ? i : 1),
                a = n / Se * (Math.asin(1 / r) || 0),
                o = function(e) {
                    return 1 === e ? 1 : r * Math.pow(2, -10 * e) * Ce((e - a) * n) + 1
                },
                l = "out" === t ? o : "in" === t ? function(e) {
                    return 1 - o(1 - e)
                } : Ii(o);
            return n = Se / n, l.config = function(i, s) {
                return e(t, i, s)
            }, l
        },
        qi = function e(t, i) {
            void 0 === i && (i = 1.70158);
            var s = function(e) {
                    return e ? --e * e * ((i + 1) * e + i) + 1 : 0
                },
                r = "out" === t ? s : "in" === t ? function(e) {
                    return 1 - s(1 - e)
                } : Ii(s);
            return r.config = function(i) {
                return e(t, i)
            }, r
        };
    pt("Linear,Quad,Cubic,Quart,Quint,Strong", (function(e, t) {
        var i = t < 5 ? t + 1 : t;
        Di(e + ",Power" + (i - 1), t ? function(e) {
            return Math.pow(e, i)
        } : function(e) {
            return e
        }, (function(e) {
            return 1 - Math.pow(1 - e, i)
        }), (function(e) {
            return e < .5 ? Math.pow(2 * e, i) / 2 : 1 - Math.pow(2 * (1 - e), i) / 2
        }))
    })), Ai.Linear.easeNone = Ai.none = Ai.Linear.easeIn, Di("Elastic", zi("in"), zi("out"), zi()), fe = 7.5625, ge = 1 / (me = 2.75), Di("Bounce", (function(e) {
        return 1 - ve(1 - e)
    }), ve = function(e) {
        return e < ge ? fe * e * e : e < .7272727272727273 ? fe * Math.pow(e - 1.5 / me, 2) + .75 : e < .9090909090909092 ? fe * (e -= 2.25 / me) * e + .9375 : fe * Math.pow(e - 2.625 / me, 2) + .984375
    }), Di("Expo", (function(e) {
        return e ? Math.pow(2, 10 * (e - 1)) : 0
    })), Di("Circ", (function(e) {
        return -(Ee(1 - e * e) - 1)
    })), Di("Sine", (function(e) {
        return 1 === e ? 1 : 1 - Ae(e * xe)
    })), Di("Back", qi("in"), qi("out"), qi()), Ai.SteppedEase = Ai.steps = We.SteppedEase = {
        config: function(e, t) {
            void 0 === e && (e = 1);
            var i = 1 / e,
                s = e + (t ? 0 : 1),
                r = t ? 1 : 0;
            return function(e) {
                return ((s * Qt(0, .99999999, e) | 0) + r) * i
            }
        }
    }, _e.ease = Ai["quad.out"], pt("onComplete,onUpdate,onStart,onRepeat,onReverseComplete,onInterrupt", (function(e) {
        return lt += e + "," + e + "Params,"
    }));
    var Bi = function(e, t) {
            this.id = Te++, e._gsap = this, this.target = e, this.harness = t, this.get = t ? t.get : ut, this.set = t ? t.getSetter : ts
        },
        Ri = function() {
            function e(e) {
                this.vars = e, this._delay = +e.delay || 0, (this._repeat = e.repeat === 1 / 0 ? -2 : e.repeat || 0) && (this._rDelay = e.repeatDelay || 0, this._yoyo = !!e.yoyo || !!e.yoyoEase), this._ts = 1, Ht(this, +e.duration, 1, 1), this.data = e.data, ne && (this._ctx = ne, ne.data.push(this)), he || Ti.wake()
            }
            var t = e.prototype;
            return t.delay = function(e) {
                return e || 0 === e ? (this.parent && this.parent.smoothChildTiming && this.startTime(this._start + e - this._delay), this._delay = e, this) : this._delay
            }, t.duration = function(e) {
                return arguments.length ? this.totalDuration(this._repeat > 0 ? e + (e + this._rDelay) * this._repeat : e) : this.totalDuration() && this._dur
            }, t.totalDuration = function(e) {
                return arguments.length ? (this._dirty = 0, Ht(this, this._repeat < 0 ? e : (e - this._repeat * this._rDelay) / (this._repeat + 1))) : this._tDur
            }, t.totalTime = function(e, t) {
                if (Ei(), !arguments.length) return this._tTime;
                var i = this._dp;
                if (i && i.smoothChildTiming && this._ts) {
                    for (Bt(this, e), !i._dp || i.parent || Rt(i, this); i && i.parent;) i.parent._time !== i._start + (i._ts >= 0 ? i._tTime / i._ts : (i.totalDuration() - i._tTime) / -i._ts) && i.totalTime(i._tTime, !0), i = i.parent;
                    !this.parent && this._dp.autoRemoveChildren && (this._ts > 0 && e < this._tDur || this._ts < 0 && e > 0 || !this._tDur && !e) && Ft(this._dp, this, this._start - this._delay)
                }
                return (this._tTime !== e || !this._dur && !t || this._initted && Math.abs(this._zTime) === be || !e && !this._initted && (this.add || this._ptLookup)) && (this._ts || (this._pTime = e), yt(this, e, t)), this
            }, t.time = function(e, t) {
                return arguments.length ? this.totalTime(Math.min(this.totalDuration(), e + Dt(this)) % (this._dur + this._rDelay) || (e ? this._dur : 0), t) : this._time
            }, t.totalProgress = function(e, t) {
                return arguments.length ? this.totalTime(this.totalDuration() * e, t) : this.totalDuration() ? Math.min(1, this._tTime / this._tDur) : this.ratio
            }, t.progress = function(e, t) {
                return arguments.length ? this.totalTime(this.duration() * (!this._yoyo || 1 & this.iteration() ? e : 1 - e) + Dt(this), t) : this.duration() ? Math.min(1, this._time / this._dur) : this.ratio
            }, t.iteration = function(e, t) {
                var i = this.duration() + this._rDelay;
                return arguments.length ? this.totalTime(this._time + (e - 1) * i, t) : this._repeat ? It(this._tTime, i) + 1 : 1
            }, t.timeScale = function(e) {
                if (!arguments.length) return -1e-8 === this._rts ? 0 : this._rts;
                if (this._rts === e) return this;
                var t = this.parent && this._ts ? zt(this.parent._time, this) : this._tTime;
                return this._rts = +e || 0, this._ts = this._ps || -1e-8 === e ? 0 : this._rts, this.totalTime(Qt(-Math.abs(this._delay), this._tDur, t), !0), qt(this), kt(this)
            }, t.paused = function(e) {
                return arguments.length ? (this._ps !== e && (this._ps = e, e ? (this._pTime = this._tTime || Math.max(-this._delay, this.rawTime()), this._ts = this._act = 0) : (Ei(), this._ts = this._rts, this.totalTime(this.parent && !this.parent.smoothChildTiming ? this.rawTime() : this._tTime || this._pTime, 1 === this.progress() && Math.abs(this._zTime) !== be && (this._tTime -= be)))), this) : this._ps
            }, t.startTime = function(e) {
                if (arguments.length) {
                    this._start = e;
                    var t = this.parent || this._dp;
                    return t && (t._sort || !this.parent) && Ft(t, this, e - this._delay), this
                }
                return this._start
            }, t.endTime = function(e) {
                return this._start + (De(e) ? this.totalDuration() : this.duration()) / Math.abs(this._ts || 1)
            }, t.rawTime = function(e) {
                var t = this.parent || this._dp;
                return t ? e && (!this._ts || this._repeat && this._time && this.totalProgress() < 1) ? this._tTime % (this._dur + this._rDelay) : this._ts ? zt(t.rawTime(e), this) : this._tTime : this._tTime
            }, t.revert = function(e) {
                void 0 === e && (e = et);
                var t = re;
                return re = e, (this._initted || this._startAt) && (this.timeline && this.timeline.revert(e), this.totalTime(-.01, e.suppressEvents)), "nested" !== this.data && !1 !== e.kill && this.kill(), re = t, this
            }, t.globalTime = function(e) {
                for (var t = this, i = arguments.length ? e : t.rawTime(); t;) i = t._start + i / (t._ts || 1), t = t._dp;
                return !this.parent && this._sat ? this._sat.vars.immediateRender ? -1 : this._sat.globalTime(e) : i
            }, t.repeat = function(e) {
                return arguments.length ? (this._repeat = e === 1 / 0 ? -2 : e, Wt(this)) : -2 === this._repeat ? 1 / 0 : this._repeat
            }, t.repeatDelay = function(e) {
                if (arguments.length) {
                    var t = this._time;
                    return this._rDelay = e, Wt(this), t ? this.time(t) : this
                }
                return this._rDelay
            }, t.yoyo = function(e) {
                return arguments.length ? (this._yoyo = e, this) : this._yoyo
            }, t.seek = function(e, t) {
                return this.totalTime(Yt(this, e), De(t))
            }, t.restart = function(e, t) {
                return this.play().totalTime(e ? -this._delay : 0, De(t))
            }, t.play = function(e, t) {
                return null != e && this.seek(e, t), this.reversed(!1).paused(!1)
            }, t.reverse = function(e, t) {
                return null != e && this.seek(e || this.totalDuration(), t), this.reversed(!0).paused(!1)
            }, t.pause = function(e, t) {
                return null != e && this.seek(e, t), this.paused(!0)
            }, t.resume = function() {
                return this.paused(!1)
            }, t.reversed = function(e) {
                return arguments.length ? (!!e !== this.reversed() && this.timeScale(-this._rts || (e ? -1e-8 : 0)), this) : this._rts < 0
            }, t.invalidate = function() {
                return this._initted = this._act = 0, this._zTime = -1e-8, this
            }, t.isActive = function() {
                var e, t = this.parent || this._dp,
                    i = this._start;
                return !(t && !(this._ts && this._initted && t.isActive() && (e = t.rawTime(!0)) >= i && e < this.endTime(!0) - be))
            }, t.eventCallback = function(e, t, i) {
                var s = this.vars;
                return arguments.length > 1 ? (t ? (s[e] = t, i && (s[e + "Params"] = i), "onUpdate" === e && (this._onUpdate = t)) : delete s[e], this) : s[e]
            }, t.then = function(e) {
                var t = this;
                return new Promise((function(i) {
                    var s = Me(e) ? e : wt,
                        r = function() {
                            var e = t.then;
                            t.then = null, Me(s) && (s = s(t)) && (s.then || s === t) && (t.then = e), i(s), t.then = e
                        };
                    t._initted && 1 === t.totalProgress() && t._ts >= 0 || !t._tTime && t._ts < 0 ? r() : t._prom = r
                }))
            }, t.kill = function() {
                pi(this)
            }, e
        }();
    bt(Ri.prototype, {
        _time: 0,
        _start: 0,
        _end: 0,
        _tTime: 0,
        _tDur: 0,
        _dirty: 0,
        _repeat: 0,
        _yoyo: !1,
        parent: null,
        _initted: !1,
        _rDelay: 0,
        _ts: 1,
        _dp: 0,
        ratio: 0,
        _zTime: -1e-8,
        _prom: 0,
        _ps: !1,
        _rts: 1
    });
    var Fi = function(e) {
        function t(t, i) {
            var s;
            return void 0 === t && (t = {}), (s = e.call(this, t) || this).labels = {}, s.smoothChildTiming = !!t.smoothChildTiming, s.autoRemoveChildren = !!t.autoRemoveChildren, s._sort = De(t.sortChildren), ae && Ft(t.parent || ae, te(s), i), t.reversed && s.reverse(), t.paused && s.paused(!0), t.scrollTrigger && Gt(te(s), t.scrollTrigger), s
        }
        ie(t, e);
        var i = t.prototype;
        return i.to = function(e, t, i) {
            return Xt(0, arguments, this), this
        }, i.from = function(e, t, i) {
            return Xt(1, arguments, this), this
        }, i.fromTo = function(e, t, i, s) {
            return Xt(2, arguments, this), this
        }, i.set = function(e, t, i) {
            return t.duration = 0, t.parent = this, Et(t).repeatDelay || (t.repeat = 0), t.immediateRender = !!t.immediateRender, new Qi(e, t, Yt(this, i), 1), this
        }, i.call = function(e, t, i) {
            return Ft(this, Qi.delayedCall(0, e, t), i)
        }, i.staggerTo = function(e, t, i, s, r, n, a) {
            return i.duration = t, i.stagger = i.stagger || s, i.onComplete = n, i.onCompleteParams = a, i.parent = this, new Qi(e, i, Yt(this, r)), this
        }, i.staggerFrom = function(e, t, i, s, r, n, a) {
            return i.runBackwards = 1, Et(i).immediateRender = De(i.immediateRender), this.staggerTo(e, t, i, s, r, n, a)
        }, i.staggerFromTo = function(e, t, i, s, r, n, a, o) {
            return s.startAt = i, Et(s).immediateRender = De(s.immediateRender), this.staggerTo(e, t, s, r, n, a, o)
        }, i.render = function(e, t, i) {
            var s, r, n, a, o, l, d, c, u, p, h, f, m = this._time,
                g = this._dirty ? this.totalDuration() : this._tDur,
                v = this._dur,
                y = e <= 0 ? 0 : ft(e),
                _ = this._zTime < 0 != e < 0 && (this._initted || !v);
            if (this !== ae && y > g && e >= 0 && (y = g), y !== this._tTime || i || _) {
                if (m !== this._time && v && (y += this._time - m, e += this._time - m), s = y, u = this._start, l = !(c = this._ts), _ && (v || (m = this._zTime), (e || !t) && (this._zTime = e)), this._repeat) {
                    if (h = this._yoyo, o = v + this._rDelay, this._repeat < -1 && e < 0) return this.totalTime(100 * o + e, t, i);
                    if (s = ft(y % o), y === g ? (a = this._repeat, s = v) : ((a = ~~(y / o)) && a === y / o && (s = v, a--), s > v && (s = v)), p = It(this._tTime, o), !m && this._tTime && p !== a && this._tTime - p * o - this._dur <= 0 && (p = a), h && 1 & a && (s = v - s, f = 1), a !== p && !this._lock) {
                        var w = h && 1 & p,
                            b = w === (h && 1 & a);
                        if (a < p && (w = !w), m = w ? 0 : v, this._lock = 1, this.render(m || (f ? 0 : ft(a * o)), t, !v)._lock = 0, this._tTime = y, !t && this.parent && ui(this, "onRepeat"), this.vars.repeatRefresh && !f && (this.invalidate()._lock = 1), m && m !== this._time || l !== !this._ts || this.vars.onRepeat && !this.parent && !this._act) return this;
                        if (v = this._dur, g = this._tDur, b && (this._lock = 2, m = w ? v : -1e-4, this.render(m, !0), this.vars.repeatRefresh && !f && this.invalidate()), this._lock = 0, !this._ts && !l) return this;
                        Pi(this, f)
                    }
                }
                if (this._hasPause && !this._forcing && this._lock < 2 && (d = function(e, t, i) {
                        var s;
                        if (i > t)
                            for (s = e._first; s && s._start <= i;) {
                                if ("isPause" === s.data && s._start > t) return s;
                                s = s._next
                            } else
                                for (s = e._last; s && s._start >= i;) {
                                    if ("isPause" === s.data && s._start < t) return s;
                                    s = s._prev
                                }
                    }(this, ft(m), ft(s))) && (y -= s - (s = d._start)), this._tTime = y, this._time = s, this._act = !c, this._initted || (this._onUpdate = this.vars.onUpdate, this._initted = 1, this._zTime = e, m = 0), !m && s && !t && !a && (ui(this, "onStart"), this._tTime !== y)) return this;
                if (s >= m && e >= 0)
                    for (r = this._first; r;) {
                        if (n = r._next, (r._act || s >= r._start) && r._ts && d !== r) {
                            if (r.parent !== this) return this.render(e, t, i);
                            if (r.render(r._ts > 0 ? (s - r._start) * r._ts : (r._dirty ? r.totalDuration() : r._tDur) + (s - r._start) * r._ts, t, i), s !== this._time || !this._ts && !l) {
                                d = 0, n && (y += this._zTime = -1e-8);
                                break
                            }
                        }
                        r = n
                    } else {
                        r = this._last;
                        for (var S = e < 0 ? e : s; r;) {
                            if (n = r._prev, (r._act || S <= r._end) && r._ts && d !== r) {
                                if (r.parent !== this) return this.render(e, t, i);
                                if (r.render(r._ts > 0 ? (S - r._start) * r._ts : (r._dirty ? r.totalDuration() : r._tDur) + (S - r._start) * r._ts, t, i || re && (r._initted || r._startAt)), s !== this._time || !this._ts && !l) {
                                    d = 0, n && (y += this._zTime = S ? -1e-8 : be);
                                    break
                                }
                            }
                            r = n
                        }
                    }
                if (d && !t && (this.pause(), d.render(s >= m ? 0 : -1e-8)._zTime = s >= m ? 1 : -1, this._ts)) return this._start = u, qt(this), this.render(e, t, i);
                this._onUpdate && !t && ui(this, "onUpdate", !0), (y === g && this._tTime >= this.totalDuration() || !y && m) && (u !== this._start && Math.abs(c) === Math.abs(this._ts) || this._lock || ((e || !v) && (y === g && this._ts > 0 || !y && this._ts < 0) && Lt(this, 1), t || e < 0 && !m || !y && !m && g || (ui(this, y === g && e >= 0 ? "onComplete" : "onReverseComplete", !0), this._prom && !(y < g && this.timeScale() > 0) && this._prom())))
            }
            return this
        }, i.add = function(e, t) {
            var i = this;
            if (ke(t) || (t = Yt(this, t, e)), !(e instanceof Ri)) {
                if (Be(e)) return e.forEach((function(e) {
                    return i.add(e, t)
                })), this;
                if (Le(e)) return this.addLabel(e, t);
                if (!Me(e)) return this;
                e = Qi.delayedCall(0, e)
            }
            return this !== e ? Ft(this, e, t) : this
        }, i.getChildren = function(e, t, i, s) {
            void 0 === e && (e = !0), void 0 === t && (t = !0), void 0 === i && (i = !0), void 0 === s && (s = -we);
            for (var r = [], n = this._first; n;) n._start >= s && (n instanceof Qi ? t && r.push(n) : (i && r.push(n), e && r.push.apply(r, n.getChildren(!0, t, i)))), n = n._next;
            return r
        }, i.getById = function(e) {
            for (var t = this.getChildren(1, 1, 1), i = t.length; i--;)
                if (t[i].vars.id === e) return t[i]
        }, i.remove = function(e) {
            return Le(e) ? this.removeLabel(e) : Me(e) ? this.killTweensOf(e) : (Ct(this, e), e === this._recent && (this._recent = this._last), Mt(this))
        }, i.totalTime = function(t, i) {
            return arguments.length ? (this._forcing = 1, !this._dp && this._ts && (this._start = ft(Ti.time - (this._ts > 0 ? t / this._ts : (this.totalDuration() - t) / -this._ts))), e.prototype.totalTime.call(this, t, i), this._forcing = 0, this) : this._tTime
        }, i.addLabel = function(e, t) {
            return this.labels[e] = Yt(this, t), this
        }, i.removeLabel = function(e) {
            return delete this.labels[e], this
        }, i.addPause = function(e, t, i) {
            var s = Qi.delayedCall(0, t || Je, i);
            return s.data = "isPause", this._hasPause = 1, Ft(this, s, Yt(this, e))
        }, i.removePause = function(e) {
            var t = this._first;
            for (e = Yt(this, e); t;) t._start === e && "isPause" === t.data && Lt(t), t = t._next
        }, i.killTweensOf = function(e, t, i) {
            for (var s = this.getTweensOf(e, i), r = s.length; r--;) Gi !== s[r] && s[r].kill(e, t);
            return this
        }, i.getTweensOf = function(e, t) {
            for (var i, s = [], r = ei(e), n = this._first, a = ke(t); n;) n instanceof Qi ? gt(n._targets, r) && (a ? (!Gi || n._initted && n._ts) && n.globalTime(0) <= t && n.globalTime(n.totalDuration()) > t : !t || n.isActive()) && s.push(n) : (i = n.getTweensOf(r, t)).length && s.push.apply(s, i), n = n._next;
            return s
        }, i.tweenTo = function(e, t) {
            t = t || {};
            var i, s = this,
                r = Yt(s, e),
                n = t,
                a = n.startAt,
                o = n.onStart,
                l = n.onStartParams,
                d = n.immediateRender,
                c = Qi.to(s, bt({
                    ease: t.ease || "none",
                    lazy: !1,
                    immediateRender: !1,
                    time: r,
                    overwrite: "auto",
                    duration: t.duration || Math.abs((r - (a && "time" in a ? a.time : s._time)) / s.timeScale()) || be,
                    onStart: function() {
                        if (s.pause(), !i) {
                            var e = t.duration || Math.abs((r - (a && "time" in a ? a.time : s._time)) / s.timeScale());
                            c._dur !== e && Ht(c, e, 0, 1).render(c._time, !0, !0), i = 1
                        }
                        o && o.apply(c, l || [])
                    }
                }, t));
            return d ? c.render(0) : c
        }, i.tweenFromTo = function(e, t, i) {
            return this.tweenTo(t, bt({
                startAt: {
                    time: Yt(this, e)
                }
            }, i))
        }, i.recent = function() {
            return this._recent
        }, i.nextLabel = function(e) {
            return void 0 === e && (e = this._time), ci(this, Yt(this, e))
        }, i.previousLabel = function(e) {
            return void 0 === e && (e = this._time), ci(this, Yt(this, e), 1)
        }, i.currentLabel = function(e) {
            return arguments.length ? this.seek(e, !0) : this.previousLabel(this._time + be)
        }, i.shiftChildren = function(e, t, i) {
            void 0 === i && (i = 0);
            for (var s, r = this._first, n = this.labels; r;) r._start >= i && (r._start += e, r._end += e), r = r._next;
            if (t)
                for (s in n) n[s] >= i && (n[s] += e);
            return Mt(this)
        }, i.invalidate = function(t) {
            var i = this._first;
            for (this._lock = 0; i;) i.invalidate(t), i = i._next;
            return e.prototype.invalidate.call(this, t)
        }, i.clear = function(e) {
            void 0 === e && (e = !0);
            for (var t, i = this._first; i;) t = i._next, this.remove(i), i = t;
            return this._dp && (this._time = this._tTime = this._pTime = 0), e && (this.labels = {}), Mt(this)
        }, i.totalDuration = function(e) {
            var t, i, s, r = 0,
                n = this,
                a = n._last,
                o = we;
            if (arguments.length) return n.timeScale((n._repeat < 0 ? n.duration() : n.totalDuration()) / (n.reversed() ? -e : e));
            if (n._dirty) {
                for (s = n.parent; a;) t = a._prev, a._dirty && a.totalDuration(), (i = a._start) > o && n._sort && a._ts && !n._lock ? (n._lock = 1, Ft(n, a, i - a._delay, 1)._lock = 0) : o = i, i < 0 && a._ts && (r -= i, (!s && !n._dp || s && s.smoothChildTiming) && (n._start += i / n._ts, n._time -= i, n._tTime -= i), n.shiftChildren(-i, !1, -Infinity), o = 0), a._end > r && a._ts && (r = a._end), a = t;
                Ht(n, n === ae && n._time > r ? n._time : r, 1, 1), n._dirty = 0
            }
            return n._tDur
        }, t.updateRoot = function(e) {
            if (ae._ts && (yt(ae, zt(e, ae)), ue = Ti.frame), Ti.frame >= at) {
                at += ye.autoSleep || 120;
                var t = ae._first;
                if ((!t || !t._ts) && ye.autoSleep && Ti._listeners.length < 2) {
                    for (; t && !t._ts;) t = t._next;
                    t || Ti.sleep()
                }
            }
        }, t
    }(Ri);
    bt(Fi.prototype, {
        _lock: 0,
        _hasPause: 0,
        _forcing: 0
    });
    var Gi, $i, Ni = function(e, t, i, s, r, n, a) {
            var o, l, d, c, u, p, h, f, m = new cs(this._pt, e, t, 0, 1, rs, null, r),
                g = 0,
                v = 0;
            for (m.b = i, m.e = s, i += "", (h = ~(s += "").indexOf("random(")) && (s = li(s)), n && (n(f = [i, s], e, t), i = f[0], s = f[1]), l = i.match($e) || []; o = $e.exec(s);) c = o[0], u = s.substring(g, o.index), d ? d = (d + 1) % 5 : "rgba(" === u.substr(-5) && (d = 1), c !== l[v++] && (p = parseFloat(l[v - 1]) || 0, m._pt = {
                _next: m._pt,
                p: u || 1 === v ? u : ",",
                s: p,
                c: "=" === c.charAt(1) ? mt(p, c) - p : parseFloat(c) - p,
                m: d && d < 4 ? Math.round : 0
            }, g = $e.lastIndex);
            return m.c = g < s.length ? s.substring(g, s.length) : "", m.fp = a, (Ne.test(s) || h) && (m.e = 0), this._pt = m, m
        },
        Vi = function(e, t, i, s, r, n, a, o, l, d) {
            Me(s) && (s = s(r || 0, e, n));
            var c, u = e[t],
                p = "get" !== i ? i : Me(u) ? l ? e[t.indexOf("set") || !Me(e["get" + t.substr(3)]) ? t : "get" + t.substr(3)](l) : e[t]() : u,
                h = Me(u) ? l ? Zi : Ki : Ji;
            if (Le(s) && (~s.indexOf("random(") && (s = li(s)), "=" === s.charAt(1) && ((c = mt(p, s) + (Jt(p) || 0)) || 0 === c) && (s = c)), !d || p !== s || $i) return isNaN(p * s) || "" === s ? (!u && !(t in e) && Xe(t, s), Ni.call(this, e, t, p, s, h, o || ye.stringFilter, l)) : (c = new cs(this._pt, e, t, +p || 0, s - (p || 0), "boolean" == typeof u ? ss : is, 0, h), l && (c.fp = l), a && c.modifier(a, this, e), this._pt = c)
        },
        Hi = function(e, t, i, s, r, n) {
            var a, o, l, d;
            if (rt[e] && !1 !== (a = new rt[e]).init(r, a.rawVars ? t[e] : function(e, t, i, s, r) {
                    if (Me(e) && (e = Yi(e, r, t, i, s)), !Oe(e) || e.style && e.nodeType || Be(e) || qe(e)) return Le(e) ? Yi(e, r, t, i, s) : e;
                    var n, a = {};
                    for (n in e) a[n] = Yi(e[n], r, t, i, s);
                    return a
                }(t[e], s, r, n, i), i, s, n) && (i._pt = o = new cs(i._pt, r, e, 0, 1, a.render, a, 0, a.priority), i !== pe))
                for (l = i._ptLookup[i._targets.indexOf(r)], d = a._props.length; d--;) l[a._props[d]] = o;
            return a
        },
        Wi = function e(t, i, s) {
            var r, n, a, o, l, d, c, u, p, h, f, m, g, v = t.vars,
                y = v.ease,
                _ = v.startAt,
                w = v.immediateRender,
                b = v.lazy,
                S = v.onUpdate,
                x = v.onUpdateParams,
                T = v.callbackScope,
                E = v.runBackwards,
                A = v.yoyoEase,
                C = v.keyframes,
                L = v.autoRevert,
                M = t._dur,
                k = t._startAt,
                P = t._targets,
                O = t.parent,
                D = O && "nested" === O.data ? O.vars.targets : P,
                I = "auto" === t._overwrite && !se,
                z = t.timeline;
            if (z && (!C || !y) && (y = "none"), t._ease = Oi(y, _e.ease), t._yEase = A ? ki(Oi(!0 === A ? y : A, _e.ease)) : 0, A && t._yoyo && !t._repeat && (A = t._yEase, t._yEase = t._ease, t._ease = A), t._from = !z && !!v.runBackwards, !z || C && !v.stagger) {
                if (m = (u = P[0] ? ct(P[0]).harness : 0) && v[u.prop], r = Tt(v, tt), k && (k._zTime < 0 && k.progress(1), i < 0 && E && w && !L ? k.render(-1, !0) : k.revert(E && M ? Ze : Ke), k._lazy = 0), _) {
                    if (Lt(t._startAt = Qi.set(P, bt({
                            data: "isStart",
                            overwrite: !1,
                            parent: O,
                            immediateRender: !0,
                            lazy: !k && De(b),
                            startAt: null,
                            delay: 0,
                            onUpdate: S,
                            onUpdateParams: x,
                            callbackScope: T,
                            stagger: 0
                        }, _))), t._startAt._dp = 0, t._startAt._sat = t, i < 0 && (re || !w && !L) && t._startAt.revert(Ze), w && M && i <= 0 && s <= 0) return void(i && (t._zTime = i))
                } else if (E && M && !k)
                    if (i && (w = !1), a = bt({
                            overwrite: !1,
                            data: "isFromStart",
                            lazy: w && !k && De(b),
                            immediateRender: w,
                            stagger: 0,
                            parent: O
                        }, r), m && (a[u.prop] = m), Lt(t._startAt = Qi.set(P, a)), t._startAt._dp = 0, t._startAt._sat = t, i < 0 && (re ? t._startAt.revert(Ze) : t._startAt.render(-1, !0)), t._zTime = i, w) {
                        if (!i) return
                    } else e(t._startAt, be, be);
                for (t._pt = t._ptCache = 0, b = M && De(b) || b && !M, n = 0; n < P.length; n++) {
                    if (c = (l = P[n])._gsap || dt(P)[n]._gsap, t._ptLookup[n] = h = {}, st[c.id] && it.length && vt(), f = D === P ? n : D.indexOf(l), u && !1 !== (p = new u).init(l, m || r, t, f, D) && (t._pt = o = new cs(t._pt, l, p.name, 0, 1, p.render, p, 0, p.priority), p._props.forEach((function(e) {
                            h[e] = o
                        })), p.priority && (d = 1)), !u || m)
                        for (a in r) rt[a] && (p = Hi(a, r, t, f, l, D)) ? p.priority && (d = 1) : h[a] = o = Vi.call(t, l, a, "get", r[a], f, D, 0, v.stringFilter);
                    t._op && t._op[n] && t.kill(l, t._op[n]), I && t._pt && (Gi = t, ae.killTweensOf(l, h, t.globalTime(i)), g = !t.parent, Gi = 0), t._pt && b && (st[c.id] = 1)
                }
                d && ds(t), t._onInit && t._onInit(t)
            }
            t._onUpdate = S, t._initted = (!t._op || t._pt) && !g, C && i <= 0 && z.render(we, !0, !0)
        },
        ji = function(e, t, i, s) {
            var r, n, a = t.ease || s || "power1.inOut";
            if (Be(t)) n = i[e] || (i[e] = []), t.forEach((function(e, i) {
                return n.push({
                    t: i / (t.length - 1) * 100,
                    v: e,
                    e: a
                })
            }));
            else
                for (r in t) n = i[r] || (i[r] = []), "ease" === r || n.push({
                    t: parseFloat(e),
                    v: t[r],
                    e: a
                })
        },
        Yi = function(e, t, i, s, r) {
            return Me(e) ? e.call(t, i, s, r) : Le(e) && ~e.indexOf("random(") ? li(e) : e
        },
        Xi = lt + "repeat,repeatDelay,yoyo,repeatRefresh,yoyoEase,autoRevert",
        Ui = {};
    pt(Xi + ",id,stagger,delay,duration,paused,scrollTrigger", (function(e) {
        return Ui[e] = 1
    }));
    var Qi = function(e) {
        function t(t, i, s, r) {
            var n;
            "number" == typeof i && (s.duration = i, i = s, s = null);
            var a, o, l, d, c, u, p, h, f = (n = e.call(this, r ? i : Et(i)) || this).vars,
                m = f.duration,
                g = f.delay,
                v = f.immediateRender,
                y = f.stagger,
                _ = f.overwrite,
                w = f.keyframes,
                b = f.defaults,
                S = f.scrollTrigger,
                x = f.yoyoEase,
                T = i.parent || ae,
                E = (Be(t) || qe(t) ? ke(t[0]) : "length" in i) ? [t] : ei(t);
            if (n._targets = E.length ? dt(E) : Ue("GSAP target " + t + " not found. https://greensock.com", !ye.nullTargetWarn) || [], n._ptLookup = [], n._overwrite = _, w || y || ze(m) || ze(g)) {
                if (i = n.vars, (a = n.timeline = new Fi({
                        data: "nested",
                        defaults: b || {},
                        targets: T && "nested" === T.data ? T.vars.targets : E
                    })).kill(), a.parent = a._dp = te(n), a._start = 0, y || ze(m) || ze(g)) {
                    if (d = E.length, p = y && si(y), Oe(y))
                        for (c in y) ~Xi.indexOf(c) && (h || (h = {}), h[c] = y[c]);
                    for (o = 0; o < d; o++)(l = Tt(i, Ui)).stagger = 0, x && (l.yoyoEase = x), h && St(l, h), u = E[o], l.duration = +Yi(m, te(n), o, u, E), l.delay = (+Yi(g, te(n), o, u, E) || 0) - n._delay, !y && 1 === d && l.delay && (n._delay = g = l.delay, n._start += g, l.delay = 0), a.to(u, l, p ? p(o, u, E) : 0), a._ease = Ai.none;
                    a.duration() ? m = g = 0 : n.timeline = 0
                } else if (w) {
                    Et(bt(a.vars.defaults, {
                        ease: "none"
                    })), a._ease = Oi(w.ease || i.ease || "none");
                    var A, C, L, M = 0;
                    if (Be(w)) w.forEach((function(e) {
                        return a.to(E, e, ">")
                    })), a.duration();
                    else {
                        for (c in l = {}, w) "ease" === c || "easeEach" === c || ji(c, w[c], l, w.easeEach);
                        for (c in l)
                            for (A = l[c].sort((function(e, t) {
                                    return e.t - t.t
                                })), M = 0, o = 0; o < A.length; o++)(L = {
                                ease: (C = A[o]).e,
                                duration: (C.t - (o ? A[o - 1].t : 0)) / 100 * m
                            })[c] = C.v, a.to(E, L, M), M += L.duration;
                        a.duration() < m && a.to({}, {
                            duration: m - a.duration()
                        })
                    }
                }
                m || n.duration(m = a.duration())
            } else n.timeline = 0;
            return !0 !== _ || se || (Gi = te(n), ae.killTweensOf(E), Gi = 0), Ft(T, te(n), s), i.reversed && n.reverse(), i.paused && n.paused(!0), (v || !m && !w && n._start === ft(T._time) && De(v) && Ot(te(n)) && "nested" !== T.data) && (n._tTime = -1e-8, n.render(Math.max(0, -g) || 0)), S && Gt(te(n), S), n
        }
        ie(t, e);
        var i = t.prototype;
        return i.render = function(e, t, i) {
            var s, r, n, a, o, l, d, c, u, p = this._time,
                h = this._tDur,
                f = this._dur,
                m = e < 0,
                g = e > h - be && !m ? h : e < be ? 0 : e;
            if (f) {
                if (g !== this._tTime || !e || i || !this._initted && this._tTime || this._startAt && this._zTime < 0 !== m) {
                    if (s = g, c = this.timeline, this._repeat) {
                        if (a = f + this._rDelay, this._repeat < -1 && m) return this.totalTime(100 * a + e, t, i);
                        if (s = ft(g % a), g === h ? (n = this._repeat, s = f) : ((n = ~~(g / a)) && n === g / a && (s = f, n--), s > f && (s = f)), (l = this._yoyo && 1 & n) && (u = this._yEase, s = f - s), o = It(this._tTime, a), s === p && !i && this._initted) return this._tTime = g, this;
                        n !== o && (c && this._yEase && Pi(c, l), !this.vars.repeatRefresh || l || this._lock || (this._lock = i = 1, this.render(ft(a * n), !0).invalidate()._lock = 0))
                    }
                    if (!this._initted) {
                        if ($t(this, m ? e : s, i, t, g)) return this._tTime = 0, this;
                        if (p !== this._time) return this;
                        if (f !== this._dur) return this.render(e, t, i)
                    }
                    if (this._tTime = g, this._time = s, !this._act && this._ts && (this._act = 1, this._lazy = 0), this.ratio = d = (u || this._ease)(s / f), this._from && (this.ratio = d = 1 - d), s && !p && !t && !n && (ui(this, "onStart"), this._tTime !== g)) return this;
                    for (r = this._pt; r;) r.r(d, r.d), r = r._next;
                    c && c.render(e < 0 ? e : !s && l ? -1e-8 : c._dur * c._ease(s / this._dur), t, i) || this._startAt && (this._zTime = e), this._onUpdate && !t && (m && Pt(this, e, 0, i), ui(this, "onUpdate")), this._repeat && n !== o && this.vars.onRepeat && !t && this.parent && ui(this, "onRepeat"), g !== this._tDur && g || this._tTime !== g || (m && !this._onUpdate && Pt(this, e, 0, !0), (e || !f) && (g === this._tDur && this._ts > 0 || !g && this._ts < 0) && Lt(this, 1), t || m && !p || !(g || p || l) || (ui(this, g === h ? "onComplete" : "onReverseComplete", !0), this._prom && !(g < h && this.timeScale() > 0) && this._prom()))
                }
            } else ! function(e, t, i, s) {
                var r, n, a, o = e.ratio,
                    l = t < 0 || !t && (!e._start && Nt(e) && (e._initted || !Vt(e)) || (e._ts < 0 || e._dp._ts < 0) && !Vt(e)) ? 0 : 1,
                    d = e._rDelay,
                    c = 0;
                if (d && e._repeat && (c = Qt(0, e._tDur, t), n = It(c, d), e._yoyo && 1 & n && (l = 1 - l), n !== It(e._tTime, d) && (o = 1 - l, e.vars.repeatRefresh && e._initted && e.invalidate())), l !== o || re || s || e._zTime === be || !t && e._zTime) {
                    if (!e._initted && $t(e, t, s, i, c)) return;
                    for (a = e._zTime, e._zTime = t || (i ? be : 0), i || (i = t && !a), e.ratio = l, e._from && (l = 1 - l), e._time = 0, e._tTime = c, r = e._pt; r;) r.r(l, r.d), r = r._next;
                    t < 0 && Pt(e, t, 0, !0), e._onUpdate && !i && ui(e, "onUpdate"), c && e._repeat && !i && e.parent && ui(e, "onRepeat"), (t >= e._tDur || t < 0) && e.ratio === l && (l && Lt(e, 1), i || re || (ui(e, l ? "onComplete" : "onReverseComplete", !0), e._prom && e._prom()))
                } else e._zTime || (e._zTime = t)
            }(this, e, t, i);
            return this
        }, i.targets = function() {
            return this._targets
        }, i.invalidate = function(t) {
            return (!t || !this.vars.runBackwards) && (this._startAt = 0), this._pt = this._op = this._onUpdate = this._lazy = this.ratio = 0, this._ptLookup = [], this.timeline && this.timeline.invalidate(t), e.prototype.invalidate.call(this, t)
        }, i.resetTo = function(e, t, i, s) {
            he || Ti.wake(), this._ts || this.play();
            var r = Math.min(this._dur, (this._dp._time - this._start) * this._ts);
            return this._initted || Wi(this, r),
                function(e, t, i, s, r, n, a) {
                    var o, l, d, c, u = (e._pt && e._ptCache || (e._ptCache = {}))[t];
                    if (!u)
                        for (u = e._ptCache[t] = [], d = e._ptLookup, c = e._targets.length; c--;) {
                            if ((o = d[c][t]) && o.d && o.d._pt)
                                for (o = o.d._pt; o && o.p !== t && o.fp !== t;) o = o._next;
                            if (!o) return $i = 1, e.vars[t] = "+=0", Wi(e, a), $i = 0, 1;
                            u.push(o)
                        }
                    for (c = u.length; c--;)(o = (l = u[c])._pt || l).s = !s && 0 !== s || r ? o.s + (s || 0) + n * o.c : s, o.c = i - o.s, l.e && (l.e = ht(i) + Jt(l.e)), l.b && (l.b = o.s + Jt(l.b))
                }(this, e, t, i, s, this._ease(r / this._dur), r) ? this.resetTo(e, t, i, s) : (Bt(this, 0), this.parent || At(this._dp, this, "_first", "_last", this._dp._sort ? "_start" : 0), this.render(0))
        }, i.kill = function(e, t) {
            if (void 0 === t && (t = "all"), !(e || t && "all" !== t)) return this._lazy = this._pt = 0, this.parent ? pi(this) : this;
            if (this.timeline) {
                var i = this.timeline.totalDuration();
                return this.timeline.killTweensOf(e, t, Gi && !0 !== Gi.vars.overwrite)._first || pi(this), this.parent && i !== this.timeline.totalDuration() && Ht(this, this._dur * this.timeline._tDur / i, 0, 1), this
            }
            var s, r, n, a, o, l, d, c = this._targets,
                u = e ? ei(e) : c,
                p = this._ptLookup,
                h = this._pt;
            if ((!t || "all" === t) && function(e, t) {
                    for (var i = e.length, s = i === t.length; s && i-- && e[i] === t[i];);
                    return i < 0
                }(c, u)) return "all" === t && (this._pt = 0), pi(this);
            for (s = this._op = this._op || [], "all" !== t && (Le(t) && (o = {}, pt(t, (function(e) {
                    return o[e] = 1
                })), t = o), t = function(e, t) {
                    var i, s, r, n, a = e[0] ? ct(e[0]).harness : 0,
                        o = a && a.aliases;
                    if (!o) return t;
                    for (s in i = St({}, t), o)
                        if (s in i)
                            for (r = (n = o[s].split(",")).length; r--;) i[n[r]] = i[s];
                    return i
                }(c, t)), d = c.length; d--;)
                if (~u.indexOf(c[d]))
                    for (o in r = p[d], "all" === t ? (s[d] = t, a = r, n = {}) : (n = s[d] = s[d] || {}, a = t), a)(l = r && r[o]) && ("kill" in l.d && !0 !== l.d.kill(o) || Ct(this, l, "_pt"), delete r[o]), "all" !== n && (n[o] = 1);
            return this._initted && !this._pt && h && pi(this), this
        }, t.to = function(e, i) {
            return new t(e, i, arguments[2])
        }, t.from = function(e, t) {
            return Xt(1, arguments)
        }, t.delayedCall = function(e, i, s, r) {
            return new t(i, 0, {
                immediateRender: !1,
                lazy: !1,
                overwrite: !1,
                delay: e,
                onComplete: i,
                onReverseComplete: i,
                onCompleteParams: s,
                onReverseCompleteParams: s,
                callbackScope: r
            })
        }, t.fromTo = function(e, t, i) {
            return Xt(2, arguments)
        }, t.set = function(e, i) {
            return i.duration = 0, i.repeatDelay || (i.repeat = 0), new t(e, i)
        }, t.killTweensOf = function(e, t, i) {
            return ae.killTweensOf(e, t, i)
        }, t
    }(Ri);
    bt(Qi.prototype, {
        _targets: [],
        _lazy: 0,
        _startAt: 0,
        _op: 0,
        _onInit: 0
    }), pt("staggerTo,staggerFrom,staggerFromTo", (function(e) {
        Qi[e] = function() {
            var t = new Fi,
                i = Kt.call(arguments, 0);
            return i.splice("staggerFromTo" === e ? 5 : 4, 0, 0), t[e].apply(t, i)
        }
    }));
    var Ji = function(e, t, i) {
            return e[t] = i
        },
        Ki = function(e, t, i) {
            return e[t](i)
        },
        Zi = function(e, t, i, s) {
            return e[t](s.fp, i)
        },
        es = function(e, t, i) {
            return e.setAttribute(t, i)
        },
        ts = function(e, t) {
            return Me(e[t]) ? Ki : Pe(e[t]) && e.setAttribute ? es : Ji
        },
        is = function(e, t) {
            return t.set(t.t, t.p, Math.round(1e6 * (t.s + t.c * e)) / 1e6, t)
        },
        ss = function(e, t) {
            return t.set(t.t, t.p, !!(t.s + t.c * e), t)
        },
        rs = function(e, t) {
            var i = t._pt,
                s = "";
            if (!e && t.b) s = t.b;
            else if (1 === e && t.e) s = t.e;
            else {
                for (; i;) s = i.p + (i.m ? i.m(i.s + i.c * e) : Math.round(1e4 * (i.s + i.c * e)) / 1e4) + s, i = i._next;
                s += t.c
            }
            t.set(t.t, t.p, s, t)
        },
        ns = function(e, t) {
            for (var i = t._pt; i;) i.r(e, i.d), i = i._next
        },
        as = function(e, t, i, s) {
            for (var r, n = this._pt; n;) r = n._next, n.p === s && n.modifier(e, t, i), n = r
        },
        os = function(e) {
            for (var t, i, s = this._pt; s;) i = s._next, s.p === e && !s.op || s.op === e ? Ct(this, s, "_pt") : s.dep || (t = 1), s = i;
            return !t
        },
        ls = function(e, t, i, s) {
            s.mSet(e, t, s.m.call(s.tween, i, s.mt), s)
        },
        ds = function(e) {
            for (var t, i, s, r, n = e._pt; n;) {
                for (t = n._next, i = s; i && i.pr > n.pr;) i = i._next;
                (n._prev = i ? i._prev : r) ? n._prev._next = n: s = n, (n._next = i) ? i._prev = n : r = n, n = t
            }
            e._pt = s
        },
        cs = function() {
            function e(e, t, i, s, r, n, a, o, l) {
                this.t = t, this.s = s, this.c = r, this.p = i, this.r = n || is, this.d = a || this, this.set = o || Ji, this.pr = l || 0, this._next = e, e && (e._prev = this)
            }
            return e.prototype.modifier = function(e, t, i) {
                this.mSet = this.mSet || this.set, this.set = ls, this.m = e, this.mt = i, this.tween = t
            }, e
        }();
    pt(lt + "parent,duration,ease,delay,overwrite,runBackwards,startAt,yoyo,immediateRender,repeat,repeatDelay,data,paused,reversed,lazy,callbackScope,stringFilter,id,yoyoEase,stagger,inherit,repeatRefresh,keyframes,autoRevert,scrollTrigger", (function(e) {
        return tt[e] = 1
    })), We.TweenMax = We.TweenLite = Qi, We.TimelineLite = We.TimelineMax = Fi, ae = new Fi({
        sortChildren: !1,
        defaults: _e,
        autoRemoveChildren: !0,
        id: "root",
        smoothChildTiming: !0
    }), ye.stringFilter = xi;
    var us = [],
        ps = {},
        hs = [],
        fs = 0,
        ms = function(e) {
            return (ps[e] || hs).map((function(e) {
                return e()
            }))
        },
        gs = function() {
            var e = Date.now(),
                t = [];
            e - fs > 2 && (ms("matchMediaInit"), us.forEach((function(e) {
                var i, s, r, n, a = e.queries,
                    o = e.conditions;
                for (s in a)(i = oe.matchMedia(a[s]).matches) && (r = 1), i !== o[s] && (o[s] = i, n = 1);
                n && (e.revert(), r && t.push(e))
            })), ms("matchMediaRevert"), t.forEach((function(e) {
                return e.onMatch(e)
            })), fs = e, ms("matchMedia"))
        },
        vs = function() {
            function e(e, t) {
                this.selector = t && ti(t), this.data = [], this._r = [], this.isReverted = !1, e && this.add(e)
            }
            var t = e.prototype;
            return t.add = function(e, t, i) {
                Me(e) && (i = t, t = e, e = Me);
                var s = this,
                    r = function() {
                        var e, r = ne,
                            n = s.selector;
                        return r && r !== s && r.data.push(s), i && (s.selector = ti(i)), ne = s, e = t.apply(s, arguments), Me(e) && s._r.push(e), ne = r, s.selector = n, s.isReverted = !1, e
                    };
                return s.last = r, e === Me ? r(s) : e ? s[e] = r : r
            }, t.ignore = function(e) {
                var t = ne;
                ne = null, e(this), ne = t
            }, t.getTweens = function() {
                var t = [];
                return this.data.forEach((function(i) {
                    return i instanceof e ? t.push.apply(t, i.getTweens()) : i instanceof Qi && !(i.parent && "nested" === i.parent.data) && t.push(i)
                })), t
            }, t.clear = function() {
                this._r.length = this.data.length = 0
            }, t.kill = function(e, t) {
                var i = this;
                if (e) {
                    var s = this.getTweens();
                    this.data.forEach((function(e) {
                        "isFlip" === e.data && (e.revert(), e.getChildren(!0, !0, !1).forEach((function(e) {
                            return s.splice(s.indexOf(e), 1)
                        })))
                    })), s.map((function(e) {
                        return {
                            g: e.globalTime(0),
                            t: e
                        }
                    })).sort((function(e, t) {
                        return t.g - e.g || -1
                    })).forEach((function(t) {
                        return t.t.revert(e)
                    })), this.data.forEach((function(t) {
                        return !(t instanceof Ri) && t.revert && t.revert(e)
                    })), this._r.forEach((function(t) {
                        return t(e, i)
                    })), this.isReverted = !0
                } else this.data.forEach((function(e) {
                    return e.kill && e.kill()
                }));
                if (this.clear(), t) {
                    var r = us.indexOf(this);
                    ~r && us.splice(r, 1)
                }
            }, t.revert = function(e) {
                this.kill(e || {})
            }, e
        }(),
        ys = function() {
            function e(e) {
                this.contexts = [], this.scope = e
            }
            var t = e.prototype;
            return t.add = function(e, t, i) {
                Oe(e) || (e = {
                    matches: e
                });
                var s, r, n, a = new vs(0, i || this.scope),
                    o = a.conditions = {};
                for (r in this.contexts.push(a), t = a.add("onMatch", t), a.queries = e, e) "all" === r ? n = 1 : (s = oe.matchMedia(e[r])) && (us.indexOf(a) < 0 && us.push(a), (o[r] = s.matches) && (n = 1), s.addListener ? s.addListener(gs) : s.addEventListener("change", gs));
                return n && t(a), this
            }, t.revert = function(e) {
                this.kill(e || {})
            }, t.kill = function(e) {
                this.contexts.forEach((function(t) {
                    return t.kill(e, !0)
                }))
            }, e
        }(),
        _s = {
            registerPlugin: function() {
                for (var e = arguments.length, t = new Array(e), i = 0; i < e; i++) t[i] = arguments[i];
                t.forEach((function(e) {
                    return fi(e)
                }))
            },
            timeline: function(e) {
                return new Fi(e)
            },
            getTweensOf: function(e, t) {
                return ae.getTweensOf(e, t)
            },
            getProperty: function(e, t, i, s) {
                Le(e) && (e = ei(e)[0]);
                var r = ct(e || {}).get,
                    n = i ? wt : _t;
                return "native" === i && (i = ""), e ? t ? n((rt[t] && rt[t].get || r)(e, t, i, s)) : function(t, i, s) {
                    return n((rt[t] && rt[t].get || r)(e, t, i, s))
                } : e
            },
            quickSetter: function(e, t, i) {
                if ((e = ei(e)).length > 1) {
                    var s = e.map((function(e) {
                            return Ss.quickSetter(e, t, i)
                        })),
                        r = s.length;
                    return function(e) {
                        for (var t = r; t--;) s[t](e)
                    }
                }
                e = e[0] || {};
                var n = rt[t],
                    a = ct(e),
                    o = a.harness && (a.harness.aliases || {})[t] || t,
                    l = n ? function(t) {
                        var s = new n;
                        pe._pt = 0, s.init(e, i ? t + i : t, pe, 0, [e]), s.render(1, s), pe._pt && ns(1, pe)
                    } : a.set(e, o);
                return n ? l : function(t) {
                    return l(e, o, i ? t + i : t, a, 1)
                }
            },
            quickTo: function(e, t, i) {
                var s, r = Ss.to(e, St(((s = {})[t] = "+=0.1", s.paused = !0, s), i || {})),
                    n = function(e, i, s) {
                        return r.resetTo(t, e, i, s)
                    };
                return n.tween = r, n
            },
            isTweening: function(e) {
                return ae.getTweensOf(e, !0).length > 0
            },
            defaults: function(e) {
                return e && e.ease && (e.ease = Oi(e.ease, _e.ease)), xt(_e, e || {})
            },
            config: function(e) {
                return xt(ye, e || {})
            },
            registerEffect: function(e) {
                var t = e.name,
                    i = e.effect,
                    s = e.plugins,
                    r = e.defaults,
                    n = e.extendTimeline;
                (s || "").split(",").forEach((function(e) {
                    return e && !rt[e] && !We[e] && Ue(t + " effect requires " + e + " plugin.")
                })), nt[t] = function(e, t, s) {
                    return i(ei(e), bt(t || {}, r), s)
                }, n && (Fi.prototype[t] = function(e, i, s) {
                    return this.add(nt[t](e, Oe(i) ? i : (s = i) && {}, this), s)
                })
            },
            registerEase: function(e, t) {
                Ai[e] = Oi(t)
            },
            parseEase: function(e, t) {
                return arguments.length ? Oi(e, t) : Ai
            },
            getById: function(e) {
                return ae.getById(e)
            },
            exportRoot: function(e, t) {
                void 0 === e && (e = {});
                var i, s, r = new Fi(e);
                for (r.smoothChildTiming = De(e.smoothChildTiming), ae.remove(r), r._dp = 0, r._time = r._tTime = ae._time, i = ae._first; i;) s = i._next, !t && !i._dur && i instanceof Qi && i.vars.onComplete === i._targets[0] || Ft(r, i, i._start - i._delay), i = s;
                return Ft(ae, r, 0), r
            },
            context: function(e, t) {
                return e ? new vs(e, t) : ne
            },
            matchMedia: function(e) {
                return new ys(e)
            },
            matchMediaRefresh: function() {
                return us.forEach((function(e) {
                    var t, i, s = e.conditions;
                    for (i in s) s[i] && (s[i] = !1, t = 1);
                    t && e.revert()
                })) || gs()
            },
            addEventListener: function(e, t) {
                var i = ps[e] || (ps[e] = []);
                ~i.indexOf(t) || i.push(t)
            },
            removeEventListener: function(e, t) {
                var i = ps[e],
                    s = i && i.indexOf(t);
                s >= 0 && i.splice(s, 1)
            },
            utils: {
                wrap: function e(t, i, s) {
                    var r = i - t;
                    return Be(t) ? oi(t, e(0, t.length), i) : Ut(s, (function(e) {
                        return (r + (e - t) % r) % r + t
                    }))
                },
                wrapYoyo: function e(t, i, s) {
                    var r = i - t,
                        n = 2 * r;
                    return Be(t) ? oi(t, e(0, t.length - 1), i) : Ut(s, (function(e) {
                        return t + ((e = (n + (e - t) % n) % n || 0) > r ? n - e : e)
                    }))
                },
                distribute: si,
                random: ai,
                snap: ni,
                normalize: function(e, t, i) {
                    return di(e, t, 0, 1, i)
                },
                getUnit: Jt,
                clamp: function(e, t, i) {
                    return Ut(i, (function(i) {
                        return Qt(e, t, i)
                    }))
                },
                splitColor: yi,
                toArray: ei,
                selector: ti,
                mapRange: di,
                pipe: function() {
                    for (var e = arguments.length, t = new Array(e), i = 0; i < e; i++) t[i] = arguments[i];
                    return function(e) {
                        return t.reduce((function(e, t) {
                            return t(e)
                        }), e)
                    }
                },
                unitize: function(e, t) {
                    return function(i) {
                        return e(parseFloat(i)) + (t || Jt(i))
                    }
                },
                interpolate: function e(t, i, s, r) {
                    var n = isNaN(t + i) ? 0 : function(e) {
                        return (1 - e) * t + e * i
                    };
                    if (!n) {
                        var a, o, l, d, c, u = Le(t),
                            p = {};
                        if (!0 === s && (r = 1) && (s = null), u) t = {
                            p: t
                        }, i = {
                            p: i
                        };
                        else if (Be(t) && !Be(i)) {
                            for (l = [], d = t.length, c = d - 2, o = 1; o < d; o++) l.push(e(t[o - 1], t[o]));
                            d--, n = function(e) {
                                e *= d;
                                var t = Math.min(c, ~~e);
                                return l[t](e - t)
                            }, s = i
                        } else r || (t = St(Be(t) ? [] : {}, t));
                        if (!l) {
                            for (a in i) Vi.call(p, t, a, "get", i[a]);
                            n = function(e) {
                                return ns(e, p) || (u ? t.p : t)
                            }
                        }
                    }
                    return Ut(s, n)
                },
                shuffle: ii
            },
            install: Ye,
            effects: nt,
            ticker: Ti,
            updateRoot: Fi.updateRoot,
            plugins: rt,
            globalTimeline: ae,
            core: {
                PropTween: cs,
                globals: Qe,
                Tween: Qi,
                Timeline: Fi,
                Animation: Ri,
                getCache: ct,
                _removeLinkedListItem: Ct,
                reverting: function() {
                    return re
                },
                context: function(e) {
                    return e && ne && (ne.data.push(e), e._ctx = ne), ne
                },
                suppressOverwrites: function(e) {
                    return se = e
                }
            }
        };
    pt("to,from,fromTo,delayedCall,set,killTweensOf", (function(e) {
        return _s[e] = Qi[e]
    })), Ti.add(Fi.updateRoot), pe = _s.to({}, {
        duration: 0
    });
    var ws = function(e, t) {
            for (var i = e._pt; i && i.p !== t && i.op !== t && i.fp !== t;) i = i._next;
            return i
        },
        bs = function(e, t) {
            return {
                name: e,
                rawVars: 1,
                init: function(e, i, s) {
                    s._onInit = function(e) {
                        var s, r;
                        if (Le(i) && (s = {}, pt(i, (function(e) {
                                return s[e] = 1
                            })), i = s), t) {
                            for (r in s = {}, i) s[r] = t(i[r]);
                            i = s
                        }! function(e, t) {
                            var i, s, r, n = e._targets;
                            for (i in t)
                                for (s = n.length; s--;)(r = e._ptLookup[s][i]) && (r = r.d) && (r._pt && (r = ws(r, i)), r && r.modifier && r.modifier(t[i], e, n[s], i))
                        }(e, i)
                    }
                }
            }
        },
        Ss = _s.registerPlugin({
            name: "attr",
            init: function(e, t, i, s, r) {
                var n, a, o;
                for (n in this.tween = i, t) o = e.getAttribute(n) || "", (a = this.add(e, "setAttribute", (o || 0) + "", t[n], s, r, 0, 0, n)).op = n, a.b = o, this._props.push(n)
            },
            render: function(e, t) {
                for (var i = t._pt; i;) re ? i.set(i.t, i.p, i.b, i) : i.r(e, i.d), i = i._next
            }
        }, {
            name: "endArray",
            init: function(e, t) {
                for (var i = t.length; i--;) this.add(e, i, e[i] || 0, t[i], 0, 0, 0, 0, 0, 1)
            }
        }, bs("roundProps", ri), bs("modifiers"), bs("snap", ni)) || _s;
    Qi.version = Fi.version = Ss.version = "3.11.5", ce = 1, Ie() && Ei(), Ai.Power0, Ai.Power1, Ai.Power2, Ai.Power3, Ai.Power4, Ai.Linear, Ai.Quad, Ai.Cubic, Ai.Quart, Ai.Quint, Ai.Strong, Ai.Elastic, Ai.Back, Ai.SteppedEase, Ai.Bounce, Ai.Sine, Ai.Expo, Ai.Circ;
    var xs, Ts, Es, As, Cs, Ls, Ms, ks, Ps = {},
        Os = 180 / Math.PI,
        Ds = Math.PI / 180,
        Is = Math.atan2,
        zs = /([A-Z])/g,
        qs = /(left|right|width|margin|padding|x)/i,
        Bs = /[\s,\(]\S/,
        Rs = {
            autoAlpha: "opacity,visibility",
            scale: "scaleX,scaleY",
            alpha: "opacity"
        },
        Fs = function(e, t) {
            return t.set(t.t, t.p, Math.round(1e4 * (t.s + t.c * e)) / 1e4 + t.u, t)
        },
        Gs = function(e, t) {
            return t.set(t.t, t.p, 1 === e ? t.e : Math.round(1e4 * (t.s + t.c * e)) / 1e4 + t.u, t)
        },
        $s = function(e, t) {
            return t.set(t.t, t.p, e ? Math.round(1e4 * (t.s + t.c * e)) / 1e4 + t.u : t.b, t)
        },
        Ns = function(e, t) {
            var i = t.s + t.c * e;
            t.set(t.t, t.p, ~~(i + (i < 0 ? -.5 : .5)) + t.u, t)
        },
        Vs = function(e, t) {
            return t.set(t.t, t.p, e ? t.e : t.b, t)
        },
        Hs = function(e, t) {
            return t.set(t.t, t.p, 1 !== e ? t.b : t.e, t)
        },
        Ws = function(e, t, i) {
            return e.style[t] = i
        },
        js = function(e, t, i) {
            return e.style.setProperty(t, i)
        },
        Ys = function(e, t, i) {
            return e._gsap[t] = i
        },
        Xs = function(e, t, i) {
            return e._gsap.scaleX = e._gsap.scaleY = i
        },
        Us = function(e, t, i, s, r) {
            var n = e._gsap;
            n.scaleX = n.scaleY = i, n.renderTransform(r, n)
        },
        Qs = function(e, t, i, s, r) {
            var n = e._gsap;
            n[t] = i, n.renderTransform(r, n)
        },
        Js = "transform",
        Ks = Js + "Origin",
        Zs = function e(t, i) {
            var s = this,
                r = this.target,
                n = r.style;
            if (t in Ps) {
                if (this.tfm = this.tfm || {}, "transform" === t) return Rs.transform.split(",").forEach((function(t) {
                    return e.call(s, t, i)
                }));
                if (~(t = Rs[t] || t).indexOf(",") ? t.split(",").forEach((function(e) {
                        return s.tfm[e] = vr(r, e)
                    })) : this.tfm[t] = r._gsap.x ? r._gsap[t] : vr(r, t), this.props.indexOf(Js) >= 0) return;
                r._gsap.svg && (this.svgo = r.getAttribute("data-svg-origin"), this.props.push(Ks, i, "")), t = Js
            }(n || i) && this.props.push(t, i, n[t])
        },
        er = function(e) {
            e.translate && (e.removeProperty("translate"), e.removeProperty("scale"), e.removeProperty("rotate"))
        },
        tr = function() {
            var e, t, i = this.props,
                s = this.target,
                r = s.style,
                n = s._gsap;
            for (e = 0; e < i.length; e += 3) i[e + 1] ? s[i[e]] = i[e + 2] : i[e + 2] ? r[i[e]] = i[e + 2] : r.removeProperty("--" === i[e].substr(0, 2) ? i[e] : i[e].replace(zs, "-$1").toLowerCase());
            if (this.tfm) {
                for (t in this.tfm) n[t] = this.tfm[t];
                n.svg && (n.renderTransform(), s.setAttribute("data-svg-origin", this.svgo || "")), (e = Ms()) && e.isStart || r[Js] || (er(r), n.uncache = 1)
            }
        },
        ir = function(e, t) {
            var i = {
                target: e,
                props: [],
                revert: tr,
                save: Zs
            };
            return e._gsap || Ss.core.getCache(e), t && t.split(",").forEach((function(e) {
                return i.save(e)
            })), i
        },
        sr = function(e, t) {
            var i = Ts.createElementNS ? Ts.createElementNS((t || "http://www.w3.org/1999/xhtml").replace(/^https/, "http"), e) : Ts.createElement(e);
            return i.style ? i : Ts.createElement(e)
        },
        rr = function e(t, i, s) {
            var r = getComputedStyle(t);
            return r[i] || r.getPropertyValue(i.replace(zs, "-$1").toLowerCase()) || r.getPropertyValue(i) || !s && e(t, ar(i) || i, 1) || ""
        },
        nr = "O,Moz,ms,Ms,Webkit".split(","),
        ar = function(e, t, i) {
            var s = (t || Cs).style,
                r = 5;
            if (e in s && !i) return e;
            for (e = e.charAt(0).toUpperCase() + e.substr(1); r-- && !(nr[r] + e in s););
            return r < 0 ? null : (3 === r ? "ms" : r >= 0 ? nr[r] : "") + e
        },
        or = function() {
            "undefined" != typeof window && window.document && (xs = window, Ts = xs.document, Es = Ts.documentElement, Cs = sr("div") || {
                style: {}
            }, sr("div"), Js = ar(Js), Ks = Js + "Origin", Cs.style.cssText = "border-width:0;line-height:0;position:absolute;padding:0", ks = !!ar("perspective"), Ms = Ss.core.reverting, As = 1)
        },
        lr = function e(t) {
            var i, s = sr("svg", this.ownerSVGElement && this.ownerSVGElement.getAttribute("xmlns") || "http://www.w3.org/2000/svg"),
                r = this.parentNode,
                n = this.nextSibling,
                a = this.style.cssText;
            if (Es.appendChild(s), s.appendChild(this), this.style.display = "block", t) try {
                i = this.getBBox(), this._gsapBBox = this.getBBox, this.getBBox = e
            } catch (e) {} else this._gsapBBox && (i = this._gsapBBox());
            return r && (n ? r.insertBefore(this, n) : r.appendChild(this)), Es.removeChild(s), this.style.cssText = a, i
        },
        dr = function(e, t) {
            for (var i = t.length; i--;)
                if (e.hasAttribute(t[i])) return e.getAttribute(t[i])
        },
        cr = function(e) {
            var t;
            try {
                t = e.getBBox()
            } catch (i) {
                t = lr.call(e, !0)
            }
            return t && (t.width || t.height) || e.getBBox === lr || (t = lr.call(e, !0)), !t || t.width || t.x || t.y ? t : {
                x: +dr(e, ["x", "cx", "x1"]) || 0,
                y: +dr(e, ["y", "cy", "y1"]) || 0,
                width: 0,
                height: 0
            }
        },
        ur = function(e) {
            return !(!e.getCTM || e.parentNode && !e.ownerSVGElement || !cr(e))
        },
        pr = function(e, t) {
            if (t) {
                var i = e.style;
                t in Ps && t !== Ks && (t = Js), i.removeProperty ? ("ms" !== t.substr(0, 2) && "webkit" !== t.substr(0, 6) || (t = "-" + t), i.removeProperty(t.replace(zs, "-$1").toLowerCase())) : i.removeAttribute(t)
            }
        },
        hr = function(e, t, i, s, r, n) {
            var a = new cs(e._pt, t, i, 0, 1, n ? Hs : Vs);
            return e._pt = a, a.b = s, a.e = r, e._props.push(i), a
        },
        fr = {
            deg: 1,
            rad: 1,
            turn: 1
        },
        mr = {
            grid: 1,
            flex: 1
        },
        gr = function e(t, i, s, r) {
            var n, a, o, l, d = parseFloat(s) || 0,
                c = (s + "").trim().substr((d + "").length) || "px",
                u = Cs.style,
                p = qs.test(i),
                h = "svg" === t.tagName.toLowerCase(),
                f = (h ? "client" : "offset") + (p ? "Width" : "Height"),
                m = 100,
                g = "px" === r,
                v = "%" === r;
            return r === c || !d || fr[r] || fr[c] ? d : ("px" !== c && !g && (d = e(t, i, s, "px")), l = t.getCTM && ur(t), !v && "%" !== c || !Ps[i] && !~i.indexOf("adius") ? (u[p ? "width" : "height"] = m + (g ? c : r), a = ~i.indexOf("adius") || "em" === r && t.appendChild && !h ? t : t.parentNode, l && (a = (t.ownerSVGElement || {}).parentNode), a && a !== Ts && a.appendChild || (a = Ts.body), (o = a._gsap) && v && o.width && p && o.time === Ti.time && !o.uncache ? ht(d / o.width * m) : ((v || "%" === c) && !mr[rr(a, "display")] && (u.position = rr(t, "position")), a === t && (u.position = "static"), a.appendChild(Cs), n = Cs[f], a.removeChild(Cs), u.position = "absolute", p && v && ((o = ct(a)).time = Ti.time, o.width = a[f]), ht(g ? n * d / m : n && d ? m / n * d : 0))) : (n = l ? t.getBBox()[p ? "width" : "height"] : t[f], ht(v ? d / n * m : d / 100 * n)))
        },
        vr = function(e, t, i, s) {
            var r;
            return As || or(), t in Rs && "transform" !== t && ~(t = Rs[t]).indexOf(",") && (t = t.split(",")[0]), Ps[t] && "transform" !== t ? (r = Lr(e, s), r = "transformOrigin" !== t ? r[t] : r.svg ? r.origin : Mr(rr(e, Ks)) + " " + r.zOrigin + "px") : (!(r = e.style[t]) || "auto" === r || s || ~(r + "").indexOf("calc(")) && (r = br[t] && br[t](e, t, i) || rr(e, t) || ut(e, t) || ("opacity" === t ? 1 : 0)), i && !~(r + "").trim().indexOf(" ") ? gr(e, t, r, i) + i : r
        },
        yr = function(e, t, i, s) {
            if (!i || "none" === i) {
                var r = ar(t, e, 1),
                    n = r && rr(e, r, 1);
                n && n !== i ? (t = r, i = n) : "borderColor" === t && (i = rr(e, "borderTopColor"))
            }
            var a, o, l, d, c, u, p, h, f, m, g, v = new cs(this._pt, e.style, t, 0, 1, rs),
                y = 0,
                _ = 0;
            if (v.b = i, v.e = s, i += "", "auto" == (s += "") && (e.style[t] = s, s = rr(e, t) || s, e.style[t] = i), xi(a = [i, s]), s = a[1], l = (i = a[0]).match(Ge) || [], (s.match(Ge) || []).length) {
                for (; o = Ge.exec(s);) p = o[0], f = s.substring(y, o.index), c ? c = (c + 1) % 5 : "rgba(" !== f.substr(-5) && "hsla(" !== f.substr(-5) || (c = 1), p !== (u = l[_++] || "") && (d = parseFloat(u) || 0, g = u.substr((d + "").length), "=" === p.charAt(1) && (p = mt(d, p) + g), h = parseFloat(p), m = p.substr((h + "").length), y = Ge.lastIndex - m.length, m || (m = m || ye.units[t] || g, y === s.length && (s += m, v.e += m)), g !== m && (d = gr(e, t, u, m) || 0), v._pt = {
                    _next: v._pt,
                    p: f || 1 === _ ? f : ",",
                    s: d,
                    c: h - d,
                    m: c && c < 4 || "zIndex" === t ? Math.round : 0
                });
                v.c = y < s.length ? s.substring(y, s.length) : ""
            } else v.r = "display" === t && "none" === s ? Hs : Vs;
            return Ne.test(s) && (v.e = 0), this._pt = v, v
        },
        _r = {
            top: "0%",
            bottom: "100%",
            left: "0%",
            right: "100%",
            center: "50%"
        },
        wr = function(e, t) {
            if (t.tween && t.tween._time === t.tween._dur) {
                var i, s, r, n = t.t,
                    a = n.style,
                    o = t.u,
                    l = n._gsap;
                if ("all" === o || !0 === o) a.cssText = "", s = 1;
                else
                    for (r = (o = o.split(",")).length; --r > -1;) i = o[r], Ps[i] && (s = 1, i = "transformOrigin" === i ? Ks : Js), pr(n, i);
                s && (pr(n, Js), l && (l.svg && n.removeAttribute("transform"), Lr(n, 1), l.uncache = 1, er(a)))
            }
        },
        br = {
            clearProps: function(e, t, i, s, r) {
                if ("isFromStart" !== r.data) {
                    var n = e._pt = new cs(e._pt, t, i, 0, 0, wr);
                    return n.u = s, n.pr = -10, n.tween = r, e._props.push(i), 1
                }
            }
        },
        Sr = [1, 0, 0, 1, 0, 0],
        xr = {},
        Tr = function(e) {
            return "matrix(1, 0, 0, 1, 0, 0)" === e || "none" === e || !e
        },
        Er = function(e) {
            var t = rr(e, Js);
            return Tr(t) ? Sr : t.substr(7).match(Fe).map(ht)
        },
        Ar = function(e, t) {
            var i, s, r, n, a = e._gsap || ct(e),
                o = e.style,
                l = Er(e);
            return a.svg && e.getAttribute("transform") ? "1,0,0,1,0,0" === (l = [(r = e.transform.baseVal.consolidate().matrix).a, r.b, r.c, r.d, r.e, r.f]).join(",") ? Sr : l : (l !== Sr || e.offsetParent || e === Es || a.svg || (r = o.display, o.display = "block", (i = e.parentNode) && e.offsetParent || (n = 1, s = e.nextElementSibling, Es.appendChild(e)), l = Er(e), r ? o.display = r : pr(e, "display"), n && (s ? i.insertBefore(e, s) : i ? i.appendChild(e) : Es.removeChild(e))), t && l.length > 6 ? [l[0], l[1], l[4], l[5], l[12], l[13]] : l)
        },
        Cr = function(e, t, i, s, r, n) {
            var a, o, l, d = e._gsap,
                c = r || Ar(e, !0),
                u = d.xOrigin || 0,
                p = d.yOrigin || 0,
                h = d.xOffset || 0,
                f = d.yOffset || 0,
                m = c[0],
                g = c[1],
                v = c[2],
                y = c[3],
                _ = c[4],
                w = c[5],
                b = t.split(" "),
                S = parseFloat(b[0]) || 0,
                x = parseFloat(b[1]) || 0;
            i ? c !== Sr && (o = m * y - g * v) && (l = S * (-g / o) + x * (m / o) - (m * w - g * _) / o, S = S * (y / o) + x * (-v / o) + (v * w - y * _) / o, x = l) : (S = (a = cr(e)).x + (~b[0].indexOf("%") ? S / 100 * a.width : S), x = a.y + (~(b[1] || b[0]).indexOf("%") ? x / 100 * a.height : x)), s || !1 !== s && d.smooth ? (_ = S - u, w = x - p, d.xOffset = h + (_ * m + w * v) - _, d.yOffset = f + (_ * g + w * y) - w) : d.xOffset = d.yOffset = 0, d.xOrigin = S, d.yOrigin = x, d.smooth = !!s, d.origin = t, d.originIsAbsolute = !!i, e.style[Ks] = "0px 0px", n && (hr(n, d, "xOrigin", u, S), hr(n, d, "yOrigin", p, x), hr(n, d, "xOffset", h, d.xOffset), hr(n, d, "yOffset", f, d.yOffset)), e.setAttribute("data-svg-origin", S + " " + x)
        },
        Lr = function(e, t) {
            var i = e._gsap || new Bi(e);
            if ("x" in i && !t && !i.uncache) return i;
            var s, r, n, a, o, l, d, c, u, p, h, f, m, g, v, y, _, w, b, S, x, T, E, A, C, L, M, k, P, O, D, I, z = e.style,
                q = i.scaleX < 0,
                B = "px",
                R = "deg",
                F = getComputedStyle(e),
                G = rr(e, Ks) || "0";
            return s = r = n = l = d = c = u = p = h = 0, a = o = 1, i.svg = !(!e.getCTM || !ur(e)), F.translate && ("none" === F.translate && "none" === F.scale && "none" === F.rotate || (z[Js] = ("none" !== F.translate ? "translate3d(" + (F.translate + " 0 0").split(" ").slice(0, 3).join(", ") + ") " : "") + ("none" !== F.rotate ? "rotate(" + F.rotate + ") " : "") + ("none" !== F.scale ? "scale(" + F.scale.split(" ").join(",") + ") " : "") + ("none" !== F[Js] ? F[Js] : "")), z.scale = z.rotate = z.translate = "none"), g = Ar(e, i.svg), i.svg && (i.uncache ? (C = e.getBBox(), G = i.xOrigin - C.x + "px " + (i.yOrigin - C.y) + "px", A = "") : A = !t && e.getAttribute("data-svg-origin"), Cr(e, A || G, !!A || i.originIsAbsolute, !1 !== i.smooth, g)), f = i.xOrigin || 0, m = i.yOrigin || 0, g !== Sr && (w = g[0], b = g[1], S = g[2], x = g[3], s = T = g[4], r = E = g[5], 6 === g.length ? (a = Math.sqrt(w * w + b * b), o = Math.sqrt(x * x + S * S), l = w || b ? Is(b, w) * Os : 0, (u = S || x ? Is(S, x) * Os + l : 0) && (o *= Math.abs(Math.cos(u * Ds))), i.svg && (s -= f - (f * w + m * S), r -= m - (f * b + m * x))) : (I = g[6], O = g[7], M = g[8], k = g[9], P = g[10], D = g[11], s = g[12], r = g[13], n = g[14], d = (v = Is(I, P)) * Os, v && (A = T * (y = Math.cos(-v)) + M * (_ = Math.sin(-v)), C = E * y + k * _, L = I * y + P * _, M = T * -_ + M * y, k = E * -_ + k * y, P = I * -_ + P * y, D = O * -_ + D * y, T = A, E = C, I = L), c = (v = Is(-S, P)) * Os, v && (y = Math.cos(-v), D = x * (_ = Math.sin(-v)) + D * y, w = A = w * y - M * _, b = C = b * y - k * _, S = L = S * y - P * _), l = (v = Is(b, w)) * Os, v && (A = w * (y = Math.cos(v)) + b * (_ = Math.sin(v)), C = T * y + E * _, b = b * y - w * _, E = E * y - T * _, w = A, T = C), d && Math.abs(d) + Math.abs(l) > 359.9 && (d = l = 0, c = 180 - c), a = ht(Math.sqrt(w * w + b * b + S * S)), o = ht(Math.sqrt(E * E + I * I)), v = Is(T, E), u = Math.abs(v) > 2e-4 ? v * Os : 0, h = D ? 1 / (D < 0 ? -D : D) : 0), i.svg && (A = e.getAttribute("transform"), i.forceCSS = e.setAttribute("transform", "") || !Tr(rr(e, Js)), A && e.setAttribute("transform", A))), Math.abs(u) > 90 && Math.abs(u) < 270 && (q ? (a *= -1, u += l <= 0 ? 180 : -180, l += l <= 0 ? 180 : -180) : (o *= -1, u += u <= 0 ? 180 : -180)), t = t || i.uncache, i.x = s - ((i.xPercent = s && (!t && i.xPercent || (Math.round(e.offsetWidth / 2) === Math.round(-s) ? -50 : 0))) ? e.offsetWidth * i.xPercent / 100 : 0) + B, i.y = r - ((i.yPercent = r && (!t && i.yPercent || (Math.round(e.offsetHeight / 2) === Math.round(-r) ? -50 : 0))) ? e.offsetHeight * i.yPercent / 100 : 0) + B, i.z = n + B, i.scaleX = ht(a), i.scaleY = ht(o), i.rotation = ht(l) + R, i.rotationX = ht(d) + R, i.rotationY = ht(c) + R, i.skewX = u + R, i.skewY = p + R, i.transformPerspective = h + B, (i.zOrigin = parseFloat(G.split(" ")[2]) || 0) && (z[Ks] = Mr(G)), i.xOffset = i.yOffset = 0, i.force3D = ye.force3D, i.renderTransform = i.svg ? qr : ks ? zr : Pr, i.uncache = 0, i
        },
        Mr = function(e) {
            return (e = e.split(" "))[0] + " " + e[1]
        },
        kr = function(e, t, i) {
            var s = Jt(t);
            return ht(parseFloat(t) + parseFloat(gr(e, "x", i + "px", s))) + s
        },
        Pr = function(e, t) {
            t.z = "0px", t.rotationY = t.rotationX = "0deg", t.force3D = 0, zr(e, t)
        },
        Or = "0deg",
        Dr = "0px",
        Ir = ") ",
        zr = function(e, t) {
            var i = t || this,
                s = i.xPercent,
                r = i.yPercent,
                n = i.x,
                a = i.y,
                o = i.z,
                l = i.rotation,
                d = i.rotationY,
                c = i.rotationX,
                u = i.skewX,
                p = i.skewY,
                h = i.scaleX,
                f = i.scaleY,
                m = i.transformPerspective,
                g = i.force3D,
                v = i.target,
                y = i.zOrigin,
                _ = "",
                w = "auto" === g && e && 1 !== e || !0 === g;
            if (y && (c !== Or || d !== Or)) {
                var b, S = parseFloat(d) * Ds,
                    x = Math.sin(S),
                    T = Math.cos(S);
                S = parseFloat(c) * Ds, b = Math.cos(S), n = kr(v, n, x * b * -y), a = kr(v, a, -Math.sin(S) * -y), o = kr(v, o, T * b * -y + y)
            }
            m !== Dr && (_ += "perspective(" + m + Ir), (s || r) && (_ += "translate(" + s + "%, " + r + "%) "), (w || n !== Dr || a !== Dr || o !== Dr) && (_ += o !== Dr || w ? "translate3d(" + n + ", " + a + ", " + o + ") " : "translate(" + n + ", " + a + Ir), l !== Or && (_ += "rotate(" + l + Ir), d !== Or && (_ += "rotateY(" + d + Ir), c !== Or && (_ += "rotateX(" + c + Ir), u === Or && p === Or || (_ += "skew(" + u + ", " + p + Ir), 1 === h && 1 === f || (_ += "scale(" + h + ", " + f + Ir), v.style[Js] = _ || "translate(0, 0)"
        },
        qr = function(e, t) {
            var i, s, r, n, a, o = t || this,
                l = o.xPercent,
                d = o.yPercent,
                c = o.x,
                u = o.y,
                p = o.rotation,
                h = o.skewX,
                f = o.skewY,
                m = o.scaleX,
                g = o.scaleY,
                v = o.target,
                y = o.xOrigin,
                _ = o.yOrigin,
                w = o.xOffset,
                b = o.yOffset,
                S = o.forceCSS,
                x = parseFloat(c),
                T = parseFloat(u);
            p = parseFloat(p), h = parseFloat(h), (f = parseFloat(f)) && (h += f = parseFloat(f), p += f), p || h ? (p *= Ds, h *= Ds, i = Math.cos(p) * m, s = Math.sin(p) * m, r = Math.sin(p - h) * -g, n = Math.cos(p - h) * g, h && (f *= Ds, a = Math.tan(h - f), r *= a = Math.sqrt(1 + a * a), n *= a, f && (a = Math.tan(f), i *= a = Math.sqrt(1 + a * a), s *= a)), i = ht(i), s = ht(s), r = ht(r), n = ht(n)) : (i = m, n = g, s = r = 0), (x && !~(c + "").indexOf("px") || T && !~(u + "").indexOf("px")) && (x = gr(v, "x", c, "px"), T = gr(v, "y", u, "px")), (y || _ || w || b) && (x = ht(x + y - (y * i + _ * r) + w), T = ht(T + _ - (y * s + _ * n) + b)), (l || d) && (a = v.getBBox(), x = ht(x + l / 100 * a.width), T = ht(T + d / 100 * a.height)), a = "matrix(" + i + "," + s + "," + r + "," + n + "," + x + "," + T + ")", v.setAttribute("transform", a), S && (v.style[Js] = a)
        },
        Br = function(e, t, i, s, r) {
            var n, a, o = 360,
                l = Le(r),
                d = parseFloat(r) * (l && ~r.indexOf("rad") ? Os : 1) - s,
                c = s + d + "deg";
            return l && ("short" === (n = r.split("_")[1]) && (d %= o) != d % 180 && (d += d < 0 ? o : -360), "cw" === n && d < 0 ? d = (d + 36e9) % o - ~~(d / o) * o : "ccw" === n && d > 0 && (d = (d - 36e9) % o - ~~(d / o) * o)), e._pt = a = new cs(e._pt, t, i, s, d, Gs), a.e = c, a.u = "deg", e._props.push(i), a
        },
        Rr = function(e, t) {
            for (var i in t) e[i] = t[i];
            return e
        },
        Fr = function(e, t, i) {
            var s, r, n, a, o, l, d, c = Rr({}, i._gsap),
                u = i.style;
            for (r in c.svg ? (n = i.getAttribute("transform"), i.setAttribute("transform", ""), u[Js] = t, s = Lr(i, 1), pr(i, Js), i.setAttribute("transform", n)) : (n = getComputedStyle(i)[Js], u[Js] = t, s = Lr(i, 1), u[Js] = n), Ps)(n = c[r]) !== (a = s[r]) && "perspective,force3D,transformOrigin,svgOrigin".indexOf(r) < 0 && (o = Jt(n) !== (d = Jt(a)) ? gr(i, r, n, d) : parseFloat(n), l = parseFloat(a), e._pt = new cs(e._pt, s, r, o, l - o, Fs), e._pt.u = d || 0, e._props.push(r));
            Rr(s, c)
        };
    pt("padding,margin,Width,Radius", (function(e, t) {
        var i = "Top",
            s = "Right",
            r = "Bottom",
            n = "Left",
            a = (t < 3 ? [i, s, r, n] : [i + n, i + s, r + s, r + n]).map((function(i) {
                return t < 2 ? e + i : "border" + i + e
            }));
        br[t > 1 ? "border" + e : e] = function(e, t, i, s, r) {
            var n, o;
            if (arguments.length < 4) return n = a.map((function(t) {
                return vr(e, t, i)
            })), 5 === (o = n.join(" ")).split(n[0]).length ? n[0] : o;
            n = (s + "").split(" "), o = {}, a.forEach((function(e, t) {
                return o[e] = n[t] = n[t] || n[(t - 1) / 2 | 0]
            })), e.init(t, o, r)
        }
    }));
    var Gr, $r, Nr = {
        name: "css",
        register: or,
        targetTest: function(e) {
            return e.style && e.nodeType
        },
        init: function(e, t, i, s, r) {
            var n, a, o, l, d, c, u, p, h, f, m, g, v, y, _, w, b, S, x, T, E = this._props,
                A = e.style,
                C = i.vars.startAt;
            for (u in As || or(), this.styles = this.styles || ir(e), w = this.styles.props, this.tween = i, t)
                if ("autoRound" !== u && (a = t[u], !rt[u] || !Hi(u, t, i, s, e, r)))
                    if (d = typeof a, c = br[u], "function" === d && (d = typeof(a = a.call(i, s, e, r))), "string" === d && ~a.indexOf("random(") && (a = li(a)), c) c(this, e, u, a, i) && (_ = 1);
                    else if ("--" === u.substr(0, 2)) n = (getComputedStyle(e).getPropertyValue(u) + "").trim(), a += "", bi.lastIndex = 0, bi.test(n) || (p = Jt(n), h = Jt(a)), h ? p !== h && (n = gr(e, u, n, h) + h) : p && (a += p), this.add(A, "setProperty", n, a, s, r, 0, 0, u), E.push(u), w.push(u, 0, A[u]);
            else if ("undefined" !== d) {
                if (C && u in C ? (n = "function" == typeof C[u] ? C[u].call(i, s, e, r) : C[u], Le(n) && ~n.indexOf("random(") && (n = li(n)), Jt(n + "") || (n += ye.units[u] || Jt(vr(e, u)) || ""), "=" === (n + "").charAt(1) && (n = vr(e, u))) : n = vr(e, u), l = parseFloat(n), (f = "string" === d && "=" === a.charAt(1) && a.substr(0, 2)) && (a = a.substr(2)), o = parseFloat(a), u in Rs && ("autoAlpha" === u && (1 === l && "hidden" === vr(e, "visibility") && o && (l = 0), w.push("visibility", 0, A.visibility), hr(this, A, "visibility", l ? "inherit" : "hidden", o ? "inherit" : "hidden", !o)), "scale" !== u && "transform" !== u && ~(u = Rs[u]).indexOf(",") && (u = u.split(",")[0])), m = u in Ps)
                    if (this.styles.save(u), g || ((v = e._gsap).renderTransform && !t.parseTransform || Lr(e, t.parseTransform), y = !1 !== t.smoothOrigin && v.smooth, (g = this._pt = new cs(this._pt, A, Js, 0, 1, v.renderTransform, v, 0, -1)).dep = 1), "scale" === u) this._pt = new cs(this._pt, v, "scaleY", v.scaleY, (f ? mt(v.scaleY, f + o) : o) - v.scaleY || 0, Fs), this._pt.u = 0, E.push("scaleY", u), u += "X";
                    else {
                        if ("transformOrigin" === u) {
                            w.push(Ks, 0, A[Ks]), S = void 0, x = void 0, T = void 0, x = (S = (b = a).split(" "))[0], T = S[1] || "50%", "top" !== x && "bottom" !== x && "left" !== T && "right" !== T || (b = x, x = T, T = b), S[0] = _r[x] || x, S[1] = _r[T] || T, a = S.join(" "), v.svg ? Cr(e, a, 0, y, 0, this) : ((h = parseFloat(a.split(" ")[2]) || 0) !== v.zOrigin && hr(this, v, "zOrigin", v.zOrigin, h), hr(this, A, u, Mr(n), Mr(a)));
                            continue
                        }
                        if ("svgOrigin" === u) {
                            Cr(e, a, 1, y, 0, this);
                            continue
                        }
                        if (u in xr) {
                            Br(this, v, u, l, f ? mt(l, f + a) : a);
                            continue
                        }
                        if ("smoothOrigin" === u) {
                            hr(this, v, "smooth", v.smooth, a);
                            continue
                        }
                        if ("force3D" === u) {
                            v[u] = a;
                            continue
                        }
                        if ("transform" === u) {
                            Fr(this, a, e);
                            continue
                        }
                    }
                else u in A || (u = ar(u) || u);
                if (m || (o || 0 === o) && (l || 0 === l) && !Bs.test(a) && u in A) o || (o = 0), (p = (n + "").substr((l + "").length)) !== (h = Jt(a) || (u in ye.units ? ye.units[u] : p)) && (l = gr(e, u, n, h)), this._pt = new cs(this._pt, m ? v : A, u, l, (f ? mt(l, f + o) : o) - l, m || "px" !== h && "zIndex" !== u || !1 === t.autoRound ? Fs : Ns), this._pt.u = h || 0, p !== h && "%" !== h && (this._pt.b = n, this._pt.r = $s);
                else if (u in A) yr.call(this, e, u, n, f ? f + a : a);
                else if (u in e) this.add(e, u, n || e[u], f ? f + a : a, s, r);
                else if ("parseTransform" !== u) {
                    Xe(u, a);
                    continue
                }
                m || (u in A ? w.push(u, 0, A[u]) : w.push(u, 1, n || e[u])), E.push(u)
            }
            _ && ds(this)
        },
        render: function(e, t) {
            if (t.tween._time || !Ms())
                for (var i = t._pt; i;) i.r(e, i.d), i = i._next;
            else t.styles.revert()
        },
        get: vr,
        aliases: Rs,
        getSetter: function(e, t, i) {
            var s = Rs[t];
            return s && s.indexOf(",") < 0 && (t = s), t in Ps && t !== Ks && (e._gsap.x || vr(e, "x")) ? i && Ls === i ? "scale" === t ? Xs : Ys : (Ls = i || {}) && ("scale" === t ? Us : Qs) : e.style && !Pe(e.style[t]) ? Ws : ~t.indexOf("-") ? js : ts(e, t)
        },
        core: {
            _removeProperty: pr,
            _getMatrix: Ar
        }
    };
    Ss.utils.checkPrefix = ar, Ss.core.getStyleSaver = ir, $r = pt("x,y,z,scale,scaleX,scaleY,xPercent,yPercent" + "," + (Gr = "rotation,rotationX,rotationY,skewX,skewY") + ",transform,transformOrigin,svgOrigin,force3D,smoothOrigin,transformPerspective", (function(e) {
        Ps[e] = 1
    })), pt(Gr, (function(e) {
        ye.units[e] = "deg", xr[e] = 1
    })), Rs[$r[13]] = "x,y,z,scale,scaleX,scaleY,xPercent,yPercent," + Gr, pt("0:translateX,1:translateY,2:translateZ,8:rotate,8:rotationZ,8:rotateZ,9:rotateX,10:rotateY", (function(e) {
        var t = e.split(":");
        Rs[t[1]] = $r[t[0]]
    })), pt("x,y,z,top,right,bottom,left,width,height,fontSize,padding,margin,perspective", (function(e) {
        ye.units[e] = "px"
    })), Ss.registerPlugin(Nr);
    var Vr = Ss.registerPlugin(Nr) || Ss;
    Vr.core.Tween;
    const Hr = new class {
        constructor() {
            this.isMobile = /Mobi/i.test(navigator.userAgent), this.lastKnownWidth = window.innerWidth, this.lastScrollPosition = 0, this.lastDrawTime = 0, this.components = [], this.loadListeners = [], this.scrollListeners = [], this.resizeListeners = [], this.pointerMoveListeners = [], this.drawListeners = [], this.disableScrollListener = !1
        }
        loadComponent(e) {
            this.components.push(e)
        }
        instanciate(e) {
            const t = new e(this);
            t.onScroll && this.scrollListeners.push(t), t.onResize && this.resizeListeners.push(t), t.onPointerMove && this.pointerMoveListeners.push(t), t.onDraw && this.drawListeners.push(t)
        }
        onLoad() {
            this.loadListeners.forEach((e => {
                this.instanciate(e)
            }))
        }
        onScroll() {
            if (!this.disableScrollListener) {
                const e = window.scrollY - this.lastScrollPosition;
                this.scrollListeners.forEach((t => {
                    t.onScroll(e)
                })), this.lastScrollPosition = window.scrollY
            }
        }
        onResize() {
            this.resizeListeners.forEach((e => {
                e.onResize(event)
            }))
        }
        onPointerMove(e) {
            this.pointerMoveListeners.forEach((t => {
                t.onPointerMove(e)
            }))
        }
        onDraw(e = 0) {
            const t = e - this.lastDrawTime;
            this.drawListeners.forEach((e => {
                e.onDraw(t)
            })), this.lastDrawTime = e, window.requestAnimationFrame((e => {
                this.onDraw(e)
            }))
        }
        registerListeners() {
            window.addEventListener("load", (() => {
                this.onLoad()
            })), window.addEventListener("scroll", (e => {
                this.onScroll(e)
            }), {
                passive: !0
            }), window.addEventListener("resize", (() => {
                this.lastKnownWidth !== window.innerWidth && (this.onResize(), this.lastKnownWidth = window.innerWidth)
            })), window.addEventListener("pointermove", (e => {
                this.onPointerMove(e)
            })), this.onDraw()
        }
        init() {
            this.components.forEach((e => {
                try {
                    e.exists() && (e.mustWaitUntilLoad ? this.loadListeners.push(e) : this.instanciate(e))
                } catch (t) {
                    void 0 === e.exists && console.error("Missing exists() function in\n", e), console.error(t)
                }
            })), this.registerListeners()
        }
    };
    Hr.loadComponent(class {
            constructor() {
                this.isMobile = window.innerWidth < 1024, this.lastScrollPosition = 0, this.retractOffset = 0, this.header = document.querySelector("#header"), this.headerBar = document.querySelector(".mobile-header-bar"), this.mainCTA = document.querySelector("#header .button-primary");
                const e = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--grid-margin"));
                this.headerHeight = this.isMobile ? this.headerBar.offsetHeight + e : this.header.offsetHeight;
                const t = document.querySelector("#mobile-header-toggle"),
                    i = document.querySelector("#header .button-primary"),
                    s = document.querySelector("#header .dropdown-overlay");
                t.addEventListener("click", (e => {
                    this.header.classList.contains("show-dropdown") || this.header.classList.toggle("toggled"), this.header.classList.contains("toggled") ? document.body.classList.add("noscroll") : document.body.classList.remove("noscroll"), this.header.classList.remove("show-dropdown")
                })), i.addEventListener("click", (e => {
                    this.header.classList.remove("toggled"), document.body.classList.remove("noscroll")
                })), document.querySelectorAll("#header .menu-dropdown .dropdown-label").forEach((e => {
                    e.addEventListener("click", (e => {
                        e.preventDefault(), this.header.classList.toggle("show-dropdown")
                    }))
                })), document.querySelectorAll("#header .menu-dropdown").forEach((e => e.addEventListener("mouseenter", (() => s.classList.add("toggled"))))), document.querySelectorAll("#header .menu-dropdown").forEach((e => e.addEventListener("mouseleave", (() => s.classList.remove("toggled"))))), document.querySelectorAll(".menu-entry.menu-dropdown").forEach((e => e.addEventListener("click", (() => {
                    document.querySelectorAll(".menu-entry.menu-dropdown").forEach((e => e.classList.remove("active"))), e.classList.add("active")
                }))))
            }
            onResize() {
                this.isMobile = window.innerWidth < 1024
            }
            onScroll(e) {
                const t = window.scrollY - this.lastScrollPosition;
                this.retractOffset -= t, this.retractOffset > 0 || 0 === window.scrollY ? (this.retractOffset = 0, this.header.classList.add("--sticky")) : this.header.classList.add("--sticky"), window.scrollY < 10 && this.header.classList.remove("--sticky"), this.retractOffset < -this.headerHeight && (this.retractOffset = -this.headerHeight), this.retractOffset < 0 ? this.mainCTA.classList.add("is-floating") : this.mainCTA.classList.remove("is-floating"), this.lastScrollPosition = window.scrollY
            }
            onDraw() {
                this.isMobile ? this.headerBar.style.transform = `translateY(${this.retractOffset}px)` : (this.header.style.transform = `translateY(${this.retractOffset}px)`, this.mainCTA.style.transform = `translateY(${-1*this.retractOffset}px)`)
            }
            onPointerMove(e) {
                e.y < this.header.offsetHeight && !this.isMobile ? (this.header.classList.add("transition"), this.retractOffset = 0) : this.header.classList.remove("transition")
            }
            static exists() {
                return !0
            }
        }), Hr.loadComponent(class {
            constructor() {
                const e = document.querySelectorAll("#footer .terms-and-conditions, #footer .cookies"),
                    t = document.querySelector("#footer .legal .links");
                e.forEach((e => {
                    t.append(e.cloneNode(!0))
                }))
            }
            static exists() {
                return !0
            }
        }), Hr.loadComponent(class {
            constructor() {
                document.querySelectorAll("[data-linked-group]").forEach((t => {
                    new e(t)
                }))
            }
            static exists() {
                return !0
            }
        }), Hr.loadComponent(class {
            constructor() {
                document.querySelectorAll("[data-copy-to-clipboard]").forEach((e => {
                    e.classList.add("copy-link-button"), e.addEventListener("click", (t => {
                        if (t.preventDefault(), window.isSecureContext) {
                            const t = e.getAttribute("data-copy-to-clipboard");
                            navigator.clipboard.writeText(t).then((() => {
                                e.querySelector(".tooltip").classList.add("copied"), setTimeout((() => {
                                    e.querySelector(".tooltip").classList.remove("copied")
                                }), 3e3)
                            }))
                        }
                    }))
                }))
            }
            static exists() {
                return !0
            }
        }), Hr.loadComponent(class {
            constructor() {
                document.querySelectorAll("[data-toggleable]").forEach((e => {
                    const t = e.getAttribute("data-toggleable");
                    ("" === t ? e : document.querySelector(t)).addEventListener("click", (t => {
                        const i = e.classList.contains("toggled");
                        e.parentNode.querySelectorAll("[data-toggleable]").forEach((e => {
                            e.classList.remove("toggled")
                        })), i ? e.classList.remove("toggled") : e.classList.add("toggled")
                    }))
                }))
            }
            static exists() {
                return !0
            }
        }), Hr.loadComponent(class {
            constructor() {
                const e = document.querySelector("#stats-dropdown"),
                    t = document.querySelectorAll(".stats .stat-collection");
                e.addEventListener("change", (() => {
                    const i = e.querySelector("select").value,
                        s = e.querySelector(`option[value="${i}"]`);
                    t.forEach(((e, t) => {
                        t == s.index ? e.classList.add("current") : e.classList.remove("current")
                    }))
                }))
            }
            static exists() {
                const e = document.querySelector("#stats-dropdown"),
                    t = document.querySelectorAll(".stats .stat-collection");
                return !(!e || !t)
            }
        }), Hr.loadComponent(class {
            constructor() {
                document.querySelectorAll("[data-sublink]").forEach((e => {
                    e.addEventListener("click", (t => {
                        t.preventDefault(), window.location.href = e.getAttribute("data-sublink")
                    }))
                }))
            }
            static exists() {
                return !0
            }
        }), Hr.loadComponent(class {
            constructor(e) {
                document.querySelectorAll('a[href="#contact"]').forEach((t => {
                    t.addEventListener("click", (t => {
                        e.disableScrollListener = !0, setTimeout((() => {
                            e.disableScrollListener = !1, e.onScroll()
                        }), 1e3)
                    }))
                }))
            }
            static exists() {
                return !0
            }
        }), Hr.loadComponent(class {
            constructor() {
                document.querySelectorAll("[data-video-embed]").forEach((e => {
                    const i = t.exec(e.getAttribute("href"))[3];
                    e.addEventListener("click", (() => {
                        event.preventDefault(), this.openPopup(i)
                    }))
                }))
            }
            openPopup(e) {
                const t = document.createElement("div");
                t.id = "video-embed";
                const i = document.createElement("div");
                i.id = "video-embed-iframe", i.innerHTML = `\n\t\t\t<iframe id="ytplayer" type="text/html" width="640" height="360"\n\t\t\tsrc="https://www.youtube.com/embed/${e}?autoplay=1"\n\t\t\tframeborder="0"/>\n\t\t`;
                const s = document.createElement("button");
                s.id = "video-embed-close", s.addEventListener("click", (() => {
                    t.remove()
                })), t.appendChild(i), i.appendChild(s), document.body.appendChild(t)
            }
            static exists() {
                return !0
            }
        }), Hr.loadComponent(class {
            constructor() {
                document.querySelectorAll(".container-media .video").forEach((e => {
                    "link" == e.dataset.mediaType ? this.initYoutubeEmbed(e) : this.initVideoControls(e)
                }))
            }
            initVideoControls(e) {
                const t = e.querySelector(".button"),
                    i = e.querySelector(".player");
                null != i.getAttribute("autoplay") && t.classList.add("playing"), t.addEventListener("click", (() => {
                    i.paused ? (t.classList.add("playing"), i.play()) : (t.classList.remove("playing"), i.pause())
                }))
            }
            initYoutubeEmbed(e) {
                const t = e.dataset.link,
                    s = i.exec(t)[3],
                    r = document.createElement("div");
                r.classList.add("player"), r.innerHTML = `\n\t\t\t<iframe type="text/html" width="640" height="360"\n\t\t\tsrc="https://www.youtube.com/embed/${s}"\n\t\t\tframeborder="0"/>\n\t\t`, e.append(r)
            }
            static exists() {
                return !0
            }
        }), Hr.loadComponent(class {
            constructor() {
                this.angle = 4, this.translation = window.innerHeight / 32;
                const e = document.querySelectorAll("[data-block-tied-to-scroll]");
                this.images = [], e.forEach((e => {
                    this.images.push({
                        element: e,
                        distance: 0,
                        direction: null != e.getAttribute("data-block-counterclockwise") ? -1 : 1,
                        shouldUpdate: !0
                    })
                }))
            }
            getImageDistance(e) {
                let t = 0;
                return t = e.top > window.innerHeight ? 2 : e.bottom < 0 ? -2 : 2 * ((e.y + e.height / 2) / window.innerHeight - .5), t
            }
            onScroll() {
                this.images.forEach((e => {
                    e.distance = this.getImageDistance(e.element.getBoundingClientRect()), e.shouldUpdate = !0
                }))
            }
            onDraw() {
                this.images.forEach((e => {
                    e.shouldUpdate && (e.element.style.transform = `\n\t\t\t\t\ttranslateY(${e.distance*this.translation}px)\n\t\t\t\t\trotate(calc(${e.distance*this.angle*e.direction}deg + var(--angle-offset))) \n\t\t\t\t`, e.shouldUpdate = !1)
                }))
            }
            static exists() {
                return !0
            }
        }), Hr.loadComponent(class {
            constructor() {
                const e = window.innerWidth < 768;
                this.scrollableArea = document.querySelector(".container-timeline .scrollable-area"), this.steps = document.querySelectorAll(".container-timeline .steps .step"), this.stepsButtons = document.querySelectorAll(".container-timeline .step-button");
                const t = document.querySelector(".container-timeline .steps");
                this.stepsContainerOffset = parseInt(getComputedStyle(t).paddingLeft), this.isDragged = !1, this.initialScroll = 0, this.initialMouseX = 0, this.stepsButtons.forEach(((e, t) => {
                    e.addEventListener("click", (() => {
                        this.scrollableArea.scroll({
                            left: this.steps[t].offsetLeft - this.stepsContainerOffset,
                            top: 0,
                            behavior: "smooth"
                        }), this.setCurrentStepTo(t)
                    }))
                })), this.scrollableArea.addEventListener("scroll", (t => {
                    let i = 0;
                    e ? i = Object.values(this.steps).findIndex((e => e.getBoundingClientRect().left > 0)) : (i = Math.round(this.scrollableArea.scrollLeft / (this.scrollableArea.scrollWidth - this.scrollableArea.clientWidth) * this.steps.length), i = i - 1 < 0 ? 0 : i - 1), this.setCurrentStepTo(i)
                })), this.scrollableArea.addEventListener("mousedown", (e => {
                    this.isDragged = !0, this.initialScroll = this.scrollableArea.scrollLeft, this.initialMouseX = e.x
                })), this.scrollableArea.addEventListener("mousemove", (e => {
                    this.isDragged && (this.dragOffset = this.initialScroll + this.initialMouseX - e.x, this.scrollableArea.scrollLeft = this.dragOffset)
                })), window.addEventListener("mouseup", (() => {
                    this.isDragged = !1
                })), document.querySelector(".container-timeline .doodle-lines").style.width = document.querySelector(".container-timeline .steps").scrollWidth + "px"
            }
            setCurrentStepTo(e) {
                this.stepsButtons.forEach(((t, i) => {
                    i === e ? t.classList.add("current") : t.classList.remove("current")
                }))
            }
            static exists() {
                return !!document.querySelector(".container-timeline")
            }
        }), Hr.loadComponent(class {
            constructor() {
                document.querySelectorAll("a, strong").forEach((e => {
                    e.addEventListener("mouseenter", (() => {
                        e.classList.remove("blur")
                    })), e.addEventListener("mouseleave", (() => {
                        e.classList.add("blur")
                    }))
                }))
            }
            static exists() {
                return !0
            }
        }), Hr.loadComponent(class {
            constructor() {
                document.querySelectorAll(".marquee").forEach((e => {
                    e.classList.contains("static") || new s(e)
                }))
            }
            static exists() {
                return !0
            }
            static mustWaitUntilLoad = !0
        }), Hr.loadComponent(class {
            constructor() {
                this.mostVisibleElement = null, this.background = document.querySelector("#dynamic-background"), this.forceDarkmode = null != this.background.dataset.forceDarkmode, this.minimumVisibility = .25;
                let e = [0];
                for (let t = 1; t < 32; t++) e.push(t / 32);
                const t = {
                    threshold: e
                };
                this.observer = new IntersectionObserver((e => {
                    this.onIntersection(e)
                }), t), this.sections = [], document.querySelectorAll("[data-dynamic-background]").forEach((e => {
                    this.sections.push({
                        domElement: e,
                        intersectionRectHeight: 0
                    }), this.observer.observe(e)
                }))
            }
            onIntersection(e) {
                let t = "white";
                e.forEach((e => {
                    this.sections.find((t => t.domElement === e.target)).intersectionRectHeight = e.intersectionRect.height
                }));
                let i = null;
                this.sections.forEach((e => {
                    e.intersectionRectHeight > window.innerHeight * this.minimumVisibility && (null == i || e.intersectionRectHeight > i.intersectionRectHeight) && (i = e)
                })), i && (t = i.domElement.getAttribute("data-dynamic-background")), this.forceDarkmode && "white" == t && (t = "brand-dark"), this.background.className = t, document.body.setAttribute("data-color", t)
            }
            static exists() {
                return !0
            }
        }), Hr.loadComponent(class {
            constructor() {
                this.isMobile = window.innerWidth <= 768, this.items = [], document.querySelectorAll("[data-on-reach-animate]").forEach((e => {
                    e.classList.add("will-animate"), this.items.push(e)
                })), this.onScroll()
            }
            onResize() {
                this.isMobile = window.innerWidth <= 768
            }
            onScroll() {
                const e = (this.isMobile, 1 * window.innerHeight);
                this.items.forEach(((t, i) => {
                    const s = t.getBoundingClientRect();
                    s.top - e < 0 && (t.classList.contains("reached") || t.classList.add("reached"), s.top + s.height - e < 0 ? t.classList.add("past") : t.classList.remove("past"))
                }))
            }
            static exists() {
                return !0
            }
        }), Hr.loadComponent(class {
            constructor() {
                document.querySelectorAll(".title").forEach((e => {
                    e.childNodes.forEach(((t, i) => {
                        if (t.nodeType === Node.TEXT_NODE) {
                            const s = document.createElement("span");
                            i > 0 && s.appendChild(document.createTextNode(" ")), t.wholeText.replace("\n", "").trim().split(" ").forEach((e => {
                                const t = document.createElement("span");
                                t.className = "word", t.innerText = e, s.appendChild(t), s.appendChild(document.createTextNode(" "))
                            })), e.replaceChild(s, t)
                        }
                    }));
                    const t = e.querySelector("strong");
                    if (t) {
                        const e = t.childNodes[0],
                            i = document.createElement("span");
                        for (let t = 0; t < e.length; t++) {
                            const s = document.createElement("span");
                            s.className = "letter";
                            const r = " " === e.textContent[t] ? " " : e.textContent[t];
                            s.innerText = r, i.appendChild(s)
                        }
                        i.appendChild(document.createTextNode(" ")), t.replaceChild(i, e)
                    }
                }))
            }
            static exists() {
                return !0
            }
        }), Hr.loadComponent(class {
            constructor() {
                this.children = [], document.querySelectorAll("[data-track-velocity]").forEach((e => {
                    this.children.push(new r(e))
                }))
            }
            onScroll(e) {
                this.children.forEach((t => {
                    t.onScroll(e)
                }))
            }
            onDraw(e) {
                this.children.forEach((t => {
                    t.onDraw(e)
                }))
            }
            static exists() {
                return document.querySelectorAll("[data-track-velocity]").length > 0
            }
            static mustWaitUntilLoad = !0
        }), Hr.loadComponent(class {
            constructor() {
                document.querySelectorAll(".dropdown").forEach((e => {
                    e.addEventListener("change", (t => {
                        const i = e.querySelector("select").value,
                            s = e.querySelector(`option[value="${i}"]`);
                        e.querySelector(".value-label").textContent = s.textContent;
                        const r = e.querySelector(".value-icon");
                        r && (r.src = s.getAttribute("data-image"))
                    }))
                }))
            }
            static exists() {
                return !0
            }
        }), Hr.loadComponent(class {
            constructor() {
                this.themePath = document.body.getAttribute("data-theme"), this.labels = document.querySelectorAll("label"), this.labels.forEach((e => {
                    const t = e.parentElement,
                        i = t.querySelector(`#${e.getAttribute("for")}`);
                    null !== i && (setTimeout((() => {
                        "" !== i.value && t.classList.add("filled")
                    }), 1e3), i.addEventListener("focus", (() => {
                        t.classList.add("focus")
                    })), i.addEventListener("blur", (() => {
                        t.classList.remove("focus"), "" !== i.value ? t.classList.add("filled") : t.classList.remove("filled")
                    })), i.addEventListener("input", (() => {
                        "" !== i.value ? t.classList.add("filled") : t.classList.remove("filled")
                    })))
                })), document.querySelectorAll('input[type="range"]').forEach((e => {
                    this.updateRange(e), e.addEventListener("input", (() => {
                        this.updateRange(e)
                    }))
                })), document.querySelectorAll("form.wpforms-form").forEach((e => {
                    e.addEventListener("keydown", (e => {
                        13 === e.keyCode && "TEXTAREA" !== e.target.tagName && (e.preventDefault(), e.stopPropagation())
                    }))
                }));
                const e = document.querySelectorAll(".wpforms-container"),
                    t = new MutationObserver((() => {
                        this.replaceRatingEmojis()
                    }));
                e.forEach((e => t.observe(e, {
                    subtree: !0,
                    childList: !0
                }))), document.querySelector(".wpforms-field-address") && (this.shouldCheckAddressInput = !1, document.querySelector(".wpforms-field-address-address1").addEventListener("focus", (() => {
                    this.shouldCheckAddressInput = !0, this.updateAllLabels()
                }))), document.querySelector(".wpforms-submit").addEventListener("click", (e => {
                    const t = document.querySelector(".wpforms-field-address-city").style.display = "block";
                    document.querySelector(".wpforms-field-address-state").style.display = "block", document.querySelector(".wpforms-field-address-postal").style.display = "block", document.querySelector(".wpforms-field-address-country").style.display = "block", document.querySelector(".wpforms-field-address-city + label").style.display = "flex", document.querySelector(".wpforms-field-address-state + label").style.display = "flex", document.querySelector(".wpforms-field-address-postal + label").style.display = "flex", document.querySelector(".wpforms-field-address-country + label").style.display = "flex", t && document.querySelectorAll(".wpforms-field-row + .wpforms-field-row").forEach((e => {
                        e.style.marginTop = "8px"
                    }))
                })), this.upgradeWPFormsSubmits(), setTimeout((() => {
                    this.watchModernSelects()
                }), 1e3)
            }
            updateAllLabels() {
                this.shouldCheckAddressInput && (this.labels.forEach((e => {
                    const t = document.getElementById(e.getAttribute("for")),
                        i = e.parentElement;
                    "" !== t.value && i.classList.add("filled")
                })), setTimeout((() => {
                    this.updateAllLabels()
                }), 500))
            }
            updateRange(e) {
                e.parentElement.querySelector(".wpforms-field-number-slider-hint");
                const t = e.value,
                    i = e.getAttribute("min"),
                    s = t / (e.getAttribute("max") - i);
                e.parentElement.style.setProperty("--progress", s)
            }
            replaceRatingEmojis() {
                let e = document.querySelectorAll(".wpforms-entry-preview-value");
                if (e.length > 0) {
                    const t = [];
                    e.forEach((e => {
                        "⭐" == e.innerText[0] && t.push(e)
                    })), t.forEach((e => {
                        const t = e.innerText.split("⭐").length - 1;
                        let i = "";
                        for (let e = 0; e < t; e++) i += `<img src="${this.themePath}/static/images/icons/star-empty.svg" class="rating-star" alt="">`;
                        e.innerHTML = i
                    }))
                }
            }
            upgradeWPFormsSubmits() {
                document.querySelectorAll(".wpforms-submit").forEach((e => {
                    const t = document.createElement("div");
                    t.classList.add("frame"), e.append(t)
                }))
            }
            watchModernSelects() {
                document.querySelectorAll(".wpforms-field-select-style-modern .choices select").forEach((e => {
                    e.addEventListener("change", (() => {
                        "" != e.value ? e.closest(".wpforms-field-select-style-modern").classList.add("filled") : e.closest(".wpforms-field-select-style-modern").classList.remove("filled")
                    }))
                }))
            }
            static exists() {
                return !0
            }
        }), Hr.loadComponent(class {
            constructor() {
                document.querySelectorAll(".language-selector").forEach((e => {
                    e.addEventListener("change", (t => {
                        const i = e.querySelector("select").value,
                            s = e.querySelector(`option[value="${i}"]`).getAttribute("data-url");
                        window.location.href !== s && (window.location.href = s)
                    }))
                }))
            }
            static exists() {
                return !0
            }
        }), Hr.loadComponent(class {
            constructor() {
                this.items = document.querySelectorAll(".news-list .news");
                let e = 4;
                this.setVisibleItems(e), document.querySelector("#load-more-news").addEventListener("click", (t => {
                    t.preventDefault(), e += 4, this.setVisibleItems(e)
                }))
            }
            setVisibleItems(e) {
                const t = document.querySelectorAll(".toggled").length + 4;
                this.items.forEach(((t, i) => {
                    i < e && t.classList.add("toggled")
                })), this.items.length <= t && document.querySelector("#load-more-news").classList.add("toggleComplete")
            }
            static exists() {
                return !!document.querySelector(".news-list")
            }
        }), Hr.loadComponent(class {
            constructor() {
                this.ribbon = document.querySelector(".scrolling-ribbon"), this.ribbonHeight = this.ribbon.getBoundingClientRect().height, this.footer = document.querySelector("#footer"), this.maskAmount = 0
            }
            onScroll(e) {
                this.maskAmount = (window.innerHeight - this.footer.getBoundingClientRect().top + this.ribbonHeight) / this.ribbonHeight, this.maskAmount < 0 && (this.maskAmount = 0), this.maskAmount > 1 && (this.maskAmount = 1)
            }
            onDraw() {
                this.ribbon.style.clipPath = `inset(${100*this.maskAmount}% 0 0 0)`
            }
            static exists() {
                return !!document.querySelector(".scrolling-ribbon")
            }
            static mustWaitUntilLoad = !0
        }), Hr.loadComponent(class {
            constructor() {
                document.querySelectorAll(".article-card").forEach((e => new n(e)))
            }
            static exists() {
                return !0
            }
            static mustWaitUntilLoad = !0
        }), "loading" == document.readyState ? window.addEventListener("DOMContentLoaded", (() => {
            Hr.init()
        })) : Hr.init(), window.addEventListener("load", (() => {
            document.querySelectorAll(".wpforms-smart-phone-field.iti__tel-input").forEach((e => {
                console.log("inputTel", e), e.style.paddingLeft = "96px!important"
            }));
            const e = document.querySelectorAll(".menu-entry.menu-dropdown"),
                t = document.querySelector("#header > .container");
            e.forEach((e => {
                e.addEventListener("mouseenter", (i => {
                    const s = e.querySelector(".dropdown-wrapper .dropdown-content"),
                        r = (t.clientWidth, t.offsetLeft, s.clientWidth),
                        n = e.clientWidth;
                    let a = e.offsetLeft - r / 2 + n / 2;
                    a < 16 && (a = 16), e.style.setProperty("--submenu-left", `${a}px`)
                }), !1)
            })), document.querySelectorAll(".ui-media__images").forEach((e => {
                const t = e.querySelectorAll("img");
                let i = 0,
                    s = 1;
                setInterval((() => {
                    i < t.length - 1 ? (t[i].classList.remove("--active"), i++) : (t[t.length - 1].classList.remove("--active"), i = 0), s < t.length - 1 ? (t[s].classList.remove("--next"), s++) : (t[t.length - 1].classList.remove("--next"), s = 0), t[i].classList.add("--active"), t[s].classList.add("--next")
                }), 2e3);
                for (let e = 0; e < t.length; e++);
            }));
            const i = document.querySelectorAll(".swiper-cards");
            i && i.forEach((e => {
                const t = e.querySelector(".swiper"),
                    i = {
                        modules: [J, Z, ee],
                        slidesPerView: "auto",
                        speed: 1e3,
                        spaceBetween: 16,
                        allowTouchMove: !0
                    };
                e.querySelectorAll(".swiper-arrow").length && (i.navigation = {}, i.navigation.prevEl = e.querySelector(".swiper-arrow.--left"), i.navigation.nextEl = e.querySelector(".swiper-arrow.--right")), new U(t, i)
            }));
            const s = document.querySelectorAll(".swiper-big");
            s && s.forEach((e => {
                const t = e.querySelector(".swiper"),
                    i = t.closest("[data-swiper-big-parent]"),
                    s = i.querySelector(".swiper-pagination"),
                    r = {
                        modules: [J, Z, ee],
                        slidesPerView: 1,
                        speed: 1e3,
                        spaceBetween: 0,
                        allowTouchMove: !0
                    };
                i.querySelectorAll(".swiper-arrow").length && (r.navigation = {}, r.navigation.prevEl = i.querySelector(".swiper-arrow.--left"), r.navigation.nextEl = i.querySelector(".swiper-arrow.--right")), s && (r.pagination = {
                    el: s,
                    clickable: !0
                });
                const n = new U(t, r);
                n.on("slideChange", (() => {
                    const e = n.realIndex,
                        t = i.querySelectorAll(".big_slider__content__item"),
                        s = i.querySelector(`.big_slider__content__item--${e}`);
                    t.forEach((e => {
                        e.classList.remove("active"), e.classList.remove("visible")
                    })), s.classList.add("active"), setTimeout((() => {
                        s.classList.add("visible")
                    }), 100)
                }))
            }));
            const r = Array.from(document.querySelectorAll(".marqueee"));
            r.length > 0 && r.forEach(((e, t) => {
                ! function(e) {
                    let t = e.querySelector(".-slot"),
                        i = e.clientWidth,
                        s = 200;
                    e.closest(".bento__row").classList.contains("--has-1") ? s /= 1 : e.closest(".bento__row").classList.contains("--has-2") ? s /= 2 : e.closest(".bento__row").classList.contains("--has-3") ? s /= 3 : e.closest(".bento__row").classList.contains("--has-4") ? s /= 4 : e.closest(".bento__row").classList.contains("--has-5") && (s /= 5), (() => {
                        let r = Math.floor(2 * i / t.offsetWidth);
                        for (let i = 0; i <= r; i++) {
                            let i = t.cloneNode(!0);
                            i.classList.add("--clone"), e.appendChild(i)
                        }
                        let n = e.offsetWidth / s;
                        n = e.offsetWidth / 10, e.style.width = `${t.offsetWidth}px`, e.classList.add("is-init")
                    })()
                }(e)
            }));
            const n = document.querySelectorAll(".ui-accordion .item-a-heading");
            let a = null;

            function o() {
                document.querySelectorAll(".swiper-arrows").forEach((e => {
                    const t = e.querySelector(".--left"),
                        i = e.querySelector(".--right");
                    (t.classList.contains("swiper-button-disabled") || t.classList.contains("swiper-button-lock")) && (i.classList.contains("swiper-button-disabled") || i.classList.contains("swiper-button-lock")) ? e.classList.add("--inactive"): e.classList.remove("--inactive")
                }))
            }
            n.forEach((e => {
                const t = e.closest(".item-a"),
                    i = t.querySelector(".item-a-content");
                e.addEventListener("click", (() => {
                    if (t.classList.toggle("a-active"), null !== a && a.timeline.timeScale(2).reverse(), t.classList.contains("active") || t.classList.add("active"), !t.hasOwnProperty("timeline")) {
                        const e = Vr.timeline({
                            paused: !0,
                            onReverseComplete: () => {
                                t.classList.remove("a-active"), t.classList.remove("active")
                            }
                        });
                        e.fromTo(i, .8, {
                            height: 0
                        }, {
                            height: i.offsetHeight,
                            ease: "easeCustom"
                        }).from(i.querySelector(".item-a-inner"), .6, {
                            opacity: 0,
                            x: 10,
                            ease: "Sine.easeOut"
                        }, "-=0.4"), t.timeline = e
                    }
                    t.timeline.totalProgress() > 0 ? t.timeline.timeScale(2).reverse() : (t.timeline.timeScale(1).play(), a = t)
                }), !1)
            })), o(), window.addEventListener("resize", o, !1), window.addEventListener("DOMContentLoaded", o, !1), window.addEventListener("load", o, !1)
        })), /^((?!chrome|android).)*safari/i.test(navigator.userAgent) && document.documentElement.classList.add("safari"),
        function(e, t, i) {
            function s(e, t) {
                return typeof e === t
            }

            function r(e) {
                var t = u.className,
                    i = d._config.classPrefix || "";
                if (p && (t = t.baseVal), d._config.enableJSClass) {
                    var s = new RegExp("(^|\\s)" + i + "no-js(\\s|$)");
                    t = t.replace(s, "$1" + i + "js$2")
                }
                d._config.enableClasses && (t += " " + i + e.join(" " + i), p ? u.className.baseVal = t : u.className = t)
            }

            function n(e, t) {
                if ("object" == typeof e)
                    for (var i in e) c(e, i) && n(i, e[i]);
                else {
                    var s = (e = e.toLowerCase()).split("."),
                        a = d[s[0]];
                    if (2 == s.length && (a = a[s[1]]), void 0 !== a) return d;
                    t = "function" == typeof t ? t() : t, 1 == s.length ? d[s[0]] = t : (!d[s[0]] || d[s[0]] instanceof Boolean || (d[s[0]] = new Boolean(d[s[0]])), d[s[0]][s[1]] = t), r([(t && 0 != t ? "" : "no-") + s.join("-")]), d._trigger(e, t)
                }
                return d
            }
            var a = [],
                o = [],
                l = {
                    _version: "3.6.0",
                    _config: {
                        classPrefix: "",
                        enableClasses: !0,
                        enableJSClass: !0,
                        usePrefixes: !0
                    },
                    _q: [],
                    on: function(e, t) {
                        var i = this;
                        setTimeout((function() {
                            t(i[e])
                        }), 0)
                    },
                    addTest: function(e, t, i) {
                        o.push({
                            name: e,
                            fn: t,
                            options: i
                        })
                    },
                    addAsyncTest: function(e) {
                        o.push({
                            name: null,
                            fn: e
                        })
                    }
                },
                d = function() {};
            d.prototype = l, d = new d;
            var c, u = t.documentElement,
                p = "svg" === u.nodeName.toLowerCase();
            ! function() {
                var e = {}.hasOwnProperty;
                c = s(e, "undefined") || s(e.call, "undefined") ? function(e, t) {
                    return t in e && s(e.constructor.prototype[t], "undefined")
                } : function(t, i) {
                    return e.call(t, i)
                }
            }(), l._l = {}, l.on = function(e, t) {
                    this._l[e] || (this._l[e] = []), this._l[e].push(t), d.hasOwnProperty(e) && setTimeout((function() {
                        d._trigger(e, d[e])
                    }), 0)
                }, l._trigger = function(e, t) {
                    if (this._l[e]) {
                        var i = this._l[e];
                        setTimeout((function() {
                            var e;
                            for (e = 0; e < i.length; e++)(0, i[e])(t)
                        }), 0), delete this._l[e]
                    }
                }, d._q.push((function() {
                    l.addTest = n
                })), d.addAsyncTest((function() {
                    function e(e, t, i) {
                        function s(t) {
                            var s = !(!t || "load" !== t.type) && 1 == r.width;
                            n(e, "webp" === e && s ? new Boolean(s) : s), i && i(t)
                        }
                        var r = new Image;
                        r.onerror = s, r.onload = s, r.src = t
                    }
                    var t = [{
                            uri: "data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA=",
                            name: "webp"
                        }, {
                            uri: "data:image/webp;base64,UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAABBxAR/Q9ERP8DAABWUDggGAAAADABAJ0BKgEAAQADADQlpAADcAD++/1QAA==",
                            name: "webp.alpha"
                        }, {
                            uri: "data:image/webp;base64,UklGRlIAAABXRUJQVlA4WAoAAAASAAAAAAAAAAAAQU5JTQYAAAD/////AABBTk1GJgAAAAAAAAAAAAAAAAAAAGQAAABWUDhMDQAAAC8AAAAQBxAREYiI/gcA",
                            name: "webp.animation"
                        }, {
                            uri: "data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=",
                            name: "webp.lossless"
                        }],
                        i = t.shift();
                    e(i.name, i.uri, (function(i) {
                        if (i && "load" === i.type)
                            for (var s = 0; s < t.length; s++) e(t[s].name, t[s].uri)
                    }))
                })),
                function() {
                    var e, t, i, r, n, l;
                    for (var c in o)
                        if (o.hasOwnProperty(c)) {
                            if (e = [], (t = o[c]).name && (e.push(t.name.toLowerCase()), t.options && t.options.aliases && t.options.aliases.length))
                                for (i = 0; i < t.options.aliases.length; i++) e.push(t.options.aliases[i].toLowerCase());
                            for (r = s(t.fn, "function") ? t.fn() : t.fn, n = 0; n < e.length; n++) 1 === (l = e[n].split(".")).length ? d[l[0]] = r : (!d[l[0]] || d[l[0]] instanceof Boolean || (d[l[0]] = new Boolean(d[l[0]])), d[l[0]][l[1]] = r), a.push((r ? "" : "no-") + l.join("-"))
                        }
                }(), r(a), delete l.addTest, delete l.addAsyncTest;
            for (var h = 0; h < d._q.length; h++) d._q[h]();
            e.Modernizr = d
        }(window, document)
})();