// selectors
const login = document.querySelector("#login-form");
const register = document.querySelector("#register-form");
// console.log(localStorage.getItem('username'));
// localStorage.removeItem('username');
$(".loading").hide();
const users = db.ref("hscUsers");
$(document).ready(function () {
  $(".modal").modal();
  if (
    localStorage.getItem("token") === null ||
    localStorage.getItem("token") === undefined
  ) {
    $(".login-modal").modal("open");
    //   $('.register-modal').modal('open');
    M.toast({ html: "তুমি এখনো লগইন করোনি!", classes: "rounded red" });

    login.addEventListener("submit", (e) => {
      e.preventDefault();
      $(".msg").html(`<div style="background: var(--green);
            color: #fff;
            padding: 5px;
            border-radius: 5px;
            text-align:center;
            transition: 1s;">Just a momment Please....</div>`);
      // var username = login.username.value;
      var phone = login.phone.value;
      var found = false;
      var key;
      users.on("value", (snap) => {
        snap.forEach((item) => {
          if (item.val().phone === phone) {
            key = item.key;
            found = true;
            return { key, found };
          }
        });
        if (!found) {
          $(".msg").html(`<div style="background: var(--danger);
            color: #fff;
            padding: 5px;
            border-radius: 5px;
            transition: 1s;">এই ফোন নম্বরটি রেজিস্ট্রেশন করা হয়নি!</div>`);
          M.toast({
            html: "এই ফোন নম্বরটি রেজিস্ট্রেশন করা হয়নি!",
            classes: "rounded red",
          });
        } else {
            
        //   localStorage.setItem("username", username);
          localStorage.setItem("phone", phone);
          localStorage.setItem("token", key);

          window.location.reload();
        }
      });
    });

    //
    $("#file").on("change", function (e) {
      var fileName = e.target.value;
      // var reader = new FileReader();
      // reader.onload = function(){
      //     $('head').append('<style>#register::before{background-size: cover !important; height: 60px !important; width: 60px !important; background: url("'+ reader.result +'") !important; }</style>');
      // };
      // reader.readAsDataURL(event.target.files[0]);
      // console.log(e.target.files[0]);
      fileName = fileName.split("\\").pop();
      if (fileName.length > 8) fileName = fileName.slice(0, 8) + "...";
      $(".fileName").text(fileName);
    });

    register.addEventListener("submit", (e) => {
      e.preventDefault();

      var username = register.username.value,
        phone = register.phone.value,
        college = register.college.value,
        district = register.district.value,
        avatar = register.photo.files[0];
      //console.log(photo);
      var found = false;
      users.once("value", (snap) => {
        snap.forEach((item) => {
          if (item.val().phone === phone) {
            key = item.key;
            found = true;
            return { key, found };
          }
        });
        if (found) {
          M.toast({
            html: "এই ফোন নম্বরটি দিয়ে রেজিস্ট্রেশন করা হয়েছে!",
            classes: "rounded red",
          });
        } else {
          if (phone.length != 11) {
            M.toast({
              html: "তোমার মোবাইল নম্বর ১১ অংকের হতে হবে!",
              classes: "rounded red",
            });
          } else if (avatar === undefined) {
            M.toast({
              html: "একটি প্রোফাইল ফটো আপলোড করো!",
              classes: "rounded red",
            });
          } else {
            // uploading photo
            $(".loading").show();
            var metadata = {
              contentType: "image/jpeg",
            };
            var uploadTask = storage
              .ref()
              .child("avatar/" + username)
              .put(avatar, metadata);
            uploadTask.on(
              firebase.storage.TaskEvent.STATE_CHANGED,
              function (snapshot) {
                var progress = snapshot.bytesTransferred / snapshot.totalBytes;
                M.toast({
                  html: "আপলোড হচ্ছে... " + progress + "%",
                  classes: "rounded orange toast",
                });
                switch (snapshot.state) {
                  case firebase.storage.TaskState.PAUSED:
                    console.log("Upload is paused!");
                    break;
                  case firebase.storage.TaskState.RUNNING:
                    console.log("Upload is runnning!");
                    break;
                }
              },
              function (error) {
                switch (error.code) {
                  case "storage/unauthorized":
                    console.log("Storage Unauthorized!");
                    break;

                  case "storage/canceled":
                    console.log("Cancelled!");
                    break;
                  case "storage/unknown":
                    console.log(
                      "Unknown Error Occured,  inspect error.serverResponse"
                    );
                    break;
                }
              },
              function () {
                uploadTask.snapshot.ref
                  .getDownloadURL()
                  .then(function (downloadURL) {
                    M.toast({
                      html: "আপলোড হয়েছে!",
                      classes: "rounded green toast",
                    });
                    var registrationData = {
                      username: username,
                      phone: phone,
                      college: college,
                      district: district,
                      avatar: downloadURL,
                      score: 0,
                    };
                    users.push(registrationData);
                    $(".loading").hide();
                    $("#register-form").html(`
                                   <h5 class="yellow-text">
                                   হুররে...! রেজিস্ট্রেশন সম্পন্ন হয়েছে!
                                   </h5>
                                   <center><a  class="btn purple lg-reload"> এখন লগইন করো!</a></center>
                                   `);
                  });
              }
            );
            // uploading photo end
          }
        }
      });
    });
  } else {
    $(".before").hide();
    //   $('#user-info-modal').modal('open');
  }

  $(".rgbtn").click(function () {
    $(".login-modal").modal("close");
  });

  $(".lgbtn").click(function () {
    $(".register-modal").modal("close");
  });
});

$(".lg-reload").click(function () {
  window.location.reload();
});

$(document).ready(function(){
  $('.sidenav').sidenav();
});
   