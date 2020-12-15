

    //    var button = document.querySelector('.download'),
    //        content = document.querySelector('.questions');

    // button.addEventListener('click', () => {
    //         var printContents = content.innerHTML;
    //         var originalContents = document.body.innerHTML;
    //         document.body.innerHTML = printContents;
    //         window.print();
    //         document.body.innerHTML = originalContents;
    // });


var banglaNumber = {
  "1": "১",
  "2": "২",
  "3": "৩",
  "4": "৪",
  "5": "৫",
  "6": "৬",
  "7": "৭",
  "8": "৮",
  "9": "৯",
  "0": "০"
}



    // myexam = {
    //      name: 'পরীক্ষা 02',
    //      duration: 1,
    //      sub: 'Bangla',
    //      author: 'Faisal Shohag',
    //      type: 'Practice',
    //      questions: [
    //        {
    //          q: '$E=$ ?',
    //          options: ['$mc^2$', '$mk^2$', '$mr^2$', '$mv^2$'],
    //          ans: 1,
    //          ex: 'Option one Answer'
    //       },

    //       {
    //         q: 'Question Two?',
    //         options: ['option1', 'option2', 'option3', 'option4'],
    //         ans: 2,
    //         ex: 'Option one Answer'
    //      },


    //      {
    //       q: 'Question Three?',
    //       options: ['option1', 'option2', 'option3', 'option4'],
    //       ans: 1,
    //       ex: 'Option one Answer'
    //    },
        
    //     ]
    // }

    // db.ref('jachai/exams/practice').push(exam);




if(localStorage.getItem('username') != null){
//getting exams from database

db.ref('jachai/exams/practice').on('value', exams => {
  document.querySelector('.exam-list').innerHTML = '';
  var allExams = [];
  var examsKeys = [];
  let e=-1;
  exams.forEach(exam => {
    allExams.push(exam.val());
    examsKeys.push(exam.key);
  });

  //console.log(allExams);

  for(let i=allExams.length-1; i>=0; i--){
    e++;
    document.querySelector('.exam-list').innerHTML += `
    <a class="modal-trigger" href="#exam">
    <div class="exam" id="${examsKeys[i]}+${i}">
        <div class="logo">${firstLetter(allExams[i].details.name)}</div>
        <div class="details">
            <div class="title">${allExams[i].details.name}</div>
            <div class="others">প্রশ্নঃ ${allExams[i].questions.length} টি | সময়ঃ ${allExams[i].details.duration} মিনিট | স্কোরঃ ${allExams[i].questions.length} | নেগেটিভঃ ${allExams[i].details.negative}</div>
        </div>
    </div></a>
    `
  }
  
  
  
  $('.exam').click(function(){
  document.querySelector('.exam-container .questions').innerHTML = '';
    var examId = $(this)[0].id;
    console.log(examId)
        examId = examId.split('+');
        examId = parseInt(examId[1]);
    var myexam = allExams[examId];
    //console.log(myexam)
    var ans = [];
    var exp = [];
    var userAns = [];
    var score = 0, wrong = 0, na=0;
    var questions = shuffleArray(myexam.questions);
    
//timer
var  sec = 0;
var minute = myexam.details.duration;
//console.log('duration:' + minute)
var timer = setInterval(function(){
  if(sec === 0){
    minute--;
    sec = 60;
  }
  sec--;
  if(minute<=0 && sec<=0) {
    $('.submit').click();
    $('.timer').html(`<small>সময় শেষ!</small>`);
    clearInterval(timer)
  }else{$('.timer').html(`<small>সময় বাকিঃ</small> ${minute} : ${sec}`);}
}, 1000);

var progInterval;
function progress(timeleft, timetotal, $element) {
  var progressBarWidth = timeleft * $element.width() / timetotal;
  $element.find('div').animate({ width: progressBarWidth }, 500);
  if(timeleft > 0) {
    progInterval = setTimeout(function() {
          progress(timeleft - 1, timetotal, $element);
      }, 1000);
  }
};

progress(minute*60, minute*60, $('.exam-time'));




$('.exam-title').html(`<div class="close wa modal-close exam-close"></div>${myexam.details.name}`);


for(let q=0; q<myexam.questions.length; ++q){
  $('.score').hide();
ans.push((questions[q].ans+(q*4)).toString());
exp.push(questions[q].ex);
 document.querySelector('.exam-container .questions').innerHTML += `
 <div class="q-wrap">
        <div class="q-logo"></div>
    <div class="question">
       ${q+1}. ${questions[q].q}
    </div>
    <div class="option">
        <div class="opt" id="${q+1+(q*3)}"><div class="st"></div>${questions[q].options[0]}</div>
        <div class="opt" id="${q+2+(q*3)}"><div class="st"></div>${questions[q].options[1]}</div>
        <div class="opt" id="${q+3+(q*3)}"><div class="st"></div>${questions[q].options[2]}</div>
        <div class="opt" id="${q+4+(q*3)}"><div class="st"></div>${questions[q].options[3]}</div>
    </div>
    <div class="explanation" id="exp-${q}"></div>
</div>
 `
}


(function () {
  var script = document.createElement("script");
  script.type = "text/javascript";
  script.src  = "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js";
  document.getElementsByTagName("head")[0].appendChild(script);
})();

$('.modal-content').on('scroll', function(){
  if(this.scrollTop >= 50){
    //console.log('50')
    $('.exam-time').addClass('fixToTop');
    $('.exam-title').hide();
  }else{
    $('.exam-time').removeClass('fixToTop');
    $('.exam-title').show();
  }
})

$('.opt').on('click', function(){
  userAns.push($(this)[0].id);
  $(($(this)[0].parentNode).children[0]).off('click');
  $(($(this)[0].parentNode).children[1]).off('click');
  $(($(this)[0].parentNode).children[2]).off('click');
  $(($(this)[0].parentNode).children[3]).off('click');
  $($(this)[0]).css({
  'background' : 'var(--dark)', 
  'color' : 'var(--light)',
  'font-weight' : 'bold',
  });
});

$('#submit').click(function(){
  Swal.fire({
    title: 'তুমি কি নিশ্চিত?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'হ্যাঁ',
    cancelButtonText: 'না'
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire(
        'সাবমিট হয়েছে!',
        'স্কোর সাবমিট করা হয়েছে!',
        'success'
      );

      clearInterval(timer);
      clearInterval(progInterval);
      document.querySelector('.modal-content').scrollTop = 0;
      let e;
      for(let k=0; k<ans.length; ++k){
        e=k;
        e = '#exp-'+e;
        //console.log(exp);
        $(e).html(`
        <b style="color: green;">Solution:</b><br>
             ${exp[k]}
        `)
        // $('#'+ans[k]).css({'background': 'var(--success)', 'color': 'var(--light)'});
        $('#'+ans[k] + ' .st').addClass('cr');
        $($($($('#'+ans[k])[0].parentNode)[0].parentNode)[0].children[0]).html('<div class="not-ans"> <span class="material-icons">error</span></div>');
        
      }
      

      for(let i=0; i<userAns.length; ++i){
        found = false;
        for(let j=0; j<ans.length; ++j){
           if(userAns[i] === ans[j]){
            score++;
            // $('#'+userAns[i]).css({'background': 'var(--success)', 'color': 'var(--light)'});
            $('#'+userAns[i] + ' .st').addClass('cr');
            $($($($('#'+userAns[i])[0].parentNode)[0].parentNode)[0].children[0]).html('<div class="correct"> <span class="material-icons">verified</span> </div>');
            found = true;
            break;
           }else found =false;
        }
      
      if(!found){
        wrong++; 
        // $('#'+userAns[i]).css({'background': 'var(--danger)', 'color': 'var(--light)'}); 
        $('#'+userAns[i] + ' .st').addClass('wa');
        //console.log($($('#'+userAns[i])[0].parentNode)[0].parentNode)
        $($($($('#'+userAns[i])[0].parentNode)[0].parentNode)[0].children[0]).html('<div class="wrong"> <span class="material-icons">highlight_off</span>  </div>');
      }
    }

      $('.score').show();
      $('.mark').html(`স্কোর </br> ${score}`);
      $('.score-wa').html(`ভুল </br> ${wrong}`);
      $('.score-na').html(`ফাঁকা </br> ${questions.length-(score+wrong)}`);
      $('.score-ng').html(`মাইনাস <br> 0`);
      
    }
  });
});



function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
  }
  return array;
}





  
//close exam
$('.exam-close').click(function(){
  window.location.reload();
});
});
});

}

//first letter picker
function firstLetter(str){
  str = str.split('');
  return str[0];
}


$(document).ready(function(){
  $('.modal').modal();
});