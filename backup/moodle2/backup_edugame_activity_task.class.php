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
 * The task that provides all the steps to perform a complete backup is defined here.
 *
 * @package     mod_edugame
 * @category    backup
 * @copyright   2020 Gabija
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

// For more information about the backup and restore process, please visit:
// https://docs.moodle.org/dev/Backup_2.0_for_developers
// https://docs.moodle.org/dev/Restore_2.0_for_developers

require_once($CFG->dirroot.'//mod/edugame/backup/moodle2/backup_edugame_stepslib.php');
require_once($CFG->dirroot.'//mod/edugame/backup/moodle2/backup_edugame_settingslib.php');

/**
 * The class provides all the settings and steps to perform one complete backup of mod_edugame.
 */
class backup_edugame_activity_task extends backup_activity_task {

    /**
     * Defines particular settings for the plugin.
     */
    protected function define_my_settings() {
        return;
    }

    /**
     * Defines particular steps for the backup process.
     */
    protected function define_my_steps() {
        $this->add_step(new backup_edugame_activity_structure_step('edugame_structure', 'edugame.xml'));
    }

    /**
     * Codes the transformations to perform in the activity in order to get transportable (encoded) links.
     *
     * @param string $content.
     * @return string.
     */
    static public function encode_content_links($content) {
        global $CFG;

        $base = preg_quote($CFG->wwwroot,"/");

        // Link to the list of choices
        $search="/(".$base."\//mod\/edugame\/index.php\?id\=)([0-9]+)/";
        $content= preg_replace($search, '$@EDUGAMEINDEX*$2@$', $content);

        // Link to choice view by moduleid
        $search="/(".$base."\//mod\/edugame\/view.php\?id\=)([0-9]+)/";
        $content= preg_replace($search, '$@EDUGAMEVIEWBYID*$2@$', $content);

        return $content;
    }
}
