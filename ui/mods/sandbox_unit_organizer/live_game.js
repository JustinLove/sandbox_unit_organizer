if (model['cheatAllowCreateUnit']) {
  model.sandbox(model.cheatAllowCreateUnit())
  model.cheatAllowCreateUnit.subscribe(model.sandbox)
}
