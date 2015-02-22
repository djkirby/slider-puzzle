var GameBoard = React.createClass({
  getInitialState: function() {
    return {
      tiles: [1, 2, 3, 4, 5, 6, 7, 8, null]
    }
  },
  attemptToMoveTile: function(tileId) {
    if (this.canMoveTile(tileId, 'LEFT')) {
      this.swapTiles(position, position - 1);
    } else if (this.canMoveTile(tileId, 'RIGHT')) {
      this.swapTiles(position, position + 1);
    } else if (this.canMoveTile(tileId, 'UP')) {
      this.swapTiles(position, position - 3);
    } else if (this.canMoveTile(tileId, 'DOWN')) {
      this.swapTiles(position, position + 3);
    }
  },
  canMoveTile: function(tileId, direction) {
    var position = this.state.tiles.indexOf(tileId);
    if (direction == 'LEFT') {
      return (position % 3 != 0 && !this.state.tiles[position - 1]);
    } else if (direction == 'RIGHT') {
      return ((position - 2) % 3 != 0 && !this.state.tiles[position + 1]);
    } else if (direction == 'UP') {
      return (position > 3 && !this.state.tiles[position - 3]);
    } else if (direction == 'DOWN') {
      return (position < 6 && !this.state.tiles[position + 3]);
    }
  },
  swapTiles: function(tilePosition, newPosition) {
    var tiles = this.state.tiles;
    var newTileId = tiles[newPosition];
    tiles[newPosition] = tiles[tilePosition];
    tiles[tilePosition] = newTileId;
    this.setState({ tiles: tiles });
  },
  handleClick: function(childComponent) {
    this.attemptToMoveTile(childComponent.props.id);
  },
  render: function() {
    var topRowTiles = this.state.tiles.slice(0, 3).map(function (tileId) {
      return (
        <Tile id={tileId} onClick={this.handleClick} />
      );
    }.bind(this));
    var middleRowTiles = this.state.tiles.slice(3, 6).map(function (tileId) {
      return (
        <Tile id={tileId} onClick={this.handleClick} />
      );
    }.bind(this));
    var bottomRowTiles = this.state.tiles.slice(6, 9).map(function (tileId) {
      return (
        <Tile id={tileId} onClick={this.handleClick} />
      );
    }.bind(this));
    return (
      <div>
        {topRowTiles}
        <br />
        {middleRowTiles}
        <br />
        {bottomRowTiles}
      </div>
    );
  }
});

var Tile = React.createClass({
  getDefaultProps: function() {
    return {
      id: ""
    }
  },
  handleClick: function() {
    this.props.onClick(this);
  },
  render: function() {
    var style = {
      height: "100px",
      width: "100px",
      display: "inline-block",
      textAlign: "center",
      border: this.props.id ? "1px solid" : "none"
    };
    return (
      <div onClick={this.handleClick} style={style}>
        {this.props.id || " "}
      </div>
    );
  }
});

React.render(
  <GameBoard />,
  document.getElementById("content")
);
