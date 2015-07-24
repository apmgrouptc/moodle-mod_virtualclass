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
 * Displays information about all the assignment modules in the requested course
 *
 * @package   mod_virtualclass
 * @copyright 2015 Pinky Sharma
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
 
header("Access-Control-Allow-Origin: https://l.vidya.io");
if (array_key_exists("key",$_REQUEST)) {
	session_id($_REQUEST['key']);
}
require_once(dirname(dirname(dirname(__FILE__))).'/config.php');
$cmid = $_REQUEST['cmid'];
$userid = $_REQUEST['user'];
$filenum = $_REQUEST['cn'];
$data = $_REQUEST['record_data'];
$vmsession = $_REQUEST['sesseionkey'];
//echo $vmsession;exit;

if ($cmid) {
    $cm         = get_coursemodule_from_id('virtualclass', $cmid, 0, false, MUST_EXIST);
    $course     = $DB->get_record('course', array('id' => $cm->course), '*', MUST_EXIST);
    $virtualclass  = $DB->get_record('virtualclass', array('id' => $cm->instance), '*', MUST_EXIST);
} else {
    echo 'VCE6';exit;//'Course module ID missing.'; 
}

require_login($course, true, $cm);
$context = context_module::instance($cm->id);
$basefilepath = $CFG->dataroot."/virtualclass"; // Place to save recording files.

if(has_capability('mod/virtualclass:dorecording', $context)){
//if(has_capability('mod/virtualclass:addinstance', $context)){
    
    if ($data) {
        $filepath = $basefilepath."/".$course->id."/".$virtualclass->id."/".$vmsession;
    
        // Create folder if not exist
        if (!file_exists ($filepath) ) {
            mkdir($filepath, 0777, true);
        }  
        $filename = "vc.".$filenum;
   
        if (file_put_contents($filepath.'/'.$filename, $data) != false) {      
            //save file record in database
            if($filenum > 1){
                //update record         
                $vcfile = $DB->get_record('virtualclass_files', array ('vcid'=> $virtualclass->id, 'vcsessionkey' => $vmsession));
                $vcfile->numoffiles = $filenum;
                $DB->update_record('virtualclass_files', $vcfile);
            } else {
                $vcfile = new stdClass();
                $vcfile->courseid = $course->id;
                $vcfile->vcid = $virtualclass->id;
                $vcfile->userid = $userid;
                $vcfile->vcsessionkey = $vmsession;
                $vcfile->vcsessionname = 'vc-'.$course->shortname.'-'.$virtualclass->name.$cm->id.'-'.date("Ymd").'-'.date('Hi');
                $vcfile->numoffiles = $filenum;
                $vcfile->timecreated = time();
                //print_r($vcfile);exit;
                $DB->insert_record('virtualclass_files', $vcfile);
            }           
            echo  "done";
        } else {
            echo 'VCE5';//'Unable to record data.';exit;
        }       
    } else {
        echo 'VCE4';//'No data for recording.';
    }
} else {
     echo 'VCE2';//'Permission denied';
}

?>
