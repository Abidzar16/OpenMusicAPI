/* eslint-disable max-lines-per-function */
const routes = (handler) => [
  {
    method: "POST",
    path: "/playlists",
    handler: handler.postPlaylistHandler,
    options: {
      auth: 'notesapp_jwt',
    },
  },
  {
    method: "GET",
    path: "/playlists",
    handler: handler.getPlaylistsHandler,
    options: {
      auth: 'notesapp_jwt',
    },
  },
  {
    method: "DELETE",
    path: "/playlists/{id}",
    handler: handler.deletePlaylistByIdHandler,
    options: {
      auth: 'notesapp_jwt',
    },
  },
  {
    method: "POST",
    path: "/playlists/{playlistId}/songs",
    handler: handler.postSongtoPlaylistHandler,
    options: {
      auth: 'notesapp_jwt',
    },
  },
  {
    method: "GET",
    path: "/playlists/{playlistId}/songs",
    handler: handler.getSongsFromPlaylistHandler,
    options: {
      auth: 'notesapp_jwt',
    },
  },
  {
    method: "DELETE",
    path: "/playlists/{playlistId}/songs",
    handler: handler.deleteSongsOnPlaylistByIdHandler,
    options: {
      auth: 'notesapp_jwt',
    },
  },
];

module.exports = routes;
