(function() {
  loadScript('coui://ui/main/shared/js/build.js')

  var leftGroups = _.invert([
      'factory',
      'combat',
      'utility',
      'ammo'
  ]);

  var rightGroups = _.invert([
      'vehicle',
      'bot',
      'air',
      'sea',
      'orbital'
  ]);

  var getBaseFileName = function(spec) {
    var filenameMatch = /([^\/]*)\.json[^\/]*$/;
    return (filenameMatch.exec(spec) || [])[1];
  };

  var buildGrid = function(units, groups) {
    var grid = []
    var map = (new BuildHotkeyModel()).SpecIdToGridMap()
    map["/pa/units/land/avatar_factory/avatar_factory.json"] = ['factory', 5]
    map["/pa/units/commanders/avatar/avatar.json"] = ['orbital', 5]

    units.forEach(function(item) {
      var target = map[item.spec]
      if (target && groups[target[0]]) {
        grid[groups[target[0]] * 15 + target[1]] = item
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

  var gridify = function(units, groups) {
    var grid = buildGrid(units, groups)
    removeEmptyRows(grid)

    return grid
  }

  var compose = function(left, right) {
    var elements = Math.max(left.length, right.length)
    var rows = Math.ceil(elements / 5)
    var grid = []
    var gx
    for (var i = 0;i < rows;i++) {
      for (gx = 0;gx < 5;gx++) {
        grid[i*10 + gx] = left[i*5 + gx]
        grid[i*10 + 5 + gx] = right[i*5 + gx]
      }
    }
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

    var left = gridify(list, rightGroups)
    var right = gridify(list, leftGroups)
    var grid = compose(left, right)
    fillInEmptySlots(grid)

    return grid
  });
})()
