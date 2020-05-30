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
 * Plugin upgrade steps are defined here.
 *
 * @package     mod_edugame
 * @category    upgrade
 * @copyright   2020 Gabija
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

require_once(__DIR__.'/upgradelib.php');

/**
 * Execute mod_edugame upgrade from the given old version.
 *
 * @param int $oldversion
 * @return bool
 */
function xmldb_edugame_upgrade($oldversion) {
    global $DB;

    $dbman = $DB->get_manager();

    if ($oldversion < 2020050500) {

        // Define field questioncategory to be added to edugame.
        $table = new xmldb_table('edugame');
        $field = new xmldb_field('questioncategory', XMLDB_TYPE_TEXT, null, null, null, null, null, 'introformat');

        // Conditionally launch add field questioncategory.
        if (!$dbman->field_exists($table, $field)) {
            $dbman->add_field($table, $field);
        }

        // Edugame savepoint reached.
        upgrade_mod_savepoint(true, 2020050500, 'edugame');
    }

    if ($oldversion < 2020050501) {

        // Define field id to be added to edugame_score.
        $table = new xmldb_table('edugame_score');
        $table->add_field('id', XMLDB_TYPE_INTEGER, '10', null, XMLDB_NOTNULL, XMLDB_SEQUENCE, null, null);
        $table->add_field('edugameid', XMLDB_TYPE_INTEGER, '10', null, XMLDB_NOTNULL, null, null, 'id');
        $table->add_field('userid', XMLDB_TYPE_INTEGER, '10', null, XMLDB_NOTNULL, null, null, 'edugameid');
        $table->add_field('score', XMLDB_TYPE_INTEGER, '10', null, XMLDB_NOTNULL, null, null, 'userid');
        $table->add_field('timecreated', XMLDB_TYPE_INTEGER, '10', null, null, null, null, 'score');
        $table->add_key('primary', XMLDB_KEY_PRIMARY, array('id'));

        if (!$dbman->table_exists($table)) {
            $dbman->create_table($table);
        }

        upgrade_mod_savepoint(true, 2020050501, 'edugame');
    }

    if ($oldversion < 2020050502) {

        // Define field grade to be added to edugame.
        $table = new xmldb_table('edugame');
        $field = new xmldb_field('grade', XMLDB_TYPE_INTEGER, '10', null, XMLDB_NOTNULL, null, '100', 'questioncategory');

        // Conditionally launch add field grade.
        if (!$dbman->field_exists($table, $field)) {
            $dbman->add_field($table, $field);
        }

        // Edugame savepoint reached.
        upgrade_mod_savepoint(true, 2020050502, 'edugame');
    }

    if ($oldversion < 2020050503) {

        // Define table edugame to be dropped.
        $table = new xmldb_table('edugame_score');

        // Conditionally launch drop table for edugame.
        if ($dbman->table_exists($table)) {
            $dbman->drop_table($table);
        }

        // Edugame savepoint reached.
        upgrade_mod_savepoint(true, 2020050503, 'edugame');
    }

    return true;
}
