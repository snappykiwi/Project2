$(document).ready(function() {


  let API = {

    createInvite: function(eventData) {
      console.log(eventData)
      $.post("api/invite", {
        date: eventData.eventDate,
        startTime: eventData.startTime,
        endTime: eventData.endTime,
        eventId: eventData.uuid
      }).then((response) => {
        console.log(response);
      }, (error) => {
        console.log(error);
      });
        
      //   function(data, err) {
      //   if (err) throw err;
      //   console.log(data);
      // })
    }

  }


  $("button.invite").on("click", function(event) {
    let eventId = $(this).val();

    $.get(`api/events/${eventId}`).then(function(response) {
      console.log(response[0]);

      API.createInvite(response[0]);

    });
  });

});