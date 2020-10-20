//localStorage.setItem('token', 'faisal235ojdklfjs');

const details = document.querySelector("#exam-details"),
      question = document.querySelector("#questions-form");

var selectors = {
  0: "live",
  1: "model",
  2: "banglaFirst",
  3: "ict",
  4: "physics",
  5: "chemistry",
  6: "biology",
  7: "mathematics",
  8: "english",
  9: "gk"
};

var exam = [];
var type = "";
var subject = "";
var title = "";
var examsRef;

//   Exam details form
details.addEventListener("submit", (e) => {
  e.preventDefault();
  type = details.type.value;
  subject = details.sub.value;
  var str = new Date(details.start.value);
  var end = new Date(details.end.value);
  var duration = end.getTime() - str.getTime();
  //console.log(duration);
  duration /= 60000;
  duration = Math.abs(Math.round(duration));
  var examDetails = {
    title: details.title.value,
    time: duration,
    nq: details.nq.value,
    score: details.score.value,
    forWrong: details.forWrong.value,
    creator: details.creator.value,
    startTime: details.start.value,
    endTime: details.end.value,
    type: selectors[type],
    sub: selectors[subject],
    ended: {
      state: false,
    },
    publishResult: {
      state: false,
    },
    publishForPractice: {
      state: false,
    },
  };

  console.log("type: " + selectors[type] + " | sub: " + selectors[subject]);
  if (type === "") {
    Swal.fire("এক্সাম এর ধরণ সিলেক্ট করুন!", "", "info");
  } else if (subject === "") {
    Swal.fire("একটি বিষয় সিলেক্ট করুন!", "", "info");
  } else if(duration<0){
    Swal.fire("সময় সঠিক নয়!","", "error")
}  else if(duration < 10){
        Swal.fire("পরীক্ষার সময় অন্তত ১০ মিনিট বা তার বেশি হতে হবে!", "", "info");
}else {
    exam.push(examDetails);
    console.log(examDetails);

    $(".details").html(`
     <div class="d-details">
     <div class="edit-icon det-edit"><a class="waves-effect waves-light btn modal-trigger" href="#detailsEdit">Edit</a></div>
     <div class="d-title">${exam[0].title}</div>
     <div class="d-time">সময়: ${exam[0].time} মিনিট</div>
     <div class="d-nq">প্রশ্ন সংখ্যা: ${exam[0].nq} টি</div>
     <div class="d-score">মোট মার্কস: ${exam[0].score}</div>
     <div class="d-forWrong">মাইনাস মার্ক: ${exam[0].forWrong}</div>
     <div class="d-admin">প্রশ্নকর্তা: ${exam[0].creator}</div>
     </div>
     
     `);
    $("#exam-details").hide();

    title = exam[0].title;
  }

  examsRef = db.ref(selectors[type] + "/");
});

// Questions adding form
var k = 0;
question.addEventListener("submit", (e) => {
  e.preventDefault();

  var examQuestion = {
    q: question.q.value,
    options: [
      question.a.value,
      question.b.value,
      question.c.value,
      question.d.value,
    ],
    ans: question.ans.value,
    expln: question.expln.value,
  };
  k = k + 1;
  exam.push(examQuestion);
  console.log(exam);
  var html = `
          <div class="card">
              <div class="q">${k}. ${question.q.value}</div>
 <div class="options">
     <label>
         <input id="1"  type="radio" name="${k}">
         <span>${question.a.value}</span>
     </label><br>
     <label>
      <input id="2" type="radio" name="${k}">
      <span>${question.b.value}</span>
  </label><br>

  <label>
      <input id="3" type="radio" name="${k}">
      <span>${question.c.value}</span>
  </label><br>

  <label>
      <input id="4" type="radio" name="${k}">
      <span>${question.d.value}</span>
  </label>
 </div>
 <small>Ans: ${question.ans.value}</small><br>
 <small>Expln: ${question.expln.value}</small>
          </div>
          `;

  document.querySelector(".questions").innerHTML += html;
  question.reset();
});

$("#toDatabase").on("click", function () {
    if(exam.length === 0 || exam.length === 1){
        Swal.fire("কোনো প্রশ্ন যুক্ত করেন নি!", "", "error");
    }
    else if(exam.length != exam[0].nq+1){
        Swal.fire( "আরো" + exam.length-(exam[0].nq+1) + "টি প্রশ্ন Add  করুন!", "", "info");
    }else{
  examsRef.set(exam);
  Swal.fire("পরীক্ষাটি সেট করা হয়েছে!", "", "success");
}

});
