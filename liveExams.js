// localStorage.removeItem('token');

if (localtoken != null) {

db.ref('live').on('value', snap=>{
 if(snap.val().title === null){
     $('.upcoming').html(`<i>কোন লাইভ এক্সাম নেই!</i>`);
 }else if(snap.val()[0].ended.state === true){
  $('.up').html(`<div class="live animate__animated animate__flip" style="color: var(--danger);">শেষ!</div>`);
  $('.up-timer').html(``);
  $('.live-subject').text(snap.val()[0].title);
  $('.live-details').text(snap.val()[0].nq + ' টি প্রশ্ন | ' + snap.val()[0].score+' মার্কস | ' + snap.val()[0].time + ' মিনিট | ' + 'নেগেটিভ: ' + snap.val()[0].forWrong);
 // $('.live-details').text('');
  $('.attend').html(`<small style="color: red">${snap.val()[0].resultText}</span>`);
 }
 else
{
  var liveExamName = snap.val()[0].title;
  $('#liveTitle').html(`${liveExamName}`)
    $('.live-subject').text(snap.val()[0].title);
    $('.live-details').text(snap.val()[0].nq + ' টি প্রশ্ন | ' + snap.val()[0].score+' মার্কস | ' + snap.val()[0].time + ' মিনিট | ' + 'নেগেটিভ: ' + snap.val()[0].forWrong);
var countDownDate = new Date(snap.val()[0].startTime).getTime();

$('.up-timer').html('');

var x = setInterval(function() {
  var now = new Date().getTime();
  var distance = countDownDate - now;
  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);
 
  if(days === 0 && hours === 0 && minutes === 0){
    $('.up-timer').html(`<div class="animate__animated animate__flip" id="t">${addZero(seconds)}</div>`);
  }else if(days === 0 && hours === 0){
    $('.up-timer').html(`<span id="t">${addZero(minutes)}</span> min <span id="t">${addZero(seconds)}</span> sec`);
  } else if(days === 0){
    $('.up-timer').html(`<span id="t">${addZero(hours)}</span> hr <span id="t">${addZero(minutes)}</span> min <span id="t">${addZero(seconds)}</span> sec`);
  } else{
    $('.up-timer').html(`<span id="t">${addZero(days)}</span> day <span id="t">${addZero(hours)}</span> hr <span id="t">${addZero(minutes)}</span> min <span id="t">${addZero(seconds)}</span> sec`);
  }

function addZero(num){if(num<10) return num = '0'+ num; else return num;}

  if (distance < 0) {
    clearInterval(x);
    $('.up').html(`<div class="live animate__animated animate__flip" style="color: var(--danger);">পরীক্ষা চলছে</div>`);


    $('.live-details').addClass('animate__animated animate__flip');
    $('.live-details').text('সময় বাকি');
   // $('.up-timer').html(`<div class="animate__animated animate__fadeIn">Started</div>`);

   
    db.ref('live/0/users').on('value', snap=>{
        let found = false;
        snap.forEach(element => {
            if(element.val().phone === localStorage.getItem('phone')){
                $('.attend').html(`<button type="disabled" style="background: gray;"  id="startLiveExam" class="btn">অংশগ্রহন করেছিলে!</div>`);
                found = true;
            }
        });

        if(!found){
            $('.attend').html(`<button  id="startLiveExam" class="btn purple">অংশগ্রহন</div>`);

            $('#startLiveExam').click(function(){  
                Swal.fire({
                 title: `তুমি কি নিশ্চিত?`,
                 text: `তুমি দ্বিতীয়বার অংশ নিতে পারবে না!`,
                 showDenyButton: true,
                 showCancelButton: true,
                 confirmButtonText: `হ্যাঁ!`,
                 cancelButtonText: `না!`,
                 denyButtonText: `না!`,
               }).then((result) => {
                 /* Read more about isConfirmed, isDenied below */
                 if (result.isConfirmed) {
                   db.ref('live/0/users').push({phone: localStorage.getItem('phone')});
                   $('.liveExam').modal('open');    
                 } else if (result.isDenied) {
                   Swal.fire('Changes are not saved', '', 'info')
                 }
               })
             })
        }
    });
    
  
   
var countDownDatey = new Date(snap.val()[0].endTime).getTime()
  var y = setInterval(function() {
    var now = new Date().getTime();
    var distancey = countDownDatey - now;
    var daysy = Math.floor(distancey / (1000 * 60 * 60 * 24));
    var hoursy = Math.floor((distancey % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutesy = Math.floor((distancey % (1000 * 60 * 60)) / (1000 * 60));
    var secondsy = Math.floor((distancey % (1000 * 60)) / 1000);
  
    if(daysy === 0 && hoursy === 0 && minutesy === 0){
      
      $('.up-timer').html(`<div class="animate__animated animate__flip" id="t">${addZero(secondsy)}</div>`);
      $('#timerLive').html(`<div  id="t">${addZero(secondsy)}</div>`);

    }else if(daysy === 0 && hoursy === 0){
      $('.up-timer').html(`<span id="t">${addZero(minutesy)}</span> min <span id="t">${addZero(secondsy)}</span> sec`);
      $('#timerLive').html(`<span id="t">${addZero(minutesy)}</span> min <span id="t">${addZero(secondsy)}</span> sec`);
    } else if(daysy === 0){
      $('.up-timer').html(`<span id="t">${addZero(hoursy)}</span> hr <span id="t">${addZero(minutesy)}</span> min <span id="t">${addZero(secondsy)}</span> sec`);
      $('#timerLive').html(`<span id="t">${addZero(hoursy)}</span> hr <span id="t">${addZero(minutesy)}</span> min <span id="t">${addZero(secondsy)}</span> sec`);
    } else{
      $('.up-timer').html(`<span id="t">${addZero(daysy)}</span> day <span id="t">${addZero(hoursy)}</span> hr <span id="t">${addZero(minutesy)}</span> min <span id="t">${addZero(seconds)}</span> sec`);
      $('#timerLive').html(`<span id="t">${addZero(daysy)}</span> day <span id="t">${addZero(hoursy)}</span> hr <span id="t">${addZero(minutesy)}</span> min <span id="t">${addZero(seconds)}</span> sec`);
    }
  function addZero(numy){if(numy<10) return numy = '0'+ numy; else return numy;}
  $('.up').html(`<div class="animate__animated animate__pulse" style="color: var(--danger);">পরীক্ষা চলছে</div>`);
    if (distancey < 0) {
      clearInterval(y);
      db.ref('live/0/ended').set({state: true});
      Swal.fire( {icon: 'success', text : 'শেষ!'});
      $('.liveExam').modal('close'); 
      $('.up').html(`<div class="live animate__animated animate__flip" style="color: var(--danger);">শেষ!</div>`);
      setTimeout(function(){
      $('.live').removeClass('animate__flip');
      $('.live').addClass('animate__flash');
  }, 2000);
      $('.up-timer').html(``);
      $('.live-details').text('');
     // $('.attend').remove();
    }

    
  }, 1000);

}

  

}, 1000);


//Live exam

var liveAns = [];
var minusMark = parseInt(snap.val()[0].forWrong);
var liveExam = snap.val();
var liveCorrectAns = [];
$('.questionsLive').html('');
for (let i = 1; i < liveExam.length; ++i) {
  liveAns.push(liveExam[i].ans);
  liveCorrectAns.push(liveExam[i].expln);
  var html = `
        <div class="question">
<div class="q">${i}. ${liveExam[i].q}</div>
<div class="options">
   <label>
       <input id="1" type="radio" name="${i}">
       <span>${liveExam[i].options[0]}</span>
   </label><br>
   <label>
    <input id="2" type="radio" name="${i}">
    <span>${liveExam[i].options[1]}</span>
</label><br>

<label>
    <input id="3" type="radio" name="${i}">
    <span>${liveExam[i].options[2]}</span>
</label><br>

<label>
    <input id="4" type="radio" name="${i}">
    <span>${liveExam[i].options[3]}</span>
</label>
</div>
</div>`;

  document.querySelector(".questionsLive").innerHTML += html;
}












var liveCR = 0;
var liveWA = 0;
var liveMarkedCount = 0;
var liveExamLength = snap.val().length;

$("input[type='radio']").on("click", function () {
  $("input[type=radio][name=" + this.name + "]").prop("disabled", true);
  liveMarkedCount++;
  if ($(this)[0].id === liveAns[parseInt($(this)[0].name) - 1]) {
    //$(this)[0].parentNode.classList.add("correct");
    // console.log('Correct')
    liveCR++;
    //indexes.push(parseInt($(this)[0].name)-1);
  } else {
   // $(this)[0].parentNode.classList.add("wrong");
    liveWA++;
  }

  if (liveMarkedCount === liveExamLength - 1) {
    $(".liveMarkedCount").html(
      `<div style="color: var(--success); font-size: 20px; transition: 1s;">${liveMarkedCount}/${
        liveExamLength - 1
      }</div>`
    );
  } else $(".liveMarkedCount").html(`${liveMarkedCount}/${liveExamLength - 1}`);
});

$('#subLive').unbind().click(function(){
 $('#subLive').hide();
 $(".modal-content").animate({ scrollTop: 0 }, "slow");
        // var soln;
        // const questions = document.querySelectorAll(".question");
        // $(".soln").remove();
        // for (let i = 0; i < questions.length; ++i) {
        //   soln = `<div class="soln"> ${liveCorrectAns[i]} </div>`;
        //   questions[i].innerHTML += soln;
        // }

      //   $(".resultLive").html(`<div class="result-data">
      // <div class="score-box cr">${liveCR}</div>
      // <div class="score-box wa">${liveWA}</div>
      // <div class="score-box nans">${liveExamLength - 1 - (liveCR + liveWA)}</div>
      // <div class="score-box mark">${liveCR-(liveWA*minusMark)}</div>
      // <div class="score-box minus-mark">${liveCR-(liveCR-(liveWA*minusMark))}</div>
      // </div>`);
 
      $(".questionsLive").addClass("after-endLive");

      const token = localStorage.getItem("token");
      const userLiveExams = db.ref("hscUsers/" + token + "/liveExams");

      var userLiveExamData = {
        //examTitle: examTitle,
        correct: liveCR,
        mark: liveCR-(liveWA*minusMark),
        wrong: liveWA,
        notAns: liveExamLength - 1 - (liveCR + liveWA),
        total: liveExamLength - 1,
      };

      userLiveExams.push(userLiveExamData);
      
      db.ref('live/0/results/').push({
        username: localStorage.getItem('username'),
        correct: liveCR,
        mark: liveCR-(liveWA*minusMark),
        wrong: liveWA,
        notAns: liveExamLength - 1 - (liveCR + liveWA),
        total: liveExamLength - 1,})
      console.log(userLiveExamData);

      Swal.fire('তোমার পরীক্ষাটি সাবমিট হয়েছে! ', '', 'success');
      $('.liveExam').modal('close'); 
})



 }

});





}