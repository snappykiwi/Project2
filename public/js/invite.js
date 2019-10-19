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
    },

    updateInvite: function(inviteId, inviteStatus) {

      console.log(inviteId, inviteStatus);

      return $.ajax({
        url: `api/invite/${inviteId}`,
        type: "PUT",
        data: {
          status: inviteStatus
        }
      })

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

  $("button.accept").on("click", function(event) {

    let inviteId = $(this).val();
    console.log(inviteId);
    let status = "accepted";

    API.updateInvite(inviteId, status).then(function (data) {
      console.log(data);
    });

  });

  $("button.decline").on("click", function(event) {

    let inviteId = $(this).val();
    console.log(inviteId);
    let status = "declined";

    API.updateInvite(inviteId, status);

  });

});