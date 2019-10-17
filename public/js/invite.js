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

    updateInvite: function(inviteStatus) {

      console.log(inviteStatus);

      return $.ajax({
        url: "api/invites/" + inviteStatus,
        type: "PUT"
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

  $("button.accept").on("click", function(event) {

    let inviteId = $(this).val();

    $.get(`api/invite/${inviteId}`).then(function(res) {

      // get invite status and pass it in below
      API.updateInvite(res);

    });

  });

  $("button.decline").on("click", function(event) {

    let inviteId = $(this).val();

    $.get(`api/invite/${inviteId}`).then(function(res) {

      // get invite status and pass it in below
      API.updateInvite(res);

    });

  });

});