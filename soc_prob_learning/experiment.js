/* ***************************************** */
/*          Define helper functions          */
/* ***************************************** */
function evalAttentionChecks() {
	var check_percent = 1
	if (run_attention_checks) {
		var attention_check_trials = jsPsych.data.getTrialsOfType('attention-check')
		var checks_passed = 0
		for (var i = 0; i < attention_check_trials.length; i++) {
			if (attention_check_trials[i].correct === true) {
				checks_passed += 1
			}
		}
		check_percent = checks_passed / attention_check_trials.length
	}
	return check_percent
}

var getInstructFeedback = function() {
	return '<div class = centerbox><p class = center-block-text>' + feedback_instruct_text +
		'</p></div>'
}

function assessPerformance() {
	/* Function to calculate the "credit_var", which is a boolean used to
	credit individual experiments in expfactory. */
	var experiment_data = jsPsych.data.getTrialsOfType('poldrack-single-stim')
	experiment_data = experiment_data.concat(jsPsych.data.getTrialsOfType('poldrack-categorize'))
	var missed_count = 0
	var trial_count = 0
	var rt_array = []
	var rt = 0
	//record choices participants made
	var choice_counts = {}
	choice_counts[-1] = 0
	for (var k = 0; k < choices.length; k++) {
		choice_counts[choices[k]] = 0
	}
	for (var i = 0; i < experiment_data.length; i++) {
		trial_count += 1
		rt = experiment_data[i].rt
		key = experiment_data[i].key_press
		choice_counts[key] += 1
		if (rt == -1) {
			missed_count += 1
		} else {
			rt_array.push(rt)
		}
	}
	//calculate average rt
	var sum = 0
	for (var j = 0; j < rt_array.length; j++) {
		sum += rt_array[j]
	}
	var avg_rt = sum / rt_array.length || -1
		//calculate whether response distribution is okay
	var responses_ok = true
	Object.keys(choice_counts).forEach(function(key, index) {
		if (choice_counts[key] > trial_count * 0.85) {
			responses_ok = false
		}
	})
	var missed_percent = missed_count/trial_count
	credit_var = (missed_percent < 0.4 && avg_rt > 200 && responses_ok)

	jsPsych.data.addDataToLastTrial({"credit_var": credit_var})
}

var getStim = function() {
	stim = firstPhaseStimsComplete.image.pop()
	curr_data = firstPhaseStimsComplete.data.pop()
	rewardAmount = rewards.pop()
	return stim;
}

var getData = function() {
	return curr_data
}

var getResponse = function() {
	return answers.pop()
}
var genResponses = function(stimuli) {
	var answers_80_20 = jsPsych.randomization.repeat([37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 39, 39, 39, 39, 39],
		eachComboNum / 24);
	var answers_20_80 = jsPsych.randomization.repeat([39, 39, 39, 39, 39, 39, 39, 39, 39, 39, 39, 39, 39, 39, 39, 39, 39, 39, 39, 37, 37, 37, 37, 37],
		eachComboNum / 24);

	var count1 = 0;
	var count2 = 0;

	var answers = [];
	for (var i = 0; i < FP_trials; i++) {

		if (stimuli.data[i].condition === '80_20') {
			answers.push(answers_80_20[count1]);
			count1 = count1 + 1;
		} else if (stimuli.data[i].condition === '20_80') {
			answers.push(answers_20_80[count2]);
			count2 = count2 + 1;
		}
	}
	return answers;
};
var getCorrectStatement = function() {
	pointText = (rewardAmount == 1) ? ' point' : ' points';
	correctStatement = '<div class = feedback-box><div style="color:green"; class = center-text>' + rewardAmount + pointText + '!</div></div>';
	return correctStatement 
}
var getIncorrectStatement = function() {
	pointText = (rewardAmount == 1) ? ' point' : ' points';
	inCorrectStatement = '<div class = feedback-box><div style="color:green"; class = center-text><strike>' + rewardAmount + pointText + '</strike></div></div>';
	return inCorrectStatement
}



/*************************************************************************/
/*                 DEFINE EXPERIMENTAL VARIABLES                         */
/*************************************************************************/
// generic task variables
var run_attention_checks = false
var attention_check_thresh = 0.45
var sumInstructTime = 0 //ms
var instructTimeThresh = 0 ///in seconds
var credit_var = true

// task specific variables
var choices = [37, 39]
var curr_data = []
var stim = ''
/* SPECIFY HOW MANY TRIALS YOU WANT PER TRAINING BLOCK.  FP_trials must be divisible by 96 */
var FP_trials = 96;
var eachComboNum = FP_trials / 2; /* don't change this line */
var stimSetRepNum = FP_trials / 32;

/* THIS IS TO RANDOMIZE STIMS */
var mStimArray = [
	"/static/experiments/soc_prob_learning/images/m1.png",
	"/static/experiments/soc_prob_learning/images/m2.png",
	"/static/experiments/soc_prob_learning/images/m3.png",
	"/static/experiments/soc_prob_learning/images/m4.png",
	"/static/experiments/soc_prob_learning/images/m5.png",
	"/static/experiments/soc_prob_learning/images/m6.png"
];
var fStimArray = [
	"/static/experiments/soc_prob_learning/images/f1.png",
	"/static/experiments/soc_prob_learning/images/f2.png",
	"/static/experiments/soc_prob_learning/images/f3.png",
	"/static/experiments/soc_prob_learning/images/f4.png",
	"/static/experiments/soc_prob_learning/images/f5.png",
	"/static/experiments/soc_prob_learning/images/f6.png"
];
var aStimArray = [
	"/static/experiments/soc_prob_learning/images/a1.png",
	"/static/experiments/soc_prob_learning/images/a2.png",
	"/static/experiments/soc_prob_learning/images/a3.png",
	"/static/experiments/soc_prob_learning/images/a4.png"
];
jsPsych.pluginAPI.preloadImages(mStimArray)
jsPsych.pluginAPI.preloadImages(fStimArray)
jsPsych.pluginAPI.preloadImages(aStimArray)
var randomMStimArray = jsPsych.randomization.repeat(mStimArray, 1);
var randomFStimArray = jsPsych.randomization.repeat(fStimArray, 1);
var randomAStimArray = jsPsych.randomization.repeat(aStimArray, 1);
var stimsM = [
	[['80','20'], 'status', randomMStimArray[0]],
	[['20','80'], 'status', randomMStimArray[1]],
	[['80','20'], 'mateseek', randomMStimArray[2]],
	[['20','80'], 'mateseek', randomMStimArray[3]],
	[['80','20'], 'soc', randomMStimArray[4]],
	[['20','80'], 'soc', randomMStimArray[5]]
];
var stimsF = [
	[['80','20'], 'status', randomFStimArray[0]],
	[['20','80'], 'status', randomFStimArray[1]],
	[['80','20'], 'mateseek', randomFStimArray[2]],
	[['20','80'], 'mateseek', randomFStimArray[3]],
	[['80','20'], 'soc', randomFStimArray[4]],
	[['20','80'], 'soc', randomFStimArray[5]]
];
var stimsA = [
	[['80','20'], 'abstract', randomAStimArray[0]],
	[['20','80'], 'abstract', randomAStimArray[1]],
	[['80','20'], 'abstract', randomAStimArray[2]],
	[['20','80'], 'abstract', randomAStimArray[3]]
];

firstPhaseStims = [];
stims=[stimsM,stimsF,stimsA]
/* THIS IS FOR FIRST PHASE STIMS,  randomized and counterbalanced*/
for(var j = 0; j < stims.length; j++){
	for (var i = 0; i < stims[j].length; i++) {
		var prompts = []
		switch(stims[j][i][1]){
			case 'status':
				prompts[0] = 'Popular';
				prompts[1] = 'Unpopular';
				break;
			case 'mateseek':
				prompts[0] = 'Dating';
				prompts[1] = 'Looking';
				break;
			case 'soc':
				prompts[0] = 'Bananas';
				prompts[1] = 'Oranges';
				break;
			case 'abstract':
				prompts[0] = 'Sunny';
				prompts[1] = 'Rainy';
				break;
		}
		var order1_stim = {}
		order1_stim.image = "<div class = topbox><img src='" + stims[j][i][2] +
			"'></img></div><div class = decision-left>" + prompts[0] + 
			"</div><div class = decision-right>" + prompts[1] + 
			"</div>";
		order1_stim.data = {
			trial_id: 'stim',
			exp_stage: 'training',
			image: stims[j][i][2],
			context: prompts[0] + '_' + prompts[1],
			condition: stims[j][i][0][0] + '_' + stims[j][i][0][1],
			optimal_response: (stims[j][i][0][0] > stims[j][i][0][1]) ? 37 : 39
		}
		var order2_stim = {}
		order2_stim.image = "<div class = topbox><img src='" + stims[j][i][2] +
			"'></img></div><div class = decision-left>" + prompts[1] + 
			"</div><div class = decision-right>" + prompts[0] + 
			"</div>";
		order2_stim.data = {
			trial_id: 'stim',
			exp_stage: 'training',
			image: stims[j][i][2],
			context: prompts[1] + '_' + prompts[0],
			condition: stims[j][i][0][1] + '_' + stims[j][i][0][0],
			optimal_response: (stims[j][i][0][1] > stims[j][i][0][0]) ? 37 : 39
		}
		firstPhaseStims.push(order1_stim);
		firstPhaseStims.push(order2_stim);
	}
}

var firstPhaseStimsComplete = jsPsych.randomization.repeat(firstPhaseStims, stimSetRepNum, true);
var answers = genResponses(firstPhaseStimsComplete)
var rewards = jsPsych.randomization.repeat([1, 5], FP_trials/2);	
var curr_data = ''

/* This is to end the training while loop, if the subject has reached 6 training blocks */
var training_count = 0;



/* ************************************ */
/*         Set up jsPsych blocks        */
/* ************************************ */
// Set up attention check node
var attention_check_block = {
	type: 'attention-check',
	data: {
		trial_id: "attention_check"
	},
	timing_response: 180000,
	response_ends_trial: true,
	timing_post_trial: 200
}

var attention_node = {
	timeline: [attention_check_block],
	conditional_function: function() {
		return run_attention_checks
	}
}

//Set up post task questionnaire
var post_task_block = {
   type: 'survey-text',
   data: {
       trial_id: "post task questions"
   },
   questions: ['<p class = center-block-text style = "font-size: 20px">Please summarize what you were asked to do in this task.</p>',
              '<p class = center-block-text style = "font-size: 20px">Do you have any comments about this task?</p>'],
   rows: [15, 15],
   columns: [60,60]
};
//Set up PID entry
//
var enter_pid_block = {
	type: 'survey-text',
	data: {
		trial_id: "PID"
	},
	questions: ['<p class = center-block-text style = "font-size: 20px">Please enter the participant\'s ID number.</p>'],
	rows: [1],
	columns: [4]
}


/* define static blocks */
var feedback_instruct_text =
	'Welcome to the experiment. This experiment will take about 20 minutes. Press <strong>enter</strong> to begin.'
var feedback_instruct_block = {
	type: 'poldrack-text',
	data: {
		trial_id: "instruction"
	},
	cont_key: [13],
	text: getInstructFeedback,
	timing_post_trial: 0,
	timing_response: 180000
};
/// This ensures that the subject does not read through the instructions too quickly.  If they do it too quickly, then we will go over the loop again.
var instructions_block = {
	type: 'poldrack-instructions',
	data: {
		trial_id: "instruction"
	},
	pages: [
		'<div class = bigtextbox><p class = block-text>In this experiment, you\'re going to see a series of pictures of faces, as well as a couple of patterns. Along with each picture, you\'ll see a pair of words, and we want you to try to guess which word goes with the picture. Sometimes the words are about whether the person in the picture is <strong>popular</strong> or <strong>unpopular</strong>. Sometimes they\'re about whether the person is <strong>dating</strong> someone or <strong>looking</strong> for someone to date. Sometimes they\'re about whether the person likes <strong>bananas</strong> or <strong>oranges</strong>. And finally, for the patterns, the words are about whether it will be <strong>rainy</strong> or <strong>sunny</strong>. </p><p class=block-text>For each picture, you must choose one of the words by pressing either the <strong>left</strong> or <strong>right arrow key</strong> to correspond with the left or right word. </p><p class=block-text>You\'ll see the same picture more than once, and the same word goes with the same picture most of the time, but not always. For each correct guess you\'ll get points, but if you guess incorrectly, you\'ll see the number of points you could have gotten crossed out. Try to guess correctly as often as you can to get the most points.</p><p class = block-text>Keep in mind that you might not know for sure which word goes with which picture, so just make your best guess, and don\'t think about it too much. You\'ll learn the best answer even if it doesn\'t feel like it.</p></div>',
	],
	allow_keys: false,
	show_clickable_nav: true,
	timing_post_trial: 1000
};

var instruction_node = {
	timeline: [feedback_instruct_block, instructions_block],
	/* This function defines stopping criteria */
	loop_function: function(data) {
		for (i = 0; i < data.length; i++) {
			if ((data[i].trial_type == 'poldrack-instructions') && (data[i].rt != -1)) {
				rt = data[i].rt
				sumInstructTime = sumInstructTime + rt
			}
		}
		if (sumInstructTime <= instructTimeThresh * 1000) {
			feedback_instruct_text =
				'Read through instructions too quickly.  Please take your time and make sure you understand the instructions.  Press <strong>enter</strong> to continue.'
			return true
		} else if (sumInstructTime > instructTimeThresh * 1000) {
			feedback_instruct_text = 'Done with instructions. Press <strong>enter</strong> to continue.'
			return false
		}
	}
}

var FP_block = {
	type: 'poldrack-text',
	data: {
		trial_id: "first_phase_intro"
	},
	timing_response: 180000,
	text: '<div class = centerbox><p class = center-block-text> We will now begin Phase 1.  Press <strong>enter</strong> to begin. </p></div>',
	cont_key: [13],
	timing_post_trial: 1000
};

var break_block = {
	type: 'poldrack-text',
	data: {
		trial_id: "break",
		exp_id: 'soc_prob_learning'
	},
	timing_response: 15000,
	text: '<div class = centerbox><p class = center-block-text>Take a short break.</p><p class = center-block-text>Task will automatically start in 15 seconds, or <br />press <strong>enter</strong> to continue.</p></div>',
	cont_key: [13],
};

var break_node = {
	timeline: [break_block],
	conditional_function: function(){
		if(training_count==4){
			return false;
		} else {
			return true;
		}
	}
}


training_trials = []
for (i = 0; i < 96; i++) {
	var training_block = {
		type: 'poldrack-categorize',
		stimulus: getStim,
		key_answer: getResponse,
		choices: choices,
		//prompt: '<div class = topbox><div class = center-text>Optional Prompt</div></div>',
		correct_text: getCorrectStatement,
		incorrect_text: getIncorrectStatement,
		timeout_message: '<div class = feedback-box><div class = center-text>no response detected</div></div>',
		timing_stim: 2250,
		timing_response: 2250,
		timing_feedback_duration: 750,
		response_ends_trial: true,
		timing_post_trial: 250,
		is_html: true,
		data: getData,
		on_finish: function(data) {
			choice = choices.indexOf(data.key_press)
			stims = data.condition.split('_')
			chosen_stim = stims[choice]
			correct = false
			if (data.key_press == data.optimal_response){
				correct = true
			}
			jsPsych.data.addDataToLastTrial({
				'feedback': data.correct,
				'correct': correct,
				'stim_chosen': chosen_stim,
				'reward_possible': rewardAmount
			})
		}
	};
	training_trials.push(training_block)
}

training_trials.push(break_node);

var performance_criteria = {
	timeline: training_trials,
	loop_function: function(data) {
//		var ab_total_correct = 0;
//		var cd_total_correct = 0;
//		var ef_total_correct = 0;
//		var ab_cum_trials = 0;
//		var cd_cum_trials = 0;
//		var ef_cum_trials = 0;
//		for (var i = 0; i < data.length; i++) {
//			if (data[i].condition == "80_20" || data[i].condition == "20_80" ) {
//				ab_cum_trials = ab_cum_trials + 1;
//				if (data[i].key_press === data[i].optimal_response) {
//					ab_total_correct = ab_total_correct + 1;
//				}
//			} else if (data[i].condition == "70_30" || data[i].condition == "30_70") {
//				cd_cum_trials = cd_cum_trials + 1;
//				if (data[i].key_press === data[i].optimal_response) {
//					cd_total_correct = cd_total_correct + 1;
//				}
//			} else if (data[i].condition == "60_40" || data[i].condition == "40_60") {
//				ef_cum_trials = ef_cum_trials + 1;
//				if (data[i].key_press === data[i].optimal_response) {
//					ef_total_correct = ef_total_correct + 1;
//				}
//			}
//		}
//		var ab_percent = ab_total_correct / ab_cum_trials
//		var cd_percent = cd_total_correct / cd_cum_trials
//		var ef_percent = ef_total_correct / ef_cum_trials
		training_count = training_count + 1;

		if (training_count == 4) {
			return false
		} else {
			firstPhaseStimsComplete = jsPsych.randomization.repeat(firstPhaseStims, stimSetRepNum, true);
			answers = genResponses(firstPhaseStimsComplete)
			rewards = jsPsych.randomization.repeat([1, 5], FP_trials/2);	
			return true
		}

	}
};

var end_block = {
	type: 'poldrack-text',
	data: {
		trial_id: "end",
		exp_id: 'soc_prob_learning'
	},
	timing_response: 180000,
	text: '<div class = centerbox><p class = center-block-text>Finished with this task!</p><p class = center-block-text>Press <strong>enter</strong> to continue.</p></div>',
	cont_key: [13],
	in_finish: assessPerformance
};



/* create experiment definition array */
var soc_prob_learning_experiment = [];
soc_prob_learning_experiment.push(enter_pid_block); 
soc_prob_learning_experiment.push(instruction_node);
soc_prob_learning_experiment.push(FP_block);
soc_prob_learning_experiment.push(performance_criteria);
soc_prob_learning_experiment.push(attention_node);
soc_prob_learning_experiment.push(post_task_block)
soc_prob_learning_experiment.push(end_block);
