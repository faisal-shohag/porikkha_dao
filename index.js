const exams = db.ref("exams");

$(".after-login").hide(); //hide after login html contents
var localphone = localStorage.getItem("phone"),
  localtoken = localStorage.getItem("token");

if (localtoken != null) {
  $(".before-login").remove();
  $(".after-login").show();
  db.ref("hscUsers/" + localtoken).on("value", (snap) => {
    //console.log(snap.val());
    $(".avatar").html(
      `<a class="modal-trigger" href="#user-info-modal"><img src="${
        snap.val().avatar
      }" /></a>`
    );
    $(".username").html(`${snap.val().username}`);
    $(".modal-avatar").html(`<img src="${snap.val().avatar}" />`);
    $(".college").text(snap.val().college);
    $(".district").html(`<span class="white-text district">From <b>${
      snap.val().district
    }</b></span>
      `);

    localStorage.setItem("username", snap.val().username);
    localStorage.setItem("college", snap.val().college);
    localStorage.setItem("district", snap.val().district);
    localStorage.setItem("avatar", snap.val().avatar);
    //$('.username')
  });
  var i = 1,
    count = 0;
  var total_score = 0;
  db.ref("hscUsers/" + localtoken + "/exams").on("child_added", (snap) => {
    total_score += snap.val().correct;
    $(".exam-score").text("স্কোর " + total_score);
    $(".box-score").html(total_score);

    count += i;
    $(".exam-count").text(count + " টি পরীক্ষা");
    $(".box-total-exams").text(count);

    var userExamList = `
       <div class="user-exams">
       <div class="user-exam-name">${snap.val().examTitle}</div>
       <div class="user-exam-score">${snap.val().correct}</div> 
       </div>
       `;
    document.querySelector(".user-exam-list").innerHTML += userExamList;
  });

  $(".global-rank-icon").click(function () {
    // Global Ranking
    db.ref("hscUsers").on("value", (snap) => {
      $(".global-ranking-content").html(``);

      var userKeys = [];
      var usernames = [];
      var colleges = [];
      var avatars = [];

      snap.forEach((item) => {
        userKeys.push(item.key);
        usernames.push(item.val().username);
        colleges.push(item.val().college);
        avatars.push(item.val().avatar);
      });
      var unsortedObj = [];

      for (let i = 0; i < userKeys.length; ++i) {
        var scoreCount = 0;
        db.ref("hscUsers/" + userKeys[i] + "/exams").on("child_added", (s) => {
          //console.log(s.val());
          scoreCount += s.val().correct;
        });

        //console.log('username:'+ usernames[i] + ' : '+ scoreCount);

        var obj = {
          username: usernames[i],
          college: colleges[i],
          avatar: avatars[i],
          score: scoreCount,
        };
        unsortedObj.push(obj);
      }

      unsortedObj.sort(function (a, b) {
        return b.score - a.score;
      });

      for (let f = 0; f < unsortedObj.length; ++f) {
        if (unsortedObj[f].username === localStorage.getItem("username")) {
          //console.log('Found!');
          $(".position-num").text(f + 1);
        }
        var gld = `
       <div class="gld-items">
          <div class="gld-number">${f + 1}</div>
          <div class="ld-avatar"><img src="${unsortedObj[f].avatar}" /></div>
          
          <div class="gld-info">
          <div class="gld-username">${unsortedObj[f].username}</div>
          <div class="gld-college">${unsortedObj[f].college}</div>
          </div>
      
          <div class="gld-score">
          <div class="gld-cr">${unsortedObj[f].score}</div>
          </div>
          </div>
       `;
        document.querySelector(".global-ranking-content").innerHTML += gld;
      }
    });
  });

  // Exam list
  exams.on("value", (snap) => {
    $(".content-loading").remove();
    document.querySelector(".exam-list").innerHTML = "";
    snap.forEach((item) => {
      var results = [];
      if(item.val()[0].results != null || item.val()[0].results != undefined){ results = Object.entries(item.val()[0].results);}
      
      
      var html = `
        <a class="modal-trigger"   href="#eachExam"><div class="exam-card" id="${
          item.key
        }">
        <div class="exam-title">${item.val()[0].title}</div>
        <div class="exam-details"><small> প্রশ্ন: ${item.val()[0].nq} টি | সময়: ${
        item.val()[0].time
      } মিনিট | মাইনাস মার্কস: ${
        item.val()[0].forWrong
      } | By: ${item.val()[0].creator}</small> <div style="" class="exam-users"> ${results.length} জন</div></div>
        </div></a>
        `;
      document.querySelector(".exam-list").innerHTML += html;
    });
  });

  // open each exam
  var examTitle = "";
  var examToken = "";
  var minusMark = 0;
  var examLength = 0;
  $(document).on("click", ".exam-card", function () {
    var key = $(this)[0].id;
    examToken = key;
    var exam = [];
    var ans = [];
    var correctAns = [];
    var eachExamRef = db.ref("exams/" + key);
    eachExamRef.once("value", (snap) => {
      $(".ld-exam-name").html(`${snap.val()[0].title}`);
      $(".title").html(`${
        snap.val()[0].title
      } <div class="exam-timer"> <div id="timer">--:--</div> <small class="red-text warn"></small></div
        
        <div class="exam-menu">
        <a class="modal-trigger ld-open" href="#leaderboard"><div class="ld"><span class="material-icons">format_list_numbered_rtl</span></div></a>
      </div>
        
        `);
      exam = snap.val();
      examTitle = snap.val()[0].title;
      examLength = snap.val().length;
      minusMark = parseInt(snap.val()[0].forWrong);
    });

    // Leader board

    $(document).on("click", ".ld-open", function () {
      $(".ld-content").html("");
      const ldRef = db
        .ref("exams/" + examToken + "/0/results")
        .orderByChild("correct");
      var ld_count = 1;
      var ldData = [];
      ldRef.on("child_added", (snap) => ldData.push(snap.val()));
      //console.log(ldData.length)
      if(ldData.length!=0) $('.no-data').hide();
      else $('.no-data').show();
      for (let i = ldData.length - 1; i >= 0; --i) {
        var html = `
    <div class="ld-items">
    <div class="ld-number">${ld_count++}</div>
    <div class="ld-avatar"><img src="${ldData[i].avatar}" /></div>
    
    <div class="ld-info">
    <div class="ld-username">${ldData[i].username}</div>
    <div class="ld-college">${ldData[i].college}</div>
    </div>

    <div class="ld-score">
    <div class="ld-cr">${ldData[i].correct}</div>
    
    <span class="ld-time">${ldData[i].time}</span>
    </div>


    </div>
    `;

        document.querySelector(".ld-content").innerHTML += html;
      }
    });

    //  Close Leader board
    // $(document).on('click', '.ld-back', function(){
    //   ld_count = 0;
    //   console.log(ld_count)
    // });

    for (let i = 1; i < exam.length; ++i) {
      ans.push(exam[i].ans);
      correctAns.push(exam[i].expln);
      var html = `
            <div class="question">
    <div class="q">${i}. ${exam[i].q}</div>
   <div class="options">
       <label>
           <input id="1" type="radio" name="${i}">
           <span>${exam[i].options[0]}</span>
       </label><br>
       <label>
        <input id="2" type="radio" name="${i}">
        <span>${exam[i].options[1]}</span>
    </label><br>

    <label>
        <input id="3" type="radio" name="${i}">
        <span>${exam[i].options[2]}</span>
    </label><br>

    <label>
        <input id="4" type="radio" name="${i}">
        <span>${exam[i].options[3]}</span>
    </label>
   </div>
</div>`;

      document.querySelector(".questions").innerHTML += html;
    }

    // timer
    var time = parseInt(exam[0].time);
    var numbers = {
      0: "0",
      1: "1",
      2: "2",
      3: "3",
      4: "4",
      5: "5",
      6: "6",
      7: "7­",
      8: "8",
      9: "9",
    };

    var interval;
    var mn1 = "";
    var ss1 = "";
    function startTimer(duration, display) {
      var timer = duration,
        minutes,
        seconds;
      interval = setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;

        seconds = seconds < 10 ? "0" + seconds : seconds;
        var mn = "";
        var ss = "";
        mn += numbers[parseInt(minutes / 10)];
        mn += numbers[parseInt(minutes % 10)];
        ss += numbers[parseInt(seconds / 10)];
        ss += numbers[parseInt(seconds % 10)];
        if (mn === "00")
          display.html(
            `<span style="color: var(--orange)">মাত্র ${ss} সেকেন্ড বাকি</span>`
          );
        else display.html(`${mn} : ${ss}`);

        mn1 = mn;
        ss1 = ss;

        if (--timer < 0) {
          clearInterval(interval);
          $("#timer").text("সময় শেষ!");
          //$('#sub').click();
          $("#sub").hide("");
        }
      }, 1000);
    }

    jQuery(function ($) {
      display = $("#timer");
      startTimer(time * 60, display);
    });

    // Exam Engine
    var cr = 0;
    var wa = 0;
    //var indexes = [];
    var markedCount = 0;
    $("input[type='radio']").on("click", function () {
      $("input[type=radio][name=" + this.name + "]").prop("disabled", true);
      markedCount++;
      if ($(this)[0].id === ans[parseInt($(this)[0].name) - 1]) {
        $(this)[0].parentNode.classList.add("correct");
        // console.log('Correct')
        cr++;
        //indexes.push(parseInt($(this)[0].name)-1);
      } else {
        $(this)[0].parentNode.classList.add("wrong");
        wa++;
      }

      if (markedCount === examLength - 1) {
        $(".markedCount").html(
          `<div style="color: var(--success); font-size: 20px; transition: 1s;">${markedCount}/${
            examLength - 1
          }</div>`
        );
      } else $(".markedCount").html(`${markedCount}/${examLength - 1}`);
    });

    //Exam Engine End

    //Submit handle
    $("#sub")
      .unbind()
      .click(function () {
        $("#sub").hide();
        if(minusMark==="") minusMark = 0;
        $(".modal-content").animate({ scrollTop: 0 }, "slow");
        clearInterval(interval);
        var soln;
        const questions = document.querySelectorAll(".question");
        $(".soln").remove();
        for (let i = 0; i < questions.length; ++i) {
          soln = `<div class="soln"> ${correctAns[i]} </div>`;
          questions[i].innerHTML += soln;
        }

        $(".result").html(`<div class="result-data">
      <div class="score-box cr">${cr}</div>
      <div class="score-box wa">${wa}</div>
      <div class="score-box nans">${examLength - 1 - (cr + wa)}</div>
      <div class="score-box tm">${mn1}: ${ss1}</div>
      <div class="score-box mark">${cr-(wa*minusMark)}</div>
      <div class="score-box minus-mark">${cr-(cr-(wa*minusMark))}</div>
      </div>`);

        // var ansSheet = document.querySelector('.questions');
        $(".questions").addClass("after-end");

        //console.log(cr)
        //Send Data to user
        const token = localStorage.getItem("token");
        const userExams = db.ref("hscUsers/" + token + "/exams");
        
        if (cr != 0) {
          userExams.on("value", (snap) => {
            var found = false;
            snap.forEach((item) => {
              if (item.val().examTitle === examTitle) {
                found = true;
              }
            });


            if (!found) {
             // console.log(cr);
              var userExamData = {
                examTitle: examTitle,
                correct: cr,
                mark: cr-(wa*minusMark),
                wrong: wa,
                notAns: examLength - 1 - (cr + wa),
                time: mn1 + ":" + ss1,
                total: examLength - 1,
              };

              userExams.push(userExamData);
              M.toast({ html: "সাবমিট হয়েছে!", classes: "rounded green" });
            } else {
              //M.toast({html: 'পরীক্ষাটি আগেও একবার দিয়েছিলে!', classes: 'rounded red'});
            }
          });

          //score sending to Leaderboard
          resultRef = db.ref("exams/" + examToken + "/0/results");
          resultRef.on("value", (snap) => {
            var foundInld = false;
            snap.forEach((item) => {
              if (localStorage.getItem("username") === item.val().username) {
                //console.log('found');
                foundInld = true;
              }
            });
            // console.log(foundInld)
            if (!foundInld) {
              var leaderboardData = {
                examTitle: examTitle,
                correct: cr,
                wrong: wa,
                notAns: examLength - 1 - (cr + wa),
                time: mn1 + ":" + ss1,
                college: localStorage.getItem("college"),
                username: localStorage.getItem("username"),
                district: localStorage.getItem("district"),
                avatar: localStorage.getItem("avatar"),
              };
              resultRef.push(leaderboardData);
            }
          });
        } else {
          M.toast({
            html: "If you get 0, we give you one more chance!",
            classes: "rounded green",
          });
        }
        cr = 0;
        wa = 0;
        forWrong = 0;
      });
    // Submit handle End

    // Close Exam
    $(document).on("click", ".cancel-exam", function () {
      clearInterval(interval);
      $(".markedCount").html("");
      $("#sub").show();
      $(".result").html("");
      $(".questions").removeClass("after-end");
      document.querySelector(".questions").innerHTML = "";
    });
  });

  // Log out
  $(".log-out").click(function () {
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    localStorage.removeItem("phone");
    localStorage.removeItem("college");
    localStorage.removeItem("district");
    localStorage.removeItem("avatar");
    window.location.reload();
  });
}

localStorage.getItem("mode");
