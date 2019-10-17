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
    }

  };

  $("button.invite").on("click", function(event) {
    console.log(event)
    let eventId = $(this).val();

    console.log($(this).val());
    $.get(`api/events/${eventId}`).then(function(response) {
      console.log(response);

      API.createInvite(response);

    });
  });

});