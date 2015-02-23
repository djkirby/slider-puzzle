var TileGame = React.createClass({
  getInitialState: function() {
    return {
      tiles: [1, 2, 3, 4, 5, 6, 7, 8, null]
    }
  },
  attemptToMoveTile: function(position) {
    if (position % 3 != 0 && !this.state.tiles[position - 1]) {
      this.swapTiles(position, position - 1);
    } else if ((position - 2) % 3 != 0 && !this.state.tiles[position + 1]) {
      this.swapTiles(position, position + 1);
    } else if (position > 2 && !this.state.tiles[position - 3]) {
      this.swapTiles(position, position - 3);
    } else if (position < 6 && !this.state.tiles[position + 3]) {
      this.swapTiles(position, position + 3);
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
    this.attemptToMoveTile(this.state.tiles.indexOf(childComponent.props.id));
    this.checkCompletion();
  },
  checkCompletion: function() {
    if (_.isEqual(this.state.tiles, this.getInitialState().tiles)) {
      alert('Winner!');
    }
  },
  shuffleTiles: function() {
    this.setState(this.getInitialState());
    for (i = 0; i < 200; i++) {
      var emptyPosition = this.state.tiles.indexOf(null);
      possibleMoves = [];
      if ((emptyPosition - 2) % 3 != 0) {
        possibleMoves.push(emptyPosition + 1);
      }
      if (emptyPosition % 3 != 0) {
        possibleMoves.push(emptyPosition - 1);
      }
      if (emptyPosition > 3) {
        possibleMoves.push(emptyPosition - 3);
      }
      if (emptyPosition < 6) {
        possibleMoves.push(emptyPosition + 3);
      }
      this.attemptToMoveTile(possibleMoves[Math.floor(Math.random() * possibleMoves.length)]);
    }
  },
  render: function() {
    var tileNodes = this.state.tiles.map(function (tileId) {
      return (
        <Tile id={tileId} onClick={this.handleClick} />
      );
    }.bind(this));
    tileNodes.splice(3, 0, <br />);
    tileNodes.splice(7, 0, <br />);
    var style = {
      width: "306px",
      border: "3px solid"
    }
    return (
      <div>
        <div style={style}>
          {tileNodes}
        </div>
        <br />
        <button type="button" onClick={this.shuffleTiles}>Shuffle</button>
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
      height: 100,
      width: 100,
      lineHeight: 3,
      verticalAlign: "middle",
      fontSize: 32,
      fontWeight: "bold",
      display: "inline-block",
      textAlign: "center",
      border: "1px solid"
    };
    return (
      <div onClick={this.handleClick} style={style}>
        {this.props.id || " "}
      </div>
    );
  }
});

React.render(
  <TileGame />,
  document.getElementById("content")
);