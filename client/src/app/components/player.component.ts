import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Song } from '../models/song';
import { GLOBAL } from '../services/global';

@Component({
  selector: 'player',
  templateUrl: '../views/player.html',
  providers : [ ]
})

export class PlayerComponent implements OnInit {
	public url : string;
	public song : Song;

	constructor() {
		this.url = GLOBAL.url;
		this.song = new Song(0,'','','','');
	}

	ngOnInit() {
		var soundSongJSON = localStorage.getItem('soundSong');
		if (soundSongJSON) {
			var soundSong = JSON.parse(soundSongJSON);
			this.song = soundSong;
		}
	}
}