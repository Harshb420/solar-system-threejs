define(
[
    'jquery',
    'underscore',
    'backbone',
    'Modules/TemplateLoader',
    'Controllers/TravelController',
],
function($, _, Backbone, TemplateLoader, TravelController) {

  return Backbone.View.extend({
    events: {
      'mouseenter a[data-id]': 'highlightObject',
      'mouseleave a[data-id]': 'unhighlightObject',
      'click a[data-id]': 'onClick'
    },

    initialize: function(options) {
      this.scene = options.scene || null;
      this.data = options.data || {};
      this.sceneObjects = options.sceneObjects || [];
      this.currentTarget = null;
      this.travelController = new TravelController(this.scene);
    },

    onClick: function(e) {
      var target = this.matchTarget(e.currentTarget.dataset.id);

      console.debug('Target', target);

      if (this.currentTarget && _.isEqual(this.currentTarget.id, target.id)) {
        return false;
      }

      $(e.currentTarget).addClass('active');

      this.travelToObject(target);
    },

    travelToObject: function(target) {
      console.debug('Target', target);

      // Return old target to default orbit line color
      if (this.currentTarget) {
        this.currentTarget.orbitLine.orbit.material.color = new THREE.Color('#3d3d3d');
      }

      // Change new target orbit line color
      target.orbitLine.orbit.material.color = new THREE.Color('#aaaaaa');
      target.orbitLine.orbit.material.needsUpdate = true;

      this.currentTarget = target;
      this.travelController.travelToObject(this.scene.camera.parent.position, this.currentTarget);
    },

    matchTarget: function(id) {
      var target = null;

      for (var i = 0; i < this.sceneObjects.length; i++) {
        if (this.sceneObjects[i].id == id) {
          return this.sceneObjects[i];
        }
      }

      return target;
    },

    highlightObject: function(e) {
      var target = this.matchTarget(e.currentTarget.dataset.id);

      if (this.currentTarget && _.isEqual(this.currentTarget.id, target.id)) {
        return;
      }

      if (target.highlight) {
        target.highlight.material.color = new THREE.Color('#00ff48');
      }

      target.orbitLine.orbit.material.color = new THREE.Color(target.orbitColor);
      target.orbitLine.orbit.material.needsUpdate = true;
    },

    unhighlightObject: function(e) {
      var target = this.matchTarget(e.currentTarget.dataset.id);

      if (this.currentTarget && _.isEqual(this.currentTarget, target)) {
        return;
      }

      if (target.highlight) {
        target.highlight.material.color = new THREE.Color('#000000');
      }

      target.orbitLine.orbit.material.color = new THREE.Color(target.orbitColorDefault);
      target.orbitLine.orbit.material.needsUpdate = true;
    }
  });
});
