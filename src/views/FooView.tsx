import * as React from "react";
import { RouteComponentProps } from "react-router";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/src/styles.scss";
import fs from "fs";
import { RefObject } from "react";

interface State {
  text: string;
}

export default class FooView extends React.Component<
  RouteComponentProps,
  State
> {
  fileRef: React.RefObject<HTMLInputElement>;
  interval: NodeJS.Timeout;
  _audioPlayer: RefObject<AudioPlayer>;

  constructor(props: RouteComponentProps) {
    super(props);
    this.state = {
      text: "Open a file to display content here",
    };
    this.fileRef = React.createRef<HTMLInputElement>();
    this.interval = setInterval(() => {
      console.log(this._audioPlayer.current?.audio.current?.currentTime);
    }, 50);
    this._audioPlayer = React.createRef<AudioPlayer>();
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  onGotoBarClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    console.log("Navigating to Bar view");
    this.props.history.push("/bar");
  };

  onOpenFileClick = () => {
    if (this.fileRef.current) {
      this.fileRef.current.click();
    }
  };

  onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let paths = e.currentTarget.files;

    if (!paths || paths.length < 1) {
      this.setState({ text: "Could not load files..." });
      return;
    }

    let filePath = paths[0].path;

    this.loadFileContentAsync(filePath)
      .then((fileContent) => this.setState({ text: fileContent }))
      .catch((err) => this.setState({ text: err.message }));
  };

  loadFileContentAsync = async (filePath: string): Promise<string> => {
    try {
      let content = await fs.promises.readFile(filePath, { encoding: "utf-8" });
      return content;
    } catch (error) {
      throw error;
    }
  };

  public render() {
    return (
      <div>
        <h3>Audio Player</h3>
        <AudioPlayer
          src="file:///C:/Users/Jakob Schubert/code/music_juggling/music_juggling/src/resources/audio/test_audio.mp3"
          ref={this._audioPlayer}
        />
        <p>{this.state.text}</p>

        <button onClick={this.onOpenFileClick}>Open file...</button>
        <input
          type="file"
          ref={this.fileRef}
          onChange={this.onFileInputChange}
          style={{ display: "none" }}
        />
        <button onClick={this.onGotoBarClick}>Go to Bar</button>
      </div>
    );
  }
}
