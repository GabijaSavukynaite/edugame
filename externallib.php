<?php

class mod_edugame_external extends external_api {
    public static function add_score_parameters() {
        return new external_function_parameters(
            array('edugameid' => new external_value(PARAM_INT, 'edugame instance ID'),
            'score' => new external_value(PARAM_INT, 'Player final score'),
            )
        );
    }

    public static function add_score($edugameid, $score) {
        global $DB, $CFG, $USER ;

        $validatedParams = self::validate_parameters(self::add_score_parameters(),
            array(
                'edugameid' => $edugameid,
                'score' => $score
        ));
        require_once($CFG->libdir.'/gradelib.php');

        if (!$edugame = $DB->get_record("edugame", array("id" => $validatedParams['edugameid']))) {
            throw new moodle_exception("invalidcoursemodule", "error");
        }
        
        $params = array();
        $params['itemname'] = clean_param($edugame->name, PARAM_NOTAGS);
        $params['gradetype'] = GRADE_TYPE_VALUE;
        $params['grademax']  = 10;
        $params['grademin']  = 0;

        $grades = array (
            'edugameid' => $edugameid,
            'userid' => $USER->id,
            'rawgrade' => $score ,
            'timecreated' => time ()
            );

        return grade_update('mod/edugame', $edugame->course, 'mod', 'edugame', $edugame->id, 0, $grades, $params);

    }

    public static function add_score_returns() {
        return null ;
    }
    
}