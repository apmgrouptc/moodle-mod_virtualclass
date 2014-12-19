Virtualclass module for Moodle

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program. If not, see http://www.gnu.org/licenses/.

Description

Virtualclass activities are used to schedule whiteboard session with screen sharing, audio, video and chat which require advance booking.

Each activity is offered in one or more identical sessions.

Requirements

Moodle 2.7.0+
Installation

1- Unpack the "moodle-mod_virtualclass.zip" and rename that unzipped folder to "virtualclass" and place this folder into 'mod' directory of moodle. The file structure for virtualclass would be something like. [site-root]/mod/virtualclass

Visit Settings > Site Administration > Notifications, you should find the module's tables successfully created

Dependencies

2- To run "virtualclass" module you need to add another plugin named "getkey" found at "https://github.com/vidyamantra/moodle-local_getkey". Locate this folder 'getkey' into 'local' directory of moodle

File structure for getkey would be. [site-root]/local/getkey

3- Visit the admin notification page to trigger the database installation by [site-root] > Site administration > Notifications

Bugs/patches

Feel free to send bug reports (and/or patches!)

For technical detail
Suman Bogati suman@vidyamantra.com
Pinky Sharma pinky@vidyamantra.com
Jai Gupta jai@vidyamantra.com

For look and feel
Fakrul Hasan 
hasan@vidyamantra.com
