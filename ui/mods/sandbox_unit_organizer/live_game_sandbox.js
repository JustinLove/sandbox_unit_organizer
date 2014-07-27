(function() {
  loadScript('coui://ui/main/shared/js/build.js')

  var tabOrder = _.invert([
      'factory',
      'combat',
      'utility',
      'vehicle',
      'bot',
      'air',
      'sea',
      'orbital',
      'ammo'
  ]);

  var getBaseFileName = function(spec) {
    var filenameMatch = /([^\/]*)\.json[^\/]*$/;
    return (filenameMatch.exec(spec) || [])[1];
  };

  var fullBuildGrid = function(units) {
    var grid = []
    var map = (new BuildHotkeyModel()).SpecIdToGridMap()

    units.forEach(function(item) {
      var target = map[item.spec]
      if (target) {
        grid[tabOrder[target[0]] * 15 + target[1]] = item
      }
    })

    return grid
  }

  var removeEmptyRows = function(grid) {
    for (i = grid.length + 5 - grid.length % 5;i >= 0;i -= 5) {
      empty = true
      for (var j = 0;j < 5;j++) {
        if (grid[i+j]) {
          empty = false
        }
      }
      if (empty) {
        grid.splice(i, 5)
      }
    }
  }

  var fillInEmptySlots = function(grid) {
    for (var i = 0;i < grid.length;i++) {
      if (!grid[i]) {
        grid[i] = {spec: '', icon: ''}
      }
    }
  }

  var gridify = function(units) {
    var grid = fullBuildGrid(units)
    removeEmptyRows(grid)
    fillInEmptySlots(grid)

    return grid
  }

  model.sandbox_units = ko.computed(function() {
    if (!model.sandbox_expanded()) return [];
    if (!window['BuildHotkeyModel']) return [];

    var list = _.map(model.unitSpecs(), function(unit, spec) {
      return({
        spec: spec,
        icon: 'img/build_bar/units/' + getBaseFileName(spec) + '.png'
      });
    });

    return gridify(list)
  });
})()
