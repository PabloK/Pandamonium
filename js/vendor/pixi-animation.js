(function() {
    PIXI.SpriteAnimation = function(texture, frames, frametime, loop) {
        PIXI.Sprite.call(this, texture);
        
        this._stop = true;
        this._texture = new PIXI.Texture(texture);
        this.frameTime = frametime;
        this.loop = loop || true;
        this.curX = 0;
        this.curY = 0;
        this.fh = this._texture.height ;
        this.fw = this._texture.width / frames;
        this.ticks = 0;
        this.maxFrames = frames;
        this.done = false;

        this.calculateFrame();
    };

    PIXI.SpriteAnimation.prototype = Object.create( PIXI.Sprite.prototype );
    PIXI.SpriteAnimation.prototype.constructor = PIXI.SpriteAnimation;

    Object.defineProperty(PIXI.SpriteAnimation.prototype, 'texture', {
        get: function() {
            return this._texture;
        }
    });

    PIXI.SpriteAnimation.prototype.update = function() {

        if (this._stop == false) {
          this.ticks += 1;
            if (this.ticks >= this.frameTime) {
                this.curX++;
                this.ticks = 0;

                if (this.curX == this.maxFrames) {
                    this.curX = 0;
                  
                        if (!this.loop) { 
                          this._stop = true;
                        }
                }

                this.calculateFrame();
            }
        }
    };

    PIXI.SpriteAnimation.prototype.goto = function(frame) {
        this.curX = frame;
    };
  
    PIXI.SpriteAnimation.prototype.stop = function() {
        this._stop = true;
    };
  
    PIXI.SpriteAnimation.prototype.play = function() {
        this._stop = false;
    };

    PIXI.SpriteAnimation.prototype.calculateFrame = function() {
        this.texture.frame.x = this.curX * this.fw;
        this.texture.frame.y = 0;
        this.texture.frame.width = this.fw;
        this.texture.frame.height = this.fh;
        this.texture.setFrame(this.texture.frame);
    };

}).call(this);

/////////////////////////////////////////////////////////////////////////////
/// Tiling Sprite Animation
/////////////////////////////////////////////////////////////////////////////
(function() {
    PIXI.TilingSpriteAnimation = function(texture, frames, frametime, loop)  {
          PIXI.TilingSprite.call(
            this, texture,
            VIEWPORTWIDTH,
            VIEWPORTHEIGHT);
        
        this._stop = true;
        this._texture = new PIXI.Texture(texture);
        this.frameTime = frametime;
        this.loop = loop || true;
        this.curX = 0;
        this.fh = this._texture.height;
        this.fw = this._texture.width / frames;
        this.ticks = 0;
        this.maxFrames = frames;
      
        for (var i=0;i<frames;i++){
          this.preLoadFrame(i);
        }
      
        this.calculateFrame();
    };

    PIXI.TilingSpriteAnimation.prototype = Object.create( PIXI.TilingSprite.prototype );
    PIXI.TilingSpriteAnimation.prototype.constructor = PIXI.TilingSpriteAnimation;

    Object.defineProperty(PIXI.TilingSpriteAnimation.prototype, 'texture', {
        get: function() {
            return this._texture;
        }
    });

    PIXI.TilingSpriteAnimation.prototype.update = function() {

        if (this._stop == false) {
            this.ticks += 1;
            if (this.ticks >= this.frameTime) {
                this.curX++;
                this.ticks = 0;

                if (this.curX == this.maxFrames) {
                    this.curX = 0;

                    if (!this.loop) {
                        this._stop = true;
                    }
                }
                this.calculateFrame();
            }
        }
    };

    PIXI.TilingSpriteAnimation.prototype.goto = function(frame) {
        this.curX = frame;
    };
  
    PIXI.TilingSpriteAnimation.prototype.stop = function() {
        this._stop = true;
    };
  
    PIXI.TilingSpriteAnimation.prototype.play = function() {
        this._stop = false;
    };

    PIXI.TilingSpriteAnimation.prototype.calculateFrame = function() {
      this.tilingTexture = PIXI.Texture.fromFrame( this.texture.baseTexture.source + this.curX);
    };
  
    PIXI.TilingSpriteAnimation.prototype.preLoadFrame = function(frame) {
        var text = new PIXI.TilingSprite(this.texture);
        text.texture.frame.x = frame * this.fw;
        text.texture.frame.y = 0;
        text.texture.frame.width = this.fw;
        text.texture.frame.height = this.fh;
        text.texture.setFrame(text.texture.frame);  
        text.generateTilingTexture(text);
        
        PIXI.Texture.addTextureToCache(text.tilingTexture, text.texture.baseTexture.source + frame)
    };
}).call(this);