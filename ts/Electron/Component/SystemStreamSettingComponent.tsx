import * as React from "react";
import ReactDOM from "react-dom";
import SystemStreamEmitter from "../SystemStreamEmitter";
import SystemStreamCenter from "../SystemStreamCenter";

export default class SystemStreamSettingComponent extends React.Component {
  constructor(props) {
    super(props);
    this._systemStreamListenerIds = [];
    this._stream = null;
    this.state = { queries: [] };
    this._originalHeight = null;
  }

  componentDidMount() {
    {
      let id;
      id = SystemStreamEmitter.addOpenStreamSettingListener(
        this._show.bind(this)
      );
      this._systemStreamListenerIds.push(id);
    }

    const dialog = ReactDOM.findDOMNode(this);
    this._originalHeight = window.getComputedStyle(dialog).height;
    dialog.addEventListener("close", ev => {
      SystemStreamEmitter.emitCloseStreamSetting(this._stream);
    });
  }

  componentWillUnmount() {
    SystemStreamEmitter.removeListeners(this._systemStreamListenerIds);
  }

  _show(stream) {
    this._stream = stream;
    const dialog = ReactDOM.findDOMNode(this);
    dialog.querySelector("#nameInput").value = stream.name;
    dialog.querySelector("#enabledInput").checked = stream.enabled === 1;
    dialog.querySelector("#notificationInput").checked =
      stream.notification === 1;

    const queries = SystemStreamCenter.getStreamQueries(stream.id);
    if (queries.length === 0) queries.push("");
    this.setState({ queries });
    this._updateHeight(queries.length);
    dialog.showModal();
  }

  _updateHeight(queryCount) {
    const dialog = ReactDOM.findDOMNode(this);
    const addHeight = Math.max(36 * (queryCount - 1), 0); // 36px is height of query input
    dialog.style.height = `calc(${this._originalHeight} + ${addHeight}px)`;
  }

  _handleCancel() {
    this.setState({ queries: [] });
    const dialog = ReactDOM.findDOMNode(this);
    dialog.close();
  }

  async _handleOK() {
    this.setState({ queries: [] });
    const enabled = ReactDOM.findDOMNode(this).querySelector("#enabledInput")
      .checked
      ? 1
      : 0;
    const notification = ReactDOM.findDOMNode(this).querySelector(
      "#notificationInput"
    ).checked
      ? 1
      : 0;
    const dialog = ReactDOM.findDOMNode(this);
    dialog.close();
    await SystemStreamCenter.rewriteStream(
      this._stream.id,
      enabled,
      notification
    );
  }

  render() {
    const queryNodes = this.state.queries.map((query, index) => {
      return (
        <input
          key={index}
          className="form-control"
          readOnly
          defaultValue={query}
        />
      );
    });

    return (
      <dialog className="stream-setting system-stream-setting">
        <div className="window">
          <div className="window-content">
            <div>
              <div className="form-group">
                <label>Name</label>
                <input
                  id="nameInput"
                  className="form-control"
                  placeholder="stream name"
                  readOnly
                />
              </div>

              <div className="form-group">
                <label>
                  <input type="checkbox" id="enabledInput" /> Enabled
                </label>
              </div>

              <div className="form-group">
                <label>
                  <input type="checkbox" id="notificationInput" /> Notification
                </label>
              </div>

              <div className="form-group queries" id="queries">
                <label>Query</label>
                {queryNodes}
              </div>

              <div className="form-actions">
                <button
                  className="btn btn-form btn-default"
                  onClick={this._handleCancel.bind(this)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-form btn-primary"
                  onClick={this._handleOK.bind(this)}
                >
                  OK
                </button>
              </div>
            </div>
          </div>

          <footer className="toolbar toolbar-footer" />
        </div>
      </dialog>
    );
  }
}
