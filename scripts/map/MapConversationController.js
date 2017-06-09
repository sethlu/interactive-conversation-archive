
var MapConversationController = ConversationController.createComponent("MapConversationController");

MapConversationController.createViewFragment = function () {
  return cloneTemplate("#template-map-conversation");
};

// View

MapConversationController.defineMethod("initView", function initView() {
  if (!this.view) return;

  this.view.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
  }.bind(this.view));

  this.view.querySelector("[data-ica-action='edit-conversation']").addEventListener("click", function (e) {
    e.preventDefault();
    this.controller.displayPublisherConversationView();
  }.bind(this.view));

  var sourcesElement = this.view.querySelector(".sources");
  var sourceElement = sourcesElement.querySelector(".source");

  var sourceElementUpdated = function () {
    for (var sourceIndex in this.children) {
      if (sourceElement == this.children[sourceIndex]) {
        this.parentNode.parentNode.querySelector("[data-ica-conversation-source-index]").textContent = parseInt(sourceIndex) + 1;
        break;
      }
    }
    this.parentNode.parentNode.querySelector("[data-ica-action='previous-source']").style.opacity = sourceElement.previousElementSibling ? 1 : 0;
    this.parentNode.parentNode.querySelector("[data-ica-action='next-source']").style.opacity = sourceElement.nextElementSibling ? 1 : 0;
  }.bind(sourcesElement);
  this.sourceElementUpdated = sourceElementUpdated;

  this.view.querySelector("[data-ica-action='previous-source']").addEventListener("click", function (e) {
    e.preventDefault();

    if (sourceElement.previousElementSibling) {
      sourceElement.style.display = "none";
      sourceElement = sourceElement.previousElementSibling;
      sourceElement.style.display = "";
      sourceElementUpdated();
    }
  }.bind(sourcesElement));

  this.view.querySelector("[data-ica-action='next-source']").addEventListener("click", function (e) {
    e.preventDefault();

    if (sourceElement.nextElementSibling) {
      sourceElement.style.display = "none";
      sourceElement = sourceElement.nextElementSibling;
      sourceElement.style.display = "";
      sourceElementUpdated();
    }
  }.bind(sourcesElement));

  // Tokens

  new TokensController(this.conversation.metaParticipantsHandler, this.view.querySelector("[data-ica-conversation-meta='participants']")).componentOf = this;
  new TokensController(this.conversation.metaThemesHandler, this.view.querySelector("[data-ica-conversation-meta='themes']")).componentOf = this;

});

MapConversationController.defineMethod("updateView", function updateView() {
  if (!this.view) return;

  this.view.querySelectorAll("[data-ica-conversation-meta-predicate]").forEach(function (element) {
    var metaPredicate = getElementProperty(element, "conversation-meta-predicate");
    if (ICA.empty(this.conversation.meta[metaPredicate])) {
      element.style.display = "none";
    } else {
      element.style.display = "";
    }
  }.bind(this));

  this.view.querySelectorAll("[data-ica-conversation-meta]").forEach(function (element) {
    element.textContent = this.conversation.meta[getElementProperty(element, "conversation-meta")];
  }.bind(this));

  this.view.querySelector(".conversation-backdrop").hidden = true;
  var imageSources = this.conversation.imageSources;
  if (imageSources.length > 0) {
    var imageSource = imageSources[0];

    if (imageSource.content) {
      this.view.querySelector(".conversation-backdrop").hidden = false;
      var img = this.view.querySelector(".conversation-backdrop-image");
      img.style.backgroundImage = imageSource.content
        ? "url(" + (
          imageSource.fileHandler.blob instanceof Blob
            ? imageSource.fileHandler.url
            : imageSource.fileHandler.url + "?width=" + (img.offsetWidth * this.devicePixelRatio)
          ) + ")"
        : "";
    }
  }

  this.conversation.forEachSource(function (source) {
    if (this.querySelector("[data-ica-source-id='{0}']".format(source.sourceId))) return;

    var fragment, element;
    switch (source.constructor) {
    case ImageSource:
      fragment = MapConversationImageSourceController.createViewFragment();
      element = fragment.querySelector(".source");
      this.querySelector(".sources").appendChild(fragment);
      new MapConversationImageSourceController(source, element).componentOf = this.controller;
      break;
    case AudioSource:
      fragment = MapConversationAudioSourceController.createViewFragment();
      element = fragment.querySelector(".source");
      this.querySelector(".sources").appendChild(fragment);
      new MapConversationAudioSourceController(source, element).componentOf = this.controller;
      break;
    case VideoSource:
      fragment = MapConversationVideoSourceController.createViewFragment();
      element = fragment.querySelector(".source");
      this.querySelector(".sources").appendChild(fragment);
      new MapConversationVideoSourceController(source, element).componentOf = this.controller;
      break;
    case TextSource:
    default:
      fragment = MapConversationTextSourceController.createViewFragment();
      element = fragment.querySelector(".source");
      this.querySelector(".sources").appendChild(fragment);
      new MapConversationTextSourceController(source, element).componentOf = this.controller;
    }

    element.style.display = "none";
  }.bind(this.view));

  this.sourceElementUpdated();
  this.view.querySelector("[data-ica-conversation-number-of-sources]").textContent = this.conversation.getNumberOfSources() + 1;

});

MapConversationController.prototype.displayPublisherConversationView = function () {
  var fragment = PublisherConversationController.createViewFragment();
  var element = fragment.querySelector(".publisher");
  document.body.appendChild(fragment);
  new PublisherConversationController(this.conversation, element);
};