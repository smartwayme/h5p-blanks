var H5P = H5P || {};

H5P.Blanks = function (options, contentId) {
  var $panel;
  var $target;
  var $answer_panel;
  var $ = H5P.jQuery;

  if ( !(this instanceof H5P.Blanks) ){
    return new H5P.Blanks(options, contentId);
  }

  var getAnswerGiven = function(){
    var total = getMaxScore();
    var answers = 0;
    $panel.find('.question').each(function (idx, el) {
      var index = parseInt(el.id.replace(/^.*-/,''));
      var input = $('#'+$panel.attr('id')+'-input-'+index);
      var user_answer = input.val().trim();
      if(user_answer != ''){
        answers++;
      }
    });
    return answers == total;
  }

  var getScore = function(){
    var score = 0;
    $panel.find('.blanks-question').each(function (idx, el) {
      var index = parseInt(el.id.replace(/^.*-/,''));
      var input = $('#' + $panel.attr('id')+'-input-'+index);
      var question = $('#' + $panel.attr('id')+'-question-'+index);
      var answer = options.questions[index].replace(/^.*?\*([^*]+)\*.*$/, '$1').trim().split('/');
      for(var i=0; i < answer.length; i++) {
        var user_answer = input.val().trim();
        score += user_answer == answer[i].trim() ? 1 : 0;
      }
    });
    return score;
  }

  var getMaxScore = function(){
    var score = 0;
    $panel.find('.blanks-question').each(function (idx, el) {
      score++;
    });
    return score;
  };

  var showSolutions = function(){
    $answer_panel.html('');
    addElement($answer_panel, '', 'button', { text: 'Lukk', click: hideAnswer });
    $answer_panel.animate({ top: '0%' }, 'slow');

    $panel.find('.blanks-question').each(function (idx, el) {
      var index = parseInt(el.id.replace(/^.*-/,''));
      var input = $('#' + $panel.attr('id')+'-input-'+index);
      var question = $('#' + $panel.attr('id')+'-question-'+index);
      var answer = options.questions[index].replace(/^.*?\*([^\*]+)\*.*$/, '$1').trim().split('/');
      var list = options.questions[index].replace(/^.*?\*([^\*]+)\*.*$/, '$1').trim();
      var user_answer = input.val().trim();
      var correct = 0;
      for(var i=0; i < answer.length; i++) {
        if(user_answer == answer[i]) {
          correct = 1;
          break;
        }
      }
      var replace = correct ? '<span class="correct-answer"><b>✓ '+user_answer+'</b></span>' : ' <span class="wrong-answer">'+user_answer+'</span> <span class="answer-list">'+list+'</span>';
      var text = options.questions[index].replace(/\*[^\*]+\*/, replace);
      addElement($answer_panel, 'answer-panel-'+index, 'answer-question', {text: text});
    });
    var score = options.score.replace('@score', getScore()).replace('@total', getMaxScore());
    addElement($answer_panel, '', 'score', { text: score });
  }

  var buttons = Array(
    {
      text: 'Vis fasit',
      click: showSolutions
    }
  );

  function addElement(container, id, className, el) {
    var text = el.text ? el.text : '';
    var $el = $('<div class="'+className+'">'+text+'</div>');
    container.append($el);
    if(el.top) {
      $el.css({ top: el.top});
    }
    if(el.left) {
      $el.css({ left: el.left});
    }
    if(el.right) {
      $el.css({ right: el.right});
    }
    if(el.bottom) {
      $el.css({ bottom: el.bottom});
    }
    if(id) {
      $el.attr('id', id);
    }
    if(el.height) {
      $el.css({ height: el.height });
    }
    if(el.width) {
      $el.css({ width: el.width });
    }
    if(el.click) {
      $el.click(el.click);
    }
    return $el;
  }

  var hideAnswer = function () {
    $answer_panel.animate({
      top: '-100%'
    }, 'slow');
  }

  var attach = function (el) {
    var $target = $(el);
    $panel = $('<div id="panel-' + $target.attr('data-content-id') + '" class="blanks-panel"></div>').appendTo($target);
    $panel.append('<H2>' + options.text + '</H2>');

    // Add buttons
    for (var i = 0; i < buttons.length; i++) {
      addElement($panel, null, 'button h5p-show-solutions h5p-hidden-solution-btn', buttons[i]);
      // h5p-hidden-solution-btn gets hidden if parent activates the solutions
      // h5p-show-solutions can't be used for this since styling might be applied to it
    }

    // Add questions
    for(var i=0; i < options.questions.length; i++) {
      var answer = options.questions[i].replace(/^.*?\*([^\*]+)\*.*$/, '$1');
      var input = '<input id="'+$panel.attr('id')+'-input-'+i+'" type="text"/>';
      var text = options.questions[i].replace(/\*[^\*]+\*/, input);
      addElement($panel, $panel.attr('id')+'-question-'+i, 'blanks-question', { text: text });
      if( ! i){
        $('#input-0').focus();
      }
    }

    $answer_panel = addElement($target, 'answerpanel-' + $target.attr('data-content-id'), 'answer-panel', {
      top: '-100%',
      height: '100%',
      width: '100%'
    });

    return this;
  };

  var returnObject = {
    attach: attach,
    machineName: 'H5P.Blanks',
    getScore: getScore,
    getAnswerGiven: getAnswerGiven,
    getMaxScore: getMaxScore,
    showSolutions: showSolutions
  };

  return returnObject;
};
