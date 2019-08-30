## 1.7.2

- Account for unit row/column information and wider columns circa 113565

## 1.7.1

- Comatability circa 113034
- Remove sandbox visibiltiy code, included in base game

## 1.7.0

- model.sandboxGrid() returns {columns: n, cells: []} in order to introspect on the current layout

## 1.6.0

- Add unknown tabs
- Expose baseGroups, mobileGroups, and miscUnits on model for mod extensions

## 1.5.0

- Add Squall (drone) to misc units

## 1.4.1

- Tweak box size to work with scaled UI

## 1.4.0

- Remove empty columns
- Collect units from single-item rows at the bottom

## 1.3.2

- Minimal fix for 86422 (titans)
  - Build object changed
  - Use method for icon path
  - Add `orbital_structure` tab

## 1.3.1

- Correctly apply size adjustments for usual case of manually opening box.

## 1.3.0

- Smaller icons for small displays

## 1.2.0

- Attempt to guess non-standard grid sizes (e.g. ModX)
- Remove double load of build positions

## 1.1.2

- Update build number (Thanks ViolentMind)
- Remove debugging log statement

## 1.1.1

- Activate ui based on sandbox game option

## 1.1.0

- Move the avatars into the misc section to avoid overlaps
- Add readme
