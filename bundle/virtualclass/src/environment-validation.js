// This file is part of Vidyamantra - http:www.vidyamantra.com/
/**@Copyright 2014  Vidya Mantra EduSystems Pvt. Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
 */
(function (window) {
    var system = {
        init: function () {
            this.wbRtc = {};
            this.wbRtc.className = 'webrtcCont';
            this.mybrowser = {};
            return this;
        },
        isCanvasSupport: function (navigator, browserName, version) {
            if (browserName == 'MSIE') {
                return (version != 9) ? false : true;
            } else {
                return (!window.CanvasRenderingContext2D) ? false : true;
            }
        },

        isWebSocketSupport: function (navigator, browser, version) {
            if (typeof window.WebSocket != 'undefined' && (typeof window.WebSocket == 'function' || typeof window.WebSocket == 'object') && window.WebSocket.hasOwnProperty('OPEN')) {
                return true;
            } else {
                return false;
            }

        },

        isLocalStorageSupport: function () {
            return (Storage !== void(0));
        },

        isGetUserMediaSupport: function (browser, version) {
            navigator.getUserMedia = ( navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.msGetUserMedia);

            return (navigator.getUserMedia) ? true : false;
        },

        isIndexedDbSupport: function () {
            return (window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB) ? true : false;
        },

        isWorkerSupport: function () {
            return !!window.Worker;
        },

        isAudioApiSupport: function () {
            return (window.AudioContext || window.webkitAudioContext) ? true : false;
        },

        isTypedArraySupport: function () {
            return !!( 'ArrayBuffer' in window );
        },

        isScreenShareSupport: function (bname, bversion) {
            if (bname == 'Firefox') {
                return (bversion >= 34);
            } else if (bname == 'Chrome') {
                return (bversion >= 39) ? true : false;
            }
            return false;
        },

        setValue: function (key, value) {
            this[key] = value;
        },

        checkBrowserFunctions: function (bname, bversion) {
            this.setValue('canvas', this.isCanvasSupport());
            this.setValue('webSocket', this.isWebSocketSupport());
            this.setValue('getusermedia', this.isGetUserMediaSupport());
            this.setValue('indexeddb', this.isIndexedDbSupport());
            this.setValue('webworker', this.isWorkerSupport());
            this.setValue('webaudio', this.isAudioApiSupport());
            this.setValue('typedarray', this.isTypedArraySupport());
            this.setValue('screenshare', this.isScreenShareSupport(bname, bversion));
            this.setValue('localstorage', this.isLocalStorageSupport());
        },

        measureResoultion: function (resolution) {
            var element = document.getElementById('virtualclassCont');
            var offset = vcan.utility.getElementOffset(element);
            var offsetLeft = offset.x;
            if (resolution.width < 1024) {
                var width = 1024 - offsetLeft;
            } else {
                var width = resolution.width - offsetLeft;
            }
            var height = resolution.height - offset.y;
            return {'width': (width), 'height': (height)};
        },
        setAppDimension: function () {
            var measureRes = this.measureResoultion({'width': window.innerWidth, 'height': window.innerHeight});
            //var mainWrapper =  document.getElementById('virtualclassCont');
            virtualclass.vutil.setContainerWidth(measureRes, virtualclass.currApp);
            if (virtualclass.currApp == 'Whiteboard') {
                system.setCanvasDimension(measureRes);
            }
        },
        setCanvasDimension: function (measureRes) {
            if (typeof vcan.main.canvas != 'undefined') {
                var canvas = vcan.main.canvas;
                ctx = vcan.main.canvas.getContext('2d');

                canvas.width = measureRes.width;
                var toolWrapperHeight = (virtualclass.gObj.uRole == 't') ? (45 + 20) : 10;
                canvas.height = measureRes.height - toolWrapperHeight;
                console.log("canvas width " + canvas.width);
                //var element = document.getElementById('canvas');
                var offset = vcan.utility.getElementOffset(document.getElementById('canvas'));
                vcan.main.offset.x = offset.x;
            }
        },
        getResoultion: function (windowWidth) {
            var resolution = {};
            if (windowWidth < 1280) {
                resolution.width = 1024;
                resolution.height = 768;
            } else if (windowWidth >= 1280 && windowWidth < 1366) {
                resolution.width = 1280;
                resolution.height = 1024;
            } else if (windowWidth >= 1366 && windowWidth < 1920) {
                resolution.width = 1366;
                resolution.height = 768;
            } else if (windowWidth >= 1920) {
                resolution.width = 1920;
                resolution.height = 1080;
            }
            return resolution;
        },

        reportBrowser: function (user) {
            var errors = this.getErrors(user);
            if (errors.length > 1) {
                virtualclass.error.push(errors.join(",") + " are disabled in your browser.");
            } else if (errors.length == 1) {
                virtualclass.error.push(errors + ' is disabled in your browser.');
            }
        },

        getErrors: function (user) {
            var errors = [];
            //webSocket to websocket
            var apis = ['canvas', 'webSocket', 'getusermedia', 'webaudio', 'indexeddb', 'localstorage', 'typedarray'];
            if (user == 't') apis.push('webworker', 'screenshare');
            for (var i = 0; i < apis.length; i++) {
                if (!this[apis[i]]) {
                    if (apis[i] == 'screenshare') {
                        virtualclass.gObj.errNotScreenShare = true;
                    }
                    errors.push(virtualclass.lang.getString('err' + apis[i]));
                }
            }
            return errors;
        },
        isiOSDevice: function () {
            var iOSVersion = parseFloat(
                    ('' + (/CPU.*OS ([0-9_]{1,5})|(CPU like).*AppleWebKit.*Mobile/i.exec(navigator.userAgent) || [0, ''])[1])
                        .replace('undefined', '3_2').replace('_', '.').replace('_', '')
                ) || false;
            return iOSVersion;
        },

        isAndroid: function () {
            var ua = navigator.userAgent.toLowerCase();
            return ua.indexOf("android") > -1;
        },

        check: function () {
            var iOS = this.isiOSDevice();
            this.device = "desktop";
            if (iOS) {
                var bname = "iOS";
                var bversion = iOS;
                this.device = "mobTab";
//                    this.mybrowser.name = bname;
//                    this.mybrowser.version = bversion;
            } else {

                var androidDevice = this.isAndroid();
                var vendor = this.mybrowser.detection();
                var bname = vendor[0];
                var bversion = parseFloat(vendor[1]);
//                    this.mybrowser.name = bname;
//                    this.mybrowser.version = bversion;
            }

            this.mybrowser.name = bname;
            this.mybrowser.version = bversion;

            this.checkBrowserFunctions(bname, bversion);
//                virtualclass.vutil.initDisableVirtualClass();
            if ((typeof androidDevice != 'undefined' && androidDevice)) {
                this.device = "mobTab";
                if (virtualclass.gObj.uRole == 't') {
//                        virtualclass.gObj.errNotDesktop = true;
                    virtualclass.vutil.initDisableVirtualClass();
                    virtualclass.error.push("We support only desktop computer not  any tablet and mobile for teacher.");

                } else {
                    if (androidDevice) {
                        if (bname == 'Chrome') {
                            if (bversion >= 40) {

                                //     DO : Disable Audio Controls and Cam Support for this user
                                virtualclass.vutil.initDisableAudVid();

                            } else {
                                virtualclass.error.push(bname + ' ' + bversion + ' ' + " is not supported, we support chrome  versoin 40 or newer on Android");
                                virtualclass.vutil.initDisableVirtualClass();
                            }
                        } else {
                            virtualclass.error.push(bname + ' ' + " is not supported, we support Chrome 40 or newer on andorid");
                            virtualclass.vutil.initDisableVirtualClass();
                        }
                    }
                }

            } else if ((bname == 'Chrome' && bversion >= 40) || (bname == 'Firefox' && bversion >= 35) ||
                (virtualclass.gObj.uRole == 's' && bname == 'OPR' > bversion >= 26)) {
                this.reportBrowser(virtualclass.gObj.uRole);
            } else if ((bname == 'Chrome' && bversion < 40) || (bname == 'Firefox' && bversion < 35) ||
                (virtualclass.gObj.uRole == 's' && bname == 'OPR' && bversion < 26)) {
                this.reportBrowser(virtualclass.gObj.uRole);

                virtualclass.error.push(virtualclass.lang.getString('chFireBrowsersIssue', [bname, bversion]));
            } else if (bname == 'OPR' && bversion >= 26) {
                this.reportBrowser(virtualclass.gObj.uRole);
                if (virtualclass.gObj.uRole == 't') {
                    virtualclass.error.push(virtualclass.lang.getString('operaBrowserIssue', [bname, bversion]));
                }

            } else if (bname == 'Safari') {
                if (bversion >= 8) {
                    if (virtualclass.gObj.uRole == 't') {
                        virtualclass.vutil.initDisableVirtualClass();
                        virtualclass.error.push(virtualclass.lang.getString('teacherSafariBrowserIssue', [bname, bversion]));

                    } else {
                        virtualclass.vutil.initDisableAudVid();
                        virtualclass.error.push(virtualclass.lang.getString('studentSafariBrowserIssue', [bname, bversion]));
                        virtualclass.user.control.audioWidgetDisable();
                    }
                } else {
                    virtualclass.vutil.initDisableVirtualClass();
                    virtualclass.error.push(virtualclass.lang.getString('safariBrowserIssue', [bname, bversion]));
                }

                //DO : Disable Audio Controls and Cam Support for this user.
            } else if (bname == 'iOS') {
                var iPad = /(iPad)/g.test(navigator.userAgent);
                if (iPad) {
                    if (virtualclass.gObj.uRole == 's') {
                        if (bversion >= 8) {
                            virtualclass.vutil.initDisableAudVid();
                            virtualclass.gObj.iosIpadbAudTrue = false;
                            //iosIpadbAudTrue
                            var iosAudTrigger = document.createElement('div');
                            iosAudTrigger.innerHTML = "Tap here for enable the audio";
                            iosAudTrigger.id = "iosAudioTrigger";
                            iosAudTrigger.addEventListener('click', function () {
                                virtualclass.vutil.firstiOSaudioCall();
                                this.parentNode.removeChild(this);

                            });

                            var audioWrapper = document.getElementById('audioWidget');
                            audioWrapper.parentNode.insertBefore(iosAudTrigger, audioWrapper.nextSibling);

                        } else {
                            virtualclass.vutil.initDisableVirtualClass();
                            virtualclass.error.push(virtualclass.lang.getString('ios7support'));
                        }
                    } else {
                        virtualclass.vutil.initDisableVirtualClass();
                        virtualclass.error.push(virtualclass.lang.getString('supportDesktop'));
                    }
                } else {
                    virtualclass.vutil.initDisableVirtualClass();
                    virtualclass.error.push(virtualclass.lang.getString('notSupportIphone'));
                }
                // here bversion is version of operating system
                // we have to disable the audio compability

            } else {
                if (this.mybrowser.detectIE()) {
                    virtualclass.gObj.errIE = true;
                    virtualclass.error.push(virtualclass.lang.getString('ieBrowserIssue'));
                    virtualclass.vutil.initDisableVirtualClass();
                } else {
                    virtualclass.error.push(virtualclass.lang.getString('commonBrowserIssue', [bname, bversion]));
                    virtualclass.vutil.initDisableVirtualClass();
                }
//                    virtualclass.error.push( bname +  ' ' + bversion + ' ' + virtualclass.lang.getString('commonBrowserIssue'));
            }
        }

//            check : function (){
//                var vendeor = this.mybrowser.detection();
//                bname = vendeor[0];
//                bversion = parseFloat(vendeor[1]);
//
////                this.isCanvasSupport(navigator, browserName, browserVersion);
////                this.isWebRtcSupport(navigator, browserName, browserVersion);
////                this.isWebSocketSupport(navigator, browserName, browserVersion);
//                this.checkBrowserFunctions();
////                this.isBrowserCompatible(browserName, browserVersion);
//                if ( this.mybrowser == 'Chrome' &&   bversion  >= 40 ||
//                        this.mybrowser == 'Firefox' &&   bversion  >= 35)  {
//                    this.reportBrowser(virtualclass.gObj.uRole);
//                }    
//            }
    };

    system = system.init();
    // There could be the problem
    window.addEventListener('resize',
        function () {
            if (window.earlierWidth != window.innerWidth) {
                system.setAppDimension();
            }
        }
    );

    window.addEventListener('resize',
        function () {
            if (window.earlierWidth != window.innerWidth) {
                virtualclass.view.window.resize();
            }
        }
    );

    system.mybrowser.detectIE = function () {
        var ua = window.navigator.userAgent;

        var msie = ua.indexOf('MSIE ');
        if (msie > 0) {
            // IE 10 or older => return version number
            return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
        }

        var trident = ua.indexOf('Trident/');
        if (trident > 0) {
            // IE 11 => return version number
            var rv = ua.indexOf('rv:');
            return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
        }

        var edge = ua.indexOf('Edge/');
        if (edge > 0) {
            // IE 12 => return version number
            return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
        }

        // other browser
        return false;
    },
        system.mybrowser.detection = function () {

            var ua = navigator.userAgent, tem,
                M = ua.match(/(opera|opr|OPR(?=\/))\/?\s*([\d\.]+)/i) || []; //for opera especially
            if (M.length <= 0) {
                M = ua.match(/(chrome|safari|firefox|trident(?=\/))\/?\s*([\d\.]+)/i) || [];
                if (M[1] == 'Safari') {
                    var version = ua.match(/(version(?=\/))\/?\s*([\d\.]+)/i) || [];
                    M[2] = version[2];
                }
            }
            if (/trident/i.test(M[1])) {
                tem = /\brv[ :]+(\d+(\.\d+)?)/g.exec(ua) || [];
                return 'IE ' + (tem[1] || '');
            }

            M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
            if ((tem = ua.match(/version\/([\.\d]+)/i)) != null) {
                M[2] = tem[1];
            }
            // return M.join(' ');
            return M;
        },
        window.system = system;
})(window);
