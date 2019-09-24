# Multitrack Player

http://dhulme.co.uk/multitrack-player

A multitrack audio file player for the browser.

Built using Vue, the Vuetify UI framework and peaks.js audio waveform library.

## Current features
🎚️ Unlimited number of audio tracks  
🕰️ Metronome/click  
🎛️ Customizable panning of click/tracks  
🔇 Solo/mute for all tracks  
🔊 Individual track and master gain control

## Known issues
- Not fully responsive on smaller displays
- Project icon needs updating
- High memory and usage and crashes with high numbers of tracks

## Possible future features
- Local 'projects' concept, to save and load sessions
- Support for multiple 'songs' and transitions between them
- Track pitch + tempo control
- Track grouping

### Proposed project file format
```js
{
	"name": String,
	"author": String,
	"songs": ????,
	"files": [{
		"name": String,
		"size": Number
	}]
}
```

## Local development setup

### Compiles and hot-reloads for development
`npm start` or `npm run server`

### Compiles and minifies for production
`npm run build`
