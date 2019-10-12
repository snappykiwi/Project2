// document.addEventListener('DOMContentLoaded', function() {
//   let calendarStart = document.querySelectorAll('#startDate');
//   let instances = M.Datepicker.init(calendarStart, {
//     minDate: new Date(today)
//   });
// });

$(document).ready(function(){

  // initialize materialize drop down menu for request
  $('select').formSelect();

  let today = moment();

  // $('.start').datepicker({
  //   id: 1,
  //   minDate: (new Date(today)),
  //   defaultDate: today,
  //   setDefaultDate: true,
  //   showClearBtn: true
  // });
  // $('.end').datepicker({
  //   id: 1,
  //   minDate: (new Date(today)),
  //   defaultDate: today,
  //   setDefaultDate: true,
  //   showClearBtn: true

  // });

  // let dateStartInst = M.Datepicker.getInstance('#startDate');
  // let dateEndInst = M.Datepicker.getInstance('#endDate');

  // dateStartInst.setDate(new Date(today))
  // dateEndInst.setDate(new Date(today))


  const start = datepicker('.start', {id: 1 });
  const end = datepicker('.end', {id: 1 })

  start.setMin(new Date(today));

  let timeSelected = $('input.timepicker').timepicker({
    showClearBtn: true,
    onSelect: function(hour, minute) {

      console.log(hour);
      console.log(minute);
    }

  });

  // when choice for time restriction changes, show/hide timepicker(s)
  $('select#time-rest').on("change", function(event) {

    let choiceVal = $(this).val();

    switch(choiceVal) {
      case '1': 
        $('div.time').hide();
        $('input.time').val('')
        break;
      case '2': 
        $('div.timeTwo').show().addClass("offset-s3");
        $('div.timeOne').hide().removeClass("offset-s3");
        $('input#timeOne').val('');
        break;
      case '3':
        $('div.timeOne').show().addClass("offset-s3");
        $('div.timeTwo').hide().removeClass("offset-s3");
        $('input#timeTwo').val('')
        break;
      case '4':
        $('div.timeTwo').removeClass("offset-s3");
        $('div.timeOne').removeClass("offset-s3");
        $('div.time').show();
        break;
    }

  });


  $('button#submit-request').on("click", function(event) {

    let dateRange = start.getRange();
    let beginDate = dateRange.start;
    let endDate = dateRange.end;
    console.log(beginDate, endDate);

    let beforeTime = $('input#timeTwo').val();
    let afterTime = $('input#timeOne').val();
    console.log(`Before the time of: ${beforeTime}`);
    console.log(`After the time of: ${afterTime}`);

  });

});


// // Get references to page elements
// var $exampleText = $("#example-text");
// var $exampleDescription = $("#example-description");
// var $submitBtn = $("#submit");
// var $exampleList = $("#example-list");

// // The API object contains methods for each kind of request we'll make
// var API = {
//   saveExample: function(example) {
//     return $.ajax({
//       headers: {
//         "Content-Type": "application/json"
//       },
//       type: "POST",
//       url: "api/examples",
//       data: JSON.stringify(example)
//     });
//   },
//   getExamples: function() {
//     return $.ajax({
//       url: "api/examples",
//       type: "GET"
//     });
//   },
//   deleteExample: function(id) {
//     return $.ajax({
//       url: "api/examples/" + id,
//       type: "DELETE"
//     });
//   }
// };

// // refreshExamples gets new examples from the db and repopulates the list
// var refreshExamples = function() {
//   API.getExamples().then(function(data) {
//     var $examples = data.map(function(example) {
//       var $a = $("<a>")
//         .text(example.text)
//         .attr("href", "/example/" + example.id);

//       var $li = $("<li>")
//         .attr({
//           class: "list-group-item",
//           "data-id": example.id
//         })
//         .append($a);

//       var $button = $("<button>")
//         .addClass("btn btn-danger float-right delete")
//         .text("ｘ");

//       $li.append($button);

//       return $li;
//     });

//     $exampleList.empty();
//     $exampleList.append($examples);
//   });
// };

// // handleFormSubmit is called whenever we submit a new example
// // Save the new example to the db and refresh the list
// var handleFormSubmit = function(event) {
//   event.preventDefault();

//   var example = {
//     text: $exampleText.val().trim(),
//     description: $exampleDescription.val().trim()
//   };

//   if (!(example.text && example.description)) {
//     alert("You must enter an example text and description!");
//     return;
//   }

//   API.saveExample(example).then(function() {
//     refreshExamples();
//   });

//   $exampleText.val("");
//   $exampleDescription.val("");
// };

// // handleDeleteBtnClick is called when an example's delete button is clicked
// // Remove the example from the db and refresh the list
// var handleDeleteBtnClick = function() {
//   var idToDelete = $(this)
//     .parent()
//     .attr("data-id");

//   API.deleteExample(idToDelete).then(function() {
//     refreshExamples();
//   });
// };

// // Add event listeners to the submit and delete buttons
// $submitBtn.on("click", handleFormSubmit);
// $exampleList.on("click", ".delete", handleDeleteBtnClick);
