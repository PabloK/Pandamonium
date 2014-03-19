(function() {
    PIXI.SpriteAnimation = function(texture, frames, rows, frametime, loop) {
        PIXI.Sprite.call(this, texture);
        
        this._stop = true;
        this._texture = new PIXI.Texture(texture);
        this.frameTime = frametime;
        this.loop = loop || true;
        this.curX = 0;
        this.curY = 0;
        this.fh = this._texture.height / rows;
        this.fw = this._texture.width / frames;
        this.ticks = 0;
        this.maxFrames = frames;
        this.maxRows = rows;
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
        
        if(!this._stop) {
          this.ticks += 1;
        }

        if (this.done == false) {
            if (this.ticks >= this.frameTime) {
                this.curX++;
                this.ticks = 0;

                if (this.curX == this.maxFrames) {
                    this.curX = 0;

                    this.curY++;

                    if (this.curY == this.maxRows) {
                        this.curY = 0;

                        if (!this.loop)
                            this.done = true;
                    }
                }

                this.calculateFrame();
            }
        }
    };

    PIXI.SpriteAnimation.prototype.goto = function(frame, row) {
        this.curX = frame;
        this.curY = row || 0;
    };
  
    PIXI.SpriteAnimation.prototype.stop = function() {
        this._stop = true;
    };
  
    PIXI.SpriteAnimation.prototype.play = function() {
        this._stop = false;
    };

    PIXI.SpriteAnimation.prototype.calculateFrame = function() {
        this.texture.frame.x = this.curX * this.fw;
        this.texture.frame.y = this.curY * this.fh;
        this.texture.frame.width = this.fw;
        this.texture.frame.height = this.fh;
        this.texture.setFrame(this.texture.frame);
    };

}).call(this);

/////////////////////////////////////////////////////////////////////////////
/// Tiling Sprite Animation
/////////////////////////////////////////////////////////////////////////////
(function() {
    PIXI.TilingSpriteAnimation = function(texture, frames, rows, frametime, loop)  {
          PIXI.TilingSprite.call(
            this, texture,
            VIEWPORTWIDTH,
            this._texture.baseTexture.height);
        
        this._stop = true;
        this._texture = new PIXI.Texture(texture);
        this.frameTime = frametime;
        this.loop = loop || true;
        this.curX = 0;
        this.curY = 0;
        this.fh = this._texture.height / rows;
        this.fw = this._texture.width / frames;
        this.ticks = 0;
        this.maxFrames = frames;
        this.maxRows = rows;
        this.done = false;

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
        
        console.log(this.ticks);
        if(!this._stop) {
          this.ticks += 1;
        }

        if (this.done == false) {
            if (this.ticks >= this.frameTime) {
                this.curX++;
                this.ticks = 0;

                if (this.curX == this.maxFrames) {
                    this.curX = 0;

                    this.curY++;

                    if (this.curY == this.maxRows) {
                        this.curY = 0;

                        if (!this.loop)
                            this.done = true;
                    }
                }
                this.calculateFrame();
            }
        }
    };

    PIXI.TilingSpriteAnimation.prototype.goto = function(frame, row) {
        this.curX = frame;
        this.curY = row || 0;
    };
  
    PIXI.TilingSpriteAnimation.prototype.stop = function() {
        this._stop = true;
    };
  
    PIXI.TilingSpriteAnimation.prototype.play = function() {
        this._stop = false;
    };

    PIXI.TilingSpriteAnimation.prototype.calculateFrame = function() {
        this.texture.frame.x = this.curX * this.fw;
        this.texture.frame.y = this.curY * this.fh;
        this.texture.frame.width = this.fw;
        this.texture.frame.height = this.fh;
        this.texture.setFrame(this.texture.frame);
        this.generateTilingTexture(this.texture);
    };

}).call(this);