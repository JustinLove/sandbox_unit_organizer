(function() {
  "use strict";

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

  if (api.content.active() == 'PAExpansion1') {
    miscUnits.unshift("/pa/units/sea/drone_carrier/drone/drone.json")
  }

  var baseGroups = [
    'factory',
    'combat',
    'utility',
    'orbital_structure',
    'ammo',
  ];

  var mobileGroups = [
    'vehicle',
    'bot',
    'air',
    'sea',
    'orbital',
  ];

  var addUnknownTabs = function() {
    var map = (new Build.HotkeyModel()).SpecIdToGridMap()
    var tabs = _.uniq(Object.keys(map).map(function(spec) {return map[spec][0]}))
    var base = baseGroups.slice(0)
    var mobile = mobileGroups.slice(0)
    tabs = _.difference(tabs, mobile, base)
    tabs.forEach(function(tab) {
      for (var i in base) {
        if (tab.match(base[i])) {
          baseGroups.push(tab)
          return
        }
      }

      for (var i in mobile) {
        if (tab.match(mobile[i])) {
          mobileGroups.push(tab)
          return
        }
      }

      if (baseGroups.length <= mobileGroups.length) {
        baseGroups.push(tab)
      } else {
        mobileGroups.push(tab)
      }
    })
  }

  var groupColumns = ko.observable(6)
  var groupRows = ko.observable(3)
  var groupSize = ko.computed(function() {
    return groupColumns() * groupRows()
  })
  var sandboxColumns = ko.observable(groupColumns() * 2)
  var iconSize = ko.observable(36)
  model.sandboxWidth = ko.computed(function() {
    return (sandboxColumns() * (iconSize() * 1.12) + 22).toString() + 'px'
  })

  var calibrateGrid = function() {
    var map = (new Build.HotkeyModel()).SpecIdToGridMap()
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
    sandboxColumns(groupColumns() * 2)
  }

  var makeItems = function(specs) {
    return _.map(specs, function(unit, spec) {
      return({
        spec: spec,
        icon: Build.iconForSpecId(spec)
      });
    });
  }

  var buildGrid = function(units, groups) {
    groups = _.invert(groups)
    var grid = []
    var map = (new Build.HotkeyModel()).SpecIdToGridMap()

    units.forEach(function(item) {
      var target = map[item.spec]
      if (target && groups[target[0]]) {
        grid[groups[target[0]] * groupSize() + target[1]] = item
      }
    })

    return {
      columns: groupColumns(),
      cells: grid,
    }
  }

  var removeEmptyRows = function(grid) {
    var c = grid.columns
    var cells = grid.cells
    for (i = cells.length + c - cells.length % c;i >= 0;i -= c) {
      var items = 0
      for (var j = 0;j < c;j++) {
        if (cells[i+j]) {
          items = items + 1
        }
      }
      if (items < 1) {
        cells.splice(i, c)
      }
      if (items == 1) {
        for (var j = 0;j < c;j++) {
          if (cells[i+j]) {
            miscUnits.unshift(cells[i+j].spec)
          }
        }
        cells.splice(i, c)
      }
    }
  }

  var removeEmptyColumns = function(grid) {
    var cells = grid.cells
    for (var j = grid.columns;j >= 0;j--) {
      var c = grid.columns
      var empty = true
      for (i = cells.length + j - cells.length % c;i >= 0;i -= c) {
        if (cells[i]) {
          empty = false
        }
      }
      if (empty) {
        for (i = cells.length + j - cells.length % c;i >= 0;i -= c) {
          cells.splice(i, 1)
        }
        grid.columns = grid.columns - 1
      }
    }
  }

  var fillInEmptySlots = function(grid) {
    var cells = grid.cells
    for (var i = 0;i < cells.length;i++) {
      if (!cells[i]) {
        cells[i] = {spec: '', icon: 'coui://ui/main/shared/img/planets/empty.png'}
      }
    }
  }

  var gridify = function(units, groups) {
    var grid = buildGrid(units, groups)
    removeEmptyRows(grid)
    removeEmptyColumns(grid)

    return grid
  }

  var compose = function(left, right) {
    var c = left.columns + right.columns
    var rows = Math.ceil(Math.max(left.cells.length / left.columns,
                                  right.cells.length / right.columns))
    var cells = []
    var gx
    for (var i = 0;i < rows;i++) {
      for (gx = 0;gx < left.columns;gx++) {
        cells[i*c + gx] = left.cells[i*left.columns + gx]
      }
      for (gx = 0;gx < right.columns;gx++) {
        cells[i*c + left.columns + gx] = right.cells[i*right.columns + gx]
      }
    }
    return {
      columns: c,
      cells: cells,
    }
  }

  var difference = function(list, grid) {
    var index = {}
    var diff = []
    grid.forEach(function(item) {index[item.spec] = item})
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
    if (!window['Build']) return [];

    calibrateGrid()
    addUnknownTabs()

    var list = makeItems(model.unitSpecs())

    var left = gridify(list, mobileGroups)
    var right = gridify(list, baseGroups)
    var grid = compose(left, right)
    grid.cells = grid.cells.concat(makeItems(_.invert(miscUnits)))
    fillInEmptySlots(grid)

    sandboxColumns(grid.columns)
    return grid.cells
  });

  var $preKOMain = $('.div_sandbox_main')
  $preKOMain.attr('data-bind', $preKOMain.attr('data-bind') + ', style: {width: sandboxWidth}')

  var resized = function(height) {
    if (height < 800) {
      $('.div_sandbox_dock').addClass('small_sandbox')
      iconSize(24)
    } else {
      $('.div_sandbox_dock').removeClass('small_sandbox')
      iconSize(36)
    }
  }

  api.Panel.query(api.Panel.parentId, 'panel.invoke', ['screenHeight'])
    .then(resized)

  handlers.screen_height = resized

  //model.sandbox_expanded(true)
})()
