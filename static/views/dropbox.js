define(['jquery', 'underscore', 'backbone', 'bootbox', 'views/base', 'globals/eventbus', 'txt!views/dropbox.html', 'txt!views/loading.html', 'css!views/dropbox.css', 'dropbox'], 
function($, _, Backbone, bootbox, BaseView, EventBus, tmpl, loadingTmpl) {
  "use strict";

  console.log("DropboxView.");
  
  var DropboxFile = Backbone.Model.extend({
    name: '..',
    type: 'file'
  });
  
  var DropboxFiles = Backbone.Collection.extend({
    model: DropboxFile
  });
  
  var DropboxView = BaseView.extend({
    
    tageName: 'ul',
    location: [],
    
    deferred: undefined,
    client: undefined,
    mode: undefined,
    fileData: undefined,
    
    select: function ( name ) {
      console.log('DropboxView.select: ' + name);
      this.location.push( name );
      this.refresh();
    },
    
    read: function ( name ) {
      console.log('DropboxView.read: ' + name);
      this.renderAnimated(true);
      this.location.push( name );
      this.client.readFile( this.location.join('/'), _.bind(function (error, data) {
        this.deferred.resolve( data );
        this.hide();
      }, this) );
    },
    
    save: function () {
      console.log('DropboxView.save: ' + this.location.join('/'));
      
      bootbox.prompt('Filename (.txt)', _.bind( function (fileName) {
        if(fileName !== null) {
          var filePath = this.location.join('/') + '/' + fileName + '.txt';
          console.log('Saving to: ' + filePath);
          this.renderAnimated(true);
          this.client.writeFile(filePath, this.fileData, _.bind(function(error, stat) {
            if(error) {
              this.deferred.reject();
            } else {
              this.deferred.resolve( );
              this.hide();
            }
          }, this));
        }
      }, this));
    },
    
    back: function () {
      console.log('DropboxView.back');
      this.location.pop();
      this.refresh();
    },
    
    refresh: function () {
      console.log("DropboxView.refresh: " + this.location.join('/') );
      
      this.renderAnimated(true);
      
      this.client.readdir( this.location.join('/'), _.bind(function( error, entries, stat, entries_stat ) {
        console.log("DropboxView.refresh/readdir: '" + this.location.join('/') + "' isfile: " + stat.isFile + " error: " + error);
        if(error || stat.isFile) {
          this.deferred.reject();
        } else {
          console.log("DropboxView.refresh entries: " +  entries_stat.length );
          
          var files = [];
          
          if( this.location.length > 0) {
            files.push({name: '', type: 'back'});
          }
          
          if(this.mode == 'save') {
            files.push({name: 'Save file here', type: 'save'})
          }
          _.each( entries_stat, _.bind(function (item) {
            if(item.isFolder)
            {
              files.push({name: item.name, type: 'dir', mode: this.mode});
            } else {
              files.push({name: item.name, type: 'file', mode: this.mode});
            }
            console.log(item);
          }, this));
          
          this.collection = new DropboxFiles(files);
          this.renderAnimated();
        }
      }, this) );
    },
    
    renderAnimated: function (loading) {
      
      $(this.el).fadeOut('slow').promise().done(_.bind(function() {
        $(this.el).html('');
        
        if(loading) {
          this.$el.append( loadingTmpl );
        } else {
          this.collection.each( function(item) {
            var itemView = new DropboxItemView({model: item, parent: this });
            var renderHtml = itemView.render();
            this.$el.append(renderHtml);
          }, this);
        }
        
        $('#dropbox .modal-body').append( this.el );
        if(!loading) $('#dropbox').trigger("resize");
        
        $(this.el).fadeIn('slow').promise().done( function () {
          if(!loading) $('#dropbox').trigger("resize");
        });
        
      }, this));
    },
    
    render: function (loading) {
      $(this.el).html('');
      
      if(loading) {
        this.$el.append( loadingTmpl );
        
      } else {
        this.collection.each( function(item) {
          var itemView = new DropboxItemView({model: item, parent: this });
          var renderHtml = itemView.render();
          this.$el.append(renderHtml);
        }, this);
      }
      
      $('#dropbox .modal-body').append( this.el );
      $('#dropbox').trigger("resize");
    },
    
    show: function (client, deferred, mode, fileData) {
      console.log('DropboxView.show: ' + mode);
      
      this.client = client;
      this.deferred = deferred;
      this.mode = mode;
      this.fileData = fileData;
      
      $('#dropbox').modal( 'show' );
      
      this.refresh();
    },
    
    hide: function () {
      console.log('DropboxView.hide()');
      $('#dropbox').modal('hide');
    },
    
    reset: function () {
      console.log('DropboxView.reset()');
      this.location = [];
      this.deferred = undefined;
      this.client = undefined;
      this.mode = undefined;
    },

    initialize: function (options) {
      console.log('DropboxView()');
      BaseView.prototype.initialize.call(this, options);
      
      this.reset();
      
      // hide() triggers this, it should not call hide
      $('#dropbox').on('hide.bs.modal', _.bind(function (e) {
        console.log('DropboxView:onModalClose');
        $('#dropbox').off();
        this.destroy();
      },this) );
    },

    destroy: function () {
      console.log('DropboxView.destroy()');
      this.reset();
      BaseView.prototype.destroy.call(this);
    } 
  });

  var DropboxItemView = BaseView.extend({
    
    tagName: 'li',
    parent: undefined,
    template: _.template( tmpl ),

    events: {
      "click .dplink": "click"
    },

    click: function () {
      console.log('DropboxItemView.click()');
      if(this.model.get('type') == 'dir') {
        this.parent.select( this.model.get('name') );
      } else if(this.model.get('type') == 'file') {
        this.parent.read( this.model.get('name') );
      } else if(this.model.get('type') == 'back') {
        this.parent.back();
      } else if(this.model.get('type') == 'save') {
        this.parent.save();
      } else {
        console.error('Unknown DropboxItemView type: ' + this.model.get('type'));
      }
    },

    render: function () {
      this.$el.html( this.template( this.model.toJSON() ) );
      return this.el;
    },

    initialize: function (options) {
      //console.log('DropboxItemView()');
      this.parent = options.parent;
      BaseView.prototype.initialize.call(this, options);
    },

    destroy: function () {
      console.log('DropboxItemView.destroy()');
      BaseView.prototype.destroy.call(this);
    }
    
  });
  
  return DropboxView;

})
