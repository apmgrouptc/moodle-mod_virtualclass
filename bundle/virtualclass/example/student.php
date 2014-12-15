<?php

// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * Prints a particular instance of newmodule
 *
 * You can have a rather longer description of the file as well,
 * if you like, and it can span multiple lines.
 *
 * @package    mod_newmodule
 * @copyright  2011 Your Name
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

/// (Replace newmodule with the name of your module and remove this line)

include('auth.php');

//the www path for whiteboard
$whiteboard_path = "https://192.168.1.101/virtualclass/";
?>

<link rel="stylesheet" type="text/css" href= <?php echo $whiteboard_path."css/styles.css" ?> />
<link rel="stylesheet" type="text/css" href= <?php echo $whiteboard_path."bundle/jquery/css/base/jquery-ui.css" ?> />
<link rel="stylesheet" type="text/css" href= <?php echo $whiteboard_path."css/jquery.ui.chatbox.css" ?> />

<?php
include('js.debug.php');
//include('js.php');

//$PAGE->requires->js(new moodle_url($CFG->wwwroot .'/mod/onetoone/whiteboard/js/c190214.js'));

//$PAGE->requires->js(new moodle_url($CFG->wwwroot .'/mod/onetoone/whiteboard/js/min.js'));
// Output starts here

$r = 's';
$sid = 101;
$uid = 101;
//$r = 's';

$uname = "Student";

?>
<script type="text/javascript">	
    <?php echo "name='".$uname."';"; ?>
    <?php echo "id='".$uid."';"; ?>
    <?php echo "sid='".$sid."';";?>
</script>

<script type="text/javascript">
	<?php echo "wbUser.name='$uname';"; ?>
	<?php echo "wbUser.id='".$uid."';"; ?>
	<?php echo "wbUser.socketOn='0';"; ?>
	<?php echo "wbUser.dataInfo='0';"; ?>
	<?php echo "wbUser.room='215';"; ?>
	<?php echo "wbUser.sid='".$sid."';"; ?>
	<?php echo "wbUser.role='".$r."';"; ?>
	
	window.io = io;
    window.whiteboardPath =  'https://192.168.1.101/virtualclass/';
    
//     function convertFloat32ToInt16(buffer) {
//        l = buffer.length;
//        buf = new Int16Array(l);
//        while (l--) {
//          buf[l] = Math.min(1, buffer[l])*0x7FFF;
//        }
//        return buf;
//    }
//    
//    var session = {
//        audio: true,
//        video: false
//    };
//
//    var recordRTC = null;
//    var resampler = new Resampler(44100, 8000, 1, 4096);
//
//    var Html5Audio = {};
//    
//    Html5Audio.audioContext = new AudioContext();
//    
//    var encMode = "alaw"; 
</script>


<!--<div id="vAppCont">-->
<div id="vAppCont" class="student">

 
<div id="vAppWhiteboard" class="vmApp">
    
   <div id="vcanvas" class="socketon teacher">
       
    <div id="containerWb">
     
    </div>


    <div id="mainContainer">

      <div id="packetContainer">
       
      </div>

      <div id="informationCont">
        
      </div>
    </div>

    <div class="clear"></div>
  </div>
    
</div>
    
<!--<div id="widgetRightSide">
    <div id="allVideosCont">
        
    </div>

    <div id="chatContainer">
    </div>
    
</div> -->

<div id="audioWidget"><div id="speakerStudent" class="active"><div id="speakerPressing" class="audioTool"><a id="speakerPressingAnch"><img id="speakerPressingImg" src="https://192.168.1.101/virtualclass/images/speakerpressing.png"></a></div></div><div id="speakerPressOnce" class="audioTool" data-audio-playing="false"><a id="speakerPressonceAnch"><img id="speakerPressonceImg" src="https://192.168.1.101/virtualclass/images/speakerpressonce.png" ></a></div><div id="audioTest" class="audioTool"><a id="audiotestAnch"><img id="audiotestImg" src="https://192.168.1.101/virtualclass/images/audiotest.png" ></a></div><div id="silenceDetect" class="audioTool"><a id="silenceDetectAnch"><img id="silencedetectImg" src="https://192.168.1.101/virtualclass/images/silencedetect.png" ></a></div></div>
?>
 
<div id="chatWidget"> 
<?php
//    if($r == 's'){
//    ?>
<!--    <div id="speakerStudent"> <img  src="//<?php //echo $whiteboard_path; ?>images/speaker.png" /> </div>-->
    <?php
//    }
?>
    <div id = "stickycontainer"> </div>
</div>   
    
</div>
