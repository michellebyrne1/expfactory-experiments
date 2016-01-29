/* ************************************ */
/* Define helper functions */
/* ************************************ */
function getDisplayElement () {
    $('<div class = display_stage_background></div>').appendTo('body')
    return $('<div class = display_stage></div>').appendTo('body')
}

function get_stim() {
	/* This function takes the stim (either 2 in one dimension, or 4, 2 from each of the 2 dimensions), pairs them together
	(if necessary, as in the 2 dimension conditions) and displays them in random boxes
	*/
	if (stims.length == 2) {
		stim1 = stims[0]
		stim2 = stims[1]
	} else if (stims.length == 4) {
		if (Math.random()<0.5 || version2_repeat >= 3 && version1_repeat<3) {
			stim1 = stims[0] + stims[2]
			stim2 = stims[1] + stims[3]
			version2_repeat = 0
			version1_repeat += 1
		} else {
			stim1 = stims[0] + stims[3]
			stim2 = stims[1] + stims[2]
			version2_repeat += 1
			version1_repeat = 0
		}
	}
	if (reversal === false) {
		target = stim1
	} else {
		target = stim2
	}
	contents = jsPsych.randomization.shuffle(['','', stim1, stim2])
	stim = '<div class = leftbox>' + contents[0] + '</div><div class = topbox>' + contents[1] + '</div><div class = rightbox>' + contents[2] + '</div><div class = bottombox>' + contents[3] + '</div>'
	return stim
}

function get_correct_response() {
	return responses[contents.indexOf(target)]
}

function get_data() {
	return {exp_id: 'dimensional_set_shifting', trial_id: 'stim', exp_stage: 'test', condition: stages[stage_counter]}
}
	
var getInstructFeedback = function() {
	return '<div class = centerbox><p class = center-block-text>' + feedback_instruct_text + '</p></div>'
}

/* ************************************ */
/* Define experimental variables */
/* ************************************ */
var sumInstructTime = 0    //ms
var instructTimeThresh = 5   ///in seconds

// Set up task variables
var responses = [37,38,39,40]
var blocks = ['simple', 'separate', 'compound', 'ID', 'ED'] //Simple: 1 dimension alone, separate: 2 dimensions side-by-side, compound: overlapping
var stages = ['simple', 'simple_rev', 'separate', 'compound', 'compound_rev', 'ID', 'ID_rev', 'ED', 'ED_rev']

// Set up variables for stimuli
var path = 'static/experiments/dimensional_set_shifting/images/'
var center_prefix = '<div class = centerimg><img style="height: 80%; width: auto; '
var left_prefix = '<div class = leftimg><img style="height: 80%; width: auto; '
var right_prefix = '<div class = rightimg><img style="height: 80%; width: auto; '
var postfix = '"</img></div>'
var shape_stim = jsPsych.randomization.shuffle(['Shape_1.png','Shape_2.png','Shape_3.png','Shape_4.png','Shape_5.png','Shape_6.png', 'Shape_7.png', 'Shape_8.png'])
var line_stim = jsPsych.randomization.shuffle(['Line_1.png','Line_2.png','Line_3.png','Line_4.png','Line_5.png','Line_6.png', 'Line_7.png', 'Line_8.png'])
if (Math.random() < 0.5) {
	var Dim1_stim = shape_stim
	var Dim2_stim = line_stim
	var Dim1_z = 'z-index: 1;" src = "'
	var Dim2_z = 'z-index: 2;" src = "'
} else {
	var Dim1_stim = line_stim
	var Dim2_stim = shape_stim
	var Dim1_z = 'z-index: 2;" src = "'
	var Dim2_z = 'z-index: 1;" src = "'
}

//instruction stim
var instruction_stim = '<div class = leftbox>' + center_prefix+Dim1_z+path+Dim1_stim[6]+postfix + '</div><div class = topbox>' + center_prefix+Dim1_z+path+Dim1_stim[7]+postfix + '</div><div class = rightbox></div><div class = bottombox></div>'

//initialize global variables used by functions
var contents = [] //holds content of each box (left, up, right, down)
var correct_counter = 0 // tracks number of correct choices in each stage
var stage_counter = 0 // tracks number of stages
var trial_counter = 0 // tracks trials in each stage
var stage_over = 0 // when this variable equals 1 the experiment transitions to the next stage
var target = '' // target is one of the stims
var stims = []
var reversal = false
var version1_repeat = 0
var version2_repeat = 0


/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */
/* define static blocks */
var welcome_block = {
  type: 'poldrack-text',
  timing_response: 60000,
  data: {exp_id: "dimensional_set_shifting", trial_id: "welcome"},
  text: '<div class = centerbox><p class = "white-text center-block-text">Welcome to the experiment. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: [13],
  timing_post_trial: 0
};

var feedback_instruct_text = 'Starting with instructions.  Press <strong> Enter </strong> to continue.'
var feedback_instruct_block = {
  type: 'poldrack-text',
  data: {exp_id: "dimensional_set_shifting", trial_id: "instructions"},
  cont_key: [13],
  text: getInstructFeedback,
  timing_post_trial: 0,
  timing_response: 6000
};
/// This ensures that the subject does not read through the instructions too quickly.  If they do it too quickly, then we will go over the loop again.
var instruction_trials = []	  
var instructions_block = {
  type: 'poldrack-instructions',
  data: {exp_id: "dimensional_set_shifting", trial_id: "instructions"},
  pages: [
    '<div class = centerbox><p class = "white-text block-text">In this task you will see two patterns placed in two of four boxes on the screen (shown on the next screen). One of the patterns is correct. You must select the one you think is correct by pressing the arrow key corresponding to the correct box (left, right, up or down).</p><p class = "white-text block-text">There is a rule you can follow to make sure you make the correct choice each time. The computer will be keeping track of how well you arc doing and when it is clear that you know the rule then the computer will change, but this not happen very often. To begin with, there is nothing on the screen to tell you which of the two patterns is correct, so your first choice will be a simple guess. However, the computer will give a message after each attempt to tell you whether you are right or wrong. </p></div>', 
	    instruction_stim + '<div class = betweenStimBox><div class = "white-text center-text">An example trial.</div></div>',
 '<div class = centerbox><p class = "white-text block-text">Once again, you will see two patterns similar to what you saw on the last page. One of the patterns is correct. You select a pattern by pressing the corresponding arrow key. After you respond you will get feedback about whether you were correct. After the computer knows that you have learned the rule, the rule will change. </p></div>'
	],
  allow_keys: false,
  show_clickable_nav: true,
  timing_post_trial: 1000
};
instruction_trials.push(feedback_instruct_block)
instruction_trials.push(instructions_block)

var instruction_node = {
    timeline: instruction_trials,
	/* This function defines stopping criteria */
    loop_function: function(data){
		for(i=0;i<data.length;i++){
			if((data[i].trial_type=='poldrack-instructions') && (data[i].rt!=-1)){
				rt=data[i].rt
				sumInstructTime=sumInstructTime+rt
			}
		}
		if(sumInstructTime<=instructTimeThresh*1000){
			feedback_instruct_text = 'Read through instructions too quickly.  Please take your time and make sure you understand the instructions.  Press <strong>enter</strong> to continue.'
			return true
		} else if(sumInstructTime>instructTimeThresh*1000){
			feedback_instruct_text = 'Done with instructions. Press <strong>enter</strong> to continue.'
			return false
		}
    }
}

var end_block = {
  type: 'poldrack-text',
  timing_response: 60000,
  data: {exp_id: "dimensional_set_shifting", trial_id: "end"},
  text: '<div class = centerbox><p class = "white-text center-block-text">Thanks for completing this task!</p><p class = "white-text center-block-text>Press <strong>enter</strong> to continue.</p></div>',
  cont_key: [13],
  timing_post_trial: 0
};

var fixation_block = {
  type: 'poldrack-single-stim',
  stimulus: '<div class = centerbox><div class = fixation>+</div></div>',
  is_html: true,
  choices: 'none',
  data: {exp_id: "dimensional_set_shifting", trial_id: "fixation"},
  timing_post_trial: 500,
  timing_stim: 500,
  timing_response: 500
}

var define_simple_stims = {
	type: 'call-function',
	data: {exp_id: "dimensional_set_shifting", trial_id: "define_simple_stims"},
	func: function() {
		var Dim1_stim1 = center_prefix + Dim1_z + path + Dim1_stim[0] + postfix
		var Dim1_stim2 = center_prefix + Dim1_z + path + Dim1_stim[1] + postfix
		stims = [Dim1_stim1, Dim1_stim2]
	},
	timing_post_trial: 0
}

var define_separate_stims = {
	type: 'call-function',
	data: {exp_id: "dimensional_set_shifting", trial_id: "define_separate_stims"},
	func: function() {
		var Dim1_stim1 = left_prefix + Dim1_z + path + Dim1_stim[0] + postfix
		var Dim1_stim2 = left_prefix + Dim1_z + path + Dim1_stim[1] + postfix
		var Dim2_stim1 = right_prefix + Dim2_z + path + Dim2_stim[0] + postfix
		var Dim2_stim2 = right_prefix + Dim2_z + path + Dim2_stim[1] + postfix
		stims = [Dim1_stim1, Dim1_stim2, Dim2_stim1, Dim2_stim2]
	},
	timing_post_trial: 0
}

var define_compound_stims = {
	type: 'call-function',
	data: {exp_id: "dimensional_set_shifting", trial_id: "define_compound_stims"},
	func: function() {
		var Dim1_stim1 = center_prefix + Dim1_z + path + Dim1_stim[0] + postfix
		var Dim1_stim2 = center_prefix + Dim1_z + path + Dim1_stim[1] + postfix
		var Dim2_stim1 = center_prefix + Dim2_z + path + Dim2_stim[0] + postfix
		var Dim2_stim2 = center_prefix + Dim2_z + path + Dim2_stim[1] + postfix
		stims = [Dim1_stim1, Dim1_stim2, Dim2_stim1, Dim2_stim2]
	},
	timing_post_trial: 0
}

var define_ID_stims = {
	type: 'call-function',
	data: {exp_id: "dimensional_set_shifting", trial_id: "define_ID_stims"},
	func: function() {
		var Dim1_stim1 = center_prefix + Dim1_z + path + Dim1_stim[2] + postfix
		var Dim1_stim2 = center_prefix + Dim1_z + path + Dim1_stim[3] + postfix
		var Dim2_stim1 = center_prefix + Dim2_z + path + Dim2_stim[2] + postfix
		var Dim2_stim2 = center_prefix + Dim2_z + path + Dim2_stim[3] + postfix
		stims = [Dim1_stim1, Dim1_stim2, Dim2_stim1, Dim2_stim2]
	},
	timing_post_trial: 0
}

var define_ED_stims = {
	type: 'call-function',
	data: {exp_id: "dimensional_set_shifting", trial_id: "define_ED_stims"},
	func: function() {
		var Dim1_stim1 = center_prefix + Dim1_z + path + Dim1_stim[4] + postfix
		var Dim1_stim2 = center_prefix + Dim1_z + path + Dim1_stim[5] + postfix
		var Dim2_stim1 = center_prefix + Dim2_z + path + Dim2_stim[4] + postfix
		var Dim2_stim2 = center_prefix + Dim2_z + path + Dim2_stim[5] + postfix
		stims = [Dim2_stim1, Dim2_stim2, Dim1_stim1, Dim1_stim2]
	},
	timing_post_trial: 0
}

var reverse_stims = {
	type: 'call-function',
	data: {exp_id: "dimensional_set_shifting", trial_id: "reverse_stims"},
	func: function() {
		reversal = !reversal
	},
	timing_post_trial: 0
}

/* create experiment definition array */
dimensional_set_shifting_experiment = []
dimensional_set_shifting_experiment.push(welcome_block)
dimensional_set_shifting_experiment.push(instruction_node)
/* define test trials */
for (b=0; b<blocks.length; b++) {
	block = blocks[b]
	if (block == 'simple') {
		dimensional_set_shifting_experiment.push(define_simple_stims)
	} else if (block == 'separate') {
		dimensional_set_shifting_experiment.push(define_separate_stims)
	} else if (block == 'compound') {
		dimensional_set_shifting_experiment.push(define_compound_stims)
	} else if (block == 'ID') {
		dimensional_set_shifting_experiment.push(define_ID_stims)
	} else if (block == 'ED') {
		dimensional_set_shifting_experiment.push(define_ED_stims)
	}
	
	var stage_block = {
	  type: 'poldrack-categorize',
	  stimulus: get_stim,
	  is_html: true,
	  key_answer: get_correct_response,
	  correct_text: '<div class = centerbox><div class = "white-text center-text"><font size = 20>Correct</font></div></div>',
	  incorrect_text: '<div class = centerbox><div class = "white-text center-text"><font size = 20>Incorrect</font></div></div>',
	  choices: responses,
	  timing_response: -1, 
	  timing_stim: -1,
	  timing_feedback_duration: 500,
	  show_stim_with_feedback: true,
	  data: get_data,
	  timing_post_trial: 100,
	  on_finish: function(data) {
		  trial_counter += 1
		  if (data.correct === true) {
			  correct_counter += 1
		  } else {
			  correct_counter = 0
		  }
		  if (correct_counter == 6 || trial_counter == 50) {
			  stage_over = 1
		  }
	  }
	}
	var stage_node = {
		timeline: [fixation_block, stage_block],
		loop_function: function(data){
			if (stage_over == 1) {
				stage_over = 0
				correct_counter = 0
				trial_counter = 0
				stage_counter += 1
				return false
			} else {
				return true
			}
		}
	}
	dimensional_set_shifting_experiment.push(stage_node)

	if (block != 'separate') {
		dimensional_set_shifting_experiment.push(reverse_stims)
		dimensional_set_shifting_experiment.push(stage_node)
	}
}


dimensional_set_shifting_experiment.push(end_block)
