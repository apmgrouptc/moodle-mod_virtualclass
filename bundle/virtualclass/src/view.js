// This file is part of Vidyamantra - http:www.vidyamantra.com/
/**@Copyright 2014  Vidya Mantra EduSystems Pvt. Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
 */
(function (window) {
    var view = {
        init: function () {
            this.msgBoxClass = 'msgBox';
            this.window = {};
            this.virtualWindow = {};
            return this;
        },

        displayMessage: function (msg, id, className, intoAppend, imageTag) {
            if (typeof imageTag == 'undefined') {
                var msgBox = this.createMsgBox(msg, id, className);
            } else {
                var msgBox = this.createMsgBox(msg, id, className, imageTag);
            }
            var parTag = document.getElementById('vcanvas');
            if (typeof intoAppend != 'undefined') {
                document.getElementById(intoAppend).appendChild(msgBox);
            } else {
                parTag.insertBefore(msgBox, parTag.childNodes[0]);
            }
        },

        createErrorMsg: function (msg, contId, addBefore) {

            var errorCont = document.getElementById(contId);
            if (errorCont == null) {
                var errorCont = document.createElement('div');
                errorCont.id = contId;
                errorCont.innerHTML = msg;
            } else {
                var errMsg = msg + "<br /> " + errorCont.innerHTML;
                errorCont.innerHTML = errMsg;
            }

            var addBeforeElem = document.getElementById(addBefore);
            addBeforeElem.parentNode.insertBefore(errorCont, addBeforeElem);
            return errorCont.id;
        },

        removeErrorMsg: function (id, onlyLatest) {
            var delNode = document.getElementById(id);
            if (typeof onlyLatest != 'undefined') {
                var errMsgArr = delNode.innerHTML.split(/<br>|<br\\>/);
                if (errMsgArr.length > 1) {
                    errMsgArr.shift();
                    delNode.innerHTML = errMsgArr.join();
                    return;
                }
            }
            delNode.parentNode.removeChild(delNode);
        },

        removeErrorContainer: function (id) {
            var element = document.getElementById(id);
            element.parentNode.removeChild(element);
        },

        customCreateElement: function (tagName, id, className) {
            var tag = document.createElement(tagName);
            if (typeof id != 'undefined') {
                tag.id = id;
            }

            if (typeof className != 'undefined') {
                tag.className = className;
            }
            return tag;
        },

        createMsgBox: function (msg, id, className, imageTag) {
            var divTag = this.customCreateElement('div', id, className);
            if (typeof imageTag == 'undefined') {
                var imageHolder = this.customCreateElement('div', id + 'img', className + 'img');
                divTag.appendChild(imageHolder);
            }

            var pTag = this.customCreateElement('p', id + 'Para');
            pTag.innerHTML = msg;
            divTag.appendChild(pTag);
            return divTag;
        },

        disappearBox: function (className) {
            var allDivs = document.getElementsByClassName(this.msgBoxClass + className);
            if (allDivs[0] != null) {
                allDivs[0].parentNode.removeChild(allDivs[0]);
            }
        },

        multiMediaMsg: function (className) {
            if (virtualclass.system.mybrowser.name == 'Firefox') {
                var msg = virtualclass.lang.getString('wbrtcMsgFireFox');
                this.displayMessage(msg, "fireFoxWebrtcCont", this.msgBoxClass + className);

            } else if (virtualclass.system.mybrowser.name == 'Chrome') {
                var msg = virtualclass.lang.getString('wbrtcMsgChrome');
                this.displayMessage(msg, "chormeWebrtcCont", this.msgBoxClass + className);
            }
        },

        canvasDrawMsg: function (className) {
            var mainContainer = document.getElementById('vcanvas');
            mainContainer.className = 'canvasMsgBoxParent';
            if (virtualclass.system.mybrowser.name == 'Firefox') {
                var msg = virtualclass.lang.getString('canvasDrawMsg');
                this.displayMessage(msg, "canvasDrawMsgContFirefox", this.msgBoxClass + className, 'containerWb');

            } else if (virtualclass.system.mybrowser.name == 'Chrome') {
                var msg = virtualclass.lang.getString('canvasDrawMsg');
                this.displayMessage(msg, "canvasDrawMsgContChrome", this.msgBoxClass + className, 'containerWb');
            }
        },

        drawLabel: function (className) {
            var msg = virtualclass.lang.getString('drawArea');
            this.displayMessage(msg, "canvasDrawArea", this.msgBoxClass + className, 'containerWb', false);
        },

        displayMsgBox: function (id, msg) {
            var div = this.customCreateElement('div', id);
            var p = this.customCreateElement('p', id + "Para");
            p.innerHTML = virtualclass.lang.getString(msg);
            div.appendChild(p);
            var a = this.customCreateElement('a', id + "Anchor");
            a.href = window.location;
            a.innerHTML = virtualclass.lang.getString('reload');
            a.onclick = function () {
                window.location.reload();
            };
            div.appendChild(a);

            var virtualclassCont = document.getElementById('virtualclassCont');
            virtualclassCont.insertBefore(div, virtualclassCont.firstChild);
        },

        displayServerError: function (id, msg) {
            var div = this.customCreateElement('div', id);
            div.innerHTML = msg;
            var vcanvas = document.getElementById('vcanvas');
            vcanvas.parentNode.insertBefore(div, vcanvas);
        },

        removeElement: function (id) {
            var errorDiv = document.getElementById(id);
            if (errorDiv != null) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        },

        disableSSUI: function () {
            var sTool = document.getElementById('virtualclassScreenShareTool');
            if (sTool != null) {
                sTool.style.opacity = "0.5";
                sTool.style.pointerEvents = "none";
            }
        },

        disableLeftAppBar: function () {

            var lefAppBar = document.getElementById("virtualclassOptionsCont");
            if (lefAppBar != null) {
                lefAppBar.style.opacity = "0.5";
                lefAppBar.style.pointerEvents = "none";
            }
        }

    };
    view = view.init();

    count = 0;
    view.window.resizeFinished = (function () {
        var timer = 0;
        return function (callback, ms) {
            clearTimeout(timer);
            timer = setTimeout(callback, ms);
        };
    })();

    view.window.resize = function () {

        var res = virtualclass.system.measureResoultion({'width': window.innerWidth, 'height': window.innerHeight});
        virtualclass.vutil.setContainerWidth(res, virtualclass.currApp);
        vcan.renderAll();
    },

//TODO
// this code is not using should be removed
        view.virtualWindow.manupulation = function (e) {
            var message = e.message.virtualWindow;
            if (message.hasOwnProperty('removeVirtualWindow')) {
                if (e.fromUser.userid != wbUser.id) {
                    virtualclass.wb.utility.removeVirtualWindow('virtualWindow');
                }

            } else if (message.hasOwnProperty('createVirtualWindow')) {
                if (message.hasOwnProperty('toolHeight')) {
                    localStorage.setItem('toolHeight', message.toolHeight);
                }

                if (e.fromUser.userid != wbUser.id) {
                    virtualclass.wb.utility.createVirtualWindow(message.createVirtualWindow);

                }
            } else if (message.hasOwnProperty('shareBrowserWidth')) {
                if (message.hasOwnProperty('toolHeight')) {
                    localStorage.setItem('toolHeight', message.toolHeight);
                }

                if (localStorage.getItem('teacherId') != null) {
                    var toolBoxHeight = virtualclass.wb.utility.getWideValueAppliedByCss('commandToolsWrapper');
                    localStorage.setItem('toolHeight', toolBoxHeight);
                }

                if (e.fromUser.userid != wbUser.id) {
                    if (localStorage.getItem('teacherId') != null) {
                        virtualclass.wb.utility.makeCanvasEnable();
                    }
                    otherBrowser = message.browserRes;
                } else {
                    myBrowser = virtualclass.system.measureResoultion({
                        'width': window.outerWidth,
                        'height': window.innerHeight
                    });
                }

                if (typeof myBrowser == 'object' && typeof otherBrowser == 'object') {
                    if (myBrowser.width > otherBrowser.width) {
                        if (!virtualclass.wb.gObj.virtualWindow) {
                            virtualclass.wb.utility.createVirtualWindow(otherBrowser);
                            virtualclass.wb.gObj.virtualWindow = true;
                        }
                    } else if (myBrowser.width < otherBrowser.width) {
                        if (!virtualclass.wb.gObj.virtualWindow) {
                            // virtualclass.wb.gObj.virtualWindow = true;
                            var canvaContainer = document.getElementById("vcanvas");
                            var rightOffset = virtualclass.wb.utility.getElementRightOffSet(canvaContainer);
                            if (localStorage.getItem('teacherId') != null) {
                              virtualclass.vutil.beforeSend({
                                    'virtualWindow': {
                                        'createVirtualWindow': myBrowser - rightOffset,
                                        'toolHeight': toolBoxHeight
                                    }
                                });
                            } else {
                              virtualclass.vutil.beforeSend({'virtualWindow': {'createVirtualWindow': myBrowser - rightOffset}});
                            }
                        }
                    }
                }
            }

        };
    window.view = view;
})(window);
