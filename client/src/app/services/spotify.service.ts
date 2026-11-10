import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { ArtistData } from '../data/artist-data';
import { AlbumData } from '../data/album-data';
import { TrackData } from '../data/track-data';
import { ResourceData } from '../data/resource-data';
import { ProfileData } from '../data/profile-data';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
	expressBaseUrl:string = 'http://127.0.0.1:8888';

  constructor(private http:HttpClient) { }

  private sendRequestToExpress(endpoint:string):Promise<any> {
    //TODO: use the injected http Service to make a get request to the Express endpoint and return the response.
    //Specifically, update the URI according to the base URL for express and the endpoint.
    var uri:string = this.expressBaseUrl + endpoint; // base + endpoint

    //firstValueFrom generates a Promise for whatever is returned first from the GET request.
    //You shouldn't need to update this part.
    return firstValueFrom(this.http.get(uri)).then((response) => {
      return response;
    }, (err) => {
      return err;
    });
  }

  aboutMe():Promise<ProfileData> {
    //This line is sending a request to express, which returns a promise with some data. We're then parsing the data 
    return this.sendRequestToExpress('/me').then((data) => {
      return new ProfileData(data);
    });
  }

  searchFor(category:string, resource:string):Promise<ResourceData[]> {
    // search -> typed array
    return this.sendRequestToExpress('/search/' + category + '/' + encodeURIComponent(resource)).then((data) => {
      switch(category) {
        case 'artist': return data['artists']['items'].map((a) => new ArtistData(a));
        case 'album': return data['albums']['items'].map((a) => new AlbumData(a));
        case 'track': return data['tracks']['items'].map((t) => new TrackData(t));
        default: return [];
      }
    });
  }

  getArtist(artistId:string):Promise<ArtistData> {
    // artist
    return this.sendRequestToExpress('/artist/' + encodeURIComponent(artistId)).then((data) => new ArtistData(data));
  }

  getTopTracksForArtist(artistId:string):Promise<TrackData[]> {
    // top tracks
    return this.sendRequestToExpress('/artist-top-tracks/' + encodeURIComponent(artistId)).then((data) => {
      return data['tracks'].map((t) => new TrackData(t));
    });
  }

  getAlbumsForArtist(artistId:string):Promise<AlbumData[]> {
    // artist albums
    return this.sendRequestToExpress('/artist-albums/' + encodeURIComponent(artistId)).then((data) => {
      return data['items'].map((a) => new AlbumData(a));
    });
  }

  getAlbum(albumId:string):Promise<AlbumData> {
    // album
    return this.sendRequestToExpress('/album/' + encodeURIComponent(albumId)).then((data) => new AlbumData(data));
  }

  getTracksForAlbum(albumId:string):Promise<TrackData[]> {
    // album tracks
    return this.sendRequestToExpress('/album-tracks/' + encodeURIComponent(albumId)).then((data) => {
      return data['items'].map((t) => new TrackData(t));
    });
  }

  getTrack(trackId:string):Promise<TrackData> {
    // track
    return this.sendRequestToExpress('/track/' + encodeURIComponent(trackId)).then((data) => new TrackData(data));
  }
}
