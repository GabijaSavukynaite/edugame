<?php
defined('MOODLE_INTERNAL') || die;

$functions = array(
    'mod_edugame_add_score' => array(
        'classname'     => 'mod_edugame_external',
        'methodname'    => 'add_score',
        'classpath'     => 'mod/edugame/externallib.php',
        'description'   => 'Add results to the database.',
        'type'          => 'write',
        'ajax'          => true,
    )

);
