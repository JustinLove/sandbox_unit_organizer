(function() {
  var miscUnits = [
    "/pa/units/commanders/imperial_invictus/imperial_invictus.json", 
    "/pa/units/commanders/quad_osiris/quad_osiris.json", 
    "/pa/units/commanders/raptor_centurion/raptor_centurion.json", 
    "/pa/units/commanders/raptor_nemicus/raptor_nemicus.json", 
    "/pa/units/commanders/raptor_rallus/raptor_rallus.json", 
    "/pa/units/commanders/tank_aeson/tank_aeson.json",
    "/pa/units/commanders/avatar/avatar.json",
    "/pa/units/land/avatar_factory/avatar_factory.json"
  ]

  var baseGroups = _.invert([
      'factory',
      'combat',
      'utility',
      'ammo'
  ]);

  var mobileGroups = _.invert([
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

  var makeItems = function(specs) {
    return _.map(specs, function(unit, spec) {
      return({
        spec: spec,
        icon: 'img/build_bar/units/' + getBaseFileName(spec) + '.png'
      });
    });
  }

  var buildGrid = function(units, groups) {
    var grid = []
    var map = (new BuildHotkeyModel()).SpecIdToGridMap()

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
        grid[i] = {spec: '', icon: 'coui://ui/main/shared/img/planets/empty.png'}
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

  var difference = function(list, grid) {
    var index = {}
    var diff = []
    grid.forEach(function(item) {index[item.spec] = item})
    console.log(list, grid, index)
    list.forEach(function(item) {
      if (!index[item.spec]) {
        diff.push(item)
      }
    })
    return diff
  }

  var filter = function(list) {
    return list.filter(function(item) {
      return !item.spec.match(/base/)
    })
  }

  var print = function(list) {
    list.forEach(function(item) {
      console.log(item.spec)
    })
  }

  model.sandbox_units = ko.computed(function() {
    if (!model.sandbox_expanded()) return [];
    if (!window['BuildHotkeyModel']) return [];

    var list = makeItems(model.unitSpecs())

    var left = gridify(list, mobileGroups)
    var right = gridify(list, baseGroups).concat(makeItems(_.invert(miscUnits)))
    var grid = compose(left, right)
    fillInEmptySlots(grid)

    return grid
  });
})()
