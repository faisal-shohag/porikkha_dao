//$('.det-edit').click(function(){
    db.ref('live/0').on('value', snap=>{
        console.log(snap.val());
        var nq = snap.val().nq,
            ended  = snap.val().ended,
            publishResult = snap.val().publishResult,
            resultText = snap.val().resultText,
            score = snap.val().score,
            sub = snap.val().sub,
            type = snap.val().type

       var html = `
        <small>Title</small>
        <div class="input-field">
        <input type="text" name="det_title" value="${snap.val().title}" />
        </div>
        
        <small>Start Time</small>
        <div class="input-field">
        <input type="text" value="${snap.val().startTime}" name="start" />
        </div>


        <small>End Time</small>
        <div class="input-field">
        <input type="text" value="${snap.val().endTime}" name="end"  />
        </div>
        
        <small>Negative mark for each Question</small>
        <div class="input-field">
        <input type="text" name="det_for_wrong" value="${snap.val().forWrong}" />
        </div>
        
        <small>Exam Setter</small>
        <div class="input-field">
        <input type="text" name="det_creator" value="${snap.val().creator}" />
        </div>
        `

        document.querySelector('#live-details-edit-form').innerHTML = html;

       const detForm = document.querySelector('#live-details-edit-form');
        $('#det-save').off().click(function(){
            var str = new Date(detForm.start.value);
            var end = new Date(detForm.end.value);
            var duration = end.getTime() - str.getTime();
            //console.log(duration);
            duration /= 60000;
            duration = Math.abs(Math.round(duration));

            var detData = {
                creator: detForm.det_creator.value,
                endTime: detForm.end.value,
                startTime: detForm.start.value,
                ended: ended,
                forWrong: detForm.det_for_wrong.value,
                nq: nq,
                publishResult: publishResult,
                resultText: resultText,
                score: score,
                sub: sub,
                time: duration,
                title: detForm.det_title.value,
                type: type
            }

            console.log(detData);


            db.ref('live/0').update(detData);
            Swal.fire("Saved Successfully!", "", "success");
        })

    })
//})
