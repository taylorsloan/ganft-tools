function createUnityInstance(e, t, r) {
    function n(e, r) {
        if (!n.aborted && t.showBanner) return "error" == r && (n.aborted = !0), t.showBanner(e, r);
        switch (r) {
            case"error":
                console.error(e);
                break;
            case"warning":
                console.warn(e);
                break;
            default:
                console.log(e)
        }
    }

    function o(e) {
        var t = e.reason || e.error, r = t ? t.toString() : e.message || e.reason || "",
            n = t && t.stack ? t.stack.toString() : "";
        (n.startsWith(r) && (n = n.substring(r.length)), (r += "\n" + n.trim()) && u.stackTraceRegExp && u.stackTraceRegExp.test(r)) && s(r, e.filename || t && (t.fileName || t.sourceURL) || "", e.lineno || t && (t.lineNumber || t.line) || 0)
    }

    function a(e) {
        e.preventDefault()
    }

    function s(e, t, r) {
        if (-1 == e.indexOf("fullscreen error")) {
            if (u.startupErrorHandler) return void u.startupErrorHandler(e, t, r);
            if (!(u.errorHandler && u.errorHandler(e, t, r) || (console.log("Invoking error handler due to\n" + e), "function" == typeof dump && dump("Invoking error handler due to\n" + e), s.didShowErrorMessage))) -1 != (e = "An error occurred running the Unity content on this page. See your browser JavaScript console for more info. The error was:\n" + e).indexOf("DISABLE_EXCEPTION_CATCHING") ? e = "An exception has occurred, but exception handling has been disabled in this build. If you are the developer of this content, enable exceptions in your project WebGL player settings to be able to catch the exception or see the stack trace." : -1 != e.indexOf("Cannot enlarge memory arrays") ? e = "Out of memory. If you are the developer of this content, try allocating more memory to your WebGL build in the WebGL player settings." : -1 == e.indexOf("Invalid array buffer length") && -1 == e.indexOf("Invalid typed array length") && -1 == e.indexOf("out of memory") && -1 == e.indexOf("could not allocate memory") || (e = "The browser could not allocate enough memory for the WebGL content. If you are the developer of this content, try allocating less memory to your WebGL build in the WebGL player settings."), alert(e), s.didShowErrorMessage = !0
        }
    }

    function i(e, t) {
        if ("symbolsUrl" != e) {
            (d = u.downloadProgress[e]) || (d = u.downloadProgress[e] = {
                started: !1,
                finished: !1,
                lengthComputable: !1,
                total: 0,
                loaded: 0
            }), "object" != typeof t || "progress" != t.type && "load" != t.type || (d.started || (d.started = !0, d.lengthComputable = t.lengthComputable), d.total = t.total, d.loaded = t.loaded, "load" == t.type && (d.finished = !0));
            var n = 0, o = 0, a = 0, s = 0, i = 0;
            for (var e in u.downloadProgress) {
                var d;
                if (!(d = u.downloadProgress[e]).started) return 0;
                a++, d.lengthComputable ? (n += d.loaded, o += d.total, s++) : d.finished || i++
            }
            r(.9 * (a ? (a - i - (o ? s * (o - n) / o : 0)) / a : 0))
        }
    }

    function d() {
        new Promise(function (e, t) {
            var r = document.createElement("script");
            r.src = u.frameworkUrl, r.onload = function () {
                if ("undefined" == typeof unityFramework || !unityFramework) {
                    var t = [["br", "br"], ["gz", "gzip"]];
                    for (var o in t) {
                        var a = t[o];
                        if (u.frameworkUrl.endsWith("." + a[0])) {
                            var s = "Unable to parse " + u.frameworkUrl + "!";
                            if ("file:" == location.protocol) return void n(s + " Loading pre-compressed (brotli or gzip) content via a file:// URL without a web server is not supported by this browser. Please use a local development web server to host compressed Unity content, or use the Unity Build and Run option.", "error");
                            if (s += ' This can happen if build compression was enabled but web server hosting the content was misconfigured to not serve the file with HTTP Response Header "Content-Encoding: ' + a[1] + '" present. Check browser Console and Devtools Network tab to debug.', "br" == a[0] && "http:" == location.protocol) {
                                var i = -1 != ["localhost", "127.0.0.1"].indexOf(location.hostname) ? "" : "Migrate your server to use HTTPS.";
                                s = /Firefox/.test(navigator.userAgent) ? "Unable to parse " + u.frameworkUrl + '!<br>If using custom web server, verify that web server is sending .br files with HTTP Response Header "Content-Encoding: br". Brotli compression may not be supported in Firefox over HTTP connections. ' + i + ' See <a href="https://bugzilla.mozilla.org/show_bug.cgi?id=1670675">https://bugzilla.mozilla.org/show_bug.cgi?id=1670675</a> for more information.' : "Unable to parse " + u.frameworkUrl + '!<br>If using custom web server, verify that web server is sending .br files with HTTP Response Header "Content-Encoding: br". Brotli compression may not be supported over HTTP connections. Migrate your server to use HTTPS.'
                            }
                            return void n(s, "error")
                        }
                    }
                    n("Unable to parse " + u.frameworkUrl + "! The file is corrupt, or compression was misconfigured? (check Content-Encoding HTTP Response Header on web server)", "error")
                }
                var d = unityFramework;
                unityFramework = null, r.onload = null, e(d)
            }, r.onerror = function (e) {
                n("Unable to load file " + u.frameworkUrl + "! Check that the file exists on the remote server. (also check browser Console and Devtools Network tab to debug)", "error")
            }, document.body.appendChild(r), u.deinitializers.push(function () {
                document.body.removeChild(r)
            })
        }).then(function (e) {
            e(u)
        });
        var e = function (e) {
            i(e);
            var t = u.cacheControl(u[e]);
            return (u.companyName && u.productName ? u.cachedFetch : u.fetchWithProgress)(u[e], {
                method: "GET",
                companyName: u.companyName,
                productName: u.productName,
                control: t,
                onProgress: function (t) {
                    i(e, t)
                }
            }).then(function (e) {
                return e.parsedBody
            }).catch(function (t) {
                var r = "Failed to download file " + u[e];
                "file:" == location.protocol ? n(r + ". Loading web pages via a file:// URL without a web server is not supported by this browser. Please use a local development web server to host Unity content, or use the Unity Build and Run option.", "error") : console.error(r)
            })
        }("dataUrl");
        u.preRun.push(function () {
            u.addRunDependency("dataUrl"), e.then(function (e) {
                var t = new DataView(e.buffer, e.byteOffset, e.byteLength), r = 0, n = "UnityWebData1.0\0";
                if (!String.fromCharCode.apply(null, e.subarray(r, r + n.length)) == n) throw"unknown data format";
                r += n.length;
                var o = t.getUint32(r, !0);
                for (r += 4; r < o;) {
                    var a = t.getUint32(r, !0);
                    r += 4;
                    var s = t.getUint32(r, !0);
                    r += 4;
                    var i = t.getUint32(r, !0);
                    r += 4;
                    var d = String.fromCharCode.apply(null, e.subarray(r, r + i));
                    r += i;
                    for (var l = 0, c = d.indexOf("/", l) + 1; c > 0; l = c, c = d.indexOf("/", l) + 1) u.FS_createPath(d.substring(0, l), d.substring(l, c - 1), !0, !0);
                    u.FS_createDataFile(d, null, e.subarray(a, a + s), !0, !0, !0)
                }
                u.removeRunDependency("dataUrl")
            })
        })
    }

    r = r || function () {
    };
    var u = {
        canvas: e,
        webglContextAttributes: {preserveDrawingBuffer: !1},
        cacheControl: function (e) {
            return e == u.dataUrl ? "must-revalidate" : "no-store"
        },
        streamingAssetsUrl: "StreamingAssets",
        downloadProgress: {},
        deinitializers: [],
        intervals: {},
        setInterval: function (e, t) {
            var r = window.setInterval(e, t);
            return this.intervals[r] = !0, r
        },
        clearInterval: function (e) {
            delete this.intervals[e], window.clearInterval(e)
        },
        preRun: [],
        postRun: [],
        print: function (e) {
            console.log(e)
        },
        printErr: function (e) {
            console.error(e), "string" == typeof e && -1 != e.indexOf("wasm streaming compile failed") && (-1 != e.toLowerCase().indexOf("mime") ? n('HTTP Response Header "Content-Type" configured incorrectly on the server for file ' + u.codeUrl + ' , should be "application/wasm". Startup time performance will suffer.', "warning") : n('WebAssembly streaming compilation failed! This can happen for example if "Content-Encoding" HTTP header is incorrectly enabled on the server for file ' + u.codeUrl + ", but the file is not pre-compressed on disk (or vice versa). Check the Network tab in browser Devtools to debug server header configuration.", "warning"))
        },
        locateFile: function (e) {
            return "build.wasm" == e ? this.codeUrl : e
        },
        disabledCanvasEvents: ["contextmenu", "dragstart"]
    };
    for (var l in t) u[l] = t[l];
    u.streamingAssetsUrl = new URL(u.streamingAssetsUrl, document.URL).href;
    var c = u.disabledCanvasEvents.slice();
    c.forEach(function (t) {
        e.addEventListener(t, a)
    }), window.addEventListener("error", o), window.addEventListener("unhandledrejection", o), u.deinitializers.push(function () {
        for (var t in u.disableAccessToMediaDevices(), c.forEach(function (t) {
            e.removeEventListener(t, a)
        }), window.removeEventListener("error", o), window.removeEventListener("unhandledrejection", o), u.intervals) window.clearInterval(t);
        u.intervals = {}
    }), u.QuitCleanup = function () {
        for (var e = 0; e < u.deinitializers.length; e++) u.deinitializers[e]();
        u.deinitializers = [], "function" == typeof u.onQuit && u.onQuit()
    };
    var h = "", f = "";
    document.addEventListener("webkitfullscreenchange", function (t) {
        document.webkitCurrentFullScreenElement === e ? e.style.width && (h = e.style.width, f = e.style.height, e.style.width = "100%", e.style.height = "100%") : h && (e.style.width = h, e.style.height = f, h = "", f = "")
    });
    var p = {
        Module: u, SetFullscreen: function () {
            return u.SetFullscreen ? u.SetFullscreen.apply(u, arguments) : void u.print("Failed to set Fullscreen mode: Player not loaded yet.")
        }, SendMessage: function () {
            return u.SendMessage ? u.SendMessage.apply(u, arguments) : void u.print("Failed to execute SendMessage: Player not loaded yet.")
        }, Quit: function () {
            return new Promise(function (e, t) {
                u.shouldQuit = !0, u.onQuit = e
            })
        }
    };
    return u.SystemInfo = function () {
        function e(e, t, r) {
            return (e = RegExp(e, "i").exec(t)) && e[r]
        }

        for (var t, r, n, o, a, s, i = navigator.userAgent + " ", d = [["Firefox", "Firefox"], ["OPR", "Opera"], ["Edg", "Edge"], ["SamsungBrowser", "Samsung Browser"], ["Trident", "Internet Explorer"], ["MSIE", "Internet Explorer"], ["Chrome", "Chrome"], ["CriOS", "Chrome on iOS Safari"], ["FxiOS", "Firefox on iOS Safari"], ["Safari", "Safari"]], u = 0; u < d.length; ++u) if (r = e(d[u][0] + "[/ ](.*?)[ \\)]", i, 1)) {
            t = d[u][1];
            break
        }
        "Safari" == t && (r = e("Version/(.*?) ", i, 1)), "Internet Explorer" == t && (r = e("rv:(.*?)\\)? ", i, 1) || r);
        for (var l = [["Windows (.*?)[;)]", "Windows"], ["Android ([0-9_.]+)", "Android"], ["iPhone OS ([0-9_.]+)", "iPhoneOS"], ["iPad.*? OS ([0-9_.]+)", "iPadOS"], ["FreeBSD( )", "FreeBSD"], ["OpenBSD( )", "OpenBSD"], ["Linux|X11()", "Linux"], ["Mac OS X ([0-9_.]+)", "macOS"], ["bot|google|baidu|bing|msn|teoma|slurp|yandex", "Search Bot"]], c = 0; c < l.length; ++c) if (o = e(l[c][0], i, 1)) {
            n = l[c][1], o = o.replace(/_/g, ".");
            break
        }
        o = {
            "NT 5.0": "2000",
            "NT 5.1": "XP",
            "NT 5.2": "Server 2003",
            "NT 6.0": "Vista",
            "NT 6.1": "7",
            "NT 6.2": "8",
            "NT 6.3": "8.1",
            "NT 10.0": "10"
        }[o] || o, (a = document.createElement("canvas")) && (gl = a.getContext("webgl2"), glVersion = gl ? 2 : 0, gl || (gl = a && a.getContext("webgl")) && (glVersion = 1), gl && (s = gl.getExtension("WEBGL_debug_renderer_info") && gl.getParameter(37446) || gl.getParameter(7937)));
        var h = "undefined" != typeof SharedArrayBuffer,
            f = "object" == typeof WebAssembly && "function" == typeof WebAssembly.compile;
        return {
            width: screen.width,
            height: screen.height,
            userAgent: i.trim(),
            browser: t || "Unknown browser",
            browserVersion: r || "Unknown version",
            mobile: /Mobile|Android|iP(ad|hone)/.test(navigator.appVersion),
            os: n || "Unknown OS",
            osVersion: o || "Unknown OS Version",
            gpu: s || "Unknown GPU",
            language: navigator.userLanguage || navigator.language,
            hasWebGL: glVersion,
            hasCursorLock: !!document.body.requestPointerLock,
            hasFullscreen: !!document.body.requestFullscreen || !!document.body.webkitRequestFullscreen,
            hasThreads: h,
            hasWasm: f,
            hasWasmThreads: !1
        }
    }(), u.abortHandler = function (e) {
        return s(e, "", 0), !0
    }, Error.stackTraceLimit = Math.max(Error.stackTraceLimit || 0, 50), u.fetchWithProgress = function () {
        return function (e, t) {
            var r = function () {
            };
            return t && t.onProgress && (r = t.onProgress), fetch(e, t).then(function (e) {
                var t = void 0 !== e.body ? e.body.getReader() : void 0, n = void 0 !== e.headers.get("Content-Length"),
                    o = function (e, t) {
                        if (!t) return 0;
                        var r = e.headers.get("Content-Encoding"), n = parseInt(e.headers.get("Content-Length"));
                        switch (r) {
                            case"br":
                                return Math.round(5 * n);
                            case"gzip":
                                return Math.round(4 * n);
                            default:
                                return n
                        }
                    }(e, n), a = new Uint8Array(o), s = [], i = 0, d = 0;
                return n || console.warn("[UnityCache] Response is served without Content-Length header. Please reconfigure server to include valid Content-Length for better download performance."), function u() {
                    return void 0 === t ? e.arrayBuffer().then(function (e) {
                        return r({type: "progress", total: e.length, loaded: 0, lengthComputable: n}), new Uint8Array(e)
                    }) : t.read().then(function (e) {
                        return e.done ? function () {
                            if (i === o) return a;
                            if (i < o) return a.slice(0, i);
                            var e = new Uint8Array(i);
                            e.set(a, 0);
                            for (var t = d, r = 0; r < s.length; ++r) e.set(s[r], t), t += s[r].length;
                            return e
                        }() : (i + e.value.length <= a.length ? (a.set(e.value, i), d = i + e.value.length) : s.push(e.value), i += e.value.length, r({
                            type: "progress",
                            total: Math.max(o, i),
                            loaded: i,
                            lengthComputable: n
                        }), u())
                    })
                }().then(function (t) {
                    return r({
                        type: "load",
                        total: t.length,
                        loaded: t.length,
                        lengthComputable: n
                    }), e.parsedBody = t, e
                })
            })
        }
    }(), u.UnityCache = function () {
        function e() {
            function e(e) {
                var t = e.target.result;
                if (t.objectStoreNames.contains(o.name) || t.createObjectStore(o.name), !t.objectStoreNames.contains(n.name)) {
                    var r = t.createObjectStore(n.name, {keyPath: "url"});
                    ["version", "company", "product", "updated", "revalidated", "accessed"].forEach(function (e) {
                        r.createIndex(e, e)
                    })
                }
            }

            var a = this;
            a.isConnected = new Promise(function (n, o) {
                function s() {
                    a.openDBTimeout && (clearTimeout(a.openDBTimeout), a.openDBTimeout = null)
                }

                try {
                    if (a.openDBTimeout = setTimeout(function () {
                        void 0 === a.database && o(new Error("Could not connect to database: Timeout."))
                    }, 2e3), null != t) {
                        var i = t.open(r.name, r.version);
                        i.onupgradeneeded = function (t) {
                            e(t)
                        }, i.onsuccess = function (e) {
                            s(), a.database = e.target.result, n()
                        }, i.onerror = function (e) {
                            s(), a.database = null, o(new Error("Could not connect to database."))
                        }
                    }
                } catch (e) {
                    s(), a.database = null, o(new Error("Could not connect to database."))
                }
            })
        }

        var t, r = {name: "UnityCache", version: 3}, n = {name: "RequestStore", version: 1},
            o = {name: "WebAssembly", version: 1};
        try {
            t = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB
        } catch (e) {
        }
        e.UnityCacheDatabase = r, e.RequestStore = n, e.WebAssemblyStore = o;
        var a = null;
        return e.getInstance = function () {
            return a || (a = new e), a
        }, e.destroyInstance = function () {
            return a ? a.close().then(function () {
                a = null
            }) : Promise.resolve()
        }, e.clearCache = function () {
            return e.destroyInstance().then(function () {
                return new Promise(function (e, n) {
                    if (null != t) {
                        var o = t.deleteDatabase(r.name);
                        o.onsuccess = function () {
                            e()
                        }, o.onerror = function () {
                            n(new Error("Could not delete database."))
                        }, o.onblocked = function () {
                            n(new Error("Database blocked."))
                        }
                    }
                })
            })
        }, e.prototype.execute = function (e, t, r) {
            return this.isConnected.then(function () {
                return new Promise(function (n, o) {
                    try {
                        if (null === this.database) return void o(new Error("indexedDB access denied"));
                        var a = -1 != ["put", "delete", "clear"].indexOf(t) ? "readwrite" : "readonly",
                            s = this.database.transaction([e], a).objectStore(e);
                        "openKeyCursor" == t && (s = s.index(r[0]), r = r.slice(1));
                        var i = s[t].apply(s, r);
                        i.onsuccess = function (e) {
                            n(e.target.result)
                        }, i.onerror = function (e) {
                            o(e)
                        }
                    } catch (e) {
                        o(e)
                    }
                }.bind(this))
            }.bind(this))
        }, e.prototype.loadRequest = function (e) {
            return this.execute(n.name, "get", [e])
        }, e.prototype.storeRequest = function (e) {
            return this.execute(n.name, "put", [e])
        }, e.prototype.close = function () {
            return this.isConnected.then(function () {
                this.database && (this.database.close(), this.database = null)
            }.bind(this))
        }, e
    }(), u.cachedFetch = function () {
        function e(e) {
            console.log("[UnityCache] " + e)
        }

        function t(e) {
            return t.link = t.link || document.createElement("a"), t.link.href = e, t.link.href
        }

        function r(e) {
            e = e || {}, this.headers = new Headers, Object.keys(e.headers).forEach(function (t) {
                this.headers.set(t, e.headers[t])
            }.bind(this)), this.redirected = e.redirected, this.status = e.status, this.statusText = e.statusText, this.type = e.type, this.url = e.url, this.parsedBody = e.parsedBody, Object.defineProperty(this, "ok", {
                get: function () {
                    return this.status >= 200 && this.status <= 299
                }.bind(this)
            })
        }

        function n(e, t, r, n, o) {
            var a = {
                url: e,
                version: s.version,
                company: t,
                product: r,
                updated: n,
                revalidated: n,
                accessed: n,
                response: {headers: {}}
            };
            return o && (o.headers.forEach(function (e, t) {
                a.response.headers[t] = e
            }), ["redirected", "status", "statusText", "type", "url"].forEach(function (e) {
                a.response[e] = o[e]
            }), a.response.parsedBody = o.parsedBody), a
        }

        function o(e, t) {
            return !(t && t.method && "GET" !== t.method || t && -1 == ["must-revalidate", "immutable"].indexOf(t.control) || !e.match("^https?://"))
        }

        var a = u.UnityCache, s = a.RequestStore, i = u.fetchWithProgress;
        return r.prototype.arrayBuffer = function () {
            return Promise.resolve(this.parsedBody.buffer)
        }, r.prototype.blob = function () {
            return this.arrayBuffer().then(function (e) {
                return new Blob([e])
            })
        }, r.prototype.json = function () {
            return this.text().then(function (e) {
                return JSON.parse(e)
            })
        }, r.prototype.text = function () {
            var e = new TextDecoder;
            return Promise.resolve(e.decode(this.parsedBody))
        }, function (d, u) {
            function l(t, o) {
                return i(t, o).then(function (t) {
                    return !p.enabled || p.revalidated ? t : 304 === t.status ? (p.result.revalidated = p.result.accessed, p.revalidated = !0, h.storeRequest(p.result).then(function () {
                        e("'" + p.result.url + "' successfully revalidated and served from the indexedDB cache")
                    }).catch(function (t) {
                        e("'" + p.result.url + "' successfully revalidated but not stored in the indexedDB cache due to the error: " + t)
                    }), new r(p.result.response)) : (200 == t.status ? (p.result = n(t.url, p.company, p.product, p.accessed, t), p.revalidated = !0, h.storeRequest(p.result).then(function () {
                        e("'" + p.result.url + "' successfully downloaded and stored in the indexedDB cache")
                    }).catch(function (t) {
                        e("'" + p.result.url + "' successfully downloaded but not stored in the indexedDB cache due to the error: " + t)
                    })) : e("'" + p.result.url + "' request failed with status: " + t.status + " " + t.statusText), t)
                })
            }

            function c(e) {
                u && u.onProgress && (u.onProgress({
                    type: "progress",
                    total: e.parsedBody.length,
                    loaded: e.parsedBody.length,
                    lengthComputable: !0
                }), u.onProgress({
                    type: "load",
                    total: e.parsedBody.length,
                    loaded: e.parsedBody.length,
                    lengthComputable: !0
                }))
            }

            var h = a.getInstance(), f = t("string" == typeof d ? d : d.url), p = {enabled: o(f, u)};
            return u && (p.control = u.control, p.company = u.company, p.product = u.product), p.result = n(f, p.company, p.product, Date.now()), p.revalidated = !1, p.enabled ? h.loadRequest(p.result.url).then(function (t) {
                if (!t || t.version !== s.version) return l(d, u);
                p.result = t, p.result.accessed = Date.now();
                var n = new r(p.result.response);
                if ("immutable" == p.control) return p.revalidated = !0, h.storeRequest(p.result), e("'" + p.result.url + "' served from the indexedDB cache without revalidation"), c(n), n;
                if (function (e) {
                    var t = window.location.href.match(/^[a-z]+:\/\/[^\/]+/);
                    return !t || e.lastIndexOf(t[0], 0)
                }(p.result.url) && (n.headers.get("Last-Modified") || n.headers.get("ETag"))) return fetch(p.result.url, {method: "HEAD"}).then(function (t) {
                    return p.revalidated = ["Last-Modified", "ETag"].every(function (e) {
                        return !n.headers.get(e) || n.headers.get(e) == t.headers.get(e)
                    }), p.revalidated ? (p.result.revalidated = p.result.accessed, h.storeRequest(p.result), e("'" + p.result.url + "' successfully revalidated and served from the indexedDB cache"), c(n), n) : l(d, u)
                });
                var o = (u = u || {}).headers || {};
                return u.headers = o, n.headers.get("Last-Modified") ? (o["If-Modified-Since"] = n.headers.get("Last-Modified"), o["Cache-Control"] = "no-cache") : n.headers.get("ETag") && (o["If-None-Match"] = n.headers.get("ETag"), o["Cache-Control"] = "no-cache"), l(d, u)
            }).catch(function (t) {
                return e("Failed to load '" + p.result.url + "' from indexedDB cache due to the error: " + t), i(d, u)
            }) : i(d, u)
        }
    }(), new Promise(function (e, t) {
        u.SystemInfo.hasWebGL ? 1 == u.SystemInfo.hasWebGL ? t('Your browser does not support graphics API "WebGL 2" which is required for this content.') : u.SystemInfo.hasWasm ? (1 == u.SystemInfo.hasWebGL && u.print('Warning: Your browser does not support "WebGL 2" Graphics API, switching to "WebGL 1"'), u.startupErrorHandler = t, r(0), u.postRun.push(function () {
            r(1), delete u.startupErrorHandler, e(p)
        }), d()) : t("Your browser does not support WebAssembly.") : t("Your browser does not support WebGL.")
    })
}