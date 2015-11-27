# Sandbox Unit Organizer

Puts the sandbox unit toolbox in order, and removes most not-normally-buildable units.

Incorporates Sandbox Unit Toolbox in that it activates when the sandbox game option is on.

## Major Server Mods

New build tabs will be included, but may not be be in a good layout.

If the layout doesn't work, you may include a `live_game_sandbox` mod. Three observable arrays are published on model:

- model.baseGroups (right side)
- model.mobileGroups (left side)
- model.miscUnits (singletons, commanders, and avatars)

So if you mod introduces a new unit type with a factory only buildable by a special commander:

    if (model.mobileGroups) {
      model.mobileGroups.push('laser_sharks')
    }
    if (model.miscUnits) {
      model.miscUnits.push('/pa/units/commanders/laser_shark_commander/laser_shark_commander.json')
    }

Additionally, model.sandboxGrid() returns {columns: n, cells: []} for introspecting on the sandbox layout.
