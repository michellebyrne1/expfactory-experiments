
/* ************************************ */
/* Define helper functions */
/* ************************************ */
function getDisplayElement () {
    $('<div class = display_stage_background></div>').appendTo('body')
    return $('<div class = display_stage></div>').appendTo('body')
}

var arraysEqual = function(arr1, arr2) {
    if(arr1.length !== arr2.length)
        return false;
    for(var i = arr1.length; i--;) {
        if(arr1[i] !== arr2[i])
            return false;
    }
    return true;
}

var setStims = function() {
  curr_seq = []
  stim_array = []
  time_array = []
  for (var i=0; i< num_digits; i++) {
    var num = Math.floor(Math.random()*9)+1
    curr_seq.push(num)
    stim_array.push('<div class = centerbox><div class = digit-span-text>' + num.toString() + '</div></div>')
    time_array.push(stim_time)
  }
  total_time = num_digits * (stim_time + gap_time)
}

var getTestText = function() {
 return  '<div class = centerbox><div class = center-text>' + num_digits + ' Digits</p></div>'
}

var getStims = function() {
  return stim_array
}

var getTimeArray = function() {
  return time_array
}

var getTotalTime = function() {
  return total_time
}

var getFeedback = function() {
  return '<div class = centerbox><div class = center-text>' + feedback + '</div></div>'
}

var recordClick = function(elm) {
  response.push(Number($(elm).text()))
}

var clearResponse = function() {
  response = []
}

var getInstructFeedback = function() {
	return '<div class = centerbox><p class = center-block-text>' + feedback_instruct_text + '</p></div>'
}

/* ************************************ */
/* Define experimental variables */
/* ************************************ */
var sumInstructTime = 0    //ms
var instructTimeThresh = 5   ///in seconds

var num_digits = 4
var num_trials = 10
var curr_seq = []
var stim_time = 800
var gap_time = 200
var time_array = []
var total_time = 0
var errors = 0
var error_lim = 3
var response = []
setStims()
var stim_array = getStims()

var response_grid = 
    '<div class = numbox>' +
    '<button id = button_1 class = "square num-button" onclick = "recordClick(this)"><div class = content><div class = numbers>1</div></div></button>' +
    '<button id = button_2 class = "square num-button" onclick = "recordClick(this)"><div class = content><div class = numbers>2</div></div></button>' +
    '<button id = button_3 class = "square num-button" onclick = "recordClick(this)"><div class = content><div class = numbers>3</div></div></button>' +
    '<button id = button_4 class = "square num-button" onclick = "recordClick(this)"><div class = content><div class = numbers>4</div></div></button>' +
    '<button id = button_5 class = "square num-button" onclick = "recordClick(this)"><div class = content><div class = numbers>5</div></div></button>' +
    '<button id = button_6 class = "square num-button" onclick = "recordClick(this)"><div class = content><div class = numbers>6</div></div></button>' +
    '<button id = button_7 class = "square num-button" onclick = "recordClick(this)"><div class = content><div class = numbers>7</div></div></button>' +
    '<button id = button_8 class = "square num-button" onclick = "recordClick(this)"><div class = content><div class = numbers>8</div></div></button>' +
    '<button id = button_9 class = "square num-button" onclick = "recordClick(this)"><div class = content><div class = numbers>9</div></div></button>' +
    '<button class = clear_button id = "ClearButton" onclick = "clearResponse">Clear</button>' +
    '<button class = submit_button id = "SubmitButton">Submit Answer</button></div>'

/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */
/* define static blocks */
var welcome_block = {
  type: 'poldrack-text',
  timing_response: 60000,
  data: {exp_id: "digit_span", trial_id: "welcome"},
  text: '<div class = centerbox><p class = center-block-text>Welcome to the experiment. Press <strong>enter</strong> to begin.</p></div>',
  cont_key: [13],
  timing_post_trial: 0
};

var feedback_instruct_text = 'Starting with instructions.  Press <strong> Enter </strong> to continue.'
var feedback_instruct_block = {
  type: 'poldrack-text',
  cont_key: [13],
  data: {exp_id: "digit_span", trial_id: "instruction"},
  text: getInstructFeedback,
  timing_post_trial: 0,
  timing_response: 6000
};
/// This ensures that the subject does not read through the instructions too quickly.  If they do it too quickly, then we will go over the loop again.
var instruction_trials = []	  
var instructions_block = {
  type: 'poldrack-instructions',
  data: {exp_id: "digit_span", trial_id: "instruction"},
  pages: [
  '<div class = centerbox><p class = block-text>In this test you will have to try to remember a sequence of numbers that will appear on the screen one after the other. At the end of each trial, enter all the numbers into the presented numpad in the sequence in which they occurred.</p><p class = block-text></p><p class = block-text>If you correctly remember all of the numbers then the next list of numbers will be one number longer. If you make a mistake then the next list of numbers will be one number shorter.</p><p class = block-text>After three errors, the test will end. Trials will start after you end instructions.</p></div>'
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
  data: {exp_id: "digit_span", trial_id: "end"},
  text: '<div class = centerbox><p class = center-block-text>Thanks for completing this task!</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
  cont_key: [13],
  timing_post_trial: 0
};


var start_test_block = {
  type: 'poldrack-single-stim',
  is_html: true,
  stimulus: getTestText,
  data: {exp_id: "digit_span", trial_id: "test_intro"},
  choices: 'none',
  timing_stim: 1000,
  timing_response: 1000,
  response_ends_trial: false,
  timing_post_trial: 1000
};

var start_reverse_block = {
  type: 'poldrack-text',
  timing_response: 60000,
  data: {exp_id: "digit_span", trial_id: "start reverse"},
  text: '<div class = centerbox><p class = block-text>In these next trials, instead of reporting back the sequence you just saw, report the <strong>reverse</strong> of that sequence. So the last item should be first in your response, the second to last should be the second in your response, etc...</p><p class = block-text>Press <strong>enter</strong> to begin.</p></div>',
  cont_key: [13]
}

/* define test block */
var test_block = {
  type: 'poldrack-multi-stim-multi-response',
  stimuli: getStims,
  is_html: true,
  timing_stim: getTimeArray,
  timing_gap: gap_time,
  choices: [['none']],
  data: {exp_id: "digit_span", trial_id: "stim", exp_stage: 'test'},
  timing_response: getTotalTime,
  timing_post_trial: 0,
  on_finish: function() {
    jsPsych.data.addDataToLastTrial({"sequence": curr_seq, "num_digits": num_digits})
  }
}


var forward_response_block = {
  type: 'single-stim-button',
  stimulus: response_grid,
  button_class: 'submit_button',
  data: {exp_id: "digit_span", trial_id: "response", exp_stage: 'test'},
  on_finish: function() {
    jsPsych.data.addDataToLastTrial({"response": response, "sequence": curr_seq, "num_digits": num_digits,  "condition": "forward"})
      var fb = 0
      // staircase
      if (arraysEqual(response,curr_seq)) {
        num_digits += 1
        feedback = 'Correct!'
        stims = setStims()
        fb = 1
      } else {
        if (num_digits > 1) {
          num_digits -= 1
        }
        errors += 1
        feedback = 'Incorrect!'
        stims = setStims()
      }
    jsPsych.data.addDataToLastTrial({feedback: fb})
    response = []
  },
  timing_post_trial: 500
}

var reverse_response_block = {
  type: 'single-stim-button',
  stimulus: response_grid,
  button_class: 'submit_button',
  data: {exp_id: "digit_span", trial_id: "response", exp_stage: 'test'},
  on_finish: function() {
    jsPsych.data.addDataToLastTrial({"response": response, "sequence": curr_seq, "num_digits": num_digits, "condition": "reverse", feedback: fb})
      var fb = 0
      // staircase
      if (arraysEqual(response.reverse(),curr_seq)) {
        num_digits += 1
        feedback = 'Correct!'
        stims = setStims()
        fb = 1
      } else {
        if (num_digits > 1) {
          num_digits -= 1
        }
        errors += 1
        feedback = 'Incorrect!'
        stims = setStims()
      }
    jsPsych.data.addDataToLastTrial({feedback: fb})
    response = []
  },
  timing_post_trial: 500
}

var feedback_block = {
    type: 'poldrack-single-stim',
    stimulus: getFeedback,
    data: {exp_id: "digit_span", trial_id: "feedback"},
    is_html: true,
    choices: 'none', 
    timing_stim: 1000,
    timing_response: 1000,
    response_ends_trial: true
}

var forward_node = {
  timeline: [start_test_block, test_block, forward_response_block, feedback_block],
  loop_function: function(data) {
    if (errors < error_lim) {
      return true
    } else {
      errors = 0
      num_digits = 4
      stims = setStims()
      return false
    }
  }
}

var reverse_node = {
  timeline: [start_test_block, test_block, reverse_response_block, feedback_block],
  loop_function: function(data) {
    if (errors < error_lim) {return true}
    else {return false}
  }
}

/* create experiment definition array */
var digit_span_experiment = [];
digit_span_experiment.push(welcome_block);
digit_span_experiment.push(instruction_node);
digit_span_experiment.push(forward_node)
digit_span_experiment.push(start_reverse_block)
digit_span_experiment.push(reverse_node)
digit_span_experiment.push(end_block)
