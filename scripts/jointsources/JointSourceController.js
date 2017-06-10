
var JointSourceController = SingleModelController.createComponent("JointSourceController");

JointSourceController.defineAlias("model", "jointSource");

// Model

JointSourceController.defineMethod("initModel", function initModel() {
  if (!this.model) return;

  this.jointSource.backup();
});

JointSourceController.defineMethod("uninitModel", function uninitModel() {
  if (!this.model) return;

  this.jointSource.recover();
  this.jointSource.didUpdate();
});

// View

JointSourceController.defineMethod("initView", function updateView() {
  if (!this.view) return;

  setElementProperty(this.view, "jointsource-id", this.jointSource.jointSourceId);
});

JointSourceController.defineMethod("uninitView", function initView() {
  if (!this.view) return;

  removeElementProperty(this.view, "jointsource-id");
});