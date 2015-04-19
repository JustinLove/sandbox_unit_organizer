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

  var groupColumns = ko.observable(5)
  var groupRows = ko.observable(3)
  var groupSize = ko.computed(function() {
    return groupColumns() * groupRows()
  })
  var iconSize = ko.observable(36)
  model.sandboxWidth = ko.computed(function() {
    return (groupColumns() * 2 * (iconSize() * 1.16)).toString() + 'px'
  })

  var calibrateGrid = function() {
    var map = (new BuildHotkeyModel()).SpecIdToGridMap()
    var positions = Object.keys(map).map(function(spec) {return map[spec][1]})
    var max = Math.max.apply(Math, positions)
    if (max < 15) {
      groupColumns(5)
      groupRows(3)
    } else if (max < 18) {
      groupColumns(6)
      groupRows(3)
    } else if (max < 20) {
      groupColumns(5)
      groupRows(4)
    } else if (max < 21) {
      groupColumns(7)
      groupRows(3)
    } else if (max < 24) {
      groupColumns(6)
      groupRows(4)
    } else if (max < 25) {
      groupColumns(5)
      groupRows(5)
    }
  }

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
        grid[groups[target[0]] * groupSize() + target[1]] = item
      }
    })

    return grid
  }

  var removeEmptyRows = function(grid) {
    var c = groupColumns()
    for (i = grid.length + c - grid.length % c;i >= 0;i -= c) {
      empty = true
      for (var j = 0;j < c;j++) {
        if (grid[i+j]) {
          empty = false
        }
      }
      if (empty) {
        grid.splice(i, c)
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
    var c = groupColumns()
    var elements = Math.max(left.length, right.length)
    var rows = Math.ceil(elements / c)
    var grid = []
    var gx
    for (var i = 0;i < rows;i++) {
      for (gx = 0;gx < c;gx++) {
        grid[i*c*2 + gx] = left[i*c + gx]
        grid[i*c*2 + c + gx] = right[i*c + gx]
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

    calibrateGrid()

    var list = makeItems(model.unitSpecs())

    var left = gridify(list, mobileGroups)
    var right = gridify(list, baseGroups).concat(makeItems(_.invert(miscUnits)))
    var grid = compose(left, right)
    fillInEmptySlots(grid)

    return grid
  });

  var $sandbox = $('.div_sandbox_main')
  $sandbox.attr('data-bind', $sandbox.attr('data-bind') + ', style: {width: sandboxWidth}')

  var resized = function(height) {
    if (height < 800) {
      $sandbox.addClass('small_sandbox')
      iconSize(24)
    } else {
      $sandbox.removeClass('small_sandbox')
      iconSize(36)
    }
  }

  api.Panel.query(api.Panel.parentId, 'panel.invoke', ['screenHeight'])
    .then(resized)

  handlers.screen_height = resized

  //model.sandbox_expanded(true)
})()
