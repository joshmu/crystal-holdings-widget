command: "/usr/local/bin/node ./crystal.widget/src/app.js",

refreshFrequency: 36000000,

style: "                  \n\
  bottom: 21px             \n\
  left: 155px             \n\
  color: #fff              \n\
  font-family: Helvetica Neue    \n\
  font-size: 14px          \n\
  font-weight: 200          \n\
                            \n\
  .output                  \n\
    padding: 5px 10px       \n\
    font-smoothing: antialiased\n\
                               \n\
",

render: function(output) {
  return "<div class=\"output\">" +
          "</div>";
},

update: function(output, domEl) {
  var dom = $(domEl);

    /*
  var isJsonString = function(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
  };
  */

  // check if valid json string
  // if(isJsonString(output)) {
  //   output = JSON.parse(output);
  //   total = output.total;
  // }

    // when there is an error loading the command the string is usually large and messes up the desktop view
    // so check if it is there by checking length then removing all of it
  var removeErrorString = function(str) {
    return str.length < 50 ? str : ""
  }

  //output = removeErrorString(output);


  //var result = 'crystal > $' + output["totals"]["usd"].toFixed(2) + ' : ' + output["stats"]["btc"] + '% (' + output["stats"]["daily"]["usd"] + ')';
    dom.find('.output').html(output);

  return;
}

