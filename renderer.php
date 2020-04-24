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
 * The main renderer for mod_quizgame
 *
 * @package    mod_quizgame
 * @copyright  2016 John Okely <john@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

/**
 * The main renderer for mod_quizgame
 *
 * @package    mod_quizgame
 * @copyright  2016 John Okely <john@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class mod_edugame_renderer extends plugin_renderer_base {
    /**
     * Initialises the game and returns its HTML code
     *
     * @param stdClass $quizgame The quizgame to be added
     * @param context $context The context
     * @return string The HTML code of the game
     */
    public function render_game() {

        $this->page->requires->js_call_amd('mod_edugame/game', 'init');
        $display = '<canvas id="mod_edugame_game" style="background:#cdcdcd;"></canvas>';

        return $display;
    }

}
