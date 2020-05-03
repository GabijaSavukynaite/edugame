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
 * The main renderer for mod_edugame
 *
 * @package    mod_edugame
 * @copyright  2016 John Okely <john@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();
require_once($CFG->dirroot . '/mod/edugame/locallib.php');

/**
 * The main renderer for mod_edugame
 *
 * @package    mod_edugame
 * @copyright  2016 John Okely <john@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class mod_edugame_renderer extends plugin_renderer_base {
    /**
     * Initialises the game and returns its HTML code
     *
     * @param stdClass $game The game to be added
     * @param context $context The context
     * @return string The HTML code of the game
     */
    public function render_game($edugame, $context) {
        global $DB;
        $categoryid = explode(',', $edugame->questioncategory)[0];
        $questionids = array_keys($DB->get_records('question', array('category' => intval($categoryid)), '', 'id'));
        $questions = question_load_questions($questionids);

        $qjson = [];
        foreach ($questions as $question) {
            if ($question->qtype == "truefalse") {
                $questiontext = edugame_cleanup($question->questiontext);
                $answers = [];
                foreach ($question->options->answers as $answer) {
                    $answertext = edugame_cleanup($answer->answer);
                    $answers[] = ["text" => $answertext, "fraction" => $answer->fraction];
                }

                $qjson[] = ["question" => $questiontext, "answers" => $answers, "type" => $question->qtype];
            }
        }

        $this->page->requires->js_call_amd('mod_edugame/game', 'init', array($qjson, $edugame->id));
        $display = '<div id="mod_edugame_game"></div>';
        return $display;
    }

}
