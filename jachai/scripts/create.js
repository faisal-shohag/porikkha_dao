$(document).ready(function(){
    $('select').formSelect();
  });

  //localStorage.setItem('username', 'Faisal Shohag');

  var examData = {};
  var questionData = [];
  var letterAns = {
      1: "A",
      2: "B",
      3: "C",
      4: "D"
  }
$('#add-d').click(function(){
var examName = $('#exam-name')[0].value,
    examTime = $('#exam-time')[0].value;
    examNegative = $('#exam-negative')[0].value;
    examNB = $('#exam-NB')[0].value;
    examSub = $('#exam-sub')[0].value;

    if(examName==='' || examTime==='' || examNegative==='' || examNB===''){
        Swal.fire({
            icon: 'warning',
            title: 'Please fill all the field!'
        })
    }else{
        Swal.fire({
            icon: 'success',
            title: 'Added Successfully!'
        });

        let data = {
            name: examName,
            duration: parseInt(examTime),
            negative: examNegative,
            type: 'Practice',
            sub: examSub,
            author: localStorage.getItem('username')

        }

        examData['details'] = data;
        $('.create-details').hide();
        $('.create-question').show();
        db.ref('jachai/history').update({status: true})
        db.ref('jachai/history/practice').update(examData);

    }
console.log(examData)
});

db.ref('jachai/history').on('value', historyStatus=> {
   // console.log(historyStatus.val().status);
    if(historyStatus.val().status === true){
        $('#exam-publish').show();
        $('.create-history-status').show();
        $('.create-details').hide();
        $('.create-question').show();
        $('#view').show();

        db.ref('jachai/history/practice/details').on('value', det=> {
            console.log(det.val())
            var det = det.val();
            var detHtml = `
            <div class="edit-button" id="det-edit"><span class="material-icons">edit</span></div>
            <div class="det-title">${det.name}</div>
            <div class="det-others">Duration: ${det.duration} | Negative: ${det.negative} | Subject: ${det.sub}</div>
            `
            document.querySelector('.details-show').innerHTML = detHtml;
        });
        
    }else{
        $('.create-history-status').hide();
        $('#view').hide();
    }

    $('.create-history-status').click(function(){
        
    });
    //view
    $('#view').click(function(){
        $('.create-show').show();
        $('#view').hide();
        $('#exit').show();
    
        $('#exit').click(function(){
            $('.create-show').hide();
            $('#view').show();
            $('#exit').hide();
        })
    });

});


//Question Adding
$('#add-q').click(function(){
    var createQ = $('#create-q')[0].value,
        a = $('#a')[0].value,
        b = $('#b')[0].value,
        c = $('#c')[0].value,
        d = $('#d')[0].value,
        selectAns = $('#select-ans')[0].value,
        qex = $('#create-ex')[0].value;
    if(createQ === '' || a === '' || b === '' || c === '' || d === '' || selectAns === '' || qex === ''){
        Swal.fire({
            icon: 'warning',
            title: 'Please fill all the field!'
        })
    } else {
        let timerInterval
Swal.fire({
  icon: 'success',
  title: 'Question was added!',
  html: 'I will close in <b></b> milliseconds.',
  timer: 2000,
  timerProgressBar: true,
  didOpen: () => {
    Swal.showLoading()
    timerInterval = setInterval(() => {
      const content = Swal.getContent()
      if (content) {
        const b = content.querySelector('b')
        if (b) {
          b.textContent = Swal.getTimerLeft()
        }
      }
    }, 100)
  },
  willClose: () => {
    clearInterval(timerInterval)
  }
}).then((result) => {
  /* Read more about handling dismissals below */
  if (result.dismiss === Swal.DismissReason.timer) {
    //console.log('I was closed by the timer')
  }
})

let qData = {
    ans: parseInt(selectAns),
    ex: qex,
    options: [a,b,c,d],
    q: createQ
}

db.ref('jachai/history/practice/questions/'+ questionData.length).update(qData);
}

});


db.ref('jachai/history/practice/questions').on('value', q=> {
    let qq=-1;
    document.querySelector('.view-questions').innerHTML='';
    q.forEach(element => {
        qq++;
        questionData.push(element.val());
        qqHtml = `
        <div class="q-wrap">
        <div class="edit-button q-edit" id="${qq}"><span class="material-icons">edit</span></div>
    <div class="question">
       ${qq+1}. ${element.val().q}
    </div>
    <div class="option">
        <div class="opt"><div class="st"></div>${element.val().options[0]}</div>
        <div class="opt"><div class="st"></div>${element.val().options[1]}</div>
        <div class="opt"><div class="st"></div>${element.val().options[2]}</div>
        <div class="opt"><div class="st"></div>${element.val().options[3]}</div>
    </div>
    <div style="font-weight:bold;color:var(--success);">Answer: ${letterAns[element.val().ans]}</div>
    <div style="padding: 5px; margin: 5px 2px; border: 2px solid var(--success);"><b>Solution:</b></br> ${element.val().ex}</div>
</div>
        `
       
        document.querySelector('.view-questions').innerHTML+=qqHtml;
        console.log($('.view-questions .q-wrap .option'));
    });
    $('#q-count').html(`${questionData.length}`);



    //console.log(questionData)
});

var publishData = {};
//publish Exam
$('#exam-publish').click(function(){
 
Swal.fire({
  title: 'Do you want to publish?',
  showDenyButton: true,
  showCancelButton: true,
  confirmButtonText: `Yes`,
  denyButtonText: `No`,
}).then((result) => {
  if (result.isConfirmed) {
    db.ref('jachai/history/practice').on('value', pub => {
        publishData=pub.val();
        console.log(publishData);
        db.ref('jachai/exams/practice').push(publishData);
    });
    Swal.fire('Published!', '', 'success');
  } else if (result.isDenied) {
    Swal.fire('Not Publised!', '', 'info')
  }
})
});

$('#history-delete').click(function(){
    Swal.fire({
        icon: 'warning',
        title: 'Do you want to delete?',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: `Yes`,
        denyButtonText: `No`,
      }).then((result) => {
        if (result.isConfirmed) {
            db.ref('jachai/history').update({status: false});
            db.ref('jachai/history/practice').remove();
          Swal.fire('Deleted!', '', 'success');
        } else if (result.isDenied) {
          Swal.fire('Not Publised!', '', 'info')
        }
      })

    
})

$('.exam-create-button').click(function(){
    $('.exam-create-container').show();
});

$('#exam-create-close').click(function(){
    $('.exam-create-container').hide();
})

