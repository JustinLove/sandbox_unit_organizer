(function() {
  model.screenHeight = function() {
    return window.screen.availHeight
  }

  var resized = function() {
    api.Panel.message('sandbox', 'screen_height', model.screenHeight())
  }

  $(window).resize(resized)
})()
