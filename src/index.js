import React from 'react'
import ReactDOM from 'react-dom'
import Granim from 'react-granim'
import './index.css'
import Header from './components/header/header'
import Droptarget from './components/droptarget/droptarget'
import Playlist from './components/playlist/playlist'
import Sidebar from './components/sidebar/sidebar'
import Player from './components/player/player'
import * as serviceWorker from './serviceWorker'

const granimColor = ({"default-state": {gradients: [['#FE802D', '#D04ED6'],['#D04ED6', '#FF9C3F']], transitionSpeed: 5000, loop: true}});
    
let videoOpts = {}

class Mainwrapper extends React.Component {
  constructor(props) {
    super(props)


    this.state = {
      videoList: [],
      activeVideo: ''
    }
  }

  playlistFn = (dataFromChild) => {
    this.setState({
      videoList: dataFromChild
    })
  }

  makeVisible = e => {
    const el = document.getElementById('dropTarget')
    el.style.visibility = 'visible'
  }

  onVideoEnd = e => {
    // next video
    this.startNextVideo()
  }

  startNextVideo = e => {
    console.log(e)
    let videoList = this.state.videoList
    if(videoList.length !== 0) {
      const videoUrl = videoList[0]
      const videoId = videoUrl.substring(videoUrl.indexOf('v=')+2,videoUrl.length)
      this.setState({ activeVideo: videoId })
      // TODO - remove video also from playlist state 
      const remainder = this.state.videoList.filter(video => video !== videoUrl)
      this.setState({ videoList: remainder })
    } else {
      alert('No Videos Lined-up!')
    }
  }


  handleFullscreen = e => {
    // console.log(e)
    if(videoOpts.fullscreen === 1) {
      videoOpts = {...videoOpts, 
        fullscreen: 0
      }
    } else {
      videoOpts = {...videoOpts, 
        fullscreen: 1
      }
    }
  }

  handleAutoplay = e => {
    console.log(e)
  }

  render() {
    return (
      <div 
        onDragOver={this.makeVisible} 
        className="container">
      <Droptarget  
        callbackFromParent={this.playlistFn} />
        <Header />
        <Sidebar 
          handleFullscreen={this.handleFullscreen} 
          handleAutoplay={this.handleAutoplay} 
          onPlayClick={this.startNextVideo}  
          videos={this.state.videoList} />
        <Player 
          videoId={this.state.activeVideo} 
          onEnd={this.onVideoEnd} 
          videoOpts={videoOpts} />
        <div 
          id="playlist" 
          className="item footer playlist" >
          <Playlist 
            videoListP={this.state.videoList} />
        </div>      
        <Granim 
          className="granim" 
          states={granimColor} />
      </div>
    )
  }
}

ReactDOM.render(
  <Mainwrapper />, 
  document.getElementById('root')
)

serviceWorker.unregister()
