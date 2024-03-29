// This file is part of Vidyamantra - http:www.vidyamantra.com/
/**@Copyright 2014  Vidya Mantra EduSystems Pvt. Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
 */
(function (window, document) {
    var user = function (config) {
        return {
            //TODO function name should be change
            assignRole: function (role, app) {
                if (role == 't') {
                    if(localStorage.getItem('reclaim') == null){
                        virtualclass.html.leftAppBar();
                    }

                    virtualclass.attachFunction();

                    //var virtualclassOptionsContWidth = document.getElementById("virtualclassOptionsCont").offsetWidth;

                    if(app == 'Whiteboard'){
                        window.virtualclass.wb.attachToolFunction(vcan.cmdWrapperDiv, true);
                    }

                    if (virtualclass.gObj.uRole == 't') {
                        if (virtualclass.hasOwnProperty('previrtualclass')) {
                            virtualclass.vutil.makeActiveApp("virtualclass" + app, virtualclass.previrtualclass);
                        } else {
                            virtualclass.vutil.makeActiveApp("virtualclass" + app);
                        }

                        if(app == 'Whiteboard'){
                            virtualclass.wb.utility.makeCanvasEnable();
                        }
                    }
                }
            },

            teacherIsAlreadyExist: function () {
                var allExistedUser = document.getElementById('chat_div').getElementsByClassName('ui-memblist-usr');
                var role;
                for (var i = 0; i < allExistedUser.length; i++) {
                    role = allExistedUser[i].getAttribute('data-role');
                    if (role == 't') {
                        return true;
                    }
                }
                return false;
            },

            createControl: function (userId, controls) {
                var controlCont = document.createElement('div');
                controlCont.id = userId + "ControlContainer";
                controlCont.className = "controls";
                this.createControlDivs(controlCont, userId, controls);
                return controlCont;
            },

            createControllerElement : function (userId, imgName) {
                var elemBlock = document.createElement('span');
                elemBlock.id = userId + imgName + "Img";

                var elemAnch = document.createElement('a');
                elemAnch.id = userId + imgName + "Anch";
                elemAnch.className = "tooltip";
                elemAnch.appendChild(elemBlock);

                var imgCont = document.createElement('div');
                imgCont.id = userId + imgName + "Cont";
                imgCont.className = "controleCont";
                imgCont.appendChild(elemAnch);

                return [imgCont, elemBlock];
            },

            createAssignControl: function (controlCont, userId, aRoleEnable, currTeacher) {
                var that = this;

                //TODO var [a, , b] = [1,2,3]; this would be available in ecmascript 6, will have to convert
                var elems = this.createControllerElement(userId, "contrAssign");
                var controller = elems[0];
                var assignBlock = elems[1];

                var controllerDiv = document.getElementById(userId + 'ControlContainer');

                if (controllerDiv != null) {
                    var controllers = controllerDiv.getElementsByClassName('controleCont');
                    if (controllers.length <= 0) {
                        controllerDiv.appendChild(controller);
                    } else {
                        controllerDiv.insertBefore(controller, controllerDiv.firstChild);
                    }
                } else {
                    controlCont.appendChild(controller);
                }
				
                virtualclass.user.control.changeAttribute(userId, assignBlock, aRoleEnable, 'assign', 'aRole');

                if (typeof currTeacher != 'undefined') {
                    assignBlock.className = assignBlock.className + ' currTeacher';
                }
                assignBlock.addEventListener('click', function () {
                    that.control.init.call(that, assignBlock);
                });

            },


            // TODO this function should be normalize with other
            // should be converted into smaller funciton rather than single
            createControlDivs: function (controlCont, userId, controls) {
                var that = this;
                //var userObj = localStorage.getItem(userId);
                var uObj = false;
                var userObj = localStorage.getItem('virtualclass' + userId);
                if (userObj != null) {
                    uObj = true;
                    userObj = JSON.parse(userObj);
                    if (userObj.hasOwnProperty('currTeacher')) {
                        virtualclass.gObj[userId + 'currTeacher'] = {};
                        if (userObj.currTeacher == true) {
                            virtualclass.user.control.currTeacherAlready = true;
                            var currTeacher = true;
                            virtualclass.gObj[userId + 'currTeacher'].ct = true;
                        } else {
                            virtualclass.gObj[userId + 'currTeacher'].ct = false;
                        }
                    }
                }


                var assignDisable = localStorage.getItem('reclaim');
                if (assignDisable != null && assignDisable) {
                    var aRoleEnable = false;
                } else {
                    var aRoleEnable = true;
                }

                var orginalTeacher = virtualclass.vutil.userIsOrginalTeacher(userId);
                var isUserTeacher = virtualclass.vutil.isUserTeacher(userId);
                //var this should be in normalize in function
                for (var i = 0; i < controls.length; i++) {
                    if (controls[i] == 'assign' && orginalTeacher) {
                        if (typeof currTeacher != 'undefined') {
                            this.createAssignControl(controlCont, userId, aRoleEnable, currTeacher);
                        } else {
                            this.createAssignControl(controlCont, userId, aRoleEnable);
                        }

                    } else if (controls[i] == 'audio') {

                        var elems = this.createControllerElement(userId, "contrAud");
                        var controller = elems[0];
                        var audBlock = elems[1];
                        controlCont.appendChild(controller);

                        if (uObj && userObj.hasOwnProperty('aud')) {
                            var audEnable = (userObj.aud) ? true : false;
                        } else {
                            var audEnable = true;
                        }

                        virtualclass.user.control.changeAttribute(userId, audBlock, audEnable, 'audio', 'aud');

                        if (orginalTeacher) {
                            audBlock.addEventListener('click', function () {
                                that.control.init.call(that, audBlock);
                            });
                        }

                    } else if (controls[i] == 'chat') {

                        var elems = this.createControllerElement(userId, "contrChat");

                        var controller = elems[0];
                        var chatBlock = elems[1];

                        controlCont.appendChild(controller);

                        if (orginalTeacher) {
                            chatBlock.addEventListener('click', function () {
                                that.control.init.call(that, chatBlock);
                            });
                        }

                        if (uObj && userObj.hasOwnProperty('ch')) {
                            var chEnable = (userObj.ch) ? true : false;
                        } else {
                            var chEnable = true;
                        }
                        virtualclass.user.control.changeAttribute(userId, chatBlock, chEnable, 'chat', 'ch');

                    } else if (controls[i] == 'editorRich' || (controls[i] == 'editorCode')){
                        if(localStorage.hasOwnProperty('orginalTeacherId')){
                            if (uObj && userObj.hasOwnProperty(controls[i])) {
                                var editorBlockEnable = (userObj[controls[i]]) ? true : false;
                            } else {
                                var editorBlockEnable = false; //By default it would be false
                            }

                            var elems = this.createControllerElement(userId,  'contr' + controls[i]);
                            var controller = elems[0];
                            var editorBlock = elems[1];
                            controller.className += ' controller' + controls[i];

                            controlCont.appendChild(controller);

                            if(virtualclass.currApp != virtualclass.vutil.capitalizeFirstLetter(controls[i])){
                                controller.style.display = 'none';
                            }

                            virtualclass.user.control.changeAttribute(userId, editorBlock, editorBlockEnable, controls[i], controls[i]);

                            if (orginalTeacher) {
                                editorBlock.addEventListener('click', that.closureEditor(that, editorBlock));
                            }
                        }
                    }
                }
            },

            closureEditor : function (that, editorBlock){
                return function(){
                    //alert('you clicked' + i);
                    that.control.init.call(that, editorBlock);
                }
            },

            control: {

                /**
                 * Display message box with showing read only and write and read mode
                 * @param editorType type of editor
                 * @param writeMode readonly OR write and read mode
                 */
                toggleDisplayWriteModeMsgBox : function (editorType, writeMode){

                    var writeModeBox = document.getElementById(editorType+'writeModeBox');


                    var modeMessage = (writeMode)  ? virtualclass.lang.getString("writemode") :  virtualclass.lang.getString("readonlymode");
                    if(writeModeBox == null){
                        writeModeBox = document.createElement('div');
                        writeModeBox.id = editorType + 'writeModeBox';
                        document.getElementById('virtualclass' + editorType + 'Body').appendChild(writeModeBox);
                    }
                    writeModeBox.className = 'writeModeBox';
                    writeModeBox.dataset.writeMode = writeMode;
                    writeModeBox.innerHTML = modeMessage;

                    if(editorType == "EditorRich"){
                        this.tooglDisplayEditorToolBar(writeMode);
                    }
                },

                /**
                 * Either enable or disable toolbar of Editor Rich Text
                 * @param writeMode expects true or flase
                 */
                tooglDisplayEditorToolBar : function (writeMode){
                    var editorToolBars = document.getElementsByClassName('vceditor-toolbar');
                    var editorToolBar = editorToolBars[0];
                    if(editorToolBars.length > 0){
                        if(writeMode){
                            editorToolBar.style.pointerEvents = 'visible';
                            editorToolBar.style.opacity = "1";
                        }else {
                            editorToolBar.style.pointerEvents = 'none';
                            editorToolBar.style.opacity = "0.5";
                        }

                    }
                },

                //TODO this funciton should be improved
                received_editorRich : function (msg){
                    var action;
                    if(msg.status){
                        if(virtualclass.gObj.uid == msg.toUser){
                            virtualclass.editorRich.cm.setOption('readOnly', false);
                        } else {
                            this.enable(msg.toUser, 'editorRich', 'editorRich', 'editorRich');
                        }
                        action = true;
                        localStorage.setItem('editorRich', action);
                    } else {
                        if(virtualclass.gObj.uid == msg.toUser){
                            virtualclass.editorRich.cm.setOption('readOnly', true);
                        } else {
                            this.disable(msg.toUser, 'editorRich', 'editorRich', 'editorRich');
                        }
                        action = false;
                        localStorage.setItem('editorRich', action);
                    }

                    if(localStorage.getItem('orginalTeacherId') == null){
                        this.toggleDisplayWriteModeMsgBox('EditorRich', action);
                    }

                },

                //TODO this funciton should be improved
                received_editorCode : function (msg){
                    var action;
                    if(msg.status){
                        if(virtualclass.gObj.uid == msg.toUser){
                            virtualclass.editorCode.cm.setOption('readOnly', false);
                        } else {
                            this.enable(msg.toUser, 'editorCode', 'editorCode', 'editorCode');
                        }
                        action = true;
                        localStorage.setItem('editorCode', action);
                    } else {
                        if(virtualclass.gObj.uid == msg.toUser){
                            virtualclass.editorCode.cm.setOption('readOnly', true);
                        } else {
                            this.disable(msg.toUser, 'editorCode', 'editorCode', 'editorCode');
                        }
                        action = false;
                        localStorage.setItem('editorCode', action);
                    }
                    if(localStorage.getItem('orginalTeacherId') == null){
                        this.toggleDisplayWriteModeMsgBox('EditorCode', action);
                    }

                },

                onmessage : function (e){
                   this['received_' + e.message.control](e.message);

                   //if(virtualclass.gObj.uid == e.message.toUser){
                   //    this['received_' + e.message.control](e.message);
                   //}
                },

                addCurrTeacherToControl: function (id) {
                    var elem = document.getElementById(id);
                    if (elem != null) {
                        if (virtualclass.vutil.elemHasAnyClass(id)) {
                            elem.classList.add('currTeacher');
                        } else {
                            elem.className = 'currTeacher';
                        }
                    }
                },

                removeCurrTeacherFromControl: function (id) {
                    var elem = document.getElementById(id);
                    if (virtualclass.vutil.elemHasAnyClass(id)) {
                        elem.classList.remove('currTeacher');
                        var uidPos = id.indexOf("contr");
                        var userId = id.substring(0, uidPos);
                        virtualclass.user.control.updateUser(userId, 'currTeacher', false);
                    }
                },

                removeAudioFromParticipate: function (id) {
                    var tobeDeleted = document.getElementById(id + 'contrAssignCont');
                    if (tobeDeleted != null) {
                        tobeDeleted.parentNode.removeChild(tobeDeleted);
                    }
                },

                disable: function (toUser, control, contIdPart, label) {
                    var elem = document.getElementById(toUser + 'contr' + contIdPart + 'Img');
                    if(elem == null){
                        return;
                    }
                    virtualclass.user.control._disable(elem, control, toUser, label);

                },


                _disable: function (elem, control, userId, label) {

                    elem.parentNode.setAttribute('data-title', virtualclass.lang.getString(control + "Disable"));
                    elem.setAttribute('data-' + control + '-disable', 'true');
					
					elem.className = "icon-" + control + "Img block" + ' ' + control + 'Img';
                    if (control == 'assign') {
                        elem.parentNode.classList.remove('tooltip');
                        this.addCurrTeacherToControl(elem.id);
                        var userObj = localStorage.getItem('virtualclass' + userId);
                        userObj = JSON.parse(userObj);

                        if (virtualclass.gObj.hasOwnProperty(userId + 'currTeacher')) {
                            if (virtualclass.gObj[userId + 'currTeacher'].ct || (virtualclass.gObj.hasOwnProperty('controlAssign') && virtualclass.gObj.controlAssign && userObj.currTeacher)) {
                                virtualclass.user.control.updateUser(userId, 'currTeacher', true);
                            }
                        } else {

                            if (virtualclass.gObj.hasOwnProperty('controlAssign') && virtualclass.gObj.controlAssignId == userId) {
                                virtualclass.user.control.updateUser(userId, 'currTeacher', true);
                            }
                        }
                    } else if (control == 'audio') {
                        //alert('suman bogati');
                        //debugger;
                        elem.className = "icon-" + control + "DisImg block" + ' ' + control + 'DisImg';
                    }
/*					else {
                        elem.className = "icon-" + control + "Img block" + ' ' + control + 'Img';
                    }
*/
                    virtualclass.user.control.updateUser(userId, label, false);
                },


                enable: function (toUser, control, contIdPart, label) {
                    var elem = document.getElementById(toUser + 'contr' + contIdPart + 'Img');
                    if(elem == null){
                        console.log("Element is Null");
                        return;
                    }
                    virtualclass.user.control._enable(elem, control, toUser, label);
                },
                _enable: function (elem, control, userId, label) {
                    elem.parentNode.setAttribute('data-title', virtualclass.lang.getString(control + "Enable"));
                    if (control == 'audio') {
                        elem.parentNode.setAttribute('data-title', virtualclass.lang.getString(control + "Off"));
                    }
                    elem.setAttribute('data-' + control + '-disable', "false");
                    elem.className = "icon-" + control + "Img enable" + ' ' + control + 'Img';


                    virtualclass.user.control.updateUser(userId, label, true);
                },

                changeAttribute: function (userId, elem, elemEnable, control, label) {
                    if (elemEnable) {
                        virtualclass.user.control._enable(elem, control, userId, label);
                    } else {
                        virtualclass.user.control._disable(elem, control, userId, label);
                    }
                },

                init: function (tag, defaultAction, searchBy) {

                    if(typeof searchBy != 'undefined'){
                        searchBy = searchBy;
                    } else {
                        searchBy = "Img";
                    }

                    var compId = tag.id;
                    var ep = compId.indexOf("contr");
                    var userId = compId.substring(0, ep);
                    var restString = compId.split('contr')[1];
                    var imgPos = restString.indexOf(searchBy);

                    var control = restString.substring(0, imgPos);
                    //TODO this function should be generalise
                    if (control == 'Assign') {
                        virtualclass.gObj.controlAssign = true;
                        virtualclass.gObj.controlAssignId = userId;
                        var assignDisable = (tag.getAttribute('data-assign-disable') == 'true') ? true : false;
                        if (!assignDisable) {
                            this.control.changeAttribute(userId, tag, assignDisable, 'assign', 'aRole');
                            virtualclass.user.control._assign(userId);
                            virtualclass.user.control.changeAttrToAssign('block');
                        }

                        if (localStorage.getItem('orginalTeacherId') == null) {
                            virtualclass.user.control.removeAudioFromParticipate(userId);
                        }
                    } else {
                        var action, ctrType, boolVal;
                        //TODO this should be generalise
                        if(control == 'Chat'){
                            tag.className = 'contrChatBlock';
                            ctrType = 'chat'
                        }else if(control == 'Aud'){
                            ctrType = 'audio';
                        }else {
                            ctrType = control;
                        }

                        if(typeof defaultAction != 'undefined'){
                            boolVal = (defaultAction == 'enable') ? true : false;

                            action = (boolVal) ? 'enable' : 'block';

                        } else {
                            if (tag.getAttribute('data-'+ctrType+'-disable') == 'true') {
                                action = 'enable';
                                boolVal = true;

                            } else {
                                action = 'block';
                                boolVal = false;

                            }
                        }

                        this.control.changeAttribute(userId, tag, boolVal, ctrType, virtualclass.vutil.smallizeFirstLetter(control));
                        this.control['_'+ctrType].call(this.control, userId, action);

                    }
                },

                init_old: function (tag) {
                    var compId = tag.id;
                    var ep = compId.indexOf("contr");
                    var userId = compId.substring(0, ep);
                    var restString = compId.split('contr')[1];
                    var imgPos = restString.indexOf("Img");
                    var control = restString.substring(0, imgPos);
                    //TODO this function should be generalise
                    if (control == 'Assign') {
                        virtualclass.gObj.controlAssign = true;
                        virtualclass.gObj.controlAssignId = userId;
                        var assignDisable = (tag.getAttribute('data-assign-disable') == 'true') ? true : false;
                        if (!assignDisable) {
                            this.control.changeAttribute(userId, tag, assignDisable, 'assign', 'aRole');
                            virtualclass.user.control._assign(userId);
                            virtualclass.user.control.changeAttrToAssign('block');
                        }

                        if (localStorage.getItem('orginalTeacherId') == null) {
                            virtualclass.user.control.removeAudioFromParticipate(userId);
                        }
                    } else if (control == 'Chat') {

                        var action;
                        if (tag.getAttribute('data-chat-disable') == 'true') {
                            tag.className = 'contrChatBlock';
                            action = 'enable';
                            this.control.changeAttribute(userId, tag, true, 'chat', 'ch');
                        } else {
                            action = 'block';
                            this.control.changeAttribute(userId, tag, false, 'chat', 'ch');
                        }
                        this.control._chat(userId, action);
                    } else if (control == 'Aud') {
                        var action;
                        if (tag.getAttribute('data-audio-disable') == 'true') {
                            action = 'enable';
                            this.control.changeAttribute(userId, tag, true, 'audio', 'aud');
                        } else {
                            action = 'block';
                            this.control.changeAttribute(userId, tag, false, 'audio', 'aud');
                        }
                        this.control._audio(userId, action);
                    }
                },

                _assign: function (userId, notsent, fromUserId) {
                   virtualclass.vutil.assignRole();
                    virtualclass.vutil.removeAppPanel();
                    if (!virtualclass.vutil.chkValueInLocalStorage('orginalTeacherId')) {
                        var canvasWrapper = document.getElementById("vcanvas");
                        canvasWrapper.className = canvasWrapper.className.replace(/\bteacher\b/, ' ');
                        canvasWrapper.className = 'student';
                    }
                    localStorage.setItem('canvasDrwMsg', true);
                    var ssVideo = document.getElementById('virtualclassScreenShareLocalVideo');
                    if (ssVideo != null && ssVideo.tagName == "VIDEO") {
                        virtualclass.vutil.videoTeacher2Student('ScreenShare', true);
                    }

                    var app;
                    if (virtualclass.currApp == "ScreenShare") {
                        app = 'ss';

                        if (virtualclass[app].hasOwnProperty('currentStream')) {
                            virtualclass[app].currentStream.stop();
                        }
                        virtualclass[app] = "";

                    }

                    if (typeof notsent == 'undefined') {
                      virtualclass.vutil.beforeSend({'assignRole': true, toUser: userId});
                    }
                    if (localStorage.getItem('orginalTeacherId') == null) {
                        if (typeof fromUserId == 'undefined') {
                            fromUserId = userId;
                        }
                        var controlContainer = document.getElementById(fromUserId + 'ControlContainer').getElementsByClassName('controleCont')[0];
                        controlContainer.removeChild(controlContainer.firstChild);

                        //controlContainer.parentNode.removeChild(controlContainer);
                    }
                },
                _chat: function (userId, action) {
                    if (action == 'enable') {
                      virtualclass.vutil.beforeSend({'enc': true, toUser: userId});
                    } else {
                        var user = virtualclass.user.control.updateUser(userId, 'ch', false);
                      virtualclass.vutil.beforeSend({'dic': true, toUser: userId});
                    }
                },
                _audio: function (userId, action) {
                    if (action == 'enable') {
                      virtualclass.vutil.beforeSend({'ena': true, toUser: userId});
                    } else {
                      virtualclass.vutil.beforeSend({'dia': true, toUser: userId});
                    }
                },

                _editorRich: function (userId, action) {
                    if (action == 'enable') {
                      virtualclass.vutil.beforeSend({'status': true, control:'editorRich', toUser: userId});
                    } else {
                      virtualclass.vutil.beforeSend({'status': false, control:'editorRich', toUser: userId});
                    }
                },


                _editorCode: function (userId, action) {
                    if (action == 'enable') {
                      virtualclass.vutil.beforeSend({'status': true, control:'editorCode', toUser: userId});
                    } else {
                      virtualclass.vutil.beforeSend({'status': false, control:'editorCode', toUser: userId});
                    }
                },


                _audio: function (userId, action) {
                    if (action == 'enable') {
                      virtualclass.vutil.beforeSend({'ena': true, toUser: userId});
                    } else {
                      virtualclass.vutil.beforeSend({'dia': true, toUser: userId});
                    }
                },


                audioWidgetEnable: function () {
                    localStorage.setItem('audEnable', "true");
                    var studentSpeaker = document.getElementById('audioWidget');
                    studentSpeaker.className = 'active';
                    studentSpeaker.style.opacity = "1";
                    studentSpeaker.style.pointerEvents = "visible";
                },

                //move into media.js
                audioWidgetDisable: function () {
                    localStorage.setItem('audEnable', "false");
                    var studentSpeaker = document.getElementById('audioWidget');
                    studentSpeaker.style.opacity = "0.5";
                    studentSpeaker.style.pointerEvents = "none";
                    studentSpeaker.className = 'deactive';
                    var alwaysPressElem = document.getElementById('speakerPressing');
                    if (virtualclass.gObj.hasOwnProperty('video')) {
                        virtualclass.gObj.video.audio.studentNotSpeak(alwaysPressElem);
                        virtualclass.gObj.video.audio.clickOnceSpeaker('speakerPressOnce', "alwaysDisable");
                    }
                },

                allChatDisable: function () {
                    localStorage.setItem('chatEnable', "false");
                    this.disableCommonChat();
                    this.disbaleAllChatBox();
                    this.disableOnLineUser();
                },

                disableCommonChat: function () {
                    var div = document.getElementById("chatrm");
                    if (div != null) {
                        this.makeElemDisable(div);
                    }
                },
                disbaleAllChatBox: function () {
                    var allChatBoxes = document.getElementById('stickybar').getElementsByClassName('ui-chatbox');
                    for (var i = 0; i < allChatBoxes.length; i++) {
                        this.makeElemDisable(allChatBoxes[i]);
                    }
                },
                disableOnLineUser: function () {
                    var allChatDivCont = document.getElementsByClassName('ui-memblist-usr');
                    for (var i = 0; i < allChatDivCont.length; i++) {
                        allChatDivCont[i].style.pointerEvents = "none";
                    }
                },
                makeElemDisable: function (elem) {
                    if (virtualclass.vutil.elemHasAnyClass(elem.id)) {
                        elem.classList.remove('enable');
                        elem.classList.add('disable');
                    } else {
                        elem.className = "disable";
                    }
                    var inputBox = elem.getElementsByClassName("ui-chatbox-input-box")[0];
                    if (inputBox != null) {
                        inputBox.disabled = true;
                    }
                },
                allChatEnable: function () {
                    localStorage.setItem('chatEnable', "true");
                    //common chat
                    var div = document.getElementById("chatrm");
                    if (div != null) {
                        this.makeElemEnable(div);
                    }
                    var allChatBoxes = document.getElementById('stickybar').getElementsByClassName('ui-chatbox');
                    for (var i = 0; i < allChatBoxes.length; i++) {
                        this.makeElemEnable(allChatBoxes[i]);
                    }
                    var allChatDivCont = document.getElementsByClassName('ui-memblist-usr');
                    for (var i = 0; i < allChatDivCont.length; i++) {
                        allChatDivCont[i].style.pointerEvents = "visible";
                    }
                },

                makeElemEnable: function (elem) {
                    if (virtualclass.vutil.elemHasAnyClass(elem.id)) {
                        elem.classList.remove('disable');
                        elem.classList.add('enable');
                    } else {
                        elem.className = "enable";
                    }

                    //elem.style.opacity = "1";
                    var inputBox = elem.getElementsByClassName("ui-chatbox-input-box")[0];
                    if (inputBox != null) {
                        inputBox.disabled = false;
                    }
                },

                /**
                 * Is use for either diable/enable provided  editor for all user
                 * @param edType
                 */
                toggleAllEditorController : function (edType, action){
                    edType = virtualclass.vutil.smallizeFirstLetter(edType);
                    var allUsersDom = document.getElementsByClassName('controleCont');
                    if(allUsersDom.length > 0){
                        for(var i=0; i<allUsersDom.length; i++){
                            if(allUsersDom[i].id.indexOf(edType) > 0){
                                var idPartPos = allUsersDom[i].id.indexOf('Cont');
                                if(idPartPos > 0){
                                    var idPart = allUsersDom[i].id.substr(0, idPartPos);
                                    var elem = document.getElementById(idPart+'Img');
                                    this.control.init.call(this, elem, action);
                                }
                            }
                        }
                    }
                },

                /**
                 * Either Show OR Hidden all editor controller
                 * @param editor editor type
                 * @param action show or hidden
                 */
               toggleDisplayEditorController : function (editor, action){
                    editor = virtualclass.vutil.smallizeFirstLetter(editor);

                    var allEditorController = document.getElementsByClassName('controller'+editor);
                    for(var i=0; i< allEditorController.length; i++){
                        allEditorController[i].style.display = action;
                    }
                },

                //TODO this function name should be convert into updateControlAtLocalStorage
                updateUser: function (uid, key, val) {
                    //var userId =  localStorage.getItem(uid);
                    var userId = localStorage.getItem('virtualclass' + uid);
                    var uObj = {};
                    if (userId == null) {
                        //userId = uid;
                        uObj.id = uid;
                    } else {
                        uObj = JSON.parse(userId);
                    }
                    uObj[key] = val;
                    localStorage['virtualclass' + uObj.id] = JSON.stringify(uObj);
                    return uObj;
                },

                audioSign2: function (user, action) {
                    if (action == 'create') {
                        if (document.getElementById(user.id + "AudEnableSign") == null) {
                            //important
                            var audEnableSign = document.createElement('div');
                            audEnableSign.id = user.id + "AudEnableSign";
                            var audEnableImg = document.createElement('img');
                            imgName = "audioenable";
                            audEnableImg.id = user.id + imgName + "Img";
                            audEnableImg.src = window.whiteboardPath + "images/" + imgName + ".png";
                            var enAudAnch = document.createElement('a');
                            enAudAnch.id = user.id + imgName + "Anch";
                            enAudAnch.className = "audEnableSign tooltip controleCont";
                            enAudAnch.setAttribute('data-title', "student audio enable");
                            enAudAnch.appendChild(audEnableImg);
                            //audEnableSign.appendChild(audEnableImg);
                            audEnableSign.appendChild(enAudAnch);
                            document.getElementById(user.id + "ControlContainer").appendChild(audEnableSign);
                        }
                    } else {
                        var audioEnableTag = document.getElementById(user.id + "AudEnableSign");
                        audioEnableTag.parentNode.removeChild(audioEnableTag);
                    }

                },

                audioSign: function (user, action) {
                    if (action == 'create') {
                        this.iconAttrManupulate(user.id, "icon-audioEnaGreen");
                    } else {
                        if (user.aud) {
                            this.iconAttrManupulate(user.id, "icon-audioImg");
                        } else {
                            this.iconAttrManupulate(user.id, "icon-audioDisImg");
                        }
                    }
                },

                iconAttrManupulate: function (uid, classToBeAdd) {
                    var audioImg = document.getElementById(uid + 'contrAudImg');
                    if (audioImg != null) {
                        for (var i = 0; i < audioImg.classList.length; i++) {
                            if (audioImg.classList[i].substring(0, 5) == 'icon-') {
                                audioImg.classList.remove(audioImg.classList[i]);
                                audioImg.classList.add(classToBeAdd);
                                break;
                            }
                        }
                    }
                },

                shouldApply: function (uid) {
                    var userObj = localStorage.getItem('virtualclass' + uid);
                    if (userObj != null) {
                        userObj = JSON.parse(userObj);
                        //console.log('uid ' + uid + " " + userObj.ad);
                        if (userObj.ad) {
                            virtualclass.user.control.audioSign({id: uid}, "create");
                        }
                    }
                },


                changeAttrToAssign: function (action) {
                    var allUserElem = document.getElementById('chatWidget').getElementsByClassName("assignImg");
                    for (var i = 0; i < allUserElem.length; i++) {
                        if (action == 'enable') {
                            allUserElem[i].classList.remove('block');
                            allUserElem[i].classList.add('enable');
                            allUserElem[i].parentNode.classList.add('tooltip');
                            allUserElem[i].parentNode.setAttribute('data-title', virtualclass.lang.getString('assignEnable'));
                            allUserElem[i].setAttribute('data-assign-disable', 'false');
                        } else {
                            allUserElem[i].classList.remove('enable');
//                                allUserElem[i].parentNode.setAttribute('data-title', virtualclass.lang.getString('assignDisable'));
                            allUserElem[i].classList.add('block');
                            allUserElem[i].parentNode.classList.remove('tooltip');
                            allUserElem[i].setAttribute('data-assign-disable', 'true');
                        }
                    }
                }
            },

            displayStudentSpeaker: function (display) {
                var alwaysPress = document.getElementById('alwaysPress');
                if (alwaysPress != null) {
                    if (display) {
                        alwaysPress.style.display = 'block';
                    } else {
                        alwaysPress.style.display = 'none';
                    }
                }
            }
        }
    };
    window.user = user;
})(window, document);