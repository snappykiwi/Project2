$(document).ready(function () {

  let API = {

    createInvite: function (eventData, friendName, eventId) {

      console.log(eventData)
      console.log(friendName);

      $.post("api/invite", {
        date: eventData.eventDate,
        startTime: eventData.startTime,
        endTime: eventData.endTime,
        eventId: eventData.uuid,
        friendName: friendName
      }).then((response) => {

        console.log(response);
        $(`p.invite-success-${eventId}`).fadeIn();
        setTimeout(function () {
          $(`p.invite-success-${eventId}`).fadeOut();
        }, 500)

      }, (error) => {

        console.log(error);

      });
    },

    updateInvite: function (inviteId, inviteStatus) {

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

  $("button.invite-trigger").on("click", function (event) {
    $(`.event-invite-${$(this).val()}`).fadeIn();
  })

  $("button.invite").on("click", function (event) {
    let eventId = $(this).val();

    let friend = $(`input.event-invite-${eventId}`).val().trim()
    console.log(friend);

    $(`.event-invite-${eventId}`).fadeOut();

    console.log(event)

    console.log(eventId);
    $.get(`api/events/${eventId}`).then(function (response) {
      console.log(response, friend);

      API.createInvite(response, friend, eventId);

    });
    $(".event-invite-input").hide();

  });

  $("button.accept").on("click", function (event) {

    let inviteId = $(this).val();
    console.log(inviteId);
    let status = "accepted";

    API.updateInvite(inviteId, status).then(function (data) {
      console.log(data);
    });

  });

  $("button.decline").on("click", function (event) {

    let inviteId = $(this).val();
    console.log(inviteId);
    let status = "declined";

    API.updateInvite(inviteId, status);

  });

});