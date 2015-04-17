(function() {
  if (!model['serverSandboxState']) {
    model.serverSandboxState = ko.observable(false)
    model.serverSandboxState.subscribe(model.cheatAllowCreateUnit)
    model.serverSandboxState.subscribe(model.cheatAllowChangeVision)
    model.serverSandboxState.subscribe(model.cheatAllowChangeControl)

    var live_game_server_state = handlers.server_state
    handlers.server_state = function(msg) {
      live_game_server_state.apply(this, arguments)

      if (msg.data && msg.data.client && msg.data.client.game_options) {
        model.serverSandboxState(!!msg.data.client.game_options.sandbox)
      }
    }
  }
})()
