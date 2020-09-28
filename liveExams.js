if (localtoken != null) {

db.ref('live').on('value', snap=>{
    $('.live-subject').text(snap.val().title);
    $('.live-details').text(snap.val().ques + ' Questions | ' + snap.val().marks+' Marks | ' + 'Negative: ' + snap.val().negative);
var countDownDate = new Date(snap.val().startTime).getTime();
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
    $('.up').html(`<div class="live animate__animated animate__flip" style="color: var(--danger);">Running Exam</div>`);
//     setTimeout(function(){
//     $('.live').removeClass('animate__flip');
//     $('.live').addClass('animate__flash');
// }, 2000);
    $('.live-details').addClass('animate__animated animate__flip');
    $('.live-details').text('Remaining');
    $('.up-timer').html(`<div class="animate__animated animate__fadeIn">Started</div>`);

   
    db.ref('liveUsers').on('value', snap=>{
        let found = false;
        snap.forEach(element => {
            if(element.val().phone === localStorage.getItem('phone')){
                $('.attend').html(`<button type="disabled" style="background: gray;"  id="startLiveExam" class="btn">You have participated!</div>`);
                found = true;
            }
        });

        if(!found){
            $('.attend').html(`<button  id="startLiveExam" class="btn purple">Participate</div>`);

            $('#startLiveExam').click(function(){  
                Swal.fire({
                 title: 'Are you sure?',
                 showDenyButton: true,
                 showCancelButton: true,
                 confirmButtonText: `Yes`,
                 denyButtonText: `Don't save`,
               }).then((result) => {
                 /* Read more about isConfirmed, isDenied below */
                 if (result.isConfirmed) {
                   db.ref('liveUsers').push({phone: localStorage.getItem('phone')});
             
                 } else if (result.isDenied) {
                   Swal.fire('Changes are not saved', '', 'info')
                 }
               })
             })
        }
    });
    
  
   
var countDownDatey = new Date(snap.val().endTime).getTime()
  var y = setInterval(function() {
    var now = new Date().getTime();
    var distancey = countDownDatey - now;
    var daysy = Math.floor(distancey / (1000 * 60 * 60 * 24));
    var hoursy = Math.floor((distancey % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutesy = Math.floor((distancey % (1000 * 60 * 60)) / (1000 * 60));
    var secondsy = Math.floor((distancey % (1000 * 60)) / 1000);
  
    if(daysy === 0 && hoursy === 0 && minutesy === 0){
      $('.up-timer').html(`<div class="animate__animated animate__flip" id="t">${addZero(secondsy)}</div>`);
    }else if(daysy === 0 && hoursy === 0){
      $('.up-timer').html(`<span id="t">${addZero(minutesy)}</span> min <span id="t">${addZero(secondsy)}</span> sec`);
    } else if(daysy === 0){
      $('.up-timer').html(`<span id="t">${addZero(hoursy)}</span> hr <span id="t">${addZero(minutesy)}</span> min <span id="t">${addZero(secondsy)}</span> sec`);
    } else{
      $('.up-timer').html(`<span id="t">${addZero(daysy)}</span> day <span id="t">${addZero(hoursy)}</span> hr <span id="t">${addZero(minutesy)}</span> min <span id="t">${addZero(seconds)}</span> sec`);
    }
  function addZero(numy){if(numy<10) return numy = '0'+ numy; else return numy;}
  $('.up').html(`<div class="animate__animated animate__pulse" style="color: var(--danger);">Running Exam</div>`);
    if (distancey < 0) {
      clearInterval(y);
      $('.up').html(`<div class="live animate__animated animate__flip" style="color: var(--danger);">Ended</div>`);
      setTimeout(function(){
      $('.live').removeClass('animate__flip');
      $('.live').addClass('animate__flash');
  }, 2000);
      $('.up-timer').html(``);
      $('.live-details').text('');
      $('.attend').remove();
    }

    
  }, 1000);

}

  

}, 1000);

});





}